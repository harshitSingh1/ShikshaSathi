import { generateText } from "ai";

import { createGeminiProvider, DEFAULT_TEXT_MODEL, classifyGeminiError } from "./gateway.server";
import { buildTeachingPrompt, buildQuizPrompt } from "./prompts";
import { teachingResponseSchema, type LanguageValue, type TeachingResponse } from "./schema";
import { synthFallback } from "./local-fallback";

export type ProviderName = "gemini" | "openrouter" | "local";

export type LessonResult = {
  data: TeachingResponse;
  provider: ProviderName;
  fallbackReason?: string;
  attempts: Array<{ provider: ProviderName; error: string }>;  
};

export type GeneratedContent = {
  text: string;
  usedFallback: boolean;
  fallbackReason?: string;
};

/**
 * Fallback Teaching Content for offline or failed API calls.
 * Returns a structured lesson for any topic.
 */
async function generateLessonOffline(
  topic: string,
  intent: "teaching" | "quiz",
  grade: string,
  language: LanguageValue,
): Promise<TeachingResponse> {
  const templateLesson = synthFallback(topic, grade, language);
  return {
    intent,
    ...templateLesson,
  };
}

/**
 * Try Gemini first, fallback to OpenRouter, then to local templates.
 */
export async function generateLessonJSON(
  topic: string,
  intent: "teaching" | "quiz",
  grade = "6",
  language: LanguageValue = "Hinglish",
): Promise<LessonResult> {
  const prompt = intent === "quiz"
    ? buildQuizPrompt(topic, grade, language)
    : buildTeachingPrompt(topic, grade, language);
  const attempts: LessonResult["attempts"] = [];

  // 1) Gemini
  try {
    const gemini = createGeminiProvider();
    const { text } = await generateText({
      model: DEFAULT_TEXT_MODEL,
      prompt,
      provider: gemini,
    });
    const json = JSON.parse(text);
    const parsed = teachingResponseSchema.parse(json);
    return { data: parsed, provider: "gemini", attempts };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    attempts.push({ provider: "gemini", error: msg });
    const fallbackReason = classifyGeminiError(err);
    if (fallbackReason === "net") {
      // Network error - try OpenRouter
    } else if (fallbackReason === "auth") {
      // Auth error - go straight to local
      const local = await generateLessonOffline(topic, intent, grade, language);
      return { data: local, provider: "local", fallbackReason: "gemini-auth", attempts };
    }
  }

  // 2) OpenRouter
  try {
    const { text } = await generateText({
      model: "openrouter/meta-llama/llama-2-70b-chat",
      prompt,
    });
    const json = JSON.parse(text);
    const parsed = teachingResponseSchema.parse(json);
    return { data: parsed, provider: "openrouter", attempts };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    attempts.push({ provider: "openrouter", error: msg });
  }

  // 3) Local fallback
  const local = await generateLessonOffline(topic, intent, grade, language);
  return { data: local, provider: "local", fallbackReason: "all-apis-failed", attempts };
}
