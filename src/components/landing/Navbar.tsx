import { useEffect, useState } from "react";
import { Menu, Rocket, X } from "lucide-react";
import { EduButton } from "@/components/ui-edu/button";
import { Logo } from "./Logo";
import { cn } from "@/lib/utils";

const NAV = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how" },
  { label: "Benefits", href: "#benefits" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all",
        scrolled
          ? "border-b border-border/60 bg-background/80 backdrop-blur-xl shadow-soft"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-18 max-w-[1400px] items-center justify-between gap-4 px-5 py-3 sm:px-8">
        <Logo />
        <nav className="hidden items-center gap-1 lg:flex">
          {NAV.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden lg:block">
          <EduButton asChild size="sm">
            <a href="/classroom"><Rocket /> Launch Classroom</a>
          </EduButton>
        </div>
        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card text-foreground shadow-soft lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-card lg:hidden">
          <div className="mx-auto flex max-w-[1400px] flex-col gap-2 px-5 py-4">
            {NAV.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-semibold text-foreground hover:bg-muted"
              >
                {item.label}
              </a>
            ))}
            <EduButton asChild className="mt-2">
              <a href="/classroom"><Rocket /> Launch Classroom</a>
            </EduButton>
          </div>
        </div>
      )}
    </header>
  );
}