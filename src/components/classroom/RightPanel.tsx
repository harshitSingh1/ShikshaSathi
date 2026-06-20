import { ChevronDown, Cpu, Settings2, Sparkles } from "lucide-react";
import { VoiceOrb } from "./VoiceOrb";
import { VoiceWaveform } from "./VoiceWaveform";
import { TranscriptCard } from "./TranscriptCard";
import { IntentCard } from "./IntentCard";
import { CommandHistory } from "./CommandHistory";
import { useVoice } from "./voice-context";
import { useMode } from "./mode-context";
import { useTeachingEngine } from "./ai-engine/teaching-engine-context";
import { QuizNarratorCard } from "./quiz/QuizNarratorCard";
import {
  AIUnderstandingEngine,
  SupportedIntentsCard,
  TopicExtractionCard,
} from "./ai-engine/AIUnderstandingEngine";
import { ConversationTimelineCard } from "./voice/ConversationTimelineCard";
import { VoiceSettingsCard } from "./voice/VoiceSettingsCard";
import { VoiceShortcutsCard } from "./voice/VoiceShortcutsCard";

export function RightPanel() {
  const { mode } = useMode();
  const { response } = useTeachingEngine();
  return (
    <aside className="flex h-full flex-col gap-4 overflow-y-auto pl-1">
      {mode === "quiz" && <QuizNarratorCard />}
      <VoiceCard />
      <TranscriptCard />
      <ConversationTimelineCard />
      {response && <ContextualActions />}

      <Disclosure title="Voice Settings" icon={Settings2}>
        <VoiceShortcutsCard />
        <VoiceSettingsCard />
      </Disclosure>

      <Disclosure title="Advanced AI Insights" icon={Cpu} tone="muted">
        <IntentCard />
        <AIUnderstandingEngine />
        <TopicExtractionCard />
        <SupportedIntentsCard />
        <CommandHistory />
      </Disclosure>
    </aside>
  );
}

function Disclosure({
  title,
  icon: Icon,
  tone = "primary",
  children,
}: {
  title: string;
  icon: typeof Cpu;
  tone?: "primary" | "muted";
  children: React.ReactNode;
}) {
  return (
    <details className="group rounded-3xl border border-border/60 bg-card shadow-soft">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-3xl px-4 py-3 text-sm font-bold text-foreground">
        <span
          className={
            tone === "primary"
              ? "grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary"
              : "grid h-7 w-7 place-items-center rounded-lg bg-muted text-muted-foreground"
          }
        >
          <Icon className="h-3.5 w-3.5" />
        </span>
        <span className="flex-1">{title}</span>
        <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform group-open:rotate-180" />
      </summary>
      <div className="flex flex-col gap-3 border-t border-border/60 p-3">{children}</div>
    </details>
  );
}

function ContextualActions() {
  const { mode } = useMode();
  const { sendText } = useVoice();
  const followUps =
    mode === "quiz"
      ? [
          { label: "Generate new quiz", prompt: "Generate a fresh quiz on this topic." },
          { label: "Back to lesson", prompt: "Explain this concept again in simple Hinglish." },
        ]
      : [{ label: "Generate quiz", prompt: "Generate a 5 question quiz on this topic." }];
  return (
    <section className="rounded-3xl border border-border/60 bg-card p-4 shadow-soft">
      <header className="mb-3 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/30 text-accent-foreground">
          <Sparkles className="h-3.5 w-3.5" />
        </span>
        <h4 className="text-sm font-bold tracking-tight text-foreground">What's next?</h4>
      </header>
      <div className="flex flex-col gap-2">
        {followUps.map((f) => (
          <button
            key={f.label}
            onClick={() => void sendText(f.prompt)}
            className="flex items-center justify-between rounded-2xl border border-border/60 bg-background px-3 py-2.5 text-left text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
          >
            <span>{f.label}</span>
            <span className="text-muted-foreground">→</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function VoiceCard() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-5 text-center shadow-soft">
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-hero" />
      <div className="relative">
        <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Voice Assistant
        </div>
        <VoiceOrb size={150} />
        <div className="mt-3">
          <VoiceWaveform />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Ask any concept in Hinglish — say "quiz" for MCQs</p>
      </div>
    </section>
  );
}
