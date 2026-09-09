import { useState } from "react";
import { BookOpen, ChevronRight, GraduationCap, Sparkles } from "lucide-react";
import { NCERT_CURRICULUM, type NCERTChapter } from "./ncert-data";
import { useVoice } from "../voice-context";
import { useMode } from "../mode-context";
import { cn } from "@/lib/utils";

export function NCERTNavigator({ onClose }: { onClose?: () => void }) {
  const [selectedGrade, setSelectedGrade] = useState("6");
  const [selectedSubject, setSelectedSubject] = useState("Science");
  const { sendText, setSettings } = useVoice();
  const { setMode } = useMode();

  const gradeData = NCERT_CURRICULUM.find((g) => g.grade === selectedGrade) ?? NCERT_CURRICULUM[0];
  const subjectData = gradeData.subjects.find((s) => s.name === selectedSubject) ?? gradeData.subjects[0];

  const handleSelectChapter = (chapter: NCERTChapter) => {
    setSettings({ grade: `Class ${selectedGrade}` });
    setMode("teaching");
    void sendText(chapter.prompt);
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card p-4 shadow-soft">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/60 pb-2.5">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-foreground">
              NCERT Curriculum
            </h3>
            <p className="text-[10px] text-muted-foreground">Classroom syllabus explorer</p>
          </div>
        </div>
        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
          Classes 6–10
        </span>
      </div>

      {/* Grade Selector Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {NCERT_CURRICULUM.map((item) => (
          <button
            key={item.grade}
            onClick={() => {
              setSelectedGrade(item.grade);
              // Switch to first subject if current not available
              const available = item.subjects.some((s) => s.name === selectedSubject);
              if (!available) setSelectedSubject(item.subjects[0].name);
            }}
            className={cn(
              "rounded-xl px-2.5 py-1 text-xs font-bold transition-all shrink-0",
              selectedGrade === item.grade
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground",
            )}
          >
            Class {item.grade}
          </button>
        ))}
      </div>

      {/* Subject Tabs */}
      <div className="flex gap-2">
        {gradeData.subjects.map((sub) => (
          <button
            key={sub.name}
            onClick={() => setSelectedSubject(sub.name)}
            className={cn(
              "flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors",
              selectedSubject === sub.name
                ? "bg-foreground/10 text-foreground font-bold"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span>{sub.icon}</span>
            <span>{sub.name}</span>
          </button>
        ))}
      </div>

      {/* Chapters List */}
      <div className="flex max-h-64 flex-col gap-2 overflow-y-auto pr-1">
        {subjectData.chapters.map((ch) => (
          <button
            key={ch.id}
            onClick={() => handleSelectChapter(ch)}
            className="group flex flex-col gap-1 rounded-xl border border-border/50 bg-background/80 p-2.5 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:bg-card hover:shadow-soft"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                Chapter {ch.chapterNumber}
              </span>
              <span className="text-[10px] text-muted-foreground group-hover:text-primary flex items-center gap-0.5">
                Teach <ChevronRight className="h-3 w-3" />
              </span>
            </div>
            <div className="font-display text-xs font-bold text-foreground">
              {ch.title}
              {ch.hindiTitle && (
                <span className="ml-1.5 font-normal text-muted-foreground text-[11px]">
                  ({ch.hindiTitle})
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-1 mt-0.5">
              {ch.keyConcepts.slice(0, 3).map((concept) => (
                <span
                  key={concept}
                  className="rounded-md bg-muted px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground"
                >
                  {concept}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
