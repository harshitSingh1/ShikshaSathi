import { Rocket, ArrowRight } from "lucide-react";
import { EduButton } from "@/components/ui-edu/button";

export function FinalCTA() {
  return (
    <section className="px-5 pb-20 pt-4 sm:px-8 md:pb-28">
      <div className="relative mx-auto max-w-[1400px] overflow-hidden rounded-[2.5rem] bg-gradient-primary px-6 py-16 text-center shadow-float sm:px-12 md:py-24">
        {/* decor */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />

        <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-6">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            Ready for your next lesson
          </span>
          <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl md:text-5xl">
            Transform every classroom into an
            <br className="hidden sm:block" /> interactive learning experience
          </h2>
          <p className="max-w-xl text-base text-white/85 sm:text-lg">
            Pilot ShikshaSathi AI in your school — teachers stay in charge, students stay engaged.
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
            <EduButton size="lg" variant="glass" className="bg-white text-foreground hover:bg-white">
              <Rocket /> Launch Classroom
            </EduButton>
            <EduButton size="lg" variant="glass">
              Explore Features <ArrowRight />
            </EduButton>
          </div>
        </div>
      </div>
    </section>
  );
}