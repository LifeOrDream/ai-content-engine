/**
 * SEEDANCE 2.0 CRAFT — distilled, field-tested prompting knowledge for the
 * trailer pipeline (from real-world Seedance 2.0 usage: timeline prompting,
 * ingredient tagging, hard limits, emotion handling, and the effects library).
 * Injected into the DIRECT pass (4) and the COMPILE pass (5).
 */

export const SEEDANCE_CRAFT = `
SEEDANCE 2.0 CRAFT (how the video model actually behaves — obey when directing and compiling):

TIMELINE PROMPTING (the native format):
- One generation = one SEQUENCE of up to ~15 seconds containing several timestamped shots with NATIVE cuts. Prompt anatomy, in order: GLOBAL BLOCK (every subject described once + tagged to its reference image, wardrobe, environment, mood, color logic, style) → TIMESTAMPED SHOT LIST ("0:00-0:03 — …") → RULES → LOGIC. Seedance executes the cuts itself and keeps characters consistent within the generation.
- Reference images are tagged in-prompt (@rex, @volkov, @prop). Describe each subject fully ONCE in the global block; the shots then refer to them by tag/name only.
- A start frame (the sequence's hero keyframe) is the strongest consistency anchor — especially a start frame that already contains ALL the sequence's characters.

HARD LIMITS (learned from real generations — violating these wastes the render):
- MAX 3 tagged characters per sequence. More → glitches: duplicated faces, broken blocking, characters wandering. Crowds are background description, never tagged refs.
- DETAIL BUDGET: roughly ONE action beat per 2-3 seconds. A 3s shot fits one gesture + one glance — NOT "pauses, reads the room, glances back, steps inside, eases the door shut". Overpacked shots silently drop your most important beat. Cut detail until it fits; Seedance understands skipping connective tissue (you can jump from hallway to inside the room).
- NO readable text, logos, tickers, or UI anywhere in frame — text renders garbled or mirrored. All captions/facts are post overlays.
- A wardrobe/state change needs its own reference sheet (helmet ON vs OFF, base vs evolved armor are different sheets). Never change a character's appearance mid-sequence unless the shot IS the transformation.

EMOTION (Seedance infers brilliantly — feed it tells, not labels):
- Write physical tells, never emotion names: "breathing fast, eyes wide, voice cracking" beats "scared"; "grin held a half-second too long" beats "nervous". Name the emotion only for a specific loud register (shouting rage).
- Dialogue lines + delivery belong IN the timeline at their timestamps so the acting matches the words — performance and lip-sync are native.

NATIVE AUDIO (Seedance generates speech, lip-sync, SFX and score in-generation — use it):
- Every character that speaks gets a one-line VOICE DESCRIPTION in the global block (timbre + accent + energy, e.g. "@rex speaks with a brash American hype-man salesman voice, fast and punchy") so the generated voice matches the character across sequences.
- Dialogue lines sit at their timestamps with delivery as physical/vocal tells ("voice cracks on the last word").
- Per-shot SOUND cues are diegetic and specific ("brass lever clank, papers burst, distant party murmur") — Seedance layers them natively.
- The global block carries a one-line MUSIC mood for the sequence ("low tense synth pulse, no melody, builds under the reveal") — score continuity across sequences comes from repeating the same music language.
- Voice-replacement in post (designed TTS voices) stays possible later: the generated acting/lip motion is the hard part; audio can be swapped if a character's canonical voice differs.

RULES / LOGIC / NEGATIVE (error control inside the prompt):
- RULES: explicit constraints that kill recurring errors — "the helmet stays ON for the whole sequence", "the golden pickaxe-wand never leaves his paw", "only @rex speaks".
- LOGIC: declare the camera grammar or Seedance invents its own — either "hard cuts between shots" or "one continuous take, single camera, no angle changes".
- NEGATIVE: short and targeted (a handful of items). Not an essay — long negatives dilute.

SIGNATURE EFFECTS LIBRARY (proven phrasings — for the 1-2 showpiece moments per video):
- TIME-STOP SNAP: "at the <snap / wand-tap / coin-catch>, a subtle spherical shockwave bursts from <source>; the world freezes mid-motion — <frozen details: papers hanging in air, smoke stopped, a coin suspended> — while <character> keeps moving; diegetic sound drops to one held tone."
- SPEED-RAMP REVEAL: "frame rate ramps from 24 to 48 into slow motion on the reveal, then a hard speed cut back to real time on the impact; diegetic sound drops during the slow-mo."
- ONE-TAKE ACTION: "one continuous take, single camera following through the whole action, no cuts, no angle changes."
- CORE ILLUSION (trick shot): declare it explicitly — "CORE ILLUSION: <the trick, e.g. the hallway was a reflection; the camera was inside the mirror all along>" — naming the illusion makes the model execute it.
- IMPACT SMASH CUT: "cut exactly on the frame of impact; loud-to-silent audio contrast."
- IN-WORLD SCREEN: "the footage of <X> plays on the monitor/portal inside the scene."
- FIRST→LAST FRAME BRIDGE (generation technique): given a start and end frame, "show what happens in between; use multiple camera angles."
- Effects must grow from the character's gear/country/personality (Rex's golden ticker-ribbon snap freezing a trading floor; Long's jade circle lock; Volkov's frost pressure wave) — never generic blue lightning.
`.trim();

/**
 * FRAME CRAFT — image-model (nano-banana) dialect for the start/end frames.
 * Frames are STILLS: a different language from video prompts. Injected into
 * the frames pass (6).
 */
export const FRAME_CRAFT = `
FRAME CRAFT (image-model dialect — the start frame is the generation's consistency anchor):

THE START FRAME IS THE HIGHEST-LEVERAGE IMAGE OF EACH SEQUENCE:
- Seedance anchors the whole generation on it: identity, wardrobe state, environment, light, grade. Get the frame right and the video follows; get it wrong and every shot drifts.
- A start frame that already contains ALL the sequence's tagged characters fixes multi-character consistency — stage everyone in frame, even if shot 1 only features one of them (the others can be midground/background but visible).

STILL DIALECT (zero motion words):
- Describe a FROZEN INSTANT: exact pose, exact expression as physical tells, paw positions, gaze direction. Never "begins to", "starts", "walks toward", "is about to" — those are video words; an image model renders them as mush.
- Composition + lens feel must match the sequence's FIRST shot camera (size, angle, framing) so the video doesn't jump-cut away from its own anchor on frame 2.
- No readable text, logos, tickers, UI, captions, or watermarks — ever.

REFERENCE PLANNING (good refs in = consistency out):
- Every character in frame gets its reference: "@<id>:<state>" — the state variant MUST match the sequence (helmet on = the helmet sheet; evolved = the evolved sheet). A face the refs never showed (back of head, profile) is a face the model invents — keep poses near the reference coverage or accept drift.
- CHAIN environments: when a sequence reuses an earlier location, list "env:seq<N>.startFrame" as a reference so the approved earlier frame anchors the room (same den, same lamp, same monitor wall). This chain is what makes independent generations read as ONE film.
- Identity anchoring is restated in every frame prompt: "keep the exact identity, breed, fur markings, colors, and gear lineage from the attached references."

END FRAMES (selective — most sequences need NONE):
- "bridge": the sequence will render as first→last frame ("show what happens in between") — only for tricky beats where the in-between is the magic.
- "handoff": the NEXT sequence must inherit an exact pose/state — the end frame becomes its continuity reference.
`.trim();
