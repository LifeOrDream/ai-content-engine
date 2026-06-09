"use client";

import { useState, useTransition } from "react";
import type { BlueprintSummary, PublicJob } from "@/lib/types";
import styles from "./RunLauncher.module.css";

const passes = [
  ["1", "1 engagement"],
  ["2", "2 dialogue"],
  ["3", "3 polish"],
  ["4", "4 direct"],
  ["5", "5 compile"],
  ["6", "6 frames"],
];

const onlyPasses = ["engagement", "dialogue", "polish", "direct", "compile", "frames"];

export function RunLauncher({
  blueprints,
  onJobStarted,
}: {
  blueprints: BlueprintSummary[];
  onJobStarted: (job: PublicJob) => void;
}) {
  const [blueprintId, setBlueprintId] = useState(blueprints[0]?.id || "");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [only, setOnly] = useState("");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function runPipeline() {
    setError("");
    startTransition(async () => {
      try {
        const response = await fetch("/api/runs", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            blueprintId,
            only: only || undefined,
            from: !only && from ? Number(from) : undefined,
            to: !only && to ? Number(to) : undefined,
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not start job");
        onJobStarted(data.job);
      } catch (runError: any) {
        setError(runError?.message || String(runError));
      }
    });
  }

  return (
    <section className={styles.card}>
      <div className={styles.headingRow}>
        <h2>New generation</h2>
        <span>real pipeline</span>
      </div>

      <label className={styles.field}>
        <span>Blueprint</span>
        <select value={blueprintId} onChange={(event) => setBlueprintId(event.target.value)}>
          {blueprints.map((blueprint) => (
            <option key={blueprint.id} value={blueprint.id}>
              {blueprint.id} - {blueprint.title}
            </option>
          ))}
        </select>
      </label>

      <div className={styles.split}>
        <label className={styles.field}>
          <span>From</span>
          <select value={from} onChange={(event) => setFrom(event.target.value)} disabled={Boolean(only)}>
            <option value="">auto</option>
            {passes.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>

        <label className={styles.field}>
          <span>To</span>
          <select value={to} onChange={(event) => setTo(event.target.value)} disabled={Boolean(only)}>
            <option value="">auto</option>
            {passes.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className={styles.field}>
        <span>Only pass</span>
        <select value={only} onChange={(event) => setOnly(event.target.value)}>
          <option value="">full / range</option>
          {onlyPasses.map((pass) => (
            <option key={pass} value={pass}>
              {pass}
            </option>
          ))}
        </select>
      </label>

      <button className={styles.primaryButton} onClick={runPipeline} disabled={!blueprintId || isPending}>
        {isPending ? "Starting..." : "Run script pipeline"}
      </button>

      <p className={styles.note}>
        Runs <code>npm run trailer:script</code> and writes the normal <code>trailer/out/&lt;id&gt;</code> pass artifacts.
      </p>
      {error ? <p className={styles.error}>{error}</p> : null}
    </section>
  );
}
