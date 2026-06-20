import {
  Activity,
  AlertTriangle,
  ClipboardList,
  Languages,
  Lightbulb,
  MicOff,
  Sparkles,
  Wand2,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useVoice } from "../voice-context";

const SHORTCUTS: { label: string; prompt: string; icon: LucideIcon }[] = [
  { label: "Explain Photosynthesis", prompt: "Explain photosynthesis to Class 6 students", icon: Sparkles },
  { label: "Create Quiz", prompt: "Generate a quiz on the water cycle for Class 5", icon: ClipboardList },
  { label: "Generate Activity", prompt: "Create a 10 minute group activity about the solar system for Class 4", icon: Wand2 },
  { label: "Translate to Hindi", prompt: "Translate 'The sun gives us energy' to Hindi for Class 3", icon: Languages },
  { label: "Summarize Lesson", prompt: "Summarize the Indian freedom movement for Class 8", icon: Lightbulb },
  { label: "Show Timeline", prompt: "Show a timeline of major events in the Indian independence movement", icon: Activity },
];

export function VoiceShortcutsCard() {
  const { sendText, sttSupported, voiceError } = useVoice();

  return (
    <section className="rounded-3xl border border-border/60 bg-card p-4 shadow-soft">
      <header className="mb-3 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
          <Zap className="h-3.5 w-3.5" />
        </span>
        <h4 className="text-sm font-bold tracking-tight text-foreground">Voice Shortcuts</h4>
      </header>

      {!sttSupported && (
        <ErrorCard
          icon={MicOff}
          title="Voice input unavailable"
          message="Your browser doesn't support speech recognition — try Chrome. Buttons below still work."
        />
      )}
      {voiceError && (
        <ErrorCard
          icon={AlertTriangle}
          title={
            voiceError.kind === "mic_denied"
              ? "Microphone blocked"
              : voiceError.kind === "tts_failed"
                ? "Voice generation failed"
                : voiceError.kind === "stt_failed"
                  ? "Speech recognition failed"
                  : "Network error"
          }
          message={voiceError.message}
        />
      )}

      <div className="grid grid-cols-2 gap-1.5">
        {SHORTCUTS.map((s) => (
          <button
            key={s.label}
            onClick={() => sendText(s.prompt)}
            className="group flex items-start gap-2 rounded-2xl border border-border/60 bg-background p-2.5 text-left text-[11px] font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
          >
            <span className="grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary group-hover:bg-gradient-primary group-hover:text-white">
              <s.icon className="h-3 w-3" />
            </span>
            <span className="leading-tight">{s.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function ErrorCard({ icon: Icon, title, message }: { icon: LucideIcon; title: string; message: string }) {
  return (
    <div className="mb-3 flex items-start gap-2 rounded-2xl border border-destructive/30 bg-destructive/5 p-2.5">
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-destructive/15 text-destructive">
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0">
        <div className="text-xs font-bold text-foreground">{title}</div>
        <div className="text-[11px] text-muted-foreground">{message}</div>
      </div>
    </div>
  );
}