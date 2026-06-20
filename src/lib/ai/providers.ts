import { generateText } from "ai";

import { createGeminiProvider, DEFAULT_TEXT_MODEL, classifyGeminiError } from "./gateway.server";
import { buildTeachingPrompt, buildQuizPrompt } from "./prompts";
import { teachingResponseSchema, type TeachingResponse } from "./schema";
import { synthFallback } from "./local-fallback";

export type ProviderName = "gemini" | "openrouter" | "local";

export type LessonResult = {
  data: TeachingResponse;
  provider: ProviderName;
  fallbackReason?: string;
  attempts: { provider: ProviderName; ok: boolean; error?: string; latencyMs: number }[];
};

const OPENROUTER_MODELS = [
  "google/gemma-3-4b-it:free",
  "mistralai/mistral-small-3.1-24b-instruct:free",
];

function stripFences(s: string): string {
  return s.replace(/^\s*```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
}

function parseAndValidate(text: string, intent: "teaching" | "quiz"): TeachingResponse {
  const json = JSON.parse(stripFences(text || ""));
  const merged = { ...(json as object), intent } as Record<string, unknown>;
  const q = (merged as any).quiz?.questions;
  if (Array.isArray(q) && q.length > 5) (merged as any).quiz.questions = q.slice(0, 5);
  return teachingResponseSchema.parse(merged);
}

async function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return await Promise.race([
    p,
    new Promise<T>((_, rej) => setTimeout(() => rej(new Error(`Timeout after ${ms}ms`)), ms)),
  ]);
}

async function tryGemini(prompt: string, intent: "teaching" | "quiz"): Promise<TeachingResponse> {
  const model = createGeminiProvider()(DEFAULT_TEXT_MODEL);
  const { text } = await withTimeout(
    generateText({
      model,
      prompt,
      providerOptions: { google: { responseMimeType: "application/json" } },
    }),
    12_000,
  );
  return parseAndValidate(text, intent);
}

async function tryOpenRouter(prompt: string, intent: "teaching" | "quiz"): Promise<TeachingResponse> {
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) throw new Error("OPENROUTER_API_KEY missing");
  let lastErr: unknown = null;
  for (const modelId of OPENROUTER_MODELS) {
    try {
      const res = await withTimeout(
        fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "https://shikshasathi.lovable.app",
            "X-Title": "ShikshaSathi",
          },
          body: JSON.stringify({
            model: modelId,
            messages: [
              { role: "system", content: "You output only valid JSON. No prose, no markdown." },
              { role: "user", content: prompt },
            ],
            response_format: { type: "json_object" },
            temperature: 0.6,
          }),
        }),
        12_000,
      );
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`OpenRouter ${res.status}: ${body.slice(0, 160)}`);
      }
      const data = (await res.json()) as any;
      const text: string = data?.choices?.[0]?.message?.content ?? "";
      return parseAndValidate(text, intent);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr ?? new Error("OpenRouter all models failed");
}

export async function generateLessonJSON(
  topic: string,
  intent: "teaching" | "quiz",
  grade = "6",
): Promise<LessonResult> {
  const prompt = intent === "quiz" ? buildQuizPrompt(topic, grade) : buildTeachingPrompt(topic, grade);
  const attempts: LessonResult["attempts"] = [];

  // 1) Gemini
  if (process.env.GOOGLE_API_KEY) {
    const t0 = Date.now();
    try {
      const data = await tryGemini(prompt, intent);
      attempts.push({ provider: "gemini", ok: true, latencyMs: Date.now() - t0 });
      return { data, provider: "gemini", attempts };
    } catch (err) {
      const { code, message } = classifyGeminiError(err);
      attempts.push({ provider: "gemini", ok: false, error: `[${code}] ${message}`, latencyMs: Date.now() - t0 });
      console.warn("[providers] gemini failed:", code, message);
    }
  } else {
    attempts.push({ provider: "gemini", ok: false, error: "GOOGLE_API_KEY missing", latencyMs: 0 });
  }

  // 2) OpenRouter
  if (process.env.OPENROUTER_API_KEY) {
    const t0 = Date.now();
    try {
      const data = await tryOpenRouter(prompt, intent);
      attempts.push({ provider: "openrouter", ok: true, latencyMs: Date.now() - t0 });
      return { data, provider: "openrouter", fallbackReason: "gemini-failed", attempts };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      attempts.push({ provider: "openrouter", ok: false, error: msg, latencyMs: Date.now() - t0 });
      console.warn("[providers] openrouter failed:", msg);
    }
  } else {
    attempts.push({ provider: "openrouter", ok: false, error: "OPENROUTER_API_KEY missing", latencyMs: 0 });
  }

  console.log("===============");
console.log("QUIZ DEBUG");
console.log("Topic:", topic);
console.log("Intent:", intent);
console.log("Grade:", grade);
console.log("===============");

  // 3) Local
  const data = synthFallback(topic, intent, grade);
  return {
    data,
    provider: "local",
    fallbackReason: attempts.find((a) => !a.ok)?.error ?? "no-providers-configured",
    attempts,
  };
}

