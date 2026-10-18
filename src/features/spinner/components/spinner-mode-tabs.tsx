import { useLayoutEffect, useRef, type RefObject } from "react";
import { Icon } from "@/components/ui/icon";

export type SpinnerMode = "country" | "city";
export type ModeControls = {
  mode: SpinnerMode;
  groupId: string;
  loadingCities: boolean;
  cityError: string;
  focusRequestRef: RefObject<SpinnerMode | null>;
  onModeChange: (mode: SpinnerMode) => void;
};

export function SpinnerModeTabs({
  mode,
  groupId,
  loadingCities,
  focusRequestRef,
  onModeChange,
  disabled,
}: ModeControls & { disabled: boolean }) {
  const buttons = useRef<Partial<Record<SpinnerMode, HTMLButtonElement>>>({});
  useLayoutEffect(() => {
    if (disabled || focusRequestRef.current !== mode) return;
    buttons.current[mode]?.focus({ preventScroll: true });
    focusRequestRef.current = null;
  }, [mode, focusRequestRef, disabled]);
  return (
    <div
      role="tablist"
      aria-label="What to spin"
      className="mt-4 grid grid-cols-2 gap-1 rounded-control border border-border bg-page p-1"
    >
      {(["country", "city"] as const).map((target) => (
        <button
          key={target}
          ref={(node) => {
            if (node) buttons.current[target] = node;
          }}
          type="button"
          role="tab"
          id={`${groupId}-${mode}-${target}-tab`}
          aria-controls={`${groupId}-${target}-panel`}
          aria-selected={mode === target}
          aria-busy={target === "city" && loadingCities}
          tabIndex={mode === target ? 0 : -1}
          disabled={disabled}
          onClick={() => onModeChange(target)}
          onKeyDown={(event) => {
            if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key))
              return;
            event.preventDefault();
            const next =
              event.key === "Home"
                ? "country"
                : event.key === "End"
                  ? "city"
                  : target === "country"
                    ? "city"
                    : "country";
            buttons.current[next]?.focus({ preventScroll: true });
            onModeChange(next);
          }}
          className={`inline-flex min-h-touch min-w-0 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors motion-reduce:transition-none disabled:opacity-50 ${mode === target ? "bg-surface text-brand shadow-card" : "text-muted hover:bg-surface hover:text-foreground"}`}
        >
          <Icon
            name={
              target === "city" && loadingCities
                ? "loading"
                : target === "country"
                  ? "globe"
                  : "pin"
            }
            className={`size-4 shrink-0 ${target === "city" && loadingCities ? "motion-safe:animate-spin" : ""}`}
          />
          {target === "country" ? "Countries" : "Cities"}
        </button>
      ))}
    </div>
  );
}
