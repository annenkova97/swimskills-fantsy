import { swimmers } from "./swimmers";

const COLLECTION_KEY = "ss-fantasy.collection.v2";
const PACK_TIMER_KEY = "ss-fantasy.lastPackAt.v2";
const PACK_COOLDOWN_MS = 24 * 60 * 60 * 1000;

export type CollectionState = {
  ownedIds: string[];
};

export function loadCollection(): CollectionState {
  if (typeof window === "undefined") return { ownedIds: [] };
  try {
    const raw = localStorage.getItem(COLLECTION_KEY);
    return raw ? JSON.parse(raw) : { ownedIds: [] };
  } catch {
    return { ownedIds: [] };
  }
}

export function saveCollection(state: CollectionState): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(COLLECTION_KEY, JSON.stringify(state));
}

export function lastPackAt(): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(PACK_TIMER_KEY);
  return raw ? Number(raw) : 0;
}

export function markPackOpened(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(PACK_TIMER_KEY, String(Date.now()));
}

export function packAvailable(now: number = Date.now()): boolean {
  return now - lastPackAt() >= PACK_COOLDOWN_MS;
}

export function timeUntilNextPack(now: number = Date.now()): number {
  return Math.max(0, PACK_COOLDOWN_MS - (now - lastPackAt()));
}

/**
 * Pulls a random swimmer for a pack open, weighted toward higher OVR.
 * Prefers swimmers with a real premium PNG (Nikita's hero cards) until all
 * of them are collected, so first-time users see the impressive art first.
 */
export function rollPackSwimmer(ownedIds: string[]): string {
  const unowned = swimmers.filter((s) => !ownedIds.includes(s.id));

  const unownedWithPhoto = unowned.filter((s) => s.photo);
  if (unownedWithPhoto.length > 0) {
    return weightedPick(unownedWithPhoto);
  }

  const pool = unowned.length > 0 ? unowned : swimmers;
  return weightedPick(pool);
}

function weightedPick(pool: typeof swimmers): string {
  const weights = pool.map((s) => Math.max(1, s.ovr - 70));
  const total = weights.reduce((a, b) => a + b, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return pool[i].id;
  }
  return pool[pool.length - 1].id;
}
