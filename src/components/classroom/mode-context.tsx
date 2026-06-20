import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type LearningMode = "teaching" | "quiz";
export type QuizPhase = "setup" | "live" | "results";

export type QuizQuestionType = "mcq" | "true_false" | "fill_blank" | "match" | "visual_id";
export type QuizDifficulty = "easy" | "medium" | "hard";

export type QuizSettings = {
  questionType: QuizQuestionType;
  count: number;
  difficulty: QuizDifficulty;
};

export type QuizAnswer = {
  questionId: string;
  selectedIndex: number | null;
  selectedText: string;
  isCorrect: boolean;
};

const DEFAULT_QUIZ_SETTINGS: QuizSettings = {
  questionType: "mcq",
  count: 5,
  difficulty: "easy",
};

type Ctx = {
  mode: LearningMode;
  setMode: (m: LearningMode) => void;
  quizPhase: QuizPhase;
  setQuizPhase: (p: QuizPhase) => void;
  questionIndex: number;
  setQuestionIndex: (i: number) => void;
  enterQuiz: () => void;
  exitQuiz: () => void;
  quizSettings: QuizSettings;
  setQuizSettings: (patch: Partial<QuizSettings>) => void;
  userAnswers: QuizAnswer[];
  recordAnswer: (a: QuizAnswer) => void;
  resetAnswers: () => void;
  quizStartedAt: number | null;
  quizFinishedAt: number | null;
};

const ModeCtx = createContext<Ctx | null>(null);

export function ModeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<LearningMode>("teaching");
  const [quizPhase, setQuizPhaseRaw] = useState<QuizPhase>("setup");
  const [questionIndex, setQuestionIndex] = useState(0);
  const [quizSettings, setQuizSettingsState] = useState<QuizSettings>(DEFAULT_QUIZ_SETTINGS);
  const [userAnswers, setUserAnswers] = useState<QuizAnswer[]>([]);
  const [quizStartedAt, setQuizStartedAt] = useState<number | null>(null);
  const [quizFinishedAt, setQuizFinishedAt] = useState<number | null>(null);

  const setQuizSettings = useCallback(
    (patch: Partial<QuizSettings>) => setQuizSettingsState((p) => ({ ...p, ...patch })),
    [],
  );
  const recordAnswer = useCallback((a: QuizAnswer) => {
    setUserAnswers((prev) => [...prev.filter((p) => p.questionId !== a.questionId), a]);
  }, []);
  const resetAnswers = useCallback(() => setUserAnswers([]), []);

  const setQuizPhase = useCallback((p: QuizPhase) => {
    setQuizPhaseRaw(p);
    if (p === "live") {
      setQuizStartedAt(Date.now());
      setQuizFinishedAt(null);
    } else if (p === "results") {
      setQuizFinishedAt(Date.now());
    } else {
      setQuizStartedAt(null);
      setQuizFinishedAt(null);
    }
  }, []);

  const enterQuiz = useCallback(() => {
    setMode("quiz");
    setQuizPhaseRaw("setup");
    setQuestionIndex(0);
    setUserAnswers([]);
    setQuizStartedAt(null);
    setQuizFinishedAt(null);
  }, []);

  const exitQuiz = useCallback(() => {
    setMode("teaching");
    setQuizPhaseRaw("setup");
    setQuestionIndex(0);
    setUserAnswers([]);
    setQuizStartedAt(null);
    setQuizFinishedAt(null);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      mode,
      setMode,
      quizPhase,
      setQuizPhase,
      questionIndex,
      setQuestionIndex,
      enterQuiz,
      exitQuiz,
      quizSettings,
      setQuizSettings,
      userAnswers,
      recordAnswer,
      resetAnswers,
      quizStartedAt,
      quizFinishedAt,
    }),
    [
      mode,
      quizPhase,
      setQuizPhase,
      questionIndex,
      enterQuiz,
      exitQuiz,
      quizSettings,
      setQuizSettings,
      userAnswers,
      recordAnswer,
      resetAnswers,
      quizStartedAt,
      quizFinishedAt,
    ],
  );
  return <ModeCtx.Provider value={value}>{children}</ModeCtx.Provider>;
}

export function useMode() {
  const v = useContext(ModeCtx);
  if (!v) throw new Error("useMode must be used inside <ModeProvider>");
  return v;
}
