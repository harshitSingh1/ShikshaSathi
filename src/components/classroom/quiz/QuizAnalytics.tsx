import { CheckCircle2, Clock, RefreshCcw, Trophy, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTeachingEngine } from "../ai-engine/teaching-engine-context";
import { useMode } from "../mode-context";

function formatDuration(ms: number): string {
  if (!ms || ms < 0) return "0s";
  const totalSec = Math.round(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

export function QuizAnalytics({ big, onRestart }: { big: boolean; onRestart: () => void }) {
  const { response } = useTeachingEngine();
  const { userAnswers, quizStartedAt, quizFinishedAt } = useMode();
  const topic = response?.quiz?.topic ?? response?.topic ?? "Quiz";
  const questions = response?.quiz?.questions ?? [];

  if (!questions.length) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-3xl border border-border/60 bg-card p-8 text-center shadow-card animate-fade-in">
        <span className="text-5xl">🧠</span>
        <h2 className="font-display text-2xl font-extrabold text-foreground">No quiz to analyze</h2>
        <p className="text-sm text-muted-foreground">Generate a quiz first to see your results.</p>
        <button onClick={onRestart} className="inline-flex items-center gap-2 rounded-full bg-gradient-primary px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-glow">
          <RefreshCcw className="h-3.5 w-3.5" /> Back to Setup
        </button>
      </div>
    );
  }

  const total = questions.length;
  const correctCount = userAnswers.filter((a) => a.isCorrect).length;
  const incorrectCount = Math.max(0, userAnswers.length - correctCount);
  const unanswered = Math.max(0, total - userAnswers.length);
  const accuracy = total > 0 ? Math.round((correctCount / total) * 100) : 0;
  const durationMs =
    quizStartedAt && quizFinishedAt && quizFinishedAt > quizStartedAt
      ? quizFinishedAt - quizStartedAt
      : 0;

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-5 animate-fade-in">
      {/* Personal Result Header */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-primary p-6 text-white shadow-float sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white/85">
              <Trophy className="h-3.5 w-3.5" /> Quiz Completed · {topic}
            </div>
            <h1 className={cn("mt-1 font-display font-extrabold tracking-tight", big ? "text-5xl" : "text-3xl sm:text-4xl")}>
              Score · {correctCount} / {total}
            </h1>
            <p className="mt-1 max-w-md text-sm text-white/85">
              Your personal result · review every question and explanation below.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Accuracy" value={`${accuracy}%`} />
            <Stat label="Correct" value={`${correctCount}`} />
            <Stat label="Time" value={formatDuration(durationMs)} icon={<Clock className="h-3 w-3" />} />
          </div>
        </div>
      </section>

      {/* Summary chips */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <SummaryTile label="Score" value={`${correctCount} / ${total}`} tone="primary" />
        <SummaryTile label="Correct" value={`${correctCount}`} tone="success" />
        <SummaryTile label="Incorrect" value={`${incorrectCount}`} tone="destructive" />
        <SummaryTile label="Time Taken" value={formatDuration(durationMs)} tone="muted" />
      </section>
      {unanswered > 0 && (
        <p className="text-center text-xs text-muted-foreground">
          {unanswered} question{unanswered === 1 ? "" : "s"} skipped — counted as incorrect.
        </p>
      )}

      {/* Review Answers */}
      <section className="rounded-3xl border border-border/60 bg-card p-5 shadow-soft">
        <header className="mb-4 flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-xl bg-accent/30 text-accent-foreground">
            <CheckCircle2 className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-lg font-extrabold text-foreground">Review Answers</h3>
            <p className="text-xs text-muted-foreground">Your answer, the correct answer, and a clear explanation</p>
          </div>
        </header>
        <ol className="flex flex-col gap-3">
          {questions.map((q, i) => {
            const id = `q${i + 1}`;
            const ans = userAnswers.find((a) => a.questionId === id);
            const userAnswered = !!ans;
            const isCorrect = ans?.isCorrect ?? false;
            return (
              <li key={id} className={cn(
                "rounded-2xl border bg-background p-4",
                userAnswered ? (isCorrect ? "border-success/40" : "border-destructive/40") : "border-border/60",
              )}>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Question {i + 1}{q.difficulty ? ` · ${q.difficulty}` : ""}
                  </div>
                  {userAnswered ? (
                    isCorrect ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
                        <CheckCircle2 className="h-3 w-3" /> Correct
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive">
                        <XCircle className="h-3 w-3" /> Incorrect
                      </span>
                    )
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Skipped
                    </span>
                  )}
                </div>
                <div className="mt-1 text-sm font-bold text-foreground">{q.question}</div>
                <div className="mt-2 grid gap-1.5 text-xs">
                  {ans && ans.selectedText && (
                    <div className={cn(
                      "flex items-start gap-2 rounded-xl px-3 py-2",
                      isCorrect ? "bg-success/10 text-foreground" : "bg-destructive/10 text-foreground",
                    )}>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Your answer</span>
                      <span className="font-semibold">{ans.selectedText}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 rounded-xl bg-success/10 px-3 py-2 text-foreground">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Correct answer</span>
                    <span className="font-semibold">{q.correctAnswer}</span>
                  </div>
                </div>
                {q.explanation && (
                  <div className="mt-2 rounded-xl border border-border/60 bg-background px-3 py-2 text-xs text-muted-foreground">
                    <span className="font-bold text-foreground">Why:</span> {q.explanation}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      <button
        onClick={onRestart}
        className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-card px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-foreground shadow-soft transition-transform hover:-translate-y-0.5"
      >
        <RefreshCcw className="h-3.5 w-3.5" /> Run Another Quiz
      </button>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white/15 px-3 py-2 text-center backdrop-blur">
      <div className="flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-wider text-white/70">
        {icon}
        {label}
      </div>
      <div className="font-display text-xl font-extrabold">{value}</div>
    </div>
  );
}

function SummaryTile({ label, value, tone }: { label: string; value: string; tone: "primary" | "success" | "destructive" | "muted" }) {
  const toneClass =
    tone === "success"
      ? "border-success/30 bg-success/5 text-success"
      : tone === "destructive"
        ? "border-destructive/30 bg-destructive/5 text-destructive"
        : tone === "primary"
          ? "border-primary/30 bg-primary/5 text-primary"
          : "border-border/60 bg-card text-foreground";
  return (
    <div className={cn("rounded-2xl border p-4 text-center shadow-soft", toneClass)}>
      <div className="text-[10px] font-bold uppercase tracking-wider opacity-80">{label}</div>
      <div className="mt-1 font-display text-2xl font-extrabold tabular-nums">{value}</div>
    </div>
  );
}