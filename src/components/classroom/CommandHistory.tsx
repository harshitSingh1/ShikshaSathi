import { useEffect, useState } from "react";
import { History, Play } from "lucide-react";
import { useVoice } from "./voice-context";

function timeAgo(ts: number) {
  const diff = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  return `${Math.floor(diff / 3600)}h ago`;
}

export function CommandHistory() {
  const { history, startDemo } = useVoice();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <section className="rounded-3xl border border-border/60 bg-card p-4 shadow-soft">
      <header className="mb-3 flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-lg bg-secondary/15 text-secondary">
          <History className="h-3.5 w-3.5" />
        </span>
        <h4 className="text-sm font-bold tracking-tight text-foreground">Recent Voice Commands</h4>
      </header>
      {history.length === 0 ? (
        <p className="px-1 py-2 text-xs text-muted-foreground">
          Voice commands you run will appear here.
        </p>
      ) : (
      <ul className="flex flex-col gap-1.5">
        {history.slice(0, 5).map((c) => (
          <li key={c.id}>
            <button
              onClick={() => startDemo(c.label)}
              className="group flex w-full items-center gap-3 rounded-2xl border border-transparent px-2.5 py-2 text-left transition-all hover:-translate-y-0.5 hover:border-border/60 hover:bg-background hover:shadow-soft"
            >
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary group-hover:bg-gradient-primary group-hover:text-white">
                <Play className="h-3.5 w-3.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-foreground">
                  {c.label}
                </span>
                <span className="block text-[11px] text-muted-foreground">
                  {c.intent} · {mounted ? timeAgo(c.at) : "just now"}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
      )}
    </section>
  );
}