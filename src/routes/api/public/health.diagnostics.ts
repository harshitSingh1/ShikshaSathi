import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";

import { createGeminiProvider, DEFAULT_TEXT_MODEL } from "@/lib/ai/gateway.server";

const PING_TIMEOUT_MS = 5_000;

function timeoutSignal() {
  return AbortSignal.timeout(PING_TIMEOUT_MS);
}

function safeError(error: unknown): string {
  if (error instanceof DOMException && error.name === "TimeoutError") return "Timed out";
  return "Request failed";
}

async function pingGemini() {
  const started = Date.now();
  if (!process.env.GOOGLE_API_KEY) {
    return { configured: false, ok: false, latencyMs: 0, error: "Not configured" };
  }
  try {
    const model = createGeminiProvider()(DEFAULT_TEXT_MODEL);
    await generateText({
      model,
      prompt: "Say: pong",
      abortSignal: timeoutSignal(),
    });
    return { configured: true, ok: true, latencyMs: Date.now() - started };
  } catch (error) {
    return { configured: true, ok: false, latencyMs: Date.now() - started, error: safeError(error) };
  }
}

async function pingOpenRouter() {
  const started = Date.now();
  const key = process.env.OPENROUTER_API_KEY;
  if (!key) {
    return { configured: false, ok: false, latencyMs: 0, error: "Not configured" };
  }
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      signal: timeoutSignal(),
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemma-3-4b-it:free",
        messages: [{ role: "user", content: "pong" }],
        max_tokens: 5,
      }),
    });
    return {
      configured: true,
      ok: response.ok,
      latencyMs: Date.now() - started,
      error: response.ok ? undefined : `HTTP ${response.status}`,
    };
  } catch (error) {
    return { configured: true, ok: false, latencyMs: Date.now() - started, error: safeError(error) };
  }
}

function checkEleven() {
  return { configured: Boolean(process.env.ELEVENLABS_API_KEY) };
}

export const Route = createFileRoute("/api/public/health/diagnostics")({
  server: {
    handlers: {
      GET: async () => {
        if (process.env.NODE_ENV === "production") {
          return Response.json({
            ok: true,
            enabled: false,
            message: "Detailed diagnostics are disabled in production.",
            ts: Date.now(),
          });
        }

        const [gemini, openrouter] = await Promise.all([pingGemini(), pingOpenRouter()]);
        const elevenlabs = checkEleven();
        const activeAIProvider = gemini.ok ? "gemini" : openrouter.ok ? "openrouter" : "local";
        return Response.json({
          ok: true,
          enabled: true,
          activeAIProvider,
          providers: { gemini, openrouter, elevenlabs },
          ts: Date.now(),
        });
      },
    },
  },
});
