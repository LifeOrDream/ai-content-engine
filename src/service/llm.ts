import "dotenv/config";
import { falKeyStore } from "../utils/falMedia.js";

const FAL_KEY = process.env.FAL_API_KEY || "";
const GEMINI_KEY = process.env.GEMINI_KEY || "";
const PROVIDER = (
  process.env.CONTENT_ENGINE_LLM_PROVIDER ||
  process.env.TRAILER_LLM_PROVIDER ||
  (FAL_KEY ? "fal" : "gemini")
).toLowerCase();
const MODEL =
  process.env.CONTENT_ENGINE_LLM_MODEL ||
  process.env.TRAILER_LLM_MODEL ||
  (PROVIDER === "fal" ? "anthropic/claude-sonnet-4.6" : "gemini-2.5-pro");
const MAX_TOKENS = Math.max(
  4000,
  Number(process.env.CONTENT_ENGINE_LLM_MAX_TOKENS || process.env.TRAILER_LLM_MAX_TOKENS || 32000),
);
const FAL_LLM_ENDPOINT =
  process.env.CONTENT_ENGINE_FAL_LLM_ENDPOINT ||
  process.env.TRAILER_FAL_LLM_ENDPOINT ||
  "openrouter/router";
const POLL_MS = 2000;
const TIMEOUT_MS = Math.max(
  60_000,
  Number(process.env.CONTENT_ENGINE_LLM_TIMEOUT_MS || process.env.TRAILER_LLM_TIMEOUT_MS || 600_000),
);

export function activeModel(): string {
  return `${PROVIDER}:${MODEL}`;
}

export async function generateText(
  prompt: string,
  opts: { temperature?: number; json?: boolean } = {},
): Promise<string> {
  const text =
    PROVIDER === "fal" ? await callFal(prompt, opts) : await callGemini(prompt, opts);
  if (!text || !String(text).trim()) throw new Error("LLM returned empty text");
  return String(text);
}

async function callFal(
  prompt: string,
  opts: { temperature?: number; json?: boolean },
): Promise<string> {
  // Per-run override (falKeyStore) wins over the module env key — this is what
  // lets a user-keyed replay bill the operator's fal account for text gen too.
  const apiKey = falKeyStore.getStore()?.key || FAL_KEY;
  if (!apiKey) throw new Error("FAL_API_KEY not set");
  const headers = { Authorization: `Key ${apiKey}`, "Content-Type": "application/json" };

  const submit = await fetch(`https://queue.fal.run/${FAL_LLM_ENDPOINT}`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      model: MODEL,
      prompt,
      temperature: opts.temperature ?? 0.8,
      max_tokens: MAX_TOKENS,
      reasoning: false,
    }),
  });
  if (!submit.ok) {
    throw new Error(`fal llm submit ${submit.status}: ${(await submit.text()).slice(0, 300)}`);
  }
  const job = (await submit.json()) as { status_url?: string; response_url?: string };
  if (!job.status_url || !job.response_url) throw new Error("fal llm missing queue urls");

  const deadline = Date.now() + TIMEOUT_MS;
  while (Date.now() < deadline) {
    const statusRes = await fetch(job.status_url, { headers });
    const status = ((await statusRes.json()) as { status?: string }).status;
    if (status === "COMPLETED") break;
    if (status === "FAILED" || status === "CANCELLED" || status === "ERROR") {
      throw new Error(`fal llm job ${status}`);
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }

  const res = await fetch(job.response_url, { headers });
  if (!res.ok) throw new Error(`fal llm result ${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = (await res.json()) as { output?: string; error?: string | null; partial?: boolean };
  if (data.error) throw new Error(`fal llm error: ${data.error}`);
  if (data.partial) throw new Error("fal llm returned a partial response");
  return data.output || "";
}

let geminiClient: import("@google/genai").GoogleGenAI | null = null;

async function callGemini(
  prompt: string,
  opts: { temperature?: number; json?: boolean },
): Promise<string> {
  if (!GEMINI_KEY) throw new Error("GEMINI_KEY not set");
  if (!geminiClient) {
    const { GoogleGenAI } = await import("@google/genai");
    geminiClient = new GoogleGenAI({ apiKey: GEMINI_KEY });
  }
  const res = await geminiClient.models.generateContent({
    model: MODEL,
    contents: prompt,
    config: {
      temperature: opts.temperature ?? 0.8,
      ...(opts.json ? { responseMimeType: "application/json" } : {}),
    },
  });
  return (res as any)?.text ?? (res as any)?.response?.text ?? "";
}

export function parseJsonLoose<T>(raw: string | null): T | null {
  if (!raw) return null;
  const cleaned = raw.replace(/^```(?:json)?/i, "").replace(/```$/i, "").trim();
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1)) as T;
      } catch {
        return null;
      }
    }
    return null;
  }
}
