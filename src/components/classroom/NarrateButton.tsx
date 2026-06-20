import { Pause, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNarration } from "./narration-context";

export function NarrateButton({
  size = "sm",
  className,
}: {
  size?: "sm" | "lg";
  className?: string;
}) {
  const { isNarrating, toggle, segments } = useNarration();
  const disabled = segments.length === 0;
  const isLarge = size === "lg";
  return (
    <button
      onClick={toggle}
      disabled={disabled}
      aria-pressed={isNarrating}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-bold uppercase tracking-wider transition-all",
        isLarge
          ? "h-11 px-5 text-sm"
          : "h-8 px-3 text-xs",
        isNarrating
          ? "bg-destructive text-white shadow-glow animate-soft-pulse"
          : "bg-gradient-primary text-white shadow-glow hover:-translate-y-0.5",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {isNarrating ? (
        <>
          <Pause className={cn(isLarge ? "h-4 w-4" : "h-3.5 w-3.5")} />
          Stop Narration
        </>
      ) : (
        <>
          <Volume2 className={cn(isLarge ? "h-4 w-4" : "h-3.5 w-3.5")} />
          Narrate
        </>
      )}
    </button>
  );
}

export function NowSpeakingBadge() {
  const { isNarrating, currentSegment, segmentIndex, segments } = useNarration();
  if (!isNarrating || !currentSegment) return null;
  return (
    <div className="pointer-events-none fixed left-1/2 top-4 z-40 -translate-x-1/2 animate-fade-in">
      <div className="flex items-center gap-2 rounded-full border border-primary/40 bg-card/95 px-4 py-1.5 shadow-float backdrop-blur">
        <span className="relative grid h-2 w-2">
          <span className="absolute inset-0 animate-ping rounded-full bg-destructive/60" />
          <span className="relative h-2 w-2 rounded-full bg-destructive" />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
          Now Speaking
        </span>
        <span className="text-xs font-extrabold text-foreground">
          {currentSegment.label}
        </span>
        <span className="text-[10px] font-bold text-muted-foreground">
          {segmentIndex + 1}/{segments.length}
        </span>
      </div>
    </div>
  );
}
