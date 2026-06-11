"use client";

import { useEffect, useState, useTransition } from "react";
import type { BlueprintDocument, BlueprintSummary } from "@/lib/types";
import styles from "./BlueprintEditor.module.css";

const emptyBlueprint = (): BlueprintDocument => ({
  id: "",
  file: "",
  title: "",
  genre: "story",
  logline: "",
  targetSeconds: 75,
  minSeconds: 24,
  countdown: "04:20:00",
  cta: "Mine your HashBeast - minebtc.fun",
  cast: ["rex"],
  updatedAt: new Date().toISOString(),
  body: [
    "## Hook",
    "- Open on a visual that creates instant curiosity.",
    "",
    "## Grounding facts",
    "- What is true in the MineBTC world?",
    "",
    "## Beats",
    "1. Cold open:",
    "2. Escalation:",
    "3. Payoff:",
    "4. Cliffhanger:",
  ].join("\n"),
  raw: "",
});

export function BlueprintEditor({
  mode,
  blueprintId,
  onClose,
  onSaved,
}: {
  mode: "create" | "edit";
  blueprintId?: string;
  onClose: () => void;
  onSaved: (blueprint: BlueprintSummary) => void;
}) {
  const [draft, setDraft] = useState<BlueprintDocument>(emptyBlueprint);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(mode === "edit");
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    if (mode === "create") {
      setDraft(emptyBlueprint());
      setIsLoading(false);
      return;
    }
    if (!blueprintId) return;
    setIsLoading(true);
    setError("");
    fetch(`/api/blueprints/${encodeURIComponent(blueprintId)}`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not load blueprint");
        setDraft(data.blueprint);
      })
      .catch((loadError) => setError(loadError?.message || String(loadError)))
      .finally(() => setIsLoading(false));
  }, [blueprintId, mode]);

  function update<K extends keyof BlueprintDocument>(key: K, value: BlueprintDocument[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function saveBlueprint() {
    setError("");
    startTransition(async () => {
      try {
        const payload = {
          id: draft.id,
          title: draft.title,
          genre: draft.genre || "story",
          logline: draft.logline,
          targetSeconds: draft.targetSeconds,
          minSeconds: draft.minSeconds,
          countdown: draft.countdown,
          cta: draft.cta,
          cast: draft.cast,
          body: draft.body,
        };
        const response = await fetch(mode === "create" ? "/api/blueprints" : `/api/blueprints/${encodeURIComponent(blueprintId || draft.id)}`, {
          method: mode === "create" ? "POST" : "PUT",
          headers: { "content-type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Could not save blueprint");
        onSaved(data.blueprint);
      } catch (saveError: any) {
        setError(saveError?.message || String(saveError));
      }
    });
  }

  return (
    <div className={styles.backdrop} role="dialog" aria-modal="true" aria-label="Blueprint editor">
      <section className={styles.modal}>
        <header className={styles.header}>
          <div>
            <p>{mode === "create" ? "New blueprint" : "Edit blueprint"}</p>
            <h2>{mode === "create" ? "Create trailer story clay" : draft.title || blueprintId}</h2>
          </div>
          <button onClick={onClose}>Close</button>
        </header>

        {isLoading ? <div className={styles.loading}>Loading blueprint...</div> : (
          <div className={styles.formGrid}>
            <label className={styles.field}>
              <span>Blueprint id</span>
              <input
                value={draft.id}
                onChange={(event) => update("id", event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"))}
                disabled={mode === "edit"}
                placeholder="08-new-trailer"
              />
            </label>

            <label className={styles.field}>
              <span>Title</span>
              <input value={draft.title} onChange={(event) => update("title", event.target.value)} placeholder="America Woke Up Late" />
            </label>
            <label>
              <span>Genre</span>
              <select value={draft.genre || "story"} onChange={(event) => update("genre", event.target.value)}>
                {["story", "skit", "faceoff", "lore", "recap", "anthem", "edit", "loop"].map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </label>

            <label className={styles.field}>
              <span>Target seconds</span>
              <input type="number" value={draft.targetSeconds} onChange={(event) => update("targetSeconds", Number(event.target.value))} />
            </label>

            <label className={styles.field}>
              <span>Min seconds</span>
              <input type="number" value={draft.minSeconds} onChange={(event) => update("minSeconds", Number(event.target.value))} />
            </label>

            <label className={styles.field}>
              <span>Countdown</span>
              <input value={draft.countdown} onChange={(event) => update("countdown", event.target.value)} placeholder="04:20:00" />
            </label>

            <label className={styles.field}>
              <span>Cast ids</span>
              <input value={draft.cast.join(",")} onChange={(event) => update("cast", event.target.value.split(",").map((item) => item.trim()).filter(Boolean))} placeholder="rex,volkov" />
            </label>

            <label className={`${styles.field} ${styles.full}`}>
              <span>Logline</span>
              <input value={draft.logline} onChange={(event) => update("logline", event.target.value)} placeholder="One sentence describing the hook and turn." />
            </label>

            <label className={`${styles.field} ${styles.full}`}>
              <span>CTA</span>
              <input value={draft.cta} onChange={(event) => update("cta", event.target.value)} />
            </label>

            <label className={`${styles.field} ${styles.full}`}>
              <span>Blueprint markdown body</span>
              <textarea value={draft.body} onChange={(event) => update("body", event.target.value)} spellCheck={false} />
            </label>
          </div>
        )}

        <footer className={styles.footer}>
          <p>{error || "Saves directly to trailer/blueprints. Existing blueprint ids are locked to avoid accidental renames."}</p>
          <button className={styles.saveButton} onClick={saveBlueprint} disabled={isPending || isLoading}>
            {isPending ? "Saving..." : "Save blueprint"}
          </button>
        </footer>
      </section>
    </div>
  );
}
