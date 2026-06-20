import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useServerFn } from "@tanstack/react-start";

import { synthesizeSpeech } from "@/lib/ai/voice.functions";
import { useMode } from "./mode-context";
import { useTeachingEngine } from "./ai-engine/teaching-engine-context";
import type { TeachingResponse } from "@/lib/ai/schema";

export type VoiceState = "ready" | "listening" | "thinking" | "speaking";

export type VoiceCommand = { id: string; label: string; intent: string; at: number };

export type DetectedIntent = {
  transcript: string;
  intent: string;
  topic: string;
  klass: string;
  language: string;
  action: string;
  confidence: number;
};

type StreamPhase = "idle" | "understanding" | "generating" | "streaming" | "visualizing" | "done";

export type VoiceMessage = {
  id: string;
  role: "teacher" | "ai";
  text: string;
  at: number;
  intent?: string;
};

export type VoiceSpeed = "slow" | "normal" | "fast";
export type VoiceLanguage = "English" | "Hindi" | "Hinglish";
export type VoiceStyle = "teacher" | "friendly" | "energetic";
export type VoiceGender = "female" | "male";

export type VoiceSettings = {
  speed: VoiceSpeed;
  language: VoiceLanguage;
  style: VoiceStyle;
  gender: VoiceGender;
  voiceId: string;
  grade: string;
};

export type VoiceError = { kind: "mic_denied" | "stt_failed" | "tts_failed" | "network"; message: string } | null;

const VOICE_MATRIX: Record<VoiceGender, Record<VoiceStyle, string>> = {
  female: {
    teacher: "EXAVITQu4vr4xnSDxMaL",
    friendly: "XrExE9yKIg1WjnnlVkGX",
    energetic: "FGY2WhTYpPnrIDTdsKH5",
  },
  male: {
    teacher: "JBFqnCBsd6RMkjVDRZzb",
    friendly: "nPczCjzI2devNBz1zQrb",
    energetic: "TX3LPaxmHKxFdv7VOQHJ",
  },
};

function resolveVoiceId(g: VoiceGender, s: VoiceStyle) {
  return VOICE_MATRIX[g][s];
}

const TTS_CACHE = new Map<string, string>();
const TTS_CACHE_MAX = 80;
function cacheKey(t: string, v: string, st: VoiceStyle, sp: VoiceSpeed, l: VoiceLanguage) {
  return `${v}|${st}|${sp}|${l}|${t}`;
}
function cacheGet(k: string) {
  return TTS_CACHE.get(k);
}
function cacheSet(k: string, v: string) {
  if (TTS_CACHE.size >= TTS_CACHE_MAX) {
    const first = TTS_CACHE.keys().next().value;
    if (first) TTS_CACHE.delete(first);
  }
  TTS_CACHE.set(k, v);
}

const SPEED_VALUES: Record<VoiceSpeed, number> = { slow: 0.85, normal: 1.0, fast: 1.15 };
const TTS_LANG: Record<VoiceLanguage, string> = { English: "en-IN", Hindi: "hi-IN", Hinglish: "en-IN" };
const STT_LANG: Record<VoiceLanguage, string> = { English: "en-IN", Hindi: "hi-IN", Hinglish: "en-IN" };

function speakWithBrowser(text: string, language: VoiceLanguage, rate: number, onDone: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return onDone();
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = TTS_LANG[language] || "en-IN";
    u.rate = rate;
    u.onend = onDone;
    u.onerror = onDone;
    window.speechSynthesis.speak(u);
  } catch {
    onDone();
  }
}

type Ctx = {
  state: VoiceState;
  setState: (s: VoiceState) => void;
  startDemo: (transcript?: string) => void;
  cancel: () => void;
  intent: DetectedIntent;
  streamPhase: StreamPhase;
  streamedText: string;
  history: VoiceCommand[];
  pushCommand: (label: string, intent: string) => void;
  interimTranscript: string;
  finalTranscript: string;
  isListening: boolean;
  isSpeaking: boolean;
  audioLevel: number;
  messages: VoiceMessage[];
  settings: VoiceSettings;
  setSettings: (s: Partial<VoiceSettings>) => void;
  startListening: () => Promise<void>;
  stopListening: () => void;
  toggleListening: () => Promise<void>;
  speak: (text: string) => Promise<void>;
  speakUntilDone: (text: string) => Promise<void>;
  interrupt: () => void;
  sendText: (text: string) => Promise<void>;
  sttSupported: boolean;
  voiceError: VoiceError;
};

const DEFAULT_INTENT: DetectedIntent = {
  transcript: "",
  intent: "Ready",
  topic: "",
  klass: "",
  language: "",
  action: "Waiting for teacher",
  confidence: 0,
};

const INTENT_LABELS: Record<TeachingResponse["intent"], { intent: string; action: string }> = {
  teaching: { intent: "Teaching Concept", action: "Preparing lesson" },
  quiz: { intent: "Quiz Generation", action: "Building 5 MCQs" },
};

const VoiceCtx = createContext<Ctx | null>(null);

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<VoiceState>("ready");
  const stateRef = useRef<VoiceState>("ready");
  useEffect(() => {
    stateRef.current = state;
  }, [state]);
  const [intent, setIntent] = useState<DetectedIntent>(DEFAULT_INTENT);
  const [streamPhase, setStreamPhase] = useState<StreamPhase>("idle");
  const [streamedText] = useState("");
  const [history, setHistory] = useState<VoiceCommand[]>([]);

  const [interimTranscript, setInterim] = useState("");
  const [finalTranscript, setFinal] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [settings, setSettingsState] = useState<VoiceSettings>({
    speed: "normal",
    language: "Hinglish",
    style: "teacher",
    gender: "female",
    voiceId: resolveVoiceId("female", "teacher"),
    grade: "Class 6",
  });
  const [voiceError, setVoiceError] = useState<VoiceError>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const ttsFn = useServerFn(synthesizeSpeech);
  const mode = useMode();
  const engine = useTeachingEngine();

  const sttSupported =
    mounted &&
    typeof window !== "undefined" &&
    !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);

  const cancel = useCallback(() => {
    setState("ready");
    setStreamPhase("idle");
    try {
      recognitionRef.current?.stop?.();
    } catch {/* noop */}
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.src = "";
      } catch {/* noop */}
    }
    setIsListening(false);
    setIsSpeaking(false);
    setAudioLevel(0);
    setInterim("");
  }, []);

  const pushCommand = useCallback((label: string, intentName: string) => {
    setHistory((h) => [{ id: crypto.randomUUID(), label, intent: intentName, at: Date.now() }, ...h].slice(0, 8));
  }, []);

  const startDemo = useCallback((_t?: string) => {/* noop in minimal build */}, []);

  const setSettings = useCallback((patch: Partial<VoiceSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...patch };
      const nextGender = patch.gender ?? prev.gender;
      const nextStyle = patch.style ?? prev.style;
      if (patch.style || patch.gender) next.voiceId = resolveVoiceId(nextGender, nextStyle);
      return next;
    });
  }, []);

  const activeResolveRef = useRef<(() => void) | null>(null);
  const interrupt = useCallback(() => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
        audioRef.current.src = "";
      } catch {/* noop */}
    }
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {/* noop */}
    }
    setIsSpeaking(false);
    if (stateRef.current === "speaking") setState("ready");
    const r = activeResolveRef.current;
    activeResolveRef.current = null;
    if (r) r();
  }, []);

  const speak = useCallback(
    async (text: string) => {
      if (!text?.trim()) return;
      try {
        recognitionRef.current?.abort?.();
      } catch {/* noop */}
      setIsListening(false);
      interrupt();
      try {
        const voiceId = settings.voiceId || resolveVoiceId(settings.gender, settings.style);
        const key = cacheKey(text, voiceId, settings.style, settings.speed, settings.language);
        let src = cacheGet(key);
        if (!src) {
          const result = await ttsFn({
            data: {
              text,
              voiceId,
              speed: SPEED_VALUES[settings.speed],
              style: settings.style,
              language: settings.language,
            },
          });
          if ((result as any).fallback || !result.audio) {
            speakWithBrowser(text, settings.language, SPEED_VALUES[settings.speed], () => {
              setIsSpeaking(false);
              setState("ready");
            });
            setIsSpeaking(true);
            setState("speaking");
            return;
          }
          src = `data:${result.mime};base64,${result.audio}`;
          cacheSet(key, src);
        }
        const audio = new Audio(src);
        audioRef.current = audio;
        setIsSpeaking(true);
        setState("speaking");
        audio.onended = () => {
          setIsSpeaking(false);
          setState("ready");
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          setState("ready");
        };
        await audio.play();
      } catch (err) {
        console.warn("TTS failed", err);
        speakWithBrowser(text, settings.language, SPEED_VALUES[settings.speed], () => {
          setIsSpeaking(false);
          setState("ready");
        });
        setIsSpeaking(true);
        setState("speaking");
      }
    },
    [interrupt, settings, ttsFn],
  );

  const speakUntilDone = useCallback(
    (text: string) =>
      new Promise<void>((resolve) => {
        if (!text?.trim()) return resolve();
        try {
          recognitionRef.current?.abort?.();
        } catch {/* noop */}
        setIsListening(false);
        interrupt();
        const finish = () => {
          setIsSpeaking(false);
          setState("ready");
          if (activeResolveRef.current === finish) activeResolveRef.current = null;
          resolve();
        };
        activeResolveRef.current = finish;
        (async () => {
          try {
            const voiceId = settings.voiceId || resolveVoiceId(settings.gender, settings.style);
            const key = cacheKey(text, voiceId, settings.style, settings.speed, settings.language);
            let src = cacheGet(key);
            if (!src) {
              const result = await ttsFn({
                data: {
                  text,
                  voiceId,
                  speed: SPEED_VALUES[settings.speed],
                  style: settings.style,
                  language: settings.language,
                },
              });
              if (activeResolveRef.current !== finish) return;
              if ((result as any).fallback || !result.audio) {
                speakWithBrowser(text, settings.language, SPEED_VALUES[settings.speed], finish);
                setIsSpeaking(true);
                setState("speaking");
                return;
              }
              src = `data:${result.mime};base64,${result.audio}`;
              cacheSet(key, src);
            }
            if (activeResolveRef.current !== finish) return;
            const audio = new Audio(src);
            audioRef.current = audio;
            audio.onended = finish;
            audio.onerror = finish;
            setIsSpeaking(true);
            setState("speaking");
            await audio.play();
          } catch (err) {
            console.warn("TTS failed", err);
            if (activeResolveRef.current !== finish) return;
            speakWithBrowser(text, settings.language, SPEED_VALUES[settings.speed], finish);
            setIsSpeaking(true);
            setState("speaking");
          }
        })();
      }),
    [interrupt, settings, ttsFn],
  );

  const detectLocalIntent = useCallback((t: string): "quiz" | null => {
    return /\b(quiz|mcq|question|test)\b/i.test(t) ? "quiz" : null;
  }, []);

  const buildSpeech = useCallback((res: TeachingResponse, fallback: string): string => {
    if (res.lesson) {
      const kp = res.lesson.keyPoints?.slice(0, 3).join(". ");
      return `${res.lesson.concept}. ${res.lesson.summary} ${kp ? "Key ideas: " + kp + "." : ""}`;
    }
    if (res.quiz?.questions?.length) {
      const q = res.quiz.questions[0];
      return `Here is a quick quiz. ${q.question}`;
    }
    return fallback;
  }, []);

  const pushMessage = useCallback((role: VoiceMessage["role"], text: string, intentName?: string) => {
    setMessages((m) =>
      [...m, { id: crypto.randomUUID(), role, text, at: Date.now(), intent: intentName }].slice(-30),
    );
  }, []);

  const processUtterance = useCallback(
    async (text: string) => {
      if (!text.trim()) return;
      pushMessage("teacher", text);
      pushCommand(text.length > 48 ? text.slice(0, 46) + "…" : text, "Voice");
      setIntent((p) => ({ ...p, transcript: text }));

      const local = detectLocalIntent(text);
      let engineInput = text;
      let engineIntent: TeachingResponse["intent"] | undefined;

      if (local === "quiz") {
        mode.enterQuiz();
        engineIntent = "quiz";
      } else {
        mode.setMode("teaching");
        engineIntent = "teaching";
      }

      setState("thinking");
      const result = await engine.runEngine(engineInput, { intent: engineIntent });
      if (!result) {
        await speak("I could not generate a lesson. Please try again.");
        return;
      }

      const lbl = INTENT_LABELS[result.intent] ?? INTENT_LABELS.teaching;
      setIntent({
        transcript: text,
        intent: lbl.intent,
        action: lbl.action,
        topic: result.topic || "",
        klass: result.grade ? `Class ${result.grade}` : "Class 6",
        language: result.language || "Hinglish",
        confidence: 96,
      });

      if (result.intent === "quiz" && result.quiz?.questions?.length) {
        mode.resetAnswers();
        mode.setQuizPhase("live");
        mode.setQuestionIndex(0);
      }

      const spoken = buildSpeech(result, "Here is what I prepared for you.");
      pushMessage("ai", spoken, result.intent);
      await speak(spoken);
    },
    [buildSpeech, detectLocalIntent, engine, mode, pushCommand, pushMessage, speak],
  );

  const startListening = useCallback(async () => {
    if (!sttSupported) {
      setVoiceError({
        kind: "stt_failed",
        message: "Your browser does not support Speech Recognition. Try Chrome.",
      });
      return;
    }
    setVoiceError(null);
    interrupt();
    setInterim("");
    setFinal("");

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      setVoiceError({ kind: "mic_denied", message: "Microphone access denied." });
      return;
    }

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const rec = new SR();
    rec.lang = STT_LANG[settings.language];
    rec.continuous = true;
    rec.interimResults = true;
    recognitionRef.current = rec;

    let collected = "";
    rec.onresult = (e: any) => {
      let interim = "";
      let finalPiece = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) finalPiece += r[0].transcript;
        else interim += r[0].transcript;
      }
      if (finalPiece) collected += (collected ? " " : "") + finalPiece.trim();
      setInterim(interim);
      setFinal(collected);
      setAudioLevel(Math.min(1, 0.3 + interim.length / 80));
    };
    rec.onerror = (e: any) => {
      if (e.error === "not-allowed" || e.error === "service-not-allowed") {
        setVoiceError({ kind: "mic_denied", message: "Microphone access denied." });
      }
    };
    rec.onend = () => {
      setIsListening(false);
      setAudioLevel(0);
      const text = (collected || "").trim();
      setInterim("");
      if (text) void processUtterance(text);
      else if (stateRef.current === "listening") setState("ready");
    };

    try {
      rec.start();
      setIsListening(true);
      setState("listening");
    } catch (err) {
      setVoiceError({
        kind: "stt_failed",
        message: err instanceof Error ? err.message : "Could not start microphone",
      });
    }
  }, [interrupt, processUtterance, settings.language, sttSupported]);

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop?.();
    } catch {/* noop */}
    setIsListening(false);
  }, []);

  const toggleListening = useCallback(async () => {
    if (stateRef.current === "speaking" || isSpeaking) {
      interrupt();
      return;
    }
    if (stateRef.current === "thinking") return;
    if (isListening) stopListening();
    else await startListening();
  }, [interrupt, isListening, isSpeaking, startListening, stopListening]);

  const sendText = useCallback(async (text: string) => processUtterance(text), [processUtterance]);

  useEffect(
    () => () => {
      try {
        recognitionRef.current?.abort?.();
      } catch {/* noop */}
      if (audioRef.current) {
        try {
          audioRef.current.pause();
        } catch {/* noop */}
      }
    },
    [],
  );

  const value = useMemo<Ctx>(
    () => ({
      state,
      setState,
      startDemo,
      cancel,
      intent,
      streamPhase,
      streamedText,
      history,
      pushCommand,
      interimTranscript,
      finalTranscript,
      isListening,
      isSpeaking,
      audioLevel,
      messages,
      settings,
      setSettings,
      startListening,
      stopListening,
      toggleListening,
      speak,
      speakUntilDone,
      interrupt,
      sendText,
      sttSupported,
      voiceError,
    }),
    [
      state,
      startDemo,
      cancel,
      intent,
      streamPhase,
      streamedText,
      history,
      pushCommand,
      interimTranscript,
      finalTranscript,
      isListening,
      isSpeaking,
      audioLevel,
      messages,
      settings,
      setSettings,
      startListening,
      stopListening,
      toggleListening,
      speak,
      speakUntilDone,
      interrupt,
      sendText,
      sttSupported,
      voiceError,
    ],
  );

  return <VoiceCtx.Provider value={value}>{children}</VoiceCtx.Provider>;
}

export function useVoice() {
  const v = useContext(VoiceCtx);
  if (!v) throw new Error("useVoice must be used inside <VoiceProvider>");
  return v;
}
