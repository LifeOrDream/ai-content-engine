/**
 * Trailer generation orchestrator. Loads scenes.json (the script pipeline's
 * output) and renders it.
 *
 * SEQUENCE MODE (scenes.json with sequences[] — the current pipeline):
 *   each sequence = ONE Seedance timeline generation (native cuts + audio):
 *   start frame (ref-anchored, cached) → timeline video → timed captions →
 *   normalize. Sequences render IN ORDER so env:seqN.startFrame reference
 *   chains resolve. Then: concat → end card (+ optional music bed from
 *   TRAILER_MUSIC_URL / local file — NO AI bed by default since audio is
 *   native) → brand → final.mp4.
 *
 * LEGACY SHOT MODE (old per-shot scenes.json): keyframe → i2v → TTS mux →
 *   sfx → caption, per shot. Kept for old artifacts.
 *
 * Two review modes (both modes):
 *   • approvePerScene = false → render everything, then assemble.
 *   • approvePerScene = true  → after each clip, (optionally) push to Telegram
 *     + wait on stdin: [enter]=approve · r=regenerate · s=stop.
 *
 * Resumable: clips are saved (sequences/seq_NN.mp4 or scenes/scene_NN.mp4);
 * re-runs reuse existing files. Final → out/<id>/final.mp4.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { renderScene } from "./renderScene.js";
import { renderSequence } from "./renderSequence.js";
import { assembleTrailer } from "./assemble.js";
import { resolveMusicBed } from "./audio.js";
import { mixMusicBed } from "./ffmpeg.js";
import { uploadBufferToS3 } from "../../src/utils/falMedia.js";
import type { Screenplay, Sequence, Shot } from "../pipeline/types.js";

/** A trailer-score mood prompt for the music bed (legacy mode only — sequence mode uses native audio). */
function musicPromptFor(sp: Screenplay): string {
  return (
    process.env.TRAILER_MUSIC_PROMPT ||
    `Cinematic crypto launch trailer score for "${sp.title}". Dark, tense, building electronic synth, ominous bass, modern, driving, instrumental, no vocals.`
  );
}

export interface GenerateOpts {
  approvePerScene: boolean;
  telegramScenes: boolean; // push each clip to Telegram for review
  fromScene: number; // 1-based (scene OR sequence number)
  onlyScene?: number;
  regen: boolean; // force re-render even if a clip file exists
  assemble: boolean; // build final.mp4 at the end
}

const RENDER_SCRIPTED_END_CARD = process.env.TRAILER_RENDER_SCRIPTED_END_CARD === "true";

function ask(q: string): Promise<string> {
  if (!process.stdin.isTTY) return Promise.resolve(""); // non-interactive → auto-approve
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((res) => rl.question(q, (a) => { rl.close(); res(a.trim().toLowerCase()); }));
}

async function pushToTelegram(buf: Buffer, scratch: string, n: number, label: string, line: string, musicBed?: Buffer | null): Promise<void> {
  try {
    const { sendTelegramVideo } = await import("../../src/services/telegram.service.js");
    // Mix the music bed into the REVIEW copy only (saved clips stay bed-free).
    let review = buf;
    if (musicBed) { try { review = await mixMusicBed(buf, musicBed, Number(process.env.TRAILER_MUSIC_VOLUME || 0.16)); } catch { /* send dry */ } }
    const url = await uploadBufferToS3(`${scratch}/review/clip_${n}.mp4`, review, "video/mp4");
    await sendTelegramVideo(url, `🎬 ${label} ${n} — review. "${line.slice(0, 120)}"`, { parseMode: "HTML" });
  } catch { /* best-effort */ }
}

export async function generateTrailer(scenesPath: string, outDir: string, opts: GenerateOpts): Promise<string | null> {
  const screenplay: Screenplay = JSON.parse(fs.readFileSync(scenesPath, "utf8"));
  if (screenplay.sequences && screenplay.sequences.length > 0) {
    return generateFromSequences(screenplay, outDir, opts);
  }
  return generateFromShots(screenplay, outDir, opts);
}

// ───────────────────────── SEQUENCE MODE (current) ─────────────────────────

async function generateFromSequences(screenplay: Screenplay, outDir: string, opts: GenerateOpts): Promise<string | null> {
  const allSequences: Sequence[] = [...(screenplay.sequences || [])].sort((a, b) => a.n - b.n);
  const isScriptedEndCard = (seq: Sequence) =>
    /end[_ -]?card/i.test(seq.label || "") ||
    (seq.shots || []).some((shot) => shot.beat === "end_card");
  const skippedEndCards = RENDER_SCRIPTED_END_CARD ? [] : allSequences.filter(isScriptedEndCard);
  const sequences = RENDER_SCRIPTED_END_CARD ? allSequences : allSequences.filter((seq) => !isScriptedEndCard(seq));
  const seqDir = path.join(outDir, "sequences");
  fs.mkdirSync(seqDir, { recursive: true });
  const scratch = `socials/trailers/${screenplay.blueprintId || "trailer"}`;
  const promptDumpDir = path.join(outDir, "prompts");

  console.log(`\n🎬 ${screenplay.title} — ${sequences.length} renderable sequences (${screenplay.shots?.length || 0} shots), ~${screenplay.totalSeconds}s`);
  console.log(`   mode: SEQUENCE (Seedance timeline, native audio) · ${opts.approvePerScene ? "APPROVE-PER-SEQUENCE" : "full auto"} · resume: ${!opts.regen}\n`);
  if (skippedEndCards.length) {
    console.log(`   end card: ${skippedEndCards.length} scripted cue skipped for Seedance; deterministic brand/countdown card will be appended`);
  }

  // Music bed: explicit sources ONLY (TRAILER_MUSIC_URL / trailer/assets/music.mp3).
  // No AI-generated bed — sequence audio (voices/SFX/music mood) is Seedance-native.
  let musicBed: Buffer | null = null;
  try { musicBed = await resolveMusicBed(undefined, Math.min(47, (screenplay.totalSeconds || 32) + 6)); } catch { /* none */ }
  if (musicBed) console.log("   music bed: explicit source found — will be mixed UNDER native audio at assembly");

  const clips: (Buffer | null)[] = new Array(sequences.length).fill(null);

  for (let i = 0; i < sequences.length; i++) {
    const seq = sequences[i];
    const file = path.join(seqDir, `seq_${String(seq.n).padStart(2, "0")}.mp4`);
    if (opts.onlyScene && seq.n !== opts.onlyScene) {
      if (fs.existsSync(file)) clips[i] = fs.readFileSync(file);
      continue;
    }
    if (seq.n < opts.fromScene) {
      if (fs.existsSync(file)) clips[i] = fs.readFileSync(file);
      continue;
    }
    if (fs.existsSync(file) && !opts.regen) {
      console.log(`   [${seq.n}/${sequences.length}] ✓ cached (${path.basename(file)})`);
      clips[i] = fs.readFileSync(file);
      continue;
    }

    let approved = false;
    while (!approved) {
      const t0 = Date.now();
      process.stdout.write(`   [${seq.n}/${sequences.length}] rendering ${seq.label}${seq.signature ? " ★signature" : ""}… `);
      try {
        const r = await renderSequence(seq, screenplay.look, outDir, scratch, { regen: opts.regen, promptDumpDir });
        fs.writeFileSync(file, r.buffer);
        clips[i] = r.buffer;
        console.log(`\n      ✓ ${((Date.now() - t0) / 1000).toFixed(1)}s — ${r.seconds.toFixed(1)}s clip → ${path.basename(file)}`);
      } catch (e: any) {
        console.log(`✗ ${e?.message || e}`);
        if (!opts.approvePerScene) throw e;
      }

      if (!opts.approvePerScene) { approved = true; break; }
      if (opts.telegramScenes && clips[i]) {
        const line = seq.shots?.find((s) => s.dialogue?.length)?.dialogue?.[0]?.line || seq.label;
        await pushToTelegram(clips[i]!, scratch, seq.n, "Sequence", line, musicBed);
      }
      const a = await ask(`       approve sequence ${seq.n}? [enter]=yes · r=regenerate · s=stop: `);
      if (a === "r") { approved = false; opts.regen = true; continue; }
      if (a === "s") { console.log("   stopped by user."); return null; }
      approved = true;
    }
  }

  if (!opts.assemble) { console.log(`\n✅ sequences done → ${seqDir}/ (assembly skipped)\n`); return null; }

  console.log(`\n   assembling…`);
  const ordered = clips.filter((b): b is Buffer => !!b && b.length > 0);
  const final = await assembleTrailer(ordered, {
    countdown: screenplay.endCard?.countdown || "",
    musicBed,
    appendEndCard: skippedEndCards.length > 0 || !allSequences.some(isScriptedEndCard),
    endCardSeconds: skippedEndCards.reduce((sum, seq) => sum + Math.max(0, Number(seq.durationSec) || 0), 0) || undefined,
  });
  if (!final) { console.log("   assembly produced nothing"); return null; }
  const finalPath = path.join(outDir, "final.mp4");
  fs.writeFileSync(finalPath, final);
  console.log(`\n✅ FINAL → ${finalPath}  (${ordered.length} sequences)\n`);
  return finalPath;
}

// ───────────────────────── LEGACY SHOT MODE ─────────────────────────

async function generateFromShots(screenplay: Screenplay, outDir: string, opts: GenerateOpts): Promise<string | null> {
  const shots = screenplay.shots || [];
  const scenesDir = path.join(outDir, "scenes");
  fs.mkdirSync(scenesDir, { recursive: true });
  const scratch = `socials/trailers/${screenplay.blueprintId || "trailer"}`;

  console.log(`\n🎬 ${screenplay.title} — ${shots.length} scenes, ~${screenplay.totalSeconds}s`);
  console.log(`   mode: LEGACY per-shot · ${opts.approvePerScene ? "APPROVE-PER-SCENE" : "full auto"} · resume: ${!opts.regen}\n`);

  let musicBed: Buffer | null = null;
  try {
    process.stdout.write("   resolving music bed… ");
    musicBed = await resolveMusicBed(musicPromptFor(screenplay), Math.min(47, (screenplay.totalSeconds || 32) + 6));
    console.log(musicBed ? "✓" : "none (no source / gen off)");
  } catch { console.log("none"); }

  const sceneBuffers: (Buffer | null)[] = new Array(shots.length).fill(null);

  for (let i = 0; i < shots.length; i++) {
    const shot = shots[i] as Shot;
    if (opts.onlyScene && shot.n !== opts.onlyScene) continue;
    const file = path.join(scenesDir, `scene_${String(shot.n).padStart(2, "0")}.mp4`);
    if (shot.n < opts.fromScene) {
      if (fs.existsSync(file)) sceneBuffers[i] = fs.readFileSync(file);
      continue;
    }
    if (fs.existsSync(file) && !opts.regen) {
      console.log(`   [${shot.n}/${shots.length}] ✓ cached (${path.basename(file)})`);
      sceneBuffers[i] = fs.readFileSync(file);
      continue;
    }

    let approved = false;
    while (!approved) {
      const t0 = Date.now();
      process.stdout.write(`   [${shot.n}/${shots.length}] rendering ${shot.beat}… `);
      try {
        const r = await renderScene(shot, scratch, { promptDumpDir: path.join(outDir, "prompts") });
        fs.writeFileSync(file, r.buffer);
        sceneBuffers[i] = r.buffer;
        console.log(`✓ ${((Date.now() - t0) / 1000).toFixed(1)}s — ${r.seconds.toFixed(1)}s${r.lipsynced ? ", lipsync" : ""}${r.aiShot ? "" : ", plate"} → ${path.basename(file)}`);
      } catch (e: any) {
        console.log(`✗ ${e?.message || e}`);
        if (!opts.approvePerScene) throw e;
      }

      if (!opts.approvePerScene) { approved = true; break; }
      if (opts.telegramScenes && sceneBuffers[i]) {
        const line = shot.dialogue?.[0]?.line || shot.caption || shot.action || "";
        await pushToTelegram(sceneBuffers[i]!, scratch, shot.n, `Scene (${shot.beat})`, line, musicBed);
      }
      const a = await ask(`       approve scene ${shot.n}? [enter]=yes · r=regenerate · s=stop: `);
      if (a === "r") { approved = false; continue; }
      if (a === "s") { console.log("   stopped by user."); return null; }
      approved = true;
    }
  }

  if (!opts.assemble) { console.log(`\n✅ scenes done → ${scenesDir}/ (assembly skipped)\n`); return null; }

  console.log(`\n   assembling…`);
  const ordered = sceneBuffers.filter((b): b is Buffer => !!b && b.length > 0);
  const final = await assembleTrailer(ordered, { countdown: screenplay.endCard?.countdown || "", musicBed });
  if (!final) { console.log("   assembly produced nothing"); return null; }
  const finalPath = path.join(outDir, "final.mp4");
  fs.writeFileSync(finalPath, final);
  console.log(`\n✅ FINAL → ${finalPath}  (${ordered.length} scenes)\n`);
  return finalPath;
}
