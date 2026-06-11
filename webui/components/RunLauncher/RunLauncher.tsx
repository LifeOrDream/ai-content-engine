"use client";

import { useEffect, useState, useTransition } from "react";
import type { BlueprintSummary, PublicJob } from "@/lib/types";
import { BlueprintEditor } from "@/components/BlueprintEditor/BlueprintEditor";
import styles from "./RunLauncher.module.css";

const passes = [
  ["1", "1 script (writers room)"],
  ["2", "2 produce (direct+compile+frames)"],
];

const onlyPasses = ["script", "produce"];

export function RunLauncher({
  blueprints,
  onJobStarted,
  onBlueprintsChanged,
}: {
  blueprints: BlueprintSummary[];
  onJobStarted: (job: PublicJob) => void;
  onBlueprintsChanged: () => Promise<BlueprintSummary[]>;
}) {
  const [blueprintId, setBlueprintId] = useState(blueprints[0]?.id || "");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [only, setOnly] = useState("");
  const [renderFrom, setRenderFrom] = useState("");
  const [renderOnly, setRenderOnly] = useState("");
  const [renderRegen, setRenderRegen] = useState(false);
  const [renderAssemble, setRenderAssemble] = useState(true);
  const [editorMode, setEditorMode] = useState<"create" | "edit" | null>(null);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();
  const selectedBlueprint = blueprints.find((blueprint) => blueprint.id === blueprintId) || blueprints[0];

  useEffect(() => {
    if (!blueprintId && blueprints[0]) setBlueprintId(blueprints[0].id);
    if (blueprintId && blueprints.length && !blueprints.some((blueprint) => blueprint.id === blueprintId)) {
      setBlueprintId(blueprints[0].id);
    }
  }, [blueprintId, blueprints]);

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

  function runRenderPipeline() {
    setError("");
    startTransition(async () => {
      try {
        const response = await fetch("/api/runs", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            mode: "render",
            blueprintId,
            only: renderOnly ? Number(renderOnly) : undefined,
            from: !renderOnly && renderFrom ? Number(renderFrom) : undefined,
            regen: renderRegen,
            assemble: renderAssemble,
          }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not start render job");
        onJobStarted(data.job);
      } catch (runError: any) {
        setError(runError?.message || String(runError));
      }
    });
  }

  return (
    <section className={styles.card}>
      <div className={styles.headingRow}>
        <div>
          <h2>Blueprints</h2>
          <small>story clay</small>
        </div>
        <span>{blueprints.length} files</span>
      </div>

      <div className={styles.blueprintList}>
        {blueprints.map((blueprint) => (
          <button
            key={blueprint.id}
            className={`${styles.blueprintButton} ${blueprint.id === blueprintId ? styles.activeBlueprint : ""}`}
            onClick={() => setBlueprintId(blueprint.id)}
          >
            <strong>{blueprint.title}</strong>
            <span>{blueprint.id}</span>
          </button>
        ))}
      </div>

      <div className={styles.editorActions}>
        <button className={styles.secondaryButton} onClick={() => setEditorMode("create")}>New blueprint</button>
        <button className={styles.secondaryButton} onClick={() => setEditorMode("edit")} disabled={!selectedBlueprint}>Edit selected</button>
      </div>

      <div className={styles.selectedCard}>
        <strong>{selectedBlueprint?.title || "No blueprint selected"}</strong>
        <p>{selectedBlueprint?.logline || "Select or create a blueprint to generate trailer passes."}</p>
      </div>

      <div className={styles.headingRowCompact}>
        <h2>New generation</h2>
        <span>real pipeline</span>
      </div>

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

      <div className={styles.headingRowCompact}>
        <h2>Production render</h2>
        <span>Seedance</span>
      </div>

      <div className={styles.split}>
        <label className={styles.field}>
          <span>From sequence</span>
          <input
            value={renderFrom}
            onChange={(event) => setRenderFrom(event.target.value.replace(/\D/g, ""))}
            placeholder="1"
            disabled={Boolean(renderOnly)}
          />
        </label>

        <label className={styles.field}>
          <span>Only sequence</span>
          <input
            value={renderOnly}
            onChange={(event) => setRenderOnly(event.target.value.replace(/\D/g, ""))}
            placeholder="e.g. 3"
          />
        </label>
      </div>

      <label className={styles.checkRow}>
        <input type="checkbox" checked={renderRegen} onChange={(event) => setRenderRegen(event.target.checked)} />
        <span>Regenerate cached frames/clips</span>
      </label>

      <label className={styles.checkRow}>
        <input type="checkbox" checked={renderAssemble} onChange={(event) => setRenderAssemble(event.target.checked)} />
        <span>Assemble final trailer after render</span>
      </label>

      <button className={styles.renderButton} onClick={runRenderPipeline} disabled={!blueprintId || isPending}>
        {isPending ? "Starting..." : "Render video from scenes.json"}
      </button>

      <p className={styles.note}>
        Runs <code>npm run trailer:generate</code>. Use “Only sequence” for cheap one-clip iteration, then full render when approved.
      </p>
      {error ? <p className={styles.error}>{error}</p> : null}
      {editorMode ? (
        <BlueprintEditor
          mode={editorMode}
          blueprintId={editorMode === "edit" ? blueprintId : undefined}
          onClose={() => setEditorMode(null)}
          onSaved={async (blueprint) => {
            setEditorMode(null);
            setBlueprintId(blueprint.id);
            await onBlueprintsChanged();
          }}
        />
      ) : null}
    </section>
  );
}
