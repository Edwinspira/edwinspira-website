import { WORK_CATEGORIES, type WorkCategory } from "@/lib/sanity/types";

export const WORK_CATEGORY_LABELS: Record<WorkCategory, string> = {
  software: "Software",
  art: "Art",
  video: "Video",
  sculpture3d: "3D Sculpture",
};

export const WORK_CATEGORY_JP_LABELS: Record<WorkCategory, string> = {
  software: "ソフトウェア",
  art: "アート",
  video: "ビデオ",
  sculpture3d: "３Ｄ彫刻",
};

export const WORK_CATEGORY_EN_LABELS: Record<WorkCategory, string> = {
  software: "SOFTWARE",
  art: "ART",
  video: "VIDEO",
  sculpture3d: "3D SCULPTURE",
};

export function isWorkCategory(value: string): value is WorkCategory {
  return (WORK_CATEGORIES as readonly string[]).includes(value);
}
