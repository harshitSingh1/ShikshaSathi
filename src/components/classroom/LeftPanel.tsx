import { useState } from "react";
import { BookOpen, ChevronDown, ClipboardList, GraduationCap, HardDrive, History, Star } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMode } from "./mode-context";
import { useVoice } from "./voice-context";
import { useTeachingEngine } from "./ai-engine/teaching-engine-context";
import { QuizHistoryCard } from "./quiz/QuizHistoryCard";
import { SessionMemoryCard } from "./ai-engine/AIUnderstandingEngine";
import { NCERTNavigator } from "./curriculum/NCERTNavigator";
import { OfflineLibraryModal } from "./OfflineLibraryModal";
import { StarBoardModal } from "./smartboard/StarBoardModal";

type Primary = {
  label: string;
  helper: string;
  icon: LucideIcon;
  onSelect: (ctx: ReturnType<typeof useMode>) => void;
};

const PRIMARY: Primary[] = [
  {
    label: "Teach a Lesson",
    helper: "Explain any topic to class 1-12",
    icon: GraduationCap,
    onSelect: (m) => m.setMode("teaching"),
  },
  {
    label: "Practice Quiz",
    helper: "MCQs on the current lesson",
    icon: ClipboardList,
    onSelect: (m) => m.enterQuiz(),
  },
];

export function LeftPanel() {
  const modeCtx = useMode();
  const { sendText, intent } = useVoice();
  const { loadDirectResponse, currentTopic } = useTeachingEngine();
  const [showOfflineLibrary, setShowOfflineLibrary] = useState(false);
  const [showStarBoard, setShowStarBoard] = useState(false);

  const requestTopic = (label: string) => {
    const topic = intent.topic.trim();
    if (topic) {
      const prompt =
        label === "Practice Quiz"
          ? `Generate a 5-question quiz on "${topic}".`
          : `Explain ${topic} in a classroom-ready lesson.`;
      void sendText(prompt);
      return;
    }

    window.dispatchEvent(
      new CustomEvent("ss:open-type-input", {
        detail: {
          placeholder:
            label === "Practice Quiz"
              ? "Type a topic for your quiz…"
              : "Type the topic you want to teach…",
        },
      }),
    );
  };

  return (
    <aside className="flex h-full flex-col gap-3 overflow-y-auto pr-1">
      <div className="mb-1 px-1">
        <h2 className="font-display text-sm font-extrabold uppercase tracking-[0.16em] text-muted-foreground">
          Classroom Actions
        </h2>
      </div>

      {/* Primary Actions */}
      <div className="flex flex-col gap-2">
        {PRIMARY.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              p.onSelect(modeCtx);
              requestTopic(p.label);
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

        {/* Offline Library Trigger Button */}
        <button
          onClick={() => setShowOfflineLibrary(true)}
          className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <HardDrive className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <span className="block truncate font-display text-xs font-bold text-foreground">
              Offline Library & USB Pack
            </span>
            <span className="block truncate text-[10px] text-muted-foreground">
              Teach saved lessons without internet
            </span>
          </div>
          <span className="text-xs text-muted-foreground transition-transform group-hover:translate-x-0.5">→</span>
        </button>

        {/* Classroom Star Board & Recognition Badges */}
        <button
          onClick={() => setShowStarBoard(true)}
          className="group flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-3 text-left shadow-soft transition-all hover:-translate-y-0.5 hover:border-amber-500/50 hover:shadow-card"
        >
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-500/20 text-amber-600">
            <Star className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <span className="block truncate font-display text-xs font-bold text-foreground">
              Classroom Star Board
            </span>
            <span className="block truncate text-[10px] text-muted-foreground">
              Award participation stars & badges
            </span>
          </div>
          <span className="text-xs text-muted-foreground transition-transform group-hover:translate-x-0.5">→</span>
        </button>
      </div>

      {/* NCERT Syllabus Navigator */}
      <div className="mt-1">
        <NCERTNavigator />
      </div>

      {/* Classroom History Collapsible */}
      <details className="group mt-1 rounded-2xl border border-border/60 bg-card shadow-soft">
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

      {/* Offline Library Modal */}
      {showOfflineLibrary && (
        <OfflineLibraryModal
          onLoadLesson={(data) => {
            loadDirectResponse(data);
          }}
          onClose={() => setShowOfflineLibrary(false)}
        />
      )}

      {/* Star Board Modal */}
      {showStarBoard && (
        <StarBoardModal
          activeTopic={currentTopic}
          onClose={() => setShowStarBoard(false)}
        />
      )}
    </aside>
  );
}
