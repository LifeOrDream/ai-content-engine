"use client";

import type { RunSummary } from "@/lib/types";
import styles from "./RunList.module.css";

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.max(0, Math.floor(diff / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export function RunList({
  runs,
  selectedRunId,
  onSelect,
}: {
  runs: RunSummary[];
  selectedRunId: string | null;
  onSelect: (id: string) => void;
}) {
  return (
    <section className={styles.card}>
      <div className={styles.headingRow}>
        <h2>Runs</h2>
        <span>{runs.length}</span>
      </div>
      <div className={styles.list}>
        {runs.length === 0 ? <p className={styles.empty}>No trailer outputs yet.</p> : null}
        {runs.map((run) => (
          <button
            key={run.id}
            className={`${styles.runButton} ${run.id === selectedRunId ? styles.active : ""}`}
            onClick={() => onSelect(run.id)}
          >
            <div className={styles.titleRow}>
              <strong>{run.title}</strong>
              <span className={`${styles.status} ${styles[run.status]}`}>{run.status}</span>
            </div>
            <p>
              {run.id}
              <br />
              {run.passCount}/6 passes · {run.videos.length} videos · {timeAgo(run.updatedAt)}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
