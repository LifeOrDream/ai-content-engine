/**
 * THE OTHER MOONSHOT — locked-script production runner (blueprint
 * 06-the-other-moonshot). The founder approved the script VERBATIM, so this
 * runner does NOT call the LLM passes — it renders the locked shot list
 * exactly, reusing the repo's production machinery:
 *
 *   keyframes  : nano-banana-2/edit, grounded on the real game refs checked
 *                into trailer/reference/moonshot/ (live char GIF frames +
 *                byte-verified minted portraits)
 *   clips      : Seedance 2.0 i2v per shot — 720p, 9:16, ≤5s shots (seq 1 is
 *                two 5s script beats in one 10s generation)
 *   VO         : MiniMax voice-design + speech-02-hd via fal (calm procedural
 *                mission control; dry gravelly miner)
 *   music      : stable-audio (launch suspense 0:00-0:20 · HARD CUT to silence
 *                0:20-0:25 · electric arcade 0:25-0:38 · bell strike 0:38)
 *   text card  : composited drawtext over the silent ticker shot (NEVER
 *                generated-in-image)
 *   montage    : REAL product footage (seq 5) — built from FE screen capture
 *                by `--stage montage` (cuts.json) and treated as a cached clip
 *   end card   : scripts/render_card.py (real end-card machinery) with the
 *                Hashiden mark + "minebtc.fun / JULY 10"
 *   assembly   : concat → segmented score + VO mixed over ducked native audio
 *                → brandVideo badge → loudnorm → final.mp4
 *
 * Resumable: every artifact caches under trailer/out/06-the-other-moonshot/
 * (frames/, sequences/, audio/). Re-runs skip cached files unless --regen.
 *
 *   npx tsx trailer/generate/moonshot.ts                  # all stages
 *   npx tsx trailer/generate/moonshot.ts --stage frames   # one stage
 *   npx tsx trailer/generate/moonshot.ts --stage montage  # build seq_05 from
 *                                                         # captures/cuts.json
 */
// Env must be seeded BEFORE the ffmpeg/endCard modules load (they read it at
// module scope) — so everything repo-side is dynamically imported in main().
process.env.TRAILER_ASPECT = "9:16";
if (!process.env.CONTENT_FONT) {
  process.env.CONTENT_FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf";
}
if (!process.env.HASHBEAST_ANIM_PYTHON && process.platform === "darwin") {
  // local venv with Pillow for scripts/render_card.py (system python lacks PIL)
  process.env.HASHBEAST_ANIM_PYTHON = "/tmp/moonshot-venv/bin/python";
}

import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "out", "06-the-other-moonshot");
const FRAMES = path.join(OUT, "frames");
const SEQS = path.join(OUT, "sequences");
const AUDIO = path.join(OUT, "audio");
const CAPTURES = path.join(OUT, "captures");
const REF = path.join(ROOT, "reference");
const SCRATCH = "socials/trailers/06-the-other-moonshot";
const FONT = process.env.CONTENT_FONT!;
const VIDEO_RES = "720p";
const IMG_RES = (process.env.TRAILER_IMAGE_RES as "1K" | "2K") || "2K";

const mref = (...p: string[]) => path.join(REF, "moonshot", ...p);
const LOOK =
  "Premium 2D arcade-cel animation with pixel-art DNA, cinematic aerospace lighting, deep blacks, " +
  "fog and volumetric strobe light, orange ore-glow accents, vertical 9:16 composition, " +
  "no photorealism, no generic 3D CGI.";
const NO_TEXT =
  "No readable text, captions, numbers, logos, tickers, watermarks, speech bubbles, or UI anywhere in the image. " +
  "No country flags worn as clothing.";

interface ShotSpec {
  n: number;
  id: string;
  seconds: number; // Seedance duration request
  refs: string[]; // absolute image paths for nano-banana edit grounding
  framePrompt: string;
  endFrame?: { refs: string[]; prompt: string };
  timelinePrompt: string;
  generateAudio: boolean;
}

const SHOTS: ShotSpec[] = [
  {
    n: 1,
    id: "gantry-and-push",
    seconds: 10, // 0:00-0:05 gantry · 0:05-0:10 slow push (one generation)
    refs: [
      path.join(REF, "usa", "environments", "usa_command_plaza_war_room.png"),
      path.join(REF, "south_korea", "boards", "south_korea_environment_board.png"),
    ],
    framePrompt:
      "A pre-dawn orbital launch complex in heavy fog, seen from low on the pad apron looking up. " +
      "A towering generic commercial rocket stands on its launch gantry, plain white-and-grey hull with no markings, " +
      "venting thin streams of cryogenic steam. Red strobe beacons pulse through the rolling fog banks, " +
      "white floodlights cut hard volumetric shafts across the service tower trusses. " +
      "Dead-straight aerospace documentary framing, sober and monumental, no characters anywhere. " +
      "Wet concrete foreground, faint orange glow on the horizon.",
    timelinePrompt:
      "GLOBAL: a dead-straight aerospace launch film, sober documentary gravity, no comedy, no characters. " +
      "0.00-5.00s: locked-off wide of the foggy launch gantry; fog banks drift slowly, red strobes pulse in rhythm, " +
      "cryogenic steam vents drift sideways; almost imperceptible camera drift upward. " +
      "5.00-10.00s: a slow, steady cinematic push-in up the rocket body toward the crew capsule, " +
      "strobes continuing, fog parting slightly, steam catching the floodlights. " +
      "SOUND: low engine rumble building slowly underneath, fog wind, distant metallic clanks, electrical hum. No speech, no voices, no music.",
    generateAudio: true,
  },
  {
    n: 2,
    id: "visor-jindo",
    seconds: 5, // 0:10-0:15
    refs: [mref("chars", "southkorea.png"), mref("minted", "hashbeast3_southkorea_white_jindo.png")],
    framePrompt:
      "Extreme close-up inside a launch capsule: a white astronaut helmet FILLS the vertical frame, centered, " +
      "gold mirrored visor down and fully opaque. Reflected across the curved gold glass: a huge glowing orange " +
      "coin-like sun with a subtle bitcoin emblem, hanging low over a foggy launch-pad horizon with a gantry silhouette. " +
      "White flight-suit collar at the bottom edge. Calm, monumental, dead-straight aerospace look.",
    endFrame: {
      refs: [mref("chars", "southkorea.png"), mref("minted", "hashbeast3_southkorea_white_jindo.png")],
      prompt:
        "Identical extreme close-up of the same white astronaut helmet filling the vertical frame, same lighting, " +
        "but the gold visor is now RAISED/transparent: inside the helmet is the South Korea Jindo game character — " +
        "an orange-tan jindo dog with cream muzzle, calm deadpan half-lidded eyes, exactly matching the reference " +
        "character's face and fur — chewing gum, a small pink bubblegum bubble just starting between his lips. " +
        "Soft helmet interior lights on his face, faint orange sun glow rim light.",
    },
    timelinePrompt:
      "GLOBAL: extreme close-up on an astronaut helmet filling the vertical frame; dead-straight aerospace tone that " +
      "breaks into deadpan comedy. The character inside is an orange-tan jindo dog, kept perfectly on-model. " +
      "0.00-2.20s: hold on the opaque gold visor, the orange coin-sun reflection shimmering subtly, tiny handheld drift. " +
      "2.20-3.20s: the gold visor smoothly clears/raises, revealing the jindo dog's deadpan face inside the helmet, chewing gum slowly. " +
      "3.20-5.00s: he keeps chewing, stares past camera, blows a small pink bubblegum bubble and it POPS at 4.50s; he keeps chewing, unbothered. " +
      "He never speaks. SOUND: soft radio-static breathing inside the helmet, a faint capsule hum, the sharp wet gum POP at 4.5 seconds. No speech, no music.",
    generateAudio: true,
  },
  {
    n: 3,
    id: "mining-frenzy",
    seconds: 5, // 0:15-0:20
    refs: [
      mref("chars", "usa.png"),
      mref("chars", "japan.png"),
      mref("chars", "china.png"),
      mref("chars", "russia.png"),
      mref("chars", "india.png"),
      mref("chars", "brazil.png"),
    ],
    framePrompt:
      "A vast open-pit mining dig beneath a distant launch pad on the horizon (rocket visible small, fog, strobes). " +
      "Twelve country dog-beast characters mine in a furious frenzy with pickaxes, carving veins of glowing orange ore. " +
      "FOREGROUND HERO: the USA golden retriever in his red-and-gold hero armor, mid-pickaxe-swing, not looking up, " +
      "exactly on-model to the reference. Around him: the Japan beast, China beast, Russia beast, India beast, Brazil beast " +
      "and other nations' beasts, each matching their reference design, all swinging hard. " +
      "Chunks of raw ore are being pressed into GLOWING FUEL CELLS — canister-shaped cells of orange light — " +
      "stacked onto a mine-rail conveyor running toward the distant launch pad. Sparks, dust, ore-glow underlighting.",
    timelinePrompt:
      "GLOBAL: a frantic heroic mining operation feeding a rocket launch; gritty, fast, percussive. " +
      "Dog-beast characters stay exactly on-model to the start frame. " +
      "0.00-5.00s: continuous frenzy — pickaxes rise and fall out of sync, sparks burst off the rock, " +
      "glowing orange fuel cells thunk onto the moving conveyor toward the distant pad; " +
      "the foreground USA golden retriever in red-gold armor keeps swinging hard, never looking up at camera; " +
      "at 2.40-3.20s he barks a quick two-word answer mid-swing without breaking rhythm. " +
      "Handheld energy, whip-fast micro-pans between swings. " +
      "SOUND: relentless pickaxe impacts on stone, ore crackle, conveyor rumble, distant pad klaxon. No music, no narration.",
    generateAudio: true,
  },
  {
    n: 4,
    id: "ticker-silence",
    seconds: 5, // 0:20-0:25 — composited text card over this; MUSIC CUTS TO SILENCE
    refs: [
      path.join(REF, "global", "boards", "global_country_character_monitor_board.png"),
      mref("chars", "uk.png"),
      mref("chars", "israel.png"),
      mref("chars", "france.png"),
    ],
    framePrompt:
      "A crowd of country dog-beast characters seen mostly from BEHIND and in profile silhouette, gathered close together " +
      "in a dark dig-site clearing, all gazing up at one giant monolithic stock-ticker display board looming overhead. " +
      "The huge board glows warm amber-orange but is completely BLANK — pure abstract glow, no characters, no symbols. " +
      "Its light falls on their upturned faces and helmets. Reverent, still, church-like.",
    timelinePrompt:
      "GLOBAL: a silent, reverent beat — a crowd of dog-beast characters stares up at a giant blank glowing ticker board. " +
      "0.00-5.00s: almost nothing moves; the amber board-glow flickers softly across the crowd, dust motes drift, " +
      "one beast's ear twitches; extremely slow push-in toward the blank glowing board. " +
      "No speech, no sound effects, near-total silence.",
    generateAudio: false, // the hard cut to silence — no native audio at all
  },
  // n: 5 — REAL PRODUCT FOOTAGE montage (0:25-0:33), built by --stage montage
  {
    n: 6,
    id: "liftoff-back-to-work",
    seconds: 5, // 0:33-0:38
    refs: [mref("chars", "usa.png"), mref("chars", "japan.png")],
    framePrompt:
      "Night over the open-pit dig site: in the upper background the generic white rocket LIFTS OFF on a blinding " +
      "pillar of fire, fog blasted outward from the pad, smoke columns lit orange. " +
      "In the foreground on a dark ridge of the mine, the USA golden retriever in red-and-gold hero armor — " +
      "exactly on-model to the reference — leans on his pickaxe with his back half-turned to us, watching the launch. " +
      "Veins of glowing orange ore light him from below. One distant beast keeps mining at the far edge.",
    timelinePrompt:
      "GLOBAL: the payoff — the rocket leaves, the work continues. Quiet, dry, a little noble. " +
      "Characters stay exactly on-model to the start frame. " +
      "0.00-2.80s: the rocket climbs slowly on its pillar of fire, rumble rolling across the pit; " +
      "the foreground golden retriever beast stands still, leaning on his pickaxe, watching it go. " +
      "2.80-5.00s: he turns away from the sky without ceremony, hefts the pickaxe, and swings back into the rock — " +
      "one solid ringing strike landing at 4.30s, sparks jumping. " +
      "SOUND: the launch roar distant and fading, wind, then the close hard CHINK of the pickaxe at 4.3 seconds. No speech, no music.",
    generateAudio: true,
  },
];

// ─── locked VO (verbatim from the approved script) ──────────────────────────
const VO_LINES = [
  { id: "control_tminus", voice: "control", text: "T-minus ten.", at: { seq: 1, offset: 1.2 }, speed: 0.92 },
  { id: "control_go", voice: "control", text: "Flight, we are go for the moonshot.", at: { seq: 1, offset: 5.6 }, speed: 0.95 },
  { id: "control_fuel", voice: "control", text: "Fuel status?", at: { seq: 3, offset: 0.5 }, speed: 0.95 },
  { id: "usa_mining_it", voice: "gravel", text: "Mining it.", at: { seq: 3, offset: 2.5 }, speed: 0.95 },
  {
    id: "montage_explainer",
    voice: "gravel",
    text:
      "Pick your country. Bet SOL. Sixty seconds a round. Win, your beast mines degenBTC — " +
      "and the war writes a show with your character in it.",
    at: { seq: 5, offset: 0.35 },
    speed: 1.18, // plain speech, fast
  },
  {
    id: "closer_dogs",
    voice: "gravel",
    text: "Ten years of 'to the moon.' Somebody had to build the dogs.",
    at: { seq: 6, offset: 0.5 },
    speed: 0.98,
  },
];

const VOICES: Record<string, { design: string; preview: string }> = {
  control: {
    design:
      "Calm procedural mission-control flight director. Middle-aged American male, flat professional radio cadence, " +
      "measured and unhurried, quiet authority, slightly compressed NASA-loop radio timbre, zero excitement.",
    preview: "T-minus ten. Flight, we are go.",
  },
  gravel: {
    design:
      "Dry gravelly deadpan male voice, low and rough like a tired miner who has seen everything. " +
      "Unimpressed, laconic delivery, slow natural cadence, faint amusement buried under dust.",
    preview: "Mining it. Somebody had to build the dogs.",
  },
};

// montage captions (mirror the VO beats; burned onto seq_05 at --stage montage)
const MONTAGE_CAPTIONS = [
  { text: "PICK YOUR COUNTRY", start: 0.0, end: 1.6 },
  { text: "BET SOL", start: 1.6, end: 3.2 },
  { text: "60 SECONDS A ROUND", start: 3.2, end: 4.8 },
  { text: "WIN → MINE degenBTC", start: 4.8, end: 6.4 },
  // ≤ ~37 chars at fontsize 46 / 1080w — the full "WITH YOUR CHARACTER" suffix clips
  { text: "THE WAR WRITES A SHOW — YOU'RE IN IT", start: 6.4, end: 8.0 },
];

// ─── tiny ledger so the report can prove grounding + estimate spend ─────────
interface LedgerEntry { stage: string; kind: string; model?: string; requestId?: string; detail?: string }
const LEDGER_FILE = path.join(OUT, "fal-requests.json");
function ledger(entry: LedgerEntry): void {
  const all: LedgerEntry[] = fs.existsSync(LEDGER_FILE) ? JSON.parse(fs.readFileSync(LEDGER_FILE, "utf8")) : [];
  all.push({ ...entry });
  fs.writeFileSync(LEDGER_FILE, JSON.stringify(all, null, 2));
}

function arg(flag: string): string | undefined {
  const i = process.argv.indexOf(flag);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
const REGEN = process.argv.includes("--regen");

async function main() {
  const stage = arg("--stage") || "all";
  fs.mkdirSync(FRAMES, { recursive: true });
  fs.mkdirSync(SEQS, { recursive: true });
  fs.mkdirSync(AUDIO, { recursive: true });
  fs.mkdirSync(CAPTURES, { recursive: true });

  // dynamic imports AFTER env seeding (ffmpeg.js reads TRAILER_ASPECT at load)
  const falMedia = await import("../../src/utils/falMedia.js");
  const ffmpeg = await import("./ffmpeg.js");
  const { W, H } = ffmpeg;
  console.log(`\n🚀 THE OTHER MOONSHOT — locked-script production (${W}x${H} @ ${VIDEO_RES})`);

  if (stage === "all" || stage === "frames") await stageFrames(falMedia);
  if (stage === "all" || stage === "clips") await stageClips(falMedia, ffmpeg);
  if (stage === "montage") await stageMontage(ffmpeg);
  if (stage === "all" || stage === "audio") await stageAudio(falMedia);
  if (stage === "all" || stage === "assemble") await stageAssemble(ffmpeg);
  console.log("\n✅ done\n");
}

// ─── STAGE: keyframes (nano-banana-2/edit, real refs attached) ───────────────
async function stageFrames(falMedia: typeof import("../../src/utils/falMedia.js")) {
  console.log("\n— STAGE frames (nano-banana-2/edit, grounded)");
  for (const shot of SHOTS) {
    const plans: Array<{ kind: "start" | "end"; prompt: string; refs: string[] }> = [
      { kind: "start", prompt: shot.framePrompt, refs: shot.refs },
    ];
    if (shot.endFrame) plans.push({ kind: "end", prompt: shot.endFrame.prompt, refs: shot.endFrame.refs });
    for (const plan of plans) {
      const file = path.join(FRAMES, `seq_${String(shot.n).padStart(2, "0")}_${plan.kind}.png`);
      if (fs.existsSync(file) && !REGEN) { console.log(`   seq ${shot.n} ${plan.kind}: cached`); continue; }
      const refs = plan.refs.filter((p) => fs.existsSync(p));
      if (refs.length === 0) throw new Error(`seq ${shot.n}: no grounding refs on disk`);
      const prompt = [
        `LOOK (shared across the whole video): ${LOOK}`,
        plan.prompt,
        "This is a STILL image — a frozen instant; no motion blur, no motion.",
        NO_TEXT,
      ].join("\n");
      process.stdout.write(`   seq ${shot.n} ${plan.kind}: generating (${refs.length} refs)… `);
      const img = await falMedia.generateImageEditFromBuffers(
        prompt,
        refs.map((p) => ({ buffer: fs.readFileSync(p), mime: "image/png" as const })),
        { aspectRatio: "9:16", resolution: IMG_RES },
      );
      fs.writeFileSync(file, img.buffer);
      ledger({ stage: `frame:seq${shot.n}:${plan.kind}`, kind: "image", model: img.model, requestId: img.requestId, detail: refs.map((r) => path.relative(REF, r)).join(", ") });
      console.log("✓");
    }
  }
}

// ─── STAGE: Seedance clips ───────────────────────────────────────────────────
async function stageClips(
  falMedia: typeof import("../../src/utils/falMedia.js"),
  ffmpeg: typeof import("./ffmpeg.js"),
) {
  console.log("\n— STAGE clips (Seedance 2.0 i2v, 720p, 9:16)");
  for (const shot of SHOTS) {
    const file = path.join(SEQS, `seq_${String(shot.n).padStart(2, "0")}.mp4`);
    if (fs.existsSync(file) && !REGEN) { console.log(`   seq ${shot.n}: cached`); continue; }
    const startPng = path.join(FRAMES, `seq_${String(shot.n).padStart(2, "0")}_start.png`);
    const endPng = path.join(FRAMES, `seq_${String(shot.n).padStart(2, "0")}_end.png`);
    if (!fs.existsSync(startPng)) throw new Error(`seq ${shot.n}: start frame missing — run --stage frames`);
    process.stdout.write(`   seq ${shot.n} (${shot.seconds}s): uploading frames… `);
    const startUrl = await falMedia.uploadBufferToS3(`${SCRATCH}/seq${shot.n}_start.png`, fs.readFileSync(startPng), "image/png");
    const endUrl = shot.endFrame && fs.existsSync(endPng)
      ? await falMedia.uploadBufferToS3(`${SCRATCH}/seq${shot.n}_end.png`, fs.readFileSync(endPng), "image/png")
      : undefined;
    process.stdout.write("Seedance… ");
    const vid = await falMedia.generateVideoFromFrames(shot.timelinePrompt, startUrl, endUrl, {
      durationSecs: shot.seconds,
      resolution: VIDEO_RES,
      aspectRatio: "9:16",
      generateAudio: shot.generateAudio,
    });
    ledger({ stage: `video:seq${shot.n}`, kind: "video", model: vid.model, requestId: vid.requestId, detail: `${shot.seconds}s ${VIDEO_RES}` });
    process.stdout.write("normalize… ");
    let buf = await ffmpeg.normalizeAndCaption(vid.buffer);
    if (shot.n === 1) buf = await fadeFromBlack(ffmpeg, buf, 1.2); // script: "black -> launch gantry"
    fs.writeFileSync(file, buf);
    console.log(`✓ ${(await ffmpeg.probeDuration(buf)).toFixed(1)}s`);
  }
}

async function fadeFromBlack(ffmpeg: typeof import("./ffmpeg.js"), buf: Buffer, seconds: number): Promise<Buffer> {
  const dir = ffmpeg.tmpDir("fade");
  try {
    const v = path.join(dir, "v.mp4"); const o = path.join(dir, "o.mp4");
    fs.writeFileSync(v, buf);
    await ffmpeg.execFileP("ffmpeg", ["-y", "-i", v, "-vf", `fade=t=in:st=0:d=${seconds}`, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "copy", o], { maxBuffer: 1 << 27 });
    return fs.readFileSync(o);
  } finally { ffmpeg.rmDir(dir); }
}

// ─── STAGE: montage (REAL product footage → seq_05) ──────────────────────────
// captures/cuts.json: { "cuts": [{"src": "captures/x.webm", "start": s, "len": s}, …] }
async function stageMontage(ffmpeg: typeof import("./ffmpeg.js")) {
  console.log("\n— STAGE montage (real product footage → seq_05)");
  const cutsFile = path.join(CAPTURES, "cuts.json");
  if (!fs.existsSync(cutsFile)) throw new Error(`montage needs ${cutsFile}`);
  const { cuts } = JSON.parse(fs.readFileSync(cutsFile, "utf8")) as { cuts: Array<{ src: string; start: number; len: number }> };
  const dir = ffmpeg.tmpDir("montage");
  try {
    const parts: Buffer[] = [];
    for (let i = 0; i < cuts.length; i++) {
      const srcPath = path.isAbsolute(cuts[i].src) ? cuts[i].src : path.join(OUT, cuts[i].src);
      if (!fs.existsSync(srcPath)) throw new Error(`montage source missing: ${srcPath}`);
      const o = path.join(dir, `cut${i}.mp4`);
      await ffmpeg.execFileP("ffmpeg", [
        "-y", "-ss", String(cuts[i].start), "-t", String(cuts[i].len), "-i", srcPath,
        "-vf", `scale=${ffmpeg.W}:${ffmpeg.H}:force_original_aspect_ratio=increase,crop=${ffmpeg.W}:${ffmpeg.H},setsar=1,fps=${ffmpeg.FPS}`,
        "-an", "-c:v", "libx264", "-pix_fmt", "yuv420p", o,
      ], { maxBuffer: 1 << 27 });
      parts.push(fs.readFileSync(o));
    }
    let buf = await ffmpeg.concat(parts);
    buf = await ffmpeg.burnTimedCaptions(buf, MONTAGE_CAPTIONS);
    buf = await ffmpeg.normalizeAndCaption(buf);
    fs.writeFileSync(path.join(SEQS, "seq_05.mp4"), buf);
    console.log(`   seq 5 ✓ ${(await ffmpeg.probeDuration(buf)).toFixed(1)}s (${cuts.length} cuts, real footage)`);
  } finally { ffmpeg.rmDir(dir); }
}

// ─── STAGE: audio (MiniMax TTS VO + stable-audio score) ──────────────────────
async function stageAudio(falMedia: typeof import("../../src/utils/falMedia.js")) {
  console.log("\n— STAGE audio (MiniMax VO + stable-audio score)");
  const voicesFile = path.join(AUDIO, "voices.json");
  const voices: Record<string, string> = fs.existsSync(voicesFile) ? JSON.parse(fs.readFileSync(voicesFile, "utf8")) : {};
  for (const [key, spec] of Object.entries(VOICES)) {
    if (voices[key]) continue;
    process.stdout.write(`   voice design "${key}"… `);
    const v = await falMedia.designVoice(spec.design, spec.preview);
    voices[key] = v.voiceId;
    fs.writeFileSync(voicesFile, JSON.stringify(voices, null, 2));
    ledger({ stage: `voice:${key}`, kind: "voice-design", detail: v.voiceId });
    console.log("✓");
  }
  for (const line of VO_LINES) {
    const file = path.join(AUDIO, `vo_${line.id}.mp3`);
    if (fs.existsSync(file) && !REGEN) { console.log(`   vo ${line.id}: cached`); continue; }
    process.stdout.write(`   vo ${line.id}… `);
    const audio = await falMedia.generateSpeech(voices[line.voice], line.text, { emotion: "neutral", speed: line.speed, language: "English" });
    fs.writeFileSync(file, audio.buffer);
    ledger({ stage: `tts:${line.id}`, kind: "tts", model: audio.model, requestId: audio.requestId });
    console.log("✓");
  }
  const cues: Array<{ file: string; gen: () => Promise<{ buffer: Buffer; model?: string; requestId?: string }> }> = [
    {
      file: "music_suspense.mp3",
      gen: () => falMedia.generateMusic(
        "Cinematic rocket-launch suspense score: deep sub-bass rumble, low dark strings, sparse ticking percussion, slowly building dread and awe, NASA broadcast gravity, instrumental, no vocals",
        21,
      ),
    },
    {
      file: "music_arcade.mp3",
      gen: () => falMedia.generateMusic(
        "High-energy electric arcade synthwave, driving chiptune-edged war drums, bright neon synth stabs, fast tempo, video-game battle energy, instrumental, no vocals",
        14,
      ),
    },
    {
      file: "bell_strike.mp3",
      gen: () => falMedia.generateSfx(
        "A single heavy pickaxe strike on stone that rings out like a deep church bell, one impact, long metallic resonant decay, cinematic, no music",
        4,
      ),
    },
    {
      file: "gum_pop.mp3",
      gen: () => falMedia.generateSfx("A single sharp wet bubblegum bubble POP, close-mic, short, comedic, no music", 1),
    },
  ];
  for (const cue of cues) {
    const file = path.join(AUDIO, cue.file);
    if (fs.existsSync(file) && !REGEN) { console.log(`   ${cue.file}: cached`); continue; }
    process.stdout.write(`   ${cue.file}… `);
    const a = await cue.gen();
    fs.writeFileSync(file, a.buffer);
    ledger({ stage: `audio:${cue.file}`, kind: "audio", model: (a as any).model, requestId: (a as any).requestId });
    console.log("✓");
  }
}

// ─── STAGE: assemble ─────────────────────────────────────────────────────────
async function stageAssemble(ffmpeg: typeof import("./ffmpeg.js")) {
  console.log("\n— STAGE assemble");
  const { W, H } = ffmpeg;

  // 1. end card (seq 7) via the real end-card machinery: Hashiden mark + CTA
  const endCardFile = path.join(SEQS, "seq_07.mp4");
  if (!fs.existsSync(endCardFile) || REGEN) {
    process.stdout.write("   end card (render_card.py + Hashiden mark)… ");
    const markWebp = path.resolve(ROOT, "..", "..", "mdogeWifBtcFE", "public", "assets", "brand", "hashiden", "hashiden-mark.webp");
    const dir = ffmpeg.tmpDir("endcard");
    try {
      const markPng = path.join(dir, "hashiden-mark.png");
      await ffmpeg.execFileP("ffmpeg", ["-y", "-i", markWebp, markPng], { maxBuffer: 1 << 26 });
      const cardPng = path.join(dir, "card.png");
      const py = process.env.HASHBEAST_ANIM_PYTHON || "python3";
      await ffmpeg.execFileP(py, [
        path.resolve(ROOT, "..", "scripts", "render_card.py"),
        "--mode", "endcard", "--out", cardPng,
        "--width", String(W), "--height", String(H), "--font", FONT,
        "--badge", markPng, // the Hashiden mark rides the badge slot, upper-center
        "--cta1", "", "--cta2", "minebtc.fun", "--cta3", "JULY 10",
      ], { maxBuffer: 1 << 26 });
      const clip = await ffmpeg.stillToClip(fs.readFileSync(cardPng), 4);
      fs.writeFileSync(endCardFile, await ffmpeg.normalizeAndCaption(clip));
      console.log("✓");
    } finally { ffmpeg.rmDir(dir); }
  } else console.log("   end card: cached");

  // 2. gather clips in order; probe real durations → cumulative starts
  const order = [1, 2, 3, 4, 5, 6, 7];
  const clips: Buffer[] = [];
  const starts: Record<number, number> = {};
  let t = 0;
  for (const n of order) {
    const f = path.join(SEQS, `seq_${String(n).padStart(2, "0")}.mp4`);
    if (!fs.existsSync(f)) throw new Error(`missing sequence clip: ${f}`);
    const buf = fs.readFileSync(f);
    starts[n] = t;
    t += await ffmpeg.probeDuration(buf);
    clips.push(buf);
  }
  const total = t;
  console.log(`   ${clips.length} clips, ${total.toFixed(1)}s — seq starts: ${order.map((n) => `${n}@${starts[n].toFixed(1)}`).join(" ")}`);

  // 3. text card composite over the silent ticker shot (REAL machinery, not generated-in-image)
  const DEBUG_TAPS = process.env.MOONSHOT_DEBUG_TAPS === "true";
  const tap = (name: string, buf: Buffer) => { if (DEBUG_TAPS) fs.writeFileSync(path.join(OUT, `debug_${name}.mp4`), buf); };
  process.stdout.write("   concat + text card… ");
  let master = await ffmpeg.concat(clips);
  tap("concat", master);
  master = await burnCenteredCard(ffmpeg, master, [
    { text: "SPACEX IPO'D THE ROCKET.", at: starts[4] + 0.7, until: starts[5] - 0.15, y: 0.40, color: "white", size: Math.round(W * 0.066) },
    { text: "WE'RE IPO-ING THE FUEL.", at: starts[4] + 2.6, until: starts[5] - 0.15, y: 0.48, color: "0xF7931A", size: Math.round(W * 0.072) },
  ]);
  tap("card", master);
  console.log("✓");

  // 4. the segmented score + VO laid over ducked native audio
  process.stdout.write("   score + VO mix… ");
  const overlays: Array<{ file: string; at: number; vol: number; trimTo?: number }> = [
    // music: suspense 0 → HARD CUT at the ticker shot; arcade from the montage; bell on the end card
    { file: "music_suspense.mp3", at: 0, vol: 0.55, trimTo: starts[4] },
    { file: "music_arcade.mp3", at: starts[5], vol: 0.5, trimTo: starts[7] - starts[5] },
    { file: "bell_strike.mp3", at: starts[7], vol: 0.95 },
    { file: "gum_pop.mp3", at: starts[2] + 4.45, vol: 0.9 },
    ...VO_LINES.map((l) => ({ file: `vo_${l.id}.mp3`, at: starts[l.at.seq] + l.at.offset, vol: 1.0 })),
  ];
  master = await mixOverlays(ffmpeg, master, overlays, 0.45 /* native duck */);
  tap("mix", master);
  console.log("✓");

  // 5. brand badge + loudnorm → final
  process.stdout.write("   brand + loudnorm… ");
  const { brandVideo } = await import("../../src/utils/videoBrand.js");
  try { master = await brandVideo(master); } catch { /* ship unbranded */ }
  tap("brand", master);
  try { master = await ffmpeg.loudnormalize(master); } catch { /* ship un-normalized */ }
  const finalPath = path.join(OUT, "final.mp4");
  fs.writeFileSync(finalPath, master);
  console.log(`✓\n   FINAL → ${finalPath} (${(await ffmpeg.probeDuration(master)).toFixed(1)}s, ${W}x${H})`);
}

/** Centered big-type text card lines (drawtext windows) — the composited-text machinery. */
async function burnCenteredCard(
  ffmpeg: typeof import("./ffmpeg.js"),
  buf: Buffer,
  lines: Array<{ text: string; at: number; until: number; y: number; color: string; size: number }>,
): Promise<Buffer> {
  const esc = (t: string) => String(t).replace(/\\/g, "\\\\").replace(/:/g, "\\:").replace(/'/g, "’").replace(/%/g, "\\%");
  const dir = ffmpeg.tmpDir("card");
  try {
    const v = path.join(dir, "v.mp4"); const o = path.join(dir, "o.mp4");
    fs.writeFileSync(v, buf);
    const vf = lines
      .map((l) =>
        `drawtext=fontfile=${FONT}:text='${esc(l.text)}':fontcolor=${l.color}:fontsize=${l.size}:borderw=5:bordercolor=black@0.95:x=(w-text_w)/2:y=h*${l.y}:enable='between(t,${l.at.toFixed(2)},${l.until.toFixed(2)})'`)
      .join(",");
    await ffmpeg.execFileP("ffmpeg", ["-y", "-i", v, "-vf", vf, "-c:v", "libx264", "-pix_fmt", "yuv420p", "-c:a", "copy", o], { maxBuffer: 1 << 27 });
    return fs.readFileSync(o);
  } finally { ffmpeg.rmDir(dir); }
}

/** Mix timed audio overlays (VO/score/sfx) over the master's ducked native audio. */
async function mixOverlays(
  ffmpeg: typeof import("./ffmpeg.js"),
  master: Buffer,
  overlays: Array<{ file: string; at: number; vol: number; trimTo?: number }>,
  nativeVol: number,
): Promise<Buffer> {
  const dir = ffmpeg.tmpDir("mix");
  try {
    const v = path.join(dir, "v.mp4"); const o = path.join(dir, "o.mp4");
    fs.writeFileSync(v, master);
    const usable = overlays.filter((ov) => fs.existsSync(path.join(AUDIO, ov.file)));
    for (const missing of overlays.filter((ov) => !usable.includes(ov))) {
      console.log(`\n      ⚠ overlay missing, skipped: ${missing.file}`);
    }
    const inputs: string[] = ["-i", v];
    usable.forEach((ov) => inputs.push("-i", path.join(AUDIO, ov.file)));
    const chains: string[] = [`[0:a]volume=${nativeVol}[native]`];
    const tags: string[] = ["[native]"];
    usable.forEach((ov, i) => {
      const trim = ov.trimTo && ov.trimTo > 0 ? `atrim=0:${ov.trimTo.toFixed(2)},` : "";
      const delayMs = Math.max(0, Math.round(ov.at * 1000));
      chains.push(`[${i + 1}:a]${trim}volume=${ov.vol},adelay=${delayMs}|${delayMs}[ov${i}]`);
      tags.push(`[ov${i}]`);
    });
    chains.push(`${tags.join("")}amix=inputs=${tags.length}:duration=first:normalize=0[a]`);
    await ffmpeg.execFileP("ffmpeg", [
      "-y", ...inputs,
      "-filter_complex", chains.join(";"),
      "-map", "0:v", "-map", "[a]", "-c:v", "copy", "-c:a", "aac", "-ar", "44100", "-movflags", "+faststart", o,
    ], { maxBuffer: 1 << 27 });
    return fs.readFileSync(o);
  } finally { ffmpeg.rmDir(dir); }
}

main().catch((e) => { console.error("\nmoonshot production failed:", e?.message || e); process.exit(1); });
