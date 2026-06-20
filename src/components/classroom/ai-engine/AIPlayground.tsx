import { useState } from "react";
import { ChevronDown, ChevronUp, FlaskConical, Loader2, Mic, Play, Volume2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { ENGINE_STATUS_LABEL, useTeachingEngine } from "./teaching-engine-context";
import { useVoice } from "../voice-context";

const SAMPLES = [
  "Explain photosynthesis",
  "Teach the water cycle",
  "Generate a quiz on the solar system",
];

export function AIPlayground() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState(SAMPLES[0]);
  const { runEngine, status, response, error } = useTeachingEngine();
  const { speak, startListening, isListening, sttSupported } = useVoice();
  const busy = status !== "idle" && status !== "done" && status !== "error";

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[420px] max-w-[calc(100vw-2rem)] rounded-2xl border border-border/60 bg-card/95 backdrop-blur-xl shadow-2xl">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 rounded-2xl px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/15 text-primary">
            <FlaskConical className="h-4 w-4" />
          </div>
          <div>
            <div className="text-sm font-semibold">AI Playground</div>
            <div className="text-[11px] text-muted-foreground">Dev · {ENGINE_STATUS_LABEL[status]}</div>
          </div>
        </div>
        {open ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronUp className="h-4 w-4 text-muted-foreground" />}
      </button>

      {open && (
        <div className="space-y-3 border-t border-border/60 p-4">
          <div className="flex flex-wrap gap-1.5">
            {SAMPLES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setText(s)}
                className="rounded-full border border-border/60 bg-background/60 px-2.5 py-1 text-[10px] text-muted-foreground hover:text-foreground hover:border-primary/40"
              >
                {s.split(" ").slice(0, 3).join(" ")}…
              </button>
            ))}
          </div>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            className="text-xs"
            placeholder="Ask the Teaching Intelligence Engine…"
          />
          <div className="flex items-center justify-between gap-2">
            <div className={cn("text-[11px]", error ? "text-destructive" : "text-muted-foreground")}>
              {error ? error : ENGINE_STATUS_LABEL[status]}
            </div>
            <Button size="sm" disabled={busy || !text.trim()} onClick={() => runEngine(text.trim())}>
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5" />}
              <span className="ml-1.5">Run</span>
            </Button>
          </div>

          {response && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-1.5 text-[10px]">
                <Chip label={`intent: ${response.intent}`} />
                <Chip label={`topic: ${response.topic}`} />
                <Chip label={`grade: ${response.grade}`} />
                <Chip label={`lang: ${response.language}`} />
                <Chip label={`visual: ${response.visualType}`} />
                <Chip label={`theme: ${response.theme}`} />
              </div>
              <pre className="max-h-72 overflow-auto rounded-lg border border-border/60 bg-background/80 p-3 text-[10px] leading-relaxed text-muted-foreground">
                {JSON.stringify(response, null, 2)}
              </pre>
            </div>
          )}

          <div className="rounded-xl border border-dashed border-border/60 p-2">
            <div className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Voice tests
            </div>
            <div className="flex flex-wrap gap-1.5">
              <Button
                size="sm"
                variant="outline"
                onClick={() => speak("Hello! This is ShikshaSathi previewing the voice output.")}
              >
                <Volume2 className="h-3.5 w-3.5" /> <span className="ml-1.5">Test voice</span>
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={!sttSupported || isListening}
                onClick={() => void startListening()}
              >
                <Mic className="h-3.5 w-3.5" />{" "}
                <span className="ml-1.5">{isListening ? "Listening…" : "Test mic"}</span>
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Chip({ label }: { label: string }) {
  return (
    <span className="rounded-full border border-border/60 bg-background/60 px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
      {label}
    </span>
  );
}