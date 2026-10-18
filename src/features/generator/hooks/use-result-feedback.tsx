"use client";

import { useEffect, useRef, useState } from "react";
import { Toast } from "@/components/ui/toast";
import {
  CopyShareDialog,
  type CopyShareTarget,
} from "@/components/ui/copy-share-dialog";
import { copyText, getClipboard, shareLink } from "@/lib/share/browser";
import { createShareUrl } from "@/lib/share/url-state";
import type { Mode, Filters } from "../types";

export function useResultFeedback(mode: Mode) {
  const [dialog, setDialog] = useState<CopyShareTarget | null>(null);
  const [toast, setToast] = useState<{ id: number; message: string } | null>(
    null,
  );
  const [pending, setPending] = useState("");
  const [copied, setCopied] = useState("");
  const busy = useRef(false);
  const feedbackId = useRef(0);
  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 6000);
    return () => window.clearTimeout(timer);
  }, [toast]);
  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(""), 3000);
    return () => window.clearTimeout(timer);
  }, [copied, toast]);
  function notify(message: string) {
    setToast({ id: ++feedbackId.current, message });
  }
  async function copy(text: string, id: string, link = false) {
    if (busy.current) return;
    busy.current = true;
    setPending(id);
    setCopied("");
    setToast(null);
    try {
      const feedback = await copyText(text, getClipboard());
      if (feedback.outcome === "copied") {
        setCopied(id);
        notify(
          link
            ? "Link copied. Paste it into a message to share."
            : "Copied to clipboard.",
        );
      } else {
        if (id !== "dialog-copy")
          setDialog({
            title: "Copy your results",
            description:
              "Your browser blocked clipboard access. Select the text below, then use your browser’s Copy command.",
            text,
            link: false,
            canShare: false,
          });
        notify(feedback.message);
      }
    } finally {
      busy.current = false;
      setPending("");
    }
  }
  function share(filters: Filters, ids: string[]) {
    if (busy.current) return;
    try {
      const url = createShareUrl(window.location.origin, mode, filters, ids);
      setCopied("");
      setToast(null);
      setDialog({
        title: ids.length ? "Share your results" : "Share your filters",
        description: ids.length
          ? "Anyone with this link can see the same results. Copy it into a message, email, or post."
          : "This link opens your filters. The person you send it to can generate their own results.",
        text: url,
        link: true,
        canShare: typeof navigator.share === "function",
      });
    } catch (error) {
      notify(
        error instanceof Error
          ? error.message
          : "We couldn’t create a share link. Please try again.",
      );
    }
  }
  async function shareOnDevice() {
    if (!dialog || busy.current) return;
    busy.current = true;
    setPending("dialog-share");
    setToast(null);
    try {
      const feedback = await shareLink(
        dialog.text,
        navigator.share?.bind(navigator),
        getClipboard(),
      );
      if (feedback.outcome === "copied") setCopied("dialog-copy");
      notify(feedback.message);
    } finally {
      busy.current = false;
      setPending("");
    }
  }
  return {
    copy,
    share,
    pending,
    copied,
    feedback: (
      <>
        {dialog && (
          <CopyShareDialog
            target={dialog}
            pending={
              pending === "dialog-copy"
                ? "copy"
                : pending === "dialog-share"
                  ? "share"
                  : null
            }
            copied={copied === "dialog-copy"}
            message={toast?.message ?? ""}
            messageId={toast?.id ?? 0}
            onDismiss={() => setToast(null)}
            onCopy={() => copy(dialog.text, "dialog-copy", dialog.link)}
            onShare={shareOnDevice}
            onClose={() => setDialog(null)}
          />
        )}
        {toast && !dialog && (
          <Toast
            key={toast.id}
            message={toast.message}
            onDismiss={() => setToast(null)}
          />
        )}
      </>
    ),
  };
}
