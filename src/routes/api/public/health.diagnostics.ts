import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";

import { createGeminiProvider, DEFAULT_TEXT_MODEL } from "@/lib/ai/gateway.server";

async function pingGemini() {
  const t0 = Date.now();
  if (!process.env.GOOGLE_API_KEY) return { configured: false, ok: false, latencyMs: 0, error: "GOOGLE_API_KEY missing" };
  try {
    const model = createGeminiProvider()(DEFAULT_TEXT_MODEL);
    await generateText({ model, prompt: "Say: pong" });
    return { configured: true, ok: true, latencyMs: Date.now() - t0 };
  } catch (err) {
    return { configured: true, ok: false, latencyMs: Date.now() - t0, error: (err as Error).message?.slice(0, 200) };
  }
}

async function pingOpenRouter() {
  const t0 = Date.now();
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) return { configured: false, ok: false, latencyMs: 0, error: "OPENROUTER_API_KEY missing" };
  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemma-3-4b-it:free",
        messages: [{ role: "user", content: "pong" }],
        max_tokens: 5,
      }),
    });
    return { configured: true, ok: res.ok, latencyMs: Date.now() - t0, error: res.ok ? undefined : `HTTP ${res.status}` };
  } catch (err) {
    return { configured: true, ok: false, latencyMs: Date.now() - t0, error: (err as Error).message?.slice(0, 200) };
  }
}

function checkEleven() {
  return { configured: Boolean(process.env.ELEVENLABS_API_KEY) };
}

export const Route = createFileRoute("/api/public/health/diagnostics")({
  server: {
    handlers: {
      GET: async () => {
        const [gemini, openrouter] = await Promise.all([pingGemini(), pingOpenRouter()]);
        const elevenlabs = checkEleven();
        const activeAIProvider = gemini.ok ? "gemini" : openrouter.ok ? "openrouter" : "local";
        return Response.json({
          ok: true,
          activeAIProvider,
          providers: { gemini, openrouter, elevenlabs },
          ts: Date.now(),
        });
      },
    },
  },
});
