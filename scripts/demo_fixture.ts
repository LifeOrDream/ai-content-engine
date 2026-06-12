import {
  beatText,
  buildCharacterReferenceBlock,
  buildFakeStoryGrounding,
  buildNegativeVisualPrompt,
  buildSceneKeyframePrompt,
  buildSceneScriptPrompt,
  fakeHashBeast,
  fakeReelFormat,
  pickTrope,
  scoreBeat,
} from "../src/content-engine/index.js";
import { bibleLeader } from "../src/world/bible.js";

function excerpt(text: string, max = 360): string {
  return text.length <= max ? text : `${text.slice(0, max).trim()}...`;
}

const event = {
  kind: "lead_change" as const,
  event_id: "fixture-demo-lead-change",
  mint: fakeHashBeast.mint,
  faction_id: 0,
};

const grounding = buildFakeStoryGrounding();
const factionName = "USA";
const role = "champion";
const arc = "finale";
const trope = pickTrope(event.kind, role, arc);
const plannedBeat = {
  text: beatText(event.kind, factionName, event),
  worth: scoreBeat(event.kind, role, arc),
  trope,
  sceneWorthy: true,
};

const characterCanon = buildCharacterReferenceBlock(fakeHashBeast, "PROTAGONIST");
const sceneScriptPrompt = buildSceneScriptPrompt({
  storySoFar: grounding.series.storySoFar,
  leadingFactionName: grounding.economy.winningFaction,
  arcPhase: arc,
  trope,
  cliffhanger: grounding.series.lastCliffhanger,
  characterLine: `${bibleLeader(0)!.name}, USA Golden Retriever Super Commander`,
  protagonistCanonBlock: characterCanon,
  plotDirectives:
    "The 4:20 countdown has appeared under Wall Street. Rex must realize this is not a normal market panic.",
  whatHappens:
    "Write a tense but funny 8-second scene where Rex sees a second country signal blink online and tries to act like he planned it.",
  videoDurationSecs: 8,
});

const keyframePrompt = buildSceneKeyframePrompt({
  eventFlavor: plannedBeat.text,
  factionName,
  breed: fakeHashBeast.breed || "Golden Retriever",
  profession: "Federal Reserve War-Room Commander",
  canonBlocks: [characterCanon],
  storySoFar: grounding.series.storySoFar,
  cliffhanger: grounding.series.lastCliffhanger,
  scene:
    "Rex stands in a hidden command room under a financial district, caught between confidence and panic as a rival country screen lights up behind him.",
  dialogue: "Somebody woke up early. Good. I hate boring victories.",
});

const packet = {
  demo: "fixture",
  noPaidApis: true,
  input: {
    event,
    factionName,
    role,
    arc,
    format: fakeReelFormat,
  },
  output: {
    plannedBeat,
    characterCanon: excerpt(characterCanon),
    sceneScriptPrompt: excerpt(sceneScriptPrompt, 900),
    keyframePrompt: excerpt(keyframePrompt, 900),
    negativePrompt: buildNegativeVisualPrompt(),
  },
  qualityScorecardTemplate: {
    characterConsistency: "1-5",
    brandFit: "1-5",
    dialogue: "1-5",
    motionPotential: "1-5",
    storyContinuity: "1-5",
    artifactRisk: "1-5 where 1 is clean and 5 is risky",
  },
};

console.log(JSON.stringify(packet, null, 2));
