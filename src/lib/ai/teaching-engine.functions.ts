import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { generateLessonJSON } from "./providers";
import { LANGUAGES, type TeachingResponse } from "./schema";

const InputSchema = z
  .object({
    input: z.string().min(1).max(2000),
    intent: z.enum(["teaching", "quiz"]).optional(),
    contextTopic: z.string().optional(),
    grade: z.string().optional(),
    language: z.enum(LANGUAGES).optional(),
  })
  .passthrough();

export const generateTeachingResponse = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<TeachingResponse> => {
    const intent: "teaching" | "quiz" =
  data.intent ?? detectIntent(data.input);

  function isGenericQuizRequest(text: string) {
    return /^(quiz|generate quiz|start quiz|mcq|test)$/i.test(
      text.trim()
    );
  }
  let topic: string;

if (intent === "quiz") {
  topic = isGenericQuizRequest(data.input)
    ? data.contextTopic || "General"
    : extractTopic(data.input, data.contextTopic);
} else {
  topic = extractTopic(data.input, data.contextTopic);
}
    const grade = normalizeGrade(data.grade ?? extractGrade(data.input));
    const language = data.language ?? "Hinglish";
    const result = await generateLessonJSON(topic, intent, grade, language);
    console.info("[teaching-engine]", {
      topic,
      grade,
      intent,
      provider: result.provider,
      fallbackReason: result.fallbackReason,
    });
    return {
      ...result.data,
      _meta: { provider: result.provider, fallbackReason: result.fallbackReason },
    };
  });
  

function detectIntent(t: string): "teaching" | "quiz" {
  return /\b(quiz|mcq|question|test)\b/i.test(t) ? "quiz" : "teaching";
}

function extractTopic(text: string, fallback?: string): string {
  const cleaned = text.trim().replace(/^["']|["']$/g, "");

  // quiz on xyz
  const quizMatch = cleaned.match(
    /(?:quiz|mcq|test)\s+(?:on|about)\s+(.+)/i
  );

  if (quizMatch?.[1]) {
    return quizMatch[1]
      .replace(/[.?!]+$/, "")
      .trim();
  }

  // explain xyz
  const explainMatch = cleaned.match(
    /(?:explain|teach)\s+(.+)/i
  );

  if (explainMatch?.[1]) {
    return explainMatch[1]
      .replace(/[.?!]+$/, "")
      .trim();
  }

  return fallback || cleaned;
}

function extractGrade(text: string, fallback = "6"): string {
  const m = text.match(/\b(?:class|grade|std|standard)\s*(\d{1,2})\b/i);
  return normalizeGrade(m ? m[1] : fallback);
}

function normalizeGrade(value: string): string {
  const grade = Number.parseInt(value.replace(/\D/g, ""), 10);
  return Number.isInteger(grade) && grade >= 1 && grade <= 12 ? String(grade) : "6";
}

