import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { TopBar } from "@/components/classroom/TopBar";
import { VoiceProvider } from "@/components/classroom/voice-context";
import { ModeProvider } from "@/components/classroom/mode-context";
import { LeftPanel } from "@/components/classroom/LeftPanel";
import { CenterCanvas } from "@/components/classroom/CenterCanvas";
import { RightPanel } from "@/components/classroom/RightPanel";
import { FloatingActionBar } from "@/components/classroom/FloatingActionBar";
import { TeachingEngineProvider } from "@/components/classroom/ai-engine/teaching-engine-context";
import { AIPlayground } from "@/components/classroom/ai-engine/AIPlayground";
import { DevDebugPanel } from "@/components/classroom/ai-engine/DevDebugPanel";
import { NarrationProvider } from "@/components/classroom/narration-context";
import { NowSpeakingBadge } from "@/components/classroom/NarrateButton";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/classroom")({
  head: () => ({
    meta: [
      { title: "Classroom Dashboard — ShikshaSathi AI" },
      {
        name: "description",
        content:
          "AI-powered classroom cockpit for Indian teachers. Voice, visuals, quizzes and live insights on the smart board.",
      },
    ],
  }),
  component: ClassroomPage,
});

function ClassroomPage() {
  const [presentation, setPresentation] = useState(false);
  const [devMode, setDevMode] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    setDevMode(params.get("dev") === "1" || localStorage.getItem("ss-dev") === "1");
  }, []);

  useEffect(() => {
    const handler = () => setPresentation((v) => !v);
    window.addEventListener("ss:toggle-presentation", handler);
    return () => window.removeEventListener("ss:toggle-presentation", handler);
  }, []);

  useEffect(() => {
    if (!presentation) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setPresentation(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [presentation]);

  return (
    <ModeProvider>
    <TeachingEngineProvider>
    <VoiceProvider>
    <NarrationProvider>
    <div className="min-h-screen bg-background text-foreground">
      <TopBar
        presentation={presentation}
        onTogglePresentation={() => setPresentation((v) => !v)}
      />
      <main className="mx-auto max-w-[1600px] px-4 pb-28 pt-4 sm:px-6">
        <div
          className={cn(
            "grid gap-4",
            presentation
              ? "grid-cols-1"
              : "grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)] lg:grid-cols-[minmax(0,20fr)_minmax(0,55fr)_minmax(0,25fr)]",
          )}
          style={{ minHeight: "calc(100vh - 6rem)" }}
        >
          {!presentation && (
            <div className="order-2 lg:order-1">
              <LeftPanel />
            </div>
          )}
          <div className="order-1 lg:order-2">
            <CenterCanvas presentation={presentation} />
          </div>
          {!presentation && (
            <div className="order-3 md:col-span-2 lg:col-span-1">
              <RightPanel />
            </div>
          )}
        </div>
      </main>
      {!presentation && <FloatingActionBar />}
      {devMode && !presentation && <AIPlayground />}
      {devMode && <DevDebugPanel />}
      <NowSpeakingBadge />
    </div>
    </NarrationProvider>
    </VoiceProvider>
    </TeachingEngineProvider>
    </ModeProvider>
  );
}