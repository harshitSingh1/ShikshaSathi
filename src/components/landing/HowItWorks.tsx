import { Mic, BrainCircuit, Presentation, Users } from "lucide-react";
import { SectionHeader } from "@/components/ui-edu/section-header";

const STEPS = [
  { n: "01", icon: Mic, title: "Teacher speaks", desc: 'Say "Explain photosynthesis in Hinglish" — naturally, no menus.' },
  { n: "02", icon: BrainCircuit, title: "AI understands", desc: "Parses intent, language and grade level in under a second." },
  { n: "03", icon: Presentation, title: "Visual lesson appears", desc: "Diagrams, flowcharts and key concepts render on the smart board." },
  { n: "04", icon: Users, title: "Students engage", desc: "Quizzes, activities and translations keep every student involved." },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-20 md:py-28">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-14 px-5 sm:px-8">
        <SectionHeader
          eyebrow="How It Works"
          title="From voice to visual lesson in four steps"
          description="A flow designed for classrooms of 40–60 students, not a chat window."
        />

        <div className="relative grid w-full gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* Connector */}
          <div
            className="pointer-events-none absolute left-12 right-12 top-12 hidden h-px bg-[repeating-linear-gradient(90deg,var(--color-border)_0_8px,transparent_8px_16px)] lg:block"
            aria-hidden
          />
          {STEPS.map((s, i) => (
            <div
              key={s.n}
              className="relative flex flex-col gap-4 rounded-3xl border border-border/60 bg-card p-6 shadow-card hover-lift"
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-primary text-white shadow-glow">
                  <s.icon className="h-5 w-5" />
                </span>
                <span className="font-display text-xs font-bold tracking-[0.2em] text-muted-foreground">
                  STEP {s.n}
                </span>
              </div>
              <h3 className="text-xl font-extrabold tracking-tight">{s.title}</h3>
              <p className="text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}