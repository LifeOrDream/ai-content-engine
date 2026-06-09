import {
  buildDialogueRulesBlock,
  buildDirectorPromptBlock,
} from "./directorGrammar.js";
import { parseJsonLoose as parseJsonLooseShared } from "./llmText.js";
import type {
  CastMember,
  FactionStanding,
  Screenplay,
  StoryGrounding,
  VideoFormat,
} from "./types.js";

function pct(n?: number): string {
  if (n == null || !isFinite(n)) return "flat";
  const sign = n >= 0 ? "+" : "";
  return `${sign}${n.toFixed(1)}%`;
}

function economyBlock(g: StoryGrounding): string {
  const e = g.economy;
  const bits: string[] = [];
  bits.push(`Country Race cycle #${g.cycle || "?"} (a 4-hour cycle).`);
  if (e.priceSol != null) {
    bits.push(
      `$degenBTC price ${e.priceSol.toPrecision(3)} SOL (${pct(e.priceChangePct)} this cycle).`,
    );
  }
  if (e.emissionRateEnd != null) {
    bits.push(
      `Emissions ${Math.round(e.emissionRateEnd).toLocaleString()} dBTC/sec (${pct(e.emissionChangePct)} — emissions move inversely-ish with price each cycle).`,
    );
  }
  if (e.miningMultiplier != null) {
    bits.push(
      `Mining multiplier ${e.miningMultiplier.toFixed(2)}× (price-driven reward amplifier).`,
    );
  }
  if (e.winningFaction) bits.push(`Currently winning the race: ${e.winningFaction}.`);
  if (e.stakingAprPct) bits.push(`dBTC staking APR ~${e.stakingAprPct.toFixed(0)}%.`);
  return bits.join(" ");
}

function standingsBlock(standings: FactionStanding[]): string {
  return standings
    .slice(0, 6)
    .map((s, i) => {
      const parts: string[] = [`#${(s.rank ?? i) + 1} ${s.name}`];
      if (s.rankDelta) parts.push(`(${s.rankDelta > 0 ? "▲" : "▼"}${Math.abs(s.rankDelta)})`);
      if (s.roundWins) parts.push(`${s.roundWins} wins`);
      if (s.mutationScore) parts.push(`${s.mutationScore} mutations`);
      if (s.usersDelta) parts.push(`${s.usersDelta >= 0 ? "+" : ""}${s.usersDelta} recruits`);
      if (s.minted != null && s.target) parts.push(`${s.minted}/${s.target} minted`);
      if (s.dbtcAprPct) parts.push(`${s.dbtcAprPct.toFixed(0)}% APR`);
      let line = parts.join(" · ");
      if (s.geopolitics) line += `\n     real-world: ${s.geopolitics}`;
      return `  ${line}`;
    })
    .join("\n");
}

function castBlock(cast: CastMember[]): string {
  return cast
    .map((c) => {
      const p = c.personality || {};
      return [
        `• ${c.factionName} HashBeast  [mint: ${c.mint}]`,
        `  ${c.breed || "dog"}, evolution stage "${c.stageName || "?"}", ${c.isWizard ? "WIZARD" : "MUGGLE"} — "${c.occupation || "warrior"}"${c.region ? ` (${c.region})` : ""}.`,
        c.bio ? `  Bio: ${c.bio}` : "",
        `  Personality: ${[p.archetype, p.tone, p.motivation].filter(Boolean).join(", ") || "proud"}${p.catchphrase ? `; catchphrase "${p.catchphrase}"` : ""}${p.rivalry ? `; rivalry: ${p.rivalry}` : ""}.`,
        `  Voice: ${c.voice.accent}, ${c.voice.timbre} — ${c.voice.directive}. (speak this character's lines in this voice/language: ${c.voice.language})`,
        c.leaderName
          ? `  Country leader: ${c.leaderName}${c.leaderCatchphrase ? ` — "${c.leaderCatchphrase}"` : ""}.`
          : "",
        c.rank != null ? `  Their country is currently rank #${c.rank + 1} in the race.` : "",
      ].filter(Boolean).join("\n");
    })
    .join("\n\n");
}

function craftBlock(g: StoryGrounding, format: VideoFormat): string {
  const crops = format.defaultOutputs.filter((a) => a !== format.aspectRatio);
  const frameRule = `FRAME ${format.aspectRatio}${crops.length ? ` (also cropped to ${crops.join("/")} — KEEP the main subject/action CENTERED so the crops still frame it)` : ""}. Each shot needs a CAPTION (punchy on-screen text) for sound-off viewing.`;
  const shared = [
    `4. SHOW, DON'T TELL: reveal economy/geopolitics THROUGH behavior, rivalry, fear, status games, props, and on-screen facts — not narration. Hard numbers belong in captions/visuals unless a character is weaponizing that number in a natural argument.`,
    `5. CHARACTER: every line must have a want + tactic: recruit, threaten, bluff, confess, deflect, bait, mourn, dare, reassure, or taunt. If the line could be moved to a landing page, caption, or mechanic tooltip, rewrite it.`,
    `6. DIALOGUE TIMING: do not write tiny taglines for long shots. A speaking shot should carry enough words for its duration unless the action explicitly spends time on silence, interruption, reaction, or physical comedy.`,
    `7. ${frameRule}`,
  ];
  if (format.craftMode === "feature") {
    return [
      `═══════════ HOW TO MAKE IT LAND (craft rules — obey strictly) ═══════════`,
      `1. OPEN STRONG: the first 3–5s must hook — a bold cold-open or sharp title beat that promises the payoff. No dead air, no slow logo.`,
      `2. PACING: a developed ${Math.round(format.targetSeconds / 60 * 10) / 10}-min video — shots 4–8s, room to breathe between hits but NEVER boring. ≈ ${format.targetSeconds}s across ${format.minShots}–${format.maxShots} shots. Build in mini-beats (almost chapters): intro → stakes → escalation → the turn → payoff → outro.`,
      `3. SPINE: tell a COMPLETE story this episode with a satisfying payoff (this plays on YouTube/Twitter/IG, not a Shorts feed — earn the watch-through), while still teasing what's next.`,
      ...shared,
      `8. OUTRO/CTA: the LAST shot is an outro — the cast rallying viewers to pick a country + mine $degenBTC at minebtc.fun.`,
      `9. Keep it FUN, sharp, a little unhinged — degen energy, meme-aware, grounded in our world's aesthetic.`,
    ].join("\n");
  }
  return [
    `═══════════ HOW TO MAKE IT GO VIRAL (craft rules — obey strictly) ═══════════`,
    `1. COLD OPEN: Shot 1 must hook in the FIRST 1–2 SECONDS — drop us mid-action or on a shocking/funny line. NO slow intro, NO logo, NO "meanwhile in…". Earn the next 2 seconds, then the next.`,
    `2. PACING: short shots (3–8s each), fast cuts, rising stakes. Total runtime ≈ ${format.targetSeconds}s across ${format.minShots}–${format.maxShots} shots.`,
    `3. SPINE: hook → setup → escalation → a turn/twist → payoff → CLIFFHANGER (an open loop that makes them wait for the next episode).`,
    ...shared,
    `8. Keep it FUN, fast, and a little unhinged — degen energy, meme-aware, but grounded in our world's aesthetic.`,
  ].join("\n");
}

export function buildScreenplayPrompt(
  g: StoryGrounding,
  format: VideoFormat,
): string {
  return `You are the SHOWRUNNER + head writer of a hit ${format.craftMode === "feature" ? "episodic video series (YouTube/Instagram/Twitter)" : "vertical short-form series"} — a satirical, hyper-engaging country-vs-country comedy set inside a crypto mining war. Write the screenplay for ONE ${format.craftMode === "feature" ? "2–3 minute episode" : "episode reel"}.

═══════════ THE WORLD (canon — never contradict) ═══════════
• 12 nations (USA, China, Russia, South Korea, India, Japan, Iran, UK, North Korea, France, Brazil, Israel) are at WAR to mine the most $degenBTC — this world's Bitcoin, on Solana.
• Their soldiers are HashBeasts: stylized dog-warrior mascots. Each nation fields up to 3,000 of them (36,000 total). Real humans recruit them and play.
• The war runs in 4-hour "COUNTRY RACE" cycles. Each cycle a country wins. Between cycles the economy shifts: $degenBTC's price moves, EMISSIONS (dBTC minted per second) adjust, a mining MULTIPLIER changes the rewards, staking APR fluctuates.
• HashBeasts are WIZARDS (Wall Street Sorcerers, Pentagon Battle Mages, Juche Sorcerers…) or MUGGLES (the President's dog, a tycoon's pet…). They EVOLVE through stages, MUTATE new traits, and grow more powerful — and they trash-talk rival nations relentlessly.
• It is a PARODY grounded in REAL current geopolitics: rivalries mirror the real world (USA↔Iran, China↔Taiwan, Russia↔Ukraine, NK posturing, US↔China tech race…), framed as the doge mining war. Country-level satire only — never depict real named individuals.

═══════════ THIS EPISODE — LIVE STATE (ground every beat in these real facts) ═══════════
ECONOMY: ${economyBlock(g)}

THE RACE (current standings):
${standingsBlock(g.standings) || "  (standings warming up)"}

CAST (write these exact characters, in their voices):
${castBlock(g.cast) || "  (no specific cast — use the leading + chasing nations as characters)"}

SERIES SO FAR: ${g.series.storySoFar || "(this is an early episode)"}
LAST EPISODE'S CLIFFHANGER (continue this thread): ${g.series.lastCliffhanger || "(none yet)"}

THE SPARK (what this episode is about): ${g.spark}

${craftBlock(g, format)}

═══════════ DIRECTOR + DIALOGUE GRAMMAR ═══════════
${buildDirectorPromptBlock(format)}

${buildDialogueRulesBlock(Math.round(format.targetSeconds / Math.max(format.minShots, 1)))}

═══════════ DIALOGUE QUALITY GATE — RUN BEFORE JSON OUTPUT ═══════════
For every spoken line, silently check:
1. What does the speaker WANT from the listener right now?
2. What TACTIC are they using — bluff, dare, accusation, recruitment, confession, deflection, joke hiding fear, rivalry move?
3. Does the line fit the shot time when spoken at ~2.3 words/sec?
4. Would this still sound like the same character if the prop/caption were hidden?
5. Did you avoid prop labels, mechanic phrases, founder/pitch language, and inspirational thesis lines?
If any answer fails, rewrite the line before output.

═══════════ OUTPUT — STRICT JSON ONLY (no markdown, no commentary) ═══════════
{
  "logline": "one-sentence hook for the post",
  "theme": "the dramatic through-line",
  "hook": "the exact cold-open line/moment (first 1-2s)",
  "cliffhanger": "the open loop carried into the next episode",
  "caption": "the social caption (<150 chars, punchy, 1-2 emoji)",
  "hashtags": ["#degenBTC", "..."],
  "shots": [
    {
      "n": 1,
      "beat": "cold_open|setup|escalation|turn|payoff|cliffhanger",
      "durationSec": 5,
      "location": "the setting, grounded in the nation's world",
      "cast": ["<mint of the beast(s) on screen, from the CAST list; [] if a crowd/establishing>"],
      "shotType": "extreme close-up | low-angle hero | wide establishing | over-the-shoulder | insert",
      "cameraMotion": "slow push-in | whip pan | static | handheld | crane up",
      "keyframe": "FULL still-image description for this shot: which character(s) (by nation+breed+stage), exact pose/expression, props from their gear, the setting, lighting, mood. Pixel-art game aesthetic. This is the storyboard frame the image model will draw.",
      "action": "the on-screen MOTION — what physically happens in these ~5s (diegetic).",
      "dialogue": { "speaker": "<mint of the speaking beast>", "line": "the spoken line, in-character, in that nation's voice; may drop ONE native word", "emotion": "smug|furious|triumphant|panicked|deadpan" },
      "caption": "on-screen text (<60 chars)",
      "sound": "sfx/music cue"
    }
  ],
  "storySoFarNext": "one updated paragraph of 'the story so far' to carry the series forward"
}

Write ${format.minShots}–${format.maxShots} shots. ${format.craftMode === "feature" ? "Open strong and make every scene earn attention; end on the outro CTA" : "Make shot 1 an absolute scroll-stopper"}. Ground it all in the LIVE STATE above. Output ONLY the JSON.`;
}

function clamp(n: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, n));
}

export function parseJsonLoose<T>(raw: string): T | null {
  return parseJsonLooseShared<T>(raw);
}

export function normalizeScreenplay(
  sp: any,
  g: StoryGrounding,
  format: VideoFormat,
): Screenplay | null {
  if (!sp || !Array.isArray(sp.shots) || sp.shots.length === 0) return null;
  const validMints = new Set(g.cast.map((c) => c.mint));
  const primaryMint = g.cast[0]?.mint || "";
  const shots = sp.shots.slice(0, format.maxShots).map((s: any, i: number) => {
    let cast: string[] = Array.isArray(s.cast)
      ? s.cast.filter((m: any) => typeof m === "string")
      : [];
    if (cast.length === 0 && primaryMint) cast = [primaryMint];
    const dialogue = s.dialogue && s.dialogue.line
      ? {
          speaker:
            typeof s.dialogue.speaker === "string"
              ? s.dialogue.speaker
              : cast[0] || "",
          line: String(s.dialogue.line).slice(0, 220),
          emotion: s.dialogue.emotion ? String(s.dialogue.emotion) : undefined,
        }
      : undefined;
    if (dialogue && dialogue.speaker && !validMints.has(dialogue.speaker)) {
      dialogue.speaker = cast.find((m) => validMints.has(m)) || "";
    }
    return {
      n: i + 1,
      beat: String(s.beat || (i === 0 ? "cold_open" : "escalation")),
      durationSec: clamp(Number(s.durationSec) || 5, 3, 10),
      location: String(s.location || "the mining floor").slice(0, 200),
      cast,
      shotType: String(s.shotType || "medium").slice(0, 60),
      cameraMotion: String(s.cameraMotion || "static").slice(0, 60),
      keyframe: String(s.keyframe || s.action || "").slice(0, 900),
      endFrame: s.endFrame ? String(s.endFrame).slice(0, 600) : undefined,
      action: String(s.action || "").slice(0, 600),
      dialogue,
      caption: s.caption ? String(s.caption).slice(0, 80) : undefined,
      sound: s.sound ? String(s.sound).slice(0, 80) : undefined,
    };
  });
  return {
    logline: String(sp.logline || "").slice(0, 200),
    theme: String(sp.theme || "").slice(0, 200),
    hook: String(sp.hook || "").slice(0, 200),
    cliffhanger: String(sp.cliffhanger || "").slice(0, 300),
    caption: String(sp.caption || "").slice(0, 200),
    hashtags: Array.isArray(sp.hashtags)
      ? sp.hashtags.slice(0, 8).map((h: any) => String(h))
      : ["#degenBTC"],
    shots,
    storySoFarNext: String(sp.storySoFarNext || g.series.storySoFar || "").slice(0, 1500),
  };
}

export function normalizeScreenplayFromRawText(
  rawText: string | null,
  grounding: StoryGrounding,
  format: VideoFormat,
): Screenplay | null {
  if (!rawText) return null;
  return normalizeScreenplay(parseJsonLoose<any>(rawText), grounding, format);
}
