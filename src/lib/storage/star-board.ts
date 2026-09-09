export interface StarAward {
  id: string;
  studentName: string;
  badge: string;
  badgeLabel: string;
  points: number;
  timestamp: number;
  topic?: string;
}

const STORAGE_KEY = "shikshasathi_starboard";

export function getStarAwards(): StarAward[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveStarAward(award: Omit<StarAward, "id" | "timestamp">): StarAward[] {
  if (typeof window === "undefined") return [];
  try {
    const current = getStarAwards();
    const newAward: StarAward = {
      ...award,
      id: "star_" + Date.now(),
      timestamp: Date.now(),
    };
    const updated = [newAward, ...current];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function clearStarAwards(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {}
}
