import type { LanguageValue } from "./schema";

/**
 * Rich classroom prompts: teaching (full lesson) + quiz.
 * Multilingual (English, Hindi, Hinglish, Telugu, Tamil, Marathi, Bengali, Kannada, Gujarati).
 * Grade-aware word counts and topic-specific visual diagrams.
 */

function gradeBand(grade: string, lang: LanguageValue): string {
  const n = parseInt(grade, 10) || 6;
  if (n <= 3) return `150-250 words total, very simple short sentences in ${lang}`;
  if (n <= 6) return `300-500 words total, friendly and engaging ${lang}`;
  if (n <= 10) return `500-800 words total, clear ${lang} with accurate subject terminology`;
  return `800-1200 words total, precise ${lang} with thorough technical clarity`;
}

function languageInstructions(lang: LanguageValue): string {
  switch (lang) {
    case "English":
      return "Language: Pure standard English suitable for Indian school students. Do not use Hindi words.";
    case "Hindi":
      return "Language: Clear Hindi written in authentic Devanagari script (देवनागरी लिपि). Use proper standard Hindi terminology.";
    case "Telugu":
      return "Language: Natural Telugu written in authentic Telugu script (తెలుగు లిపి). Use everyday state board classroom terminology.";
    case "Tamil":
      return "Language: Natural Tamil written in authentic Tamil script (தமிழ் எழுத்துக்கள்). Use everyday state board classroom terminology.";
    case "Marathi":
      return "Language: Clear Marathi written in Devanagari script (मराठी). Use everyday state board classroom terminology.";
    case "Bengali":
      return "Language: Natural Bengali written in Bengali script (বাংলা লিপি). Use standard West Bengal board terminology.";
    case "Kannada":
      return "Language: Natural Kannada written in authentic Kannada script (ಕನ್ನಡ ಲಿಪಿ). Use everyday state board terminology.";
    case "Gujarati":
      return "Language: Natural Gujarati written in authentic Gujarati script (ગુજરાતી લિપિ). Use everyday state board terminology.";
    case "Hinglish":
    default:
      return "Language: Natural conversational Hinglish in Roman script (Hindi+English mix as spoken in Indian school classrooms).";
  }
}

export function buildTeachingPrompt(topic: string, grade = "6", language: LanguageValue = "Hinglish"): string {
  const band = gradeBand(grade, language);
  const langRule = languageInstructions(language);

  return `You are an experienced Indian school teacher preparing a Class ${grade} lesson on "${topic}".
${langRule}
Return ONLY a valid JSON object (no markdown, no code fences). Exact shape:
{
"topic":"${topic}","subject":"<real subject>","grade":"${grade}","language":"${language}","theme":"<nature|science|history|math|language|default>","visualType":"flowchart",
"lesson":{
"hook":"1-2 catchy lines in ${language} that grab student attention about ${topic} (story, question, or surprising fact)",
"concept":"Clear explanation of ${topic} in 4-6 sentences in ${language}. Use correct terminology.",
"whyItMatters":"2-3 lines in ${language}: why ${topic} matters in real life and exams",
"keyPoints":["4-6 topic-specific sub-ideas, each a full sentence in ${language}"],
"subtopics":[{"title":"<real sub-area of ${topic}>","detail":"1-2 line explanation in ${language}"}],
"examples":["3-4 real-life Indian examples specific to ${topic} in ${language}"],
"mistakes":["2-3 common mistakes Class ${grade} students make on ${topic} in ${language}"],
"classroomQuestion":"1 open-ended question in ${language} to ask the whole class",
"activity":"1 short 2-3 minute hands-on classroom activity tied to ${topic} in ${language}",
"summary":"1 powerful recap sentence in ${language}",
"teacherScript":"3-5 lines (separated by \\n) of exactly what the teacher can say aloud to the class in ${language}",
"studentQuestions":["3 realistic questions students may ask about ${topic} in ${language}"],
"expectedAnswers":["3 short answers in the same order as studentQuestions in ${language}"]
},
"visual":{"title":"<diagram name specific to ${topic}>","steps":[{"icon":"<one emoji>","label":"<real stage of ${topic}>"}]}
}
Rules:
- ${langRule}
- Total content target: ${band}.
- visual.steps must be 4-6 REAL conceptual stages of ${topic} (e.g. for "Number System": Natural -> Whole -> Integer -> Rational -> Irrational; for "Photosynthesis": Sunlight -> Leaf -> Chlorophyll -> Glucose -> Oxygen; for "Water Cycle": Evaporation -> Condensation -> Precipitation -> Collection). NEVER use "Definition", "Examples", "How it works", "Real-life use".
- NEVER use generic phrases: "important topic", "basic ideas", "simple explanation", "how it works", "concept", "learning".
- Every value must be specific to ${topic}.
- JSON only.`;
}

export function buildQuizPrompt(topic: string, grade = "6", language: LanguageValue = "Hinglish"): string {
  const langRule = languageInstructions(language);

  return `You are a Class ${grade} teacher. Topic: "${topic}".
${langRule}
Return ONLY a valid JSON object (no markdown). Shape:
{"topic":"${topic}","subject":"<subject>","grade":"${grade}","language":"${language}","theme":"<nature|science|history|math|language|default>","visualType":"flowchart",
"quiz":{"title":"${topic} — Quiz","topic":"${topic}","klass":"${grade}","language":"${language}","questions":[
{"question":"<question in ${language}>","options":["<opt1>","<opt2>","<opt3>","<opt4>"],"correctAnswer":"<exact text of one option>","explanation":"<1 short explanation in ${language}>","type":"mcq","difficulty":"easy"}
]}}
Rules: Exactly 5 questions. Each has 4 plausible Class-${grade} options. correctAnswer must equal one option EXACTLY (case sensitive). All question and option text must follow ${langRule}. No placeholders like "Option A".`;
}
