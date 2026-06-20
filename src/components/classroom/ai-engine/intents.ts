import { Brain, ClipboardList, GraduationCap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type IntentKey = "teaching" | "quiz";

export type IntentDef = {
  key: IntentKey;
  label: string;
  icon: LucideIcon;
  destination: string;
  sample: string;
  produces: string[];
};

export const INTENTS: Record<IntentKey, IntentDef> = {
  teaching: {
    key: "teaching",
    label: "Teach Concept",
    icon: GraduationCap,
    destination: "Visual Learning Studio",
    sample: "Explain photosynthesis",
    produces: ["Concept", "3 Key Points", "Summary", "Visual Steps"],
  },
  quiz: {
    key: "quiz",
    label: "Voice Quiz",
    icon: ClipboardList,
    destination: "Quiz Engine",
    sample: "Quiz me on this",
    produces: ["5 MCQs", "Answer Key", "Explanations"],
  },
};

export const INTENT_ORDER: IntentKey[] = ["teaching", "quiz"];

export function detectIntent(transcript: string): IntentKey {
  return /\b(quiz|question|mcq|test)\b/i.test(transcript) ? "quiz" : "teaching";
}

export const INTENT_ICON: Record<IntentKey, LucideIcon> = Object.fromEntries(
  INTENT_ORDER.map((k) => [k, INTENTS[k].icon]),
) as Record<IntentKey, LucideIcon>;

export const BRAIN_ICON = Brain;
