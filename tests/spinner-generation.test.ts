import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { prepareGeneration } from "../src/features/generator/lib/generation.ts";
import {
  generatorReducer,
  initialState,
} from "../src/features/generator/lib/state.ts";
import {
  eligiblePlaces,
  placesForMode,
} from "../src/features/generator/lib/selection.ts";
import type { Country } from "../src/features/generator/types.ts";

const countries: Country[] = JSON.parse(
  readFileSync("src/data/countries/countries.json", "utf8"),
);
const places = placesForMode(countries, "country");

test("one accepted spin records one pick without changing the saved batch quantity", () => {
  let state = initialState();
  state = {
    ...state,
    hydrated: true,
    saved: {
      ...state.saved,
      filters: { ...state.saved.filters, quantity: 6, include: ["JP", "PK"] },
    },
  };
  let calls = 0;
  const pick = prepareGeneration(
    eligiblePlaces(places, state.saved.filters),
    1,
    "country",
    false,
    () => {
      calls++;
      return 0;
    },
    123,
  );
  assert.ok(pick.ok);
  state = generatorReducer(state, pick.action);
  assert.equal(calls, 1);
  assert.equal(state.saved.filters.quantity, 6);
  assert.deepEqual(
    state.resultIds,
    pick.places.map((p) => p.id),
  );
  assert.deepEqual(state.saved.history, [{ id: pick.places[0].id, at: 123 }]);
  assert.deepEqual(state.saved.consumed, state.resultIds);
  const pool = eligiblePlaces(
    places,
    state.saved.filters,
    state.saved.consumed,
  );
  assert.equal(pool.length, 1);
  assert.ok(!pool.some((p) => p.id === pick.places[0].id));
  assert.equal(
    eligiblePlaces(
      places,
      { ...state.saved.filters, noRepeat: false },
      state.saved.consumed,
    ).length,
    2,
  );
  const replay = generatorReducer(state, {
    type: "replay",
    ids: state.resultIds,
  });
  assert.equal(replay.saved, state.saved);
});

test("empty pools produce no generated action, while existing batch and quiz messages remain valid", () => {
  const empty = prepareGeneration([], 1, "country", false);
  assert.equal(empty.ok, false);
  assert.ok(!("action" in empty));
  const batch = prepareGeneration(places, 6, "country", false, () => 0);
  assert.ok(batch.ok);
  assert.equal(batch.action.ids.length, 6);
  assert.match(batch.action.message, /^Picked 6 countries:/);
  const capitals = placesForMode(
    countries.filter((c) => c.id === "JP"),
    "capital",
  );
  const quiz = prepareGeneration(capitals, 1, "capital", true, () => 0);
  assert.ok(quiz.ok);
  assert.match(quiz.action.message, /capital question: Japan/);
  assert.ok(!quiz.action.message.includes("Tokyo"));
});

test("cached homepage resumes the full tool’s batch quantity while retaining its own country choices", () => {
  const original = initialState();
  original.saved.filters = {
    ...original.saved.filters,
    quantity: 2,
    continent: "Asia",
  };
  const saved = {
    ...original.saved,
    filters: {
      ...original.saved.filters,
      quantity: 8,
      continent: "Europe" as const,
    },
    consumed: ["JP"],
    favorites: ["JP"],
    history: [{ id: "JP", at: 1 }],
  };
  const resumed = generatorReducer(original, {
    type: "resume",
    saved,
    warning: "",
    syncQuantity: true,
  });
  assert.equal(resumed.saved.filters.quantity, 8);
  assert.equal(resumed.saved.filters.continent, "Asia");
  assert.deepEqual(resumed.saved.history, saved.history);
  assert.deepEqual(resumed.saved.favorites, saved.favorites);
  assert.deepEqual(resumed.saved.consumed, saved.consumed);
  const unavailable = generatorReducer(resumed, {
    type: "resume",
    warning: "Storage blocked",
    syncQuantity: true,
  });
  assert.equal(unavailable.saved, resumed.saved);
  const batchTool = generatorReducer(original, {
    type: "resume",
    saved,
    warning: "",
  });
  assert.equal(batchTool.saved.filters.quantity, 2);
});
