"use client";

import { useState, useTransition } from "react";
import type { RunDetail } from "@/lib/types";
import styles from "./RunInspector.module.css";

const passLabel: Record<string, string> = {
  "01-engagement.md": "1 engagement",
  "02-dialogue.md": "2 dialogue",
  "03-polish.md": "3 polish",
  "04-direct.md": "4 direct",
  "05-compile.md": "5 compile",
  "06-frames.md": "6 frames",
};

export function RunInspector({ run }: { run: RunDetail | null }) {
  const [tab, setTab] = useState("dialogue");
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
    { id: "dialogue", label: "Dialogue QA" },
    { id: "frames", label: "Frame refs" },
    { id: "videos", label: "Videos" },
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
        <Metric label="Frame refs" value={run.frameHealth ? String(run.frameHealth.totalRefs) : "-"} />
        <Metric label="Videos" value={String(run.videos.length)} />
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
        {tab === "dialogue" ? <DialoguePanel run={run} /> : null}
        {tab === "frames" ? <FramePanel run={run} /> : null}
        {tab === "videos" ? <VideoPanel run={run} /> : null}
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

function DialoguePanel({ run }: { run: RunDetail }) {
  const health = run.dialogueHealth;
  if (!health) return <div className={styles.empty}>No scenes.json yet. Run compile first.</div>;
  return (
    <>
      <p className={styles.note}>
        Score {health.score} · {health.lineCount} lines · {health.avgWords} avg words · {health.flaggedCount} flagged.
        This catches tiny slogan lines, prop-label dialogue, mechanic words in mouths, and timing mismatch before video generation.
      </p>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Seq</th>
            <th>Speaker</th>
            <th>Line</th>
            <th>Timing</th>
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
                <small>target {line.minWords}w+</small>
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

function FramePanel({ run }: { run: RunDetail }) {
  if (!run.frameHealth || !run.scenesSummary) return <div className={styles.empty}>No frame plans yet. Run compile + frames.</div>;
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
          <video controls src={`/api/runs/${encodeURIComponent(run.id)}/media/${encodeURIComponent(file)}`} />
          <p>{file}</p>
        </article>
      ))}
    </div>
  );
}
