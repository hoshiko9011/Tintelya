import { parseHex } from "./color";
import { HARMONIES, MOODS, type Harmony, type Mood } from "./palette";

export const HISTORY_KEY = "tintelya.history";
export const MAX_HISTORY = 12;

export type Saved = {
  id: string;
  at: number;
  seeds: string[];
  mood: Mood;
  harmony: Harmony;
};

const MOOD_IDS = new Set(MOODS.map((m) => m.id));
const HARMONY_IDS = new Set(HARMONIES.map((h) => h.id));

function isMood(v: unknown): v is Mood {
  return typeof v === "string" && MOOD_IDS.has(v as Mood);
}

function isHarmony(v: unknown): v is Harmony {
  return typeof v === "string" && HARMONY_IDS.has(v as Harmony);
}

/** Validate one saved palette entry; returns null if malformed. */
export function parseSaved(raw: unknown): Saved | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.id !== "string" || !o.id) return null;
  if (typeof o.at !== "number" || !Number.isFinite(o.at)) return null;
  if (!isMood(o.mood) || !isHarmony(o.harmony)) return null;
  if (!Array.isArray(o.seeds) || o.seeds.length === 0 || o.seeds.length > 5) {
    return null;
  }
  const seeds: string[] = [];
  for (const s of o.seeds) {
    if (typeof s !== "string") return null;
    const hex = parseHex(s);
    if (!hex) return null;
    seeds.push(hex);
  }
  return { id: o.id, at: o.at, seeds, mood: o.mood, harmony: o.harmony };
}

export function readHistory(): Saved[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const items: Saved[] = [];
    for (const entry of parsed) {
      const s = parseSaved(entry);
      if (s) items.push(s);
      if (items.length >= MAX_HISTORY) break;
    }
    return items;
  } catch {
    return [];
  }
}

export function writeHistory(items: Saved[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    HISTORY_KEY,
    JSON.stringify(items.slice(0, MAX_HISTORY)),
  );
}
