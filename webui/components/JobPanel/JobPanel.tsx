"use client";

import type { PublicJob } from "@/lib/types";
import styles from "./JobPanel.module.css";

export function JobPanel({
  jobs,
  selectedJobId,
  selectedLogs,
  onSelect,
  onKill,
}: {
  jobs: PublicJob[];
  selectedJobId: string | null;
  selectedLogs: string[];
  onSelect: (id: string) => void;
  onKill: (id: string) => void;
}) {
  const selected = jobs.find((job) => job.id === selectedJobId);
  return (
    <aside className={styles.panel}>
      <section className={styles.card}>
        <div className={styles.headingRow}>
          <h2>Jobs</h2>
          <span>{jobs.filter((job) => job.status === "running").length} running</span>
        </div>
        <div className={styles.list}>
          {jobs.length === 0 ? <p className={styles.empty}>No persisted jobs yet.</p> : null}
          {jobs.map((job) => (
            <button
              key={job.id}
              className={`${styles.jobButton} ${job.id === selectedJobId ? styles.active : ""}`}
              onClick={() => onSelect(job.id)}
            >
              <div className={styles.titleRow}>
                <strong>{job.blueprintId} · {job.jobType}</strong>
                <span className={`${styles.status} ${styles[job.status]}`}>{job.status}</span>
              </div>
              <p>{job.command.join(" ")}</p>
              {job.status === "running" ? (
                <span
                  role="button"
                  tabIndex={0}
                  className={styles.kill}
                  onClick={(event) => {
                    event.stopPropagation();
                    onKill(job.id);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") onKill(job.id);
                  }}
                >
                  Kill job
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.card}>
        <div className={styles.headingRow}>
          <h2>Job log</h2>
          <span>{selected?.status || "idle"}</span>
        </div>
        <pre className={styles.log}>{selectedLogs.length ? selectedLogs.join("\n") : "No job selected."}</pre>
      </section>
    </aside>
  );
}
