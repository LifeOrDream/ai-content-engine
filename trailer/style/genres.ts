/**
 * GENRE REGISTRY — what kind of video this is, as a first-class input.
 *
 * The audit's #1 finding: every video we ship is the same genre (narrative
 * dialogue drama), and social feeds reward repeatable VARIETY. A genre swaps
 * the beat architecture, the caption strategy, and the music strategy while
 * the same writers-room brain (engagement canon, voice profiles, lint) does
 * the writing. Set `genre:` in a blueprint's frontmatter; "story" keeps the
 * classic trailer behavior.
 *
 * beatTemplate is injected into the writers-room pass UNDER the dopamine
 * ladder — the ladder is genre-agnostic attention physics; the template says
 * how this genre climbs it.
 */

export interface GenreSpec {
  id: string;
  label: string;
  /** Beat architecture injected into the writers-room pass. */
  beatTemplate: string;
  /** How music is sourced/used — guidance for the produce pass + assembly. */
  musicMode: "bed" | "track-first" | "native";
  /** Caption posture: karaoke = word-timed dialogue captions; sparse = fact captions only. */
  captionMode: "karaoke" | "sparse";
  /** Sweet-spot duration band in seconds. */
  durationBand: [number, number];
  /** One-line note shown in the runner. */
  note: string;
}

const STORY: GenreSpec = {
  id: "story",
  label: "Story episode",
  beatTemplate: `GENRE: STORY EPISODE (serialized mini-drama — the classic shape).
- Full dopamine ladder, full change spine. Beats are scenes with dialogue, rivalry, comedy, and a non-obvious payoff.
- 6-10 beats. Dialogue carries the middle; ON-SCREEN carries facts.`,
  musicMode: "native",
  captionMode: "karaoke",
  durationBand: [40, 90],
  note: "serialized mini-drama (default)",
};

const SKIT: GenreSpec = {
  id: "skit",
  label: "POV meme skit",
  beatTemplate: `GENRE: POV MEME SKIT (caption-driven single-situation comedy).
- ONE situation, 1-3 beats, 8-20 seconds total. The OVERLAY text frames the joke ("POV: your country is losing the mine"); the scene IS the punchline.
- Dialogue optional — at most one or two lines; the visual reaction carries it. The caption/overlay does the framing work a narrator would.
- The stun and the premise are the same beat: frame 1 must BE the joke's setup. No setup shots, no establishing wides.
- Payoff is a reversal or an absurd escalation of the premise, not a story arc. Spine still exists but compressed: the change can be one emotion flipping.`,
  musicMode: "bed",
  captionMode: "karaoke",
  durationBand: [8, 20],
  note: "single-joke POV skit, overlay-framed",
};

const FACEOFF: GenreSpec = {
  id: "faceoff",
  label: "Trash-talk face-off",
  beatTemplate: `GENRE: TRASH-TALK FACE-OFF (two rivals, verbal sparring).
- Exactly TWO characters from rival countries. Structure: challenge → counter → escalation → one of them lands a knockout line → loser's reaction held a beat too long.
- 4-7 beats, 20-45 seconds. Every line is a status move: taunt, dare, dismissal, flex, comeback. The LOOP question is "who wins this exchange?"
- Alternate POV shot to shot (shot/counter-shot rhythm). The knockout line is the payoff; the loser's silent reaction is the affection beat (we love a sore loser).
- Cliffhanger: the loser's country gets a tease of revenge ("opens" a rematch question).`,
  musicMode: "native",
  captionMode: "karaoke",
  durationBand: [20, 45],
  note: "two rivals, verbal sparring, knockout line",
};

const LORE: GenreSpec = {
  id: "lore",
  label: "Lore drop mini-doc",
  beatTemplate: `GENRE: LORE DROP (mini-documentary / storytime voiceover).
- ONE narrator voice across the whole video (a single character telling the story TO the viewer — confession, war story, origin myth). Other characters appear silently in the visuals.
- 5-9 beats, 30-60 seconds. The narrator's spoken track is nearly continuous (storytime cadence ~2.3 words/sec, short punchy sentences) — write it as one monologue distributed across the beats.
- Visuals are cinematic stills-energy: slow reveals, held compositions, one detail per beat. The narration says the feeling; the screen shows the evidence.
- The payoff is a secret or reframe ("the war didn't start over the dBTC"). Cliffhanger: the narrator knows something they refuse to say yet.`,
  musicMode: "bed",
  captionMode: "karaoke",
  durationBand: [30, 60],
  note: "single-narrator storytime over cinematic visuals",
};

const RECAP: GenreSpec = {
  id: "recap",
  label: "War report recap",
  beatTemplate: `GENRE: WAR REPORT (sports-center style cycle recap — breathless, fast, factual-AS-drama).
- An anchor/commentator character calls the highlights of a war cycle like a sports desk: who surged, who choked, the final-minute steal. 5-8 beats, 25-45 seconds.
- Pacing is the fastest of any genre: hard cuts, one stat or moment per beat. ON-SCREEN carries the numbers; the mouth carries disbelief, hype, and editorializing.
- Structure: cold-open on the single most insane moment (mid-replay) → standings whiparound → the choke → the steal → "next cycle starts now" cliffhanger.
- Every fact must be performed, not read: the anchor reacts to the board like it personally offended them.`,
  musicMode: "bed",
  captionMode: "karaoke",
  durationBand: [25, 45],
  note: "sports-desk cycle recap, stat-per-beat",
};

const ANTHEM: GenreSpec = {
  id: "anthem",
  label: "Faction anthem / music video",
  beatTemplate: `GENRE: FACTION ANTHEM (music-video energy — the track leads, the cuts follow).
- The video is a hype piece for ONE country: its beasts, its gear, its swagger. Minimal dialogue (0-2 shouted lines max); the MUSIC and the imagery carry it.
- 6-10 beats written as visual escalations cut to a beat grid: pose → gear flex → power reveal → squad lineup → war moment → flag moment. Each beat is one striking composition with motion, not a scene.
- Write a LYRIC/CHANT line per beat in the ON-SCREEN channel (these become karaoke captions over the track). Keep them chantable: 3-7 words.
- The stun is the loudest image you have. The payoff is the full squad assembled. Cliffhanger: a rival country's silhouette answers.`,
  musicMode: "track-first",
  captionMode: "karaoke",
  durationBand: [20, 45],
  note: "one country hype piece, track-led cuts",
};

const EDIT: GenreSpec = {
  id: "edit",
  label: "Vibe edit",
  beatTemplate: `GENRE: VIBE EDIT (AMV-style montage — pure aesthetic momentum).
- No dialogue at all. 8-16 ultra-short beats (1-3s each), 15-30 seconds total, hardest cuts in the catalog — every beat is one striking moment: an impact, a transformation frame, a slow-mo flex, a glare.
- Beats are chosen for VISUAL ENERGY, not story: motion direction should alternate (left-rush, right-rush, push-in, pull-back) so the montage breathes.
- One OVERLAY line max, placed early ("wait for the drop"). The change spine compresses to: calm → chaos → icon shot.
- The final beat holds 1.5-2s on the single most iconic composition (the wallpaper shot).`,
  musicMode: "track-first",
  captionMode: "sparse",
  durationBand: [15, 30],
  note: "no-dialogue beat-cut montage",
};

const LOOP: GenreSpec = {
  id: "loop",
  label: "Win-dance loop",
  beatTemplate: `GENRE: WIN-DANCE LOOP (seamless celebration loop — meme fuel).
- ONE character, ONE celebratory motion (dance, flex, taunt) staged so the last frame flows back into the first (write the action as a cycle: pose → move → peak → return to pose).
- 1-2 beats, 5-10 seconds. No dialogue. One OVERLAY bait line ("send this to a USA holder").
- The motion must be specific and rhythmic enough to read as a dance/celebration even silent — describe the exact move cycle in ACTION.
- This is deliberately the simplest genre: its job is to be looped, captioned by viewers, and reposted.`,
  musicMode: "bed",
  captionMode: "sparse",
  durationBand: [5, 10],
  note: "seamless single-move celebration loop",
};

export const GENRES: GenreSpec[] = [STORY, SKIT, FACEOFF, LORE, RECAP, ANTHEM, EDIT, LOOP];

/** Resolve a genre id (blueprint frontmatter `genre:`). Unknown/empty → story. */
export function genreSpec(id?: string | null): GenreSpec {
  const key = String(id || "story").trim().toLowerCase();
  return GENRES.find((g) => g.id === key) || STORY;
}
