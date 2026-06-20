/**
 * Rich classroom prompts: teaching (full lesson) + quiz.
 * Hinglish, grade-aware word count, topic-specific visual diagrams.
 */

function gradeBand(grade: string): string {
  const n = parseInt(grade, 10) || 6;
  if (n <= 3) return "150-250 words total, very simple short Hinglish sentences";
  if (n <= 6) return "300-500 words total, simple friendly Hinglish";
  if (n <= 10) return "500-800 words total, clear Hinglish mixed with proper English terms";
  return "800-1200 words total, precise Hinglish + accurate technical English terms";
}

export function buildTeachingPrompt(topic: string, grade = "6"): string {
  const band = gradeBand(grade);
  return `You are an experienced Indian school teacher preparing a Class ${grade} lesson on "${topic}".
Return ONLY a valid JSON object (no markdown, no code fences). Exact shape:
{
"topic":"${topic}","subject":"<real subject>","grade":"${grade}","language":"Hinglish","theme":"<nature|science|history|math|language|default>","visualType":"flowchart",
"lesson":{
"hook":"1-2 catchy Hinglish lines that grab attention about ${topic} (story, question, or surprising fact)",
"concept":"Clear Hinglish explanation of ${topic} in 4-6 sentences. Use correct terminology.",
"whyItMatters":"2-3 Hinglish lines: why ${topic} matters in real life and exams",
"keyPoints":["4-6 topic-specific sub-ideas, each a full Hinglish sentence"],
"subtopics":[{"title":"<real sub-area of ${topic}>","detail":"1-2 line Hinglish explanation"}],
"examples":["3-4 real-life Indian examples specific to ${topic}"],
"mistakes":["2-3 common mistakes Class ${grade} students make on ${topic}"],
"classroomQuestion":"1 open-ended Hinglish question to ask the whole class",
"activity":"1 short 2-3 minute hands-on classroom activity tied to ${topic}",
"summary":"1 powerful Hinglish recap sentence",
"teacherScript":"3-5 lines (separated by \\n) of exactly what the teacher can say aloud in Hinglish",
"studentQuestions":["3 realistic Hinglish questions students may ask about ${topic}"],
"expectedAnswers":["3 short Hinglish answers in the same order as studentQuestions"]
},
"visual":{"title":"<diagram name specific to ${topic}>","steps":[{"icon":"<one emoji>","label":"<real stage of ${topic}>"}]}
}
Rules:
- Hinglish in Roman script (natural Hindi+English mix).
- Total content target: ${band}.
- visual.steps must be 4-6 REAL conceptual stages of ${topic} (e.g. for "Number System": Natural -> Whole -> Integer -> Rational -> Irrational; for "Photosynthesis": Sunlight -> Leaf -> Chlorophyll -> Glucose -> Oxygen; for "Water Cycle": Evaporation -> Condensation -> Precipitation -> Collection). NEVER use "Definition", "Examples", "How it works", "Real-life use".
- NEVER use generic phrases: "important topic", "basic ideas", "simple explanation", "how it works", "concept", "learning".
- Every value must be specific to ${topic}.
- JSON only.`;
}

export function buildQuizPrompt(topic: string, grade = "6"): string {
  return `You are a Class ${grade} teacher. Topic: "${topic}".
Return ONLY a valid JSON object (no markdown). Shape:
{"topic":"${topic}","subject":"<subject>","grade":"${grade}","language":"Hinglish","theme":"<nature|science|history|math|language|default>","visualType":"flowchart",
"quiz":{"title":"${topic} — Quiz","topic":"${topic}","klass":"${grade}","language":"Hinglish","questions":[
{"question":"<Q in Hinglish>","options":["<opt1>","<opt2>","<opt3>","<opt4>"],"correctAnswer":"<exact text of one option>","explanation":"<1 short Hinglish sentence>","type":"mcq","difficulty":"easy"}
]}}
Rules: Exactly 5 questions. Each has 4 plausible Class-${grade} options. correctAnswer must equal one option EXACTLY (case sensitive). Simple Hinglish in Roman script. No placeholders like "Option A".`;
}
