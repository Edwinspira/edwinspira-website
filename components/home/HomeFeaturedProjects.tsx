import Link from "next/link";

import { CyberBorder } from "@/components/CyberBorder";
import { CyberLevelBadge, CyberRuleEndcap } from "@/components/CyberDeco";
import { WorkCard } from "@/components/work/WorkCard";
import { getFeaturedWorks } from "@/lib/sanity/get-featured-works";

export async function HomeFeaturedProjects() {
  const works = await getFeaturedWorks();

  return (
    <section
      className="home-featured-projects relative z-10 w-full bg-black"
      aria-labelledby="featured-projects-heading"
    >
      <div className="home-section-pad w-full px-[var(--home-pad)]">
        <CyberBorder className="w-full">
          <div className="flex flex-wrap items-end gap-4 sm:gap-6">
            <div className="flex min-w-0 flex-wrap items-baseline gap-x-4 gap-y-2">
              <h2
                id="featured-projects-heading"
                className="font-mono text-lg tracking-[0.2em] text-foreground uppercase sm:text-xl lg:text-2xl"
              >
                {"// FEATURED PROJECTS"}
              </h2>
              <span className="font-mono text-lg tracking-wide text-[var(--home-stat-red)] sm:text-xl lg:text-2xl">
                注目のプロジェクト
              </span>
            </div>
            <CyberLevelBadge
              level="02"
              className="ml-auto shrink-0 max-sm:flex max-sm:w-full max-sm:justify-end"
            />
          </div>

          <div className="home-section-rule mt-6 sm:mt-8" aria-hidden>
            <div className="home-section-rule__line" />
            <CyberRuleEndcap />
          </div>

          {works.length > 0 ? (
            <ul className="work-grid mt-10 grid list-none gap-3 sm:mt-16 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-5">
              {works.map((work, index) => (
                <li key={work._id}>
                  <WorkCard work={work} index={index + 1} />
                </li>
              ))}
            </ul>
          ) : (
            <div
              className="home-featured-projects__empty mt-10 min-h-[14rem] sm:mt-16 lg:min-h-[18rem]"
              aria-hidden
            />
          )}

          <div className="mt-10 flex justify-end sm:mt-12">
            <Link href="/work" className="home-view-all-projects">
              <span className="home-view-all-projects__frame" aria-hidden>
                <span className="home-view-all-projects__corner home-view-all-projects__corner--tl" />
                <span className="home-view-all-projects__corner home-view-all-projects__corner--tr" />
                <span className="home-view-all-projects__corner home-view-all-projects__corner--bl" />
                <span className="home-view-all-projects__corner home-view-all-projects__corner--br" />
                <span className="home-view-all-projects__scan" />
              </span>
              <span className="home-view-all-projects__label">
                View all projects
              </span>
              <span className="home-view-all-projects__arrow" aria-hidden>
                <svg
                  viewBox="0 0 24 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="home-view-all-projects__arrow-svg"
                >
                  <path
                    d="M1 6H21M21 6L16 1M21 6L16 11"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="square"
                  />
                </svg>
              </span>
            </Link>
          </div>
        </CyberBorder>
      </div>
    </section>
  );
}
