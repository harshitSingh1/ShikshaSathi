import { z } from "zod";

/** AI surface for classroom teaching + quiz, with rich teaching flow. */
export const INTENT_VALUES = ["teaching", "quiz"] as const;
export const LANGUAGES = ["English", "Hindi", "Hinglish"] as const;
export const THEMES = ["nature", "science", "history", "math", "language", "default"] as const;

const visualStepSchema = z.object({
  icon: z.string().default("•"),
  label: z.string(),
});

export const visualSchema = z.object({
  title: z.string().default("Diagram"),
  steps: z.array(visualStepSchema).min(2).max(8),
});

const subtopicSchema = z.object({
  title: z.string(),
  detail: z.string().optional().default(""),
});

export const lessonSchema = z.object({
  hook: z.string().optional().default(""),
  concept: z.string(),
  whyItMatters: z.string().optional().default(""),
  keyPoints: z.array(z.string()).min(2).max(10),
  subtopics: z.array(subtopicSchema).optional().default([]),
  examples: z.array(z.string()).optional().default([]),
  mistakes: z.array(z.string()).optional().default([]),
  classroomQuestion: z.string().optional().default(""),
  activity: z.string().optional().default(""),
  summary: z.string().optional().default(""),
  teacherScript: z.string().optional().default(""),
  studentQuestions: z.array(z.string()).optional().default([]),
  expectedAnswers: z.array(z.string()).optional().default([]),
});

export const quizQuestionSchema = z.object({
  question: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.string(),
  explanation: z.string().optional().default(""),
  type: z.string().optional().default("mcq"),
  difficulty: z.string().optional().nullable(),
});

export const quizSchema = z.object({
  title: z.string().optional().default(""),
  topic: z.string().optional().nullable(),
  klass: z.string().optional().nullable(),
  language: z.string().optional().nullable(),
  questions: z.array(quizQuestionSchema).min(3).max(10),
});

export const teachingResponseSchema = z.object({
  intent: z.enum(INTENT_VALUES),
  topic: z.string().min(1),
  subject: z.string().optional().default("General"),
  grade: z.string().optional().default("6"),
  language: z.enum(LANGUAGES).optional().default("Hinglish"),
  theme: z.enum(THEMES).optional().default("science"),
  visualType: z.string().optional().default("flowchart"),
  lesson: lessonSchema.nullable().optional(),
  visual: visualSchema.nullable().optional(),
  quiz: quizSchema.nullable().optional(),
  _meta: z
    .object({
      provider: z.enum(["gemini", "openrouter", "local"]).optional(),
      fallbackReason: z.string().optional(),
    })
    .optional(),
});

export type TeachingResponse = z.infer<typeof teachingResponseSchema>;
export type LessonContent = z.infer<typeof lessonSchema>;
export type QuizContent = z.infer<typeof quizSchema>;
export type VisualContent = z.infer<typeof visualSchema>;
export type Subtopic = z.infer<typeof subtopicSchema>;
export type IntentValue = (typeof INTENT_VALUES)[number];
export type ThemeValue = (typeof THEMES)[number];
