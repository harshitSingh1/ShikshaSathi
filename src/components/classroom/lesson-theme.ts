export type LessonTheme = "science" | "nature" | "math" | "history";

export const THEME_META: Record<LessonTheme, { label: string; emojis: [string, string, string] }> = {
  science: { label: "Science", emojis: ["🔬", "⚛️", "🧪"] },
  nature: { label: "Nature", emojis: ["🌿", "🌳", "🌱"] },
  math: { label: "Math", emojis: ["➗", "📐", "📊"] },
  history: { label: "History", emojis: ["📜", "🏛️", "⚔️"] },
};