import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";

import { createGeminiProvider, DEFAULT_TEXT_MODEL, classifyGeminiError } from "@/lib/ai/gateway.server";

const HEALTH_TIMEOUT_MS = 5_000;

export const Route = createFileRoute("/api/public/health/ai")({
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

        const started = Date.now();
        if (!process.env.GOOGLE_API_KEY) {
          return Response.json(
            { ok: false, code: "MISSING_API_KEY", message: "Google AI is not configured.", latencyMs: 0 },
            { status: 503 },
          );
        }

        try {
          const model = createGeminiProvider()(DEFAULT_TEXT_MODEL);
          const { text } = await generateText({
            model,
            prompt: "Reply with the single word: pong",
            abortSignal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
          });
          return Response.json({
            ok: true,
            enabled: true,
            model: DEFAULT_TEXT_MODEL,
            latencyMs: Date.now() - started,
            sample: (text ?? "").slice(0, 4),
          });
        } catch (error) {
          const info = classifyGeminiError(error);
          return Response.json(
            {
              ok: false,
              enabled: true,
              code: info.code,
              message: info.code === "NETWORK" ? "Google AI health check failed." : info.message,
              latencyMs: Date.now() - started,
            },
            { status: info.code === "MISSING_API_KEY" || info.code === "INVALID_API_KEY" ? 401 : 502 },
          );
        }
      },
    },
  },
});
