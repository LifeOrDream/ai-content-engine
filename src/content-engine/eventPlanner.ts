import type { IncomingEventLike, WorldPulse } from "./types.js";

export const WORTH_HIGH = 80;
export const VISUAL_GROUPS = [
  "Fur Color",
  "Headwear",
  "Outfit",
  "Weapon",
  "Accessory",
  "Expression",
  "Background",
];

export function tropeForPulse(theme: WorldPulse["theme"]): string {
  if (theme === "recruitment") return "the recruitment rally";
  if (theme === "milestone") return "the milestone celebration";
  if (theme === "economy") return "flexing the yield";
  return "state of the nation";
}

export function scoreBeat(kind: string, role: string, arc: string): number {
  let score = 25;
  if (kind === "evolution") score = 90;
  else if (kind === "win") score = 80;
  else if (kind === "lead_change") score = 85;
  else if (kind === "power") score = 55;
  else if (kind === "visual") score = 25;

  if (arc === "climax") score += 8;
  else if (arc === "finale") score += 14;

  if (role === "underdog") score += 10;
  else if (role === "rival") score += 8;
  else if (role === "champion") score += 5;

  return Math.min(100, score);
}

export function pickTrope(kind: string, role: string, arc: string): string {
  if (kind === "lead_change") {
    return arc === "finale"
      ? "the final-seconds overtake"
      : "the overtake / dethroning";
  }
  if (kind === "evolution") return "glow-up turning point";
  if (kind === "win") return "victory swagger";
  if (kind === "power") return "new move unleashed";
  if (role === "underdog") return "underdog rising";
  if (role === "champion") {
    return arc === "finale" ? "last stand defending the crown" : "flexing the lead";
  }
  if (arc === "finale") return "final push";
  return "the grind, talking trash";
}

export function beatText(
  kind: string,
  faction: string,
  evt: IncomingEventLike,
): string {
  switch (kind) {
    case "evolution":
      return `${faction}'s fighter evolved to stage ${evt.new_stage ?? "?"} — a surge of new power.`;
    case "power":
      return `${faction}'s fighter unlocked a stronger move.`;
    case "visual":
      return `${faction}'s fighter switched up its ${VISUAL_GROUPS[Math.floor((evt.trait_index ?? 0) / 3)] || "look"}.`;
    case "win":
      return `${faction} just won big in the arena.`;
    default:
      return `${faction} made a move.`;
  }
}

export function maxLastSceneAt(episodeLike: any): number {
  const latestByFaction = episodeLike?.last_scene_at || {};
  let max = 0;
  for (const key of Object.keys(latestByFaction)) {
    max = Math.max(max, Number(latestByFaction[key]) || 0);
  }
  return max;
}

export function isSceneWorthy(
  kind: string,
  episodeLike: any,
  quietMs: number,
  nowMs = Date.now(),
): boolean {
  if (kind === "visual") return nowMs - maxLastSceneAt(episodeLike) > quietMs;
  return true;
}
