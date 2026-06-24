"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

interface ChapterSummary {
  warId: number;
  versionCount: number;
  latestVersion: string | null;
  latestVideoFile: string | null;
  updatedAt: string;
}

interface ChapterVersionView {
  version: string;
  title: string | null;
  mode: string;
  gitSha: string | null;
  keySource: string | null;
  costUsd: number | null;
  createdAt: string | null;
  fromVersion: string | null;
  hasVideo: boolean;
  videoFile: string | null;
  hasScenes: boolean;
}

interface ChapterDetail {
  warId: number;
  hasSource: boolean;
  source: { gitSha: string | null; archivedAt: string | null; winnerFactionId: number | null } | null;
  versions: ChapterVersionView[];
}

const card: React.CSSProperties = {
  background: "#0c1722",
  border: "1px solid #1d2c3a",
  borderRadius: 10,
  padding: 16,
};
const label: React.CSSProperties = { fontSize: 12, color: "#7c93a8", marginBottom: 4 };
const mono: React.CSSProperties = { fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: 12 };

function artifactUrl(warId: number, version: string, file: string): string {
  return `/api/chapters/${warId}/${encodeURIComponent(version)}/artifact/${file.split("/").map(encodeURIComponent).join("/")}`;
}

function VersionVideo({ warId, v }: { warId: number; v: ChapterVersionView | null }) {
  if (!v) return <div style={{ ...card, color: "#7c93a8" }}>No version selected.</div>;
  return (
    <div style={card}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
        <strong style={{ fontSize: 13 }}>{v.title || `chapter ${warId}`}</strong>
        <span style={{ ...mono, color: "#5fd0a0" }}>{v.mode}</span>
      </div>
      {v.hasVideo && v.videoFile ? (
        <video
          src={artifactUrl(warId, v.version, v.videoFile)}
          controls
          style={{ width: "100%", borderRadius: 8, background: "#000", aspectRatio: "16 / 9" }}
        />
      ) : (
        <div style={{ color: "#c98b8b", fontSize: 13, padding: "24px 0", textAlign: "center" }}>
          {v.hasScenes ? "scenes.json present, no video yet" : "no render"}
        </div>
      )}
      <div style={{ ...mono, color: "#7c93a8", marginTop: 8, lineHeight: 1.6 }}>
        <div>version: {v.version}</div>
        <div>git: {v.gitSha || "—"}</div>
        <div>key: {v.keySource || "—"}</div>
        <div>cost: {v.costUsd != null ? `$${v.costUsd.toFixed(2)}` : "—"}</div>
        {v.fromVersion ? <div>from: {v.fromVersion}</div> : null}
        {v.hasScenes ? (
          <a href={artifactUrl(warId, v.version, "scenes.json")} target="_blank" rel="noreferrer" style={{ color: "#6fb0ff" }}>
            scenes.json ↗
          </a>
        ) : null}
      </div>
    </div>
  );
}

export default function ChaptersPage() {
  const [chapters, setChapters] = useState<ChapterSummary[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [detail, setDetail] = useState<ChapterDetail | null>(null);
  const [mode, setMode] = useState<"full" | "render-only">("render-only");
  const [fromVersion, setFromVersion] = useState<string>("");
  const [apiKey, setApiKey] = useState<string>("");
  const [aVersion, setAVersion] = useState<string>("");
  const [bVersion, setBVersion] = useState<string>("");
  const [notice, setNotice] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const loadChapters = useCallback(async () => {
    const res = await fetch("/api/chapters", { cache: "no-store" });
    const json = await res.json();
    setChapters(json.chapters || []);
  }, []);

  const loadDetail = useCallback(async (warId: number) => {
    const res = await fetch(`/api/chapters/${warId}`, { cache: "no-store" });
    const json = await res.json();
    const d: ChapterDetail | null = json.chapter || null;
    setDetail(d);
    const versions = d?.versions || [];
    const last = versions[versions.length - 1]?.version || "";
    const prev = versions[versions.length - 2]?.version || last;
    setFromVersion(last);
    setBVersion(last);
    setAVersion(prev);
  }, []);

  useEffect(() => {
    loadChapters();
  }, [loadChapters]);

  useEffect(() => {
    if (selected != null) loadDetail(selected);
  }, [selected, loadDetail]);

  const versions = detail?.versions || [];
  const vA = useMemo(() => versions.find((v) => v.version === aVersion) || null, [versions, aVersion]);
  const vB = useMemo(() => versions.find((v) => v.version === bVersion) || null, [versions, bVersion]);

  async function runReplay() {
    if (selected == null) return;
    setBusy(true);
    setNotice("");
    try {
      const res = await fetch("/api/chapters/replay", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          warId: selected,
          mode,
          fromVersion: mode === "render-only" ? fromVersion : undefined,
          apiKey: apiKey.trim() || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "replay failed to start");
      setApiKey(""); // drop the key from memory once sent
      setNotice(
        `Replay started (job ${json.job?.id}). It runs in the background — click Refresh in a few minutes to see the new version.`,
      );
    } catch (e: any) {
      setNotice(`Error: ${e?.message || e}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ maxWidth: 1180, margin: "0 auto", padding: "32px 20px 80px", color: "#dce6ef" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 20 }}>
        <h1 style={{ fontSize: 22, margin: 0 }}>Hashiden chapters</h1>
        <a href="/" style={{ color: "#6fb0ff", fontSize: 13 }}>
          ← Runs dashboard
        </a>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 20, alignItems: "start" }}>
        {/* Chapter list */}
        <div style={{ ...card, padding: 8 }}>
          <div style={{ ...label, padding: "6px 8px" }}>CHAPTERS ({chapters.length})</div>
          {chapters.length === 0 ? (
            <div style={{ color: "#7c93a8", fontSize: 13, padding: 8 }}>
              None yet — produce one with <span style={mono}>npm run chapter:produce</span>.
            </div>
          ) : (
            chapters.map((c) => (
              <button
                key={c.warId}
                onClick={() => setSelected(c.warId)}
                style={{
                  display: "block",
                  width: "100%",
                  textAlign: "left",
                  padding: "8px 10px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  marginBottom: 2,
                  background: selected === c.warId ? "#16324a" : "transparent",
                  color: "#dce6ef",
                }}
              >
                <div style={{ fontSize: 13, fontWeight: 600 }}>Chapter {c.warId}</div>
                <div style={{ ...mono, color: "#7c93a8" }}>
                  {c.versionCount} version{c.versionCount === 1 ? "" : "s"}
                  {c.latestVideoFile ? " · 🎬" : ""}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detail */}
        <div style={{ display: "grid", gap: 20 }}>
          {selected == null ? (
            <div style={{ ...card, color: "#7c93a8" }}>Select a chapter to replay and compare its versions.</div>
          ) : (
            <>
              {/* Replay panel */}
              <div style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <strong>Replay chapter {selected}</strong>
                  <button onClick={() => loadDetail(selected)} style={{ ...mono, color: "#6fb0ff", background: "none", border: "none", cursor: "pointer" }}>
                    ↻ Refresh
                  </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <div>
                    <div style={label}>MODE</div>
                    <div style={{ display: "flex", gap: 8 }}>
                      {(["render-only", "full"] as const).map((m) => (
                        <button
                          key={m}
                          onClick={() => setMode(m)}
                          style={{
                            flex: 1,
                            padding: "8px",
                            borderRadius: 6,
                            cursor: "pointer",
                            border: mode === m ? "1px solid #5fd0a0" : "1px solid #1d2c3a",
                            background: mode === m ? "#11302a" : "#0a131c",
                            color: "#dce6ef",
                            fontSize: 12,
                          }}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                    <div style={{ ...mono, color: "#7c93a8", marginTop: 6 }}>
                      {mode === "render-only"
                        ? "freeze a prior scenes.json, re-render video only (clean A/B of render code)"
                        : "re-run script + render from archived facts"}
                    </div>
                  </div>
                  <div>
                    {mode === "render-only" ? (
                      <>
                        <div style={label}>FREEZE SCRIPT FROM VERSION</div>
                        <select
                          value={fromVersion}
                          onChange={(e) => setFromVersion(e.target.value)}
                          style={{ width: "100%", padding: 8, background: "#0a131c", color: "#dce6ef", border: "1px solid #1d2c3a", borderRadius: 6, ...mono }}
                        >
                          {versions
                            .filter((v) => v.hasScenes)
                            .map((v) => (
                              <option key={v.version} value={v.version}>
                                {v.version}
                              </option>
                            ))}
                        </select>
                      </>
                    ) : (
                      <div style={{ ...mono, color: "#7c93a8" }}>
                        {detail?.hasSource ? "archived facts present ✓" : "no archived facts — produce this chapter first"}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ marginTop: 14 }}>
                  <div style={label}>YOUR FAL.AI API KEY (optional — billed to you; kept in memory only, never stored)</div>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="leave blank to use the server key"
                    autoComplete="off"
                    style={{ width: "100%", padding: 8, background: "#0a131c", color: "#dce6ef", border: "1px solid #1d2c3a", borderRadius: 6, ...mono }}
                  />
                </div>

                <button
                  onClick={runReplay}
                  disabled={busy || (mode === "full" && !detail?.hasSource)}
                  style={{
                    marginTop: 14,
                    padding: "10px 16px",
                    borderRadius: 6,
                    border: "none",
                    cursor: busy ? "wait" : "pointer",
                    background: "#1f6feb",
                    color: "white",
                    fontWeight: 600,
                    opacity: busy || (mode === "full" && !detail?.hasSource) ? 0.5 : 1,
                  }}
                >
                  {busy ? "Starting…" : `Run ${mode} replay`}
                </button>
                {notice ? <div style={{ ...mono, marginTop: 10, color: "#9fd0a0" }}>{notice}</div> : null}
              </div>

              {/* Compare */}
              <div style={card}>
                <strong>Compare versions</strong>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 12 }}>
                  <div>
                    <div style={label}>A (older)</div>
                    <select
                      value={aVersion}
                      onChange={(e) => setAVersion(e.target.value)}
                      style={{ width: "100%", padding: 8, background: "#0a131c", color: "#dce6ef", border: "1px solid #1d2c3a", borderRadius: 6, ...mono, marginBottom: 12 }}
                    >
                      {versions.map((v) => (
                        <option key={v.version} value={v.version}>
                          {v.version} · {v.mode}
                        </option>
                      ))}
                    </select>
                    <VersionVideo warId={selected} v={vA} />
                  </div>
                  <div>
                    <div style={label}>B (newer)</div>
                    <select
                      value={bVersion}
                      onChange={(e) => setBVersion(e.target.value)}
                      style={{ width: "100%", padding: 8, background: "#0a131c", color: "#dce6ef", border: "1px solid #1d2c3a", borderRadius: 6, ...mono, marginBottom: 12 }}
                    >
                      {versions.map((v) => (
                        <option key={v.version} value={v.version}>
                          {v.version} · {v.mode}
                        </option>
                      ))}
                    </select>
                    <VersionVideo warId={selected} v={vB} />
                  </div>
                </div>
                {vA && vB && vA.costUsd != null && vB.costUsd != null ? (
                  <div style={{ ...mono, color: "#7c93a8", marginTop: 12 }}>
                    cost delta (B − A): ${(vB.costUsd - vA.costUsd).toFixed(2)}
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
