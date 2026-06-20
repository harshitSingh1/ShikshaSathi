import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useVoice } from "./voice-context";
import { useTeachingEngine } from "./ai-engine/teaching-engine-context";

export type NarrationSection = "concept" | "keypoints" | "visual" | "summary";

export type NarrationSegment = {
  section: NarrationSection;
  index: number;
  nodeId?: string;
  text: string;
  label: string;
};

type Ctx = {
  isNarrating: boolean;
  segmentIndex: number;
  segments: NarrationSegment[];
  currentSegment: NarrationSegment | null;
  currentSection: NarrationSection | null;
  currentNodeId: string | null;
  visualNodeIndex: number;
  visualNodeCount: number;
  toggle: () => void;
  start: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
};

const NarrationCtx = createContext<Ctx | null>(null);

function buildSegments(response: any): NarrationSegment[] {
  const out: NarrationSegment[] = [];
  const lesson = response?.lesson;
  if (!lesson) return out;
  if (lesson.concept) {
    out.push({
      section: "concept",
      index: 0,
      text: `${response.topic ?? "Today's lesson"}. ${lesson.concept}`,
      label: "Concept",
    });
  }
  (lesson.keyPoints ?? []).forEach((p: string, i: number) => {
    out.push({ section: "keypoints", index: i, text: p, label: `Key Point ${i + 1}` });
  });
  const steps = response?.visual?.steps ?? [];
  steps.forEach((s: { icon: string; label: string }, i: number) => {
    out.push({
      section: "visual",
      index: i,
      nodeId: `step:${i}`,
      text: `Step ${i + 1}. ${s.label}`,
      label: s.label,
    });
  });
  if (lesson.summary) {
    out.push({ section: "summary", index: 0, text: `In summary. ${lesson.summary}`, label: "Summary" });
  }
  return out;
}

export function NarrationProvider({ children }: { children: React.ReactNode }) {
  const voice = useVoice();
  const { response } = useTeachingEngine();

  const segments = useMemo(() => buildSegments(response), [response]);

  const [isNarrating, setIsNarrating] = useState(false);
  const [segmentIndex, setSegmentIndex] = useState(0);
  const runIdRef = useRef(0);
  const indexRef = useRef(0);
  useEffect(() => {
    indexRef.current = segmentIndex;
  }, [segmentIndex]);

  const lessonKey = response?.lesson ? `L:${response.topic}-${response.lesson.concept?.slice(0, 30)}` : null;
  useEffect(() => {
    runIdRef.current++;
    setIsNarrating(false);
    setSegmentIndex(0);
    voice.interrupt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonKey]);

  const stop = useCallback(() => {
    runIdRef.current++;
    setIsNarrating(false);
    voice.interrupt();
  }, [voice]);

  const start = useCallback(() => {
    if (!segments.length) return;
    runIdRef.current++;
    const runId = runIdRef.current;
    setIsNarrating(true);
    setSegmentIndex(0);
    (async () => {
      for (let i = 0; i < segments.length; i++) {
        if (runIdRef.current !== runId) return;
        setSegmentIndex(i);
        try {
          await voice.speakUntilDone(segments[i].text);
        } catch {/* noop */}
        if (runIdRef.current !== runId) return;
      }
      if (runIdRef.current === runId) setIsNarrating(false);
    })();
  }, [segments, voice]);

  const toggle = useCallback(() => {
    if (isNarrating) stop();
    else start();
  }, [isNarrating, start, stop]);

  const jump = useCallback(
    (delta: number) => {
      if (!segments.length) return;
      const target = Math.max(0, Math.min(segments.length - 1, indexRef.current + delta));
      runIdRef.current++;
      const runId = runIdRef.current;
      voice.interrupt();
      setIsNarrating(true);
      setSegmentIndex(target);
      (async () => {
        for (let i = target; i < segments.length; i++) {
          if (runIdRef.current !== runId) return;
          setSegmentIndex(i);
          try {
            await voice.speakUntilDone(segments[i].text);
          } catch {/* noop */}
          if (runIdRef.current !== runId) return;
        }
        if (runIdRef.current === runId) setIsNarrating(false);
      })();
    },
    [segments, voice],
  );

  const next = useCallback(() => jump(1), [jump]);
  const prev = useCallback(() => jump(-1), [jump]);

  const currentSegment = segments[segmentIndex] ?? null;
  const visualSegments = segments.filter((s) => s.section === "visual");
  const visualNodeIndex = currentSegment?.section === "visual" ? currentSegment.index : -1;

  const value: Ctx = {
    isNarrating,
    segmentIndex,
    segments,
    currentSegment,
    currentSection: currentSegment?.section ?? null,
    currentNodeId: currentSegment?.nodeId ?? null,
    visualNodeIndex,
    visualNodeCount: visualSegments.length,
    toggle,
    start,
    stop,
    next,
    prev,
  };

  return <NarrationCtx.Provider value={value}>{children}</NarrationCtx.Provider>;
}

export function useNarration() {
  const v = useContext(NarrationCtx);
  if (!v) throw new Error("useNarration must be used inside <NarrationProvider>");
  return v;
}
