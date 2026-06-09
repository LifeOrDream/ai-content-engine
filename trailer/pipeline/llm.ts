/**
 * Model-swappable LLM caller for the trailer pipeline.
 *
 * Providers:
 *   • "fal" (default when FAL_API_KEY is set) — fal.ai's openrouter/router
 *     endpoint: one API, 200+ models (Claude, GPT, Gemini, DeepSeek…), billed
 *     through the existing fal account by actual token usage.
 *     Default model: anthropic/claude-sonnet-4.6 — 1M context, top-tier
 *     creative writing + literal instruction-following (verbatim carry, LOOP
 *     discipline, strict JSON), AND it accepts `temperature`, which our
 *     per-pass ladder (0.9 creative → 0.3 compile) depends on. (Opus 4.8/4.7
 *     removed sampling params entirely — the ladder would silently break.)
 *     Fallback slugs: google/gemini-2.5-pro, openai/gpt-5, …
 *   • "gemini" — direct Google GenAI (needs GEMINI_KEY prepaid credits).
 *
 * Swap with TRAILER_LLM_PROVIDER / TRAILER_LLM_MODEL. Every pass goes through
 * callLLM, so one env change re-routes the whole pipeline.
 */
import "dotenv/config";
import {
  assertUsefulLLMText,
  parseJsonLoose as parseJsonLooseShared,
} from "../../src/content-engine/llmText.js";

const FAL_KEY = process.env.FAL_API_KEY || "";
const GEMINI_KEY = process.env.GEMINI_KEY || "";
const PROVIDER = (process.env.TRAILER_LLM_PROVIDER || (FAL_KEY ? "fal" : "gemini")).toLowerCase();
const MODEL =
  process.env.TRAILER_LLM_MODEL ||
  (PROVIDER === "fal" ? "anthropic/claude-sonnet-4.6" : "gemini-2.5-pro");
const MAX_TOKENS = Math.max(4000, Number(process.env.TRAILER_LLM_MAX_TOKENS || 32000));
const FAL_LLM_ENDPOINT = process.env.TRAILER_FAL_LLM_ENDPOINT || "openrouter/router";
const POLL_MS = 2000;
const TIMEOUT_MS = Math.max(60_000, Number(process.env.TRAILER_LLM_TIMEOUT_MS || 600_000));

export function activeModel(): string {
  return `${PROVIDER}:${MODEL}`;
}

/** One LLM call. Higher temperature for the creative passes; lower for the precision/JSON passes. */
export async function callLLM(prompt: string, opts: { temperature?: number; json?: boolean } = {}): Promise<string> {
  const text = PROVIDER === "fal" ? await callFal(prompt, opts) : await callGemini(prompt, opts);
  return assertUsefulLLMText(text, { mode: opts.json ? "json" : "text" });
}

// ── fal.ai openrouter/router (queue API: submit → poll → result) ────────────

async function callFal(prompt: string, opts: { temperature?: number; json?: boolean }): Promise<string> {
  if (!FAL_KEY) throw new Error("FAL_API_KEY not set — required for TRAILER_LLM_PROVIDER=fal");
  const headers = { Authorization: `Key ${FAL_KEY}`, "Content-Type": "application/json" };

  const submit = await fetch(`https://queue.fal.run/${FAL_LLM_ENDPOINT}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: MODEL,
      prompt,
      temperature: opts.temperature ?? 0.9,
      max_tokens: MAX_TOKENS,
      reasoning: false,
    }),
  });
  if (!submit.ok) throw new Error(`fal llm submit ${submit.status}: ${(await submit.text()).slice(0, 300)}`);
  const job = (await submit.json()) as { status_url?: string; response_url?: string };
  if (!job.status_url || !job.response_url) throw new Error("fal llm submit returned no queue urls");

  const deadline = Date.now() + TIMEOUT_MS;
  for (;;) {
    if (Date.now() > deadline) throw new Error(`fal llm timed out after ${Math.round(TIMEOUT_MS / 1000)}s`);
    const st = await fetch(job.status_url, { headers });
    const status = ((await st.json()) as { status?: string }).status;
    if (status === "COMPLETED") break;
    if (status === "FAILED" || status === "CANCELLED" || status === "ERROR") throw new Error(`fal llm job ${status}`);
    await new Promise((r) => setTimeout(r, POLL_MS));
  }

  const res = await fetch(job.response_url, { headers });
  if (!res.ok) throw new Error(`fal llm result ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = (await res.json()) as { output?: string; error?: string | null; partial?: boolean };
  if (data.error) throw new Error(`fal llm error: ${data.error}`);
  if (data.partial) throw new Error("fal llm returned a partial response — raise TRAILER_LLM_MAX_TOKENS");
  return data.output || "";
}

// ── Google GenAI direct (legacy path; needs GEMINI_KEY credits) ─────────────

let geminiClient: import("@google/genai").GoogleGenAI | null = null;

async function callGemini(prompt: string, opts: { temperature?: number; json?: boolean }): Promise<string> {
  if (!GEMINI_KEY) throw new Error("GEMINI_KEY not set — set it, or use TRAILER_LLM_PROVIDER=fal (FAL_API_KEY)");
  if (!geminiClient) {
    const { GoogleGenAI } = await import("@google/genai");
    geminiClient = new GoogleGenAI({ apiKey: GEMINI_KEY });
  }
  const res = await geminiClient.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      temperature: opts.temperature ?? 0.9,
      ...(opts.json ? { responseMimeType: "application/json" } : {}),
    },
  });
  return (res as any)?.text ?? (res as any)?.response?.text ?? "";
}

/** Strip ``` fences / grab the outermost {...} for the JSON passes. */
export function parseJsonLoose<T>(raw: string): T | null {
  return parseJsonLooseShared<T>(raw);
}
