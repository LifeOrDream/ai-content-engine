export interface HashBeastLike {
  mint?: string;
  bio?: string;
  breed?: string;
  evolution_stage?: number;
  faction_id?: number;
  asset_urls?: { dp?: string; fullBody?: string };
  personality?: {
    archetype?: string;
    tone?: string;
    motivation?: string;
    catchphrase?: string;
    rivalry?: string;
    visual_attitude?: string;
  };
  story_context?: {
    current_arc?: string;
    recent_beats?: string[];
    unresolved_threads?: string[];
    relationships?: Record<string, string>;
  };
}

export interface Shot {
  n: number;
  beat: string;
  durationSec: number;
  location: string;
  cast: string[];
  shotType: string;
  cameraMotion: string;
  keyframe: string;
  endFrame?: string;
  action: string;
  dialogue?: { speaker: string; line: string; emotion?: string };
  caption?: string;
  sound?: string;
}

export interface Screenplay {
  logline: string;
  theme: string;
  hook: string;
  cliffhanger: string;
  caption: string;
  hashtags: string[];
  shots: Shot[];
  storySoFarNext: string;
}

export type AspectKey = "9:16" | "16:9" | "1:1";

export interface VideoFormat {
  id?: string;
  label?: string;
  width?: number;
  height?: number;
  aspectRatio: AspectKey;
  minShots: number;
  maxShots: number;
  targetSeconds: number;
  craftMode: "short_form" | "feature";
  defaultOutputs: AspectKey[];
  advancesSeries?: boolean;
  endCard?: boolean;
  eventName?: string;
}

export interface CastMember {
  mint: string;
  factionId: number;
  factionName: string;
  factionCode: string;
  leaderName: string;
  leaderCatchphrase: string;
  isWizard: boolean;
  occupation: string;
  region: string;
  breed: string;
  stageName: string;
  bio: string;
  personality: {
    archetype?: string;
    tone?: string;
    catchphrase?: string;
    motivation?: string;
    rivalry?: string;
  };
  voice: { accent: string; timbre: string; language: string; directive: string };
  rank?: number;
  multiplier?: number;
}

export interface FactionStanding {
  factionId: number;
  name: string;
  rank?: number;
  rankDelta?: number;
  roundWins?: number;
  gameplayScore?: number;
  mutationScore?: number;
  users?: number;
  usersDelta?: number;
  minted?: number;
  target?: number;
  dbtcAprPct?: number;
  soldOut?: boolean;
  geopolitics?: string;
}

export interface EconomyState {
  cycle?: number;
  priceSol?: number;
  priceChangePct?: number;
  emissionRateStart?: number;
  emissionRateEnd?: number;
  emissionChangePct?: number;
  miningMultiplier?: number;
  winningFaction?: string;
  stakingAprPct?: number;
  totalMinedDbtc?: string | number;
}

export interface StoryGrounding {
  cycle?: number;
  economy: EconomyState;
  standings: FactionStanding[];
  cast: CastMember[];
  series: { storySoFar: string; lastCliffhanger: string };
  spark: string;
}

export interface WorldPulse {
  theme: "recruitment" | "economy" | "milestone";
  faction_id: number;
  headline: string;
  facts: string[];
  cta_overt: boolean;
}

export interface IncomingEventLike {
  kind: "evolution" | "power" | "visual" | "win";
  event_id?: string;
  mint?: string;
  faction_id?: number;
  trait_index?: number;
  new_stage?: number;
  signature?: string;
}
