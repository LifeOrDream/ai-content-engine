"use client";

import { useState, useTransition } from "react";
import type { RunDetail } from "@/lib/types";
import styles from "./RunInspector.module.css";

const passLabel: Record<string, string> = {
  "01-script.md": "1 script (writers room)",
  "02-produce.md": "2 produce (direct+compile+frames)",
};

export function RunInspector({ run }: { run: RunDetail | null }) {
  const [tab, setTab] = useState("factory");
  const [fileText, setFileText] = useState("");
  const [fileError, setFileError] = useState("");
  const [isPending, startTransition] = useTransition();

  if (!run) {
    return (
      <section className={`${styles.panel} ${styles.empty}`}>
        Select a run to inspect script passes, scenes, dialogue health, frame refs, and videos.
      </section>
    );
  }

  const currentRun = run;
  const tabs = [
    { id: "factory", label: "Factory" },
    { id: "dialogue", label: "Dialogue QA" },
    { id: "refs", label: "Refs / assets" },
    { id: "frames", label: "Frame plan" },
    { id: "videos", label: "Videos" },
    { id: "subtitles", label: "Subtitles" },
    { id: "scenes.json", label: "scenes.json" },
    ...currentRun.passFiles.map((file) => ({ id: file, label: passLabel[file] || file })),
  ];

  function openTab(nextTab: string) {
    setTab(nextTab);
    setFileError("");
    if (!nextTab.endsWith(".md") && !nextTab.endsWith(".json")) return;
    startTransition(async () => {
      try {
        const response = await fetch(`/api/runs/${encodeURIComponent(currentRun.id)}/file?name=${encodeURIComponent(nextTab)}`);
        const text = await response.text();
        if (!response.ok) throw new Error(text);
        setFileText(text);
      } catch (error: any) {
        setFileText("");
        setFileError(error?.message || String(error));
      }
    });
  }

  return (
    <section className={styles.panel}>
      <div className={styles.topbar}>
        <div>
          <p className={styles.overline}>Selected output</p>
          <h1>{run.title}</h1>
        </div>
        <span className={`${styles.status} ${styles[run.status]}`}>{run.status}</span>
      </div>

      <div className={styles.cards}>
        <Metric label="Runtime" value={run.scenesSummary ? `${run.scenesSummary.totalSeconds}s` : "-"} />
        <Metric label="Dialogue score" value={run.dialogueHealth ? String(run.dialogueHealth.score) : "-"} tone={run.dialogueHealth?.flaggedCount ? "warn" : "ok"} />
        <Metric label="Est. cost" value={run.manifest?.costEstimate ? `$${run.manifest.costEstimate.estimatedUsd}` : "-"} />
        <Metric label="FAL calls" value={run.manifest ? String(run.manifest.falRequests.length) : "-"} />
      </div>

      <nav className={styles.tabs}>
        {tabs.map((candidate) => (
          <button
            key={candidate.id}
            className={`${styles.tab} ${tab === candidate.id ? styles.activeTab : ""}`}
            onClick={() => openTab(candidate.id)}
          >
            {candidate.label}
          </button>
        ))}
      </nav>

      <div className={styles.viewer}>
        {tab === "factory" ? <FactoryPanel run={run} /> : null}
        {tab === "dialogue" ? <DialoguePanel run={run} /> : null}
        {tab === "refs" ? <RefsPanel run={run} /> : null}
        {tab === "frames" ? <FramePanel run={run} /> : null}
        {tab === "videos" ? <VideoPanel run={run} /> : null}
        {tab === "subtitles" ? <SubtitlesPanel run={run} /> : null}
        {(tab.endsWith(".md") || tab.endsWith(".json")) ? (
          <pre className={tab.endsWith(".json") ? styles.jsonBlock : styles.markdown}>
            {isPending ? "Loading..." : fileError || fileText || "Click again if this file was just generated."}
          </pre>
        ) : null}
      </div>
    </section>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone?: "ok" | "warn" }) {
  return (
    <div className={styles.metric}>
      <strong>{label}</strong>
      <span className={tone ? styles[tone] : ""}>{value}</span>
    </div>
  );
}

function artifactUrl(runId: string, filePath: string): string {
  return `/api/runs/${encodeURIComponent(runId)}/artifact/${filePath.split("/").map(encodeURIComponent).join("/")}`;
}

function assetUrl(filePath: string): string {
  return `/api/assets/${filePath.split("/").map(encodeURIComponent).join("/")}`;
}

function formatBytes(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

function FactoryPanel({ run }: { run: RunDetail }) {
  const manifest = run.manifest;
  if (!manifest) return <div className={styles.empty}>No run-manifest.json yet. Run the script pipeline once to create the production audit trail.</div>;
  return (
    <div className={styles.factoryGrid}>
      <article className={styles.auditCard}>
        <h3>Run manifest</h3>
        <p>{manifest.blueprintId} · git {manifest.gitCommit || "unknown"} · updated {new Date(manifest.updatedAt).toLocaleString()}</p>
        {manifest.costEstimate ? (
          <div className={styles.costGrid}>
            <Metric label="Estimate" value={`$${manifest.costEstimate.estimatedUsd}`} />
            <Metric label="Images" value={String(manifest.costEstimate.imageCalls)} />
            <Metric label="Video secs" value={String(manifest.costEstimate.videoSeconds)} />
            <Metric label="LLM calls" value={String(manifest.costEstimate.llmCalls)} />
          </div>
        ) : null}
        {manifest.costEstimate?.assumptions?.length ? (
          <p className={styles.note}>{manifest.costEstimate.assumptions.join(" · ")}</p>
        ) : null}
      </article>

      <article className={styles.auditCard}>
        <h3>Stages</h3>
        <div className={styles.stageList}>
          {manifest.stages.map((stage) => (
            <div className={styles.stageRow} key={stage.id}>
              <span className={`${styles.dot} ${styles[stage.status]}`} />
              <div>
                <strong>{stage.label}</strong>
                <small>{stage.id} · {stage.kind}{stage.durationMs ? ` · ${(stage.durationMs / 1000).toFixed(1)}s` : ""}</small>
                {stage.error ? <em>{stage.error}</em> : null}
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className={styles.auditCard}>
        <h3>FAL requests</h3>
        {manifest.falRequests.length ? (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Stage</th>
                <th>Model</th>
                <th>Request</th>
                <th>Output</th>
              </tr>
            </thead>
            <tbody>
              {manifest.falRequests.map((request, index) => (
                <tr key={`${request.stageId}-${request.requestId || index}`}>
                  <td>{request.stageId}</td>
                  <td>{request.model}<small>{request.resolution || ""} {request.durationSecs ? `· ${request.durationSecs}s` : ""}</small></td>
                  <td>{request.requestId ? <code>{request.requestId}</code> : <span className={styles.warn}>missing</span>}</td>
                  <td>{request.outputUrl ? <a href={request.outputUrl} target="_blank" rel="noreferrer">open</a> : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : <p className={styles.note}>No FAL requests recorded yet. Render a sequence to populate this audit.</p>}
      </article>
    </div>
  );
}

function DialoguePanel({ run }: { run: RunDetail }) {
  const health = run.dialogueHealth;
  if (!health) return <div className={styles.empty}>No scenes.json yet. Run the produce pass first.</div>;
  const cleanLines = health.lines.filter((line) => line.flags.length === 0).length;
  return (
    <>
      <p className={styles.note}>
        Score {health.score} · {health.lineCount} lines · {health.avgWords} avg words · {health.flaggedCount} flagged · {health.occupancyPct}% spoken occupancy.
        This catches tiny slogan lines, prop-label dialogue, mechanic words in mouths, and timing mismatch before video generation.
      </p>
      <div className={styles.dialogueSummary}>
        <Metric label="Clean lines" value={`${cleanLines}/${health.lineCount}`} tone={health.flaggedCount ? "warn" : "ok"} />
        <Metric label="Spoken time" value={`${health.spokenSeconds}s`} />
        <Metric label="Line windows" value={`${health.availableSeconds}s`} />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Seq</th>
            <th>Speaker</th>
            <th>Line</th>
            <th>Speakability</th>
            <th>Flags</th>
          </tr>
        </thead>
        <tbody>
          {health.lines.map((line) => (
            <tr key={`${line.sequence}-${line.shot}-${line.speaker}-${line.line}`}>
              <td>{line.sequence}.{line.shot}</td>
              <td>{line.speaker}</td>
              <td>
                <strong>{line.line}</strong>
                <small>{line.delivery}</small>
              </td>
              <td>
                {line.wordCount}w / {line.seconds}s
                <small>target {line.minWords}-{line.maxWords}w · est {line.estimatedSeconds}s · {line.occupancyPct}%</small>
              </td>
              <td>
                {line.flags.length ? line.flags.map((flag) => <span className={styles.flag} key={flag}>{flag}</span>) : <span className={styles.ok}>clean</span>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

function RefsPanel({ run }: { run: RunDetail }) {
  const manifest = run.manifest;
  if (!manifest) return <div className={styles.empty}>No manifest reference audit yet.</div>;
  const imageArtifacts = manifest.artifacts.filter((artifact) => artifact.kind === "image");
  return (
    <div className={styles.assetPanels}>
      <article className={styles.auditCard}>
        <h3>Reference assets</h3>
        <p className={styles.note}>
          These are the character/country/environment references the frame prompts are expected to anchor on. Missing or planned refs should be fixed before spending on video.
        </p>
        <div className={styles.refGrid}>
          {manifest.references.map((ref, index) => (
            <article className={styles.refCard} key={`${ref.sequence}-${ref.ref}-${index}`}>
              {ref.repoPath ? (
                <img
                  src={ref.kind === "environment-chain" ? artifactUrl(run.id, ref.repoPath) : assetUrl(ref.repoPath)}
                  alt={ref.label || ref.ref}
                />
              ) : <div className={styles.refPlaceholder}>{ref.kind}</div>}
              <strong>{ref.ref}</strong>
              <span className={`${styles.statusPill} ${styles[ref.status]}`}>{ref.status}</span>
              <small>seq {ref.sequence} · {ref.label || ref.kind}</small>
            </article>
          ))}
        </div>
      </article>

      <article className={styles.auditCard}>
        <h3>Generated frame artifacts</h3>
        {imageArtifacts.length ? (
          <div className={styles.refGrid}>
            {imageArtifacts.map((artifact) => (
              <article className={styles.refCard} key={artifact.path}>
                <img src={artifactUrl(run.id, artifact.path)} alt={artifact.label} />
                <strong>{artifact.label}</strong>
                <small>{artifact.path} · {formatBytes(artifact.bytes)}</small>
              </article>
            ))}
          </div>
        ) : <p className={styles.note}>No generated frame artifacts recorded yet.</p>}
      </article>
    </div>
  );
}

function FramePanel({ run }: { run: RunDetail }) {
  if (!run.frameHealth || !run.scenesSummary) return <div className={styles.empty}>No frame plans yet. Run the produce pass.</div>;
  return (
    <div className={styles.frameList}>
      <p className={styles.note}>
        Start frames {run.frameHealth.startFrameCount}/{run.frameHealth.sequenceCount} · end frames {run.frameHealth.endFrameCount} · refs {run.frameHealth.totalRefs}.
        Missing start frames: {run.frameHealth.missingStartFrames.length ? run.frameHealth.missingStartFrames.join(", ") : "none"}.
      </p>
      {run.scenesSummary.firstSequences.map((seq) => (
        <article className={styles.frameRow} key={seq.n}>
          <strong>Sequence {seq.n} - {seq.label || "unnamed"}</strong>
          <p>{seq.durationSec}s · {seq.location}</p>
          <p>Characters: {seq.characters.map((character) => `${character.refTag}${character.state ? `:${character.state}` : ""}`).join(", ") || "none"}</p>
          <p>Start: {seq.hasStartFrame ? <span className={styles.ok}>ready</span> : <span className={styles.warn}>missing</span>} · End: {seq.hasEndFrame ? "planned" : "none"}</p>
          <div className={styles.refs}>{seq.startRefs.map((ref) => <code key={ref}>{ref}</code>)}</div>
        </article>
      ))}
    </div>
  );
}

function VideoPanel({ run }: { run: RunDetail }) {
  if (!run.videos.length) return <div className={styles.empty}>No video files in this run yet.</div>;
  return (
    <div className={styles.videoGrid}>
      {run.videos.map((file) => (
        <article className={styles.videoCard} key={file}>
          <video controls src={artifactUrl(run.id, file)} />
          <p>{file}</p>
        </article>
      ))}
    </div>
  );
}

function SubtitlesPanel({ run }: { run: RunDetail }) {
  const subtitles = run.manifest?.subtitles || [];
  if (!subtitles.length) return <div className={styles.empty}>No subtitles yet. They are created after scenes.json exists.</div>;
  return (
    <div className={styles.subtitleGrid}>
      {subtitles.map((artifact) => (
        <article className={styles.auditCard} key={artifact.path}>
          <h3>{artifact.label}</h3>
          <p>{artifact.path} · {formatBytes(artifact.bytes)}</p>
          <a href={artifactUrl(run.id, artifact.path)} download>
            Download
          </a>
        </article>
      ))}
    </div>
  );
}
