import { useCallback, useEffect, useRef, useState } from "react";
import { createContext, useContext, useMemo } from "react";
import type SpeechRecognitionAPI from "codesandbox-cdn/speech-recognition";
import { useServerFn } from "@tanstack/react-start";

import { synthesizeSpeech } from "@/lib/ai/voice.functions";
import { useMode } from "./mode-context";
import { useTeachingEngine } from "./ai-engine/teaching-engine-context";
import type { TeachingResponse, LanguageValue } from "@/lib/ai/schema";

export type VoiceState = "ready" | "listening" | "thinking" | "speaking";

export type VoiceSettings = {
  language: LanguageValue;
  grade: string;
  speed: VoiceSpeed;
  style: VoiceStyle;
  gender: VoiceGender;
  provider: VoiceProvider;
};

export type VoiceMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: number;
  audio?: { url: string; duration: number };
};

export type VoiceSpeed = "slow" | "normal" | "fast";
export type VoiceLanguage = LanguageValue;
export type VoiceStyle = "teacher" | "friendly" | "energetic";
export type VoiceGender = "female" | "male";
export type VoiceProvider = "elevenlabs" | "browser";

type VoiceContextType = {
  state: VoiceState;
  isSupported: boolean;
  settings: VoiceSettings;
  messages: VoiceMessage[];
  intent: { topic: string };
  setSettings: (patch: Partial<VoiceSettings>) => void;
  startListening: () => void;
  stopListening: () => void;
  sendText: (text: string) => Promise<void>;
  clearMessages: () => void;
};

const VoiceCtx = createContext<VoiceContextType | null>(null);

function cacheGet(k: string): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(k) ?? "";
  } catch {
    return "";
  }
}
function cacheSet(k: string, v: string) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(k, v);
  } catch {/* noop */}
}

const SPEED_VALUES: Record<VoiceSpeed, number> = { slow: 0.85, normal: 1.0, fast: 1.15 };
const TTS_LANG: Record<VoiceLanguage, string> = {
  English: "en-IN",
  Hindi: "hi-IN",
  Hinglish: "en-IN",
  Telugu: "te-IN",
  Tamil: "ta-IN",
  Marathi: "mr-IN",
  Bengali: "bn-IN",
  Kannada: "kn-IN",
  Gujarati: "gu-IN",
};
const STT_LANG: Record<VoiceLanguage, string> = {
  English: "en-IN",
  Hindi: "hi-IN",
  Hinglish: "en-IN",
  Telugu: "te-IN",
  Tamil: "ta-IN",
  Marathi: "mr-IN",
  Bengali: "bn-IN",
  Kannada: "kn-IN",
  Gujarati: "gu-IN",
};

function speakWithBrowser(text: string, language: VoiceLanguage, rate: number, onDone: () => void) {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return onDone();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = TTS_LANG[language];
  utterance.rate = rate;
  utterance.onend = onDone;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

async function speakWithElevenLabs(
  text: string,
  gender: VoiceGender,
  style: VoiceStyle,
  speed: VoiceSpeed,
  voice: Parameters<typeof synthesizeSpeech>[0],
): Promise<string> {
  try {
    const resp = await synthesizeSpeech(voice);
    return resp.url ?? "";
  } catch {
    return "";
  }
}

export function VoiceProvider({ children }: { children: React.ReactNode }) {
  const { sendText: sendTextFn } = useVoice();
  const engine = useTeachingEngine();
  const { enterQuiz } = useMode();

  const synthesize = useServerFn(synthesizeSpeech);

  const [state, setState] = useState<VoiceState>("ready");
  const [settings, setSettingsState] = useState<VoiceSettings>({
    language: (cacheGet("voice-language") || "Hinglish") as LanguageValue,
    grade: cacheGet("voice-grade") || "6",
    speed: (cacheGet("voice-speed") || "normal") as VoiceSpeed,
    style: (cacheGet("voice-style") || "friendly") as VoiceStyle,
    gender: (cacheGet("voice-gender") || "female") as VoiceGender,
    provider: (cacheGet("voice-provider") || "browser") as VoiceProvider,
  });
  const [messages, setMessages] = useState<VoiceMessage[]>([]);
  const [intent, setIntent] = useState({ topic: "" });
  const recognitionRef = useRef<SpeechRecognitionAPI | null>(null);

  const isSupported = typeof window !== "undefined" && "webkitSpeechRecognition" in window;

  const setSettings = useCallback((patch: Partial<VoiceSettings>) => {
    setSettingsState((p) => {
      const next = { ...p, ...patch };
      Object.entries(patch).forEach(([k, v]) => {
        if (v) cacheSet(`voice-${k}`, String(v));
      });
      return next;
    });
  }, []);

  const speak = useCallback(
    async (text: string) => {
      setState("speaking");
      return new Promise<void>((resolve) => {
        if (settings.provider === "elevenlabs") {
          void speakWithElevenLabs(text, settings.gender, settings.style, settings.speed, {
            text,
            language: settings.language,
          }).then(() => {
            setState("ready");
            resolve();
          });
        } else {
          speakWithBrowser(text, settings.language, SPEED_VALUES[settings.speed], () => {
            setState("ready");
            resolve();
          });
        }
      });
    },
    [settings, synthesize],
  );

  const sendText = useCallback(
    async (input: string) => {
      if (!input.trim()) return;

      setMessages((m) => [
        ...m,
        { id: `user-${Date.now()}`, role: "user", text: input, timestamp: Date.now() },
      ]);

      const engineIntent =
        /\b(quiz|mcq|question|test)\b/i.test(input) ? ("quiz" as const) : ("teaching" as const);
      if (engineIntent === "teaching") {
        const match = input.match(/(?:explain|teach)\s+(.+?)(?:\s+(?:to|for))?$/i);
        if (match?.[1]) {
          setIntent({ topic: match[1].trim() });
        }
      }

      setState("thinking");
      const result = await engine.runEngine(input, {
        intent: engineIntent,
        grade: settings.grade,
        language: settings.language,
      });
      if (!result) {
        await speak("I could not generate a lesson. Please try again.");
        return;
      }

      const response = result.lesson?.summary || result.quiz?.title || "Classroom content ready.";
      await speak(response);

      setMessages((m) => [
        ...m,
        { id: `assist-${Date.now()}`, role: "assistant", text: response, timestamp: Date.now() },
      ]);
    },
    [engine, settings.grade, settings.language, speak],
  );

  const startListening = useCallback(() => {
    if (!isSupported || state !== "ready") return;

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.lang = STT_LANG[settings.language];
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setState("listening");
    recognition.onresult = (event: any) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      if (event.isFinal) {
        void sendText(transcript.trim());
      }
    };
    recognition.onerror = () => setState("ready");
    recognition.onend = () => setState("ready");

    recognition.start();
    recognitionRef.current = recognition;
  }, [isSupported, state, settings.language, sendText]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setState("ready");
  }, []);

  const clearMessages = useCallback(() => {
    setMessages([]);
  }, []);

  const value = useMemo<VoiceContextType>(
    () => ({
      state,
      isSupported,
      settings,
      messages,
      intent,
      setSettings,
      startListening,
      stopListening,
      sendText,
      clearMessages,
    }),
    [state, isSupported, settings, messages, intent, setSettings, startListening, stopListening, sendText, clearMessages],
  );

  return <VoiceCtx.Provider value={value}>{children}</VoiceCtx.Provider>;
}

export function useVoice(): VoiceContextType {
  const ctx = useContext(VoiceCtx);
  if (!ctx) throw new Error("useVoice must be used within VoiceProvider");
  return ctx;
}
