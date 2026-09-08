import { ArrowLeft, ArrowRight, BookOpen, Rocket } from "lucide-react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { EduButton } from "@/components/ui-edu/button";

const RESOURCE_KEYS = [
  "roadmap",
  "pilot-programme",
  "teacher-training",
  "ngo-partnerships",
  "case-studies",
  "about",
  "mission",
  "careers",
  "contact",
] as const;
type ResourceKey = (typeof RESOURCE_KEYS)[number];

type ResourcePage = {
  title: string;
  description: string;
  detail: string;
};

const RESOURCE_PAGES: Record<ResourceKey, ResourcePage> = {
  roadmap: {
    title: "Roadmap",
    description: "See how ShikshaSathi is evolving from a classroom co-teacher into a complete learning companion.",
    detail: "The roadmap is being shaped with teachers and school partners. Follow the repository for upcoming improvements to offline learning, analytics, and curriculum coverage.",
  },
  "pilot-programme": {
    title: "Pilot Programme",
    description: "Bring voice-first teaching into a real classroom pilot.",
    detail: "Schools and education organisations interested in piloting ShikshaSathi can use the classroom demo today and contact the project team with feedback about their teaching context.",
  },
  "teacher-training": {
    title: "Teacher Training",
    description: "Help teachers get the most from a voice-first classroom workflow.",
    detail: "Training materials are being prepared around voice commands, smart-board presentation, multilingual teaching, and responsible use of AI-generated lessons.",
  },
  "ngo-partnerships": {
    title: "NGO Partnerships",
    description: "Collaborate on practical, equitable classroom technology.",
    detail: "The project welcomes education partners who can help validate classroom workflows, language needs, and offline-first requirements in Indian schools.",
  },
  "case-studies": {
    title: "Case Studies",
    description: "Learn how classroom teams are exploring ShikshaSathi.",
    detail: "Case studies will be published as pilots produce validated classroom outcomes and teacher feedback.",
  },
  about: {
    title: "About ShikshaSathi",
    description: "A voice-first AI co-teacher designed for Indian classrooms.",
    detail: "ShikshaSathi helps teachers turn a spoken topic into a grade-aware lesson with explanations, visual learning, quizzes, activities, and narration.",
  },
  mission: {
    title: "Our Mission",
    description: "Make high-quality teaching support more accessible in every classroom.",
    detail: "The project focuses on teacher control, multilingual access, smart-board readability, and useful learning experiences for classrooms with limited time and resources.",
  },
  careers: {
    title: "Careers",
    description: "Build thoughtful technology for teachers and students.",
    detail: "Career information will be published when formal roles and contributor programmes are available. In the meantime, contributions through GitHub are welcome.",
  },
  contact: {
    title: "Contact",
    description: "Share classroom feedback, partnership ideas, or technical improvements.",
    detail: "The fastest way to contribute is through a GitHub issue or pull request with a clear reproduction, expected behavior, and validation steps.",
  },
};

export const Route = createFileRoute("/resources")({
  validateSearch: z.object({
    topic: z.enum(RESOURCE_KEYS).catch("about"),
  }),
  head: () => ({
    meta: [
      { title: "Resources — ShikshaSathi AI" },
      {
        name: "description",
        content: "Project resources and planned initiatives for ShikshaSathi AI.",
      },
    ],
  }),
  component: ResourcesPage,
});

function ResourcesPage() {
  const { topic } = Route.useSearch();
  const resource = RESOURCE_PAGES[topic];

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex min-h-screen max-w-4xl flex-col px-5 py-8 sm:px-8">
        <header className="flex items-center justify-between gap-4">
          <a
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to home
          </a>
          <EduButton asChild size="sm">
            <a href="/classroom">
              <Rocket className="h-4 w-4" /> Launch classroom
            </a>
          </EduButton>
        </header>

        <section className="my-auto rounded-[2rem] border border-border bg-card p-7 shadow-float sm:p-12">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <BookOpen className="h-6 w-6" />
          </div>
          <p className="mt-8 text-xs font-extrabold uppercase tracking-[0.2em] text-primary">ShikshaSathi AI</p>
          <h1 className="mt-3 font-display text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            {resource.title}
          </h1>
          <p className="mt-5 max-w-2xl text-xl font-semibold leading-relaxed text-foreground/85">
            {resource.description}
          </p>
          <p className="mt-5 max-w-2xl leading-relaxed text-muted-foreground">{resource.detail}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <EduButton asChild>
              <a href="/classroom">
                Try the classroom <ArrowRight className="h-4 w-4" />
              </a>
            </EduButton>
            <EduButton asChild variant="secondary">
              <a href="https://github.com/harshitSingh1/ShikshaSathi" target="_blank" rel="noreferrer">
                View on GitHub
              </a>
            </EduButton>
          </div>
        </section>
      </div>
    </main>
  );
}
