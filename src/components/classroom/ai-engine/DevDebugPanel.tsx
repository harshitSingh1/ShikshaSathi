import { useState } from "react";

import type { TeachingResponse } from "@/lib/ai/schema";
import { useTeachingEngine } from "./teaching-engine-context";

type DebugAttempt = {
  provider: "gemini" | "openrouter" | "local";
  ok: boolean;
  error?: string;
  latencyMs: number;
};

type DebugState = {
  ok?: boolean;
  intent?: string;
  topic?: string;
  provider?: string;
  fallbackReason?: string;
  attempts?: DebugAttempt[];
};

/** Development-only diagnostics for the typed provider fallback contract. */
export function DevDebugPanel() {
  const { lastDebug, status, error, response } = useTeachingEngine();
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState<"summary" | "attempts" | "render">("summary");

  if (!lastDebug && !error) return null;
  const debug = (lastDebug ?? {}) as DebugState;
  const attempts = debug.attempts ?? [];

  return (
    <div className="fixed bottom-4 right-4 z-9999 w-[min(560px,95vw)] max-h-[80vh] overflow-hidden rounded-xl border border-amber-500/40 bg-zinc-950/95 text-zinc-100 shadow-2xl backdrop-blur">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-2 border-b border-amber-500/30 bg-amber-500/10 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-amber-200"
      >
        <span>Lesson Pipeline Debug · {status}</span>
        <span>{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="max-h-[72vh] overflow-y-auto">
          <div className="flex gap-1 border-b border-zinc-800 px-3 py-2 text-xs">
            {(["summary", "attempts", "render"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setTab(item)}
                className={
                  "rounded px-2 py-1 " +
                  (tab === item ? "bg-amber-500/20 text-amber-200" : "text-zinc-400 hover:text-zinc-200")
                }
              >
                {item}
              </button>
            ))}
          </div>
          <div className="px-3 py-3 text-[11px] leading-relaxed">
            {error && (
              <div className="mb-3 rounded border border-red-500/40 bg-red-500/10 p-2 text-red-200">
                <div className="font-semibold">Engine notice</div>
                <pre className="whitespace-pre-wrap wrap-break-word">{error}</pre>
              </div>
            )}
            {tab === "summary" && (
              <dl className="grid grid-cols-[120px_1fr] gap-y-1">
                <Row label="Status" value={debug.ok === false ? "Failed" : "Completed"} />
                <Row label="Intent" value={debug.intent} />
                <Row label="Topic" value={debug.topic} />
                <Row label="Provider" value={debug.provider} />
                <Row label="Fallback reason" value={debug.fallbackReason} />
                <Row label="Attempts" value={attempts.length} />
              </dl>
            )}
            {tab === "attempts" && (
              <div className="space-y-2">
                {attempts.length === 0 && <div className="text-zinc-500">No provider attempts recorded.</div>}
                {attempts.map((attempt, index) => (
                  <div key={`${attempt.provider}-${index}`} className="rounded border border-zinc-800 bg-zinc-900/60 px-2 py-2">
                    <div className="flex items-center justify-between gap-2 font-semibold text-zinc-200">
                      <span>{attempt.provider}</span>
                      <span className={attempt.ok ? "text-emerald-300" : "text-red-300"}>
                        {attempt.ok ? "ok" : "failed"} · {attempt.latencyMs}ms
                      </span>
                    </div>
                    {attempt.error && <div className="mt-1 whitespace-pre-wrap wrap-break-word text-red-200">{attempt.error}</div>}
                  </div>
                ))}
              </div>
            )}
            {tab === "render" && <Block title="Validated render payload" body={json(response)} />}
          </div>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: unknown }) {
  return (
    <>
      <dt className="text-zinc-500">{label}</dt>
      <dd className="wrap-break-word text-zinc-200">{value === undefined || value === null || value === "" ? "—" : String(value)}</dd>
    </>
  );
}

function Block({ title, body }: { title: string; body: string }) {
  return (
    <div className="rounded border border-zinc-800 bg-zinc-900/80 p-2">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide opacity-80">{title}</div>
      <pre className="max-h-64 overflow-auto whitespace-pre-wrap wrap-break-word text-[11px] leading-snug">{body}</pre>
    </div>
  );
}

function json(value: TeachingResponse | null): string {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}
