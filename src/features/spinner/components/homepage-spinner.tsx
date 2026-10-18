"use client";

import { useId, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import { CountryChoices } from "@/features/generator/components/country-choices";
import { PlaceResultCard } from "@/features/generator/components/place-result-card";
import { ResultActions } from "@/features/generator/components/result-actions";
import { useGenerator } from "@/features/generator/hooks/use-generator";
import { useResultFeedback } from "@/features/generator/hooks/use-result-feedback";
import {
  defaultFilters,
  formatPlace,
} from "@/features/generator/lib/selection";
import {
  continents,
  type Country,
  type Filters,
} from "@/features/generator/types";
import { SavedPlaces } from "@/features/saved-places/saved-places";
import { useCountryWheel } from "../hooks/use-country-wheel";
import { spinSnapshot } from "../lib/wheel";
import { CountryWheel } from "./country-wheel";

type Props = { countries: Country[]; children: ReactNode };

export function HomepageSpinner(props: Props) {
  const { bfcacheId } = useRouter();
  return <SpinnerSession key={bfcacheId} {...props} />;
}

function SpinnerSession({ countries, children }: Props) {
  const { state, dispatch, byId, eligible, remaining, generate } = useGenerator(
    countries,
    "country",
    undefined,
    { singlePick: true },
  );
  const { wheel, element, start, skip, reset } = useCountryWheel();
  const { copy, share, pending, copied, feedback } =
    useResultFeedback("country");
  const [resultFilters, setResultFilters] = useState<Filters | null>(null);
  const spinButton = useRef<HTMLButtonElement>(null);
  const id = useId();
  const filters = state.saved.filters;
  const spinning = Boolean(wheel?.spinning);
  const busy = spinning || Boolean(pending);
  const ready = state.hydrated;
  const result =
    !spinning && state.resultIds.length
      ? byId.get(state.resultIds[0])
      : undefined;
  const shownPool = wheel?.snapshot.pool ?? remaining;

  function changeFilters(value: Filters) {
    reset();
    dispatch({ type: "filters", filters: value });
    dispatch({
      type: "message",
      message: "Country choices updated.",
    });
  }

  function spin() {
    if (!ready || pending || !remaining.length) return;
    start(() => {
      const pool = [...remaining];
      const picked = generate(1)?.[0];
      if (!picked) return;
      const snapshot = spinSnapshot(pool, picked, filters);
      setResultFilters(snapshot.filters);
      return snapshot;
    });
  }

  return (
    <section
      aria-label="Country spinner"
      className="py-6 sm:py-10 lg:py-section"
    >
      <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
        {children}
        <Card className="min-w-0">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h2 className="text-card-title">Where will you land?</h2>
            <span className="text-xs text-muted">One country per spin</span>
          </div>
          <CountryWheel
            pool={shownPool}
            rotation={wheel?.rotation ?? 0}
            wheelRef={element}
          />
          <Button
            ref={spinButton}
            className="mt-3 w-full"
            onClick={spin}
            disabled={!ready || Boolean(pending)}
            aria-disabled={spinning || !remaining.length}
            aria-busy={spinning}
          >
            {spinning ? "Spinning…" : "Spin a country"}
          </Button>
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="mt-3 min-h-6 text-center text-sm text-muted"
          >
            {spinning
              ? "Spinning…"
              : state.message ||
                (ready
                  ? "Every available country has an equal chance."
                  : "Loading your saved settings…")}
          </p>
          {spinning ? (
            <Button
              variant="secondary"
              className="mt-2 w-full"
              onClick={() => {
                skip();
                spinButton.current?.focus();
              }}
            >
              Show result now
            </Button>
          ) : result ? (
            <a
              href={`#${id}-result`}
              className="flex min-h-touch items-center justify-center text-sm font-semibold text-brand underline underline-offset-4"
            >
              View country details
            </a>
          ) : null}
          <fieldset
            disabled={!ready || busy}
            className="mt-4 min-w-0 border-t border-border pt-4"
          >
            <Field id={`${id}-continent`} label="Continent">
              <select
                id={`${id}-continent`}
                value={filters.continent}
                onChange={(event) =>
                  changeFilters({
                    ...filters,
                    continent: event.target.value as Filters["continent"],
                  })
                }
                className="min-h-touch w-full rounded-control border border-border bg-surface px-3 py-2 text-sm"
              >
                <option value="all">All continents</option>
                {continents.map((continent) => (
                  <option key={continent}>{continent}</option>
                ))}
              </select>
            </Field>
            <label className="mt-2 flex min-h-touch items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={filters.noRepeat}
                onChange={(event) =>
                  changeFilters({ ...filters, noRepeat: event.target.checked })
                }
                className="size-5 accent-brand"
              />
              Don’t repeat previous picks
            </label>
            <p className="mt-2 text-sm text-muted">
              {ready
                ? `${remaining.length} of ${eligible.length} matching countries available`
                : "Restoring your country choices…"}
            </p>
            <p className="mt-1 text-xs text-muted">
              {filters.continent === "all"
                ? "All continents"
                : filters.continent}{" "}
              · {filters.include.length} included · {filters.exclude.length}{" "}
              excluded
            </p>
            {ready && !remaining.length && (
              <div className="mt-3">
                <Notice
                  title={
                    eligible.length
                      ? "You’ve picked every matching country"
                      : "No matching countries"
                  }
                >
                  {eligible.length
                    ? "Reset picked places, allow repeats, or change your filters to spin again."
                    : "Try another continent or clear your country choices."}
                </Notice>
              </div>
            )}
            <CountryChoices
              countries={countries}
              value={filters}
              onChange={changeFilters}
            />
            <details>
              <summary className="min-h-touch cursor-pointer py-2 text-sm font-semibold text-brand">
                Countries in the next spin ({remaining.length})
              </summary>
              {spinning ? (
                <p className="py-2 text-sm text-muted">
                  The next pool will be ready when this spin ends.
                </p>
              ) : remaining.length ? (
                <ul
                  aria-label="Available countries"
                  tabIndex={0}
                  className="max-h-48 overflow-y-auto overscroll-contain rounded-control border border-border p-3 text-sm text-muted sm:columns-2"
                >
                  {remaining.map((place) => (
                    <li key={place.id} className="py-1">
                      {place.country.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="py-2 text-sm text-muted">
                  No countries are available with these choices.
                </p>
              )}
            </details>
            <div className="flex flex-wrap gap-x-4">
              <button
                type="button"
                className="min-h-touch text-sm font-medium text-brand"
                onClick={() =>
                  changeFilters({
                    ...defaultFilters,
                    quantity: filters.quantity,
                  })
                }
              >
                Clear filters
              </button>
              <button
                type="button"
                className="min-h-touch text-sm font-medium text-brand"
                onClick={() => {
                  reset();
                  dispatch({ type: "reset-pool" });
                }}
              >
                Reset picked places
              </button>
            </div>
          </fieldset>
        </Card>
      </div>
      {state.storageWarning && (
        <div className="mt-5" role="status">
          <Notice title="Browser saving notice">{state.storageWarning}</Notice>
        </div>
      )}
      {result && (
        <section
          id={`${id}-result`}
          aria-labelledby={`${id}-result-title`}
          className="mt-8 scroll-mt-6"
        >
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <h2 id={`${id}-result-title`} className="text-card-title">
              {state.replay ? "Saved country" : "Your last pick"}
            </h2>
            <p className="text-sm text-muted">
              {state.replay
                ? "Viewing this country doesn’t count as a new pick."
                : "Spin again whenever you’re ready."}
            </p>
          </div>
          <div className="max-w-reading">
            <PlaceResultCard
              key={result.id}
              place={result}
              actions={
                <ResultActions
                  saved={state.saved.favorites.includes(result.id)}
                  disabled={busy}
                  label={result.country.name}
                  copying={pending === `copy-${result.id}`}
                  copied={copied === `copy-${result.id}`}
                  onSave={() => dispatch({ type: "favorite", id: result.id })}
                  onCopy={() => copy(formatPlace(result), `copy-${result.id}`)}
                  onShare={() =>
                    share(resultFilters ?? { ...filters, quantity: 1 }, [
                      result.id,
                    ])
                  }
                />
              }
            />
          </div>
        </section>
      )}
      <details className="mt-5 border-t border-border pt-2">
        <summary className="min-h-touch cursor-pointer py-2 text-sm font-semibold text-brand">
          Recent countries and favorites
          {ready
            ? ` (${state.saved.history.length} recent, ${state.saved.favorites.length} saved)`
            : ""}
        </summary>
        {spinning ? (
          <p className="py-3 text-sm text-muted">
            Your new pick will appear here when the wheel stops.
          </p>
        ) : (
          <fieldset disabled={!ready || Boolean(pending)} className="min-w-0">
            <SavedPlaces
              byId={byId}
              history={state.saved.history}
              favorites={state.saved.favorites}
              hiddenIds={new Set()}
              onReplay={(id) => {
                reset();
                setResultFilters({ ...filters, quantity: 1 });
                dispatch({ type: "replay", ids: [id] });
              }}
              onRemoveFavorite={(id) => dispatch({ type: "favorite", id })}
              onClearHistory={() => dispatch({ type: "clear-history" })}
              onClearFavorites={() => dispatch({ type: "clear-favorites" })}
            />
          </fieldset>
        )}
      </details>
      {feedback}
    </section>
  );
}
