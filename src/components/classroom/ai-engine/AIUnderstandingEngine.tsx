import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  Cpu,
  GraduationCap,
  Layers,
  Mic,
  Route,
  Sparkles,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoice } from "../voice-context";
import {
  INTENT_ORDER,
  INTENTS,
  detectIntent,
  type IntentKey,
} from "./intents";

const PIPELINE_STAGES = [
  { id: "voice", label: "Voice Input", icon: Mic, phases: new Set(["listening"]) },
  { id: "intent", label: "Intent Detection", icon: Brain, phases: new Set(["thinking"]) },
  { id: "engine", label: "AI Decision Engine", icon: Cpu, phases: new Set(["thinking"]) },
  { id: "experience", label: "Teaching Experience", icon: GraduationCap, phases: new Set(["speaking"]) },
] as const;

const THINKING_STEPS = [
  "Analyzing classroom context",
  "Determining grade level",
  "Selecting explanation complexity",
  "Choosing visualization",
  "Preparing teaching plan",
];

const DECISION_STEPS = [
  { label: "Input Received", icon: Mic },
  { label: "Intent Detected", icon: Brain },
  { label: "Topic Extracted", icon: BookOpen },
  { label: "Class Level Identified", icon: GraduationCap },
  { label: "Language Selected", icon: Sparkles },
  { label: "Learning Experience Generated", icon: Wand2 },
] as const;

export function AIUnderstandingEngine() {
  const { state, intent, streamPhase } = useVoice();
  const detected: IntentKey = useMemo(() => detectIntent(intent.transcript), [intent.transcript]);
  const def = INTENTS[detected];

  const phaseIndex =
    state === "listening"
      ? 0
      : state === "thinking"
        ? 2
        : state === "speaking"
          ? 4
          : streamPhase === "done"
            ? 5
            : -1;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/30 bg-card p-4 shadow-card">
      <div className="pointer-events-none absolute inset-0 bg-gradient-hero opacity-50" />
      <div className="relative">
        <header className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-primary text-white shadow-glow">
              <Cpu className="h-3.5 w-3.5" />
            </span>
            <h4 className="text-sm font-bold tracking-tight text-foreground">AI Understanding Engine</h4>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
            <Sparkles className="h-3 w-3" /> Live
          </span>
        </header>

        <Pipeline state={state} />
        <DecisionFlow phaseIndex={phaseIndex} />
        <ThinkingState state={state} />
        <RequestRoute def={def} />
      </div>
    </section>
  );
}

function Pipeline({ state }: { state: string }) {
  return (
    <div className="mt-1 grid grid-cols-4 items-center gap-1.5">
      {PIPELINE_STAGES.map((s, i) => {
        const active = s.phases.has(state as never);
        const done = stageDone(state, i);
        return (
          <div key={s.id} className="flex flex-col items-center gap-1">
            <span
              className={cn(
                "grid h-10 w-10 place-items-center rounded-2xl border transition-all",
                done
                  ? "border-success/40 bg-success/10 text-success"
                  : active
                    ? "border-transparent bg-gradient-primary text-white shadow-glow animate-soft-pulse"
                    : "border-border bg-background text-muted-foreground",
              )}
            >
              <s.icon className="h-4 w-4" />
            </span>
            <span className={cn("text-[9px] font-bold uppercase tracking-wider text-center leading-tight", active ? "text-primary" : done ? "text-success" : "text-muted-foreground")}>
              {s.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function stageDone(state: string, idx: number) {
  const map: Record<string, number> = { ready: -1, listening: 0, thinking: 1, speaking: 3 };
  const reached = map[state] ?? -1;
  return reached >= idx && state !== "listening" ? reached > idx || state === "speaking" : false;
}

function DecisionFlow({ phaseIndex }: { phaseIndex: number }) {
  return (
    <div className="mt-4 rounded-2xl border border-border/60 bg-background/80 p-3 backdrop-blur">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        <Layers className="h-3 w-3" /> AI Decision Flow
      </div>
      <ol className="flex flex-col gap-1">
        {DECISION_STEPS.map((s, i) => {
          const done = phaseIndex >= i + 1;
          const active = phaseIndex === i;
          return (
            <li
              key={s.label}
              className={cn(
                "flex items-center gap-2 rounded-xl px-2 py-1.5 transition-colors",
                done && "bg-success/10",
                active && "bg-primary/10",
              )}
            >
              <span
                className={cn(
                  "grid h-6 w-6 place-items-center rounded-lg text-white",
                  done ? "bg-success" : active ? "bg-gradient-primary animate-soft-pulse" : "bg-muted text-muted-foreground",
                )}
              >
                {done ? <CheckCircle2 className="h-3.5 w-3.5" /> : <s.icon className="h-3 w-3" />}
              </span>
              <span className={cn("text-xs font-semibold", done ? "text-success" : active ? "text-primary" : "text-foreground/70")}>
                {s.label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function ThinkingState({ state }: { state: string }) {
  if (state !== "thinking") return null;
  return (
    <div className="mt-3 rounded-2xl border border-primary/30 bg-primary/5 p-3">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-primary">
        <Brain className="h-3 w-3 animate-pulse" /> Analyzing classroom context
      </div>
      <ul className="flex flex-col gap-1 text-xs font-semibold text-foreground/80">
        {THINKING_STEPS.map((t, i) => (
          <li key={t} className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 animate-soft-pulse rounded-full bg-primary" style={{ animationDelay: `${i * 120}ms` }} />
            {t}
          </li>
        ))}
      </ul>
    </div>
  );
}

function RequestRoute({ def }: { def: (typeof INTENTS)[IntentKey] }) {
  return (
    <div className="mt-3 rounded-2xl border border-border/60 bg-card p-3 shadow-soft">
      <div className="mb-2 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
        <Route className="h-3 w-3" /> Current Request Route
      </div>
      <div className="flex items-center justify-between gap-1 text-[11px] font-bold text-foreground">
        <RouteChip label="Teacher" />
        <ArrowRight className="h-3 w-3 text-muted-foreground" />
        <RouteChip label={`${def.label} Agent`} tone="primary" />
        <ArrowRight className="h-3 w-3 text-muted-foreground" />
        <RouteChip label={def.destination} tone="success" />
      </div>
    </div>
  );
}

function RouteChip({ label, tone = "muted" }: { label: string; tone?: "muted" | "primary" | "success" }) {
  const map = {
    muted: "bg-muted text-foreground",
    primary: "bg-gradient-primary text-white shadow-glow",
    success: "bg-success/15 text-success",
  } as const;
  return <span className={cn("truncate rounded-full px-2 py-1", map[tone])}>{label}</span>;
}

// ────────── Topic Extraction ──────────
export function TopicExtractionCard() {
  const { intent } = useVoice();
  const subject = /water|plant|sun|photo|cycle|food|nature/i.test(intent.topic + intent.transcript)
    ? { name: "Science", theme: "Nature Theme" }
    : /math|number|equation/i.test(intent.transcript)
      ? { name: "Math", theme: "Numbers Theme" }
      : { name: "Science", theme: "Nature Theme" };

  return (
    <section className="rounded-3xl border border-border/60 bg-card p-4 shadow-soft">
      <header className="mb-3 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-secondary/15 text-secondary">
          <BookOpen className="h-3.5 w-3.5" />
        </span>
        <h4 className="text-sm font-bold tracking-tight text-foreground">Topic Extraction</h4>
      </header>
      <dl className="grid grid-cols-2 gap-2 text-xs">
        <Field label="Topic" value={intent.topic} />
        <Field label="Class" value={intent.klass.replace("Class ", "")} />
        <Field label="Language" value={intent.language} />
        <Field label="Subject" value={subject.name} />
        <Field label="Theme" value={subject.theme} wide />
      </dl>
      <div className="mt-3 rounded-2xl border border-border/60 bg-background/80 p-2.5">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <span>Topic Confidence</span>
          <span className="text-primary">97%</span>
        </div>
        <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
          <div className="h-full rounded-full bg-gradient-primary" style={{ width: "97%" }} />
        </div>
      </div>
    </section>
  );
}

function Field({ label, value, wide }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={cn("rounded-xl bg-muted/60 px-2.5 py-1.5", wide && "col-span-2")}>
      <dt className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 text-sm font-bold text-foreground">{value}</dd>
    </div>
  );
}

// ────────── Supported Intents + Response Modes ──────────
export function SupportedIntentsCard() {
  const [mode, setMode] = useState<IntentKey>("teaching");
  const def = INTENTS[mode];
  return (
    <section className="rounded-3xl border border-border/60 bg-card p-4 shadow-soft">
      <header className="mb-3 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-accent/30 text-accent-foreground">
          <Wand2 className="h-3.5 w-3.5" />
        </span>
        <h4 className="text-sm font-bold tracking-tight text-foreground">AI Response Modes</h4>
      </header>
      <div className="flex flex-wrap gap-1.5">
        {INTENT_ORDER.map((k) => {
          const I = INTENTS[k];
          const active = mode === k;
          return (
            <button
              key={k}
              onClick={() => setMode(k)}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-all",
                active
                  ? "border-transparent bg-gradient-primary text-white shadow-glow"
                  : "border-border bg-background text-muted-foreground hover:text-foreground",
              )}
            >
              <I.icon className="h-3 w-3" /> {I.label}
            </button>
          );
        })}
      </div>
      <div className="mt-3 rounded-2xl border border-border/60 bg-background p-3">
        <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          <span>Sample Input</span>
          <span className="text-primary">{def.destination}</span>
        </div>
        <div className="mt-1 text-sm font-semibold text-foreground">"{def.sample}"</div>
        <div className="mt-2 flex flex-wrap gap-1">
          {def.produces.map((p) => (
            <span key={p} className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
              {p}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// ────────── Teaching Plan Preview ──────────
export function TeachingPlanCard() {
  const { intent } = useVoice();
  const detected = detectIntent(intent.transcript);
  return (
    <section className="relative overflow-hidden rounded-3xl border-0 bg-gradient-primary p-5 text-white shadow-float">
      <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/85">
            <Sparkles className="mr-1 inline h-3 w-3" /> Lesson Strategy
          </span>
          <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider backdrop-blur">
            AI Plan
          </span>
        </div>
        <h4 className="mt-2 font-display text-lg font-extrabold tracking-tight">Teaching Plan Preview</h4>
        <dl className="mt-3 grid grid-cols-2 gap-2 text-[11px]">
          <PlanField label="Topic" value={intent.topic} />
          <PlanField label="Visual" value="Flowchart" />
          <PlanField label="Style" value={`${intent.klass} Friendly`} />
          <PlanField label="Language" value={intent.language} />
          <PlanField label="Follow-Up" value={detected === "quiz" ? "Activity" : "Quiz"} />
          <PlanField label="Activity" value="Plant Observation" />
        </dl>
      </div>
    </section>
  );
}

function PlanField({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white/15 p-2 backdrop-blur">
      <div className="text-[9px] font-bold uppercase tracking-wider text-white/75">{label}</div>
      <div className="mt-0.5 text-sm font-bold text-white">{value}</div>
    </div>
  );
}

// ────────── Session Memory (left panel) ──────────
export function SessionMemoryCard() {
  const items = [
    { label: "Current Topic", value: "Photosynthesis", emoji: "🌱" },
    { label: "Previous Topic", value: "Water Cycle", emoji: "💧" },
    { label: "Last Quiz", value: "Force & Motion", emoji: "🧠" },
    { label: "Last Activity", value: "Plant Observation", emoji: "🌿" },
  ];
  return (
    <section className="rounded-3xl border border-border/60 bg-card p-4 shadow-soft">
      <header className="mb-3 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
          <Brain className="h-3.5 w-3.5" />
        </span>
        <h4 className="text-sm font-bold tracking-tight text-foreground">Session Memory</h4>
      </header>
      <ul className="flex flex-col gap-1.5">
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background px-2.5 py-2">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-muted text-base">{it.emoji}</span>
            <div className="min-w-0 flex-1">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{it.label}</div>
              <div className="truncate text-sm font-bold text-foreground">{it.value}</div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}