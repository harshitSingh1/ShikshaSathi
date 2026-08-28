import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { detectIntent, extractGrade, extractTopic, normalizeGrade } from "./parser";
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

function isGenericQuizRequest(text: string): boolean {
  return /^(quiz|generate quiz|start quiz|mcq|test)$/i.test(text.trim());
}

export const generateTeachingResponse = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }): Promise<TeachingResponse> => {
    const intent: "teaching" | "quiz" = data.intent ?? detectIntent(data.input);
    const topic =
      intent === "quiz" && isGenericQuizRequest(data.input)
        ? data.contextTopic || "General"
        : extractTopic(data.input, data.contextTopic);
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
      _meta: {
        provider: result.provider,
        fallbackReason: result.fallbackReason,
        attempts: result.attempts,
      },
    };
  });
