/**
 * Trailer script pipeline runner (standalone testbed — run with tsx).
 *
 *   npx tsx trailer/pipeline/run.ts <blueprintId>            # run all 6 passes
 *   npx tsx trailer/pipeline/run.ts 01                       # (id prefix match works)
 *   npx tsx trailer/pipeline/run.ts 01 --from 3 --to 5       # re-run a pass range (resumes from saved)
 *   npx tsx trailer/pipeline/run.ts 01 --only dialogue       # run a single pass by id
 *   TRAILER_LLM_MODEL=gemini-2.5-pro npx tsx trailer/pipeline/run.ts 01
 *
 * Each pass writes its output to trailer/out/<id>/NN-<pass>.md so you can inspect
 * + finalize every stage (the whole point — watch the dialogue improve pass by
 * pass). The final pass writes trailer/out/<id>/scenes.json (Seedance-ready shots).
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PASSES } from "./passes.js";
import { callLLM, parseJsonLoose, activeModel } from "./llm.js";
import { lintText, lintScreenplay, lintFrames, applyLint } from "./lint.js";
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
  return {
    id,
    title: fm.title || id,
    targetSeconds: Number(fm.targetSeconds || 75),
    minSeconds: Number(fm.minSeconds || 24),
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

  console.log(`\n🎬 ${bp.title}`);
  console.log(`   model: ${activeModel()} · target ${bp.targetSeconds}s · seedance-max ${SEEDANCE_MAX}s · passes ${from}-${to}\n`);

  const fileFor = (i: number) => path.join(outDir, `${String(i).padStart(2, "0")}-${PASSES[i - 1].id}.md`);

  // Seed `prev` from the prior pass's saved output (so --from resumes mid-pipeline).
  let prev = "";
  if (from > 1) {
    const priorFile = fileFor(from - 1);
    if (!fs.existsSync(priorFile)) throw new Error(`--from ${from} needs ${path.basename(priorFile)} — run earlier passes first.`);
    prev = fs.readFileSync(priorFile, "utf8");
  }

  for (let i = from; i <= to; i++) {
    const pass = PASSES[i - 1];
    const stageId = `script:${pass.id}`;
    const t0 = Date.now();
    process.stdout.write(`   [${i}/${PASSES.length}] ${pass.name.padEnd(20)} `);
    beginRunStage(outDir, {
      id: stageId,
      kind: pass.id === "compile" ? "compile" : pass.id === "frames" ? "frames" : "script",
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
      if (pass.kind === "json" && pass.id === "frames") {
        // FRAMES pass: enrich the existing scenes.json with frame plans + the LOOK block.
        const parsed = await parseJsonOrRepair<any>(out, pass.id);
        if (!Array.isArray(parsed.sequences)) throw new Error("frames returned no sequences[]");
        const scenesPath = path.join(outDir, "scenes.json");
        if (!fs.existsSync(scenesPath)) throw new Error("frames pass needs scenes.json — run the compile pass first.");
        const screenplay: Screenplay = JSON.parse(fs.readFileSync(scenesPath, "utf8"));
        applyLint("frames", lintFrames(parsed, screenplay));
        const byN = new Map(parsed.sequences.map((q: any) => [Number(q.n), q]));
        let starts = 0, ends = 0;
        for (const seq of screenplay.sequences || []) {
          const plan: any = byN.get(Number(seq.n));
          if (!plan?.startFrame?.prompt) throw new Error(`frames pass missing startFrame for sequence ${seq.n}`);
          seq.startFrame = plan.startFrame;
          starts++;
          if (plan.endFrame?.prompt) { seq.endFrame = plan.endFrame; ends++; }
        }
        if (typeof parsed.look === "string" && parsed.look.trim()) screenplay.look = parsed.look.trim();
        fs.writeFileSync(scenesPath, JSON.stringify(screenplay, null, 2));
        writeDraftCanonSidecar(screenplay, outDir);
        fs.writeFileSync(fileFor(i), "```json\n" + JSON.stringify(parsed, null, 2) + "\n```");
        registerRunArtifact(outDir, { kind: "json", label: "Frame pass output", path: path.basename(fileFor(i)) });
        registerRunArtifact(outDir, { kind: "json", label: "Seedance-ready scenes", path: "scenes.json" });
        refreshRunManifestFromScreenplay(outDir, screenplay, { llmCalls: i });
        completeRunStage(outDir, stageId, { outputFiles: [path.basename(fileFor(i)), "scenes.json", "subtitles.srt", "subtitles.vtt"] });
        console.log(`✓ ${((Date.now() - t0) / 1000).toFixed(1)}s — ${starts} start frames, ${ends} end frames, look ${screenplay.look ? "set" : "MISSING"} → scenes.json`);
      } else if (pass.kind === "json") {
        // COMPILE pass: build the sequence-based scenes.json.
        const parsed = await parseJsonOrRepair<any>(out, pass.id);
        const sequences = parsed?.sequences;
        if (!Array.isArray(sequences) || sequences.length === 0) throw new Error("compile returned no sequences[]");
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
        const screenplay: Screenplay = {
          blueprintId: bp.id,
          title: parsed.title || bp.title,
          logline: parsed.logline || bp.logline,
          canonPlan: parsed.canonPlan,
          spine: parsed.spine,
          totalSeconds: sequences.reduce((s: number, q: any) => s + (Number(q.durationSec) || 0), 0),
          sequences,
          shots,
          endCard: parsed.endCard || { countdown: bp.countdown, cta: bp.cta },
        };
        applyLint("compile", lintScreenplay(screenplay, prev, SEEDANCE_MAX));
        fs.writeFileSync(path.join(outDir, "scenes.json"), JSON.stringify(screenplay, null, 2));
        writeDraftCanonSidecar(screenplay, outDir);
        fs.writeFileSync(fileFor(i), "```json\n" + JSON.stringify(screenplay, null, 2) + "\n```");
        registerRunArtifact(outDir, { kind: "json", label: "Compile pass output", path: path.basename(fileFor(i)) });
        registerRunArtifact(outDir, { kind: "json", label: "Seedance-ready scenes", path: "scenes.json" });
        refreshRunManifestFromScreenplay(outDir, screenplay, { llmCalls: i });
        completeRunStage(outDir, stageId, { outputFiles: [path.basename(fileFor(i)), "scenes.json", "subtitles.srt", "subtitles.vtt"] });
        prev = JSON.stringify(screenplay, null, 2); // feed the frames pass
        console.log(`✓ ${((Date.now() - t0) / 1000).toFixed(1)}s — ${sequences.length} sequences / ${shots.length} shots, ~${screenplay.totalSeconds}s → scenes.json`);
      } else {
        applyLint(pass.id, lintText(pass.id, out, bp, SEEDANCE_MAX));
        fs.writeFileSync(fileFor(i), out);
        registerRunArtifact(outDir, { kind: "script", label: `${i}. ${pass.name}`, path: path.basename(fileFor(i)) });
        completeRunStage(outDir, stageId, { outputFiles: [path.basename(fileFor(i))] });
        prev = out;
        console.log(`✓ ${((Date.now() - t0) / 1000).toFixed(1)}s → ${path.basename(fileFor(i))}`);
      }
    } catch (e: any) {
      failRunStage(outDir, stageId, e);
      console.log(`✗ ${e?.message || e}`);
      throw e;
    }
  }
  console.log(`\n✅ done → trailer/out/${bp.id}/  (inspect each NN-*.md; final = scenes.json)\n`);
}

main().catch((e) => {
  console.error("\npipeline failed:", e?.message || e);
  process.exit(1);
});
