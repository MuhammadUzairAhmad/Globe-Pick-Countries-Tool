import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { countryPage } from "../src/features/spinner/lib/pagination.ts";
import { spinSnapshot } from "../src/features/spinner/lib/wheel.ts";
import { prepareGeneration } from "../src/features/generator/lib/generation.ts";
import {
  generatorReducer,
  initialState,
} from "../src/features/generator/lib/state.ts";
import {
  eligiblePlaces,
  filtersWithoutCountryChoices,
  placesForMode,
  selectPlaces,
} from "../src/features/generator/lib/selection.ts";
import type { Country } from "../src/features/generator/types.ts";

const countries: Country[] = JSON.parse(
  readFileSync("src/data/countries/countries.json", "utf8"),
);
const places = placesForMode(countries, "country");

test("spinner ignores custom country choices for draws and shares without erasing the full tool's settings", () => {
  const original = initialState();
  original.hydrated = true;
  original.saved.filters = {
    ...original.saved.filters,
    continent: "Asia",
    quantity: 6,
    include: ["JP"],
    exclude: ["PK"],
  };
  original.saved.consumed = ["JP"];
  const savedBefore = JSON.stringify(original.saved);
  const filters = filtersWithoutCountryChoices(original.saved.filters);
  const pool = eligiblePlaces(places, filters, original.saved.consumed);
  assert.ok(pool.length > 20);
  assert.ok(
    pool.every(
      (place) => place.country.continent === "Asia" && place.id !== "JP",
    ),
  );
  assert.ok(pool.some((place) => place.id === "PK"));
  assert.deepEqual(
    eligiblePlaces(places, original.saved.filters).map((place) => place.id),
    ["JP"],
  );
  const pick = prepareGeneration(
    pool,
    1,
    "country",
    false,
    () => pool.findIndex((place) => place.id === "PK"),
    100,
  );
  assert.ok(pick.ok);
  const generated = generatorReducer(original, pick.action);
  assert.deepEqual(generated.saved.filters, original.saved.filters);
  assert.deepEqual(generated.saved.history, [{ id: "PK", at: 100 }]);
  assert.deepEqual(generated.saved.consumed, ["JP", "PK"]);
  const snapshot = spinSnapshot(pool, pick.places[0], filters);
  assert.deepEqual(snapshot.filters.include, []);
  assert.deepEqual(snapshot.filters.exclude, []);
  assert.equal(snapshot.filters.quantity, 1);
  assert.equal(JSON.stringify(original.saved), savedBefore);
});

test("homepage resume refreshes stored custom choices without applying them to its pool", () => {
  const original = initialState();
  original.saved.filters = {
    ...original.saved.filters,
    continent: "Asia",
    include: ["JP"],
    quantity: 6,
  };
  const saved = {
    ...original.saved,
    filters: {
      ...original.saved.filters,
      continent: "Europe" as const,
      include: ["DE"],
      exclude: ["FR"],
      quantity: 8,
    },
  };
  const resumed = generatorReducer(original, {
    type: "resume",
    saved,
    warning: "",
    syncCountryChoices: true,
    syncQuantity: true,
  });
  assert.equal(resumed.saved.filters.continent, "Asia");
  assert.equal(resumed.saved.filters.quantity, 8);
  assert.deepEqual(resumed.saved.filters.include, ["DE"]);
  assert.deepEqual(resumed.saved.filters.exclude, ["FR"]);
  assert.ok(
    eligiblePlaces(places, filtersWithoutCountryChoices(resumed.saved.filters))
      .length > 20,
  );
  const unavailable = generatorReducer(resumed, {
    type: "resume",
    warning: "Storage unavailable",
    syncCountryChoices: true,
  });
  assert.equal(unavailable.saved, resumed.saved);
  const fullTool = generatorReducer(original, {
    type: "resume",
    saved,
    warning: "",
  });
  assert.equal(fullTool.saved.filters, original.saved.filters);
});

test("country pages cover the entire available pool while off-page countries remain eligible to win", () => {
  const before = places.map((place) => place.id);
  const first = countryPage(places, 1);
  assert.equal(first.pageCount, 25);
  assert.equal(first.countries.length, 8);
  const everyPage = Array.from({ length: first.pageCount }, (_, index) =>
    countryPage(places, index + 1),
  );
  assert.deepEqual(
    everyPage.flatMap((page) => page.countries.map((place) => place.id)),
    before,
  );
  assert.equal(everyPage.at(-1)!.countries.length, 3);
  const pick = selectPlaces(places, 1, (bound) => bound - 1);
  assert.ok(pick.ok);
  assert.ok(!first.countries.includes(pick.places[0]));
  assert.deepEqual(
    places.map((place) => place.id),
    before,
  );
});

test("pagination clamps shrinking and empty pools and handles invalid page requests", () => {
  const smaller = countryPage(places.slice(0, 176), 25);
  assert.equal(smaller.page, 22);
  assert.equal(smaller.first, 169);
  assert.equal(smaller.last, 176);
  assert.equal(smaller.countries.length, 8);
  const empty = countryPage([], 25);
  assert.deepEqual(empty, {
    page: 1,
    pageCount: 1,
    countries: [],
    first: 0,
    last: 0,
  });
  for (const request of [-10, 0, NaN, Infinity, 1.5])
    assert.equal(countryPage(places, request).page, 1);
  assert.equal(countryPage(places.slice(0, 1), 3).countries.length, 1);
});

test("compact phone pages retain every country and clamp after pool exhaustion", () => {
  const first = countryPage(places, 1, 4);
  assert.equal(first.countries.length, 4);
  assert.equal(first.pageCount, 49);
  const pages = Array.from({ length: first.pageCount }, (_, index) =>
    countryPage(places, index + 1, 4),
  );
  assert.deepEqual(
    pages.flatMap((page) => page.countries),
    places,
  );
  const last = pages.at(-1)!;
  assert.equal(last.first, 193);
  assert.equal(last.last, 195);
  assert.equal(last.countries.length, 3);
  const shrinking = countryPage(places.slice(0, 5), 49, 4);
  assert.equal(shrinking.page, 2);
  assert.deepEqual(shrinking.countries, places.slice(4, 5));
  const empty = countryPage([], 49, 4);
  assert.equal(empty.page, 1);
  assert.equal(empty.first, 0);
  assert.equal(empty.last, 0);
});
