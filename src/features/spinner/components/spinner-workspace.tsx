"use client";

import { useId, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Notice } from "@/components/ui/notice";
import { Icon } from "@/components/ui/icon";
import { PlaceResultCard } from "@/features/generator/components/place-result-card";
import { ResultActions } from "@/features/generator/components/result-actions";
import { useGenerator } from "@/features/generator/hooks/use-generator";
import { useResultFeedback } from "@/features/generator/hooks/use-result-feedback";
import {
  defaultFilters,
  formatPlace,
  filtersForCountry,
  placeName,
} from "@/features/generator/lib/selection";
import {
  continents,
  type Country,
  type City,
  type Filters,
} from "@/features/generator/types";
import { SavedPlaces } from "@/features/saved-places/saved-places";
import { usePlaceWheel } from "../hooks/use-place-wheel";
import { spinSnapshot } from "../lib/wheel";
import { PlaceWheel } from "./place-wheel";
import { AvailablePlaces } from "./available-places";
import { SpinnerResultDialog } from "./spinner-result-dialog";

import { SpinnerModeTabs, type ModeControls } from "./spinner-mode-tabs";

type Props = ModeControls & { countries: Country[]; cities?: City[] };

export function SpinnerWorkspace({ countries, cities, ...controls }: Props) {
  const { mode, groupId, loadingCities, cityError, onModeChange } = controls;
  const isCity = mode === "city";
  const noun = isCity ? "city" : "country";
  const plural = isCity ? "cities" : "countries";
  const [cityCountry, setCityCountry] = useState("");
  const selectedCountry = countries.find(
    (country) => country.id === cityCountry,
  );
  const coverage = useMemo(() => {
    const counts = new Map<string, number>();
    for (const city of cities ?? [])
      counts.set(city.countryId, (counts.get(city.countryId) ?? 0) + 1);
    return counts;
  }, [cities]);
  const {
    state,
    dispatch,
    byId,
    eligible,
    remaining,
    generate,
    selectionFilters: filters,
  } = useGenerator(countries, mode, cities, {
    singlePick: true,
    ignoreCountryChoices: true,
    selectionCountryId: isCity ? cityCountry : undefined,
  });
  const { wheel, element, start, skip, reset } = usePlaceWheel();
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
  } = useResultFeedback(mode, { inlineToast: showResult });
  const busy = spinning || Boolean(pending);
  const choosingCountry = isCity && !cityCountry;
  const preparing = loadingCities || choosingCountry;
  const shownPool = wheel?.snapshot.pool ?? remaining;
  const availableCount = spinning ? shownPool.length : remaining.length;

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
    if (!ready || pending || preparing || !remaining.length) return;
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
    <div
      role="tabpanel"
      id={`${groupId}-${mode}-panel`}
      aria-labelledby={`${groupId}-${mode}-${mode}-tab`}
      tabIndex={0}
    >
      <div className="flex flex-col gap-5 xl:grid xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] xl:items-start">
        <Card className="flex min-w-0 flex-col">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <h3 className="text-card-title">
              {isCity ? "City wheel" : "Country wheel"}
            </h3>
            <span className="text-xs text-muted">One {noun} per spin</span>
          </div>
          <PlaceWheel
            pool={shownPool}
            rotation={wheel?.rotation ?? 0}
            wheelRef={element}
            winnerId={wheel && !spinning ? wheel.snapshot.winner.id : undefined}
          />
          <Button
            ref={spinButton}
            className="group mt-4 min-h-14 w-full shadow-card"
            onClick={spin}
            disabled={!ready || Boolean(pending) || preparing}
            aria-disabled={spinning || !remaining.length}
            aria-busy={spinning}
          >
            <Icon
              name="rotate"
              className={`size-5 shrink-0 ${spinning ? "motion-safe:animate-spin" : "motion-safe:transition-transform motion-safe:group-hover:rotate-45"}`}
            />
            <span className="text-base">
              {spinning ? "Spinning…" : `Spin a ${noun}`}
            </span>
          </Button>
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="mt-3 min-h-6 text-center text-sm text-muted"
          >
            {choosingCountry
              ? "Choose a country in settings to spin a city."
              : loadingCities
                ? "Loading cities…"
                : spinning
                  ? "Spinning…"
                  : state.message ||
                    (ready
                      ? `Every available ${noun} has an equal chance.`
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
              View last {noun}
            </button>
          ) : null}
          <Link
            href={
              isCity ? "/random-city-generator" : "/random-country-generator"
            }
            prefetch={isCity ? false : undefined}
            className="mt-3 inline-flex min-h-touch items-center justify-center gap-2 border-t border-border pt-3 text-center text-sm font-medium text-brand underline underline-offset-4 hover:text-brand-strong"
          >
            Need multiple results or more filters?
            <Icon name="arrow" className="size-4 shrink-0" />
          </Link>
        </Card>
        <Card className="min-w-0 xl:order-first">
          <h3 className="text-card-title">Spin settings</h3>
          <SpinnerModeTabs {...controls} disabled={!ready || busy} />
          {loadingCities && (
            <p role="status" className="mt-3 text-sm text-muted">
              Loading cities and towns…
            </p>
          )}
          {cityError && (
            <div role="alert" className="mt-3">
              <Notice title="Cities couldn’t load">
                <p>{cityError}</p>
                <Button
                  size="compact"
                  variant="secondary"
                  className="mt-3"
                  onClick={() => onModeChange("city")}
                >
                  Try again
                </Button>
              </Notice>
            </div>
          )}
          <fieldset
            disabled={!ready || busy || loadingCities}
            className="mt-4 min-w-0"
          >
            {isCity ? (
              <Field id={`${id}-country`} label="Country">
                <select
                  id={`${id}-country`}
                  value={cityCountry}
                  onChange={(event) => {
                    reset();
                    setCityCountry(event.target.value);
                    dispatch({
                      type: "message",
                      message: "Country updated. Spin to pick a city.",
                    });
                  }}
                  className="min-h-touch w-full rounded-control border border-border bg-surface px-3 py-2 text-sm"
                >
                  <option value="">Choose a country</option>
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name} ({coverage.get(country.id) ?? 0})
                    </option>
                  ))}
                </select>
                <p className="mt-2 text-xs text-muted">
                  Counts show cities and towns in our dataset, which is not a
                  complete list.
                </p>
              </Field>
            ) : (
              <>
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
              </>
            )}
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
            <div className="mt-3 flex flex-wrap items-baseline gap-x-2 gap-y-1 rounded-control bg-brand-soft px-3 py-2.5">
              <p className="font-semibold text-foreground">
                {ready
                  ? `${availableCount} ${availableCount === 1 ? noun : plural} ready`
                  : `Loading ${plural}…`}
              </p>
              {ready && (
                <p className="text-xs text-muted">
                  {isCity
                    ? selectedCountry
                      ? `${eligible.length} listed in ${selectedCountry.name}`
                      : "Choose a country to see its places"
                    : `${eligible.length} in ${filters.continent === "all" ? "all continents" : filters.continent}`}
                </p>
              )}
            </div>
            {ready && !choosingCountry && !remaining.length && (
              <div className="mt-3">
                <Notice
                  title={
                    eligible.length
                      ? `You’ve picked every matching ${noun}`
                      : isCity
                        ? "No city or town records"
                        : "No matching countries"
                  }
                >
                  {eligible.length
                    ? "Reset picked places, allow repeats, or change your filters to spin again."
                    : isCity
                      ? "This dataset has no cities or towns for this country. Choose another country."
                      : "Try another continent or allow repeats."}
                </Notice>
              </div>
            )}
            <AvailablePlaces
              key={`${filters.continent}:${filters.noRepeat}:${cityCountry}`}
              places={spinning ? shownPool : remaining}
              ready={ready}
              mode={mode}
              awaitingCountry={choosingCountry}
              spinning={spinning}
            />
            <div className="mt-2 flex flex-wrap gap-x-4 border-t border-border pt-1">
              <button
                type="button"
                className="min-h-touch text-sm font-medium text-brand"
                onClick={() => {
                  if (isCity) {
                    reset();
                    setCityCountry("");
                  }
                  changeFilters({
                    continent: defaultFilters.continent,
                    noRepeat: defaultFilters.noRepeat,
                  });
                }}
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
      </div>
      {state.storageWarning && (
        <div className="mt-5" role="status">
          <Notice title="Browser saving notice">{state.storageWarning}</Notice>
        </div>
      )}
      {result && showResult && (
        <SpinnerResultDialog
          key={state.revision}
          place={result}
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
            presentation="dialog"
            actions={
              <ResultActions
                saved={state.saved.favorites.includes(result.id)}
                disabled={busy}
                label={placeName(result)}
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
          Recent {plural} and favorites
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
                const place = byId.get(id);
                if (isCity && place) setCityCountry(place.countryId);
                setResultFilters({
                  ...(isCity && place
                    ? filtersForCountry(filters, place.countryId)
                    : filters),
                  quantity: 1,
                });
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
    </div>
  );
}
