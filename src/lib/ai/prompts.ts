import type { LanguageValue } from "./schema";

/** Rich classroom prompts: teaching (full lesson) + quiz. */
function gradeBand(grade: string, language: LanguageValue): string {
  const n = parseInt(grade, 10) || 6;
  const style =
    language === "Hindi"
      ? "simple Hindi in Devanagari script with necessary English academic terms"
      : language === "English"
        ? "clear, age-appropriate English"
        : "simple friendly Hinglish in Roman script";
  if (n <= 3) return `150-250 words total, very simple short ${style} sentences`;
  if (n <= 6) return `300-500 words total, ${style}`;
  if (n <= 10) return `500-800 words total, clear ${style}`;
  return `800-1200 words total, precise ${style} with accurate technical terms`;
}

function languageRules(language: LanguageValue): string {
  if (language === "Hindi") {
    return "Write Hindi in Devanagari script. Keep universally used academic terms in English only when that improves clarity.";
  }
  if (language === "English") {
    return "Write entirely in clear, age-appropriate English. Do not use Hinglish or Hindi sentences.";
  }
  return "Write natural Hinglish in Roman script, combining simple Hindi with necessary English academic terms.";
}

export function buildTeachingPrompt(topic: string, grade = "6", language: LanguageValue = "Hinglish"): string {
  const band = gradeBand(grade, language);
  return `You are an experienced Indian school teacher preparing a Class ${grade} lesson on "${topic}".
Return ONLY a valid JSON object (no markdown, no code fences). Exact shape:
{
"topic":"${topic}","subject":"<real subject>","grade":"${grade}","language":"${language}","theme":"<nature|science|history|math|language|default>","visualType":"flowchart",
"lesson":{
"hook":"1-2 catchy ${language} lines that grab attention about ${topic} (story, question, or surprising fact)",
"concept":"Clear ${language} explanation of ${topic} in 4-6 sentences. Use correct terminology.",
"whyItMatters":"2-3 ${language} lines: why ${topic} matters in real life and exams",
"keyPoints":["4-6 topic-specific sub-ideas, each a full ${language} sentence"],
"subtopics":[{"title":"<real sub-area of ${topic}>","detail":"1-2 line ${language} explanation"}],
"examples":["3-4 real-life Indian examples specific to ${topic}"],
"mistakes":["2-3 common mistakes Class ${grade} students make on ${topic}"],
"classroomQuestion":"1 open-ended ${language} question to ask the whole class",
"activity":"1 short 2-3 minute hands-on classroom activity tied to ${topic}",
"summary":"1 powerful ${language} recap sentence",
"teacherScript":"3-5 lines (separated by \\n) of exactly what the teacher can say aloud in ${language}",
"studentQuestions":["3 realistic ${language} questions students may ask about ${topic}"],
"expectedAnswers":["3 short ${language} answers in the same order as studentQuestions"]
},
"visual":{"title":"<diagram name specific to ${topic}>","steps":[{"icon":"<one emoji>","label":"<real stage of ${topic}>"}]}
}
Rules:
- ${languageRules(language)}
- Total content target: ${band}.
- visual.steps must be 4-6 REAL conceptual stages of ${topic} (e.g. for "Number System": Natural -> Whole -> Integer -> Rational -> Irrational; for "Photosynthesis": Sunlight -> Leaf -> Chlorophyll -> Glucose -> Oxygen; for "Water Cycle": Evaporation -> Condensation -> Precipitation -> Collection). NEVER use "Definition", "Examples", "How it works", "Real-life use".
- NEVER use generic phrases: "important topic", "basic ideas", "simple explanation", "how it works", "concept", "learning".
- Every value must be specific to ${topic}.
- JSON only.`;
}

export function buildQuizPrompt(topic: string, grade = "6", language: LanguageValue = "Hinglish"): string {
  return `You are a Class ${grade} teacher. Topic: "${topic}". Language: ${language}.
Return ONLY a valid JSON object (no markdown). Shape:
{"topic":"${topic}","subject":"<subject>","grade":"${grade}","language":"${language}","theme":"<nature|science|history|math|language|default>","visualType":"flowchart",
"quiz":{"title":"${topic} — Quiz","topic":"${topic}","klass":"${grade}","language":"${language}","questions":[
{"question":"<question in ${language}>","options":["<opt1>","<opt2>","<opt3>","<opt4>"],"correctAnswer":"<exact text of one option>","explanation":"<1 short explanation in ${language}>","type":"mcq","difficulty":"easy"}
]}}
Rules: Exactly 5 questions. Each has 4 plausible Class-${grade} options. correctAnswer must equal one option EXACTLY (case sensitive). ${languageRules(language)} No placeholders like "Option A".`;
}
