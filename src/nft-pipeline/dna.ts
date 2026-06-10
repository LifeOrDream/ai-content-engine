/**
 * HashBeast DNA decoder — pure bit-level decode of the 256-bit on-chain DNA.
 *
 * DNA Structure (256 bits / 32 bytes):
 * - Faction: bits 0-3 (4 bits) — values 0-11
 * - Evolution: bits 4-6 (3 bits) — values 0-7
 * - Appearance: bits 7-111 (105 bits) — 7 groups × 3 traits × 5 bits
 * - Power: bits 112-171 (60 bits) — 5 groups × 3 traits × 4 bits
 * - Breed: bits 172-173 (2 bits) — values 0-3
 * - Rebirth count: bits 174-176 (3 bits) — values 0-7
 * - Type: derived from dna[22] % 16 (0-7 = Wizard, 8-15 = Muggle)
 * - Profession: derived from dna[23] % 32
 *
 * Ported from the MineBTC backend so the engine can resolve prompts straight
 * from a DNA hex string without any game-state access.
 */

const DNA_CONSTANTS = {
  FACTION_BITS: 4,
  EVOLUTION_BITS: 3,
  APPEARANCE_TRAIT_BITS: 5,
  POWER_TRAIT_BITS: 4,
  APPEARANCE_GROUPS: 7,
  POWER_GROUPS: 5,
  TRAITS_PER_GROUP: 3,
} as const;

const APPEARANCE_OFFSET = DNA_CONSTANTS.FACTION_BITS + DNA_CONSTANTS.EVOLUTION_BITS; // 7
const APPEARANCE_TOTAL_BITS =
  DNA_CONSTANTS.APPEARANCE_GROUPS *
  DNA_CONSTANTS.TRAITS_PER_GROUP *
  DNA_CONSTANTS.APPEARANCE_TRAIT_BITS; // 105
const COMBAT_OFFSET = APPEARANCE_OFFSET + APPEARANCE_TOTAL_BITS; // 112
const BREED_OFFSET = 172;
const BREED_BITS = 2;
const REBIRTH_COUNT_OFFSET = BREED_OFFSET + BREED_BITS; // 174
const REBIRTH_COUNT_BITS = 3;

/** Decoded DNA structure returned by decodeDNA */
export interface DecodedDNA {
  faction: number; // 0-11: Faction ID
  evolution: number; // 0-7: Evolution stage
  type: number; // 0-15: 0-7 = Wizard, 8-15 = Muggle
  profession: number; // 0-31
  breed: number; // 0-3: Breed/body type within faction
  rebirth_count: number; // 0-7: Rebirth generation
  appearance: [number, number, number][]; // 7 groups of (dominant, recessive1, recessive2)
  powers: [number, number, number][]; // 5 groups of (dominant, recessive1, recessive2)
}

/** Convert hex DNA string to Uint8Array */
export function dnaHexToBytes(dnaHex: string): Uint8Array {
  const cleanHex = dnaHex.startsWith("0x") ? dnaHex.slice(2) : dnaHex;
  return new Uint8Array(
    cleanHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || new Array(32).fill(0),
  );
}

/** Extract a trait value from DNA bytes at a specific bit position. */
export function getTraitValue(
  dnaBytes: Uint8Array,
  offset: number,
  bitsPerTrait: number,
  traitIndex: number,
): number {
  const startBit = offset + traitIndex * bitsPerTrait;
  const byteIdx = Math.floor(startBit / 8);
  const bitIdx = startBit % 8;
  if (byteIdx >= 32) return 0;

  let val = 0;
  let remaining = bitsPerTrait;
  let currByte = byteIdx;
  let currBit = bitIdx;
  while (remaining > 0 && currByte < 32) {
    const bitsInByte = 8 - currBit;
    const take = Math.min(remaining, bitsInByte);
    const mask = ((1 << take) - 1) << currBit;
    const bits = (dnaBytes[currByte] & mask) >> currBit;
    val |= bits << (bitsPerTrait - remaining);
    remaining -= take;
    currByte += 1;
    currBit = 0;
  }
  return val;
}

function decodeAppearanceGroups(dnaBytes: Uint8Array): [number, number, number][] {
  const groups: [number, number, number][] = [];
  for (let g = 0; g < DNA_CONSTANTS.APPEARANCE_GROUPS; g++) {
    const base = g * DNA_CONSTANTS.TRAITS_PER_GROUP;
    groups.push([
      getTraitValue(dnaBytes, APPEARANCE_OFFSET, DNA_CONSTANTS.APPEARANCE_TRAIT_BITS, base),
      getTraitValue(dnaBytes, APPEARANCE_OFFSET, DNA_CONSTANTS.APPEARANCE_TRAIT_BITS, base + 1),
      getTraitValue(dnaBytes, APPEARANCE_OFFSET, DNA_CONSTANTS.APPEARANCE_TRAIT_BITS, base + 2),
    ]);
  }
  return groups;
}

function decodePowerGroups(dnaBytes: Uint8Array): [number, number, number][] {
  const groups: [number, number, number][] = [];
  for (let g = 0; g < DNA_CONSTANTS.POWER_GROUPS; g++) {
    const base = g * DNA_CONSTANTS.TRAITS_PER_GROUP;
    groups.push([
      getTraitValue(dnaBytes, COMBAT_OFFSET, DNA_CONSTANTS.POWER_TRAIT_BITS, base),
      getTraitValue(dnaBytes, COMBAT_OFFSET, DNA_CONSTANTS.POWER_TRAIT_BITS, base + 1),
      getTraitValue(dnaBytes, COMBAT_OFFSET, DNA_CONSTANTS.POWER_TRAIT_BITS, base + 2),
    ]);
  }
  return groups;
}

/** Decode full DNA hex (with or without 0x prefix) into structured format. */
export function decodeDNA(dnaHex: string): DecodedDNA {
  const dnaBytes = dnaHexToBytes(dnaHex);
  return {
    faction: dnaBytes[0] & 0x0f,
    evolution: (dnaBytes[0] >> 4) & 0x07,
    type: dnaBytes[22] % 16,
    profession: dnaBytes[23] % 32,
    breed: getTraitValue(dnaBytes, BREED_OFFSET, BREED_BITS, 0),
    rebirth_count: getTraitValue(dnaBytes, REBIRTH_COUNT_OFFSET, REBIRTH_COUNT_BITS, 0),
    appearance: decodeAppearanceGroups(dnaBytes),
    powers: decodePowerGroups(dnaBytes),
  };
}

/** Get visible (dominant) appearance traits only — 7 values, one per group. */
export function getVisibleAppearance(dnaHex: string): number[] {
  return decodeDNA(dnaHex).appearance.map((group) => group[0]);
}

/** Get visible (dominant) power traits only — 5 values, one per group. */
export function getVisiblePowers(dnaHex: string): number[] {
  return decodeDNA(dnaHex).powers.map((group) => group[0]);
}
