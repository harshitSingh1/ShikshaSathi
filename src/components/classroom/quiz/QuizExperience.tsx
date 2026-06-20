import { useEffect, useMemo, useState } from "react";
import {
  Brain,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sparkles,
  Zap,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMode, type QuizDifficulty, type QuizQuestionType } from "../mode-context";
import { SUGGESTED_TOPICS } from "./quiz-data";
import { QuizTimer } from "./QuizTimer";
import { QuizAnalytics } from "./QuizAnalytics";
import { useTeachingEngine } from "../ai-engine/teaching-engine-context";
import { useVoice } from "../voice-context";

type LiveQuestion = {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation?: string | null;
  type: QuizQuestionType;
  difficulty?: QuizDifficulty | null;
};

const TYPE_OPTIONS: Array<{ value: QuizQuestionType; label: string; emoji: string; desc: string }> = [
  { value: "mcq", label: "Multiple Choice", emoji: "🔘", desc: "Pick the correct option" },
  { value: "true_false", label: "True / False", emoji: "✅", desc: "Quick concept checks" },
  { value: "match", label: "Match the Following", emoji: "🔗", desc: "Pair related ideas" },
  { value: "fill_blank", label: "Fill in the Blank", emoji: "✍️", desc: "Test recall of key terms" },
  { value: "visual_id", label: "Visual Identification", emoji: "🖼️", desc: "Identify diagrams" },
];

const COUNT_OPTIONS = [5, 10, 15];
const DIFFICULTY_OPTIONS: QuizDifficulty[] = ["easy", "medium", "hard"];

export function QuizExperience({ big }: { big: boolean }) {
  const { quizPhase, setQuizPhase, questionIndex, setQuestionIndex, recordAnswer, resetAnswers } = useMode();
  const { response, currentTopic } = useTeachingEngine();

  // Build the live question list strictly from the AI-generated quiz.
  const questions = useMemo<LiveQuestion[]>(() => {
    const qs = response?.quiz?.questions;
    if (!qs?.length) return [];
    return qs.map((q, i) => {
      const correct = Math.max(
        0,
        q.options.findIndex((o) => o.trim() === (q.correctAnswer ?? "").trim()),
      );
      return {
        id: `q${i + 1}`,
        question: q.question,
        options: q.options,
        correct: correct >= 0 ? correct : 0,
        explanation: q.explanation ?? null,
        type: (q.type as QuizQuestionType) ?? "mcq",
        difficulty: (q.difficulty as QuizDifficulty | null | undefined) ?? null,
      };
    });
  }, [response]);

  const quizMeta = {
    topic: response?.quiz?.topic ?? response?.topic ?? currentTopic ?? "",
    klass: response?.quiz?.klass ?? response?.grade ?? "",
    language: response?.quiz?.language ?? response?.language ?? "",
    title: response?.quiz?.title ?? (response?.topic ? `${response.topic} — Quiz` : ""),
  };

  if (quizPhase === "setup") {
    return <QuizSetup big={big} currentTopic={currentTopic} hasQuiz={questions.length > 0} onStart={() => { resetAnswers(); setQuestionIndex(0); setQuizPhase("live"); }} />;
  }
  if (quizPhase === "results") {
    return <QuizAnalytics big={big} onRestart={() => { setQuizPhase("setup"); setQuestionIndex(0); resetAnswers(); }} />;
  }

  if (questions.length === 0) {
    return <QuizEmpty big={big} currentTopic={currentTopic} />;
  }

  return (
    <QuizLive
      big={big}
      index={Math.min(questionIndex, questions.length - 1)}
      questions={questions}
      meta={quizMeta}
      onAnswer={(q, selectedIndex, selectedText, isCorrect) =>
        recordAnswer({ questionId: q.id, selectedIndex, selectedText, isCorrect })
      }
      onNext={() => {
        if (questionIndex + 1 >= questions.length) {
          setQuizPhase("results");
        } else {
          setQuestionIndex(questionIndex + 1);
        }
      }}
    />
  );
}

function QuizSetup({ onStart, big, currentTopic, hasQuiz }: { onStart: () => void; big: boolean; currentTopic: string | null; hasQuiz: boolean }) {
  const { sendText } = useVoice();
  const { quizSettings, setQuizSettings } = useMode();
  const requestQuiz = (topic: string) => {
    const typeWord =
      quizSettings.questionType === "true_false"
        ? "True/False"
        : quizSettings.questionType === "fill_blank"
          ? "Fill-in-the-Blank"
          : quizSettings.questionType === "match"
            ? "Match-the-Following"
            : quizSettings.questionType === "visual_id"
              ? "Visual Identification"
              : "Multiple Choice";
    void sendText(
      `Generate a ${quizSettings.count}-question ${typeWord} quiz on "${topic}" at ${quizSettings.difficulty} difficulty.`,
    );
  };
  const microQuiz = (count: number, topicOverride?: string) => {
    const topic = topicOverride ?? currentTopic ?? "the last lesson";
    void sendText(`Generate a ${count}-question quick revision quiz on "${topic}" at easy difficulty.`);
  };
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 animate-fade-in">
      <section className="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 text-white shadow-float sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className={cn("grid shrink-0 place-items-center rounded-3xl bg-white/20 backdrop-blur", big ? "h-20 w-20 text-5xl" : "h-16 w-16 text-4xl")}>🧠</span>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/85">
                <Sparkles className="h-3.5 w-3.5" /> AI Quiz Session
              </div>
              <h1 className={cn("mt-1 font-display font-extrabold tracking-tight", big ? "text-5xl" : "text-3xl sm:text-4xl")}>
                {currentTopic ? `Ready to Quiz on ${currentTopic}` : "Teach a lesson first"}
              </h1>
              <p className="mt-1 max-w-md text-sm text-white/85">
                {currentTopic
                  ? `Configure question type, length and difficulty below, then generate a fresh ${quizSettings.count}-question quiz on ${currentTopic}.`
                  : "Teach a concept first, then ask the AI to generate a quiz on it. You can also tap any suggested topic below."}
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 self-start rounded-full bg-white/20 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider backdrop-blur">
            <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-white" /> {hasQuiz ? "Quiz Ready" : "Waiting for Topic"}
          </span>
        </div>
      </section>

      {/* Quiz Setup Area: settings */}
      <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
        <header className="mb-4 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-secondary/15 text-secondary"><Sparkles className="h-4 w-4" /></span>
          <div>
            <h3 className="font-display text-lg font-extrabold text-foreground">Quiz Setup</h3>
            <p className="text-xs text-muted-foreground">Choose type, length and difficulty — the AI follows your selection</p>
          </div>
        </header>

        <div className="mb-4">
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Question Type</div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {TYPE_OPTIONS.map((t) => {
              const active = quizSettings.questionType === t.value;
              return (
                <button
                  key={t.value}
                  onClick={() => setQuizSettings({ questionType: t.value })}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-all",
                    active
                      ? "border-primary bg-primary/10 shadow-glow"
                      : "border-border/60 bg-background hover:-translate-y-0.5 hover:border-primary/40",
                  )}
                >
                  <span className={cn("grid h-10 w-10 place-items-center rounded-xl text-xl", active ? "bg-gradient-primary text-white" : "bg-muted")}>{t.emoji}</span>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-foreground">{t.label}</div>
                    <div className="text-[11px] text-muted-foreground">{t.desc}</div>
                  </div>
                  {active && <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Quiz Length</div>
            <div className="flex gap-2">
              {COUNT_OPTIONS.map((c) => {
                const active = quizSettings.count === c;
                return (
                  <button
                    key={c}
                    onClick={() => setQuizSettings({ count: c })}
                    className={cn(
                      "flex-1 rounded-2xl border-2 px-3 py-2.5 text-sm font-bold transition-all",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 bg-background text-foreground hover:border-primary/40",
                    )}
                  >
                    {c} Questions
                  </button>
                );
              })}
            </div>
          </div>
          <div>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Difficulty</div>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map((d) => {
                const active = quizSettings.difficulty === d;
                return (
                  <button
                    key={d}
                    onClick={() => setQuizSettings({ difficulty: d })}
                    className={cn(
                      "flex-1 rounded-2xl border-2 px-3 py-2.5 text-sm font-bold capitalize transition-all",
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 bg-background text-foreground hover:border-primary/40",
                    )}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Micro Quiz quick actions */}
      <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
        <header className="mb-3 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent/30 text-accent-foreground"><Zap className="h-4 w-4" /></span>
          <div>
            <h3 className="font-display text-base font-extrabold text-foreground">Micro Quiz Mode</h3>
            <p className="text-xs text-muted-foreground">Instant revision during live teaching</p>
          </div>
        </header>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => microQuiz(2)} className="rounded-full border border-border bg-background px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-foreground hover:border-primary/40">⚡ 2 Questions</button>
          <button onClick={() => microQuiz(5)} className="rounded-full border border-border bg-background px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-foreground hover:border-primary/40">⚡ 5 Questions</button>
          <button onClick={() => microQuiz(5)} className="rounded-full border border-border bg-background px-3.5 py-2 text-xs font-bold uppercase tracking-wider text-foreground hover:border-primary/40">🔁 Rapid Revision</button>
        </div>
      </section>

      <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
        <header className="mb-4 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/10 text-primary"><Brain className="h-4 w-4" /></span>
          <div>
            <h3 className="font-display text-lg font-extrabold text-foreground">Suggested Topics</h3>
            <p className="text-xs text-muted-foreground">Tap any topic to generate a fresh AI quiz</p>
          </div>
        </header>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {SUGGESTED_TOPICS.map((t) => (
            <button
              key={t.title}
              onClick={() => requestQuiz(t.title)}
              className="group flex flex-col items-start gap-2 rounded-2xl border border-border/60 bg-gradient-hero p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
            >
              <span className="text-3xl">{t.emoji}</span>
              <span className="text-sm font-bold text-foreground">{t.title}</span>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{t.subject}</span>
            </button>
          ))}
        </div>
      </section>

      {hasQuiz && (
        <button
          onClick={onStart}
          className="mx-auto inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-glow transition-transform hover:-translate-y-0.5"
        >
          Start Live Quiz <ChevronRight className="h-4 w-4" />
        </button>
      )}
      {currentTopic && !hasQuiz && (
        <button
          onClick={() => requestQuiz(currentTopic)}
          className="mx-auto inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-glow transition-transform hover:-translate-y-0.5"
        >
          Generate Quiz on {currentTopic} <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

function QuizEmpty({ big, currentTopic }: { big: boolean; currentTopic: string | null }) {
  const { sendText } = useVoice();
  const examples = ["Photosynthesis", "Number System", "Water Cycle"];
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-5 rounded-3xl border border-border/60 bg-card p-8 text-center shadow-card animate-fade-in">
      <span className={cn("text-6xl", big && "text-7xl")}>🧠</span>
      <h2 className={cn("font-display font-extrabold text-foreground", big ? "text-4xl" : "text-2xl")}>
        {currentTopic ? `Ready to quiz on ${currentTopic}` : "Teach a lesson first to generate a quiz"}
      </h2>
      <p className="text-sm text-muted-foreground">
        {currentTopic
          ? `Say "Generate a quiz on this topic" or tap the button below.`
          : "Explain a concept first, then ask the AI to generate a quiz on it."}
      </p>
      {currentTopic ? (
        <button
          onClick={() => void sendText(`Generate a 5-question quiz on "${currentTopic}".`)}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-6 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-glow transition-transform hover:-translate-y-0.5"
        >
          Generate Quiz Now <ChevronRight className="h-4 w-4" />
        </button>
      ) : (
        <div className="flex flex-wrap justify-center gap-2">
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => void sendText(`Explain ${ex}`)}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-foreground hover:border-primary/40"
            >
              Explain {ex}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function QuizLive({
  big,
  index,
  questions,
  meta,
  onNext,
  onAnswer,
}: {
  big: boolean;
  index: number;
  questions: LiveQuestion[];
  meta: { topic: string; klass: string; language: string; title: string };
  onNext: () => void;
  onAnswer: (q: LiveQuestion, selectedIndex: number, selectedText: string, isCorrect: boolean) => void;
}) {
  const q = questions[index];
  const total = questions.length;
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [fillValue, setFillValue] = useState("");

  useEffect(() => {
    setSelected(null);
    setRevealed(false);
    setFillValue("");
  }, [index]);

  const pick = (i: number) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
    onAnswer(q, i, q.options[i] ?? "", i === q.correct);
  };

  const submitFill = () => {
    if (revealed || !fillValue.trim()) return;
    const correctText = q.options[q.correct] ?? "";
    const isCorrect = fillValue.trim().toLowerCase() === correctText.trim().toLowerCase();
    setSelected(isCorrect ? q.correct : -1);
    setRevealed(true);
    onAnswer(q, isCorrect ? q.correct : -1, fillValue.trim(), isCorrect);
  };

  return (
    <div key={q.id} className="mx-auto flex max-w-4xl flex-col gap-5 animate-scale-in">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border/60 bg-card px-4 py-3 shadow-soft">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-2.5 py-1 text-destructive">
            <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-destructive" /> Live Quiz
          </span>
          <span>
            {meta.topic}
            {meta.klass && ` · Class ${meta.klass}`}
            {meta.language && ` · ${meta.language}`}
            {q.difficulty && ` · ${q.difficulty}`}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
          <Clock className="h-3.5 w-3.5" /> 20s per question
        </div>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-primary transition-all duration-500"
          style={{ width: `${((index + 1) / total) * 100}%` }}
        />
      </div>

      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-6 shadow-float sm:p-8">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <div className="min-w-0">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
              Question {index + 1} of {total} · {labelForType(q.type)}
            </div>
            <h2
              className={cn(
                "mt-2 font-display font-extrabold leading-tight text-foreground",
                big ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl",
              )}
            >
              {q.question}
            </h2>
          </div>
          <QuizTimer keyId={q.id} total={20} big={big} />
        </div>

        {q.type === "fill_blank" ? (
          <div className="mt-6 flex flex-col gap-3">
            <input
              value={fillValue}
              onChange={(e) => setFillValue(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submitFill(); }}
              disabled={revealed}
              placeholder="Type the missing word…"
              className={cn(
                "rounded-2xl border-2 border-border bg-background px-4 py-3 text-lg font-bold text-foreground outline-none transition-all focus:border-primary",
                big && "text-2xl py-4",
              )}
            />
            {!revealed && (
              <button
                onClick={submitFill}
                className="self-start rounded-full bg-gradient-primary px-5 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-glow"
              >
                Submit Answer
              </button>
            )}
            {revealed && (
              <div className={cn("rounded-2xl border-2 p-4 text-sm font-bold", selected === q.correct ? "border-success bg-success/10 text-success" : "border-destructive bg-destructive/10 text-destructive")}>
                {selected === q.correct ? `✓ Correct: ${q.options[q.correct]}` : `✗ Correct answer: ${q.options[q.correct]}`}
              </div>
            )}
          </div>
        ) : (
          <div className={cn("mt-6 grid gap-3", q.type === "true_false" ? "sm:grid-cols-2" : big ? "sm:grid-cols-2" : "sm:grid-cols-2")}>
          {q.options.map((opt, i) => {
            const isCorrect = revealed && i === q.correct;
            const isWrong = revealed && selected === i && i !== q.correct;
            const label =
              q.type === "true_false"
                ? (opt.trim().toLowerCase().startsWith("t") ? "T" : "F")
                : String.fromCharCode(65 + i);
            return (
              <button
                key={i}
                onClick={() => pick(i)}
                className={cn(
                  "group flex items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all",
                  "hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-card",
                  isCorrect && "border-success bg-success/10",
                  isWrong && "border-destructive bg-destructive/10",
                  !revealed && selected === null && "border-border bg-background",
                  !revealed && selected === i && "border-primary bg-primary/10",
                )}
              >
                <span
                  className={cn(
                    "grid place-items-center rounded-xl font-display font-extrabold",
                    big ? "h-14 w-14 text-2xl" : "h-12 w-12 text-xl",
                    isCorrect ? "bg-success text-white" : isWrong ? "bg-destructive text-white" : "bg-muted text-foreground group-hover:bg-gradient-primary group-hover:text-white",
                  )}
                >
                  {label}
                </span>
                <span className={cn("flex-1 font-bold text-foreground", big ? "text-xl" : "text-base")}>{opt}</span>
                {isCorrect && <CheckCircle2 className="h-6 w-6 text-success" />}
                {isWrong && <XCircle className="h-6 w-6 text-destructive" />}
              </button>
            );
          })}
          </div>
        )}

        {revealed && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-gradient-hero p-4 animate-fade-in">
            <div className="min-w-0 text-sm font-semibold text-foreground">
              <div>
                {selected === q.correct ? "🎉 Great! Correct answer." : "💡 Not quite — correct answer is highlighted."}
              </div>
              {q.explanation && (
                <div className="mt-1 text-xs font-medium text-muted-foreground">{q.explanation}</div>
              )}
            </div>
            <button
              onClick={onNext}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-4 py-2 text-xs font-bold uppercase tracking-wider text-white shadow-glow transition-transform hover:-translate-y-0.5"
            >
              {index + 1 >= total ? "Finish Quiz" : "Next Question"} <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

function labelForType(t: QuizQuestionType): string {
  switch (t) {
    case "true_false": return "True / False";
    case "fill_blank": return "Fill in the Blank";
    case "match": return "Match the Following";
    case "visual_id": return "Visual Identification";
    default: return "Multiple Choice";
  }
}