/**
 * ENGAGEMENT CANON — the dopamine ladder, distilled for 24-90s MineBTC trailers.
 *
 * Source framework: six escalating dopamine releases in a viewer's brain —
 * stimulation → captivation → anticipation → validation → affection → revelation.
 * The script pipeline's FIRST pass builds the beat sheet directly around this
 * ladder (attention-first story architecture), and every shot carries an explicit
 * LOOP line so a deterministic lint can verify loop hygiene without an extra LLM call.
 */

export const ENGAGEMENT_CANON = `
THE DOPAMINE LADDER (attention architecture — every trailer must climb all six):

L1 STIMULATION (first 1-2 SECONDS — the visual stun):
- The first frame must be a visual stun gun: distinct color + motion + contrast that does NOT look like the rest of the feed. No slow fade-ins, no logo first, no establishing wide that takes 3s to mean something.
- Specify the stun concretely in shot 1: what moves, what color pops, what is strange in frame. "Black screen, a line types out" only works because the typing IS the motion and the strangeness.
- The stun buys 2 seconds. Nothing else. Do not spend it on information.

L2 CAPTIVATION (seconds 2-8 — pop THE question):
- One big, relevant, non-obvious question must pop inside the viewer's head — stated or implied. Not on screen: IN THEIR HEAD.
- Write the exact question in the shot's LOOP line. If you cannot write the question a beat pops, the beat is dead — cut or rewrite it.
- The question must be relevant to a degen/crypto/internet-native viewer AND big enough to need an answer ("this cartoon dog knows he's AI — what does he want from me?" beats "what is this token?").
- Unknown > known: a strange premise they have never seen pops harder than a familiar one stated loudly.

L3 ANTICIPATION (the middle — let them guess, then head-fake):
- As soon as the question pops, the viewer starts guessing the answer. Feed details that sharpen their guess — each detail must move them CLOSER to an answer, not sideways into noise.
- Peak dopamine is JUST BEFORE the answer. So just before the payoff, yank: a misdirect, a twist, an interruption (the 11 monitors waking up mid-pitch is a head-fake).
- Answer → new question. Close a small loop and immediately open a bigger one. This seesaw is the binge engine.
- Confusion kills anticipation. Every fed detail must be instantly comprehensible; if a fact needs decoding, the guess-game dies and they scroll.

L4 VALIDATION (the payoff — close the loop, non-obviously):
- The main question THIS video popped must get answered IN this video. Never leave the core loop open — an unclosed core loop reads as a scam, not a cliffhanger.
- The answer must be NON-OBVIOUS — something they would not have guessed at L2. If the answer is exactly what they guessed, the dopamine is refunded.
- The cliffhanger is a NEW loop opened after the payoff, not the payoff withheld.

L5 AFFECTION (like the messenger, not just the message):
- At least one beat per video exists purely to make the POV character likable: charm, vulnerability, a self-aware joke, an act that costs them something. Likability compounds across episodes — it buys longer leashes on every future video.
- Likability tells for MineBTC: Rex's fear leaking through a joke, Raja grinning through doubt, Pip asking the question nobody answers. Sincerity lands harder than swagger.

L6 REVELATION (train the Pavlovian bell — the serial promise):
- The ending must teach: "every one of these pays off." Close this episode's loop, open next episode's loop, stamp the countdown. Same world, same faces, escalating war — so seeing a HashBeast in the feed eventually IS the dopamine hit.
- The end-card is a promise, not a goodbye: what specifically do they get by coming back / clicking?

THE CHANGE SPINE (story skeleton — a story IS a change):
- A story is a CHANGE in a character, object, or situation. If nothing changes, it's a list — not a story. Every video must answer: WHO or WHAT is different at the last second vs the first, and how?
- Skeleton: IDENTITY (who/what they are now) → CONFLICT (what presses on them) → CHOICE (what they decide under pressure) → CHANGE (what they become). The dopamine ladder carries attention; this spine carries meaning. Climb both.
- Chronology is flexible: you may open mid-action, hook-first, or ending-first-then-flashback — but all four bones must exist somewhere in the video.
- The viewer keeps watching to learn HOW the change happened — the gap between "chemistry teacher" and "kingpin" is the watchable part. Make the gap visible early, then make them watch it close.

ESCALATION + PROGRESS MARKERS (the middle must grow, and promise more):
- Escalate: each middle beat should be bigger in stakes, scale, or risk than the one before — small → medium → huge. Raising a loop should also raise the stakes; a detail that doesn't escalate is filler.
- Progress markers: signpost that more is coming (a second rival waking up, "that was only the first…", a counter climbing). The viewer should always sense a path ahead with more payoffs on it.

STAKES (asymmetry — the teller risks, the viewer gains):
- Every video states (in story, not narration) what the POV character stands to LOSE and what the viewer stands to GAIN. Stakes the audience can feel beat abstract danger.
- MineBTC's native cheat code: the HashBeasts' EXISTENCE is the stake — no attention → no degenBTC → no more episodes → no more THEM. The strongest card in the deck; play it sincerely, not in every shot.

HOOK LINE FORMULAS (for the hook + captions — real value + an emotional root in ONE line):
- Target a concrete value AND hit an emotion in the same line ("Give me 60 seconds and your competitors will hate you" = fast value + rivalry).
- X & Y rule: X = problem/curiosity, Y = result/twist/promise. "If X, don't Y." / "You're doing X — THAT's why you're not getting Y."
- Information gap: "I know something you don't" framing; say only enough that the brain demands the rest.
- The "but" pivot: set an expectation, then break it mid-sentence ("Old king's got scarcity, sure. BUT…").

PERSPECTIVE (show, don't state — feed the viewer's imagination):
- Never state a condition you can show: not "he is poor" — "he counts coins before buying milk." Not a big number as a caption — the physical stack filling the room.
- Give the viewer the perspective and let them do the imagining; what they imagine themselves is what makes the story feel premium and theirs.

LOOP BOOKKEEPING (mandatory, machine-checked):
- Every shot carries a LOOP line with exactly one of:
    LOOP: opens "<the question popped in the viewer's head>"
    LOOP: raises "<which open question>" — <the detail/guess fed>
    LOOP: head-fake "<which open question>" — <the misdirect>
    LOOP: closes "<which question>" — <the non-obvious answer>
    LOOP: closes "<question>" + opens "<next-episode question>"   (cliffhanger only)
- Rules the lint enforces: shot 1 opens a loop; every opened loop is closed in-video OR explicitly carried by the cliffhanger; at least one head-fake exists before the payoff; the payoff closes the core loop; the cliffhanger opens a new one.
`.trim();
