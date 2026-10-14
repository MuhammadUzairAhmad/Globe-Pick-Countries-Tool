type ClipboardAccess = { writeText: (text: string) => Promise<void> };

export type BrowserFeedback = {
  message: string;
  fallback: string;
  outcome: "copied" | "manual" | "shared" | "cancelled";
};

export function getClipboard(): ClipboardAccess | undefined {
  try {
    return navigator.clipboard;
  } catch {
    return undefined;
  }
}

export async function copyText(
  text: string,
  clipboard?: ClipboardAccess,
): Promise<BrowserFeedback> {
  try {
    if (!clipboard) throw new Error("Clipboard unavailable");
    await clipboard.writeText(text);
    return { message: "Copied to clipboard.", fallback: "", outcome: "copied" };
  } catch {
    return {
      message:
        "Your browser couldn’t copy this. Select the text and copy it manually.",
      fallback: text,
      outcome: "manual",
    };
  }
}

export async function shareLink(
  url: string,
  share?: (data: ShareData) => Promise<void>,
  clipboard?: ClipboardAccess,
): Promise<BrowserFeedback> {
  if (share) {
    try {
      await share({ title: "My GlobePick results", url });
      return { message: "Finished sharing.", fallback: "", outcome: "shared" };
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError")
        return {
          message: "Sharing cancelled. Your link is still ready to copy.",
          fallback: "",
          outcome: "cancelled",
        };
    }
  }
  const feedback = await copyText(url, clipboard);
  return {
    ...feedback,
    message:
      feedback.outcome === "copied"
        ? "Link copied. Paste it into a message to share."
        : "Device sharing isn’t available. Select and copy the link instead.",
  };
}
