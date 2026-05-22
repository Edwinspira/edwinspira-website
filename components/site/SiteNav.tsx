"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { siteConfig } from "@/lib/site";

const NAV_ICON_SRC = "/images/home/NavbarIcon.png";

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") {
    return pathname === "/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteNav() {
  const pathname = usePathname();

  return (
    <nav aria-label="Primary" className="h-full shrink-0">
      <ul className="flex h-full items-center gap-4 sm:gap-10 lg:gap-12">
        {siteConfig.nav.map((item) => {
          const active = isNavActive(pathname, item.href);

          return (
            <li key={item.href} className="flex h-full">
              <Link
                href={item.href}
                className="relative flex h-full w-[4.25rem] items-center justify-center px-0.5 sm:w-[6.25rem] sm:px-1"
                aria-current={active ? "page" : undefined}
              >
                <span
                  className={
                    active
                      ? "site-nav-link-active relative z-10 text-sm leading-none font-semibold tracking-[0.16em] uppercase sm:text-lg sm:tracking-[0.2em]"
                      : "relative z-10 text-sm leading-none font-semibold tracking-[0.16em] text-muted uppercase transition-colors hover:text-foreground sm:text-lg sm:tracking-[0.2em]"
                  }
                >
                  {item.label}
                </span>
                <span
                  className="pointer-events-none absolute left-1/2 top-[calc(50%+0.85rem)] h-4 w-20 -translate-x-1/2 sm:top-[calc(50%+0.95rem)] sm:h-5 sm:w-24"
                  aria-hidden={!active}
                >
                  <Image
                    src={NAV_ICON_SRC}
                    alt=""
                    fill
                    sizes="(max-width: 640px) 80px, 96px"
                    className={
                      active
                        ? "site-nav-icon-active object-contain object-center"
                        : "object-contain object-center opacity-0"
                    }
                  />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
