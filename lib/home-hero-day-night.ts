export type HeroDayNightMode = "day" | "night";

/** Cache-bust after moov/faststart remux so phones don't keep the old file. */
export const HERO_DAY_VIDEO_SRC = "/images/videos/Dia.mp4?v=faststart2";
export const HERO_NIGHT_VIDEO_SRC = "/images/videos/Noche.mp4?v=faststart2";
export const HERO_DAY_PROFILE_SRC = "/images/home/Edwinspira Profile Day.png";
export const HERO_NIGHT_PROFILE_SRC =
  "/images/home/Edwinspira Profile Night.png";
export const HERO_BINARY_BANNER_SRC = "/images/home/Banner Binary.png";

/** Inclusive start of daytime (local hour). Day is [6, 19). */
export const HERO_DAY_START_HOUR = 6;
/** Inclusive start of nighttime (local hour). Night is [19, 6). */
export const HERO_NIGHT_START_HOUR = 19;

const STORAGE_KEY = "edwinspira-hero-day-night";

type HeroDayNightCache = {
  mode: HeroDayNightMode;
  pendingMode?: HeroDayNightMode;
  decidedAt: number;
};

export function getHeroModeForDate(date = new Date()): HeroDayNightMode {
  const hour = date.getHours();
  return hour >= HERO_DAY_START_HOUR && hour < HERO_NIGHT_START_HOUR
    ? "day"
    : "night";
}

export function heroVideoSrcForMode(mode: HeroDayNightMode): string {
  return mode === "day" ? HERO_DAY_VIDEO_SRC : HERO_NIGHT_VIDEO_SRC;
}

export function heroProfileSrcForMode(mode: HeroDayNightMode): string {
  return mode === "day" ? HERO_DAY_PROFILE_SRC : HERO_NIGHT_PROFILE_SRC;
}

/** Milliseconds until the next day↔night boundary in local time. */
export function msUntilNextHeroBoundary(date = new Date()): number {
  const next = new Date(date);
  const hour = date.getHours();
  const isDay =
    hour >= HERO_DAY_START_HOUR && hour < HERO_NIGHT_START_HOUR;

  if (isDay) {
    next.setHours(HERO_NIGHT_START_HOUR, 0, 0, 0);
  } else if (hour >= HERO_NIGHT_START_HOUR) {
    next.setDate(next.getDate() + 1);
    next.setHours(HERO_DAY_START_HOUR, 0, 0, 0);
  } else {
    next.setHours(HERO_DAY_START_HOUR, 0, 0, 0);
  }

  return Math.max(0, next.getTime() - date.getTime());
}

function readCache(): HeroDayNightCache | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<HeroDayNightCache>;
    if (parsed.mode !== "day" && parsed.mode !== "night") return null;
    return {
      mode: parsed.mode,
      pendingMode:
        parsed.pendingMode === "day" || parsed.pendingMode === "night"
          ? parsed.pendingMode
          : undefined,
      decidedAt:
        typeof parsed.decidedAt === "number" ? parsed.decidedAt : Date.now(),
    };
  } catch {
    return null;
  }
}

function writeCache(cache: HeroDayNightCache): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cache));
  } catch {
    // Ignore quota / private-mode failures.
  }
}

/**
 * Resolve which video to play for this visit.
 * Applies a pending boundary flag from a previous open tab when it still
 * matches local time; otherwise uses the current local clock.
 */
export function resolveHeroModeForVisit(date = new Date()): HeroDayNightMode {
  const computed = getHeroModeForDate(date);
  const cache = readCache();

  if (cache?.pendingMode && cache.pendingMode === computed) {
    writeCache({ mode: computed, decidedAt: date.getTime() });
    return computed;
  }

  writeCache({ mode: computed, decidedAt: date.getTime() });
  return computed;
}

/** Flag a day/night change for the next visit without swapping the playing video. */
export function flagPendingHeroMode(pendingMode: HeroDayNightMode): void {
  const cache = readCache();
  writeCache({
    mode: cache?.mode ?? getHeroModeForDate(),
    pendingMode,
    decidedAt: cache?.decidedAt ?? Date.now(),
  });
}
