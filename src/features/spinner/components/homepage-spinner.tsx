"use client";

import { useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
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
import { AvailableCountries } from "./available-countries";
import { SpinnerResultDialog } from "./spinner-result-dialog";

type Props = { countries: Country[] };

export function HomepageSpinner(props: Props) {
  const { bfcacheId } = useRouter();
  return <SpinnerSession key={bfcacheId} {...props} />;
}

function SpinnerSession({ countries }: Props) {
  const {
    state,
    dispatch,
    byId,
    eligible,
    remaining,
    generate,
    selectionFilters: filters,
  } = useGenerator(countries, "country", undefined, {
    singlePick: true,
    ignoreCountryChoices: true,
  });
  const { wheel, element, start, skip, reset } = useCountryWheel();
  const [resultFilters, setResultFilters] = useState<Filters | null>(null);
  const [resultView, setResultView] = useState({
    dismissedRevision: 0,
    reopen: false,
  });
  const spinButton = useRef<HTMLButtonElement>(null);
  const id = useId();
  const spinning = Boolean(wheel?.spinning);
  const ready = state.hydrated;
  const result =
    !spinning && state.resultIds.length
      ? byId.get(state.resultIds[0])
      : undefined;
  const showResult = Boolean(
    result &&
    (state.revision !== resultView.dismissedRevision || resultView.reopen),
  );
  const {
    copy,
    share,
    pending,
    copied,
    feedback,
    toastFeedback,
    dialogFeedback,
  } = useResultFeedback("country", { inlineToast: showResult });
  const busy = spinning || Boolean(pending);
  const shownPool = wheel?.snapshot.pool ?? remaining;

  function closeResult() {
    setResultView({ dismissedRevision: state.revision, reopen: false });
  }

  function changeFilters(
    value: Partial<Pick<Filters, "continent" | "noRepeat">>,
  ) {
    reset();
    dispatch({
      type: "filters",
      filters: { ...state.saved.filters, ...value },
    });
    dispatch({
      type: "message",
      message: "Spinner settings updated.",
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
      id="country-spinner"
      className="border-t border-border py-section"
    >
      <div className="mb-7 max-w-reading">
        <h2>Spin a random country</h2>
        <p className="mt-3 text-muted">
          Choose a continent and spin. Every available country has an equal
          chance.
        </p>
      </div>
      <div className="grid gap-5 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <Card className="min-w-0">
          <h3 className="text-card-title">Spin settings</h3>
          <fieldset disabled={!ready || busy} className="mt-4 min-w-0">
            <Field id={`${id}-continent`} label="Continent">
              <select
                id={`${id}-continent`}
                value={filters.continent}
                onChange={(event) =>
                  changeFilters({
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
                  changeFilters({ noRepeat: event.target.checked })
                }
                className="size-5 accent-brand"
              />
              Don’t repeat previous picks
            </label>
            <p className="mt-2 text-sm text-muted">
              {ready
                ? `${spinning ? shownPool.length : remaining.length} of ${eligible.length} matching countries available`
                : "Restoring your country choices…"}
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
                    : "Try another continent or allow repeats."}
                </Notice>
              </div>
            )}
            <AvailableCountries
              key={`${filters.continent}:${filters.noRepeat}`}
              places={spinning ? shownPool : remaining}
              ready={ready}
              spinning={spinning}
            />
            <div className="flex flex-wrap gap-x-4">
              <button
                type="button"
                className="min-h-touch text-sm font-medium text-brand"
                onClick={() =>
                  changeFilters({
                    continent: defaultFilters.continent,
                    noRepeat: defaultFilters.noRepeat,
                  })
                }
              >
                Reset settings
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
        <Card className="flex min-w-0 flex-col justify-center">
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-card-title">Country wheel</h3>
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
            <button
              type="button"
              aria-haspopup="dialog"
              onClick={() =>
                setResultView({
                  dismissedRevision: state.revision,
                  reopen: true,
                })
              }
              className="flex min-h-touch items-center justify-center text-sm font-semibold text-brand underline underline-offset-4"
            >
              View last country
            </button>
          ) : null}
        </Card>
      </div>
      {state.storageWarning && (
        <div className="mt-5" role="status">
          <Notice title="Browser saving notice">{state.storageWarning}</Notice>
        </div>
      )}
      {result && showResult && (
        <SpinnerResultDialog
          key={state.revision}
          country={result.country.name}
          replay={state.replay}
          celebrate={
            !state.replay && state.revision !== resultView.dismissedRevision
          }
          canSpin={remaining.length > 0}
          pending={Boolean(pending)}
          feedback={toastFeedback}
          onClose={closeResult}
          onSpinAgain={() => {
            closeResult();
            spin();
          }}
        >
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
        </SpinnerResultDialog>
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
      {showResult ? dialogFeedback : feedback}
    </section>
  );
}
