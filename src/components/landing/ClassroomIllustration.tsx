/**
 * Modern flat-geometric classroom illustration.
 * Smart board front-and-center showing a Photosynthesis diagram,
 * teacher silhouette + student rows, floating subject chips.
 * Pure SVG + JSX — crisp at smart-board scale.
 */
export function ClassroomIllustration() {
  return (
    <div className="relative aspect-[4/3] w-full">
      {/* Floating subject chips */}
      <FloatingChip emoji="🌱" className="left-2 top-6 [animation-delay:0s]" tone="success" />
      <FloatingChip emoji="🔬" className="right-4 top-2 [animation-delay:.6s]" tone="primary" />
      <FloatingChip emoji="📚" className="-left-1 bottom-24 [animation-delay:1.2s]" tone="accent" />
      <FloatingChip emoji="🌎" className="right-2 bottom-28 [animation-delay:1.8s]" tone="secondary" />
      <FloatingChip emoji="📊" className="right-10 bottom-6 [animation-delay:2.4s]" tone="warning" />

      <svg
        viewBox="0 0 600 460"
        className="h-full w-full"
        role="img"
        aria-label="Teacher in front of a smart board showing a photosynthesis diagram, with students seated."
      >
        <defs>
          <linearGradient id="board" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.27 0.04 257)" />
            <stop offset="100%" stopColor="oklch(0.35 0.06 270)" />
          </linearGradient>
          <linearGradient id="frame" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.52 0.22 277)" />
            <stop offset="100%" stopColor="oklch(0.72 0.13 188)" />
          </linearGradient>
          <linearGradient id="floor" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="oklch(0.96 0.01 250)" />
            <stop offset="100%" stopColor="oklch(0.9 0.02 250)" />
          </linearGradient>
        </defs>

        {/* Floor */}
        <rect x="0" y="360" width="600" height="100" fill="url(#floor)" />
        <line x1="0" y1="360" x2="600" y2="360" stroke="oklch(0.85 0.02 250)" strokeWidth="2" />

        {/* Smart board frame */}
        <rect x="60" y="40" width="480" height="290" rx="22" fill="url(#frame)" />
        <rect x="72" y="52" width="456" height="266" rx="14" fill="url(#board)" />

        {/* Board header */}
        <rect x="92" y="68" width="120" height="22" rx="11" fill="oklch(0.79 0.16 75)" opacity=".95" />
        <text x="152" y="83" textAnchor="middle" fontSize="12" fontWeight="700"
              fontFamily="Poppins, sans-serif" fill="oklch(0.27 0.04 257)">PHOTOSYNTHESIS</text>
        <circle cx="500" cy="80" r="7" fill="oklch(0.74 0.17 145)" />
        <text x="486" y="84" textAnchor="end" fontSize="10" fontWeight="600" fill="white" opacity=".8">LIVE</text>

        {/* Diagram: Sun -> Leaf -> Outputs */}
        {/* Sun */}
        <g transform="translate(130 175)">
          <circle r="28" fill="oklch(0.79 0.16 75)" />
          {Array.from({ length: 8 }).map((_, i) => {
            const a = (i * Math.PI) / 4;
            const x1 = Math.cos(a) * 34;
            const y1 = Math.sin(a) * 34;
            const x2 = Math.cos(a) * 44;
            const y2 = Math.sin(a) * 44;
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="oklch(0.79 0.16 75)" strokeWidth="3" strokeLinecap="round" />;
          })}
          <text y="5" textAnchor="middle" fontSize="11" fontWeight="800" fill="oklch(0.27 0.04 257)">SUN</text>
        </g>

        {/* Arrow 1 */}
        <ArrowH from={[180, 175]} to={[265, 175]} />

        {/* Leaf */}
        <g transform="translate(300 175)">
          <path d="M -45 0 C -45 -45, 45 -45, 45 0 C 45 45, -45 45, -45 0 Z"
                fill="oklch(0.74 0.17 145)" />
          <path d="M -40 0 L 40 0" stroke="white" strokeWidth="2" opacity=".7" />
          <path d="M 0 0 L -20 -22 M 0 0 L 20 -22 M 0 0 L -20 22 M 0 0 L 20 22"
                stroke="white" strokeWidth="1.5" opacity=".6" />
          <text y="5" textAnchor="middle" fontSize="11" fontWeight="800" fill="white">LEAF</text>
        </g>

        {/* Arrow 2 */}
        <ArrowH from={[350, 175]} to={[420, 175]} />

        {/* Outputs stacked */}
        <g transform="translate(460 145)">
          <rect x="-30" y="-12" width="80" height="26" rx="13" fill="oklch(0.78 0.13 230)" />
          <text x="10" y="6" textAnchor="middle" fontSize="11" fontWeight="700" fill="white">O₂</text>
        </g>
        <g transform="translate(460 205)">
          <rect x="-30" y="-12" width="80" height="26" rx="13" fill="oklch(0.79 0.16 75)" />
          <text x="10" y="6" textAnchor="middle" fontSize="11" fontWeight="700" fill="oklch(0.27 0.04 257)">GLUCOSE</text>
        </g>
        <line x1="420" y1="175" x2="450" y2="155" stroke="white" strokeWidth="2" opacity=".5" />
        <line x1="420" y1="175" x2="450" y2="205" stroke="white" strokeWidth="2" opacity=".5" />

        {/* Bottom mini-bar chart */}
        <g transform="translate(110 270)">
          {[18, 30, 22, 38, 28, 44].map((h, i) => (
            <rect key={i} x={i * 18} y={-h} width="12" height={h} rx="3"
                  fill={i % 2 === 0 ? "oklch(0.72 0.13 188)" : "oklch(0.52 0.22 277)"} />
          ))}
        </g>
        <text x="110" y="295" fontSize="9" fontWeight="700" fill="white" opacity=".7">CHLOROPHYLL ABSORPTION</text>

        {/* Quiz pill */}
        <g transform="translate(420 285)">
          <rect x="-58" y="-14" width="116" height="28" rx="14" fill="white" />
          <circle cx="-40" cy="0" r="5" fill="oklch(0.74 0.17 145)" />
          <text x="-25" y="4" fontSize="11" fontWeight="700" fill="oklch(0.27 0.04 257)" fontFamily="Inter, sans-serif">Generate quiz →</text>
        </g>

        {/* Board stand */}
        <rect x="290" y="330" width="20" height="32" fill="oklch(0.72 0.05 260)" />
        <rect x="260" y="358" width="80" height="8" rx="4" fill="oklch(0.6 0.04 260)" />

        {/* Teacher */}
        <g transform="translate(120 345)">
          <circle cx="0" cy="-22" r="12" fill="oklch(0.78 0.08 50)" />
          <path d="M -14 -12 q 14 -10 28 0 v 22 q -14 6 -28 0 Z" fill="oklch(0.52 0.22 277)" />
          <rect x="-4" y="10" width="3" height="14" fill="oklch(0.27 0.04 257)" />
          <rect x="1" y="10" width="3" height="14" fill="oklch(0.27 0.04 257)" />
          {/* pointing arm */}
          <path d="M 12 -8 L 38 -22" stroke="oklch(0.78 0.08 50)" strokeWidth="5" strokeLinecap="round" />
        </g>

        {/* Students (rows of soft shapes) */}
        {[0, 1, 2, 3, 4].map((i) => (
          <g key={i} transform={`translate(${250 + i * 60} 360)`}>
            <ellipse cx="0" cy="0" rx="20" ry="6" fill="oklch(0.85 0.02 250)" />
            <circle cx="0" cy="-14" r="9"
                    fill={["oklch(0.79 0.16 75)", "oklch(0.72 0.13 188)", "oklch(0.78 0.13 230)", "oklch(0.74 0.17 145)", "oklch(0.52 0.22 277)"][i]} />
            <path d={`M -12 -2 q 12 -10 24 0 v 6 h -24 Z`}
                  fill={["oklch(0.52 0.22 277)", "oklch(0.79 0.16 75)", "oklch(0.74 0.17 145)", "oklch(0.78 0.13 230)", "oklch(0.72 0.13 188)"][i]} />
          </g>
        ))}
      </svg>
    </div>
  );
}

function ArrowH({ from, to }: { from: [number, number]; to: [number, number] }) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2 - 8} y2={y2} stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 6" opacity=".7" />
      <polygon points={`${x2},${y2} ${x2 - 10},${y2 - 5} ${x2 - 10},${y2 + 5}`} fill="white" opacity=".85" />
    </g>
  );
}

function FloatingChip({
  emoji,
  className,
  tone,
}: {
  emoji: string;
  className?: string;
  tone: "primary" | "secondary" | "accent" | "success" | "warning";
}) {
  const toneMap = {
    primary: "bg-primary/10 text-primary border-primary/20",
    secondary: "bg-secondary/15 text-secondary border-secondary/30",
    accent: "bg-accent/25 text-foreground border-accent/40",
    success: "bg-success/15 text-success border-success/30",
    warning: "bg-warning/15 text-warning border-warning/30",
  } as const;
  return (
    <div
      className={`absolute z-10 grid h-12 w-12 place-items-center rounded-2xl border bg-card text-xl shadow-card animate-float ${toneMap[tone]} ${className ?? ""}`}
    >
      <span>{emoji}</span>
    </div>
  );
}