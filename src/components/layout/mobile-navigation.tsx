"use client";

import Link from "next/link";
import { useState } from "react";

export function MobileNavigation({
  links,
}: {
  links: readonly { path: string; label: string }[];
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="relative xl:hidden"
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
        className="absolute right-0 top-full z-30 mt-3 w-60 rounded-card border border-border bg-surface p-2 shadow-floating"
      >
        {links.map(({ path, label }) => (
          <Link
            key={path}
            href={path}
            prefetch={path === "/random-city-generator" ? false : undefined}
            onClick={() => setOpen(false)}
            className="flex min-h-touch items-center rounded-control px-4 text-sm hover:bg-brand-soft"
          >
            {label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
