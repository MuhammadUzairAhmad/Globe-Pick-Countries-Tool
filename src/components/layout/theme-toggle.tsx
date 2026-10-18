"use client";

import { useSyncExternalStore } from "react";
import { Icon } from "@/components/ui/icon";
import {
  changeTheme,
  getThemeSnapshot,
  getServerThemeSnapshot,
  subscribeTheme,
} from "@/lib/theme-browser";

export function ThemeToggle() {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );
  return (
    <button
      type="button"
      aria-label="Toggle dark mode"
      aria-pressed={theme === "dark"}
      onClick={() =>
        changeTheme(getThemeSnapshot() === "dark" ? "light" : "dark")
      }
      className="inline-flex size-touch shrink-0 items-center justify-center rounded-control border border-border bg-surface text-foreground transition-colors hover:bg-brand-soft active:bg-brand-soft motion-reduce:transition-none"
    >
      <Icon name="moon" className="size-5 dark:hidden" />
      <Icon name="sun" className="hidden size-5 dark:block" />
    </button>
  );
}
