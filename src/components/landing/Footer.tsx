import { Logo } from "./Logo";

const COLS = [
  { title: "Product", links: ["Features", "Smart Board Mode", "Voice Commands", "Roadmap"] },
  { title: "For Schools", links: ["Pilot Programme", "Teacher Training", "NGO Partnerships", "Case Studies"] },
  { title: "Company", links: ["About", "Mission", "Careers", "Contact"] },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-[1400px] gap-10 px-5 py-14 sm:px-8 md:grid-cols-[1.4fr_2fr]">
        <div className="flex flex-col gap-4">
          <Logo />
          <p className="max-w-sm text-sm text-muted-foreground">
            An AI co-teacher built for Indian government classrooms. Voice-first, visual,
            and Hinglish-ready — running right on the smart board.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-3">
          {COLS.map((col) => (
            <div key={col.title}>
              <div className="font-display text-sm font-extrabold uppercase tracking-widest text-foreground">
                {col.title}
              </div>
              <ul className="mt-3 flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1400px] flex-col items-start justify-between gap-2 px-5 py-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:px-8">
          <p>© {new Date().getFullYear()} ShikshaSathi AI. Built for teachers, with teachers.</p>
          <p>Made in India · Powered by voice & visual learning</p>
        </div>
      </div>
    </footer>
  );
}