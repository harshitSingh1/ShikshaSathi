import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

type Diagnostics = {
  ok: boolean;
  activeAIProvider: "gemini" | "openrouter" | "local";
  providers: {
    gemini: { configured: boolean; ok: boolean; latencyMs: number; error?: string };
    openrouter: { configured: boolean; ok: boolean; latencyMs: number; error?: string };
    elevenlabs: { configured: boolean };
  };
  ts: number;
};

export const Route = createFileRoute("/debug")({
  head: () => ({ meta: [{ title: "Diagnostics — ShikshaSathi" }] }),
  component: DebugPage,
});

function Dot({ ok }: { ok: boolean }) {
  return (
    <span
      className="inline-block h-2.5 w-2.5 rounded-full"
      style={{ background: ok ? "#22c55e" : "#ef4444" }}
    />
  );
}

function Row({ label, ok, info }: { label: string; ok: boolean; info?: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/50 py-3">
      <div className="flex items-center gap-3">
        <Dot ok={ok} />
        <span className="font-medium">{label}</span>
      </div>
      <span className="text-sm text-muted-foreground">{info ?? (ok ? "OK" : "Unavailable")}</span>
    </div>
  );
}

function DebugPage() {
  const [diag, setDiag] = useState<Diagnostics | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastClient, setLastClient] = useState<{ provider?: string; voice?: string; reason?: string }>({});

  const load = async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/public/health/diagnostics");
      setDiag(await r.json());
    } catch {
      setDiag(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    try {
      setLastClient({
        provider: localStorage.getItem("ss-last-ai-provider") ?? undefined,
        voice: localStorage.getItem("ss-last-voice-provider") ?? undefined,
        reason: localStorage.getItem("ss-last-fallback-reason") ?? undefined,
      });
    } catch {/* noop */}
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="mb-2 text-2xl font-bold">Diagnostics</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Live status of AI providers and voice services. Demo never fails — a local emergency
        generator runs when all providers are down.
      </p>

      <div className="rounded-xl border border-border bg-card p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Providers</h2>
          <button
            onClick={load}
            disabled={loading}
            className="rounded-md border border-border px-3 py-1 text-sm hover:bg-muted disabled:opacity-50"
          >
            {loading ? "Checking…" : "Re-check"}
          </button>
        </div>

        {diag ? (
          <>
            <Row
              label="Gemini (Google)"
              ok={diag.providers.gemini.ok}
              info={
                diag.providers.gemini.configured
                  ? `${diag.providers.gemini.ok ? "OK" : diag.providers.gemini.error ?? "Down"} · ${diag.providers.gemini.latencyMs}ms`
                  : "Not configured"
              }
            />
            <Row
              label="OpenRouter (fallback)"
              ok={diag.providers.openrouter.ok}
              info={
                diag.providers.openrouter.configured
                  ? `${diag.providers.openrouter.ok ? "OK" : diag.providers.openrouter.error ?? "Down"} · ${diag.providers.openrouter.latencyMs}ms`
                  : "Not configured (optional)"
              }
            />
            <Row label="Local emergency generator" ok={true} info="Always available" />
            <Row
              label="ElevenLabs (voice)"
              ok={diag.providers.elevenlabs.configured}
              info={diag.providers.elevenlabs.configured ? "Configured" : "Not configured — using browser TTS"}
            />
            <Row label="Browser SpeechSynthesis" ok={true} info="Always available" />

            <div className="mt-5 rounded-lg bg-muted/40 p-4 text-sm">
              <div><strong>Active AI provider:</strong> {diag.activeAIProvider}</div>
              <div><strong>Last used (client):</strong> {lastClient.provider ?? "—"}</div>
              <div>
                <strong>Active voice:</strong>{" "}
                {lastClient.voice ?? (diag.providers.elevenlabs.configured ? "elevenlabs" : "browser")}
              </div>
              <div><strong>Last fallback reason:</strong> {lastClient.reason ?? "—"}</div>
            </div>
          </>
        ) : (
          <p className="py-6 text-sm text-muted-foreground">{loading ? "Loading…" : "No data."}</p>
        )}
      </div>
    </div>
  );
}
