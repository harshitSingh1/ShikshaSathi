import { useEffect, useRef } from "react";
import { GraduationCap, MessageCircle, Sparkles, Square } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoice } from "../voice-context";

export function ConversationTimelineCard() {
  const { messages, isSpeaking, interrupt, interimTranscript, isListening } = useVoice();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages.length, interimTranscript]);

  return (
    <section className="rounded-3xl border border-border/60 bg-card p-4 shadow-soft">
      <header className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
            <MessageCircle className="h-3.5 w-3.5" />
          </span>
          <h4 className="text-sm font-bold tracking-tight text-foreground">
            Classroom Conversation
          </h4>
        </div>
        {isSpeaking && (
          <button
            onClick={interrupt}
            className="inline-flex items-center gap-1 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive hover:bg-destructive/20"
          >
            <Square className="h-3 w-3" /> Interrupt
          </button>
        )}
      </header>

      <div
        ref={ref}
        className="max-h-72 space-y-2.5 overflow-y-auto rounded-2xl border border-border/60 bg-background/60 p-2"
      >
        {messages.length === 0 && !isListening && (
          <p className="px-2 py-6 text-center text-xs text-muted-foreground">
            Start speaking — your conversation with ShikshaSathi will appear here.
          </p>
        )}
        {messages.map((m) => (
          <Bubble key={m.id} role={m.role} text={m.text} />
        ))}
        {isListening && interimTranscript && (
          <Bubble role="teacher" text={interimTranscript} interim />
        )}
      </div>
    </section>
  );
}

function Bubble({
  role,
  text,
  interim,
}: {
  role: "teacher" | "ai";
  text: string;
  interim?: boolean;
}) {
  const isAi = role === "ai";
  const Icon = isAi ? Sparkles : GraduationCap;
  return (
    <div className={cn("flex gap-2", isAi ? "" : "flex-row-reverse")}>
      <span
        className={cn(
          "grid h-7 w-7 shrink-0 place-items-center rounded-xl",
          isAi ? "bg-gradient-primary text-white" : "bg-accent/30 text-foreground",
        )}
      >
        <Icon className="h-3.5 w-3.5" />
      </span>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-3 py-2 text-xs leading-relaxed",
          isAi
            ? "bg-primary/10 text-foreground"
            : "bg-muted text-foreground",
          interim && "italic opacity-70",
        )}
      >
        <div className="mb-0.5 text-[9px] font-bold uppercase tracking-wider text-muted-foreground">
          {isAi ? "ShikshaSathi" : "Teacher"}
          {interim && " · live"}
        </div>
        {text}
      </div>
    </div>
  );
}