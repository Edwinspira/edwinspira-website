import Link from "next/link";

import { WORK_CATEGORIES, type WorkCategory } from "@/lib/sanity/types";
import { WORK_CATEGORY_LABELS } from "@/lib/work-labels";

type CategoryFilterProps = {
  activeCategory: WorkCategory | null;
};

function filterHref(category: WorkCategory | null): string {
  return category ? `/work?category=${category}` : "/work";
}

function linkClassName(isActive: boolean): string {
  const base =
    "rounded border px-3 py-1.5 font-mono text-[0.65rem] tracking-[0.14em] uppercase transition-colors sm:text-xs";
  return isActive
    ? `${base} border-[var(--home-stat-red)] bg-[var(--home-stat-red)]/10 text-foreground`
    : `${base} border-border text-muted hover:border-[var(--home-stat-red)]/50 hover:text-foreground`;
}

export function CategoryFilter({ activeCategory }: CategoryFilterProps) {
  return (
    <nav aria-label="Filter by category" className="mt-8">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link href={filterHref(null)} className={linkClassName(activeCategory === null)}>
            All
          </Link>
        </li>
        {WORK_CATEGORIES.map((category) => (
          <li key={category}>
            <Link
              href={filterHref(category)}
              className={linkClassName(activeCategory === category)}
            >
              {WORK_CATEGORY_LABELS[category]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
