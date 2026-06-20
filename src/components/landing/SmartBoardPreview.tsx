import { Mic, Sparkles, ListChecks, Languages, Volume2, MoreHorizontal } from "lucide-react";
import { SectionHeader } from "@/components/ui-edu/section-header";
import { EduBadge } from "@/components/ui-edu/badge";

export function SmartBoardPreview() {
  return (
    <section className="bg-muted/40 py-20 md:py-28">
      <div className="mx-auto flex max-w-[1400px] flex-col items-center gap-14 px-5 sm:px-8">
        <SectionHeader
          eyebrow="Smart Board Preview"
          title="What students actually see"
          description="A focused, high-contrast teaching surface — not a chat window."
        />

        <div className="relative w-full">
          {/* Outer device frame */}
          <div className="rounded-[2.25rem] bg-gradient-primary p-2 shadow-float">
            <div className="rounded-[1.85rem] bg-[oklch(0.18_0.04_260)] p-4 sm:p-6">
              {/* Header bar */}
              <div className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-4 py-3 backdrop-blur">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-warm text-white">
                    <Sparkles className="h-4 w-4" />
                  </span>
                  <div className="min-w-0">
                    <div className="font-display text-base font-extrabold text-white">Photosynthesis</div>
                    <div className="text-[11px] font-semibold tracking-wider text-white/60">CLASS 7 · SCIENCE · CHAPTER 1</div>
                  </div>
                </div>
                <div className="hidden items-center gap-2 sm:flex">
                  <EduBadge tone="glass"><Volume2 className="h-3 w-3" /> EN · HI</EduBadge>
                  <EduBadge tone="glass">Live</EduBadge>
                  <button className="grid h-9 w-9 place-items-center rounded-xl bg-white/10 text-white"><MoreHorizontal className="h-4 w-4" /></button>
                </div>
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
                {/* Flowchart panel */}
                <div className="relative rounded-2xl bg-white p-6 shadow-card">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-display text-lg font-extrabold text-foreground">How a leaf makes food</h3>
                    <EduBadge tone="success">Diagram</EduBadge>
                  </div>
                  <FlowchartSVG />
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <Pill color="primary">Sunlight</Pill>
                    <Pill color="cool">Water</Pill>
                    <Pill color="warm">CO₂</Pill>
                    <span className="text-muted-foreground">→</span>
                    <Pill color="success">Glucose</Pill>
                    <Pill color="cool">Oxygen</Pill>
                  </div>
                </div>

                {/* AI Co-teacher panel */}
                <div className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-card">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-primary text-white shadow-glow">
                      <Mic className="h-5 w-5" />
                    </span>
                    <div>
                      <div className="font-display text-base font-extrabold">AI Co-Teacher</div>
                      <div className="text-xs text-muted-foreground">Listening for your next command…</div>
                    </div>
                    <span className="ml-auto grid h-3 w-3 place-items-center">
                      <span className="h-3 w-3 rounded-full bg-success animate-soft-pulse" />
                    </span>
                  </div>

                  <ul className="flex flex-col gap-2">
                    <Suggestion icon={<Languages className="h-4 w-4" />}>"Hinglish mein samjhao"</Suggestion>
                    <Suggestion icon={<ListChecks className="h-4 w-4" />}>"5 quiz questions banao"</Suggestion>
                    <Suggestion icon={<Sparkles className="h-4 w-4" />}>"Real life example do"</Suggestion>
                  </ul>

                  <button className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-warm px-5 py-3 font-semibold text-white shadow-glow hover-lift">
                    <ListChecks className="h-4 w-4" /> Generate Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stand */}
          <div className="mx-auto mt-3 h-3 w-40 rounded-b-2xl bg-muted-foreground/30" />
        </div>
      </div>
    </section>
  );
}

function Pill({ color, children }: { color: "primary" | "cool" | "warm" | "success"; children: React.ReactNode }) {
  const map = {
    primary: "bg-primary/10 text-primary",
    cool: "bg-secondary/15 text-secondary",
    warm: "bg-accent/25 text-foreground",
    success: "bg-success/15 text-success",
  } as const;
  return <span className={`rounded-full px-3 py-1 text-xs font-bold ${map[color]}`}>{children}</span>;
}

function Suggestion({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3 rounded-xl border border-border/70 bg-muted/40 px-3 py-2 text-sm font-semibold text-foreground">
      <span className="text-primary">{icon}</span> {children}
    </li>
  );
}

function FlowchartSVG() {
  return (
    <svg viewBox="0 0 520 220" className="h-auto w-full">
      <defs>
        <linearGradient id="leafg" x1="0" x2="1">
          <stop offset="0%" stopColor="oklch(0.74 0.17 145)" />
          <stop offset="100%" stopColor="oklch(0.72 0.13 188)" />
        </linearGradient>
      </defs>
      {/* Inputs */}
      <Node x={20} y={20} label="Sunlight" color="oklch(0.79 0.16 75)" />
      <Node x={20} y={90} label="Water (H₂O)" color="oklch(0.78 0.13 230)" />
      <Node x={20} y={160} label="CO₂" color="oklch(0.52 0.22 277)" />
      {/* Leaf */}
      <g>
        <rect x="200" y="65" width="140" height="90" rx="22" fill="url(#leafg)" />
        <text x="270" y="115" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="800" fontSize="18" fill="white">LEAF</text>
        <text x="270" y="135" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="600" fontSize="11" fill="white" opacity=".85">Chlorophyll reaction</text>
      </g>
      {/* Arrows in */}
      <Arrow x1={150} y1={40} x2={200} y2={90} />
      <Arrow x1={150} y1={110} x2={200} y2={110} />
      <Arrow x1={150} y1={180} x2={200} y2={130} />
      {/* Outputs */}
      <Node x={380} y={60} label="Glucose" color="oklch(0.74 0.17 145)" w={120} />
      <Node x={380} y={140} label="Oxygen (O₂)" color="oklch(0.78 0.13 230)" w={120} />
      <Arrow x1={340} y1={95} x2={380} y2={80} />
      <Arrow x1={340} y1={125} x2={380} y2={160} />
    </svg>
  );
}

function Node({ x, y, label, color, w = 130 }: { x: number; y: number; label: string; color: string; w?: number }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width={w} height="40" rx="14" fill={color} opacity=".15" />
      <rect width="4" height="40" rx="2" fill={color} />
      <text x={w / 2 + 2} y="25" textAnchor="middle" fontFamily="Inter, sans-serif" fontWeight="700" fontSize="13" fill="oklch(0.27 0.04 257)">{label}</text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <g>
      <path d={`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2 - 6} ${y2}`}
            stroke="oklch(0.7 0.02 260)" strokeWidth="2" fill="none" strokeDasharray="3 5" />
      <polygon points={`${x2},${y2} ${x2 - 8},${y2 - 4} ${x2 - 8},${y2 + 4}`} fill="oklch(0.52 0.22 277)" />
    </g>
  );
}