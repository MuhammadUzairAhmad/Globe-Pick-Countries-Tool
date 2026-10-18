import { useEffect, useId, useRef, type ReactNode } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ConfettiBurst } from "./confetti-burst";
import type { Place } from "@/features/generator/types";

export function SpinnerResultDialog({
  place,
  replay,
  celebrate,
  canSpin,
  pending,
  children,
  feedback,
  onClose,
  onSpinAgain,
}: {
  place: Place;
  replay: boolean;
  celebrate: boolean;
  canSpin: boolean;
  pending: boolean;
  children: ReactNode;
  feedback: ReactNode;
  onClose: () => void;
  onSpinAgain: () => void;
}) {
  const country = place.country;
  const isCity = place.kind === "city";
  const noun = isCity ? "city" : "country";
  const name = isCity ? place.city.name : country.name;
  const subtitle = isCity
    ? `${place.city.adminRegion ? `${place.city.adminRegion}, ` : ""}${country.name}`
    : country.continent;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const id = useId();
  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.showModal();
    headingRef.current?.focus({ preventScroll: true });
    return () => {
      dialog?.close();
      document.body.style.overflow = previousOverflow;
      if (trigger?.isConnected && trigger.getClientRects().length)
        trigger.focus({ preventScroll: true });
    };
  }, []);
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      onCancel={(event) => {
        if (event.target !== event.currentTarget) return;
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const controls = [
          ...event.currentTarget.querySelectorAll<HTMLElement>(
            'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"])',
          ),
        ].filter(
          (control) => control.getClientRects().length && control.tabIndex >= 0,
        );
        const first = controls[0];
        const last = controls.at(-1);
        const active = document.activeElement;
        if (
          event.shiftKey &&
          (active === first ||
            active === headingRef.current ||
            active === event.currentTarget)
        ) {
          event.preventDefault();
          last?.focus({ preventScroll: true });
        } else if (
          !event.shiftKey &&
          (active === last || active === event.currentTarget)
        ) {
          event.preventDefault();
          first?.focus({ preventScroll: true });
        }
      }}
      className="fixed inset-0 m-auto w-[calc(100%-2rem)] max-w-xl overflow-visible rounded-card border border-border bg-page p-0 text-foreground shadow-floating backdrop:bg-overlay/40 dark:backdrop:bg-overlay/70"
    >
      <div className="relative flex max-h-[calc(100dvh-2rem)] flex-col overflow-hidden rounded-card">
        <ConfettiBurst enabled={celebrate} />
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border bg-brand-soft/50 p-4 sm:p-6">
          <div className="flex min-w-0 flex-col items-start gap-3 min-[360px]:flex-row min-[360px]:items-center sm:gap-4">
            <Image
              src={country.flag}
              width={80}
              height={60}
              alt=""
              unoptimized
              className="h-12 w-16 shrink-0 rounded-control border border-border bg-surface object-contain sm:h-15 sm:w-20"
            />
            <div className="min-w-0 w-full">
              <p
                aria-hidden="true"
                className="mb-1 text-xs font-medium text-muted"
              >
                {replay ? `Saved ${noun}` : "You picked"}
              </p>
              <h2
                ref={headingRef}
                id={`${id}-title`}
                tabIndex={-1}
                className="break-words text-card-title focus:outline-none sm:text-section-title"
              >
                <span className="sr-only">
                  {replay ? `Saved ${noun}: ` : "You picked "}
                </span>
                {name}
              </h2>
              <p className="mt-1 text-sm text-muted">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            aria-label={`Close ${noun} result`}
            onClick={onClose}
            className="flex size-touch shrink-0 items-center justify-center rounded-control text-muted hover:bg-surface"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6">
          <p id={`${id}-description`} className="sr-only">
            {replay
              ? `Viewing this ${noun} doesn’t count as a new pick.`
              : `Save this ${noun} or spin again.`}
          </p>
          {children}
          {!canSpin && (
            <p className="mt-4 text-sm text-muted">
              {isCity
                ? "That was the last available city or town. Close this window to choose another country, allow repeats, or reset your picks."
                : "That was the last available country. Close this window to change continents, allow repeats, or reset your picks."}
            </p>
          )}
          {feedback}
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-2 border-t border-border bg-surface p-4 sm:px-6">
          <Button variant="secondary" size="compact" onClick={onClose}>
            Back to wheel
          </Button>
          <Button
            size="compact"
            disabled={!canSpin || pending}
            onClick={onSpinAgain}
          >
            <Icon name="rotate" className="size-4 shrink-0" />
            Spin again
          </Button>
        </div>
      </div>
    </dialog>
  );
}
