"use client";

import { useEffect, useMemo, useReducer, useRef } from "react";
import { generatorReducer, initialState } from "../lib/state";
import {
  eligiblePlaces,
  placesForMode,
  filtersForRegion,
  filtersWithoutCountryChoices,
  filtersForCountry,
} from "../lib/selection";
import { readSavedState, writeSavedState } from "@/lib/storage/saved-state";
import { parseSharedUrl } from "@/lib/share/url-state";
import { prepareGeneration } from "../lib/generation";
import type { City, Continent, Country, Mode, Place } from "../types";
const noCities: City[] = [];

export function useGenerator(
  countries: Country[],
  mode: Mode,
  cities: City[] = noCities,
  {
    initialContinent,
    singlePick = false,
    ignoreCountryChoices = false,
    selectionCountryId,
  }: {
    initialContinent?: Continent;
    singlePick?: boolean;
    ignoreCountryChoices?: boolean;
    selectionCountryId?: string;
  } = {},
) {
  const [state, dispatch] = useReducer(generatorReducer, undefined, () => {
    const initial = initialState();
    initial.saved.filters = filtersForRegion(
      initial.saved.filters,
      initialContinent,
    );
    return initial;
  });
  const places = useMemo(
    () => placesForMode(countries, mode, cities),
    [countries, mode, cities],
  );
  const byId = useMemo(
    () => new Map(places.map((place) => [place.id, place])),
    [places],
  );
  const initialized = useRef(false);
  const restoredUrl = useRef("");
  const activePath = useRef("");
  const skipResumedWrite = useRef(false);
  useEffect(() => {
    const placeIds = new Set(byId.keys());
    const countryIds = new Set(countries.map((country) => country.id));
    const saved = readSavedState(
      () => window.localStorage,
      mode,
      placeIds,
      countryIds,
    );
    const urlKey = () => window.location.pathname + window.location.search;
    if (!initialized.current) {
      initialized.current = true;
      activePath.current = window.location.pathname;
      restoredUrl.current = urlKey();
      const shared = parseSharedUrl(
        window.location.href,
        mode,
        placeIds,
        countryIds,
      );
      dispatch({
        type: "hydrate",
        saved: {
          ...saved.saved,
          filters: filtersForRegion(saved.saved.filters, initialContinent),
        },
        warning: saved.warning,
        shared: shared.ok ? shared.state : null,
        message: !shared.ok
          ? shared.message
          : shared.state?.resultIds.length
            ? "Opened a shared selection. These results don’t count as new picks."
            : "",
      });
    } else {
      skipResumedWrite.current = true;
      // Activity restarts effects on Back. Keep the active batch, and retain
      // working memory if storage is unavailable or cannot be read safely.
      dispatch({
        type: "resume",
        saved: saved.warning ? undefined : saved.saved,
        warning: saved.warning,
        syncQuantity: singlePick,
        syncCountryChoices: ignoreCountryChoices,
      });
    }
    function restoreUrl() {
      // A popstate event also reaches the route being hidden. Only restore
      // this workspace's URL, never another tool's incoming shared state.
      if (window.location.pathname !== activePath.current) return;
      const key = urlKey();
      if (key === restoredUrl.current) return;
      restoredUrl.current = key;
      const next = parseSharedUrl(
        window.location.href,
        mode,
        placeIds,
        countryIds,
      );
      if (!next.ok) dispatch({ type: "message", message: next.message });
      else if (next.state)
        dispatch({
          type: "replay",
          ids: next.state.resultIds,
          filters: next.state.filters,
        });
    }
    restoreUrl();
    window.addEventListener("popstate", restoreUrl);
    return () => window.removeEventListener("popstate", restoreUrl);
  }, [
    byId,
    countries,
    mode,
    initialContinent,
    singlePick,
    ignoreCountryChoices,
  ]);
  useEffect(() => {
    if (skipResumedWrite.current) {
      skipResumedWrite.current = false;
      return;
    }
    // Hydration never writes: only actual user changes set dirty. This also protects
    // saved data during Strict Mode's repeated mount effects.
    if (!state.hydrated || !state.dirty) return;
    const warning = writeSavedState(
      () => window.localStorage,
      mode,
      state.saved,
    );
    dispatch({ type: "storage-warning", warning });
  }, [state.saved, state.hydrated, state.dirty, mode]);
  // Keep the full tool's saved custom choices intact while the spinner draws
  // from every country in the selected continent.
  const selectionFilters =
    selectionCountryId !== undefined
      ? filtersForCountry(state.saved.filters, selectionCountryId)
      : ignoreCountryChoices
        ? filtersWithoutCountryChoices(state.saved.filters)
        : state.saved.filters;
  // Keep every ID available for storage validation while awaiting a country.
  const selectionPlaces = selectionCountryId === "" ? [] : places;
  const eligible = eligiblePlaces(selectionPlaces, {
    ...selectionFilters,
    noRepeat: false,
  });
  const remaining = eligiblePlaces(
    selectionPlaces,
    selectionFilters,
    state.saved.consumed,
  );
  function generate(
    quantity = state.saved.filters.quantity,
  ): Place[] | undefined {
    if (!state.hydrated) return;
    try {
      const generation = prepareGeneration(
        remaining,
        quantity,
        mode,
        selectionFilters.guess,
      );
      if (!generation.ok) {
        dispatch({ type: "message", message: generation.message });
        return;
      }
      dispatch(generation.action);
      return generation.places;
    } catch {
      dispatch({
        type: "message",
        message:
          "Random selection is unavailable in this browser. Please try a current browser.",
      });
    }
  }
  return {
    state,
    dispatch,
    places,
    byId,
    eligible,
    remaining,
    generate,
    selectionFilters,
  };
}
