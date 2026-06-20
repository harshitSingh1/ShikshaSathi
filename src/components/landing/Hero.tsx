import { Mic, Play, ShieldCheck, Sparkles } from "lucide-react";
import { EduButton } from "@/components/ui-edu/button";
import { EduBadge } from "@/components/ui-edu/badge";
import { IllustrationContainer } from "@/components/ui-edu/card";
import { ClassroomIllustration } from "./ClassroomIllustration";

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero" aria-hidden />
      <div className="relative mx-auto grid max-w-[1400px] gap-12 px-5 pt-12 pb-20 sm:px-8 md:pt-20 md:pb-28 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-16">
        <div className="flex flex-col items-start gap-7 animate-fade-in">
          <EduBadge tone="primary" className="gap-2">
            <Sparkles className="h-3.5 w-3.5" /> Built for Indian Government Schools
          </EduBadge>

          <h1 className="font-display text-[clamp(2.25rem,5vw,4.25rem)] font-extrabold leading-[1.05] tracking-tight text-foreground">
            Your <span className="text-gradient-primary">Voice-Powered</span>{" "}
            Classroom Co-Teacher
          </h1>

          <p className="max-w-xl text-base text-muted-foreground sm:text-lg">
            Empowering teachers with AI-driven explanations, visual learning, quizzes,
            translations and classroom activities — all through simple voice commands,
            right on the smart board.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <EduButton size="lg">
              <Mic /> Start Teaching
            </EduButton>
            <EduButton size="lg" variant="secondary">
              <Play /> Watch Demo
            </EduButton>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <TrustChip icon={<Mic className="h-3.5 w-3.5" />}>Voice First</TrustChip>
            <TrustChip icon={<Sparkles className="h-3.5 w-3.5" />}>Hinglish Support</TrustChip>
            <TrustChip icon={<ShieldCheck className="h-3.5 w-3.5" />}>Smart Board Ready</TrustChip>
          </div>
        </div>

        <div className="relative animate-slide-up">
          <IllustrationContainer>
            <div className="rounded-[1.85rem] bg-white/70 backdrop-blur-sm p-4 sm:p-6">
              <ClassroomIllustration />
            </div>
          </IllustrationContainer>
          {/* glow blob */}
          <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[3rem] bg-gradient-primary opacity-20 blur-3xl" />
        </div>
      </div>
    </section>
  );
}

function TrustChip({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs font-semibold text-foreground shadow-soft backdrop-blur">
      <span className="text-primary">{icon}</span>
      {children}
    </span>
  );
}