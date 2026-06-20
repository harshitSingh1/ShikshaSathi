import { Clock, Sparkles, Eye, Globe2, Users2 } from "lucide-react";
import { SectionHeader } from "@/components/ui-edu/section-header";

const METRICS = [
  { icon: Clock, stat: "10×", label: "Faster lesson prep", desc: "Generate explanations and visuals in seconds, not evenings.", tone: "primary" },
  { icon: Sparkles, stat: "2.4×", label: "Student engagement", desc: "Visual + interactive lessons keep more students participating.", tone: "secondary" },
  { icon: Eye, stat: "100%", label: "Visual learning", desc: "Every concept ships with a diagram, flow or interactive aid.", tone: "accent" },
  { icon: Globe2, stat: "8+", label: "Indian languages", desc: "Hindi, Hinglish, Bengali, Tamil, Telugu, Marathi & more.", tone: "primary" },
  { icon: Users2, stat: "60", label: "Students per room", desc: "Designed for the realities of government school classrooms.", tone: "secondary" },
];

const TONES: Record<string, string> = {
  primary: "bg-gradient-primary",
  secondary: "bg-gradient-cool",
  accent: "bg-gradient-warm",
};

export function Benefits() {
  return (
    <section id="benefits" className="py-20 md:py-28">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-14 px-5 sm:px-8">
        <SectionHeader
          eyebrow="Why teachers love it"
          title="Measurable impact, lesson after lesson"
          description="Built with input from teachers across rural and urban government schools."
        />
        <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3">
          {METRICS.map((m) => (
            <div key={m.label} className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-7 shadow-card hover-lift">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="font-display text-5xl font-extrabold tracking-tight text-foreground">{m.stat}</div>
                  <div className="mt-1 text-base font-bold text-foreground">{m.label}</div>
                </div>
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl text-white shadow-glow ${TONES[m.tone]}`}>
                  <m.icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-sm text-muted-foreground">{m.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}