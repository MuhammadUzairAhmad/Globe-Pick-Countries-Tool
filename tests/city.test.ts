import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  defaultFilters,
  eligiblePlaces,
  placesForMode,
  selectPlaces,
  placeName,
  formatPlace,
} from "../src/features/generator/lib/selection.ts";
import { createShareUrl, parseSharedUrl } from "../src/lib/share/url-state.ts";
import {
  emptySavedState,
  storageKey,
  validateSavedState,
} from "../src/lib/storage/saved-state.ts";
import type { City, Country } from "../src/features/generator/types.ts";

const countries: Country[] = JSON.parse(
  readFileSync("src/data/countries/countries.json", "utf8"),
);
const cities: City[] = JSON.parse(
  readFileSync("src/data/cities/cities.json", "utf8"),
);
const places = placesForMode(countries, "city", cities);
const cityIds = new Set(cities.map((city) => city.id));
const countryIds = new Set(countries.map((country) => country.id));

test("city eligibility and unique batches use records, with honest missing coverage", () => {
  assert.equal(places.length, cities.length);
  assert.equal(cityIds.size, places.length);
  const pool = eligiblePlaces(places, { ...defaultFilters, include: ["JP"] });
  assert.ok(pool.length > 20);
  const selected = selectPlaces(pool, 20, () => 0);
  assert.ok(selected.ok);
  assert.equal(new Set(selected.places.map((place) => place.id)).size, 20);
  assert.ok(selected.places.every((place) => place.countryId === "JP"));
  assert.equal(
    eligiblePlaces(places, { ...defaultFilters, include: ["NR"] }).length,
    0,
  );
  const remaining = eligiblePlaces(
    places,
    { ...defaultFilters, include: ["JP"] },
    selected.places.map((place) => place.id),
  );
  assert.equal(remaining.length, pool.length - 20);
  assert.equal(
    eligiblePlaces(places, {
      ...defaultFilters,
      include: ["JP"],
      continent: "Africa",
    }).length,
    0,
  );
});

test("identically named city records have stable identities and country/region context", () => {
  const groups = new Map<string, typeof places>();
  for (const place of places) {
    assert.equal(place.kind, "city");
    if (place.kind !== "city") continue;
    groups.set(place.city.name, [
      ...(groups.get(place.city.name) ?? []),
      place,
    ]);
  }
  const homonyms = [...groups.values()].find(
    (group) =>
      group.length > 1 && new Set(group.map(placeName)).size === group.length,
  )!;
  assert.ok(homonyms);
  assert.equal(
    new Set(homonyms.map((place) => place.id)).size,
    homonyms.length,
  );
  for (const place of homonyms) {
    const text = formatPlace(place);
    assert.ok(text.includes(place.country.name));
    assert.ok(text.includes("Natural Earth (public domain)"));
    assert.ok(text.includes("Approximate city/town point"));
  }
});

test("city storage has its own key and can preserve the full consumed/favorite pool", () => {
  assert.notEqual(storageKey("city"), storageKey("country"));
  assert.notEqual(storageKey("city"), storageKey("capital"));
  const saved = {
    ...emptySavedState(),
    consumed: [...cityIds],
    favorites: [...cityIds],
  };
  const checked = validateSavedState(
    JSON.stringify(saved),
    cityIds,
    countryIds,
  );
  assert.equal(checked.warning, "");
  assert.equal(checked.saved.consumed.length, cities.length);
  assert.equal(checked.saved.favorites.length, cities.length);
});

test("city shares round-trip only known city IDs and retain country filtering", () => {
  const city = cities.find((city) => city.countryId === "JP")!;
  const url = createShareUrl(
    "https://example.com",
    "city",
    { ...defaultFilters, include: ["JP"] },
    [city.id],
  );
  const parsed = parseSharedUrl(url, "city", cityIds, countryIds);
  assert.ok(parsed.ok && parsed.state);
  assert.deepEqual(parsed.state.resultIds, [city.id]);
  assert.deepEqual(parsed.state.filters.include, ["JP"]);
  assert.equal(new URL(url).pathname, "/random-city-generator");
  assert.equal(
    parseSharedUrl(url, "country", countryIds, countryIds).ok,
    false,
  );
  assert.equal(
    parseSharedUrl(
      url.replace(city.id, "ne-unknown"),
      "city",
      cityIds,
      countryIds,
    ).ok,
    false,
  );
});
