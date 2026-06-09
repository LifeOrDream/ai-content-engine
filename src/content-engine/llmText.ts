export interface NormalizeLLMTextOptions {
  /** JSON passes should preserve braces while removing wrappers/reasoning junk. */
  mode?: "text" | "json";
}

const THINK_BLOCK_RE = /<think\b[^>]*>[\s\S]*?<\/think>/gi;
const OPEN_THINK_RE = /<think\b[^>]*>[\s\S]*$/i;
const ZERO_WIDTH_RE = /[\u200B-\u200D\uFEFF]/g;

function stripMarkdownFence(text: string): string {
  const trimmed = text.trim();
  const fence = trimmed.match(/^```(?:json|text|markdown|md)?\s*\n([\s\S]*?)\n```$/i);
  return fence ? fence[1].trim() : trimmed;
}

/**
 * Provider-neutral cleanup before any script/parser/lint stage sees model text.
 * This keeps hidden reasoning, markdown wrappers, and transport artifacts out of
 * dialogue, JSON, subtitles, and social copy.
 */
export function normalizeLLMText(raw: unknown, opts: NormalizeLLMTextOptions = {}): string {
  let text = typeof raw === "string" ? raw : raw == null ? "" : String(raw);
  text = text.replace(ZERO_WIDTH_RE, "");
  text = text.replace(THINK_BLOCK_RE, "");
  text = text.replace(OPEN_THINK_RE, "");
  text = stripMarkdownFence(text);
  if (opts.mode === "json") {
    // Some providers prefix/suffix JSON with labels; keep the parser flexible.
    return text.trim();
  }
  return text
    .replace(/^\s*(?:here(?:'s| is)|sure[:,]?|okay[:,]?)\s+/i, "")
    .trim();
}

export function assertUsefulLLMText(raw: unknown, opts: NormalizeLLMTextOptions = {}): string {
  const text = normalizeLLMText(raw, opts);
  if (!text.trim()) throw new Error("LLM returned empty text after normalization");
  if (/^(?:i'?m sorry|sorry,? i can'?t|i cannot assist)\b/i.test(text)) {
    throw new Error(`LLM returned refusal/apology text: ${text.slice(0, 180)}`);
  }
  return text;
}

export function extractJsonCandidate(raw: unknown): string {
  const cleaned = normalizeLLMText(raw, { mode: "json" });
  const direct = cleaned.trim();
  if (direct.startsWith("{") && direct.endsWith("}")) return direct;
  const start = direct.indexOf("{");
  const end = direct.lastIndexOf("}");
  return start >= 0 && end > start ? direct.slice(start, end + 1) : direct;
}

export function parseJsonLoose<T>(raw: unknown): T | null {
  const candidate = extractJsonCandidate(raw);
  try {
    return JSON.parse(candidate) as T;
  } catch {
    return null;
  }
}
