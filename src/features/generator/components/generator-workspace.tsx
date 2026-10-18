"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Notice } from "@/components/ui/notice";
import { ResultsGrid } from "./results-grid";
import { ResultActions } from "./result-actions";
import { GeneratorFilters } from "./generator-filters";
import { PlaceResultCard } from "./place-result-card";
import {
  defaultFilters,
  filtersForRegion,
  formatPlace,
  placeName,
} from "../lib/selection";
import { useGenerator } from "../hooks/use-generator";
import { GuessReveal } from "@/features/learning/guess-reveal";
import { SavedPlaces } from "@/features/saved-places/saved-places";
import { Icon } from "@/components/ui/icon";
import { useResultFeedback } from "../hooks/use-result-feedback";
import type { City, Continent, Country, Mode, Place } from "../types";

type GeneratorWorkspaceProps = {
  countries: Country[];
  mode: Mode;
  example?: ReactNode;
  cities?: City[];
  initialContinent?: Continent;
};

export function GeneratorWorkspace(props: GeneratorWorkspaceProps) {
  const { bfcacheId } = useRouter();
  // A fresh link visit should apply its preset again, even at the same URL.
  // Back/Forward retains this Next-provided identity and the existing session.
  return <GeneratorSession key={bfcacheId} {...props} />;
}

function GeneratorSession({
  countries,
  mode,
  example,
  cities,
  initialContinent,
}: GeneratorWorkspaceProps) {
  const { state, dispatch, byId, eligible, remaining, generate } = useGenerator(
    countries,
    mode,
    cities,
    { initialContinent },
  );
  const cityCoverage = useMemo(() => {
    if (!cities) return undefined;
    const counts: Record<string, number> = {};
    for (const city of cities)
      counts[city.countryId] = (counts[city.countryId] ?? 0) + 1;
    return counts;
  }, [cities]);
  const {
    copy,
    share: shareSelection,
    pending,
    copied,
    feedback,
  } = useResultFeedback(mode);
  const resultsHeading = useRef<HTMLHeadingElement>(null);
  const focusReplay = useRef(false);
  useEffect(() => {
    if (!focusReplay.current) return;
    focusReplay.current = false;
    const heading = resultsHeading.current;
    heading?.focus({ preventScroll: true });
    heading?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
    });
  }, [state.revision]);
  const filters = state.saved.filters;
  const results = state.resultIds
    .map((id) => byId.get(id))
    .filter((place): place is Place => Boolean(place));
  const hiddenIds = new Set(
    mode === "capital" && filters.guess
      ? state.resultIds.filter((id) => !state.revealed.includes(id))
      : [],
  );
  function share(ids: string[]) {
    shareSelection(filters, ids);
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
          cityCoverage={cityCoverage}
          onGenerate={generate}
          ready={state.hydrated}
          onResetFilters={() => {
            dispatch({
              type: "filters",
              filters: filtersForRegion(defaultFilters, initialContinent),
            });
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
            <h2
              id="results-title"
              ref={resultsHeading}
              tabIndex={-1}
              className="scroll-mt-6 text-card-title"
            >
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
                    : mode === "city"
                      ? "No matching city records"
                      : "No matching places"
                }
              >
                {eligible.length
                  ? "Reset picked places, allow repeats, or change your filters to keep going."
                  : mode === "city"
                    ? "This dataset has no city or town records for these choices. Try another country or clear your filters. It isn’t a complete list of every city."
                    : "No countries match these filters. Try another continent or clear your country choices."}
              </Notice>
            </div>
          )}
          {!results.length ? (
            <Card>
              <h3>Ready to pick a {mode}?</h3>
              <p className="mt-3 text-muted">
                Choose a continent or keep all countries, then select Generate{" "}
                {mode === "country"
                  ? "countries"
                  : mode === "city"
                    ? "cities"
                    : "capitals"}{" "}
                to see your results.
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
                              : place.kind === "city"
                                ? placeName(place)
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
        onReplay={(id) => {
          focusReplay.current = true;
          dispatch({ type: "replay", ids: [id] });
        }}
        onRemoveFavorite={(id) => dispatch({ type: "favorite", id })}
        onClearHistory={() => dispatch({ type: "clear-history" })}
        onClearFavorites={() => dispatch({ type: "clear-favorites" })}
      />
      {!(mode === "capital" && filters.guess) && example && (
        <div className="mt-8 max-w-reading">{example}</div>
      )}
      {feedback}
    </div>
  );
}
