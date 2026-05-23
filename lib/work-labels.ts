import { WORK_CATEGORIES, type WorkCategory } from "@/lib/sanity/types";

export const WORK_CATEGORY_LABELS: Record<WorkCategory, string> = {
  software: "Software",
  art: "Art",
  video: "Video",
  sculpture3d: "3D Sculpture",
};

export function isWorkCategory(value: string): value is WorkCategory {
  return (WORK_CATEGORIES as readonly string[]).includes(value);
}
