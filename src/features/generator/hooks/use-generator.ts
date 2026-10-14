"use client";

import { useEffect, useMemo, useReducer } from "react";
import { generatorReducer, initialState } from "../lib/state";
import {
  eligiblePlaces,
  placesForMode,
  placeName,
  selectPlaces,
} from "../lib/selection";
import { readSavedState, writeSavedState } from "@/lib/storage/saved-state";
import { parseSharedUrl } from "@/lib/share/url-state";
import type { Country, Mode } from "../types";

export function useGenerator(countries: Country[], mode: Mode) {
  const [state, dispatch] = useReducer(
    generatorReducer,
    undefined,
    initialState,
  );
  const places = useMemo(
    () => placesForMode(countries, mode),
    [countries, mode],
  );
  const byId = useMemo(
    () => new Map(places.map((place) => [place.id, place])),
    [places],
  );
  useEffect(() => {
    const placeIds = new Set(byId.keys());
    const countryIds = new Set(countries.map((country) => country.id));
    const saved = readSavedState(
      () => window.localStorage,
      mode,
      placeIds,
      countryIds,
    );
    const shared = parseSharedUrl(
      window.location.href,
      mode,
      placeIds,
      countryIds,
    );
    dispatch({
      type: "hydrate",
      saved: saved.saved,
      warning: saved.warning,
      shared: shared.ok ? shared.state : null,
      message: !shared.ok
        ? shared.message
        : shared.state?.resultIds.length
          ? "Opened a shared selection. These results don’t count as new picks."
          : "",
    });
    function restoreUrl() {
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
    window.addEventListener("popstate", restoreUrl);
    return () => window.removeEventListener("popstate", restoreUrl);
  }, [byId, countries, mode]);
  useEffect(() => {
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
