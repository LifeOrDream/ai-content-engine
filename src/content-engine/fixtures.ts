import type { HashBeastLike, StoryGrounding, VideoFormat } from "./types.js";

export const fakeReelFormat: VideoFormat = {
  id: "fixture-reel",
  aspectRatio: "9:16",
  minShots: 6,
  maxShots: 8,
  targetSeconds: 45,
  craftMode: "short_form",
  defaultOutputs: ["9:16"],
};

export const fakeHashBeast: HashBeastLike = {
  mint: "FAKE_USA_REX_001",
  breed: "Golden Retriever",
  evolution_stage: 4,
  faction_id: 0,
  bio: "A star-spangled command-doge who treats every market panic like a televised war room drill.",
  personality: {
    archetype: "reckless commander",
    tone: "brash, funny, paranoid, fast under pressure",
    motivation: "prove USA can still set the rules of the new degenBTC race",
    catchphrase: "Nobody prints panic on my watch.",
    rivalry: "China's long-game operators",
    visual_attitude: "premium commander cape, bright readable arcade-cel power glow",
  },
  story_context: {
    current_arc: "USA realizes the rest of the world is about to enter the mine",
    recent_beats: ["BTC screens went red", "Rex ordered the 4:20 countdown online"],
    unresolved_threads: ["who leaked the countdown to China?"],
  },
  asset_urls: {
    dp: "fixture://usa/rex-dp.png",
    fullBody: "fixture://usa/rex-full-body.png",
  },
};

export function buildFakeStoryGrounding(): StoryGrounding {
  return {
    cycle: 420,
    economy: {
      priceSol: 0.00042,
      priceChangePct: -8.7,
      emissionRateEnd: 21_000,
      emissionChangePct: 14.2,
      miningMultiplier: 1.8,
      winningFaction: "USA",
      stakingAprPct: 112,
    },
    standings: [
      {
        factionId: 0,
        name: "USA",
        rank: 0,
        usersDelta: 31,
        minted: 421,
        target: 3000,
        geopolitics:
          "tech money is nervous, markets are red, and every agency wants control of the new token race",
      },
      {
        factionId: 1,
        name: "China",
        rank: 1,
        rankDelta: 1,
        usersDelta: 28,
        minted: 389,
        target: 3000,
        geopolitics:
          "state-backed operators are quiet, disciplined, and waiting for USA to overplay its hand",
      },
    ],
    cast: [
      {
        mint: "FAKE_USA_REX_001",
        factionId: 0,
        factionName: "USA",
        factionCode: "usa",
        leaderName: "Commander Rex",
        leaderCatchphrase: "Nobody prints panic on my watch.",
        isWizard: false,
        occupation: "Federal Reserve War-Room Commander",
        region: "New York command vault",
        breed: "Golden Retriever",
        stageName: "Super Commander",
        bio: "A patriotic command-doge managing the 4:20 countdown while pretending the red BTC chart is totally under control.",
        personality: {
          archetype: "reckless commander",
          tone: "brash, funny, paranoid, fast under pressure",
          catchphrase: "Nobody prints panic on my watch.",
          motivation: "keep USA first as degenBTC begins",
          rivalry: "China's long-game operators",
        },
        voice: {
          accent: "bold American English",
          timbre: "brash hype-man swagger",
          language: "English",
          directive: "fast, funny, market-panic command energy",
        },
        rank: 0,
        multiplier: 220,
      },
    ],
    series: {
      storySoFar: "The countdown appeared under Wall Street while BTC bled red.",
      lastCliffhanger: "A second country signal blinked online behind Rex.",
    },
    spark: "The first 4:20 countdown begins, and USA realizes it may not be alone.",
  };
}
