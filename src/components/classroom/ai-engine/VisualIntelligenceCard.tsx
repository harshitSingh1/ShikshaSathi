import { CheckCircle2, Loader2, Sparkles, Wand2 } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTeachingEngine } from "./teaching-engine-context";

const STEPS = ["Analyzing Concept", "Generating Steps", "Rendering Visual"] as const;

const STATUS_TO_STEP: Record<string, number> = {
  idle: -1,
  understanding: 0,
  analyzing: 0,
  selecting: 1,
  generating: 1,
  visualizing: 2,
  preparing: 2,
  done: 2,
};

export function VisualIntelligenceCard() {
  const { status, response } = useTeachingEngine();
  const visual = response?.visual ?? null;
  const stepIdx = STATUS_TO_STEP[status] ?? -1;
  const isBusy = status !== "idle" && status !== "done" && status !== "error";
  const nodeCount = visual?.steps?.length ?? 0;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card p-4 shadow-card">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-40" />
      <div className="relative">
        <header className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-primary text-white shadow-glow">
              <Wand2 className="h-3.5 w-3.5" />
            </span>
            <h4 className="text-sm font-bold tracking-tight text-foreground">Visual Intelligence</h4>
          </div>
          {isBusy ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
              <Loader2 className="h-3 w-3 animate-spin" /> Generating
            </span>
          ) : visual ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-success">
              <Sparkles className="h-3 w-3" /> Ready
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Idle
            </span>
          )}
        </header>

        {visual ? (
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <Stat label="Title" value={visual.title} wide />
            <Stat label="Steps" value={String(nodeCount)} />
            <Stat label="Theme" value={response?.theme ?? "—"} />
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-border bg-background/60 p-3 text-center">
            <div className="text-sm font-extrabold text-foreground">AI Visual Intelligence Ready</div>
            <div className="mt-0.5 text-[11px] text-muted-foreground">
              Ask a question. The AI will render a simple step-by-step visual.
            </div>
          </div>
        )}

        <div className="mt-3 rounded-2xl border border-border/60 bg-background/80 p-3 backdrop-blur">
          <div className="mb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
            Visual Generation Workflow
          </div>
          <ol className="flex flex-col gap-1">
            {STEPS.map((label, i) => {
              const done = stepIdx > i || (status === "done" && i <= 2);
              const active = stepIdx === i && isBusy;
              return (
                <li
                  key={label}
                  className={cn(
                    "flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors",
                    done && "bg-success/10",
                    active && "bg-primary/10",
                  )}
                >
                  <span
                    className={cn(
                      "grid h-5 w-5 place-items-center rounded-lg text-white text-[10px]",
                      done
                        ? "bg-success"
                        : active
                          ? "bg-gradient-primary animate-soft-pulse"
                          : "bg-muted text-muted-foreground",
                    )}
                  >
                    {done ? <CheckCircle2 className="h-3 w-3" /> : i + 1}
                  </span>
                  <span
                    className={cn(
                      "text-[11px] font-semibold",
                      done ? "text-success" : active ? "text-primary" : "text-foreground/70",
                    )}
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}

function Stat({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={cn("rounded-xl bg-muted/60 px-2.5 py-1.5", wide && "col-span-2")}>
      <div className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate text-sm font-bold text-foreground">{value}</div>
    </div>
  );
}
