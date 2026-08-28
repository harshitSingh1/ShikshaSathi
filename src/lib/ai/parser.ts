export type ParsedIntent = "teaching" | "quiz";

export function detectIntent(text: string): ParsedIntent {
  return /\b(quiz|mcq|question|test)\b/i.test(text) ? "quiz" : "teaching";
}

export function extractTopic(text: string, fallback?: string): string {
  const cleaned = text.trim().replace(/^["']|["']$/g, "");

  const quizMatch = cleaned.match(/(?:quiz|mcq|test)\s+(?:on|about)\s+(.+)/i);
  if (quizMatch?.[1]) return cleanTopic(quizMatch[1]);

  const explainMatch = cleaned.match(/(?:explain|teach)\s+(.+)/i);
  if (explainMatch?.[1]) return cleanTopic(explainMatch[1]);

  return cleanTopic(fallback || cleaned);
}

export function extractGrade(text: string, fallback = "6"): string {
  const match = text.match(/\b(?:class|grade|std|standard)\s*(\d{1,2})\b/i);
  return normalizeGrade(match?.[1] ?? fallback);
}

export function normalizeGrade(value: string): string {
  const grade = Number.parseInt(value.replace(/\D/g, ""), 10);
  return Number.isInteger(grade) && grade >= 1 && grade <= 12 ? String(grade) : "6";
}

function cleanTopic(value: string): string {
  return value
    .replace(/[.?!]+$/, "")
    .replace(/\s+(?:to|for)\s+(?:class|grade|std|standard)\s*\d{1,2}(?:\s+(?:students?|children))?$/i, "")
    .replace(/\s+(?:students?|children)$/i, "")
    .replace(/^["']|["']$/g, "")
    .trim();
}
