"use client";

import Link from "next/link";
import { useState } from "react";
import type { NavigationGroup } from "@/lib/seo/navigation";

export function MobileNavigation({
  groups,
}: {
  groups: readonly NavigationGroup[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative md:hidden"
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          setOpen(false);
          document.getElementById("menu-toggle")?.focus();
        }
      }}
    >
      <button
        id="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen(!open)}
        className="inline-flex min-h-touch items-center gap-2 rounded-control border border-border bg-surface px-4 text-sm font-medium"
      >
        {open ? "Close" : "Menu"}
        <span aria-hidden="true">{open ? "×" : "☰"}</span>
      </button>
      <nav
        id="mobile-menu"
        aria-label="Mobile navigation"
        hidden={!open}
        className="absolute right-0 top-full z-30 mt-3 max-h-[calc(100dvh-7rem)] w-[min(22rem,calc(100vw-2rem))] overflow-y-auto overscroll-contain rounded-card border border-border bg-surface p-3 shadow-floating"
      >
        {groups.map((group) => (
          <div
            key={group.title}
            className="border-border py-2 first:pt-0 last:pb-0 [&+div]:border-t"
          >
            <p className="px-3 py-2 text-xs font-semibold text-muted">
              {group.title}
            </p>
            <ul>
              {group.links.map(({ path, label }) => (
                <li key={path}>
                  <Link
                    href={path}
                    prefetch={
                      path === "/random-city-generator" ? false : undefined
                    }
                    onClick={() => setOpen(false)}
                    className="flex min-h-touch items-center rounded-control px-3 text-sm hover:bg-brand-soft"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  );
}
