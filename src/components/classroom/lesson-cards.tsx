import {
  AlertTriangle,
  Compass,
  GraduationCap,
  HelpCircle,
  Languages,
  Lightbulb,
  ListChecks,
  MessageCircleQuestion,
  PlayCircle,
  Sparkles,
  Target,
  Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NarrateButton } from "./NarrateButton";


/* ===================== Wrapper ===================== */

export function LessonCard({
  children,
  className,
  delay = 0,
  big,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  big?: boolean;
}) {
  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-3xl border border-border/60 bg-card shadow-card animate-slide-up",
        big ? "p-7 sm:p-9" : "p-6 sm:p-7",
        className,
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
}

function CardHeader({
  icon,
  label,
  tone = "primary",
  trailing,
}: {
  icon: React.ReactNode;
  label: string;
  tone?: "primary" | "secondary" | "accent" | "theme";
  trailing?: React.ReactNode;
}) {
  const tones = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-secondary/15 text-secondary",
    accent: "bg-accent/30 text-foreground",
    theme: "bg-gradient-theme text-white shadow-glow",
  } as const;
  return (
    <header className="mb-4 flex items-center justify-between gap-3">
      <div className="flex min-w-0 items-center gap-2.5">
        <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-xl", tones[tone])}>
          {icon}
        </span>
        <h3 className="truncate font-display text-base font-extrabold uppercase tracking-[0.14em] text-foreground">
          {label}
        </h3>
      </div>
      {trailing}
    </header>
  );
}

/* ===================== 1. Concept Card ===================== */

export function ConceptCard({
  title,
  body,
  emoji,
  big,
  delay,
}: {
  title: string;
  body: string;
  emoji: string;
  big?: boolean;
  delay?: number;
}) {
  return (
    <LessonCard delay={delay} big={big}>
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-gradient-theme opacity-15 blur-3xl" />
      <CardHeader
        icon={<Sparkles className="h-4 w-4" />}
        label="Concept"
        tone="theme"
        trailing={<NarrateButton />}
      />
      <div className="flex items-start gap-4">
        <span className={cn("shrink-0 leading-none", big ? "text-7xl" : "text-5xl")}>{emoji}</span>
        <div className="min-w-0">
          <h2
            className={cn(
              "font-display font-extrabold leading-tight tracking-tight text-foreground",
              big ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl",
            )}
          >
            {title}
          </h2>
          <p
            className={cn(
              "mt-3 font-edu text-foreground/85",
              big ? "text-2xl leading-relaxed" : "text-base sm:text-lg leading-relaxed",
            )}
          >
            {body}
          </p>
        </div>
      </div>
    </LessonCard>
  );
}

/* ===================== 2. Key Points Card ===================== */

export function KeyPointsCard({
  points,
  big,
  delay,
}: {
  points: { emoji: string; text: string }[];
  big?: boolean;
  delay?: number;
}) {
  return (
    <LessonCard delay={delay} big={big}>
      <CardHeader icon={<ListChecks className="h-4 w-4" />} label="Key Points" tone="primary" />
      <div className="grid gap-3 sm:grid-cols-2">
        {points.map((p, i) => (
          <div
            key={i}
            className="group relative flex items-start gap-3 overflow-hidden rounded-2xl border border-border/60 bg-background p-4 transition-all hover:-translate-y-0.5 hover:shadow-card"
          >
            <span
              className={cn(
                "grid shrink-0 place-items-center rounded-2xl bg-gradient-theme text-white shadow-glow",
                big ? "h-14 w-14 text-3xl" : "h-12 w-12 text-2xl",
              )}
            >
              {p.emoji}
            </span>
            <p
              className={cn(
                "font-edu font-semibold text-foreground",
                big ? "text-xl leading-snug" : "text-base leading-snug",
              )}
            >
              {p.text}
            </p>
          </div>
        ))}
      </div>
    </LessonCard>
  );
}

/* ===================== 3. Summary Card ===================== */

export function SummaryCard({
  text,
  big,
  delay,
}: {
  text: string;
  big?: boolean;
  delay?: number;
}) {
  return (
    <LessonCard delay={delay} big={big} className="border-0 text-white bg-gradient-theme">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
      <div className="pointer-events-none absolute -left-6 -bottom-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
      <div className="relative">
        <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] backdrop-blur">
          <Sparkles className="h-3.5 w-3.5" /> Quick Summary
        </div>
        <p
          className={cn(
            "font-display font-extrabold leading-tight",
            big ? "text-4xl sm:text-5xl" : "text-2xl sm:text-3xl",
          )}
        >
          {text}
        </p>
      </div>
    </LessonCard>
  );
}

/* ===================== 4. Translation Card ===================== */

export function TranslationCard({
  english,
  hindi,
  big,
  delay,
}: {
  english: string;
  hindi: string;
  big?: boolean;
  delay?: number;
}) {
  return (
    <LessonCard delay={delay} big={big}>
      <CardHeader icon={<Languages className="h-4 w-4" />} label="Bilingual" tone="secondary" />
      <div className="grid gap-3 sm:grid-cols-2">
        <Half flag="EN" label="English" text={english} big={big} />
        <Half flag="हि" label="हिन्दी" text={hindi} tone="warm" big={big} />
      </div>
    </LessonCard>
  );
}

function Half({
  flag,
  label,
  text,
  tone = "cool",
  big,
}: {
  flag: string;
  label: string;
  text: string;
  tone?: "cool" | "warm";
  big?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 p-5",
        tone === "cool" ? "bg-secondary/5" : "bg-accent/15",
      )}
    >
      <div className="mb-2 flex items-center gap-2">
        <span
          className={cn(
            "grid h-7 w-7 place-items-center rounded-lg text-[11px] font-extrabold text-white",
            tone === "cool" ? "bg-secondary" : "bg-gradient-warm",
          )}
        >
          {flag}
        </span>
        <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      </div>
      <p className={cn("font-edu font-semibold text-foreground", big ? "text-2xl leading-snug" : "text-lg leading-snug")}>
        {text}
      </p>
    </div>
  );
}

/* ===================== 5. Fun Fact Card ===================== */

export function FunFactCard({
  fact,
  big,
  delay,
}: {
  fact: string;
  big?: boolean;
  delay?: number;
}) {
  return (
    <LessonCard
      delay={delay}
      big={big}
      className="border-accent/40 bg-gradient-to-br from-accent/25 via-card to-card"
    >
      <div className="flex items-start gap-4">
        <span className={cn("shrink-0 leading-none animate-float", big ? "text-7xl" : "text-5xl")}>
          💡
        </span>
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-foreground">
            <Lightbulb className="h-3.5 w-3.5" /> Did you know?
          </div>
          <p
            className={cn(
              "mt-3 font-edu font-bold text-foreground",
              big ? "text-3xl leading-snug" : "text-xl leading-snug",
            )}
          >
            {fact}
          </p>
        </div>
      </div>
    </LessonCard>
  );
}

/* ===================== 6. Question Card ===================== */

export function QuestionCard({
  question,
  options,
  big,
  delay,
}: {
  question: string;
  options: string[];
  big?: boolean;
  delay?: number;
}) {
  return (
    <LessonCard delay={delay} big={big}>
      <CardHeader
        icon={<HelpCircle className="h-4 w-4" />}
        label="Check Understanding"
        tone="accent"
        trailing={
          <span className="rounded-full bg-success/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider text-success">
            Live Quiz
          </span>
        }
      />
      <p
        className={cn(
          "mb-4 font-display font-extrabold text-foreground",
          big ? "text-3xl sm:text-4xl" : "text-xl sm:text-2xl",
        )}
      >
        {question}
      </p>
      {options.length > 0 ? (
      <div className="grid gap-2.5 sm:grid-cols-2">
        {options.map((o, i) => (
          <button
            key={i}
            className="group flex items-center gap-3 rounded-2xl border border-border bg-background p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
          >
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-muted font-display text-sm font-extrabold text-foreground group-hover:bg-gradient-theme group-hover:text-white">
              {String.fromCharCode(65 + i)}
            </span>
            <span
              className={cn(
                "font-edu font-semibold text-foreground",
                big ? "text-xl" : "text-base",
              )}
            >
              {o}
            </span>
          </button>
        ))}
      </div>
      ) : (
        <p className={cn("text-muted-foreground", big ? "text-lg" : "text-sm")}>
          Discuss this with your class — there's no single right answer.
        </p>
      )}
    </LessonCard>
  );
}

/* ===================== Visual Flow ===================== */

export function VisualFlowCard({
  steps,
  big,
  delay,
}: {
  steps: { emoji: string; title: string; subtitle: string }[];
  big?: boolean;
  delay?: number;
}) {
  return (
    <LessonCard delay={delay} big={big}>
      <CardHeader
        icon={<Wand2 className="h-4 w-4" />}
        label="Visual Diagram"
        tone="theme"
        trailing={<NarrateButton />}
      />
      <div className="flex flex-col items-center gap-3 sm:gap-4">
        {steps.map((s, i) => (
          <div key={s.title} className="flex w-full flex-col items-center gap-3 sm:gap-4">
            <div
              className="flex w-full max-w-md items-center gap-4 rounded-3xl border border-border/60 bg-background p-4 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card sm:p-5 animate-scale-in"
              style={{ animationDelay: `${(delay ?? 0) + i * 120}ms` }}
            >
              <span
                className={cn(
                  "grid place-items-center rounded-2xl bg-gradient-theme text-white shadow-glow",
                  big ? "h-20 w-20 text-4xl" : "h-16 w-16 text-3xl",
                )}
              >
                {s.emoji}
              </span>
              <div className="min-w-0">
                <div
                  className={cn(
                    "font-display font-extrabold text-foreground",
                    big ? "text-2xl" : "text-lg",
                  )}
                >
                  {s.title}
                </div>
                <div className={cn("text-muted-foreground", big ? "text-base" : "text-sm")}>
                  {s.subtitle}
                </div>
              </div>
            </div>
            {i < steps.length - 1 && (
              <span className={cn("leading-none text-primary/70", big ? "text-3xl" : "text-2xl")}>↓</span>
            )}
          </div>
        ))}
      </div>
    </LessonCard>
  );
}
/* ===================== Hook Card ===================== */

export function HookCard({ text, big, delay }: { text: string; big?: boolean; delay?: number }) {
  if (!text) return null;
  return (
    <LessonCard delay={delay} big={big} className="border-accent/40 bg-gradient-to-br from-accent/30 via-card to-card">
      <div className="flex items-start gap-4">
        <span className={cn("shrink-0 leading-none animate-float", big ? "text-6xl" : "text-4xl")}>🎬</span>
        <div className="min-w-0">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-accent px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Hook
          </div>
          <p className={cn("mt-3 font-display font-extrabold text-foreground", big ? "text-3xl leading-snug" : "text-xl leading-snug")}>
            {text}
          </p>
        </div>
      </div>
    </LessonCard>
  );
}

/* ===================== Why It Matters Card ===================== */

export function WhyMattersCard({ text, big, delay }: { text: string; big?: boolean; delay?: number }) {
  if (!text) return null;
  return (
    <LessonCard delay={delay} big={big}>
      <CardHeader icon={<Target className="h-4 w-4" />} label="Why It Matters" tone="secondary" />
      <p className={cn("font-edu text-foreground/85", big ? "text-2xl leading-relaxed" : "text-base sm:text-lg leading-relaxed")}>
        {text}
      </p>
    </LessonCard>
  );
}

/* ===================== Subtopics Card ===================== */

export function SubtopicsCard({
  items,
  big,
  delay,
}: {
  items: { title: string; detail: string }[];
  big?: boolean;
  delay?: number;
}) {
  if (!items?.length) return null;
  return (
    <LessonCard delay={delay} big={big}>
      <CardHeader icon={<Compass className="h-4 w-4" />} label="Key Subtopics" tone="primary" />
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((s, i) => (
          <div key={i} className="rounded-2xl border border-border/60 bg-background p-4">
            <div className={cn("font-display font-extrabold text-foreground", big ? "text-xl" : "text-base")}>
              {s.title}
            </div>
            {s.detail && (
              <p className={cn("mt-1 text-muted-foreground", big ? "text-base" : "text-sm")}>{s.detail}</p>
            )}
          </div>
        ))}
      </div>
    </LessonCard>
  );
}

/* ===================== Examples / Mistakes Card ===================== */

export function ListSectionCard({
  label,
  items,
  tone,
  icon,
  big,
  delay,
}: {
  label: string;
  items: string[];
  tone: "primary" | "secondary" | "accent" | "theme";
  icon: React.ReactNode;
  big?: boolean;
  delay?: number;
}) {
  if (!items?.length) return null;
  return (
    <LessonCard delay={delay} big={big}>
      <CardHeader icon={icon} label={label} tone={tone} />
      <ul className="space-y-2.5">
        {items.map((t, i) => (
          <li key={i} className="flex items-start gap-3 rounded-xl border border-border/40 bg-background p-3">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-muted text-xs font-extrabold text-foreground">
              {i + 1}
            </span>
            <span className={cn("font-edu text-foreground/85", big ? "text-lg leading-snug" : "text-base leading-snug")}>
              {t}
            </span>
          </li>
        ))}
      </ul>
    </LessonCard>
  );
}

export function ExamplesCard(props: { items: string[]; big?: boolean; delay?: number }) {
  return (
    <ListSectionCard
      label="Real-Life Examples"
      tone="primary"
      icon={<Lightbulb className="h-4 w-4" />}
      {...props}
    />
  );
}

export function MistakesCard(props: { items: string[]; big?: boolean; delay?: number }) {
  return (
    <ListSectionCard
      label="Common Mistakes"
      tone="accent"
      icon={<AlertTriangle className="h-4 w-4" />}
      {...props}
    />
  );
}

/* ===================== Activity & Classroom Question ===================== */

export function ActivityCard({
  activity,
  question,
  big,
  delay,
}: {
  activity?: string;
  question?: string;
  big?: boolean;
  delay?: number;
}) {
  if (!activity && !question) return null;
  return (
    <LessonCard delay={delay} big={big} className="bg-gradient-to-br from-secondary/10 via-card to-card">
      <CardHeader icon={<PlayCircle className="h-4 w-4" />} label="Classroom Activity" tone="secondary" />
      {activity && (
        <p className={cn("font-edu text-foreground", big ? "text-xl leading-relaxed" : "text-base leading-relaxed")}>
          {activity}
        </p>
      )}
      {question && (
        <div className="mt-4 rounded-2xl border border-primary/30 bg-primary/5 p-4">
          <div className="mb-1 inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-primary">
            <HelpCircle className="h-3.5 w-3.5" /> Ask the class
          </div>
          <p className={cn("font-display font-extrabold text-foreground", big ? "text-2xl leading-snug" : "text-lg leading-snug")}>
            {question}
          </p>
        </div>
      )}
    </LessonCard>
  );
}

/* ===================== Teacher Flow Card ===================== */

export function TeacherFlowCard({
  script,
  questions,
  answers,
  big,
  delay,
}: {
  script?: string;
  questions?: string[];
  answers?: string[];
  big?: boolean;
  delay?: number;
}) {
  const hasAny = !!script || (questions && questions.length) || (answers && answers.length);
  if (!hasAny) return null;
  return (
    <LessonCard delay={delay} big={big}>
      <CardHeader icon={<GraduationCap className="h-4 w-4" />} label="Teaching Flow" tone="theme" />
      <div className="grid gap-4 lg:grid-cols-3">
        {script && (
          <FlowColumn title="Teacher Script" icon="🎤" tint="primary">
            <pre className={cn("whitespace-pre-wrap font-edu text-foreground/85", big ? "text-base" : "text-sm")}>
              {script}
            </pre>
          </FlowColumn>
        )}
        {questions?.length ? (
          <FlowColumn title="Student Questions" icon="🙋" tint="accent">
            <ol className="list-decimal space-y-2 pl-4">
              {questions.map((q, i) => (
                <li key={i} className={cn("font-edu text-foreground/85", big ? "text-base" : "text-sm")}>{q}</li>
              ))}
            </ol>
          </FlowColumn>
        ) : null}
        {answers?.length ? (
          <FlowColumn title="Expected Answers" icon="✅" tint="secondary">
            <ol className="list-decimal space-y-2 pl-4">
              {answers.map((a, i) => (
                <li key={i} className={cn("font-edu text-foreground/85", big ? "text-base" : "text-sm")}>{a}</li>
              ))}
            </ol>
          </FlowColumn>
        ) : null}
      </div>
    </LessonCard>
  );
}

function FlowColumn({
  title,
  icon,
  tint,
  children,
}: {
  title: string;
  icon: string;
  tint: "primary" | "secondary" | "accent";
  children: React.ReactNode;
}) {
  const tints = {
    primary: "border-primary/30 bg-primary/5",
    secondary: "border-secondary/30 bg-secondary/5",
    accent: "border-accent/40 bg-accent/10",
  } as const;
  return (
    <div className={cn("rounded-2xl border p-4", tints[tint])}>
      <div className="mb-2 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        <span className="text-base">{icon}</span> {title}
      </div>
      {children}
    </div>
  );
}
