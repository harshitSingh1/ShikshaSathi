import { describe, expect, it } from "vitest";
import { buildQuizPrompt, buildTeachingPrompt } from "./prompts";

describe("AI prompt contract", () => {
  it("includes the selected language and grade in teaching prompts", () => {
    const prompt = buildTeachingPrompt("photosynthesis", "10", "English");

    expect(prompt).toContain('Class 10 lesson on "photosynthesis"');
    expect(prompt).toContain('"grade":"10"');
    expect(prompt).toContain('"language":"English"');
    expect(prompt).toContain("Do not use Hinglish or Hindi sentences");
  });

  it("requests Devanagari Hindi for Hindi lessons", () => {
    const prompt = buildTeachingPrompt("जल चक्र", "5", "Hindi");

    expect(prompt).toContain('"language":"Hindi"');
    expect(prompt).toContain("Write Hindi in Devanagari script");
  });

  it("keeps quiz metadata aligned with the selected request", () => {
    const prompt = buildQuizPrompt("fractions", "7", "Hinglish");

    expect(prompt).toContain('"grade":"7"');
    expect(prompt).toContain('"language":"Hinglish"');
    expect(prompt).toContain("Exactly 5 questions");
  });
});
