import { createServerFn } from "@tanstack/react-start";

const DEFAULT_VOICE = "EXAVITQu4vr4xnSDxMaL"; // Sarah — warm, teacherly

type StyleKey = "teacher" | "friendly" | "energetic";

// Per-style voice tuning — different prosody, not just labels.
const STYLE_TUNING: Record<StyleKey, { stability: number; similarity: number; style: number }> = {
  teacher: { stability: 0.62, similarity: 0.8, style: 0.28 },   // calm, confident, classroom-warm
  friendly: { stability: 0.45, similarity: 0.75, style: 0.5 },  // conversational, lighter
  energetic: { stability: 0.28, similarity: 0.72, style: 0.78 },// expressive, high-energy
};

export const synthesizeSpeech = createServerFn({ method: "POST" })
  .inputValidator(
    (d: {
      text: string;
      voiceId?: string;
      speed?: number;
      style?: StyleKey | number;
      language?: "English" | "Hindi" | "Hinglish";
    }) => d,
  )
  .handler(async ({ data }) => {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      // No key — let client fall back to browser TTS.
      return { audio: "", mime: "audio/mpeg", fallback: true as const, error: "NO_KEY" };
    }
    const text = (data.text || "").slice(0, 2400).trim();
    if (!text) return { audio: "", mime: "audio/mpeg", fallback: true as const, error: "EMPTY" };
    const voiceId = data.voiceId || DEFAULT_VOICE;
    const styleKey: StyleKey | undefined =
      typeof data.style === "string" ? data.style : undefined;
    const tuning = styleKey ? STYLE_TUNING[styleKey] : null;
    const styleVal = tuning ? tuning.style : typeof data.style === "number" ? data.style : 0.35;
    const stability = tuning ? tuning.stability : 0.5;
    const similarity = tuning ? tuning.similarity : 0.78;
    // Use multilingual model for Hindi/Hinglish (turbo v2.5 has weaker non-English prosody).
    const isMultilingual = data.language === "Hindi" || data.language === "Hinglish";
    const modelId = isMultilingual ? "eleven_multilingual_v2" : "eleven_turbo_v2_5";
    const res = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: {
            stability,
            similarity_boost: similarity,
            style: styleVal,
            use_speaker_boost: true,
            speed: Math.min(1.2, Math.max(0.7, data.speed ?? 1.0)),
          },
        }),
      },
    );
    if (!res.ok) {
      const body = await res.text();
      const isQuota = /quota_exceeded/i.test(body) || res.status === 401 || res.status === 402 || res.status === 429;
      // Never throw — let the client fall back to browser SpeechSynthesis.
      return {
        audio: "",
        mime: "audio/mpeg",
        fallback: true as const,
        error: isQuota ? "QUOTA_EXCEEDED" : `TTS_${res.status}`,
      };
    }
    const buf = await res.arrayBuffer();
    const audio = Buffer.from(buf).toString("base64");
    return { audio, mime: "audio/mpeg", fallback: false as const };
  });