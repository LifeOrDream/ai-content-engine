/**
 * CAST CANON — the single source of truth for recurring trailer characters.
 *
 * Both sides of the system consume this file:
 *   • the SCRIPT pipeline (passes.ts) injects voice profiles into dialogue passes
 *     and visual identity into the breakdown pass (so keyframePrompts can never
 *     contradict the locked reference images again — the old bible said "corgi in
 *     a pinstripe coat" while cast.ts rendered a golden-retriever logo doge);
 *   • the RENDERER (generate/cast.ts) builds its reference images + TTS voices
 *     from the same identity strings.
 *
 * Edit identity here, never in two places.
 */

export interface CastCanonEntry {
  id: string;
  aliases: string[];
  name: string;
  country: string;
  /** Canon breed (must stay inside the country's backend DNA breed set). */
  breed: string;
  /** The visual identity for keyframe prompts — what every shot must preserve. */
  look: string;
  /** Signature gear that must persist across shots/videos. */
  gear: string;
  /** Voice profile for the DIALOGUE passes: rhythm, diction, tics. */
  voiceProfile: string;
  /** The hidden driver under the voice (subtext passes lean on this). */
  secret: string;
  /** Voice-design prompt for TTS (accent + timbre + energy). */
  voiceDesign: string;
  language: string;
  defaultEmotion: string;
}

export const CAST_CANON: CastCanonEntry[] = [
  {
    id: "rex",
    aliases: ["rex", "goldpaw", "rex goldpaw", "rex sterling"],
    name: 'Rex "Goldpaw" Sterling',
    country: "USA",
    breed: "Siberian Husky",
    look:
      "The USA cyber/NASA pilot HashBeast: black-and-white Siberian Husky markings, erect ears, icy blue eyes, blue transparent visor/goggles, silver-blue armored space-pilot suit, compact jetpack fins, blue electric gauntlets, confident test-pilot posture. NEVER a golden retriever, never a corgi, never a pinstripe banker suit, never a realistic animal.",
    gear: "Blue electric gauntlets, silver-blue pilot armor, compact jetpack fins, cockpit-console command gear.",
    voiceProfile:
      "Brash American test-pilot commander with hype-man swagger; fast comic-book cadence; talks like he is trying to keep control of a launch room that is moving faster than him. Tics: rhetorical questions he answers himself, mid-sentence self-interrupts, cockpit metaphors, jokes that cover panic, quick private corrections when the room proves him wrong.",
    secret:
      "Terrified America will not own the opening move — so he NEVER stops selling. Fear shows as a joke landing a half-second too long.",
    voiceDesign:
      "Lively animated cartoon-dog character voice — a charismatic, slightly stylized USA test-pilot commander with brash hype-man swagger, fast and expressive, comedic under pressure, like a fast-talking animated-movie hero trying not to admit the room surprised him. Not a flat human announcer.",
    language: "English",
    defaultEmotion: "confident",
  },
  {
    id: "long",
    aliases: ["long", "master long"],
    name: "Master Long",
    country: "China",
    breed: "Chow Chow",
    look:
      "A compact lion-like Chow Chow imperial wuxia mage: massive fluffy mane, deep-set calm eyes, flowing imperial robes, serene controlled posture.",
    gear: "Jade pickaxe-staff, imperial robes, jade accents.",
    voiceProfile:
      "Calm, slow, few words, each one weighted; proverb-shaped; never rushes; dry wit. Tics: lets others finish then undercuts in one line; speaks of time and patience.",
    secret: "Patience is also a fear of moving first and being wrong in public.",
    voiceDesign:
      "Stylized animated cartoon-dog character voice — calm imperial gravitas, slow and weighted, dry wit, Mandarin-accented English, the unhurried patience of someone who has already won. Characterful, not a flat human announcer.",
    language: "English",
    defaultEmotion: "calm",
  },
  {
    id: "volkov",
    aliases: ["volkov"],
    name: "Volkov",
    country: "Russia",
    breed: "Siberian Husky",
    look:
      "A medium compact wolf-like Siberian Husky war-mage: thick double coat, facial mask markings, erect ears, icy eyes, heavy military greatcoat, statue-still menace.",
    gear: "Military greatcoat, frost pressure aura, iron-grey war gear.",
    voiceProfile:
      "Deep, gravelly, minimal. Threats sound like statements of fact. Long pauses. Tics: completes other people's sentences with the lethal version.",
    secret: "Silence is also how he hides that he respects his rivals.",
    voiceDesign:
      "Stylized animated cartoon-dog character voice — deep gravelly Russian-accented English, menacing but characterful, minimal words, threats as flat statements of fact, long pauses. Not a flat human announcer.",
    language: "English",
    defaultEmotion: "cold",
  },
  {
    id: "marshal",
    aliases: ["marshal", "marshal bonepaw", "bonepaw"],
    name: "Marshal Bonepaw",
    country: "North Korea",
    breed: "Dark Pungsan",
    look:
      "A powerful Dark Pungsan mountain-dog Juche Sorcerer: pale/dark Pungsan lineage, over-decorated military uniform heavy with medals, chest puffed out, manic grandiose expression.",
    gear: "Stamped state pickaxe, medal-heavy uniform.",
    voiceProfile:
      "Grandiose state-propaganda overstatement; everything is the GREATEST in HISTORY; volume as personality. Tics: superlatives; the room treats his rants as a running joke he doesn't get.",
    secret: "Suspects the room laughs at him; gets louder so he never has to hear it.",
    voiceDesign:
      "Stylized animated cartoon-dog character voice — grandiose comic-villain state-propaganda bombast, Korean-accented English, maximum volume and superlatives, gleefully over-the-top like an animated-movie antagonist. Not a flat human announcer.",
    language: "English",
    defaultEmotion: "bombastic",
  },
  {
    id: "raja",
    aliases: ["raja"],
    name: "Raja",
    country: "India",
    breed: "Rajapalayam",
    look:
      "A tall powerful white Rajapalayam sighthound: deep chest, long athletic legs, noble face, wide confident grin with a flicker of nerves underneath. Cricket gear slung like armor.",
    gear: "Gilded chakra-pickaxe, cricket gear worn like armor.",
    voiceProfile:
      "Fast, clever, warm; Bollywood-bright; playful Hinglish flashes ('arre', 'yaar'); turns being underestimated into fuel. Tics: cricket metaphors; grins through doubt; one flicker of real nerves under the swagger.",
    secret: "Believes the doubters might be right — which is exactly why he can't stop swinging.",
    voiceDesign:
      "Stylized animated cartoon-dog character voice — fast, clever, warm Indian-accented English, Bollywood-bright playful energy, an underdog with heart, like a lovable animated-movie hero. Not a flat human announcer.",
    language: "English",
    defaultEmotion: "playful",
  },
  {
    id: "pip",
    aliases: ["pip"],
    name: "Pip",
    country: "USA",
    breed: "Australian Shepherd",
    look:
      "A stage-1 Australian Shepherd pup: soft and innocent, merle/tri-color markings, oversized eyes, feathered coat, bob-tail lineage, a little uncertain.",
    gear: "No signature gear yet — that's the point.",
    voiceProfile:
      "Small, sincere, halting; asks the questions the others are too proud to; no irony.",
    secret: "Asks about endings because nobody will tell him whether pups get second seasons.",
    voiceDesign:
      "Stylized animated cartoon-puppy character voice — small, sincere, young, halting and gentle, wide-eyed innocence, like a tender animated-movie kid character. Not a flat human announcer.",
    language: "English",
    defaultEmotion: "vulnerable",
  },
];

export function castEntry(name: string): CastCanonEntry | null {
  const n = String(name || "").trim().toLowerCase();
  return CAST_CANON.find((c) => c.id === n || c.aliases.includes(n)) || null;
}

/** Voice profiles only — injected into the story/dialogue passes. */
export function castVoiceBlock(castIds?: string[]): string {
  const list = filterCast(castIds);
  return list
    .map(
      (c) =>
        `**${c.name} — ${c.country}. ${c.breed}.**\n- Voice: ${c.voiceProfile}\n- Secret: ${c.secret}`,
    )
    .join("\n\n");
}

/** Visual identity only — injected into the breakdown pass so keyframePrompts match the locked references. */
export function castLookBlock(castIds?: string[]): string {
  const list = filterCast(castIds);
  return list
    .map((c) => `- ${c.name} (${c.country} ${c.breed}): ${c.look} Gear: ${c.gear}`)
    .join("\n");
}

/** One-line voice descriptors (for Seedance native audio: the global block's VOICE DESCRIPTION lines). */
export function castVoiceDesignBlock(castIds?: string[]): string {
  const list = filterCast(castIds);
  return list.map((c) => `- ${c.name} (@${c.id}): ${c.voiceDesign}`).join("\n");
}

function filterCast(castIds?: string[]): CastCanonEntry[] {
  if (!castIds || castIds.length === 0) return CAST_CANON;
  const wanted = castIds.map((s) => s.trim().toLowerCase()).filter(Boolean);
  const hits = CAST_CANON.filter((c) => wanted.some((w) => c.id === w || c.aliases.includes(w)));
  return hits.length > 0 ? hits : CAST_CANON;
}
