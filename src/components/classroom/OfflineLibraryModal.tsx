import { useRef, useState } from "react";
import {
  BookOpen,
  Download,
  FolderDown,
  FolderUp,
  HardDrive,
  Play,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import {
  deleteOfflineLesson,
  exportOfflinePack,
  getOfflineLessons,
  importOfflinePack,
  type StoredLesson,
} from "@/lib/storage/offline-library";
import { EduButton } from "@/components/ui-edu/button";
import type { TeachingResponse } from "@/lib/ai/schema";
import { toast } from "sonner";

interface OfflineLibraryModalProps {
  onLoadLesson: (data: TeachingResponse) => void;
  onClose: () => void;
}

export function OfflineLibraryModal({ onLoadLesson, onClose }: OfflineLibraryModalProps) {
  const [lessons, setLessons] = useState<StoredLesson[]>(getOfflineLessons);
  const [search, setSearch] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filtered = lessons.filter(
    (l) =>
      l.topic.toLowerCase().includes(search.toLowerCase()) ||
      l.subject.toLowerCase().includes(search.toLowerCase()) ||
      l.language.toLowerCase().includes(search.toLowerCase()),
  );

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = deleteOfflineLesson(id);
    setLessons(updated);
    toast.success("Lesson removed from offline library");
  };

  const handleExport = () => {
    const json = exportOfflinePack();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ShikshaSathi-Offline-Pack-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Offline pack exported for USB sharing");
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const res = importOfflinePack(text);
      if (res.success) {
        setLessons(getOfflineLessons());
        toast.success(`Successfully imported ${res.count} lessons from USB pack!`);
      } else {
        toast.error(res.error || "Failed to import pack");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-muted/40 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary/10 text-primary">
              <HardDrive className="h-5 w-5" />
            </span>
            <div>
              <h2 className="font-display text-base font-bold text-foreground">
                Offline Classroom Library
              </h2>
              <p className="text-xs text-muted-foreground">
                {lessons.length} saved lessons ready to teach without internet
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
            <EduButton
              size="sm"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              className="h-8 gap-1.5 text-xs"
              title="Import offline pack from USB flash drive"
            >
              <FolderUp className="h-3.5 w-3.5" /> Import USB Pack
            </EduButton>
            <EduButton
              size="sm"
              variant="secondary"
              onClick={handleExport}
              disabled={lessons.length === 0}
              className="h-8 gap-1.5 text-xs"
              title="Export all lessons to USB pack"
            >
              <FolderDown className="h-3.5 w-3.5" /> Export Pack
            </EduButton>
            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="border-b border-border/60 p-3 px-6">
          <div className="flex items-center gap-2 rounded-xl border border-border bg-background px-3 py-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search saved offline lessons by topic, subject, or language…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent text-xs text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Lesson List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-10 w-10 text-muted-foreground/50 mb-3" />
              <p className="font-display text-sm font-bold text-foreground">
                {search ? "No matching offline lessons found" : "No saved lessons in offline library yet"}
              </p>
              <p className="mt-1 text-xs text-muted-foreground max-w-sm">
                Every lesson you teach or import from a USB pack is automatically saved here so you can run it completely offline.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {filtered.map((l) => (
                <div
                  key={l.id}
                  onClick={() => {
                    onLoadLesson(l.data);
                    onClose();
                  }}
                  className="group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-background/90 p-4 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-card cursor-pointer"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                        Class {l.grade} • {l.subject}
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground">
                        {l.language}
                      </span>
                    </div>
                    <h3 className="mt-2 font-display text-sm font-bold text-foreground group-hover:text-primary">
                      {l.topic}
                    </h3>
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-border/50 pt-2 text-xs">
                    <span className="text-[10px] text-muted-foreground">
                      {l.hasQuiz ? "Includes 5 MCQs" : "Lesson Guide"}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => handleDelete(l.id, e)}
                        title="Delete from offline storage"
                        className="grid h-7 w-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <span className="inline-flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-[11px] font-bold text-primary-foreground shadow-sm">
                        <Play className="h-3 w-3" /> Load
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
