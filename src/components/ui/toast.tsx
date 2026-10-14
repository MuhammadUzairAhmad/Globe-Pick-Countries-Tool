import { Icon } from "./icon";

export function Toast({
  message,
  onDismiss,
  floating = true,
}: {
  message: string;
  onDismiss: () => void;
  floating?: boolean;
}) {
  return (
    <div
      className={
        floating
          ? "fixed inset-x-4 bottom-5 z-50 mx-auto max-w-reading print:hidden"
          : "mt-4"
      }
    >
      <div className="flex items-center gap-3 rounded-control border border-border bg-surface p-4 shadow-floating">
        <Icon name="info" className="size-5 shrink-0 text-brand" />
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="min-w-0 flex-1 text-sm font-medium"
        >
          {message}
        </p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss notification"
          className="flex size-touch shrink-0 items-center justify-center rounded-control text-muted hover:bg-page"
        >
          <Icon name="close" />
        </button>
      </div>
    </div>
  );
}
