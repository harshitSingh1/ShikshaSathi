import { Mic } from "lucide-react";
import { useVoice } from "./voice-context";
import learningImage from "@/assets/images/learning.png";

const PROMPTS = [
  { emoji: "🌱", text: "Explain Photosynthesis", prompt: "Explain photosynthesis to Class 6 students." },
  { emoji: "💧", text: "Quiz on Water Cycle", prompt: "Generate a quiz on the water cycle for Class 5." },
  { emoji: "🧠", text: "Group Activity", prompt: "Create a 10 minute group activity on the solar system." },
  { emoji: "🔤", text: "Translate Paragraph", prompt: "Translate 'The sun gives us energy' to Hindi for Class 3." },
  { emoji: "📖", text: "Summarize Chapter", prompt: "Summarize the Indian freedom movement for Class 8." },
];

export function EmptyState() {
  const { sendText, toggleListening, sttSupported } = useVoice();
  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center justify-center gap-8 py-10 text-center animate-fade-in">
      <div className="relative w-full max-w-5xl">
  <img
    src={learningImage}
    alt="Learning illustration"
    className="w-full h-auto object-cover transition-transform duration-700 hover:scale-[1.02]"
  />
</div>
      <div>
        <h2 className="font-display text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          What would you like to teach today?
        </h2>
        <p className="mt-2 text-base text-muted-foreground">
          {sttSupported
            ? "Tap the mic and speak in English, हिन्दी or Hinglish or pick a starter below."
            : "Pick a starter prompt to get going."}
        </p>
      </div>
      <div className="grid w-full gap-2 sm:grid-cols-2">
        {PROMPTS.map((p) => (
          <button
            key={p.text}
            onClick={() => void sendText(p.prompt)}
            className="group flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 text-left text-sm font-bold text-foreground shadow-soft transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-card"
          >
            <span className="text-2xl leading-none">{p.emoji}</span>
            <span className="flex-1 truncate">{p.text}</span>
            <span className="text-muted-foreground transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}