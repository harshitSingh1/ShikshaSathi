export type QuizQuestion = {
  id: string;
  question: string;
  options: string[];
  correct: number;
  concept: string;
};

export const QUIZ_TOPIC = {
  title: "Photosynthesis",
  klass: "Class 6",
  language: "Hinglish",
  duration: "3 Minutes",
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "q1",
    question: "What is the main source of energy for photosynthesis?",
    options: ["Water", "Sunlight", "Oxygen", "Soil"],
    correct: 1,
    concept: "Sunlight",
  },
  {
    id: "q2",
    question: "Which gas do plants absorb from the air to make food?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correct: 2,
    concept: "Carbon Dioxide",
  },
  {
    id: "q3",
    question: "What is the green pigment in leaves that traps sunlight?",
    options: ["Glucose", "Chlorophyll", "Starch", "Xylem"],
    correct: 1,
    concept: "Chlorophyll",
  },
  {
    id: "q4",
    question: "Which gas is released as a by-product of photosynthesis?",
    options: ["Carbon Dioxide", "Nitrogen", "Hydrogen", "Oxygen"],
    correct: 3,
    concept: "Oxygen Release",
  },
  {
    id: "q5",
    question: "Where does photosynthesis mostly happen in a plant?",
    options: ["Roots", "Stem", "Leaves", "Flowers"],
    correct: 2,
    concept: "Plant Nutrition",
  },
];

export const QUESTION_PERFORMANCE = [
  { id: "q1", concept: "Sunlight", correct: 92 },
  { id: "q2", concept: "Carbon Dioxide", correct: 54 },
  { id: "q3", concept: "Chlorophyll", correct: 38 },
  { id: "q4", concept: "Oxygen Release", correct: 85 },
  { id: "q5", concept: "Plant Nutrition", correct: 67 },
];

export const QUIZ_HISTORY = [
  { id: "h1", title: "Photosynthesis Quiz", score: 78, date: "Today", klass: "Class 6" },
  { id: "h2", title: "Water Cycle Quiz", score: 84, date: "Yesterday", klass: "Class 5" },
  { id: "h3", title: "Solar System Quiz", score: 71, date: "2 days ago", klass: "Class 6" },
  { id: "h4", title: "Human Body Quiz", score: 88, date: "Last week", klass: "Class 7" },
];

export const SUGGESTED_TOPICS = [
  { emoji: "🌱", title: "Photosynthesis", subject: "Science" },
  { emoji: "💧", title: "Water Cycle", subject: "Science" },
  { emoji: "🫀", title: "Human Body", subject: "Biology" },
  { emoji: "🪐", title: "Solar System", subject: "Astronomy" },
];

export const QUIZ_TYPES = [
  { emoji: "🔘", label: "Multiple Choice", desc: "Pick the correct option" },
  { emoji: "✅", label: "True / False", desc: "Quick concept checks" },
  { emoji: "🔗", label: "Match the Following", desc: "Pair related ideas" },
  { emoji: "✍️", label: "Fill in the Blank", desc: "Test recall of key terms" },
  { emoji: "🖼️", label: "Visual Identification", desc: "Identify diagrams" },
];