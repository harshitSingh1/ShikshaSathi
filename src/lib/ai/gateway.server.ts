import { createGoogleGenerativeAI } from "@ai-sdk/google";

/**
 * Direct Google Gemini provider. Replaces the prior Lovable AI Gateway wiring.
 * Requires GOOGLE_API_KEY (a.k.a. Generative Language API key) in env.
 */
export const DEFAULT_TEXT_MODEL = "gemini-2.0-flash";

export class MissingGoogleApiKeyError extends Error {
  code = "MISSING_API_KEY" as const;
  constructor() {
    super("GOOGLE_API_KEY is not configured. Add it to project secrets.");
  }
}

export function getGoogleApiKey(): string {
  const key = process.env.GOOGLE_API_KEY;
  if (!key) throw new MissingGoogleApiKeyError();
  return key;
}

export function createGeminiProvider(apiKey?: string) {
  return createGoogleGenerativeAI({ apiKey: apiKey ?? getGoogleApiKey() });
}

export function getGeminiModel(modelId: string = DEFAULT_TEXT_MODEL) {
  return createGeminiProvider()(modelId);
}

/** Map provider errors to typed codes for UI surfacing. */
export type GeminiErrorCode =
  | "MISSING_API_KEY"
  | "QUOTA_EXCEEDED"
  | "RATE_LIMITED"
  | "INVALID_API_KEY"
  | "INVALID_RESPONSE"
  | "NETWORK"
  | "UNKNOWN";

export function classifyGeminiError(err: unknown): { code: GeminiErrorCode; message: string; status?: number } {
  if (err instanceof MissingGoogleApiKeyError) {
    return { code: "MISSING_API_KEY", message: err.message };
  }
  const anyErr = err as any;
  const status: number | undefined = anyErr?.statusCode ?? anyErr?.status ?? anyErr?.response?.status;
  const raw = String(anyErr?.message ?? err ?? "");
  if (status === 401 || status === 403 || /API key (not valid|invalid)/i.test(raw)) {
    return { code: "INVALID_API_KEY", message: "Google API key is invalid or unauthorized.", status };
  }
  if (status === 429 || /rate.?limit/i.test(raw)) {
    return { code: "RATE_LIMITED", message: "Gemini rate limit hit. Slow down and retry.", status };
  }
  if (/quota/i.test(raw) || status === 402) {
    return { code: "QUOTA_EXCEEDED", message: "Gemini quota exceeded for this API key.", status };
  }
  if (/fetch failed|ENOTFOUND|ECONN|network/i.test(raw)) {
    return { code: "NETWORK", message: "Network error contacting Gemini.", status };
  }
  return { code: "UNKNOWN", message: raw || "Unknown Gemini error.", status };
}