import type { TeachingResponse } from "@/lib/ai/schema";

export interface StoredLesson {
  id: string;
  savedAt: number;
  topic: string;
  grade: string;
  subject: string;
  language: string;
  theme: string;
  hasQuiz: boolean;
  data: TeachingResponse;
}

const STORAGE_KEY = "ss-offline-lessons-library";

export function saveOfflineLesson(response: TeachingResponse): void {
  if (typeof window === "undefined" || !response || !response.topic) return;
  try {
    const existing = getOfflineLessons();
    const id = `${response.topic.toLowerCase().replace(/[^a-z0-9]/g, "-")}-${response.grade || "6"}`;
    const entry: StoredLesson = {
      id,
      savedAt: Date.now(),
      topic: response.topic,
      grade: response.grade || "6",
      subject: response.subject || "General",
      language: response.language || "Hinglish",
      theme: response.theme || "default",
      hasQuiz: !!response.quiz?.questions?.length,
      data: response,
    };
    // Keep max 50 lessons, avoid duplicate by id
    const filtered = existing.filter((item) => item.id !== id);
    const updated = [entry, ...filtered].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (e) {
    console.warn("[offline-library] failed to save lesson to storage", e);
  }
}

export function getOfflineLessons(): StoredLesson[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredLesson[];
  } catch {
    return [];
  }
}

export function deleteOfflineLesson(id: string): StoredLesson[] {
  if (typeof window === "undefined") return [];
  try {
    const existing = getOfflineLessons();
    const updated = existing.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export function exportOfflinePack(): string {
  const lessons = getOfflineLessons();
  return JSON.stringify({
    version: "1.0",
    appName: "ShikshaSathi",
    exportedAt: new Date().toISOString(),
    lessonCount: lessons.length,
    lessons,
  }, null, 2);
}

export function importOfflinePack(jsonText: string): { success: boolean; count: number; error?: string } {
  try {
    const parsed = JSON.parse(jsonText);
    const incoming = Array.isArray(parsed) ? parsed : parsed.lessons;
    if (!Array.isArray(incoming)) {
      return { success: false, count: 0, error: "Invalid offline pack format." };
    }
    const existing = getOfflineLessons();
    const existingIds = new Set(existing.map((l) => l.id));
    let count = 0;

    for (const item of incoming) {
      if (item && item.topic && item.data) {
        if (!existingIds.has(item.id)) {
          existing.push(item);
          existingIds.add(item.id);
          count++;
        }
      }
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.slice(0, 50)));
    return { success: true, count };
  } catch (err) {
    return {
      success: false,
      count: 0,
      error: err instanceof Error ? err.message : "Failed to parse offline pack",
    };
  }
}
