import "server-only";
import { spawn, type ChildProcess } from "node:child_process";
import { REPO_ROOT, PASS_IDS, blueprintById } from "./contentEngine";

export type JobStatus = "running" | "success" | "failed" | "killed";

export interface WebJob {
  id: string;
  blueprintId: string;
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
};

const globalForJobs = globalThis as typeof globalThis & {
  __minebtcWebuiJobs?: Store;
};

const store: Store = globalForJobs.__minebtcWebuiJobs || {
  jobs: new Map<string, WebJob>(),
  children: new Map<string, ChildProcess>(),
};

globalForJobs.__minebtcWebuiJobs = store;

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
  for (const line of text.split(/\r?\n/)) {
    if (line.trim()) job.logs.push(line);
  }
  if (job.logs.length > 2500) job.logs.splice(0, job.logs.length - 2500);
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

  const job: WebJob = {
    id: `${blueprint.id}-${Date.now().toString(36)}`,
    blueprintId: blueprint.id,
    command: ["npm", ...args],
    status: "running",
    startedAt: new Date().toISOString(),
    logs: [],
  };
  store.jobs.set(job.id, job);

  const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";
  const child = spawn(npmCommand, args, {
    cwd: REPO_ROOT,
    env: process.env,
    stdio: ["ignore", "pipe", "pipe"],
  });
  job.pid = child.pid;
  store.children.set(job.id, child);

  child.stdout?.on("data", (chunk) => pushLog(job, chunk));
  child.stderr?.on("data", (chunk) => pushLog(job, chunk));
  child.on("error", (error) => {
    job.status = "failed";
    job.endedAt = new Date().toISOString();
    pushLog(job, `spawn error: ${error.message}`);
    store.children.delete(job.id);
  });
  child.on("exit", (code, signal) => {
    if (job.status !== "killed") job.status = code === 0 ? "success" : "failed";
    job.exitCode = code;
    job.signal = signal;
    job.endedAt = new Date().toISOString();
    store.children.delete(job.id);
  });

  return summarizeJob(job);
}

export function killJob(id: string): PublicJob | null {
  const job = store.jobs.get(id);
  const child = store.children.get(id);
  if (!job || !child) return null;
  job.status = "killed";
  job.endedAt = new Date().toISOString();
  child.kill("SIGTERM");
  return summarizeJob(job);
}
