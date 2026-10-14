import { test, mock } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  cryptoRandomInt,
  formatPlace,
  defaultFilters,
  eligiblePlaces,
  placesForMode,
  selectPlaces,
} from "../src/features/generator/lib/selection.ts";
import type { Country } from "../src/features/generator/types.ts";

const countries: Country[] = JSON.parse(
  readFileSync("src/data/countries/countries.json", "utf8"),
);
const places = placesForMode(countries, "country");

test("selection honors continent, inclusion, and exclusion conflicts", () => {
  const filters = {
    ...defaultFilters,
    continent: "Asia" as const,
    include: ["JP", "DE", "PK"],
    exclude: ["PK"],
  };
  assert.deepEqual(
    eligiblePlaces(places, filters).map((p) => p.id),
    ["JP"],
  );
  assert.deepEqual(
    eligiblePlaces(places, { ...filters, exclude: ["JP", "PK"] }),
    [],
  );
});

test("partial Fisher–Yates produces a unique eligible batch without mutating data", () => {
  const pool = eligiblePlaces(places, {
    ...defaultFilters,
    continent: "Europe",
  });
  const before = pool.map((p) => p.id);
  const selected = selectPlaces(pool, 20, (bound) => bound - 1);
  assert.ok(selected.ok);
  assert.equal(new Set(selected.places.map((p) => p.id)).size, 20);
  assert.ok(selected.places.every((p) => p.country.continent === "Europe"));
  assert.deepEqual(
    pool.map((p) => p.id),
    before,
  );
});

test("no-repeat pool survives filter changes and requires explicit reset", () => {
  const filters = { ...defaultFilters, include: ["JP", "PK"] };
  const draw = selectPlaces(eligiblePlaces(places, filters), 2, () => 0);
  assert.ok(draw.ok);
  const consumed = draw.places.map((p) => p.id);
  assert.equal(eligiblePlaces(places, filters, consumed).length, 0);
  assert.equal(
    eligiblePlaces(
      places,
      { ...filters, include: [], continent: "Asia" },
      consumed,
    ).some((p) => consumed.includes(p.id)),
    false,
  );
  assert.equal(eligiblePlaces(places, filters, []).length, 2);
  assert.equal(
    eligiblePlaces(places, { ...filters, noRepeat: false }, consumed).length,
    2,
  );
});

test("capacity, exhaustion and invalid quantities are explicit failures", () => {
  for (const quantity of [0, 21, 1.1, NaN, Infinity])
    assert.equal(selectPlaces(places, quantity).ok, false);
  assert.deepEqual(selectPlaces([], 1), {
    ok: false,
    code: "empty",
    message:
      "No places are available. Change your filters or reset picked places.",
  });
  const capacity = selectPlaces(places.slice(0, 1), 2);
  assert.ok(!capacity.ok && capacity.code === "capacity");
  assert.throws(() => selectPlaces(places, 1, () => -1));
});

test("capital mode has distinct country-capital IDs and retains roles", () => {
  const capitals = placesForMode(countries, "capital");
  const pool = eligiblePlaces(capitals, { ...defaultFilters, include: ["ZA"] });
  assert.equal(pool.length, 3);
  assert.equal(new Set(pool.map((p) => p.id)).size, 3);
  assert.ok(
    pool.every(
      (p) => p.kind === "capital" && p.capital.role.includes("capital"),
    ),
  );
  // Country consumption never accidentally consumes a capital entry.
  assert.equal(
    eligiblePlaces(capitals, { ...defaultFilters, include: ["ZA"] }, ["ZA"])
      .length,
    3,
  );
});

test("bounded crypto randomness rejects the biased tail", () => {
  let calls = 0;
  const stub = mock.method(
    globalThis.crypto,
    "getRandomValues",
    (buffer: Uint32Array) => {
      buffer[0] = calls++ === 0 ? 0xffffffff : 4;
      return buffer;
    },
  );
  try {
    assert.equal(cryptoRandomInt(3), 1);
    assert.equal(calls, 2);
    assert.throws(() => cryptoRandomInt(0));
  } finally {
    stub.mock.restore();
  }
});

test("copied capital facts retain role, context note, and the reviewed source", () => {
  const place = placesForMode(countries, "capital").find(
    (entry) => entry.id === "ZA:bloemfontein",
  )!;
  const text = formatPlace(place);
  assert.ok(text.includes("Judicial capital"));
  assert.ok(text.includes("Constitutional Court"));
  assert.ok(text.includes("https://www.gov.za/"));
});
