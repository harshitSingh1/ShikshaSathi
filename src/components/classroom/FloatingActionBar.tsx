import { useState } from "react";
import { BookOpen, HelpCircle, House, Keyboard, Mic, Send, Square, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoice } from "./voice-context";
import { useMode } from "./mode-context";

export function FloatingActionBar() {
  const { state, toggleListening, isSpeaking, isListening, sendText } = useVoice();
  const { mode, setMode, enterQuiz, exitQuiz } = useMode();
  const [typing, setTyping] = useState(false);
  const [draft, setDraft] = useState("");
  const active = isListening || isSpeaking || state === "thinking";

  const submitDraft = () => {
    const text = draft.trim();
    if (!text) return;
    void sendText(text);
    setDraft("");
    setTyping(false);
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-5 z-30 flex flex-col items-center gap-3 px-4">
      {typing && (
        <div className="pointer-events-auto w-full max-w-xl rounded-3xl border border-border/60 bg-card/95 p-2 shadow-float backdrop-blur-xl animate-fade-in">
          <div className="flex items-center gap-2 rounded-2xl bg-background px-3">
            <Keyboard className="h-4 w-4 text-muted-foreground" />
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") submitDraft();
                if (e.key === "Escape") setTyping(false);
              }}
              placeholder="Ask ShikshaSathi anything…"
              className="flex-1 bg-transparent py-3 text-sm font-medium text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={submitDraft}
              className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-primary text-white shadow-glow transition-transform hover:-translate-y-0.5"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
            <button
              onClick={() => setTyping(false)}
              className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground hover:bg-muted"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="pointer-events-auto flex items-end gap-2 rounded-[2rem] border border-border/60 bg-card/90 p-2 pl-3 pr-3 shadow-float backdrop-blur-xl">
      <SideButton
  label="Home"
  icon={House}
  onClick={() => {
    window.location.href = "/";
  }}
/>

<SideButton
  label="Lesson"
  icon={BookOpen}
  highlighted={mode === "teaching"}
  onClick={() => {
    if (mode === "quiz") exitQuiz();
    else setMode("teaching");
  }}
/>

<button
  onClick={() => void toggleListening()}
  aria-label={
    isListening
      ? "Stop listening"
      : isSpeaking
        ? "Stop speaking"
        : "Start voice"
  }
  className={cn(
    "relative -mt-6 mx-2 grid h-20 w-20 shrink-0 place-items-center rounded-full text-white transition-transform hover:-translate-y-1"
  )}
  style={{
    background:
      "radial-gradient(120% 120% at 30% 25%, oklch(0.78 0.13 200 / 0.95), oklch(0.52 0.22 277) 55%, oklch(0.38 0.18 280) 100%)",
    boxShadow:
      "inset 0 10px 24px rgba(255,255,255,0.4), 0 18px 50px -10px oklch(0.52 0.22 277 / 0.7), 0 0 40px -10px oklch(0.72 0.13 188 / 0.6)",
  }}
>
  {!active && (
    <span className="absolute inset-0 animate-soft-pulse rounded-full" />
  )}

  {active && (
    <>
      <span className="absolute inset-0 animate-ripple rounded-full border-2 border-white/50" />
      <span
        className="absolute inset-0 animate-ripple rounded-full border-2 border-white/30"
        style={{ animationDelay: "0.6s" }}
      />
    </>
  )}

  {active ? (
    <Square className="relative h-7 w-7" />
  ) : (
    <Mic className="relative h-8 w-8" />
  )}
</button>

<SideButton
  label="Quiz"
  icon={HelpCircle}
  highlighted={mode === "quiz"}
  onClick={() => (mode === "quiz" ? exitQuiz() : enterQuiz())}
/>

<SideButton
  label="Type"
  icon={Keyboard}
  highlighted={typing}
  onClick={() => setTyping((v) => !v)}
/>
      </div>
    </div>
  );
}

function SideButton({
  label,
  icon: Icon,
  onClick,
  highlighted,
}: {
  label: string;
  icon: LucideIcon;
  onClick?: () => void;
  highlighted?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-14 min-w-[70px] flex-col items-center justify-center gap-1 rounded-2xl px-3 text-[10px] font-bold uppercase tracking-wide transition-all duration-200",
        highlighted
          ? "bg-primary/15 text-primary shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
