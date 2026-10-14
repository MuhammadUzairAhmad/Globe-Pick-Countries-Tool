"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { ResultsGrid } from "./results-grid";
import { ResultActions } from "./result-actions";
import { GeneratorFilters } from "./generator-filters";
import { PlaceResultCard } from "./place-result-card";
import { defaultFilters, formatPlace } from "../lib/selection";
import { useGenerator } from "../hooks/use-generator";
import { GuessReveal } from "@/features/learning/guess-reveal";
import { SavedPlaces } from "@/features/saved-places/saved-places";
import { copyText, getClipboard, shareLink } from "@/lib/share/browser";
import { Toast } from "@/components/ui/toast";
import {
  CopyShareDialog,
  type CopyShareTarget,
} from "@/components/ui/copy-share-dialog";
import { Icon } from "@/components/ui/icon";
import { createShareUrl } from "@/lib/share/url-state";
import type { Country, Mode, Place } from "../types";

export function GeneratorWorkspace({
  countries,
  mode,
  example,
}: {
  countries: Country[];
  mode: Mode;
  example?: ReactNode;
}) {
  const { state, dispatch, byId, eligible, remaining, generate } = useGenerator(
    countries,
    mode,
  );
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
  const filters = state.saved.filters;
  const results = state.resultIds
    .map((id) => byId.get(id))
    .filter((place): place is Place => Boolean(place));
  const hiddenIds = new Set(
    mode === "capital" && filters.guess
      ? state.resultIds.filter((id) => !state.revealed.includes(id))
      : [],
  );
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
  function share(ids: string[]) {
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
  return (
    <div className="mt-8">
      {state.storageWarning && (
        <div className="mb-5" role="status">
          <Notice title="Browser saving notice">{state.storageWarning}</Notice>
        </div>
      )}
      <div className="grid items-start gap-6 lg:grid-cols-3">
        <GeneratorFilters
          countries={countries}
          value={filters}
          onChange={(value) => dispatch({ type: "filters", filters: value })}
          eligible={eligible.length}
          remaining={remaining.length}
          mode={mode}
          onGenerate={generate}
          ready={state.hydrated}
          onResetFilters={() => {
            dispatch({ type: "filters", filters: defaultFilters });
            dispatch({
              type: "message",
              message:
                "Filters cleared. Previously picked places are still excluded while repeats are off.",
            });
          }}
          onResetPool={() => dispatch({ type: "reset-pool" })}
        />
        <section
          aria-labelledby="results-title"
          className="min-w-0 lg:col-span-2"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h2 id="results-title" className="text-card-title font-semibold">
              Your results
            </h2>
            <p className="text-sm text-muted">
              {results.length} {results.length === 1 ? "result" : "results"}
              {state.replay ? " from a saved link or selection" : ""}
            </p>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            <Button
              variant="secondary"
              onClick={() => share(hiddenIds.size ? [] : state.resultIds)}
              disabled={!state.hydrated || Boolean(pending)}
              aria-haspopup="dialog"
            >
              {hiddenIds.size || !results.length
                ? "Share filters"
                : "Share results"}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                copy(results.map(formatPlace).join("\n\n"), "batch-copy")
              }
              disabled={
                !results.length || Boolean(hiddenIds.size) || Boolean(pending)
              }
              aria-busy={pending === "batch-copy"}
            >
              {pending === "batch-copy" && (
                <Icon
                  name="loading"
                  className="size-4 animate-spin motion-reduce:animate-none"
                />
              )}
              {copied === "batch-copy" && (
                <Icon name="check" className="size-4" />
              )}
              {pending === "batch-copy"
                ? "Copying…"
                : copied === "batch-copy"
                  ? "Copied"
                  : "Copy results"}
            </Button>
          </div>
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="mb-4 min-h-6 text-sm text-muted"
          >
            {state.message ||
              (state.hydrated
                ? "Ready when you are."
                : "Loading your saved settings…")}
          </p>
          {state.replay && (
            <div className="mb-4">
              <Notice title="Saved selection">
                You’re viewing an earlier selection. Opening it doesn’t count as
                a new pick.
              </Notice>
            </div>
          )}
          {hiddenIds.size > 0 && (
            <p className="mb-4 text-sm text-muted">
              Reveal an answer before copying, saving, or sharing it. You can
              share your filters without giving away the answers.
            </p>
          )}
          {!remaining.length && (
            <div className="mb-5">
              <Notice
                title={
                  eligible.length
                    ? "You’ve picked every matching place"
                    : "No matching places"
                }
              >
                {eligible.length
                  ? "Reset picked places, allow repeats, or change your filters to keep going."
                  : "No countries match these filters. Try another continent or clear your country choices."}
              </Notice>
            </div>
          )}
          {!results.length ? (
            <Card>
              <h3 className="text-card-title font-semibold">
                Ready to pick a {mode}?
              </h3>
              <p className="mt-3 text-muted">
                Choose a continent or keep all countries, then select Generate{" "}
                {mode === "country" ? "countries" : "capitals"} to see your
                results.
              </p>
            </Card>
          ) : (
            <ResultsGrid>
              {results.map((place) => {
                const hidden = hiddenIds.has(place.id);
                const favorite = state.saved.favorites.includes(place.id);
                return (
                  <PlaceResultCard
                    key={place.id}
                    place={place}
                    answerHidden={hidden}
                    learning={
                      filters.guess && place.kind === "capital" ? (
                        <GuessReveal
                          key={state.revision}
                          place={place}
                          revealed={!hidden}
                          onReveal={(message) => {
                            dispatch({ type: "reveal", id: place.id });
                            dispatch({ type: "message", message });
                          }}
                        />
                      ) : undefined
                    }
                    actions={
                      <ResultActions
                        saved={favorite}
                        disabled={hidden || Boolean(pending)}
                        copying={pending === `copy-${place.id}`}
                        copied={copied === `copy-${place.id}`}
                        label={
                          hidden
                            ? place.country.name
                            : place.kind === "country"
                              ? place.country.name
                              : place.capital.name
                        }
                        onSave={() =>
                          dispatch({ type: "favorite", id: place.id })
                        }
                        onCopy={() =>
                          copy(formatPlace(place), `copy-${place.id}`)
                        }
                        onShare={() => share([place.id])}
                      />
                    }
                  />
                );
              })}
            </ResultsGrid>
          )}
        </section>
      </div>
      <SavedPlaces
        byId={byId}
        history={state.saved.history}
        favorites={state.saved.favorites}
        hiddenIds={hiddenIds}
        onReplay={(id) => dispatch({ type: "replay", ids: [id] })}
        onRemoveFavorite={(id) => dispatch({ type: "favorite", id })}
        onClearHistory={() => dispatch({ type: "clear-history" })}
        onClearFavorites={() => dispatch({ type: "clear-favorites" })}
      />
      {!(mode === "capital" && filters.guess) && example && (
        <div className="mt-8 max-w-reading">{example}</div>
      )}
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
    </div>
  );
}
