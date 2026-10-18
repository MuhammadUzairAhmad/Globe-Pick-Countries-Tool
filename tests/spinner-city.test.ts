import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  defaultFilters,
  filtersForCountry,
  placesForMode,
  eligiblePlaces,
} from "../src/features/generator/lib/selection.ts";
import { prepareGeneration } from "../src/features/generator/lib/generation.ts";
import {
  generatorReducer,
  initialState,
} from "../src/features/generator/lib/state.ts";
import {
  spinSnapshot,
  landingRotation,
  sectorAtPointer,
} from "../src/features/spinner/lib/wheel.ts";
import { createShareUrl, parseSharedUrl } from "../src/lib/share/url-state.ts";
import { validateSavedState } from "../src/lib/storage/saved-state.ts";
import type { City, Country } from "../src/features/generator/types.ts";

const countries: Country[] = JSON.parse(
  readFileSync("src/data/countries/countries.json", "utf8"),
);
const cities: City[] = JSON.parse(
  readFileSync("src/data/cities/cities.json", "utf8"),
);
const places = placesForMode(countries, "city", cities);
const ids = new Set(places.map((p) => p.id));
const countryIds = new Set(countries.map((c) => c.id));

test("city spinner scopes a country without changing full-tool filters or removing other-country saved IDs", () => {
  const stored = {
    ...defaultFilters,
    continent: "Africa" as const,
    include: ["JP"],
    exclude: ["PK"],
    quantity: 6,
  };
  const before = JSON.stringify(stored);
  const filters = filtersForCountry(stored, "PK");
  const pool = eligiblePlaces(places, filters);
  assert.ok(pool.length > 1);
  assert.ok(pool.every((p) => p.countryId === "PK"));
  assert.equal(filters.continent, "all");
  const other = places.find((p) => p.countryId === "JP")!;
  const state = initialState();
  state.saved = {
    ...state.saved,
    filters: stored,
    favorites: [other.id],
    consumed: [other.id],
  };
  const pick = prepareGeneration(pool, 1, "city", false, () => 0, 100);
  assert.ok(pick.ok);
  const next = generatorReducer(state, pick.action);
  assert.equal(next.saved.filters, stored);
  assert.equal(next.saved.filters.quantity, 6);
  assert.equal(next.saved.history.length, 1);
  assert.equal(next.saved.history[0].id, pick.places[0].id);
  assert.deepEqual(next.saved.favorites, [other.id]);
  const validated = validateSavedState(
    JSON.stringify(next.saved),
    ids,
    countryIds,
  );
  assert.equal(validated.warning, "");
  assert.ok(validated.saved.consumed.includes(other.id));
  assert.ok(validated.saved.consumed.includes(pick.places[0].id));
  assert.equal(JSON.stringify(stored), before);
});

test("city spin shares keep the accepted country, exact ID, quantity one and landing sector", () => {
  const original = filtersForCountry({ ...defaultFilters, quantity: 8 }, "JP");
  const pool = eligiblePlaces(places, original);
  const winner = pool.at(-1)!;
  const snapshot = spinSnapshot(pool, winner, original);
  original.include[0] = "PK";
  const rotation = landingRotation(pool.length - 1, pool.length, 123);
  assert.equal(sectorAtPointer(rotation, pool.length), pool.length - 1);
  const url = createShareUrl("https://example.com", "city", snapshot.filters, [
    winner.id,
  ]);
  assert.equal(new URL(url).pathname, "/random-city-generator");
  const parsed = parseSharedUrl(url, "city", ids, countryIds);
  assert.ok(parsed.ok && parsed.state);
  assert.deepEqual(parsed.state.resultIds, [winner.id]);
  assert.deepEqual(parsed.state.filters.include, ["JP"]);
  assert.equal(parsed.state.filters.quantity, 1);
  assert.equal(parsed.state.filters.continent, "all");
});

test("city no-repeat consumption survives country changes and no-coverage pools never draw", () => {
  const jp = filtersForCountry(defaultFilters, "JP");
  const pk = filtersForCountry(defaultFilters, "PK");
  const winner = eligiblePlaces(places, jp)[0];
  assert.ok(
    eligiblePlaces(places, pk, [winner.id]).every((p) => p.countryId === "PK"),
  );
  assert.ok(
    !eligiblePlaces(places, jp, [winner.id]).some((p) => p.id === winner.id),
  );
  assert.ok(
    eligiblePlaces(places, { ...jp, noRepeat: false }, [winner.id]).some(
      (p) => p.id === winner.id,
    ),
  );
  const empty = eligiblePlaces(places, filtersForCountry(defaultFilters, "NR"));
  assert.equal(empty.length, 0);
  const generated = prepareGeneration(empty, 1, "city", false);
  assert.equal(generated.ok, false);
  assert.ok(!("action" in generated));
});
