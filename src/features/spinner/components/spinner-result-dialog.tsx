import { useEffect, useId, useRef, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { ConfettiBurst } from "./confetti-burst";

export function SpinnerResultDialog({
  country,
  replay,
  celebrate,
  canSpin,
  pending,
  children,
  feedback,
  onClose,
  onSpinAgain,
}: {
  country: string;
  replay: boolean;
  celebrate: boolean;
  canSpin: boolean;
  pending: boolean;
  children: ReactNode;
  feedback: ReactNode;
  onClose: () => void;
  onSpinAgain: () => void;
}) {
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
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-border p-4 sm:p-6">
          <div className="min-w-0">
            <h2
              ref={headingRef}
              id={`${id}-title`}
              tabIndex={-1}
              className="break-words text-card-title focus:outline-none sm:text-section-title"
            >
              {replay ? `Saved country: ${country}` : `You picked ${country}`}
            </h2>
            <p id={`${id}-description`} className="mt-2 text-sm text-muted">
              {replay
                ? "Viewing this country doesn’t count as a new pick."
                : "Keep this pick or spin for another country."}
            </p>
          </div>
          <button
            type="button"
            aria-label="Close country result"
            onClick={onClose}
            className="flex size-touch shrink-0 items-center justify-center rounded-control text-muted hover:bg-surface"
          >
            <Icon name="close" />
          </button>
        </div>
        <div className="min-h-0 overflow-y-auto overscroll-contain p-4 sm:p-6">
          {children}
          {!canSpin && (
            <p className="mt-4 text-sm text-muted">
              That was the last available country. Close this window to change
              continents, allow repeats, or reset your picks.
            </p>
          )}
          {feedback}
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-2 border-t border-border bg-surface p-4 sm:px-6">
          <Button variant="secondary" onClick={onClose}>
            Back to wheel
          </Button>
          <Button disabled={!canSpin || pending} onClick={onSpinAgain}>
            Spin again
          </Button>
        </div>
      </div>
    </dialog>
  );
}
