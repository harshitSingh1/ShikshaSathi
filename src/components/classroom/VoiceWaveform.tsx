import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { useVoice, type VoiceState } from "./voice-context";

const BAR_COUNT = 28;

const PROFILE: Record<VoiceState, { amp: number; speed: number; opacity: string }> = {
  ready: { amp: 0.15, speed: 2.4, opacity: "opacity-40" },
  listening: { amp: 1, speed: 0.7, opacity: "opacity-100" },
  thinking: { amp: 0.3, speed: 1.8, opacity: "opacity-70" },
  speaking: { amp: 0.95, speed: 0.55, opacity: "opacity-100" },
};

export function VoiceWaveform() {
  const { state, isSpeaking, isListening } = useVoice();
  const profile = PROFILE[state];
  const aiVoice = isSpeaking;
  const teacherVoice = isListening;

  const heights = useMemo(
    () =>
      Array.from({ length: BAR_COUNT }, (_, i) => {
        const center = BAR_COUNT / 2;
        const dist = Math.abs(i - center) / center;
        return 0.35 + (1 - dist) * 0.65;
      }),
    [],
  );

  return (
    <div
      className={cn(
        "flex h-12 items-center justify-center gap-[3px] rounded-2xl bg-muted/40 px-3 transition-opacity",
        profile.opacity,
      )}
      aria-hidden
    >
      {heights.map((h, i) => (
        <span
          key={i}
          className={cn(
            "w-[3px] rounded-full",
            aiVoice
              ? "bg-gradient-to-t from-secondary to-accent"
              : teacherVoice
                ? "bg-gradient-to-t from-destructive to-primary"
                : "bg-gradient-primary",
          )}
          style={{
            height: `${Math.max(8, h * 40 * profile.amp)}px`,
            animation: `ss-wave-bar ${profile.speed}s ease-in-out infinite`,
            animationDelay: `${(i % 7) * 0.08}s`,
            transformOrigin: "center",
          }}
        />
      ))}
    </div>
  );
}