"use client";

import { useDeferredValue, useEffect, useState, useTransition } from "react";
import type { BlueprintSummary, PublicJob, RunDetail, RunSummary } from "@/lib/types";
import { JobPanel } from "@/components/JobPanel/JobPanel";
import { RunInspector } from "@/components/RunInspector/RunInspector";
import { RunLauncher } from "@/components/RunLauncher/RunLauncher";
import { RunList } from "@/components/RunList/RunList";
import styles from "./GenerationDashboard.module.css";

export function GenerationDashboard({
  initialBlueprints,
  initialRuns,
  initialJobs,
}: {
  initialBlueprints: BlueprintSummary[];
  initialRuns: RunSummary[];
  initialJobs: PublicJob[];
}) {
  const [blueprints, setBlueprints] = useState(initialBlueprints);
  const [runs, setRuns] = useState(initialRuns);
  const [jobs, setJobs] = useState(initialJobs);
  const [selectedRunId, setSelectedRunId] = useState<string | null>(initialRuns[0]?.id || null);
  const [selectedRun, setSelectedRun] = useState<RunDetail | null>(null);
  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [selectedLogs, setSelectedLogs] = useState<string[]>([]);
  const [health, setHealth] = useState("checking");
  const [isPending, startTransition] = useTransition();
  const deferredRun = useDeferredValue(selectedRun);

  async function refreshLists() {
    const [healthResponse, runsResponse, jobsResponse] = await Promise.all([
      fetch("/api/health"),
      fetch("/api/runs"),
      fetch("/api/jobs"),
    ]);
    const [healthData, runsData, jobsData] = await Promise.all([
      healthResponse.json(),
      runsResponse.json(),
      jobsResponse.json(),
    ]);
    setHealth(healthData.ok ? "online" : "offline");
    setRuns(runsData.runs || []);
    setJobs(jobsData.jobs || []);
  }

  async function refreshBlueprints(): Promise<BlueprintSummary[]> {
    const response = await fetch("/api/blueprints");
    const data = await response.json();
    const nextBlueprints = data.blueprints || [];
    setBlueprints(nextBlueprints);
    return nextBlueprints;
  }

  async function loadRun(id: string) {
    setSelectedRunId(id);
    const response = await fetch(`/api/runs/${encodeURIComponent(id)}`);
    const data = await response.json();
    if (response.ok) setSelectedRun(data.run);
  }

  async function loadJob(id: string) {
    setSelectedJobId(id);
    const response = await fetch(`/api/jobs/${encodeURIComponent(id)}/logs`);
    const data = await response.json();
    if (response.ok) setSelectedLogs(data.logs || []);
  }

  function refresh() {
    startTransition(async () => {
      await refreshLists();
      if (selectedRunId) await loadRun(selectedRunId);
      if (selectedJobId) await loadJob(selectedJobId);
    });
  }

  useEffect(() => {
    refresh();
    const timer = window.setInterval(refresh, 2500);
    return () => window.clearInterval(timer);
    // Polling deliberately uses the latest selected ids from state transitions.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function handleJobStarted(job: PublicJob) {
    setSelectedJobId(job.id);
    await refreshLists();
    await loadJob(job.id);
    await loadRun(job.blueprintId);
  }

  async function handleKill(id: string) {
    await fetch(`/api/jobs/${encodeURIComponent(id)}/kill`, { method: "POST" });
    await refreshLists();
    await loadJob(id);
  }

  return (
    <div className={styles.shell}>
      <header className={styles.hero}>
        <img src="/api/assets/trailer/assets/reference/minebtc-x-header-1500x500.jpg" alt="MineBTC HashBeasts banner" />
        <div className={styles.heroCopy}>
          <p>Local generation console</p>
          <h1>MineBTC AI Content Engine WebUI</h1>
          <span>
            Track trailer script passes, frame refs, video artifacts, job logs, and dialogue quality before spending on production renders.
          </span>
        </div>
        <div className={styles.statusBar}>
          <span>{health}</span>
          <button onClick={refresh} disabled={isPending}>
            {isPending ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </header>

      <main className={styles.grid}>
        <aside className={styles.leftRail}>
          <RunLauncher blueprints={blueprints} onJobStarted={handleJobStarted} onBlueprintsChanged={refreshBlueprints} />
          <RunList runs={runs} selectedRunId={selectedRunId} onSelect={(id) => void loadRun(id)} />
        </aside>

        <RunInspector run={deferredRun} />

        <JobPanel
          jobs={jobs}
          selectedJobId={selectedJobId}
          selectedLogs={selectedLogs}
          onSelect={(id) => void loadJob(id)}
          onKill={(id) => void handleKill(id)}
        />
      </main>
    </div>
  );
}
