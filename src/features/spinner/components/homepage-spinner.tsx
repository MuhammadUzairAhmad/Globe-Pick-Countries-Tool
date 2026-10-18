"use client";

import { Activity, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { City, Country } from "@/features/generator/types";
import { SpinnerWorkspace } from "./spinner-workspace";
import type { SpinnerMode } from "./spinner-mode-tabs";

type Props = { countries: Country[] };

export function HomepageSpinner(props: Props) {
  const { bfcacheId } = useRouter();
  return <SpinnerModes key={bfcacheId} {...props} />;
}

function SpinnerModes({ countries }: Props) {
  const [mode, setMode] = useState<SpinnerMode>("country");
  const [cities, setCities] = useState<City[] | null>(null);
  const [loadingCities, setLoadingCities] = useState(false);
  const [cityError, setCityError] = useState("");
  const request = useRef(0);
  const focusRequestRef = useRef<SpinnerMode | null>(null);
  const groupId = useId();

  async function onModeChange(next: SpinnerMode) {
    const current = ++request.current;
    focusRequestRef.current = next;
    setCityError("");
    if (next === "country" || cities) {
      setLoadingCities(false);
      setMode(next);
      return;
    }
    setLoadingCities(true);
    try {
      // City records stay out of the initial homepage payload and scripts.
      const loaded = await import("@/data/cities");
      setCities(loaded.cities);
      if (request.current !== current) return;
      setLoadingCities(false);
      setMode("city");
    } catch {
      if (request.current !== current) return;
      setLoadingCities(false);
      setCityError(
        "Check your connection and try again. You can still spin countries.",
      );
    }
  }

  const controls = {
    groupId,
    loadingCities,
    cityError,
    focusRequestRef,
    onModeChange,
  };
  return (
    <section
      aria-label="Country and city spinner"
      id="country-spinner"
      className="border-t border-border py-section"
    >
      <div className="mb-7 max-w-reading">
        <h2>
          {mode === "country" ? "Spin a random country" : "Spin a random city"}
        </h2>
        <p className="mt-3 text-muted">
          {mode === "country"
            ? "Choose a continent and spin, or switch to Cities to explore one country. Every available country has an equal chance."
            : "Choose a country, then spin a city or town. Every available place in that country has an equal chance."}
        </p>
      </div>
      <Activity mode={mode === "country" ? "visible" : "hidden"}>
        <SpinnerWorkspace countries={countries} mode="country" {...controls} />
      </Activity>
      {cities ? (
        <Activity mode={mode === "city" ? "visible" : "hidden"}>
          <SpinnerWorkspace
            countries={countries}
            cities={cities}
            mode="city"
            {...controls}
          />
        </Activity>
      ) : (
        <div
          id={`${groupId}-city-panel`}
          role="tabpanel"
          aria-labelledby={`${groupId}-country-city-tab`}
          hidden
        />
      )}
    </section>
  );
}
