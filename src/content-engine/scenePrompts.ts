import {
  buildDialogueRulesBlock,
  buildDirectorPromptBlock,
  buildNegativeVisualPrompt,
} from "./directorGrammar.js";

export interface SceneScriptPromptInput {
  storySoFar?: string;
  leadingFactionName?: string;
  arcPhase?: string;
  trope: string;
  cliffhanger?: string;
  characterLine: string;
  protagonistCanonBlock: string;
  ownerProfileBlock?: string;
  bio?: string;
  catchphrase?: string;
  speaks?: string;
  contextPromptBlocks?: string;
  plotDirectives: string;
  pulseBlock?: string;
  costarNames?: string;
  whatHappens: string;
  videoDurationSecs?: number;
}

export function buildSceneScriptPrompt(input: SceneScriptPromptInput): string {
  const costars = input.costarNames
    ? `\nCO-STARS IN FRAME: ${input.costarNames}. Play the multi-way rivalry — the protagonist above is the one who SPEAKS; the co-stars react.`
    : "";
  const pulse = input.pulseBlock ? `\n${input.pulseBlock}\n` : "";
  const duration = input.videoDurationSecs || 8;
  const minWords = duration < 5 ? 6 : Math.ceil(Math.max(0, duration - 1.4) * 2.3 * 0.58);
  const maxWords = Math.ceil(Math.max(4, duration - 0.7) * 2.4);

  return `You write ONE ~${duration}-second scene of an ongoing, serialized country-vs-country NFT mining-war show. The character (a stylized dog-warrior mascot) is on camera and SPEAKS one line. This scene must CONTINUE the episode's story, not stand alone.

EPISODE SO FAR: ${input.storySoFar || "(early in the episode)"}
CURRENT LEADER: ${input.leadingFactionName || "undecided"} | ARC: ${input.arcPhase || "rising"}
DRAMATIC FRAME (trope to play): ${input.trope}
${input.cliffhanger ? `CARRYING CLIFFHANGER: ${input.cliffhanger}` : ""}

CHARACTER: ${input.characterLine}
${input.protagonistCanonBlock}
${input.ownerProfileBlock ? `\n${input.ownerProfileBlock}` : ""}
${input.bio ? `BIO: ${input.bio}` : ""}
${input.catchphrase ? `CATCHPHRASE: ${input.catchphrase}` : ""}
${input.speaks ? `SPEAKS: ${input.speaks}` : ""}
${input.contextPromptBlocks ? `\n${input.contextPromptBlocks}\n` : ""}
${input.plotDirectives}${pulse}${costars}

${input.whatHappens}

${buildDirectorPromptBlock({ aspectRatio: "9:16" })}

${buildDialogueRulesBlock(input.videoDurationSecs)}

Dialogue timing for this scene: target ${minWords}-${maxWords} spoken words unless the scene explicitly uses silence, interruption, or reaction time. Do not write a tiny tagline for a long speaking window. The line must be behavior: a bluff, dare, accusation, recruitment attempt, confession, deflection, joke hiding fear, or rivalry move. It must not sound like a feature label, landing page, crypto tutorial, or prop inventory.

Use the short-form formula: a HOOK in the first beat, quick escalation, a payoff, and a LOOP/cliffhanger feel. Write STRICT JSON (no markdown):
{
  "scene": "Motion/camera direction ONLY for an image-to-video model — how it MOVES and EMOTES + camera energy + the diegetic action. Do NOT re-describe appearance. 1 sentence.",
  "dialogue": "the single spoken line, in-character, ${minWords}-${maxWords} words for ~${duration}s unless deliberately sparse; express the cultural style; may include a SHORT native-language phrase. Just the words.",
  "caption": "scroll-stopping social caption + 1-2 emoji, <140 chars, ideally ending on an open loop."
}`;
}

export interface SceneKeyframePromptInput {
  eventFlavor: string;
  factionName: string;
  breed: string;
  profession: string;
  canonBlocks: string[];
  storySoFar?: string;
  cliffhanger?: string;
  scene: string;
  dialogue?: string;
}

export function buildSceneKeyframePrompt(input: SceneKeyframePromptInput): string {
  return [
    buildDirectorPromptBlock({ aspectRatio: "9:16" }),
    `Create the STARTING STORYBOARD FRAME for one 9:16 animated show scene, not a poster and not a game UI.`,
    `Event flavor: ${input.eventFlavor}. Protagonist nation: ${input.factionName}. Breed: ${input.breed}. Role: ${input.profession}.`,
    input.canonBlocks.join("\n\n"),
    input.storySoFar ? `Episode continuity: ${input.storySoFar}` : "",
    input.cliffhanger ? `Carried cliffhanger: ${input.cliffhanger}` : "",
    `Scene direction to visualize: ${input.scene}`,
    input.dialogue
      ? `The protagonist is about to say: "${input.dialogue}". Show a readable pre-speech expression and body pose.`
      : "",
    `Use a proper in-world location that fits the country/personality and the beat. It can be a normal show setting, not necessarily a mine. Keep lighting bright and readable; no excessive floating boxes or random crystal clutter.`,
    `Composition: full or medium-full character visibility, strong expression, center-safe, room for motion, premium bright HashBeast keyframe.`,
    buildNegativeVisualPrompt(),
  ].filter(Boolean).join("\n");
}
