import { useState } from "react";
import { useTeachingEngine } from "./teaching-engine-context";

/**
 * Temporary developer panel for diagnosing the lesson generation pipeline.
 * Mounted only when ?dev=1 is present in the URL (see classroom.tsx).
 * Shows the per-attempt raw Gemini response, JSON parse status, schema
 * validation, repair stage, retry reason, and final render payload.
 */
export function DevDebugPanel() {
  const { lastDebug, status, error } = useTeachingEngine();
  const [open, setOpen] = useState(true);
  const [tab, setTab] = useState<"summary" | "attempts" | "render">("summary");

  if (!lastDebug && !error) return null;
  const dbg = (lastDebug ?? {}) as any;
  const attempts: any[] = Array.isArray(dbg.attempts) ? dbg.attempts : [];

  return (
    <div className="fixed bottom-4 right-4 z-9999 w-[min(560px,95vw)] max-h-[80vh] overflow-hidden rounded-xl border border-amber-500/40 bg-zinc-950/95 text-zinc-100 shadow-2xl backdrop-blur">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 border-b border-amber-500/30 bg-amber-500/10 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-amber-200"
      >
        <span>🛠 Lesson Pipeline Debug · {status}{dbg.finalStage ? ` · ${dbg.finalStage}` : ""}</span>
        <span>{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="max-h-[72vh] overflow-y-auto">
          <div className="flex gap-1 border-b border-zinc-800 px-3 py-2 text-xs">
            {(["summary", "attempts", "render"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={
                  "rounded px-2 py-1 " +
                  (tab === t ? "bg-amber-500/20 text-amber-200" : "text-zinc-400 hover:text-zinc-200")
                }
              >
                {t}
              </button>
            ))}
          </div>
          <div className="px-3 py-3 text-[11px] leading-relaxed">
            {error && (
              <div className="mb-3 rounded border border-red-500/40 bg-red-500/10 p-2 text-red-200">
                <div className="font-semibold">Thrown error</div>
                <pre className="whitespace-pre-wrap wrap-break-word">{error}</pre>
              </div>
            )}
            {tab === "summary" && (
              <dl className="grid grid-cols-[120px_1fr] gap-y-1">
                <Row label="Requested" value={dbg.requestedAt} />
                <Row label="Input" value={dbg.input} />
                <Row label="Intent" value={dbg.inferredIntent} />
                <Row label="Topic" value={dbg.extractedTopic} />
                <Row label="Hints" value={json(dbg.hints)} />
                <Row label="Attempts" value={String(attempts.length)} />
                <Row label="Repair applied" value={dbg.repairApplied ? `YES (${dbg.repairStage})` : "NO"} />
                <Row label="Final stage" value={dbg.finalStage} />
                <Row label="Retry reason" value={dbg.retryReason ?? "—"} />
              </dl>
            )}
            {tab === "attempts" && (
              <div className="space-y-3">
                {attempts.length === 0 && <div className="text-zinc-500">No attempts recorded.</div>}
                {attempts.map((a, i) => (
                  <details key={i} open={i === 0} className="rounded border border-zinc-800 bg-zinc-900/60">
                    <summary className="cursor-pointer px-2 py-1 text-xs font-semibold text-zinc-200">
                      {a.label} · parse={tag(a.jsonParse)} · schema={tag(a.schemaValidate)}
                      {a.networkError ? " · network-error" : ""}
                    </summary>
                    <div className="space-y-2 px-2 py-2">
                      <Row label="System len" value={a.systemLen} />
                      <Row label="Prompt len" value={a.promptLen} />
                      <Row label="Response bytes" value={a.responseBytes} />
                      {a.networkError && (
                        <Block title="Network error" body={a.networkError} tone="error" />
                      )}
                      {a.jsonParseError && (
                        <Block title="JSON parse error" body={a.jsonParseError} tone="error" />
                      )}
                      {a.schemaFailReason && (
                        <Block title="Schema fail reason" body={a.schemaFailReason} tone="warn" />
                      )}
                      {a.schemaIssues && (
                        <Block title="Schema issues" body={json(a.schemaIssues)} tone="warn" />
                      )}
                      {a.rawResponse !== undefined && (
                        <Block title="Raw Gemini response" body={a.rawResponse || "(empty)"} />
                      )}
                      {a.parsedJson !== undefined && (
                        <Block title="Parsed JSON" body={json(a.parsedJson)} />
                      )}
                    </div>
                  </details>
                ))}
              </div>
            )}
            {tab === "render" && (
              <Block title="Final render payload" body={json(dbg.finalRender)} />
            )}
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

function Block({ title, body, tone }: { title: string; body: string; tone?: "error" | "warn" }) {
  const cls =
    tone === "error"
      ? "border-red-500/40 bg-red-500/10 text-red-100"
      : tone === "warn"
      ? "border-amber-500/40 bg-amber-500/10 text-amber-100"
      : "border-zinc-800 bg-zinc-900/80 text-zinc-100";
  return (
    <div className={`rounded border ${cls} p-2`}>
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-wide opacity-80">{title}</div>
      <pre className="max-h-64 overflow-auto whitespace-pre-wrap wrap-break-word text-[11px] leading-snug">{body}</pre>
    </div>
  );
}

function json(v: unknown): string {
  try {
    return JSON.stringify(v, null, 2);
  } catch {
    return String(v);
  }
}

function tag(s: string): string {
  return s ? s.toUpperCase() : "—";
}