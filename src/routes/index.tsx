import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { Benefits } from "@/components/landing/Benefits";
import { SmartBoardPreview } from "@/components/landing/SmartBoardPreview";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ShikshaSathi AI — Voice-Powered Classroom Co-Teacher" },
      { name: "description", content: "AI co-teacher for Indian government schools — voice-driven lessons, visual diagrams, instant quizzes and Hinglish, right on the smart board." },
      { property: "og:title", content: "ShikshaSathi AI — Voice-Powered Classroom Co-Teacher" },
      { property: "og:description", content: "Voice, visuals, quizzes and Hinglish — on the classroom smart board." },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Benefits />
        <SmartBoardPreview />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
