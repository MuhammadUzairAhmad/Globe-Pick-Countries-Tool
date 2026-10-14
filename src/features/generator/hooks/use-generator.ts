"use client";

import { useEffect, useMemo, useReducer, useRef } from "react";
import { generatorReducer, initialState } from "../lib/state";
import {
  eligiblePlaces,
  placesForMode,
  placeName,
  selectPlaces,
  filtersForRegion,
} from "../lib/selection";
import { readSavedState, writeSavedState } from "@/lib/storage/saved-state";
import { parseSharedUrl } from "@/lib/share/url-state";
import type { City, Continent, Country, Mode } from "../types";
const noCities: City[] = [];

export function useGenerator(
  countries: Country[],
  mode: Mode,
  cities: City[] = noCities,
  initialContinent?: Continent,
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
  }, [byId, countries, mode, initialContinent]);
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
  const eligible = eligiblePlaces(places, {
    ...state.saved.filters,
    noRepeat: false,
  });
  const remaining = eligiblePlaces(
    places,
    state.saved.filters,
    state.saved.consumed,
  );
  function generate(quantity = state.saved.filters.quantity) {
    if (!state.hydrated) return;
    try {
      const selected = selectPlaces(remaining, quantity);
      if (!selected.ok) {
        dispatch({ type: "message", message: selected.message });
        return;
      }
      const names = selected.places
        .slice(0, 3)
        .map((place) =>
          state.saved.filters.guess && mode === "capital"
            ? place.country.name
            : placeName(place),
        )
        .join(", ");
      const count = selected.places.length;
      const label =
        mode === "country"
          ? count === 1
            ? "country"
            : "countries"
          : mode === "city"
            ? count === 1
              ? "city or town"
              : "cities and towns"
            : state.saved.filters.guess
              ? count === 1
                ? "capital question"
                : "capital questions"
              : count === 1
                ? "capital or government seat"
                : "capitals and government seats";
      dispatch({
        type: "generated",
        ids: selected.places.map((place) => place.id),
        at: Date.now(),
        message: `Picked ${count} ${label}: ${names}${count > 3 ? ", and more" : ""}.`,
      });
    } catch {
      dispatch({
        type: "message",
        message:
          "Random selection is unavailable in this browser. Please try a current browser.",
      });
    }
  }
  return { state, dispatch, places, byId, eligible, remaining, generate };
}
