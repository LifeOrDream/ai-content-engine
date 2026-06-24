import "server-only";
import fs from "node:fs";
import path from "node:path";
import { spawn, type ChildProcess } from "node:child_process";
import { OUT_DIR, PASS_IDS, REPO_ROOT, blueprintById } from "./contentEngine";

export type JobStatus = "running" | "success" | "failed" | "killed";
export type JobType = "script" | "render" | "replay";

export interface WebJob {
  id: string;
  blueprintId: string;
  jobType: JobType;
  command: string[];
  status: JobStatus;
  pid?: number;
  startedAt: string;
  endedAt?: string;
  exitCode?: number | null;
  signal?: string | null;
  logs: string[];
}

export interface PublicJob extends Omit<WebJob, "logs"> {
  logTail: string[];
}

type Store = {
  jobs: Map<string, WebJob>;
  children: Map<string, ChildProcess>;
  /** In-memory only (NEVER persisted): per-job secrets to mask out of logs. */
  redactions: Map<string, string>;
};

const JOBS_DIR = path.join(OUT_DIR, ".webui-jobs");
const JOBS_FILE = path.join(JOBS_DIR, "jobs.json");

function loadPersistedJobs(): Map<string, WebJob> {
  try {
    const raw = JSON.parse(fs.readFileSync(JOBS_FILE, "utf8")) as WebJob[];
    const jobs = new Map<string, WebJob>();
    for (const job of raw) {
      const next: WebJob = {
        ...job,
        jobType: job.jobType || "script",
        status: job.status === "running" ? "failed" : job.status,
        endedAt: job.status === "running" ? job.endedAt || new Date().toISOString() : job.endedAt,
        logs: Array.isArray(job.logs) ? job.logs.slice(-2500) : [],
      };
      if (job.status === "running") next.logs.push("WebUI restarted before this job finished; marking as failed locally.");
      jobs.set(next.id, next);
    }
    return jobs;
  } catch {
    return new Map();
  }
}

const globalForJobs = globalThis as typeof globalThis & {
  __minebtcWebuiJobs?: Store;
};

const store: Store = globalForJobs.__minebtcWebuiJobs || {
  jobs: loadPersistedJobs(),
  children: new Map<string, ChildProcess>(),
  redactions: new Map<string, string>(),
};

globalForJobs.__minebtcWebuiJobs = store;

function persistJobs(): void {
  fs.mkdirSync(JOBS_DIR, { recursive: true });
  fs.writeFileSync(
    JOBS_FILE,
    JSON.stringify(Array.from(store.jobs.values()).map((job) => ({ ...job, logs: job.logs.slice(-2500) })), null, 2) + "\n",
    "utf8",
  );
}

export function summarizeJob(job: WebJob): PublicJob {
  const { logs, ...rest } = job;
  return {
    ...rest,
    logTail: logs.slice(-80),
  };
}

export function listJobs(): PublicJob[] {
  return Array.from(store.jobs.values()).map(summarizeJob).reverse();
}

export function activeJobsByBlueprint(): Map<string, string[]> {
  const active = new Map<string, string[]>();
  for (const job of store.jobs.values()) {
    if (job.status !== "running") continue;
    const bucket = active.get(job.blueprintId) || [];
    bucket.push(job.id);
    active.set(job.blueprintId, bucket);
  }
  return active;
}

export function getJobWithLogs(id: string): { job: PublicJob; logs: string[] } | null {
  const job = store.jobs.get(id);
  if (!job) return null;
  return { job: summarizeJob(job), logs: job.logs };
}

function pushLog(job: WebJob, chunk: Buffer | string): void {
  const text = Buffer.isBuffer(chunk) ? chunk.toString("utf8") : chunk;
  const secret = store.redactions.get(job.id);
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    // Defensive: a user fal key is passed via env (never argv/logged), but mask
    // it here too so a stray echo can never reach jobs.json on disk.
    job.logs.push(secret ? line.split(secret).join("***") : line);
  }
  if (job.logs.length > 2500) job.logs.splice(0, job.logs.length - 2500);
  persistJobs();
}

function startChildJob(
  job: WebJob,
  args: string[],
  opts: { extraEnv?: Record<string, string>; redact?: string } = {},
): PublicJob {
  store.jobs.set(job.id, job);
  // Stash the secret in memory only (never persisted) so pushLog can mask it.
  if (opts.redact) store.redactions.set(job.id, opts.redact);
  persistJobs();

  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const child = spawn(npmCommand, args, {
    cwd: REPO_ROOT,
    env: opts.extraEnv ? { ...process.env, ...opts.extraEnv } : process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  job.pid = child.pid;
  persistJobs();
  store.children.set(job.id, child);

  child.stdout?.on("data", (chunk) => pushLog(job, chunk));
  child.stderr?.on("data", (chunk) => pushLog(job, chunk));
  child.on("error", (error) => {
    job.status = "failed";
    job.endedAt = new Date().toISOString();
    pushLog(job, `spawn error: ${error.message}`);
    store.children.delete(job.id);
    persistJobs();
  });
  child.on("exit", (code, signal) => {
    if (job.status !== "killed") job.status = code === 0 ? "success" : "failed";
    job.exitCode = code;
    job.signal = signal;
    job.endedAt = new Date().toISOString();
    store.children.delete(job.id);
    persistJobs();
  });

  return summarizeJob(job);
}

export function startScriptJob(input: {
  blueprintId: string;
  only?: string;
  from?: number;
  to?: number;
}): PublicJob {
  const requested = String(input.blueprintId || "").trim();
  const blueprint = blueprintById(requested);
  if (!blueprint) throw new Error(`Unknown blueprint: ${requested}`);

  const args = ["run", "trailer:script", "--", blueprint.id];
  if (input.only && PASS_IDS.includes(input.only as any)) {
    args.push("--only", input.only);
  } else {
    if (Number.isFinite(input.from)) args.push("--from", String(input.from));
    if (Number.isFinite(input.to)) args.push("--to", String(input.to));
  }

  return startChildJob({
    id: `${blueprint.id}-script-${Date.now().toString(36)}`,
    blueprintId: blueprint.id,
    jobType: "script",
    command: ["npm", ...args],
    status: "running",
    startedAt: new Date().toISOString(),
    logs: [],
  }, args);
}

export function startRenderJob(input: {
  blueprintId: string;
  from?: number;
  only?: number;
  regen?: boolean;
  assemble?: boolean;
}): PublicJob {
  const requested = String(input.blueprintId || "").trim();
  const blueprint = blueprintById(requested);
  if (!blueprint) throw new Error(`Unknown blueprint: ${requested}`);

  const args = ["run", "trailer:generate", "--", blueprint.id];
  if (Number.isFinite(input.from)) args.push("--from", String(input.from));
  if (Number.isFinite(input.only)) args.push("--only", String(input.only));
  if (input.regen) args.push("--regen");
  if (input.assemble === false) args.push("--no-assemble");

  return startChildJob({
    id: `${blueprint.id}-render-${Date.now().toString(36)}`,
    blueprintId: blueprint.id,
    jobType: "render",
    command: ["npm", ...args],
    status: "running",
    startedAt: new Date().toISOString(),
    logs: [],
  }, args);
}

export function startReplayJob(input: {
  warId: number;
  mode: "full" | "render-only";
  fromVersion?: string;
  /** Operator's own fal key — passed via child env ONLY, never argv/logs/disk. */
  apiKey?: string;
}): PublicJob {
  const warId = Number(input.warId);
  if (!Number.isInteger(warId) || warId < 0) throw new Error(`Bad warId: ${input.warId}`);
  const mode = input.mode === "render-only" ? "render-only" : "full";

  const args = ["run", "chapter:replay", "--", String(warId), "--mode", mode];
  if (mode === "render-only" && input.fromVersion) {
    // Version dir names are "<iso-with-dashes>-<gitsha>" — allow that charset only.
    if (!/^[0-9A-Za-z._-]{1,80}$/.test(input.fromVersion)) throw new Error("Bad version id");
    args.push("--from", input.fromVersion);
  }

  const apiKey = String(input.apiKey || "").trim();
  const extraEnv: Record<string, string> | undefined = apiKey
    ? { FAL_API_KEY: apiKey, CHAPTER_KEY_SOURCE: "user" }
    : undefined;

  return startChildJob(
    {
      id: `chapter-${warId}-replay-${Date.now().toString(36)}`,
      blueprintId: `chapter-${warId}`,
      jobType: "replay",
      command: ["npm", ...args], // NOTE: key is in env, not here
      status: "running",
      startedAt: new Date().toISOString(),
      logs: [],
    },
    args,
    { extraEnv, redact: apiKey || undefined },
  );
}

export function killJob(id: string): PublicJob | null {
  const job = store.jobs.get(id);
  const child = store.children.get(id);
  if (!job || !child) return null;
  job.status = "killed";
  job.endedAt = new Date().toISOString();
  child.kill("SIGTERM");
  persistJobs();
  return summarizeJob(job);
}
