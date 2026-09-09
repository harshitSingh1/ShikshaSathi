import { useState, useEffect } from "react";
import { Award, Medal, Plus, RefreshCw, Star, Trash2, Trophy, Users, X } from "lucide-react";
import { EduButton } from "@/components/ui-edu/button";
import { getStarAwards, saveStarAward, clearStarAwards, type StarAward } from "@/lib/storage/star-board";
import { soundEffects } from "@/lib/audio/sound-effects";
import { cn } from "@/lib/utils";

const BADGES = [
  { emoji: "🌟", label: "Star Student", desc: "Active participation" },
  { emoji: "💡", label: "Curious Mind", desc: "Asked a great question" },
  { emoji: "🤝", label: "Team Player", desc: "Helped peer understand" },
  { emoji: "🎯", label: "Concept Master", desc: "Explained concept clearly" },
  { emoji: "⚡", label: "Rapid Recall", desc: "Quick correct answer" },
];

export function StarBoardModal({ onClose, activeTopic }: { onClose: () => void; activeTopic?: string | null }) {
  const [awards, setAwards] = useState<StarAward[]>([]);
  const [studentName, setStudentName] = useState("");
  const [selectedBadge, setSelectedBadge] = useState(BADGES[0]);

  useEffect(() => {
    setAwards(getStarAwards());
  }, []);

  const handleAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) return;

    const updated = saveStarAward({
      studentName: studentName.trim(),
      badge: selectedBadge.emoji,
      badgeLabel: selectedBadge.label,
      points: 10,
      topic: activeTopic ?? undefined,
    });
    setAwards(updated);
    setStudentName("");
    soundEffects.playCorrect();
  };

  const handleClear = () => {
    if (window.confirm("Reset the star board for a new class?")) {
      clearStarAwards();
      setAwards([]);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-amber-500/10 via-primary/5 to-transparent px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-500/20 text-2xl text-amber-600">🌟</span>
            <div>
              <h2 className="font-display text-lg font-black text-foreground">Classroom Star Board</h2>
              <p className="text-xs text-muted-foreground">Recognize active student contributions during teaching</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-6">
          {/* Award Star Form */}
          <form onSubmit={handleAward} className="rounded-2xl border-2 border-amber-500/30 bg-amber-500/5 p-4 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
              <Award className="h-4 w-4" /> Award a Student Star
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Student Name or Roll No. (e.g., Aarav, Roll 14)"
                className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2.5 text-sm font-semibold text-foreground outline-none transition-all focus:border-amber-500"
              />
              <EduButton type="submit" className="gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-glow">
                <Plus className="h-4 w-4" /> Award Star
              </EduButton>
            </div>

            {/* Badge Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1">
              {BADGES.map((b) => (
                <button
                  type="button"
                  key={b.label}
                  onClick={() => setSelectedBadge(b)}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-xl border p-2 text-center transition-all",
                    selectedBadge.label === b.label
                      ? "border-amber-500 bg-amber-500/20 shadow-glow"
                      : "border-border/60 bg-background/60 hover:border-amber-500/40"
                  )}
                >
                  <span className="text-2xl">{b.emoji}</span>
                  <span className="text-[11px] font-bold text-foreground line-clamp-1">{b.label}</span>
                </button>
              ))}
            </div>
          </form>

          {/* Star Board Leaderboard */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-black uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Trophy className="h-4 w-4 text-amber-500" /> Today's Classroom Stars ({awards.length})
              </div>
              {awards.length > 0 && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-muted-foreground hover:text-destructive transition-colors"
                >
                  <RefreshCw className="h-3 w-3" /> Reset Board
                </button>
              )}
            </div>

            {awards.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-border p-8 text-center text-muted-foreground">
                <span className="text-4xl">🌟</span>
                <p className="mt-2 text-sm font-semibold">No stars awarded yet</p>
                <p className="text-xs">Reward students answering questions or participating in activities!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {awards.map((a) => (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background p-3 shadow-soft"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-amber-500/10 text-2xl">
                      {a.badge}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-extrabold text-foreground truncate">{a.studentName}</div>
                      <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                        {a.badgeLabel} {a.topic ? `• ${a.topic}` : ""}
                      </div>
                    </div>
                    <span className="shrink-0 rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-black text-amber-600 dark:text-amber-300">
                      +{a.points}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
