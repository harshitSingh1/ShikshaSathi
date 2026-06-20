import { ChevronDown, Maximize2, Minimize2, User } from "lucide-react";
import { Logo } from "@/components/landing/Logo";
import { EduBadge } from "@/components/ui-edu/badge";
import { EduButton } from "@/components/ui-edu/button";
import { cn } from "@/lib/utils";
import { useTeachingEngine } from "./ai-engine/teaching-engine-context";
import { useVoice } from "./voice-context";

const LANGS = [
  { label: "English", value: "English" as const },
  { label: "हिन्दी", value: "Hindi" as const },
  { label: "Hinglish", value: "Hinglish" as const },
];
const CLASSES = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);

export function TopBar({
  presentation,
  onTogglePresentation,
}: {
  presentation: boolean;
  onTogglePresentation: () => void;
}) {
  const { settings, setSettings } = useVoice();
  const { response } = useTeachingEngine();
  const activeTopic = response?.lesson ? response.topic : null;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between gap-2 px-3 sm:gap-4 sm:px-5 md:grid md:grid-cols-[1fr_auto_1fr]">
        <div className="flex min-w-0 items-center">
          <Logo />
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          {activeTopic && (
            <EduBadge tone="primary" className="h-9 gap-2 rounded-2xl px-4 py-0 text-sm shadow-soft">
              <span className="text-base">📘</span>
              <span className="font-semibold">Now teaching:</span>
              <span className="max-w-56 truncate">{activeTopic}</span>
            </EduBadge>
          )}
        </div>
        <div className="flex items-center justify-end gap-1.5 sm:gap-2">
          <Pill className="hidden sm:flex">
            <select
              value={settings.language}
              onChange={(e) => setSettings({ language: e.target.value as typeof settings.language })}
              className="cursor-pointer bg-transparent pr-1 text-sm font-semibold outline-none"
            >
              {LANGS.map((l) => (
                <option key={l.value} value={l.value}>
                  {l.label}
                </option>
              ))}
            </select>
          </Pill>
          <Pill>
            <select
              value={settings.grade}
              onChange={(e) => setSettings({ grade: e.target.value })}
              className="cursor-pointer bg-transparent pr-1 text-sm font-semibold outline-none"
            >
              {CLASSES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </Pill>
          <EduButton
            size="sm"
            variant={presentation ? "primary" : "secondary"}
            onClick={onTogglePresentation}
            className={cn("h-10", presentation && "shadow-glow")}
            aria-label={presentation ? "Exit Smart Board" : "Smart Board"}
          >
            {presentation ? <Minimize2 /> : <Maximize2 />}
            <span className="hidden md:inline">{presentation ? "Exit Smart Board" : "Smart Board"}</span>
          </EduButton>
          <button
            aria-label="Profile"
            className="hidden h-10 w-10 place-items-center rounded-2xl bg-gradient-primary text-white shadow-soft sm:grid"
          >
            <User className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

function Pill({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex h-10 items-center gap-1 rounded-2xl border border-border bg-card px-2 shadow-soft sm:px-3", className)}>
      {children}
    </div>
  );
}