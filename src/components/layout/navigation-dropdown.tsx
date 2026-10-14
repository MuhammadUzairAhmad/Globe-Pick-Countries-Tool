"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { Icon } from "@/components/ui/icon";
import type { NavigationGroup } from "@/lib/seo/navigation";

export function NavigationDropdown({
  label,
  groups,
}: {
  label: string;
  groups: readonly NavigationGroup[];
}) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const focusFirst = useRef(false);
  useEffect(() => {
    if (!open) return;
    if (focusFirst.current) {
      focusFirst.current = false;
      root.current?.querySelector<HTMLAnchorElement>("a[href]")?.focus();
    }
    function outside(event: PointerEvent) {
      if (event.target instanceof Node && !root.current?.contains(event.target))
        setOpen(false);
    }
    document.addEventListener("pointerdown", outside);
    return () => document.removeEventListener("pointerdown", outside);
  }, [open]);
  return (
    <div
      ref={root}
      className="relative"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(false);
          trigger.current?.focus();
        }
      }}
    >
      <button
        ref={trigger}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            if (open)
              root.current
                ?.querySelector<HTMLAnchorElement>("a[href]")
                ?.focus();
            else {
              focusFirst.current = true;
              setOpen(true);
            }
          }
        }}
        className="inline-flex min-h-touch items-center gap-2 rounded-control px-4 text-sm font-medium text-foreground transition-colors hover:bg-brand-soft aria-expanded:bg-brand-soft aria-expanded:text-brand motion-reduce:transition-none"
      >
        {label}
        <Icon
          name="chevron-down"
          className={`size-4 transition-transform motion-reduce:transition-none ${open ? "rotate-180" : ""}`}
        />
      </button>
      <div
        id={id}
        hidden={!open}
        className="absolute right-0 top-full z-30 mt-3 w-72 rounded-card border border-border bg-surface p-3 shadow-floating"
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
              {group.links.map((link) => (
                <li key={link.path}>
                  <Link
                    href={link.path}
                    prefetch={
                      link.path === "/random-city-generator" ? false : undefined
                    }
                    onClick={() => setOpen(false)}
                    className="flex min-h-touch items-center rounded-control px-3 text-sm text-foreground hover:bg-brand-soft hover:text-brand"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
