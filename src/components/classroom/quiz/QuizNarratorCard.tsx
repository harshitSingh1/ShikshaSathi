import { Mic } from "lucide-react";
import { useMode } from "../mode-context";
import { VoiceWaveform } from "../VoiceWaveform";

export function QuizNarratorCard() {
  const { quizPhase, questionIndex } = useMode();
  const label =
    quizPhase === "setup"
      ? "Preparing Quiz…"
      : quizPhase === "results"
        ? "Reading Results…"
        : `Reading Question ${questionIndex + 1}`;
  const status =
    quizPhase === "live" ? "Listening for Answers…" : quizPhase === "results" ? "Analyzing class performance" : "Awaiting start";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-4 shadow-soft">
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-primary opacity-90" />
      <div className="relative">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.18em] text-white">
          <Mic className="h-3.5 w-3.5" /> AI Teacher Voice
        </div>
        <h4 className="mt-1 font-display text-base font-extrabold text-white">{label}</h4>
        <div className="mt-3 rounded-2xl bg-background p-3">
          <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Quiz Narrator</div>
          <div className="mt-1 text-sm font-semibold text-foreground">{status}</div>
          <div className="mt-2"><VoiceWaveform /></div>
        </div>
      </div>
    </section>
  );
}