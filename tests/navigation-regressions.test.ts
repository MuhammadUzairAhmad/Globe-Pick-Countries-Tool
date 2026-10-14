import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  generatorReducer,
  initialState,
} from "../src/features/generator/lib/state.ts";
import { emptySavedState } from "../src/lib/storage/saved-state.ts";
import { placesForMode } from "../src/features/generator/lib/selection.ts";
import { savedPlaceLabel } from "../src/features/saved-places/labels.ts";
import { siteNavigation } from "../src/lib/seo/navigation.ts";
import { pages } from "../src/lib/seo/site.ts";
import type { Country, Place } from "../src/features/generator/types.ts";

const countries: Country[] = JSON.parse(
  readFileSync("src/data/countries/countries.json", "utf8"),
);
const capital = placesForMode(countries, "capital").find(
  (place) => place.id === "JP:tokyo",
)!;

function activeQuiz() {
  let state = generatorReducer(initialState(), {
    type: "hydrate",
    saved: emptySavedState(),
    shared: null,
    warning: "",
    message: "",
  });
  state = generatorReducer(state, {
    type: "generated",
    ids: [capital.id],
    at: 1,
    message: "Picked Tokyo, Japan.",
  });
  return generatorReducer(state, { type: "reveal", id: capital.id });
}

test("enabling practice clears answer-bearing announcements and revealed answers", () => {
  const original = activeQuiz();
  const hidden = generatorReducer(original, {
    type: "filters",
    filters: { ...original.saved.filters, guess: true },
  });
  assert.equal(hidden.saved.filters.guess, true);
  assert.deepEqual(hidden.revealed, []);
  assert.ok(!hidden.message.includes("Tokyo"));
  assert.deepEqual(hidden.resultIds, original.resultIds);
  assert.deepEqual(hidden.saved.history, original.saved.history);
  assert.deepEqual(hidden.saved.consumed, original.saved.consumed);
});

test("route reactivation retains the active quiz while syncing shared saved lists", () => {
  const original = activeQuiz();
  const otherRoute = {
    ...original.saved,
    filters: { ...original.saved.filters, continent: "Africa" as const },
    consumed: [capital.id, "ZA:pretoria"],
    favorites: ["ZA:pretoria"],
    history: [{ id: "ZA:pretoria", at: 2 }, ...original.saved.history],
  };
  const resumed = generatorReducer(original, {
    type: "resume",
    saved: otherRoute,
    warning: "",
  });
  assert.deepEqual(resumed.resultIds, original.resultIds);
  assert.deepEqual(resumed.revealed, original.revealed);
  assert.equal(resumed.revision, original.revision);
  assert.equal(resumed.message, original.message);
  assert.deepEqual(resumed.saved.filters, original.saved.filters);
  assert.deepEqual(resumed.saved.consumed, otherRoute.consumed);
  assert.deepEqual(resumed.saved.favorites, otherRoute.favorites);
  assert.deepEqual(resumed.saved.history, otherRoute.history);
  assert.equal(
    generatorReducer(resumed, {
      type: "hydrate",
      saved: emptySavedState(),
      shared: null,
      warning: "",
      message: "",
    }),
    resumed,
  );
});

test("reactivation with failed storage retains working memory and accepts a new replay", () => {
  const original = activeQuiz();
  const resumed = generatorReducer(original, {
    type: "resume",
    warning: "Storage unavailable",
  });
  assert.equal(resumed.saved, original.saved);
  assert.deepEqual(resumed.resultIds, original.resultIds);
  assert.equal(resumed.storageWarning, "Storage unavailable");
  const replay = generatorReducer(resumed, {
    type: "replay",
    ids: ["ZA:pretoria"],
  });
  assert.deepEqual(replay.resultIds, ["ZA:pretoria"]);
  assert.deepEqual(replay.revealed, []);
  assert.equal(replay.revision, resumed.revision + 1);
  assert.equal(replay.saved, resumed.saved);
});

test("saved action labels distinguish city and capital identities without leaking hidden answers", () => {
  const seats = placesForMode(countries, "capital").filter(
    (place) => place.countryId === "ZA",
  );
  const visible = seats.map((place) => savedPlaceLabel(place));
  const hidden = seats.map((place) => savedPlaceLabel(place, true));
  assert.equal(new Set(visible).size, 3);
  assert.equal(new Set(hidden).size, 3);
  for (const place of seats) {
    assert.ok(place.kind === "capital");
    assert.ok(savedPlaceLabel(place).includes(place.capital.name));
    assert.ok(savedPlaceLabel(place).includes(place.capital.role));
    assert.ok(!savedPlaceLabel(place, true).includes(place.capital.name));
  }
  const japan = countries.find((country) => country.id === "JP")!;
  const city = (name: string): Place => ({
    kind: "city",
    id: name,
    countryId: japan.id,
    country: japan,
    city: {
      id: name,
      name,
      countryId: japan.id,
      adminRegion: "",
      location: japan.location,
    },
  });
  assert.notEqual(
    savedPlaceLabel(city("Kyoto")),
    savedPlaceLabel(city("Osaka")),
  );
});

test("grouped navigation includes only published destinations and keeps policy links in the footer", () => {
  const navigation = siteNavigation(pages);
  assert.equal(navigation.worksheets.path, "/country-project-generator");
  const header = [...navigation.generators, ...navigation.explore].flatMap(
    (group) => group.links,
  );
  assert.ok(
    !header.some((link) =>
      ["/", "/about", "/privacy", "/terms"].includes(link.path),
    ),
  );
  assert.equal(navigation.generators[0].links.length, 3);
  assert.equal(navigation.explore[0].links.length, 3);
  assert.ok(
    navigation.footer
      .flatMap((group) => group.links)
      .some((link) => link.path === "/about"),
  );
  assert.throws(
    () =>
      siteNavigation(
        pages.filter((page) => page.path !== "/random-city-generator"),
      ),
    /unpublished/,
  );
});
