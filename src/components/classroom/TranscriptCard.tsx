import { Languages, Mic2, Target, GraduationCap, Radio } from "lucide-react";
import { useVoice } from "./voice-context";
import { useTeachingEngine } from "./ai-engine/teaching-engine-context";

export function TranscriptCard() {
  const { intent, state, interimTranscript, isListening, audioLevel } = useVoice();
  const { classroomContext } = useTeachingEngine();
  const liveText = isListening ? interimTranscript : "";
  const display = liveText || intent.transcript;
  const topic = classroomContext.topic || intent.topic || "—";
  const klass = classroomContext.grade
    ? `Class ${classroomContext.grade}`
    : intent.klass || "—";
  const language = classroomContext.language || intent.language || "—";
  const intentLabel = intent.intent && intent.intent !== "Ready" ? intent.intent : "—";
  return (
    <section className="rounded-3xl border border-border/60 bg-card p-4 shadow-soft">
      <header className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
            <Mic2 className="h-3.5 w-3.5" />
          </span>
          <h4 className="text-sm font-bold tracking-tight text-foreground">Live Classroom Transcript</h4>
        </div>
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
            isListening
              ? "bg-destructive/10 text-destructive"
              : state === "ready"
                ? "bg-muted text-muted-foreground"
                : "bg-success/10 text-success"
          }`}
        >
          {isListening && <Radio className="h-3 w-3 animate-pulse" />}
          {isListening ? "Recording" : state === "ready" ? "Idle" : "Live"}
        </span>
      </header>

      <div className="rounded-2xl border border-border/60 bg-gradient-hero p-3">
        <div className="mb-1 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <span>Teacher</span>
          {isListening && (
            <span className="flex items-end gap-[2px]">
              {[0, 1, 2, 3, 4].map((i) => (
                <span
                  key={i}
                  className="w-[2px] rounded-full bg-destructive transition-all"
                  style={{ height: `${4 + Math.max(0, audioLevel * 14 - i * 2)}px` }}
                />
              ))}
            </span>
          )}
        </div>
        <p className="font-edu text-sm leading-relaxed text-foreground">
          {display ? <>"{display}"{liveText && <span className="text-muted-foreground"> …</span>}</> : <span className="text-muted-foreground">Tap the mic and start teaching…</span>}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <Field icon={<Target className="h-3 w-3" />} label="Intent" value={intentLabel} tone="primary" />
        <Field icon={<GraduationCap className="h-3 w-3" />} label="Class" value={klass.replace("Class ", "")} tone="accent" />
        <Field label="Topic" value={topic} tone="secondary" />
        <Field icon={<Languages className="h-3 w-3" />} label="Language" value={language} tone="muted" />
      </div>
    </section>
  );
}

function Field({
  icon,
  label,
  value,
  tone,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  tone: "primary" | "secondary" | "accent" | "muted";
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/15 text-secondary",
    accent: "bg-accent/25 text-foreground",
    muted: "bg-muted text-foreground",
  } as const;
  return (
    <div className="rounded-xl border border-border/60 bg-background p-2.5">
      <div className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ${tones[tone]}`}>
        {value}
      </span>
    </div>
  );
}