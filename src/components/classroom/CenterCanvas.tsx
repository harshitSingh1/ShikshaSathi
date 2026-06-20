import { useState } from "react";
import { Layers, Play, Presentation as PresentationIcon, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { StreamingOverlay } from "./StreamingOverlay";
import { EmptyState } from "./EmptyState";
import { THEME_META, type LessonTheme } from "./lesson-theme";
import {
  ActivityCard,
  ConceptCard,
  ExamplesCard,
  HookCard,
  KeyPointsCard,
  MistakesCard,
  SubtopicsCard,
  SummaryCard,
  TeacherFlowCard,
  VisualFlowCard,
  WhyMattersCard,
} from "./lesson-cards";
import { useTeachingEngine } from "./ai-engine/teaching-engine-context";
import { useMode } from "./mode-context";
import { QuizExperience } from "./quiz/QuizExperience";
import { NarrateButton } from "./NarrateButton";

const TOPIC_EMOJI: Record<string, string> = {
  nature: "🌱",
  science: "🔬",
  history: "📜",
  math: "🧮",
  language: "📖",
  default: "🎓",
};

const FALLBACK_KEY_EMOJI = ["✨", "💡", "🔍", "📌", "🌟", "🎯", "🧠", "✅"];

export function CenterCanvas({ presentation }: { presentation: boolean }) {
  const [theme, setTheme] = useState<LessonTheme>("nature");
  const [smartBoard, setSmartBoard] = useState(false);
  const { mode, enterQuiz } = useMode();
  const quizActive = mode === "quiz";
  const { response, classroomContext, updateClassroomContext } = useTeachingEngine();
  const activeTheme = normalizeTheme((response?.theme ?? classroomContext.theme) as string | null) ?? theme;
  const hasLesson = !!response?.lesson;

  return (
    <div
      data-theme={activeTheme}
      data-presentation={presentation ? "on" : "off"}
      className={cn(
        "relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-border/60 bg-card shadow-card",
        presentation && "rounded-3xl text-[1.05rem] [&_h1]:tracking-tight [&_h2]:text-2xl",
      )}
    >
      <CanvasHeader
        theme={activeTheme}
        onTheme={(nextTheme) => {
          setTheme(nextTheme);
          updateClassroomContext({ theme: nextTheme });
        }}
        quizActive={quizActive}
        presentation={presentation}
        smartBoard={smartBoard}
        onSmartBoard={() => setSmartBoard((s) => !s)}
      />
      <div className="relative flex-1 overflow-y-auto bg-gradient-hero p-6 sm:p-8">
        {quizActive ? (
          <QuizExperience big={presentation} />
        ) : hasLesson ? (
          smartBoard ? (
            <SmartBoard response={response!} onStartQuiz={enterQuiz} />
          ) : (
            <ActiveLesson big={presentation} response={response!} />
          )
        ) : (
          <EmptyState />
        )}
        <StreamingOverlay />
      </div>
    </div>
  );
}

function normalizeTheme(theme: string | null): LessonTheme | null {
  if (theme === "science" || theme === "nature" || theme === "math" || theme === "history") return theme;
  return null;
}

function CanvasHeader({
  theme,
  onTheme,
  quizActive,
  presentation,
  smartBoard,
  onSmartBoard,
}: {
  theme: LessonTheme;
  onTheme: (t: LessonTheme) => void;
  quizActive: boolean;
  presentation: boolean;
  smartBoard: boolean;
  onSmartBoard: () => void;
}) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/60 bg-card/80 px-4 py-2.5 backdrop-blur sm:px-5">
      <div className="flex min-w-0 items-center gap-3">
        {!presentation && (
          <span className="hidden gap-1.5 sm:flex">
            <i className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
            <i className="h-2.5 w-2.5 rounded-full bg-accent/80" />
            <i className="h-2.5 w-2.5 rounded-full bg-success/80" />
          </span>
        )}
        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-theme text-white">
          <Layers className="h-3.5 w-3.5" />
        </span>
        <span className="truncate text-xs font-bold uppercase tracking-[0.18em] text-foreground">
          {quizActive ? "Live Quiz Studio" : smartBoard ? "Smart Board Mode" : "Visual Learning Studio"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <NarrateButton size={presentation ? "lg" : "sm"} />
        {!quizActive && (
          <button
            onClick={onSmartBoard}
            className={cn(
              "inline-flex h-9 items-center gap-1.5 rounded-full border px-3 text-[11px] font-bold uppercase tracking-wider transition-colors",
              smartBoard
                ? "border-primary/40 bg-primary text-primary-foreground"
                : "border-border bg-background text-muted-foreground hover:text-foreground",
            )}
          >
            <PresentationIcon className="h-3.5 w-3.5" /> Smart Board
          </button>
        )}
        {!presentation && (
          <details className="relative hidden md:block">
            <summary className="flex h-9 cursor-pointer list-none items-center gap-1.5 rounded-full border border-border bg-background px-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-foreground">
              Theme
            </summary>
            <div className="absolute right-0 z-20 mt-2 flex items-center gap-1 rounded-2xl border border-border bg-card p-1 shadow-card">
              {(Object.keys(THEME_META) as LessonTheme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => onTheme(t)}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider transition-colors",
                    theme === t
                      ? "bg-gradient-theme text-white shadow-glow"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                  data-theme={t}
                  style={theme === t ? undefined : { backgroundImage: "none" }}
                >
                  {THEME_META[t].label}
                </button>
              ))}
            </div>
          </details>
        )}
        <button
          onClick={() => window.dispatchEvent(new CustomEvent("ss:toggle-presentation"))}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-primary px-3.5 text-xs font-bold uppercase tracking-wider text-white shadow-glow transition-transform hover:-translate-y-0.5"
        >
          {presentation ? (
            <>
              <X className="h-3.5 w-3.5" /> Exit Presentation
            </>
          ) : (
            <>
              <Play className="h-3.5 w-3.5" /> Present Lesson
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ActiveLesson({
  big,
  response,
}: {
  big: boolean;
  response: NonNullable<ReturnType<typeof useTeachingEngine>["response"]>;
}) {
  const lesson = response.lesson!;
  const emoji = TOPIC_EMOJI[response.theme] ?? TOPIC_EMOJI.default;
  const keyPoints = (lesson.keyPoints ?? []).map((text, i) => ({
    emoji: FALLBACK_KEY_EMOJI[i % FALLBACK_KEY_EMOJI.length],
    text,
  }));
  const visualSteps = (response.visual?.steps ?? []).map((s) => ({
    emoji: s.icon || "•",
    title: s.label,
    subtitle: "",
  }));
  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-6 animate-fade-in">
      <LessonBanner
        big={big}
        emoji={emoji}
        title={response.topic}
        grade={response.grade}
        language={response.language}
        subject={response.subject}
      />
      {lesson.hook && <HookCard text={lesson.hook} big={big} delay={60} />}
      <ConceptCard emoji={emoji} title={response.topic} body={lesson.concept} big={big} delay={120} />
      {lesson.whyItMatters && <WhyMattersCard text={lesson.whyItMatters} big={big} delay={180} />}
      {keyPoints.length > 0 && <KeyPointsCard points={keyPoints} big={big} delay={240} />}
      {lesson.subtopics && lesson.subtopics.length > 0 && (
        <SubtopicsCard items={lesson.subtopics} big={big} delay={300} />
      )}
      {visualSteps.length > 0 && <VisualFlowCard steps={visualSteps} big={big} delay={360} />}
      {lesson.examples && lesson.examples.length > 0 && (
        <ExamplesCard items={lesson.examples} big={big} delay={420} />
      )}
      {lesson.mistakes && lesson.mistakes.length > 0 && (
        <MistakesCard items={lesson.mistakes} big={big} delay={480} />
      )}
      {(lesson.activity || lesson.classroomQuestion) && (
        <ActivityCard
          activity={lesson.activity}
          question={lesson.classroomQuestion}
          big={big}
          delay={540}
        />
      )}
      {(lesson.teacherScript || lesson.studentQuestions?.length || lesson.expectedAnswers?.length) && (
        <TeacherFlowCard
          script={lesson.teacherScript}
          questions={lesson.studentQuestions}
          answers={lesson.expectedAnswers}
          big={big}
          delay={600}
        />
      )}
      {lesson.summary && <SummaryCard text={lesson.summary} big={big} delay={660} />}
    </div>
  );
}

/* ===================== Smart Board Mode ===================== */

function SmartBoard({
  response,
  onStartQuiz,
}: {
  response: NonNullable<ReturnType<typeof useTeachingEngine>["response"]>;
  onStartQuiz: () => void;
}) {
  const lesson = response.lesson!;
  const emoji = TOPIC_EMOJI[response.theme] ?? TOPIC_EMOJI.default;
  const points = (lesson.keyPoints ?? []).slice(0, 4);
  const steps = response.visual?.steps ?? [];
  return (
    <div className="mx-auto flex h-full max-w-6xl flex-col gap-4 animate-fade-in">
      <div className="rounded-3xl bg-gradient-theme p-6 text-white shadow-float">
        <div className="flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white/20 text-4xl backdrop-blur">
            {emoji}
          </span>
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/85">
              Class {response.grade} · {response.subject}
            </div>
            <h1 className="truncate font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
              {response.topic}
            </h1>
          </div>
          <button
            onClick={onStartQuiz}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-white px-6 text-sm font-extrabold uppercase tracking-wider text-foreground shadow-glow transition-transform hover:-translate-y-0.5"
          >
            <Sparkles className="h-4 w-4" /> Start Quiz
          </button>
        </div>
      </div>
      <div className="grid flex-1 grid-cols-1 gap-4 lg:grid-cols-2">
        <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-card">
          <h2 className="mb-2 font-display text-sm font-extrabold uppercase tracking-[0.18em] text-primary">
            Main Concept
          </h2>
          <p className="font-edu text-lg leading-relaxed text-foreground/85">{lesson.concept}</p>
          {points.length > 0 && (
            <>
              <h3 className="mt-5 mb-2 font-display text-xs font-extrabold uppercase tracking-[0.16em] text-secondary">
                Key Points
              </h3>
              <ul className="space-y-2">
                {points.map((p, i) => (
                  <li key={i} className="flex gap-3 rounded-xl bg-background p-3">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gradient-theme text-xs font-extrabold text-white">
                      {i + 1}
                    </span>
                    <span className="font-edu text-base text-foreground/85">{p}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>
        <section className="rounded-3xl border border-border/60 bg-card p-6 shadow-card">
          <h2 className="mb-3 font-display text-sm font-extrabold uppercase tracking-[0.18em] text-primary">
            {response.visual?.title || "Diagram"}
          </h2>
          <div className="flex flex-col items-center gap-2">
            {steps.map((s, i) => (
              <div key={i} className="flex w-full flex-col items-center gap-2">
                <div className="flex w-full max-w-sm items-center gap-3 rounded-2xl border border-border/60 bg-background p-3 shadow-soft">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-theme text-2xl text-white shadow-glow">
                    {s.icon || "•"}
                  </span>
                  <span className="font-display text-base font-extrabold text-foreground">{s.label}</span>
                </div>
                {i < steps.length - 1 && <span className="text-xl text-primary/70">↓</span>}
              </div>
            ))}
          </div>
          {lesson.activity && (
            <div className="mt-5 rounded-2xl border border-secondary/30 bg-secondary/5 p-4">
              <div className="mb-1 text-[11px] font-bold uppercase tracking-wider text-secondary">
                Quick Activity
              </div>
              <p className="font-edu text-sm text-foreground/85">{lesson.activity}</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function LessonBanner({
  big,
  emoji,
  title,
  grade,
  language,
  subject,
}: {
  big: boolean;
  emoji: string;
  title: string;
  grade: string;
  language: string;
  subject: string;
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border-0 bg-gradient-theme p-6 text-white shadow-float sm:p-7">
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/15 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
      <div className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-5">
        <div className="flex min-w-0 items-start gap-4">
          <span
            className={cn(
              "grid shrink-0 place-items-center rounded-3xl bg-white/20 backdrop-blur",
              big ? "h-20 w-20 text-5xl" : "h-16 w-16 text-4xl",
            )}
          >
            {emoji}
          </span>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/85">
              <Sparkles className="h-3.5 w-3.5" /> AI Teaching Mode
            </div>
            <h1
              className={cn(
                "mt-1 truncate font-display font-extrabold tracking-tight",
                big ? "text-5xl sm:text-6xl" : "text-3xl sm:text-4xl",
              )}
            >
              {title}
            </h1>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {grade && <Pill>Class {grade}</Pill>}
              {language && <Pill>{language}</Pill>}
              {subject && <Pill>{subject}</Pill>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full bg-white/20 px-2.5 py-1 text-[11px] font-bold backdrop-blur">{children}</span>
  );
}
