/**
 * Phase E acceptance — base-type expansion proof set (CHEAP, 1K, 4 images max).
 *
 * Generates ONE on-model test set via fal:
 *   - mint-art-style image for a PRIMATE beast in Brazil and in Japan,
 *   - mint-art-style image for a FELINE beast in Brazil and in Japan,
 *   - one announcer dialogue line each for the primate and the feline.
 *
 * Proves visually that (a) non-canine base types read on-model (clearly not
 * dogs) and (b) the SAME base type stays country-distinct (Brazil != Japan).
 * Outputs land as small webp under docs/examples/base-types/ (media-proof
 * culture). Requires FAL_API_KEY (or FAL_KEY); never prints it.
 *
 * Run: npx tsx scripts/acceptance_base_types.ts
 */
// MUST be first: llm.ts reads FAL_API_KEY at module load, and ESM imports
// hoist — the fallback has to run as a side-effect import before anything
// that transitively imports the llm/falMedia modules.
import "./acceptance_env.js";

import * as fs from "node:fs";
import * as path from "node:path";
import { execFileSync } from "node:child_process";

import { buildHashBeastPrompt } from "../src/prompts/index.js";
import { styleRung } from "../src/world/bible.js";
import { normalizeBaseType, type BaseTypeId } from "../src/world/baseTypes.js";
import { buildDialoguePrompt } from "../src/nft-pipeline/mutationContent.js";
import { dialogueSmells } from "../src/content-engine/dialogueQuality.js";
import { generateText } from "../src/service/llm.js";

const FAL_KEY = process.env.FAL_API_KEY || "";
const IMAGE_MODEL = process.env.ACCEPTANCE_IMAGE_MODEL || "fal-ai/nano-banana-pro";
const OUT_DIR = path.join(process.cwd(), "docs", "examples", "base-types");

interface Case {
  baseType: BaseTypeId;
  factionId: number;
  country: string;
  breedValue: number;
  /** [furColor, headwear, outfit, weapon, accessory, expression, background] */
  traits?: number[];
}

// 2 base types × 2 countries (same breed per base type isolates country skin).
// Brazil cases use headwear trait 2 (Favela Cap) instead of 3 (Bandana): the
// image model's prior turns "Brazil + colorful bandana" into a flag print,
// which violates the never-flags-as-clothing canon rule.
const BRAZIL_TRAITS = [2, 2, 4, 3, 2, 4, 1];
const CASES: Case[] = [
  { baseType: "primate", factionId: 10, country: "brazil", breedValue: 0, traits: BRAZIL_TRAITS }, // Macaque
  { baseType: "primate", factionId: 4, country: "japan", breedValue: 0 }, // Macaque
  { baseType: "feline", factionId: 10, country: "brazil", breedValue: 0, traits: BRAZIL_TRAITS }, // Shadow Cat
  { baseType: "feline", factionId: 4, country: "japan", breedValue: 0 }, // Shadow Cat
];

const DIALOGUE_CASES: Case[] = [CASES[0], CASES[3]];

function mintArtPrompt(c: Case): string {
  const rung = styleRung("pixel_sprite");
  const grammar = buildHashBeastPrompt(
    c.factionId,
    2,
    1,
    c.traits || [2, 3, 4, 3, 2, 4, 1],
    c.breedValue,
    c.baseType,
  );
  return [
    grammar,
    `STYLE (mint-art rung): ${rung.styleContract}`,
    `NEVER: ${rung.never}`,
    `COMPOSITION: single character only, upright standing pose facing slightly right, full body visible head to feet, character fills most of the frame, plain flat background.`,
    `ABSOLUTELY NO readable text, letters, numbers, glyphs, characters, or symbols anywhere — not on garments, not on jerseys, not on floating papers or talismans (render any talisman/paper as BLANK), no logos, watermarks or UI.`,
    `NEVER render any country flag or flag-like design as clothing, headwear, bandana, or fabric on the character — no flag emblems, no flag globe/disc, no flag stripe arrangements. Headwear and garments use plain solid colors or abstract patterns in the faction palette only. National identity comes from costume STYLE and PALETTE, never from flags.`,
  ].join("\n\n");
}

async function falTextToImage(prompt: string): Promise<Buffer> {
  const headers = { Authorization: `Key ${FAL_KEY}`, "Content-Type": "application/json" };
  const submit = await fetch(`https://queue.fal.run/${IMAGE_MODEL}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      prompt,
      num_images: 1,
      aspect_ratio: "3:4",
      output_format: "png",
      resolution: "1K",
    }),
  });
  if (!submit.ok) throw new Error(`fal submit ${submit.status}: ${(await submit.text()).slice(0, 200)}`);
  const job = (await submit.json()) as { status_url?: string; response_url?: string };
  if (!job.status_url || !job.response_url) throw new Error("fal: no queue urls");
  const deadline = Date.now() + 300_000;
  while (Date.now() < deadline) {
    await new Promise((r) => setTimeout(r, 3000));
    const st = (await (await fetch(job.status_url, { headers })).json()) as { status?: string };
    if (st.status === "COMPLETED") break;
    if (st.status === "FAILED" || st.status === "ERROR") throw new Error(`fal job ${st.status}`);
  }
  const res = await fetch(job.response_url, { headers });
  if (!res.ok) throw new Error(`fal result ${res.status}`);
  const data = (await res.json()) as { images?: Array<{ url: string }> };
  const url = data.images?.[0]?.url;
  if (!url) throw new Error("fal returned no image");
  return Buffer.from(await (await fetch(url)).arrayBuffer());
}

/** Save as small webp (sips downscale + cwebp encode), falling back to png. */
function saveSmallWebp(buf: Buffer, name: string): string {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const pngPath = path.join(OUT_DIR, `${name}.png`);
  const webpPath = path.join(OUT_DIR, `${name}.webp`);
  fs.writeFileSync(pngPath, buf);
  try {
    execFileSync("sips", ["-Z", "512", pngPath], { stdio: "ignore" });
    execFileSync("cwebp", ["-quiet", "-q", "82", pngPath, "-o", webpPath], { stdio: "ignore" });
    fs.unlinkSync(pngPath);
    return webpPath;
  } catch {
    return pngPath; // keep (downscaled) png if webp tooling unavailable
  }
}

async function main(): Promise<void> {
  if (!FAL_KEY) throw new Error("FAL_API_KEY / FAL_KEY not set");

  // ACCEPTANCE_SKIP_IMAGES=1 → dialogue-only rerun (no image re-spend).
  // ACCEPTANCE_ONLY=primate_brazil,… → regenerate specific cases only.
  const skipImages = process.env.ACCEPTANCE_SKIP_IMAGES === "1";
  const only = (process.env.ACCEPTANCE_ONLY || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const imageCases = skipImages
    ? []
    : CASES.filter((c) => only.length === 0 || only.includes(`${c.baseType}_${c.country}`));
  console.log(`Phase E acceptance — model=${IMAGE_MODEL}, 1K, ${imageCases.length} images`);
  for (const c of imageCases) {
    normalizeBaseType(c.baseType); // assert allowlist
    const name = `${c.baseType}_${c.country}`;
    process.stdout.write(`  generating ${name}… `);
    const buf = await falTextToImage(mintArtPrompt(c));
    const saved = saveSmallWebp(buf, name);
    console.log(`saved ${path.relative(process.cwd(), saved)} (${(fs.statSync(saved).size / 1024).toFixed(0)} KB)`);
  }

  console.log("\nDialogue lines:");
  for (const c of DIALOGUE_CASES) {
    const prompt = buildDialoguePrompt(
      {
        mint: `acceptance-${c.baseType}`,
        factionId: c.factionId,
        baseType: c.baseType,
        breedValue: c.breedValue,
        personality:
          c.baseType === "primate"
            ? { archetype: "show-off acrobat", tone: "loud and joyful", motivation: "the highlight reel" }
            : { archetype: "silent professional", tone: "dry, surgical", motivation: "the perfect strike" },
      },
      "power",
      { rank: 2 },
    );
    const raw = await generateText(prompt, { temperature: 0.85 });
    const line = raw.replace(/^["']|["']$/g, "").split("\n")[0].trim();
    const smells = dialogueSmells(line);
    console.log(`  [${c.baseType} / ${c.country}] "${line}"${smells.length ? ` — LEXICON FLAGS: ${smells.join(", ")}` : " — lexicon clean"}`);
  }

  console.log("\nDone. Review the images in docs/examples/base-types/ for on-model + country-distinct reads.");
}

main().catch((err) => {
  console.error(`acceptance failed: ${err?.message || err}`);
  process.exit(1);
});
