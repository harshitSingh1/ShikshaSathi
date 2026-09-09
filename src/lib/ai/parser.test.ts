import { describe, expect, it } from "vitest";
import { detectIntent, extractGrade, extractTopic, normalizeGrade } from "./parser";

describe("classroom input parser", () => {
  it.each([
    ["Generate a quiz on photosynthesis", "quiz"],
    ["Test me about fractions", "quiz"],
    ["Explain the water cycle", "teaching"],
    ["Teach democracy", "teaching"],
  ])("detects %s as %s", (input, expected) => {
    expect(detectIntent(input)).toBe(expected);
  });

  it.each([
    ["Explain photosynthesis to Class 6 students.", "photosynthesis"],
    ["Teach fractions for Grade 5 children", "fractions"],
    ["Quiz on the water cycle for Class 4", "the water cycle"],
    ["Explain 'Newton's laws'", "Newton's laws"],
  ])("extracts a clean topic from %s", (input, expected) => {
    expect(extractTopic(input)).toBe(expected);
  });

  it.each([
    ["Explain photosynthesis for Class 7", "7"],
    ["Teach fractions to std 5 students", "5"],
    ["Explain democracy", "6"],
  ])("extracts grade %s from %s", (input, expected) => {
    expect(extractGrade(input)).toBe(expected);
  });

  it.each([
    ["Class 12", "12"],
    ["Class 0", "6"],
    ["Class 13", "6"],
    ["Class six", "6"],
    ["", "6"],
  ])("normalizes %s to %s", (input, expected) => {
    expect(normalizeGrade(input)).toBe(expected);
  });
});
