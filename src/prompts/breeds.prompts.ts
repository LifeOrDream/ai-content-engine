/**
 * Breed Registry - Maps faction ID + breed value to breed data
 *
 * Each faction has 4 breeds (determined by 2 bits in DNA, values 0-3).
 * The breed defines the dog's physical body type and silhouette.
 *
 * 12 factions × 4 breeds = 48 total breed types
 */

// =============================================================================
// TYPES
// =============================================================================

export interface BreedData {
  /** Breed name (real dog breed) */
  name: string;
  /** Short description of the breed */
  description: string;
  /** Detailed body/appearance prompt for image generation */
  bodyPrompt: string;
  /** Silhouette description for consistent shapes */
  silhouette: string;
}

// =============================================================================
// BREED REGISTRY
// =============================================================================

/**
 * Complete breed registry: BREED_REGISTRY[factionId][breedValue]
 */
export const BREED_REGISTRY: Record<number, Record<number, BreedData>> = {
  // Faction 0: USA
  0: {
    0: {
      name: "Golden Retriever",
      description: "Loyal, friendly, and athletic golden-furred retriever",
      bodyPrompt:
        "A Golden Retriever dog body — medium-large muscular build, broad chest, flowing golden fur, feathered tail carried high, friendly open face with gentle eyes, athletic proportions, thick double coat with wavy texture",
      silhouette:
        "Medium-large dog with flowing coat, feathered tail, broad friendly head",
    },
    1: {
      name: "Husky",
      description: "Striking wolf-like sled dog with piercing blue eyes",
      bodyPrompt:
        "A Siberian Husky dog body — medium athletic build, thick double coat, erect triangular ears, striking facial markings, bushy sickle tail, wolf-like appearance, compact and powerful musculature, piercing blue or heterochromatic eyes",
      silhouette:
        "Medium wolf-like dog with erect ears, thick coat, curled bushy tail",
    },
    2: {
      name: "Corgi",
      description: "Short-legged, long-bodied herding dog with big personality",
      bodyPrompt:
        "A Pembroke Welsh Corgi dog body — low-set elongated body, very short sturdy legs, fox-like pointed ears and face, fluffy round rear, big expressive eyes, thick medium-length coat, compact and surprisingly muscular build",
      silhouette:
        "Short-legged elongated body, large pointed ears, fox-like face, no tail",
    },
    3: {
      name: "Australian Shepherd",
      description: "Agile herding dog with striking merle coat patterns",
      bodyPrompt:
        "An Australian Shepherd dog body — medium well-proportioned athletic build, beautiful merle or tri-color coat with distinctive patterns, medium-length wavy fur, natural bob tail, intelligent alert expression, feathered legs and chest",
      silhouette:
        "Medium athletic dog with merle markings, feathered coat, bob tail",
    },
  },

  // Faction 1: China
  1: {
    0: {
      name: "Chow Chow",
      description: "Lion-like fluffy dog with distinctive blue-black tongue",
      bodyPrompt:
        "A Chow Chow dog body — sturdy compact build, extremely thick lion-like mane of fur around head and neck, deep-set almond eyes, blue-black tongue, small rounded ears hidden in fur, straight hind legs giving stilted gait, profusely fluffy coat",
      silhouette:
        "Compact lion-like dog with massive fluffy mane, small ears, thick coat",
    },
    1: {
      name: "Shih Tzu",
      description: "Regal little lion dog with flowing luxurious coat",
      bodyPrompt:
        "A Shih Tzu dog body — small compact sturdy build, long flowing silky coat that reaches the ground, flat face with large round dark eyes, short muzzle with underbite, long ears draped in fur, tail curled over back with plume, aristocratic bearing",
      silhouette:
        "Small compact dog with extremely long flowing coat, flat face, plumed tail",
    },
    2: {
      name: "Pekingese",
      description: "Flat-faced palace dog with rolling lion-like gait",
      bodyPrompt:
        "A Pekingese dog body — small low-to-ground build with rolling gait, extremely flat face with prominent eyes, long flowing double coat forming a mane, short bowed legs, tail carried over back in plume, regal and dignified expression",
      silhouette:
        "Small flat-faced dog with mane-like coat, bowed legs, plumed tail over back",
    },
    3: {
      name: "Chinese Crested",
      description: "Elegant hairless dog with flowing crest and plume",
      bodyPrompt:
        "A Chinese Crested dog body — fine-boned elegant slender build, mostly hairless smooth skin with flowing crest of hair on head, plume on tail, and fur socks on feet, large erect ears, graceful long neck, alert expressive face",
      silhouette:
        "Slender elegant mostly hairless dog with flowing hair crest, large ears",
    },
  },

  // Faction 2: Russia
  2: {
    0: {
      name: "Samoyed",
      description: "Fluffy white smiling sled dog with perpetual grin",
      bodyPrompt:
        "A Samoyed dog body — medium-large sturdy build, brilliant white thick fluffy double coat, signature upturned 'Sammy smile' mouth, dark almond eyes contrasting white fur, erect triangular ears, tail curled over back, powerful yet elegant build",
      silhouette:
        "Medium-large fluffy white dog with curled tail, smiling face, erect ears",
    },
    1: {
      name: "Borzoi",
      description: "Tall elegant Russian sighthound with aristocratic bearing",
      bodyPrompt:
        "A Borzoi dog body — tall slender greyhound-like elegant build, long narrow aristocratic head with Roman nose, deep chest with dramatic tuck-up, long silky wavy coat especially on chest and hindquarters, graceful flowing lines, regal posture",
      silhouette:
        "Tall slender sighthound with narrow head, deep chest, flowing silky coat",
    },
    2: {
      name: "Siberian Husky",
      description: "Endurance sled dog built for the frozen tundra",
      bodyPrompt:
        "A Siberian Husky dog body — medium compact working build, dense thick double coat, distinctive facial mask markings, erect triangular ears, blue or multicolored eyes, bushy brush tail, powerful but not bulky, built for endurance in extreme cold",
      silhouette:
        "Medium compact wolf-like dog with thick coat, mask markings, brush tail",
    },
    3: {
      name: "Yakutian Laika",
      description: "Rugged arctic spitz-type with thick protective coat",
      bodyPrompt:
        "A Yakutian Laika dog body — medium strong compact build, very thick weather-resistant double coat, broad head with dark almond eyes, triangular erect ears, powerful legs built for snow, tail curled tightly over back, sturdy muscular physique",
      silhouette:
        "Medium sturdy spitz-type dog with very thick coat, curled tail, broad head",
    },
  },

  // Faction 3: India
  3: {
    0: {
      name: "Indian Spitz",
      description: "Fluffy white companion with fox-like features",
      bodyPrompt:
        "An Indian Spitz dog body — small to medium fluffy build, thick white double coat, fox-like pointed face with alert expression, erect triangular ears, plumed tail curled over back, bright dark eyes, compact and lively proportions",
      silhouette:
        "Small fluffy white dog with fox face, erect ears, plumed curled tail",
    },
    1: {
      name: "Rajapalayam",
      description: "Powerful white sighthound of South Indian royalty",
      bodyPrompt:
        "A Rajapalayam dog body — tall powerful muscular build, pure white short coat, deep chest with lean athletic physique, long legs built for speed, pink nose and golden eyes, whip-like tail, noble and commanding presence, greyhound-like proportions",
      silhouette:
        "Tall muscular white sighthound with deep chest, long legs, whip tail",
    },
    2: {
      name: "Indian Pariah",
      description: "Ancient natural landrace dog, resilient and intelligent",
      bodyPrompt:
        "An Indian Pariah dog body — medium well-balanced athletic build, short smooth coat in tan/brown, wedge-shaped head with alert erect ears, curled or sickle tail, lean and agile proportions, bright intelligent eyes, naturally evolved hardy physique",
      silhouette:
        "Medium athletic dog with wedge head, erect ears, curled tail, short coat",
    },
    3: {
      name: "Himalayan Sheepdog",
      description: "Large powerful mountain guardian with thick coat",
      bodyPrompt:
        "A Himalayan Sheepdog dog body — large heavy-boned powerful build, thick long double coat suited for mountain cold, broad head with strong jaws, deep-set watchful eyes, bushy tail, massive chest and shoulders, imposing mountain guardian physique",
      silhouette:
        "Large heavy powerful dog with thick long coat, broad head, bushy tail",
    },
  },

  // Faction 4: Japan
  4: {
    0: {
      name: "Shiba Inu",
      description: "Compact spirited Japanese spitz with fox-like charm",
      bodyPrompt:
        "A Shiba Inu dog body — small compact muscular build, thick double coat with sesame/red coloring, fox-like face with alert triangular erect ears, curled tail over back, dark triangular eyes with confident expression, agile and well-proportioned",
      silhouette:
        "Small compact dog with fox face, triangular ears, tightly curled tail",
    },
    1: {
      name: "Akita Inu",
      description: "Large powerful Japanese guardian with dignified bearing",
      bodyPrompt:
        "An Akita Inu dog body — large powerful heavy-boned build, thick plush double coat, broad massive head with small deep-set triangular eyes, small erect ears, large curled tail over back, bear-like presence, dignified and imposing stature",
      silhouette:
        "Large powerful bear-like dog with massive head, thick coat, curled tail",
    },
    2: {
      name: "Japanese Spitz",
      description: "Pure white fluffy companion with joyful expression",
      bodyPrompt:
        "A Japanese Spitz dog body — small to medium elegant build, brilliant pure white fluffy double coat, pointed fox-like face with dark eyes and nose, erect triangular ears, plumed tail curled over back, cheerful alert expression, graceful proportions",
      silhouette:
        "Small white fluffy dog with pointed face, erect ears, plumed tail",
    },
    3: {
      name: "Shikoku",
      description: "Athletic wolf-like hunting dog from mountain forests",
      bodyPrompt:
        "A Shikoku dog body — medium athletic wolf-like build, sesame or brindle double coat, wedge-shaped head with alert expression, erect triangular ears, sickle or curled tail, muscular and agile mountain hunter physique, wild and primitive appearance",
      silhouette:
        "Medium wolf-like athletic dog with wedge head, erect ears, sickle tail",
    },
  },

  // Faction 5: South Korea
  5: {
    0: {
      name: "Jindo",
      description: "Loyal and intelligent Korean hunting spitz",
      bodyPrompt:
        "A Korean Jindo dog body — medium well-proportioned athletic build, thick double coat in white/fawn/brindle, wedge-shaped head with pointed muzzle, erect triangular ears, tail curled over back or sickle-shaped, alert intelligent expression, natural and balanced physique",
      silhouette:
        "Medium athletic spitz with wedge head, erect ears, curled tail",
    },
    1: {
      name: "Sapsali",
      description: "Shaggy ghost-chasing Korean dog with long flowing coat",
      bodyPrompt:
        "A Sapsali dog body — medium sturdy build completely covered in long shaggy flowing coat, hair falling over eyes, droopy ears hidden in fur, beard and mustache of long fur, tail lost in coat plume, lovable disheveled appearance, like a walking mop of fur",
      silhouette:
        "Medium dog completely covered in long shaggy flowing fur, hidden features",
    },
    2: {
      name: "White Jindo",
      description: "Pristine white variant of the noble Jindo breed",
      bodyPrompt:
        "A White Jindo dog body — medium athletic build with pure white thick double coat, clean wedge-shaped head, erect triangular ears, bright alert dark eyes contrasting white fur, tail curled proudly over back, noble dignified bearing, pristine white appearance",
      silhouette:
        "Medium athletic pure white dog with erect ears, curled tail, clean lines",
    },
    3: {
      name: "Pungsan",
      description: "Powerful North Korean mountain hunting dog",
      bodyPrompt:
        "A Pungsan dog body — large powerful muscular build, thick white or cream double coat, broad strong head with powerful jaws, erect pointed ears, tail curled over back, deep chest, built for mountain hunting in harsh conditions, imposing yet graceful",
      silhouette:
        "Large powerful white dog with broad head, erect ears, curled tail",
    },
  },

  // Faction 6: Iran
  6: {
    0: {
      name: "Persian Saluki",
      description: "Ancient royal sighthound of Persia, the oldest dog breed",
      bodyPrompt:
        "A Persian Saluki dog body — tall elegant slender build, smooth or feathered silky coat, narrow refined aristocratic head with deep soulful eyes, long silky pendant ears, long curved tail with silky feathering, deep narrow chest, greyhound-like grace, ancient royal sighthound",
      silhouette:
        "Tall elegant slender sighthound with silky ears, feathered tail, narrow chest",
    },
    1: {
      name: "Sarabi Mastiff",
      description: "Massive guardian mastiff from the mountains of Iran",
      bodyPrompt:
        "A Sarabi Mastiff dog body — very large heavy powerful build, short dense coat, massive broad head with heavy jowls and wrinkles, pendant ears, thick muscular neck, deep barrel chest, heavy-boned legs, natural long tail, imposing mountain guardian mastiff physique",
      silhouette:
        "Very large heavy mastiff with massive head, heavy jowls, barrel chest",
    },
    2: {
      name: "Persian Shepherd",
      description: "Rugged livestock guardian from the Zagros Mountains",
      bodyPrompt:
        "A Persian Shepherd dog body — large sturdy muscular build, thick medium-length weather-resistant coat, broad head with alert intelligent expression, medium pendant ears, strong neck with slight mane, deep chest, powerful legs, bushy tail, mountain working dog physique",
      silhouette:
        "Large sturdy shepherd with thick coat, broad head, powerful mountain build",
    },
    3: {
      name: "Khalaj Greyhound",
      description: "Swift desert coursing hound bred for the Iranian plains",
      bodyPrompt:
        "A Khalaj Greyhound dog body — medium tall lean aerodynamic build, short smooth coat, narrow streamlined head with dark keen eyes, small folded rose ears, long thin whip tail, extremely deep chest with tucked waist, long powerful legs, pure speed incarnate",
      silhouette:
        "Medium tall lean greyhound with narrow head, deep chest, tucked waist",
    },
  },

  // Faction 7: UK
  7: {
    0: {
      name: "English Bulldog",
      description: "Iconic stocky British breed with unmistakable face",
      bodyPrompt:
        "An English Bulldog dog body — medium compact heavily muscular build, short smooth coat, massive broad head with heavy wrinkles and undershot jaw, small folded rose ears, very wide stance, barrel chest, short screw tail, stocky powerful Churchillian physique",
      silhouette:
        "Medium compact muscular bulldog with massive wrinkled head, wide stance",
    },
    1: {
      name: "Pembroke Welsh Corgi",
      description: "Royal favourite with short legs and big personality",
      bodyPrompt:
        "A Pembroke Welsh Corgi dog body — small low-set sturdy build, medium-length double coat in red/sable/tri-color, fox-like face with alert intelligent expression, large erect pointed ears, no tail (natural bob), long body with short powerful legs, royal favourite proportions",
      silhouette:
        "Small low-set long-bodied dog with large erect ears, fox face, no tail",
    },
    2: {
      name: "Border Collie",
      description: "Brilliant herding dog from the Scottish-English border",
      bodyPrompt:
        "A Border Collie dog body — medium athletic agile build, medium-length double coat often black and white, intelligent keen face with intense herding gaze, medium semi-erect ears, long feathered tail, athletic balanced proportions, coiled energy ready to spring",
      silhouette:
        "Medium athletic dog with keen intelligent face, semi-erect ears, feathered tail",
    },
    3: {
      name: "Jack Russell Terrier",
      description: "Fearless compact terrier with boundless energy",
      bodyPrompt:
        "A Jack Russell Terrier dog body — small compact athletic build, short smooth or rough white coat with brown/black patches, keen alert face with bright eyes, small V-shaped folded ears, straight tail carried high, muscular for size, boundless terrier energy",
      silhouette:
        "Small compact athletic terrier with alert face, folded ears, high tail",
    },
  },

  // Faction 8: North Korea
  8: {
    0: {
      name: "Pungsan",
      description: "National treasure hunting dog of North Korea",
      bodyPrompt:
        "A Pungsan dog body — large powerful muscular build, thick brilliant white double coat, broad head with strong jaws and determined expression, erect pointed ears, tail curled proudly over back, deep broad chest, mighty mountain hunter physique, imposing and fierce",
      silhouette:
        "Large powerful white dog with broad head, erect ears, curled tail, thick coat",
    },
    1: {
      name: "Dark Pungsan",
      description: "Rare dark-coated variant of the legendary Pungsan",
      bodyPrompt:
        "A Dark Pungsan dog body — large powerful muscular build, thick dark coat in charcoal/dark brown, broad head with intense focused expression, erect pointed ears, tail curled over back, deep chest, formidable mountain hunting physique, darker and more mysterious variant",
      silhouette:
        "Large powerful dark-coated dog with broad head, erect ears, curled tail",
    },
    2: {
      name: "Northern Spitz",
      description: "Hardy spitz-type adapted to extreme northern conditions",
      bodyPrompt:
        "A Northern Spitz dog body — medium compact sturdy build, extremely thick weather-proof double coat, wedge-shaped face with small alert ears, dark eyes with vigilant expression, tail tightly curled over back, built for brutal cold, dense and robust physique",
      silhouette:
        "Medium compact dog with extremely thick coat, small ears, tight curled tail",
    },
    3: {
      name: "Paektu Wolf-Dog",
      description: "Legendary wolf-like dog from sacred Paektu Mountain",
      bodyPrompt:
        "A Paektu Wolf-Dog body — large tall wolf-like athletic build, thick grey/silver coat with darker saddle markings, long narrow muzzle with amber eyes, large erect ears, long bushy tail held low, lean powerful legs, wild and untamed wolf-hybrid appearance",
      silhouette:
        "Large tall wolf-like dog with narrow muzzle, large ears, bushy low tail",
    },
  },

  // Faction 9: France
  9: {
    0: {
      name: "French Bulldog",
      description: "Compact muscular companion with signature bat ears",
      bodyPrompt:
        "A French Bulldog dog body — small compact muscular build, smooth short coat, large signature bat-like erect ears, flat brachycephalic face with wrinkles, big round expressive eyes, short corkscrew tail, stocky barrel chest, charming and comical proportions",
      silhouette:
        "Small compact muscular dog with large bat ears, flat face, stocky build",
    },
    1: {
      name: "Poodle",
      description: "Elegant intelligent dog with distinctive curly coat",
      bodyPrompt:
        "A Standard Poodle dog body — medium-large elegant athletic build, dense curly hypoallergenic coat, long refined head with dark intelligent eyes, long floppy ears covered in curly fur, carried tail, proud regal posture, graceful and dignified proportions",
      silhouette:
        "Medium-large elegant dog with curly coat, long ears, proud refined posture",
    },
    2: {
      name: "Papillon",
      description: "Dainty butterfly-eared toy dog with elegant plume",
      bodyPrompt:
        "A Papillon dog body — tiny fine-boned delicate build, long silky flowing coat, signature large butterfly-wing erect ears with long fringed fur, refined small head with alert expression, long plumed tail arched over back, dainty graceful proportions",
      silhouette:
        "Tiny delicate dog with huge butterfly-wing fringed ears, plumed tail",
    },
    3: {
      name: "Berger Picard",
      description: "Rustic shaggy herding dog with roguish eyebrows",
      bodyPrompt:
        "A Berger Picard dog body — medium-large lean athletic build, rough wiry shaggy coat, distinctive heavy eyebrows and beard giving roguish expression, large erect ears, natural long tail, strong herding dog proportions, charmingly scruffy and rugged",
      silhouette:
        "Medium-large lean shaggy dog with big eyebrows, erect ears, rough coat",
    },
  },

  // Faction 10: Brazil
  10: {
    0: {
      name: "Fila Brasileiro",
      description:
        "The legendary Brazilian Mastiff — massive tracking guardian with loose skin and a fearless tracking instinct",
      bodyPrompt:
        "A Fila Brasileiro dog body — large powerful heavy-boned build, loose wrinkled skin on face and neck, short dense coat in brindle or fawn, broad chest with immense muscular shoulders, strong sturdy legs, long tapering muzzle with distinctive droopy lips, large pendant ears, thick muscular neck, massive guardian physique built for tracking and guarding on Brazilian estates",
      silhouette: "large_muscular",
    },
    1: {
      name: "Brazilian Terrier",
      description:
        "The Fox Paulistinha — nimble tricolor terrier of Sao Paulo, bred for vermin hunting and endless energy",
      bodyPrompt:
        "A Brazilian Terrier dog body — small-medium sleek athletic build, short smooth tricolor coat with white base, black markings on head and tan markings on legs and face, long legs built for agility, lean deep chest, long tapered muzzle with keen dark eyes, erect or semi-erect ears, resembling a Fox Paulistinha, energetic urban hunter of the Paulistano streets",
      silhouette: "athletic_lean",
    },
    2: {
      name: "Brazilian Dogo",
      description:
        "The Dogue Brasileiro — compact bulldog-type from the favelas, muscular and determined with a broad head",
      bodyPrompt:
        "A Dogue Brasileiro dog body — medium compact muscular build, short smooth coat in white with brindle patches, broad square head with strong jaw, short muzzle with dark eyes, small folded ears, thick muscular neck and shoulders, strong sturdy legs, resembling a Dogue Brasileiro, built for urban protection and companionship in Brazilian communities",
      silhouette: "compact_sturdy",
    },
    3: {
      name: "Caramelo Vira-Lata",
      description:
        "The iconic Brazilian stray — medium-sized mutt with caramel coloring, adaptable, street-smart, and beloved nationwide",
      bodyPrompt:
        "A Caramelo vira-lata dog body — medium build, short smooth caramel-tan coat with possible white chest markings, alert triangular ears that may be erect or semi-erect, expressive dark eyes, medium-length tail that may curve slightly upward, lean but healthy physique, resembling the famous Brazilian stray dog that has become a national symbol, adaptable street-smart survivor",
      silhouette: "medium_balanced",
    },
  },

  // Faction 11: Israel
  11: {
    0: {
      name: "Canaan Dog",
      description:
        "Israel's national breed, ancient pariah dog of the Holy Land",
      bodyPrompt:
        "A Canaan Dog body — medium square athletic build, short harsh double coat in sand/cream/red/black with white markings, wedge-shaped head with alert dark almond eyes, large erect pointed ears, bushy tail curled over back, agile desert-adapted physique, primitive and keen",
      silhouette:
        "Medium square athletic dog with erect pointed ears, curled bushy tail",
    },
    1: {
      name: "Baladi Dog",
      description: "Common Middle Eastern street dog, resourceful survivor",
      bodyPrompt:
        "A Baladi street dog body — medium lean athletic build, short smooth coat in varied colors (tan/black/white mix), alert intelligent face with sharp eyes, medium semi-erect ears, natural curved tail, lean wiry street-survivor physique, adaptable and clever",
      silhouette:
        "Medium lean athletic street dog with semi-erect ears, curved tail",
    },
    2: {
      name: "Israel Pointer",
      description: "Athletic hunting dog adapted to Mediterranean terrain",
      bodyPrompt:
        "An Israel Pointer dog body — medium-large lean muscular sporting build, short smooth coat in liver/white or orange/white, noble head with keen hunting expression, long pendant ears, straight tail carried level, deep chest, powerful legs, Mediterranean hunter physique",
      silhouette:
        "Medium-large lean sporting dog with pendant ears, noble head, straight tail",
    },
    3: {
      name: "Negev Desert Dog",
      description: "Hardy wild-type dog from the harsh Negev desert",
      bodyPrompt:
        "A Negev Desert Dog body — medium compact sturdy build, short dense coat in sandy/tan adapted to extreme desert, pointed fox-like face with alert amber eyes, large erect ears for heat dissipation, bushy tail, lean heat-efficient physique, desert-hardened primitive dog",
      silhouette:
        "Medium compact sandy dog with large erect ears, fox-like face, bushy tail",
    },
  },
};

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get breed data for a specific faction and breed value
 */
export function getBreedForHashBeast(
  factionId: number,
  breedValue: number,
): BreedData {
  const factionBreeds = BREED_REGISTRY[factionId];
  if (!factionBreeds) {
    // Fallback to faction 0 if unknown faction
    return BREED_REGISTRY[0][breedValue % 4];
  }
  return factionBreeds[breedValue % 4] || factionBreeds[0];
}

/**
 * Get the body prompt string for a specific faction and breed value
 * This is the key string used in image generation to define the dog's physical appearance
 */
export function getBreedPrompt(factionId: number, breedValue: number): string {
  const breed = getBreedForHashBeast(factionId, breedValue);
  return breed.bodyPrompt;
}

/**
 * Get breed name for display purposes
 */
export function getBreedName(factionId: number, breedValue: number): string {
  const breed = getBreedForHashBeast(factionId, breedValue);
  return breed.name;
}

/**
 * Get all breeds for a faction
 */
export function getFactionBreeds(factionId: number): BreedData[] {
  const factionBreeds = BREED_REGISTRY[factionId];
  if (!factionBreeds) return [];
  return [
    factionBreeds[0],
    factionBreeds[1],
    factionBreeds[2],
    factionBreeds[3],
  ];
}
