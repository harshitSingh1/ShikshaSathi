import { ChevronDown, ClipboardList, GraduationCap, History } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMode } from "./mode-context";
import { useVoice } from "./voice-context";
import { QuizHistoryCard } from "./quiz/QuizHistoryCard";
import { SessionMemoryCard } from "./ai-engine/AIUnderstandingEngine";

type Primary = {
  label: string;
  helper: string;
  icon: LucideIcon;
  prompt: string;
  onSelect: (ctx: ReturnType<typeof useMode>) => void;
};

const PRIMARY: Primary[] = [
  {
    label: "Teach a Lesson",
    helper: "Explain any topic to class 1-12",
    icon: GraduationCap,
    prompt: "Teach a short lesson on the topic I will tell you next.",
    onSelect: (m) => m.setMode("teaching"),
  },
  {
    label: "Practice Quiz",
    helper: "MCQs on the current lesson",
    icon: ClipboardList,
    prompt: "Generate practice question quiz on this topic.",
    onSelect: (m) => m.enterQuiz(),
  },
];

export function LeftPanel() {
  const modeCtx = useMode();
  const { sendText } = useVoice();

  return (
    <aside className="flex h-full flex-col gap-3 overflow-y-auto pr-1">
      <div className="mb-1 px-1">
        <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
          What would you like to do?
        </h2>
      </div>
      <div className="flex flex-col gap-2">
        {PRIMARY.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              p.onSelect(modeCtx);
              void sendText(p.prompt);
            }}
            className={cn(
              "group flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3.5 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card",
            )}
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-primary text-white shadow-glow">
              <p.icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate font-display text-sm font-extrabold text-foreground">{p.label}</span>
              <span className="block truncate text-[11px] font-medium text-muted-foreground">{p.helper}</span>
            </span>
            <span className="text-muted-foreground transition-transform group-hover:translate-x-0.5">→</span>
          </button>
        ))}
      </div>

      <details className="group mt-2 rounded-2xl border border-border/60 bg-card shadow-soft">
        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-2xl px-3.5 py-3 text-sm font-bold text-foreground">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-muted text-muted-foreground">
            <History className="h-3.5 w-3.5" />
          </span>
          <span className="flex-1">Classroom History</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
        </summary>
        <div className="flex flex-col gap-3 border-t border-border/60 p-3">
          <QuizHistoryCard />
          <SessionMemoryCard />
        </div>
      </details>
    </aside>
  );
}
