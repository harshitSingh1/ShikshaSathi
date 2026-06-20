import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function QuizTimer({ keyId, total = 20, big = false }: { keyId: string; total?: number; big?: boolean }) {
  const [left, setLeft] = useState(total);
  useEffect(() => {
    setLeft(total);
    const t = window.setInterval(() => {
      setLeft((l) => (l <= 0 ? 0 : l - 1));
    }, 1000);
    return () => window.clearInterval(t);
  }, [keyId, total]);

  const r = 34;
  const c = 2 * Math.PI * r;
  const dash = (left / total) * c;
  const low = left <= 5;
  const size = big ? 110 : 92;
  const mm = String(Math.floor(left / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  return (
    <div
      className={cn(
        "relative shrink-0",
        low && "animate-soft-pulse",
      )}
      style={{ width: size, height: size }}
    >
      <svg viewBox="0 0 80 80" className="h-full w-full -rotate-90">
        <circle cx="40" cy="40" r={r} stroke="var(--muted)" strokeWidth="8" fill="none" />
        <circle
          cx="40"
          cy="40"
          r={r}
          stroke={low ? "var(--destructive)" : "url(#timer-grad)"}
          strokeWidth="8"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${c}`}
          style={{ transition: "stroke-dasharray 0.8s linear" }}
        />
        <defs>
          <linearGradient id="timer-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.52 0.22 277)" />
            <stop offset="100%" stopColor="oklch(0.72 0.13 188)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center">
        <span
          className={cn(
            "font-display font-extrabold tabular-nums",
            big ? "text-2xl" : "text-xl",
            low ? "text-destructive" : "text-foreground",
          )}
        >
          {mm}:{ss}
        </span>
      </div>
    </div>
  );
}