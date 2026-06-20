import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { generateTeachingResponse } from "@/lib/ai/teaching-engine.functions";
import type { TeachingResponse } from "@/lib/ai/schema";

export type EngineHints = {
  grade?: string;
  language?: string;
  intent?: TeachingResponse["intent"];
};

export type ClassroomContextState = {
  topic: string | null;
  subject: string | null;
  grade: string | null;
  language: TeachingResponse["language"] | null;
  theme: TeachingResponse["theme"] | null;
  lesson: TeachingResponse["lesson"] | null;
  visual: TeachingResponse["visual"] | null;
  summary: string | null;
  quiz: TeachingResponse["quiz"] | null;
};

export type EngineStatus =
  | "idle"
  | "understanding"
  | "analyzing"
  | "selecting"
  | "generating"
  | "visualizing"
  | "preparing"
  | "done"
  | "error";

export const ENGINE_STATUS_LABEL: Record<EngineStatus, string> = {
  idle: "Ready",
  understanding: "Understanding request",
  analyzing: "Analyzing topic",
  selecting: "Selecting visualization",
  generating: "Generating content",
  visualizing: "Rendering visual structure",
  preparing: "Preparing classroom experience",
  done: "Ready to teach",
  error: "Using offline teaching mode",
};

type Ctx = {
  status: EngineStatus;
  response: TeachingResponse | null;
  error: string | null;
  classroomContext: ClassroomContextState;
  currentTopic: string | null;
  currentLesson: TeachingResponse["lesson"] | null;
  lastDebug: unknown | null;
  updateClassroomContext: (patch: Partial<ClassroomContextState>) => void;
  runEngine: (input: string, hints?: EngineHints) => Promise<TeachingResponse | null>;
  reset: () => void;
};

const TeachingEngineCtx = createContext<Ctx | null>(null);

const EMPTY: ClassroomContextState = {
  topic: null,
  subject: null,
  grade: null,
  language: null,
  theme: null,
  lesson: null,
  visual: null,
  summary: null,
  quiz: null,
};

const STORAGE_KEY = "ss-global-classroom-context";

function load(): ClassroomContextState {
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? { ...EMPTY, ...JSON.parse(raw) } : EMPTY;
  } catch {
    return EMPTY;
  }
}
function persist(ctx: ClassroomContextState) {
  if (typeof window === "undefined") return;
  try {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(ctx));
  } catch {/* noop */}
}

function ctxToResponse(c: ClassroomContextState, intent: TeachingResponse["intent"]): TeachingResponse | null {
  if (!c.topic) return null;
  return {
    intent,
    topic: c.topic,
    subject: c.subject ?? "General",
    grade: c.grade ?? "6",
    language: c.language ?? "Hinglish",
    theme: c.theme ?? "science",
    visualType: "flowchart",
    lesson: c.lesson,
    visual: c.visual,
    quiz: c.quiz,
  };
}

function merge(prev: ClassroomContextState, r: TeachingResponse): ClassroomContextState {
  const topic = r.topic || prev.topic;
  const topicChanged = !!prev.topic && prev.topic !== topic;
  return {
    topic,
    subject: r.subject || prev.subject,
    grade: r.grade || prev.grade,
    language: r.language || prev.language,
    theme: r.theme || prev.theme,
    lesson: r.lesson ?? (topicChanged ? null : prev.lesson),
    visual: r.visual ?? (topicChanged ? null : prev.visual),
    summary: r.lesson?.summary ?? (topicChanged ? null : prev.summary),
    quiz: r.quiz ?? (topicChanged ? null : prev.quiz),
  };
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function TeachingEngineProvider({ children }: { children: React.ReactNode }) {
  const generate = useServerFn(generateTeachingResponse);
  const [status, setStatus] = useState<EngineStatus>("idle");
  const [classroomContext, setClassroomContext] = useState<ClassroomContextState>(load);
  const ref = useRef(classroomContext);
  const [response, setResponse] = useState<TeachingResponse | null>(() => ctxToResponse(load(), "teaching"));
  const [error, setError] = useState<string | null>(null);
  const [lastDebug, setLastDebug] = useState<unknown | null>(null);

  useEffect(() => {
    ref.current = classroomContext;
    persist(classroomContext);
  }, [classroomContext]);

  const runEngine = useCallback(
    async (input: string, hints?: EngineHints) => {
      setError(null);
      try {
        setStatus("understanding");
        await wait(120);
        setStatus("generating");
        const result = await generate({
          data: {
            input,
            intent: hints?.intent,
            contextTopic: ref.current.topic ?? undefined,
          },
        });
        setStatus("preparing");
        const next = merge(ref.current, result);
        ref.current = next;
        setClassroomContext(next);
        setResponse(ctxToResponse(next, result.intent));
        const meta = (result as any)._meta ?? {};
        setLastDebug({ ok: true, intent: result.intent, topic: result.topic, provider: meta.provider, fallbackReason: meta.fallbackReason });
        if (typeof window !== "undefined") {
          try {
            if (meta.provider) localStorage.setItem("ss-last-ai-provider", String(meta.provider));
            if (meta.fallbackReason) localStorage.setItem("ss-last-fallback-reason", String(meta.fallbackReason));
            else localStorage.removeItem("ss-last-fallback-reason");
          } catch {/* noop */}
        }
        if (meta.provider === "local") setError("Using offline teaching mode");
        setStatus("done");
        return result;
      } catch (err) {
        // Server should never throw (local fallback covers it). Stay silent on edge cases.
        console.warn("Teaching engine unexpected failure", err);
        setLastDebug({ ok: false, error: err instanceof Error ? err.message : "Unknown" });
        setStatus("done");
        return null;
      }
    },
    [generate],
  );

  const updateClassroomContext = useCallback((patch: Partial<ClassroomContextState>) => {
    const next = { ...ref.current, ...patch };
    ref.current = next;
    setClassroomContext(next);
    setResponse(ctxToResponse(next, "teaching"));
  }, []);

  const reset = useCallback(() => {
    setStatus("idle");
    setResponse(null);
    setError(null);
    ref.current = EMPTY;
    setClassroomContext(EMPTY);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      status,
      response,
      error,
      classroomContext,
      currentTopic: classroomContext.topic,
      currentLesson: classroomContext.lesson,
      lastDebug,
      updateClassroomContext,
      runEngine,
      reset,
    }),
    [status, response, error, classroomContext, lastDebug, updateClassroomContext, runEngine, reset],
  );
  return <TeachingEngineCtx.Provider value={value}>{children}</TeachingEngineCtx.Provider>;
}

export function useTeachingEngine() {
  const ctx = useContext(TeachingEngineCtx);
  if (!ctx) throw new Error("useTeachingEngine must be used within TeachingEngineProvider");
  return ctx;
}
