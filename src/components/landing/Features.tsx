import {
  Mic, ImageIcon, ListChecks, Languages, Gamepad2, Monitor,
} from "lucide-react";
import { FeatureCard } from "@/components/ui-edu/card";
import { SectionHeader } from "@/components/ui-edu/section-header";

const FEATURES = [
  { icon: Mic, title: "Voice-Based Teaching", desc: "Trigger any action with a single sentence. Hands stay on the chalk, eyes on students.", g: "bg-gradient-primary" },
  { icon: ImageIcon, title: "Visual Learning Diagrams", desc: "Auto-generated flowcharts, cycles and concept maps tailored to NCERT topics.", g: "bg-gradient-cool" },
  { icon: ListChecks, title: "Instant Quiz Generation", desc: "From any topic, instantly produce MCQs and short-answers with difficulty controls.", g: "bg-gradient-warm" },
  { icon: Languages, title: "Hinglish Translation", desc: "Switch between English, Hindi and Hinglish mid-lesson without losing context.", g: "bg-gradient-primary" },
  { icon: Gamepad2, title: "Classroom Activities", desc: "Group challenges, rapid-fire rounds and role-plays — designed for 40+ students.", g: "bg-gradient-cool" },
  { icon: Monitor, title: "Smart Board Mode", desc: "High-contrast, large-type layouts that read clearly from the back of the room.", g: "bg-gradient-warm" },
];

export function Features() {
  return (
    <section id="features" className="bg-muted/40 py-20 md:py-28">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-14 px-5 sm:px-8">
        <SectionHeader
          eyebrow="Features"
          title="Everything a classroom actually needs"
          description="Not another chatbot. A focused teaching surface, built around how Indian classrooms run."
        />
        <div className="grid w-full gap-6 md:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <FeatureCard key={f.title}>
              <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full ${f.g} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`} />
              <div className={`mb-5 grid h-14 w-14 place-items-center rounded-2xl ${f.g} text-white shadow-glow`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-extrabold tracking-tight">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </FeatureCard>
          ))}
        </div>
      </div>
    </section>
  );
}