import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";

export function ResultActions({
  saved,
  disabled,
  label,
  copying,
  copied,
  onSave,
  onCopy,
  onShare,
}: {
  saved: boolean;
  disabled: boolean;
  label: string;
  copying: boolean;
  copied: boolean;
  onSave: () => void;
  onCopy: () => void;
  onShare: () => void;
}) {
  return (
    <>
      <Button
        variant="secondary"
        className="min-w-0 gap-1 px-2"
        onClick={onSave}
        disabled={disabled}
        aria-pressed={saved}
        aria-label={`${saved ? "Unsave" : "Save"} ${label}`}
      >
        {saved && (
          <Icon name="check" className="hidden size-3 shrink-0 sm:block" />
        )}
        {saved ? "Saved" : "Save"}
      </Button>
      <Button
        variant="secondary"
        className="min-w-0 gap-1 px-2"
        onClick={onCopy}
        disabled={disabled}
        aria-label={`Copy ${label}`}
        aria-busy={copying}
      >
        {copying && (
          <Icon
            name="loading"
            className="hidden size-3 shrink-0 animate-spin motion-reduce:animate-none sm:block"
          />
        )}
        {copied && (
          <Icon name="check" className="hidden size-3 shrink-0 sm:block" />
        )}
        {copying ? "Copying…" : copied ? "Copied" : "Copy"}
      </Button>
      <Button
        variant="secondary"
        className="min-w-0 gap-1 px-2"
        onClick={onShare}
        disabled={disabled}
        aria-label={`Share ${label}`}
        aria-haspopup="dialog"
      >
        Share
      </Button>
    </>
  );
}
