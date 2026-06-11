/**
 * Trailer script pipeline runner v2 (standalone testbed — run with tsx).
 *
 *   npx tsx trailer/pipeline/run.ts <blueprintId>            # both passes (2 LLM calls)
 *   npx tsx trailer/pipeline/run.ts 01                       # (id prefix match works)
 *   npx tsx trailer/pipeline/run.ts 01 --only produce        # re-run one pass (resumes from saved)
 *   npx tsx trailer/pipeline/run.ts 01 --from 2              # same thing, by index
 *   TRAILER_LLM_MODEL=anthropic/claude-sonnet-4.6 npx tsx trailer/pipeline/run.ts 01
 *
 * Pass 1 (script)  → out/<id>/01-script.md   — the locked script + candidates + overlays
 * Pass 2 (produce) → out/<id>/02-produce.md  + scenes.json — fully render-ready
 *
 * SELF-HEAL: when the produce pass fails lint, ONE targeted repair call fixes
 * exactly the listed violations (dialogue stays verbatim) before lint re-runs.
 * Worst case = 3 LLM calls; normal case = 2 (v1 was 6 + repairs).
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PASSES } from "./passes.js";
import { callLLM, parseJsonLoose, activeModel } from "./llm.js";
import { lintText, lintScreenplay, lintFrames, lintOverlays, applyLint } from "./lint.js";
import { genreSpec } from "../style/genres.js";
import type { Blueprint, Screenplay } from "./types.js";
import { buildReferenceAssetPromptBlock } from "../world/assetRegistry.js";
import { CINEMATIC_PRODUCTION_PLAN } from "../world/cinematicProduction.js";
import { buildShowrunnerMemoryPacket, writeDraftCanonSidecar } from "../world/storyMemory.js";
import { buildCountryCastPromptBlock } from "../world/countryCastRegistry.js";
import { buildLocationPromptBlock } from "../world/locationRegistry.js";
import {
  beginRunStage,
  completeRunStage,
  ensureRunManifest,
  failRunStage,
  refreshRunManifestFromScreenplay,
  registerRunArtifact,
} from "./runManifest.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const BLUEPRINTS = path.join(ROOT, "blueprints");
const OUT = path.join(ROOT, "out");
/** Per-SEQUENCE max seconds — one Seedance 2.0 generation (timeline prompt with native cuts). */
const SEEDANCE_MAX = Math.min(15, Math.max(6, Number(process.env.TRAILER_SEEDANCE_MAX_SEC || 15)));
const SELF_HEAL = process.env.TRAILER_SELF_HEAL !== "false";

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

/** Parse the light frontmatter (--- key: value ---) + body from a blueprint .md. */
function parseBlueprint(file: string): Blueprint {
  const raw = fs.readFileSync(file, "utf8");
  const m = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const fm: Record<string, string> = {};
  let body = raw;
  if (m) {
    body = m[2].trim();
    for (const line of m[1].split("\n")) {
      const i = line.indexOf(":");
      if (i > 0) fm[line.slice(0, i).trim()] = line.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    }
  }
  const id = fm.id || path.basename(file).replace(/\.md$/, "");
  const genre = fm.genre || "story";
  // Duration defaults are genre-aware: a `genre: skit` blueprint must not
  // inherit the 75s/24s story defaults (the genre template says 8-20s — the
  // two instructions would contradict inside one prompt). Explicit
  // frontmatter always wins.
  const band = genreSpec(genre).durationBand;
  const defaultTarget = genre === "story" ? 75 : band[1];
  const defaultMin = genre === "story" ? 24 : band[0];
  const aspect = ["16:9", "9:16", "1:1"].includes((fm.aspect || "").trim())
    ? fm.aspect.trim()
    : (process.env.TRAILER_ASPECT || "16:9");
  return {
    id,
    title: fm.title || id,
    genre,
    aspect,
    targetSeconds: Number(fm.targetSeconds || defaultTarget),
    minSeconds: Number(fm.minSeconds || defaultMin),
    countdown: fm.countdown || "24:00:00",
    cta: fm.cta || "Mine your HashBeast — minebtc.fun",
    logline: fm.logline || "",
    cast: (fm.cast || "").split(",").map((s) => s.trim()).filter(Boolean),
    body,
  };
}

function resolveBlueprint(idArg: string): Blueprint {
  const files = fs.readdirSync(BLUEPRINTS).filter((f) => f.endsWith(".md") && !f.startsWith("00-"));
  const hit =
    files.find((f) => f.replace(/\.md$/, "") === idArg) ||
    files.find((f) => f.startsWith(idArg)) ||
    files.find((f) => f.includes(idArg));
  if (!hit) throw new Error(`No blueprint matching "${idArg}". Available: ${files.join(", ")}`);
  return parseBlueprint(path.join(BLUEPRINTS, hit));
}

async function parseJsonOrRepair<T>(raw: string, passId: string): Promise<T> {
  const parsed = parseJsonLoose<T>(raw);
  if (parsed) return parsed;
  const repaired = await callLLM(
    [
      "Repair this malformed model output into STRICT valid JSON only.",
      "Do not add new story content. Preserve all fields, dialogue, timestamps, refs, and prompt text exactly where possible.",
      `Pass id: ${passId}`,
      "Return ONLY the corrected JSON object, no markdown.",
      "",
      raw,
    ].join("\n"),
    { temperature: 0.1, json: true },
  );
  const repairedParsed = parseJsonLoose<T>(repaired);
  if (!repairedParsed) throw new Error(`${passId} returned invalid JSON and repair failed`);
  return repairedParsed;
}

/** Assemble the Screenplay object from the produce pass's parsed JSON. */
function buildScreenplay(parsed: any, bp: Blueprint): Screenplay {
  const sequences = parsed?.sequences;
  if (!Array.isArray(sequences) || sequences.length === 0) throw new Error("produce returned no sequences[]");
  // Flattened per-shot view (assembly/captions + legacy renderer compatibility).
  const shots = sequences.flatMap((q: any, qi: number) =>
    (Array.isArray(q.shots) ? q.shots : []).map((sh: any) => ({
      ...sh,
      sequence: Number(q.n) || qi + 1,
      durationSec: Math.max(0, (Number(sh.endSec) || 0) - (Number(sh.startSec) || 0)),
      location: sh.location || q.location,
      timeOfDay: sh.timeOfDay || q.timeOfDay,
    })),
  );
  return {
    blueprintId: bp.id,
    title: parsed.title || bp.title,
    logline: parsed.logline || bp.logline,
    genre: parsed.genre || bp.genre || "story",
    aspect: bp.aspect || "16:9",
    canonPlan: parsed.canonPlan,
    spine: parsed.spine,
    hookCandidates: parsed.hookCandidates,
    overlays: Array.isArray(parsed.overlays) ? parsed.overlays : [],
    look: typeof parsed.look === "string" ? parsed.look.trim() : undefined,
    totalSeconds: sequences.reduce((s: number, q: any) => s + (Number(q.durationSec) || 0), 0),
    sequences,
    shots,
    endCard: parsed.endCard || { countdown: bp.countdown, cta: bp.cta },
  };
}

/** Lint the produce output end-to-end (screenplay + frames + overlays). */
function lintProduce(parsed: any, screenplay: Screenplay, lockedScript: string) {
  const a = lintScreenplay(screenplay, lockedScript, SEEDANCE_MAX);
  const b = lintFrames(parsed, screenplay); // errors on any sequence missing startFrame.prompt
  const c = lintOverlays(screenplay);
  return { errors: [...a.errors, ...b.errors, ...c.errors], warnings: [...a.warnings, ...b.warnings, ...c.warnings] };
}

async function main() {
  const idArg = process.argv[2];
  if (!idArg || idArg.startsWith("--")) {
    const files = fs.readdirSync(BLUEPRINTS).filter((f) => f.endsWith(".md") && !f.startsWith("00-"));
    console.log("Usage: npx tsx trailer/pipeline/run.ts <blueprintId> [--from N] [--to N] [--only passId]");
    console.log("Blueprints:\n  " + files.map((f) => "• " + f.replace(/\.md$/, "")).join("\n  "));
    console.log("Passes:\n  " + PASSES.map((p, i) => `  ${i + 1}. ${p.id} — ${p.goal}`).join("\n"));
    return;
  }

  const bp = resolveBlueprint(idArg);
  const bible = fs.readFileSync(path.join(BLUEPRINTS, "00-series-bible.md"), "utf8");
  const outDir = path.join(OUT, bp.id);
  fs.mkdirSync(outDir, { recursive: true });
  ensureRunManifest(outDir, bp);
  const showrunnerPacket = buildShowrunnerMemoryPacket({ blueprint: bp });
  const referenceAssetBlock = buildReferenceAssetPromptBlock();
  const countryCharacterBlock = buildCountryCastPromptBlock();
  const locationStoryboardBlock = buildLocationPromptBlock();

  const only = arg("--only");
  const from = only ? PASSES.findIndex((p) => p.id === only) + 1 : Number(arg("--from") || 1);
  const to = only ? from : Number(arg("--to") || PASSES.length);
  if (only && from === 0) throw new Error(`Unknown pass "${only}". Passes: ${PASSES.map((p) => p.id).join(", ")}`);

  console.log(`\n🎬 ${bp.title}`);
  console.log(`   model: ${activeModel()} · genre ${bp.genre} · target ${bp.targetSeconds}s · seedance-max ${SEEDANCE_MAX}s · passes ${from}-${to}\n`);

  const fileFor = (i: number) => path.join(outDir, `${String(i).padStart(2, "0")}-${PASSES[i - 1].id}.md`);

  // Seed `prev` from the prior pass's saved output (so --from resumes mid-pipeline).
  let prev = "";
  if (from > 1) {
    const priorFile = fileFor(from - 1);
    if (!fs.existsSync(priorFile)) throw new Error(`--from ${from} needs ${path.basename(priorFile)} — run earlier passes first.`);
    prev = fs.readFileSync(priorFile, "utf8");
  }

  let llmCalls = 0;
  for (let i = from; i <= to; i++) {
    const pass = PASSES[i - 1];
    const stageId = `script:${pass.id}`;
    const t0 = Date.now();
    process.stdout.write(`   [${i}/${PASSES.length}] ${pass.name.padEnd(20)} `);
    beginRunStage(outDir, {
      id: stageId,
      kind: pass.id === "produce" ? "compile" : "script",
      label: `${i}. ${pass.name}`,
      model: activeModel(),
      command: ["npm", "run", "trailer:script", "--", bp.id, "--only", pass.id],
      outputFiles: [path.basename(fileFor(i))],
    });
    try {
      const out = await callLLM(pass.build(prev, {
        bible,
        blueprint: bp,
        seedanceMaxSec: SEEDANCE_MAX,
        showrunnerPacket,
        referenceAssetBlock,
        countryCharacterBlock,
        locationStoryboardBlock,
        productionPlanningBlock: CINEMATIC_PRODUCTION_PLAN,
      }), {
        temperature: pass.temperature ?? (pass.kind === "json" ? 0.4 : 0.9),
        json: pass.kind === "json",
      });
      llmCalls++;
      if (pass.kind === "json") {
        // PRODUCE pass: one JSON carries sequences + frames + look + overlays.
        let parsed = await parseJsonOrRepair<any>(out, pass.id);
        let screenplay = buildScreenplay(parsed, bp);
        let lint = lintProduce(parsed, screenplay, prev);

        // SELF-HEAL: targeted repair calls fix exactly the listed violations,
        // then lint re-runs. Dialogue is immutable — timing violations are
        // fixed by RE-TIMING (extend the shot window, shrink a neighboring
        // silent shot, or split the sequence), never by trimming lines.
        // Skipped entirely when lint is off (the output would ship anyway).
        const lintMode = (process.env.TRAILER_LINT || "strict").toLowerCase();
        for (let heal = 0; lint.errors.length > 0 && SELF_HEAL && lintMode !== "off" && heal < 2; heal++) {
          console.log(`\n      ⛑ ${lint.errors.length} lint error(s) — repair call ${heal + 1}/2…`);
          const healed = await callLLM(
            [
              "You are repairing a compiled scenes JSON for a video pipeline. Fix ONLY the violations listed below — change nothing else. Return the COMPLETE corrected JSON object (all sequences, not just the fixed ones).",
              "HARD RULES:",
              "- Every dialogue line and delivery stays VERBATIM as found in the locked script. Never trim, rephrase, or drop a line.",
              `- \"dialogue won't fit the slot\" violations are fixed by RE-TIMING: extend that shot's endSec (shifting later shots), shrink a neighboring silent shot, or split the sequence at a shot boundary — the slot must satisfy words ÷ 2.3 + 0.5s ≤ (endSec − startSec).`,
              `- Sequences stay ≤${SEEDANCE_MAX}s (durationSec == last shot endSec; shot times re-zero per sequence; carry continuity via RULES when splitting).`,
              "- \"dialogue too sparse\" violations: shorten that shot's window or direct deliberate silence/reaction in its action/performance.",
              "- \"missing startFrame\" violations: author the still-frame prompt from that sequence's first shot and global block (this is repair, not new story — still dialect, zero motion words, identity-anchored, correct refs).",
              "- Never invent new story content; keep all field names and structure.",
              "",
              "VIOLATIONS TO FIX:",
              ...lint.errors.map((e) => `- ${e}`),
              "",
              "THE LOCKED SCRIPT (dialogue source of truth):",
              prev,
              "",
              "THE JSON TO REPAIR:",
              JSON.stringify(parsed),
              "",
              "Return ONLY the corrected JSON object, no markdown.",
            ].join("\n"),
            { temperature: 0.1, json: true },
          );
          llmCalls++;
          const healedParsed = parseJsonLoose<any>(healed);
          if (!healedParsed) break;
          // A structurally-broken heal (e.g. only the fixed fragment returned)
          // must REJECT the heal, not kill the run — the original is intact.
          try {
            const healedScreenplay = buildScreenplay(healedParsed, bp);
            const healedLint = lintProduce(healedParsed, healedScreenplay, prev);
            if (healedLint.errors.length < lint.errors.length) {
              parsed = healedParsed;
              screenplay = healedScreenplay;
              lint = healedLint;
            }
          } catch (healErr: any) {
            console.log(`      ⛑ repair rejected (${String(healErr?.message || healErr).slice(0, 120)})`);
          }
        }
        applyLint("produce", lint);

        fs.writeFileSync(path.join(outDir, "scenes.json"), JSON.stringify(screenplay, null, 2));
        writeDraftCanonSidecar(screenplay, outDir);
        fs.writeFileSync(fileFor(i), "```json\n" + JSON.stringify(screenplay, null, 2) + "\n```");
        registerRunArtifact(outDir, { kind: "json", label: "Produce pass output", path: path.basename(fileFor(i)) });
        registerRunArtifact(outDir, { kind: "json", label: "Seedance-ready scenes", path: "scenes.json" });
        refreshRunManifestFromScreenplay(outDir, screenplay, { llmCalls });
        completeRunStage(outDir, stageId, { outputFiles: [path.basename(fileFor(i)), "scenes.json", "subtitles.srt", "subtitles.vtt"] });
        prev = JSON.stringify(screenplay, null, 2);
        const frames = (screenplay.sequences || []).filter((s) => s.startFrame?.prompt).length;
        console.log(`✓ ${((Date.now() - t0) / 1000).toFixed(1)}s — ${screenplay.sequences?.length} sequences / ${screenplay.shots.length} shots / ${frames} start frames / ${screenplay.overlays?.length || 0} overlays, ~${screenplay.totalSeconds}s → scenes.json`);
      } else {
        // SCRIPT pass — self-heal lint errors with ONE targeted rewrite call.
        let script = out;
        let lint = lintText(pass.id, script, bp, SEEDANCE_MAX);
        const textLintMode = (process.env.TRAILER_LINT || "strict").toLowerCase();
        if (lint.errors.length > 0 && SELF_HEAL && textLintMode !== "off") {
          console.log(`\n      ⛑ ${lint.errors.length} lint error(s) — one repair call…`);
          const healed = await callLLM(
            [
              "You are the line doctor on a locked script. Fix ONLY the violations listed below — every other line, LOOP entry, delivery note, caption, and structural element stays VERBATIM.",
              "Rewrite each offending dialogue line as in-character BEHAVIOR (a taunt, dare, bluff, deflection, joke hiding fear) that still performs the shot's LOOP duty and fits the same spoken-time slot. Never use pitch-deck/mechanic words. If an overlay duplicates a line, rewrite the OVERLAY, not the dialogue. Keep the exact output format (SPINE, CANDIDATES, OVERLAYS, SHOT blocks).",
              "",
              "VIOLATIONS TO FIX:",
              ...lint.errors.map((e) => `- ${e}`),
              ...(lint.warnings.length ? ["", "WORTH FIXING IF TRIVIAL (warnings):", ...lint.warnings.map((w) => `- ${w}`)] : []),
              "",
              "THE SCRIPT:",
              script,
              "",
              "Output ONLY the corrected script.",
            ].join("\n"),
            { temperature: 0.5 },
          );
          llmCalls++;
          const healedLint = lintText(pass.id, healed, bp, SEEDANCE_MAX);
          if (healedLint.errors.length < lint.errors.length) {
            script = healed;
            lint = healedLint;
          }
        }
        applyLint(pass.id, lint);
        fs.writeFileSync(fileFor(i), script);
        registerRunArtifact(outDir, { kind: "script", label: `${i}. ${pass.name}`, path: path.basename(fileFor(i)) });
        completeRunStage(outDir, stageId, { outputFiles: [path.basename(fileFor(i))] });
        prev = script;
        console.log(`✓ ${((Date.now() - t0) / 1000).toFixed(1)}s → ${path.basename(fileFor(i))}`);
      }
    } catch (e: any) {
      failRunStage(outDir, stageId, e);
      console.log(`✗ ${e?.message || e}`);
      throw e;
    }
  }
  console.log(`\n✅ done → trailer/out/${bp.id}/  (${llmCalls} LLM call${llmCalls === 1 ? "" : "s"}; inspect 01-script.md + 02-produce.md; final = scenes.json)\n`);
}

main().catch((e) => {
  console.error("\npipeline failed:", e?.message || e);
  process.exit(1);
});
