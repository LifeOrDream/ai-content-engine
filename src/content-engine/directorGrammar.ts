import type { HashBeastLike, VideoFormat } from "./types.js";

const DEFAULT_ASPECT = "9:16";

export function buildDirectorPromptBlock(format?: Partial<VideoFormat>): string {
  const aspect = format?.aspectRatio || DEFAULT_ASPECT;
  return `MINEBTC DIRECTOR GRAMMAR — OBEY FOR EVERY FRAME
Visual identity: premium 2D arcade-cel animation with pixel-art DNA, crisp silhouettes, bright readable lighting, expressive dog-warrior characters, upgraded gear and powers that feel earned through gameplay. Not photorealistic, not generic 3D, not muddy grimdark.
World logic: this is a serialized HashBeast show produced by the game world. Scenes can be war rooms, streets, homes, clubs, stadium tunnels, temples, labs, ports, courts, markets, rooftops, private jets, palace corridors, or absurd political offices. Do NOT force mining equipment or floating crypto cubes into every shot.
Camera grammar: default to locked or deliberate camera movement, level horizon, clear readable staging, medium-wide deep-focus masters for group comedy, low-angle hero shots for power, fast inserts only for punchline objects, and close-ups only for emotional/reaction beats.
Comedy/thriller grammar: play the situation straight first, then break it with one absurd dog-world detail, a sharp reaction, a power reveal, or a cliffhanger. Make it bingeable like a real show, not a product tutorial.
Reference rule: if character images are attached, they are hard identity anchors. Preserve breed, colors, face, outfit language, silhouette, gear family, and power motif. Upgrade/evolve through added details, not by redesigning the character.
Frame: ${aspect}. Keep the main subject/action readable in center-safe composition for crops. No captions, readable text, watermarks, logos, or UI baked into generated frames.`;
}

export function buildDialogueRulesBlock(targetSeconds?: number): string {
  const secs =
    targetSeconds && isFinite(targetSeconds) ? Math.max(4, targetSeconds) : 8;
  const minWords = Math.max(8, Math.round(secs * 1.7));
  const maxWords = Math.min(34, Math.round(secs * 2.8));
  return `DIALOGUE RULES
Each spoken line must fit the shot duration: target ${minWords}-${maxWords} words for ~${secs}s unless the shot is deliberately silent.
Lines must sound like characters in a comic thriller talking under pressure, not ad copy or a pitch deck. Avoid slogans, tutorial language, "screensaver" jokes, "founder's table", "pick up a pickaxe", "mine your destiny", or explaining mechanics directly.
Use concrete stakes, rivalry, fear, confidence, betrayal, orders, warnings, jokes, or threats. If a stat matters, make it something a character reacts to, hides, weaponizes, or panics about.`;
}

export function buildVideoMotionRulesBlock(format?: Partial<VideoFormat>): string {
  const aspect = format?.aspectRatio || DEFAULT_ASPECT;
  return `VIDEO MOTION RULES
Animate the existing keyframe only. Do not change species, outfit, gear, markings, colors, or art style mid-shot.
Motion should be cinematic but controlled: decisive push-ins, locked tension, snap reactions, slow hero reveals, precise hand/ear/tail/body acting, environmental parallax, power glow, cloth movement, screen reflections, and crowd/background reactions.
For dialogue, show believable muzzle/jaw motion, eye focus, brow/ear changes, and body emphasis timed to the line. If external TTS is used, do not generate competing music or speech.
Aspect ${aspect}; keep the subject center-safe and readable.`;
}

export function buildNegativeVisualPrompt(): string {
  return `NEGATIVE: no photorealistic fur, no realistic dog anatomy, no generic 3D render, no muddy dark grade, no random crypto logos, no unreadable text, no floating boxes unless explicitly requested, no redesigning attached characters, no species swap, no extra limbs, no warped faces, no handheld drift, no shallow bokeh portrait blur, no UI overlays, no watermark.`;
}

export function buildCharacterReferenceBlock(
  hb: HashBeastLike,
  label = "HASHBEAST",
): string {
  const p = hb.personality || {};
  const sc = hb.story_context || {};
  const beats = Array.isArray(sc.recent_beats)
    ? sc.recent_beats.slice(-3).join(" | ")
    : "";
  const threads = Array.isArray(sc.unresolved_threads)
    ? sc.unresolved_threads.slice(-3).join(" | ")
    : "";
  return [
    `${label} CANON`,
    hb.mint ? `mint: ${hb.mint}` : "",
    hb.breed ? `breed: ${hb.breed}` : "",
    hb.evolution_stage != null ? `evolution stage: ${hb.evolution_stage}` : "",
    hb.bio ? `bio: ${hb.bio}` : "",
    [p.archetype, p.tone, p.motivation].filter(Boolean).length
      ? `personality: ${[p.archetype, p.tone, p.motivation].filter(Boolean).join(", ")}`
      : "",
    p.catchphrase ? `catchphrase: ${p.catchphrase}` : "",
    p.rivalry ? `rivalry: ${p.rivalry}` : "",
    p.visual_attitude ? `visual attitude: ${p.visual_attitude}` : "",
    sc.current_arc ? `current arc: ${sc.current_arc}` : "",
    beats ? `recent story beats: ${beats}` : "",
    threads ? `unresolved threads: ${threads}` : "",
    hb.asset_urls?.dp ? `reference dp: ${hb.asset_urls.dp}` : "",
    hb.asset_urls?.fullBody ? `reference full-body: ${hb.asset_urls.fullBody}` : "",
  ].filter(Boolean).join("\n");
}
