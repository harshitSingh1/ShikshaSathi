import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";

import { createGeminiProvider, DEFAULT_TEXT_MODEL, classifyGeminiError } from "@/lib/ai/gateway.server";

export const Route = createFileRoute("/api/public/health/ai")({
  server: {
    handlers: {
      GET: async () => {
        const started = Date.now();
        if (!process.env.GOOGLE_API_KEY) {
          return Response.json(
            { ok: false, code: "MISSING_API_KEY", message: "GOOGLE_API_KEY is not configured" },
            { status: 500 },
          );
        }
        try {
          const model = createGeminiProvider()(DEFAULT_TEXT_MODEL);
          const { text } = await generateText({
            model,
            prompt: "Reply with the single word: pong",
          });
          return Response.json({
            ok: true,
            model: DEFAULT_TEXT_MODEL,
            latencyMs: Date.now() - started,
            sample: (text ?? "").slice(0, 32),
          });
        } catch (err) {
          const info = classifyGeminiError(err);
          return Response.json(
            { ok: false, ...info, latencyMs: Date.now() - started },
            { status: info.code === "MISSING_API_KEY" || info.code === "INVALID_API_KEY" ? 401 : 502 },
          );
        }
      },
    },
  },
});