import { History } from "lucide-react";
import { cn } from "@/lib/utils";
import { QUIZ_HISTORY } from "./quiz-data";
import { useMode } from "../mode-context";

export function QuizHistoryCard() {
  const { enterQuiz } = useMode();
  return (
    <section className="rounded-3xl border border-border/60 bg-card p-4 shadow-soft">
      <header className="mb-3 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/30 text-accent-foreground">
          <History className="h-3.5 w-3.5" />
        </span>
        <h4 className="text-sm font-bold tracking-tight text-foreground">Recent Quiz Sessions</h4>
      </header>
      <ul className="flex flex-col gap-1.5">
        {QUIZ_HISTORY.map((q) => {
          const tone = q.score >= 80 ? "text-success" : q.score >= 60 ? "text-accent-foreground" : "text-destructive";
          return (
            <li key={q.id}>
              <button
                onClick={enterQuiz}
                className="group flex w-full items-center gap-3 rounded-2xl border border-transparent px-2.5 py-2 text-left transition-all hover:-translate-y-0.5 hover:border-border/60 hover:bg-background hover:shadow-soft"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted text-base">🧠</span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold text-foreground">{q.title}</span>
                  <span className="block text-[11px] text-muted-foreground">{q.date} · {q.klass}</span>
                </span>
                <span className={cn("font-display text-sm font-extrabold tabular-nums", tone)}>{q.score}%</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}