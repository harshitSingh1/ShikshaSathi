import { Brain, Mic, Sparkles, Waves } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoice, type VoiceState } from "./voice-context";

const COPY: Record<VoiceState, { title: string; sub: string }> = {
  ready: { title: "Ready to Teach", sub: "Tap the orb or say a command" },
  listening: { title: "Listening…", sub: "Speak naturally in any language" },
  thinking: { title: "Thinking…", sub: "Understanding your request" },
  speaking: { title: "Teaching…", sub: "Generating live explanation" },
};

export function VoiceOrb({ size = 160 }: { size?: number }) {
  const { state, toggleListening } = useVoice();
  const copy = COPY[state];
  const Icon = state === "thinking" ? Brain : state === "speaking" ? Waves : Mic;

  const onTap = () => void toggleListening();

  return (
    <div className="flex flex-col items-center gap-3 py-2">
      <button
        onClick={onTap}
        aria-label={copy.title}
        className="group relative grid place-items-center outline-none"
        style={{ width: size + 60, height: size + 60 }}
      >
        {/* outer halo */}
        <span
          className={cn(
            "absolute rounded-full bg-gradient-primary blur-3xl transition-opacity duration-500",
            state === "ready" ? "opacity-20" : "opacity-40",
          )}
          style={{ width: size + 40, height: size + 40 }}
        />

        {/* ripples — listening / speaking */}
        {(state === "listening" || state === "speaking") && (
          <>
            <span
              className="absolute animate-ripple rounded-full border-2 border-primary/40"
              style={{ width: size, height: size }}
            />
            <span
              className="absolute animate-ripple rounded-full border-2 border-secondary/40"
              style={{ width: size, height: size, animationDelay: "0.7s" }}
            />
          </>
        )}

        {/* soft pulse — ready */}
        {state === "ready" && (
          <span
            className="absolute animate-soft-pulse rounded-full"
            style={{ width: size - 20, height: size - 20 }}
          />
        )}

        {/* orbiting particles — thinking */}
        {state === "thinking" && (
          <>
            <span
              className="absolute animate-orbit rounded-full"
              style={{ width: size + 20, height: size + 20 }}
            >
              <span className="absolute left-1/2 top-0 -ml-1.5 h-3 w-3 rounded-full bg-primary shadow-glow" />
              <span className="absolute left-1/2 bottom-0 -ml-1 h-2 w-2 rounded-full bg-secondary" />
            </span>
            <span
              className="absolute animate-orbit-rev rounded-full"
              style={{ width: size + 44, height: size + 44 }}
            >
              <span className="absolute right-0 top-1/2 -mt-1 h-2 w-2 rounded-full bg-accent" />
              <span className="absolute left-0 top-1/3 h-1.5 w-1.5 rounded-full bg-primary/70" />
            </span>
          </>
        )}

        {/* orb body — glass + gradient */}
        <div
          className={cn(
            "relative grid animate-float place-items-center rounded-full text-white transition-transform duration-500",
            state === "listening" && "scale-105",
            state === "speaking" && "scale-110",
          )}
          style={{
            width: size,
            height: size,
            background:
              "radial-gradient(120% 120% at 30% 20%, oklch(0.78 0.13 200 / 0.95), oklch(0.52 0.22 277) 55%, oklch(0.38 0.18 280) 100%)",
            boxShadow:
              "inset 0 12px 36px rgba(255,255,255,0.45), inset 0 -20px 40px oklch(0.38 0.18 280 / 0.6), 0 24px 70px -12px oklch(0.52 0.22 277 / 0.6), 0 0 60px -10px oklch(0.72 0.13 188 / 0.5)",
          }}
        >
          {/* glass highlights */}
          <span className="absolute inset-3 rounded-full border border-white/25" />
          <span
            className="absolute -top-2 left-1/4 h-1/3 w-1/2 rounded-full bg-white/35 blur-md"
            style={{ transform: "rotate(-12deg)" }}
          />
          <span className="absolute bottom-6 right-8 h-2 w-2 rounded-full bg-white/80" />

          <Icon
            className={cn(
              "relative drop-shadow-lg transition-transform",
              state === "listening" && "animate-soft-pulse",
            )}
            style={{ width: size * 0.32, height: size * 0.32 }}
          />
        </div>

        {state === "speaking" && (
          <Sparkles className="absolute -right-1 -top-1 h-5 w-5 text-accent drop-shadow" />
        )}
      </button>

      <div className="text-center">
        <div className="font-display text-lg font-extrabold text-foreground">{copy.title}</div>
        <div className="text-xs text-muted-foreground">{copy.sub}</div>
      </div>
    </div>
  );
}