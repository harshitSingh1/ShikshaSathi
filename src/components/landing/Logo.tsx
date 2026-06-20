import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <a href="/" className={cn("flex items-center gap-2.5", className)}>
      <span className="relative grid h-10 w-10 place-items-center rounded-2xl bg-gradient-primary text-white shadow-glow">
        <svg viewBox="0 0 24 24" fill="none" className="h-5 w-5">
          <path d="M4 7c0-1.1.9-2 2-2h9l5 5v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7Z" fill="currentColor" opacity=".25"/>
          <path d="M9 12h6M9 15h4M12 4v5h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="17" cy="17" r="2.5" fill="currentColor"/>
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[15px] font-extrabold tracking-tight text-foreground">
          ShikshaSathi <span className="text-gradient-primary">AI</span>
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Classroom Co-Teacher
        </span>
      </span>
    </a>
  );
}