import { Brain, CheckCircle2 } from "lucide-react";
import { useVoice } from "./voice-context";
import { useTeachingEngine } from "./ai-engine/teaching-engine-context";

export function IntentCard() {
  const { intent } = useVoice();
  const { classroomContext } = useTeachingEngine();
  const hasContext = !!classroomContext.topic;
  const active = hasContext;
  if (!hasContext) {
    return (
      <section className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-4 shadow-soft">
        <header className="mb-2 flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
            <Brain className="h-3.5 w-3.5" />
          </span>
          <h4 className="text-sm font-bold tracking-tight text-foreground">AI Understanding</h4>
        </header>
        <p className="text-xs text-muted-foreground">Awaiting first command.</p>
      </section>
    );
  }
  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card p-4 shadow-card">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-60" />
      <div className="relative">
        <header className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-primary text-white shadow-glow">
              <Brain className="h-3.5 w-3.5" />
            </span>
            <h4 className="text-sm font-bold tracking-tight text-foreground">AI Understanding</h4>
          </div>
          {active && (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
              <CheckCircle2 className="h-3 w-3" /> Parsed
            </span>
          )}
        </header>

        <Row label="Detected Intent" value={intent.intent} />
        <Row label="Action" value={intent.action} />

        <div className="mt-3 rounded-2xl border border-border/60 bg-background/80 p-3 backdrop-blur">
          <div className="mb-1.5 flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <span>Confidence</span>
            <span className="text-primary">{intent.confidence}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-gradient-primary transition-all duration-700"
              style={{ width: `${intent.confidence}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/40 py-1.5 last:border-0">
      <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-bold text-foreground">{value}</span>
    </div>
  );
}