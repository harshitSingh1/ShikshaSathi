import { Gauge, Languages, Settings2, Sparkles, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useVoice, type VoiceGender, type VoiceLanguage, type VoiceSpeed, type VoiceStyle } from "../voice-context";

const SPEEDS: VoiceSpeed[] = ["slow", "normal", "fast"];
const LANGUAGES: VoiceLanguage[] = ["English", "Hindi", "Hinglish"];
const STYLES: VoiceStyle[] = ["teacher", "friendly", "energetic"];
const GENDERS: VoiceGender[] = ["female", "male"];

export function VoiceSettingsCard() {
  const { settings, setSettings, speak } = useVoice();

  return (
    <section className="rounded-3xl border border-border/60 bg-card p-4 shadow-soft">
      <header className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-secondary/15 text-secondary">
            <Settings2 className="h-3.5 w-3.5" />
          </span>
          <h4 className="text-sm font-bold tracking-tight text-foreground">Voice Settings</h4>
        </div>
        <button
          onClick={() => {
            const samples: Record<VoiceLanguage, string> = {
              English: "Hello class! I'm your ShikshaSathi co-teacher. Let's begin today's lesson.",
              Hindi: "नमस्ते बच्चों! मैं आपकी सहायक शिक्षिका हूँ। चलिए आज का पाठ शुरू करते हैं।",
              Hinglish: "Hello bachon! Aaj hum ek bahut interesting topic padhne wale hain. Ready ho?",
            };
            void speak(samples[settings.language]);
          }}
          className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary hover:bg-primary/20"
        >
          Preview
        </button>
      </header>

      <Group icon={<Gauge className="h-3 w-3" />} label="Speed">
        {SPEEDS.map((s) => (
          <Pill key={s} active={settings.speed === s} onClick={() => setSettings({ speed: s })}>
            {s}
          </Pill>
        ))}
      </Group>
      <Group icon={<Languages className="h-3 w-3" />} label="Language">
        {LANGUAGES.map((l) => (
          <Pill key={l} active={settings.language === l} onClick={() => setSettings({ language: l })}>
            {l}
          </Pill>
        ))}
      </Group>
      <Group icon={<Sparkles className="h-3 w-3" />} label="Style">
        {STYLES.map((s) => (
          <Pill key={s} active={settings.style === s} onClick={() => setSettings({ style: s })}>
            {s}
          </Pill>
        ))}
      </Group>
      <Group icon={<User className="h-3 w-3" />} label="Voice">
        {GENDERS.map((g) => (
          <Pill key={g} active={settings.gender === g} onClick={() => setSettings({ gender: g })}>
            {g}
          </Pill>
        ))}
      </Group>
    </section>
  );
}

function Group({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <div className="mb-2 last:mb-0">
      <div className="mb-1 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </div>
  );
}

function Pill({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1 text-[11px] font-semibold capitalize transition-all",
        active
          ? "border-primary/60 bg-gradient-primary text-white shadow-glow"
          : "border-border/60 bg-background text-foreground hover:border-primary/30",
      )}
    >
      {children}
    </button>
  );
}