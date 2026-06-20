import { Brain, Loader2, Sparkles, Wand2 } from "lucide-react";
import { useVoice } from "./voice-context";
import { cn } from "@/lib/utils";

export function StreamingOverlay() {
  const { streamPhase, streamedText, intent } = useVoice();
  if (streamPhase === "idle" || streamPhase === "done") return null;

  return (
    <div className="absolute inset-0 z-10 flex items-start justify-center overflow-y-auto bg-background/80 px-6 pb-10 pt-6 backdrop-blur-md animate-fade-in">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-3xl border border-primary/30 bg-card p-6 shadow-float sm:p-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
              <Sparkles className="h-3.5 w-3.5" /> AI Live Response
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Tag>{intent.klass}</Tag>
              <Tag tone="secondary">{intent.language}</Tag>
              <Tag tone="accent">{intent.topic}</Tag>
            </div>
          </div>

          <Step
            active={["understanding", "generating", "streaming", "visualizing"].includes(streamPhase)}
            done={["generating", "streaming", "visualizing"].includes(streamPhase)}
            icon={Brain}
            label="Understanding the request"
          />
          <Step
            active={["generating", "streaming", "visualizing"].includes(streamPhase)}
            done={["streaming", "visualizing"].includes(streamPhase)}
            icon={Loader2}
            label="Generating educational explanation"
          />

          {(streamPhase === "streaming" || streamPhase === "visualizing") && (
            <div className="mt-5 rounded-2xl border border-border/60 bg-background p-5 shadow-soft">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                ShikshaSathi explains
              </div>
              <p className="font-edu text-lg leading-relaxed text-foreground">
                {streamedText}
                {streamPhase === "streaming" && (
                  <span className="ml-0.5 inline-block h-5 w-[3px] translate-y-1 animate-caret bg-primary align-middle" />
                )}
              </p>
            </div>
          )}

          <Step
            active={streamPhase === "visualizing"}
            done={false}
            icon={Wand2}
            label="Generating classroom visuals"
          />
        </div>
      </div>
    </div>
  );
}

function Step({
  icon: Icon,
  label,
  active,
  done,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  active: boolean;
  done: boolean;
}) {
  if (!active && !done) return null;
  return (
    <div
      className={cn(
        "mt-2 flex items-center gap-3 rounded-2xl border px-4 py-3 transition-all",
        done
          ? "border-success/30 bg-success/5"
          : "border-primary/30 bg-primary/5",
      )}
    >
      <span
        className={cn(
          "grid h-9 w-9 place-items-center rounded-xl text-white shadow-soft",
          done ? "bg-success" : "bg-gradient-primary",
        )}
      >
        <Icon className={cn("h-4 w-4", !done && "animate-spin")} />
      </span>
      <div className="flex-1">
        <div className="text-sm font-bold text-foreground">{label}</div>
        {!done && (
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
            <div className="h-full w-1/2 animate-shimmer rounded-full" />
          </div>
        )}
      </div>
      {done && <span className="text-xs font-bold text-success">DONE</span>}
    </div>
  );
}

function Tag({
  children,
  tone = "primary",
}: {
  children: React.ReactNode;
  tone?: "primary" | "secondary" | "accent";
}) {
  const map = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/15 text-secondary",
    accent: "bg-accent/25 text-foreground",
  } as const;
  return (
    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${map[tone]}`}>{children}</span>
  );
}