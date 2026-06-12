/**
 * Types for the trailer SCRIPT pipeline — a multi-pass screenplay generator that
 * turns a rough story blueprint into a production-ready, scene-split shooting
 * script (dialogue + expression + location + camera + lighting + sfx), ready to
 * feed an image→video model (Seedance) one shot at a time.
 *
 * This is a standalone testbed (run with tsx; NOT part of `npm run build`). Once
 * the script quality + scene shape are dialed, the same multi-pass approach gets
 * imported into the backend's automated content pipeline (src/services/showrunner).
 */

/** A blueprint = the rough story clay (story + beats + intent), NOT final dialogue. */
export interface Blueprint {
  id: string;
  title: string; // YouTube-style headline
  /** Video genre (see trailer/style/genres.ts). Default "story". */
  genre: string;
  /** Render aspect: "16:9" | "9:16" | "1:1". Default 16:9. */
  aspect: string;
  targetSeconds: number; // aim
  minSeconds: number; // floor (24)
  countdown: string; // end-card timer, e.g. "24:00:00"
  cta: string;
  logline: string;
  cast: string[]; // character ids present (resolved against the series bible)
  /** Markdown body of the blueprint (hook, grounding facts, beats, cliffhanger). */
  body: string;
}

/**
 * An engagement-bait OVERLAY — a separate text track from fact captions
 * ("wait for the end…", "send this to a USA holder", "part 3"). Burned at the
 * top safe-zone at assembly; never duplicates dialogue or fact captions.
 */
export interface OverlayCue {
  text: string;
  /** Global seconds into the assembled video (sequence durations accumulated). */
  atSec: number;
  untilSec: number;
  style: "bait" | "cta";
}

/** One spoken line, with the delivery/subtext note that drives TTS + animation. */
export interface DialogueLine {
  speaker: string;
  line: string;
  /** Emotion + subtext for the voice + facial animation (e.g. "smug, hiding fear"). */
  delivery: string;
}

/** A character on screen in a shot, with the expression the keyframe must show. */
export interface ShotCharacter {
  name: string;
  expression: string;
  wardrobe?: string;
}

/**
 * One SHOT — a single Seedance-sized clip (≤ ~10s). Dialogue is kept SEPARATE
 * from the visual `action` (text-to-video models confuse the two when mixed).
 */
export interface Shot {
  n: number;
  beat: string; // cold_open | setup | escalation | turn | payoff | cliffhanger | end_card
  /** Prompt scaffold: single scene, two-character beat, action reveal, or live recap. */
  promptTemplate?: string;
  /** Format/story mode: prelaunch myth, rivalry, emotional survival, live recap, etc. */
  contentMode?: string;
  /** Game event, pre-launch beat, mechanic, or world development being dramatized. */
  storySource?: string;
  /** Whose emotional/strategic POV drives the shot. */
  characterPov?: string;
  /** Why this shot exists in the binge arc: hook, reveal, reversal, CTA, etc. */
  plotFunction?: string;
  /** Country/faction environment context for this shot, e.g. USA, India, Brazil. */
  countryContext?: string;
  /** Scene-specific environment details to ground architecture/interiors/props. */
  environmentPrompt?: string;
  /** Directing register: comedy, underdog, tonal pivot, transformation, menace, satire. */
  emotionalRegister?: string;
  /** Palette card / grade family for this shot. */
  paletteCard?: string;
  durationSec: number; // ≤ SEEDANCE_MAX
  location: string;
  timeOfDay: string;
  characters: ShotCharacter[];
  /** Camera-visible MOTION only (what physically happens) — no dialogue, no facts. */
  action: string;
  dialogue: DialogueLine[];
  camera: string; // shot size + movement, e.g. "low-angle hero, slow push-in"
  lighting: string;
  mood: string;
  sfx: string;
  music: string;
  /** On-screen text — facts/numbers live HERE, not in the mouth (visual/VO split). */
  caption?: string;
  /** Country/gear/evolution motif that should be visible in the frame. */
  visualMotif?: string;
  /** Exact power effect, color, source gear, and physical behavior for the shot. */
  powerFx?: string;
  /** Action physics / impact register, e.g. comedy rebound, heroic crater, grounded cost. */
  actionPhysics?: string;
  /** Sound design plan beyond music/sfx: silence, wrong foley, leitmotif, impact layers. */
  soundDesign?: string;
  /** Identity/gear continuity notes the renderer must preserve across shots. */
  continuityNotes?: string;
  /** Full still description for the image model (character-consistent, in style). */
  keyframePrompt: string;
  /** Motion-only prompt for the i2v model (keyframe already fixes appearance). */
  motionPrompt: string;
  /** Per-shot lip-sync override. Undefined → renderer heuristic (close-up talking face). */
  lipsync?: boolean;
}

/** One shot INSIDE a sequence (Seedance timeline prompting — timestamps within the generation). */
export interface SequenceShot {
  n: number;
  beat: string; // cold_open | setup | escalation | turn | payoff | cliffhanger | end_card
  startSec: number;
  endSec: number;
  /** Camera-visible motion only. */
  action: string;
  /** Plain film English (no internal codes). */
  camera: string;
  /** Physical tells per character (translated from delivery notes). */
  performance?: string;
  /** Physical effect (source, color, path, impact, reaction) or empty. */
  fx?: string;
  /** Diegetic sound cue or empty (Seedance native audio). */
  sound?: string;
  dialogue: DialogueLine[];
  /** Post-overlay caption text (never rendered inside the generation). */
  caption?: string;
}

/** A character reference inside a sequence (maps to a reference sheet at render time). */
export interface SequenceCharacter {
  name: string;
  /** Stable lowercase ref tag, e.g. "@rex" — the renderer maps it to reference images. */
  refTag: string;
  /** Reference-sheet variant: "default" | "helmet" | "evolved" | … */
  state?: string;
}

/** A planned still frame: image-model prompt + ordered reference plan (pass 6). */
export interface FramePlan {
  /** Full STATIC still description (image-model dialect, zero motion words, no text). */
  prompt: string;
  /**
   * Ordered refs:
   * - "@<castId>:<state>" character sheets
   * - "@<countryProfileId>" country showrunner profiles (resolved to country board refs until dedicated sheets exist)
   * - "env:seq<N>.startFrame" environment chains
   * - "country:<country>:characterBoard|environmentBoard|landscapeLuxuryEnvironmentBoard"
   * - "asset:<path under trailer/reference>"
   */
  refs: string[];
  aspect?: string; // default 16:9
}

/** An end frame is only planned when earned: a first→last bridge or a continuity handoff. */
export interface EndFramePlan extends FramePlan {
  reason: "bridge" | "handoff" | string;
}

/**
 * One SEQUENCE = one Seedance 2.0 generation (≤ ~15s): a timeline prompt with
 * native cuts, ≤3 tagged characters, a start-frame consistency anchor, and
 * native audio (voices + SFX + music mood described in-prompt).
 */
export interface Sequence {
  n: number;
  label: string;
  durationSec: number;
  location: string;
  timeOfDay: string;
  characters: SequenceCharacter[];
  /**
   * Per-block Seedance native audio. TRUE for blocks whose dialogue/diegetic
   * sound must be generated in-model; FALSE for blocks that ride the post
   * score (silent renders mix cleaner under music). Omitted → the renderer's
   * TRAILER_NATIVE_AUDIO env default.
   */
  generateAudio?: boolean;
  /** Signature effect description (time-stop / speed-ramp / one-take / core illusion) or empty. */
  signature?: string;
  /** The compiled Seedance timeline prompt: global block → timestamped shots → rules → logic. */
  timelinePrompt: string;
  /** Short targeted negative prompt. */
  negativePrompt?: string;
  /** Start-frame plan (pass 6) — the generation's consistency anchor. */
  startFrame?: FramePlan;
  /** Selective end-frame plan (pass 6): bridge or handoff. */
  endFrame?: EndFramePlan;
  shots: SequenceShot[];
}

/** The final, scene-split shooting script. */
export interface Screenplay {
  blueprintId: string;
  title: string;
  logline: string;
  /** Video genre id (trailer/style/genres.ts) — drives captions/music/assembly. */
  genre?: string;
  /** Render aspect ("16:9" | "9:16" | "1:1") — generate/run.ts seeds TRAILER_ASPECT from this. */
  aspect?: string;
  /** Draft-only continuity proposal. Applied to memory only by canonize.ts after posting. */
  canonPlan?: Record<string, unknown>;
  /** The story spine carried from the writers room (core question / change / stakes). */
  spine?: { coreQuestion: string; change: string; stakes: string };
  /** Alternate hook/cliffhanger lines from the writers room (producer pick later). */
  hookCandidates?: { hook: string[]; cliffhanger: string[] };
  /** Engagement-bait overlay track (global timestamps; burned at assembly). */
  overlays?: OverlayCue[];
  /** Video-wide shared visual language — stamped into every frame prompt. */
  look?: string;
  totalSeconds: number;
  /** Seedance 2.0 sequence packages (the primary render unit). */
  sequences?: Sequence[];
  /** Flattened per-shot view (legacy renderer compatibility + assembly/captions). */
  shots: Shot[];
  endCard: { countdown: string; cta: string };
}

/** A single refinement pass over the working script document. */
export interface Pass {
  id: string; // file-safe slug (used for out/NN-<id>.md)
  name: string;
  /** "text" = rewrites the working script document; "json" = emits structured Shots. */
  kind: "text" | "json";
  goal: string; // one-line description shown in the runner
  /**
   * Sampling temperature. Creative passes run hot (0.9); precision passes that
   * must copy locked content verbatim run cool (≤0.4). Falls back to
   * kind-based defaults (json 0.4 / text 0.9) when omitted.
   */
  temperature?: number;
  /** Build the prompt for this pass from the prior draft + context. */
  build(prevDraft: string, ctx: PassContext): string;
}

export interface PassContext {
  bible: string; // the series STORY bible (world + cast voices + craft)
  blueprint: Blueprint;
  /** Seedance per-SEQUENCE max seconds (one generation ≈ ≤15s of timestamped shots). */
  seedanceMaxSec: number;
  /** Canonized story/arc/character memory. Drafts are explicitly not canon. */
  showrunnerPacket?: string;
  /** Available country/asset refs for frame planning and image-reference prompting. */
  referenceAssetBlock?: string;
  /** Country-grounded reusable character archetypes, roles, powers, and engagement loops. */
  countryCharacterBlock?: string;
  /** Country storyboard/location profiles for scenes and start-frame set design. */
  locationStoryboardBlock?: string;
  /** Research-backed cinematic AI-video direction rules. */
  productionPlanningBlock?: string;
}
