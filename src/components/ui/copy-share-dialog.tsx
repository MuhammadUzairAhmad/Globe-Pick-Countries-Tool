import { useEffect, useRef } from "react";
import { Button } from "./button";
import { Icon } from "./icon";
import { Toast } from "./toast";

export type CopyShareTarget = {
  title: string;
  description: string;
  text: string;
  link: boolean;
  canShare: boolean;
};

export function CopyShareDialog({
  target,
  pending,
  copied,
  message,
  messageId,
  onCopy,
  onShare,
  onClose,
  onDismiss,
}: {
  target: CopyShareTarget;
  pending: "copy" | "share" | null;
  copied: boolean;
  message: string;
  messageId: number;
  onCopy: () => void;
  onShare: () => void;
  onClose: () => void;
  onDismiss: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    const trigger =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    dialog?.showModal();
    return () => {
      dialog?.close();
      if (trigger?.isConnected) trigger.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="share-title"
      aria-describedby="share-description"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-card border border-border bg-surface p-card text-foreground shadow-floating backdrop:bg-overlay/40 dark:backdrop:bg-overlay/70"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 id="share-title" className="text-card-title">
          {target.title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="flex size-touch shrink-0 items-center justify-center rounded-control text-muted hover:bg-page"
        >
          <Icon name="close" />
        </button>
      </div>
      <p id="share-description" className="mt-2 text-sm text-muted">
        {target.description}
      </p>
      <label htmlFor="share-text" className="mt-5 block text-sm font-semibold">
        {target.link ? "Share link" : "Result text"}
      </label>
      <textarea
        id="share-text"
        readOnly
        value={target.text}
        rows={target.link ? 3 : 7}
        onFocus={(event) => event.currentTarget.select()}
        className="mt-2 w-full resize-y rounded-control border border-border bg-page p-3 text-sm"
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          onClick={onCopy}
          disabled={Boolean(pending)}
          aria-busy={pending === "copy"}
        >
          {pending === "copy" && (
            <Icon
              name="loading"
              className="size-4 animate-spin motion-reduce:animate-none"
            />
          )}
          {copied && <Icon name="check" className="size-4" />}
          {pending === "copy"
            ? "Copying…"
            : copied
              ? "Copied"
              : target.link
                ? "Copy link"
                : "Try copying again"}
        </Button>
        {target.canShare && (
          <Button
            variant="secondary"
            onClick={onShare}
            disabled={Boolean(pending)}
            aria-busy={pending === "share"}
          >
            {pending === "share" && (
              <Icon
                name="loading"
                className="size-4 animate-spin motion-reduce:animate-none"
              />
            )}
            {pending === "share" ? "Opening…" : "Share on your device"}
          </Button>
        )}
      </div>
      {message && (
        <Toast
          key={messageId}
          message={message}
          onDismiss={onDismiss}
          floating={false}
        />
      )}
    </dialog>
  );
}
