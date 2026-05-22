import Image from "next/image";
import Link from "next/link";

import { SiteNav } from "@/components/site/SiteNav";
import { siteConfig } from "@/lib/site";

const SITE_LOGO_SRC = "/images/home/EdwinspiraLogo.png";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-background"
      >
        Skip to content
      </a>
      <header className="relative z-20 w-full max-w-full overflow-x-hidden bg-black">
        <div className="flex h-20 w-full max-w-full min-w-0 items-center justify-between gap-3 px-4 sm:h-24 sm:gap-12 sm:px-10 lg:gap-16 lg:px-16">
          <Link
            href="/"
            className="group flex h-full min-h-0 min-w-0 shrink items-center gap-2 transition-opacity hover:opacity-90 sm:shrink-0 sm:gap-5"
            aria-label={`${siteConfig.name} home`}
          >
            <span className="relative aspect-square h-full shrink-0">
              <Image
                src={SITE_LOGO_SRC}
                alt=""
                fill
                sizes="(max-width: 640px) 80px, 96px"
                className="object-contain"
                priority
              />
            </span>
            <span className="truncate text-sm leading-none font-semibold tracking-[0.18em] text-foreground uppercase sm:text-lg sm:tracking-[0.22em]">
              EDWINSPIRA
            </span>
          </Link>
          <SiteNav />
        </div>
      </header>
      <main id="main-content" className="w-full max-w-full overflow-x-hidden">
        {children}
      </main>
      <footer className="relative z-20 border-t border-border bg-background">
        <div className="mx-auto max-w-5xl px-6 py-8">
          <p className="font-mono text-xs text-muted">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
      </footer>
    </>
  );
}
