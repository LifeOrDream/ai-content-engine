/**
 * Identity validation for generated NFT art — Gemini vision YES/NO gates.
 *
 * Two checks ported from the mint pipeline:
 * - full_body: does the generated sprite match the reference's posture,
 *   pixel-art style, and facing direction (character itself may differ)?
 * - dp: is the display picture the SAME character as the full body, upper-body
 *   crop, facing slightly right?
 *
 * Best-effort by design: with no GEMINI_KEY, an unclear answer, or an API
 * error we ACCEPT (callers bound regeneration with their own retry budget; a
 * flaky validator must never hard-block a mint).
 */
import { GoogleGenAI, createUserContent } from "@google/genai";
import { logger } from "../utils/logger.js";
import {
  baseTypeDef,
  baseTypeRenderNoun,
  DEFAULT_BASE_TYPE,
  type BaseTypeId,
} from "../world/baseTypes.js";

const GEMINI_API_KEY = process.env.GEMINI_KEY || "";
const GEMINI_MODEL = process.env.NFT_VALIDATE_MODEL || "gemini-2.5-flash";

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!GEMINI_API_KEY) return null;
  if (!geminiClient) geminiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  return geminiClient;
}

export interface ValidationResult {
  isValid: boolean;
  reason: string;
}

export type ImageComparisonType = "full_body" | "dp";

/**
 * Build the comparison prompt for a gate — BASE-TYPE AWARE. Every reference
 * prompt states the body plan the character must read as; non-canine base
 * types add an explicit "must not read as a dog" check (the legacy grammar
 * defaults the model toward dogs, so the gate has to push back).
 */
export function comparisonPrompt(
  comparisonType: ImageComparisonType,
  baseType: BaseTypeId = DEFAULT_BASE_TYPE,
): string {
  const noun = baseTypeRenderNoun(baseType);
  const baseTypeLine =
    baseType === "canine"
      ? `Both images depict stylized anthropomorphic bipedal ${noun} "hashbeast" characters.`
      : `Both images depict stylized anthropomorphic bipedal ${noun} "hashbeast" characters (${baseTypeDef(baseType).silhouetteLanguage})`;
  const baseTypeCheck =
    baseType === "canine"
      ? ""
      : `\n4. Base type: IMAGE 2 clearly reads as a ${noun} — if it reads as a dog instead, answer NO`;

  if (comparisonType === "full_body") {
    return `Compare these two hashbeast character images. ${baseTypeLine}

IMAGE 1 (first image) is the REFERENCE showing the desired style - posture, pixel art aesthetic, and facing direction.
IMAGE 2 (second image) is the GENERATED image to evaluate.

Check if IMAGE 2 has SIMILAR:
1. Posture (standing pose, body angle)
2. Pixel art style (same retro aesthetic)
3. Facing direction (same orientation)${baseTypeCheck}

The characters can look completely different (different colors, outfits, accessories) but MUST match in style/pose/direction.

Respond with ONLY one word: YES or NO
- YES = matches style, pose, and direction
- NO = does not match`;
  }

  return `Compare these two images of hashbeast characters. ${baseTypeLine}

IMAGE 1 (first image) is the FULL BODY image of a character.
IMAGE 2 (second image) should be a DISPLAY PICTURE (upper body/portrait crop) of the SAME character.

Check if IMAGE 2:
1. Shows the upper body of the SAME character from IMAGE 1
2. Has the character facing slightly to the RIGHT
3. Maintains the same pixel art style${baseTypeCheck}

Respond with ONLY one word: YES or NO
- YES = correct display picture of same character, facing right
- NO = wrong character, wrong crop, or wrong facing direction`;
}

export type ImageRef = { url: string } | { buffer: Buffer; mime?: string };

async function refToInlineData(ref: ImageRef): Promise<{ mimeType: string; data: string }> {
  if ("buffer" in ref) {
    return { mimeType: ref.mime || "image/png", data: ref.buffer.toString("base64") };
  }
  const res = await fetch(ref.url);
  if (!res.ok) throw new Error(`fetch ${ref.url} → ${res.status}`);
  const mimeType = res.headers.get("content-type") || "image/png";
  const data = Buffer.from(await res.arrayBuffer()).toString("base64");
  return { mimeType, data };
}

/**
 * Compare a generated image against a reference using the appropriate mint
 * validation prompt. IMAGE 1 = reference, IMAGE 2 = candidate. The prompt is
 * base-type aware (defaults to the canine genesis form).
 */
export async function compareImageWithReference(
  reference: ImageRef,
  candidate: ImageRef,
  comparisonType: ImageComparisonType,
  baseType: BaseTypeId = DEFAULT_BASE_TYPE,
): Promise<ValidationResult> {
  const gemini = getGeminiClient();
  if (!gemini) {
    return { isValid: true, reason: "Comparison skipped - no Gemini API key" };
  }
  try {
    const [ref, cand] = await Promise.all([
      refToInlineData(reference),
      refToInlineData(candidate),
    ]);
    const response = await gemini.models.generateContent({
      model: GEMINI_MODEL,
      contents: createUserContent([
        comparisonPrompt(comparisonType, baseType),
        { inlineData: ref },
        { inlineData: cand },
      ]),
    });
    const result = (response.text || "").trim().toUpperCase();
    if (result.includes("YES")) {
      return { isValid: true, reason: "Style matches reference (Gemini)" };
    }
    if (result.includes("NO")) {
      return { isValid: false, reason: "Style does not match reference (Gemini)" };
    }
    return { isValid: true, reason: "Comparison inconclusive - accepting" };
  } catch (error: any) {
    logger.warning(`Gemini image comparison error: ${error?.message || error}`);
    return { isValid: true, reason: `Comparison error - accepting` };
  }
}
