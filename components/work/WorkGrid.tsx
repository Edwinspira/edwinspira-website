import { WorkCard } from "@/components/work/WorkCard";
import type { WorkListItem } from "@/lib/sanity/types";

type WorkGridProps = {
  works: WorkListItem[];
};

export function WorkGrid({ works }: WorkGridProps) {
  return (
    <ul className="work-grid mt-10 grid list-none gap-6 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-3">
      {works.map((work) => (
        <li key={work._id}>
          <WorkCard work={work} />
        </li>
      ))}
    </ul>
  );
}
