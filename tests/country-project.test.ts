import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  createAssignments,
  countryReference,
  projectThemes,
} from "../src/features/learning/country-project.ts";
import {
  defaultFilters,
  eligiblePlaces,
  placesForMode,
  selectPlaces,
} from "../src/features/generator/lib/selection.ts";
import type { Country } from "../src/features/generator/types.ts";

const countries: Country[] = JSON.parse(
  readFileSync("src/data/countries/countries.json", "utf8"),
);

test("project assignments reuse the eligible unique selection and reject oversized sets", () => {
  const pool = eligiblePlaces(placesForMode(countries, "country"), {
    ...defaultFilters,
    continent: "Africa",
    include: ["ZA", "GH", "NG"],
    exclude: ["NG"],
  });
  const result = selectPlaces(pool, 2, () => 0);
  assert.ok(result.ok);
  const assignments = createAssignments(
    result.places.map((place) => place.country),
    "profile",
  );
  assert.deepEqual(
    assignments.map((assignment) => assignment.country.id),
    ["GH", "ZA"],
  );
  assert.deepEqual(
    assignments.map((assignment) => assignment.number),
    [1, 2],
  );
  assert.equal(selectPlaces(pool, 3).ok, false);
  assert.throws(() => createAssignments([], "profile"));
  assert.throws(() =>
    createAssignments([countries[0], countries[0]], "profile"),
  );
  assert.throws(() => createAssignments(countries.slice(0, 21), "profile"));
  assert.equal(createAssignments(countries.slice(0, 20), "profile").length, 20);
});

test("every topic works across the dataset and keeps generated questions independent", () => {
  for (const topic of projectThemes) {
    for (let offset = 0; offset < countries.length; offset += 20) {
      const assignments = createAssignments(
        countries.slice(offset, offset + 20),
        topic.id,
      );
      for (const assignment of assignments) {
        assert.equal(assignment.prompts.length, 4);
        assert.equal(
          new Set(assignment.prompts.map((prompt) => prompt.id)).size,
          4,
        );
        assert.equal(assignment.title, topic.title);
        assert.ok(
          assignment.prompts.every(
            (prompt) => prompt.question && prompt.guidance,
          ),
        );
      }
    }
  }
  const first = createAssignments(countries.slice(0, 1), "profile");
  const before = JSON.stringify(first);
  const second = createAssignments(countries.slice(0, 1), "land");
  assert.equal(JSON.stringify(first), before);
  assert.notEqual(first[0].prompts[0], second[0].prompts[0]);
  const third = createAssignments(countries.slice(0, 1), "profile");
  assert.notEqual(first[0].prompts[0], third[0].prompts[0]);
});

test("teacher references preserve multiple capital roles, exceptional notes, dates and sources", () => {
  const southAfrica = countries.find((country) => country.id === "ZA")!;
  const reference = countryReference(southAfrica);
  const capitals = reference.facts.find(
    (fact) => fact.label === "Capitals and government seats",
  )!.value;
  for (const capital of southAfrica.capitals) {
    assert.ok(capitals.includes(capital.name));
    assert.ok(capitals.includes(capital.role));
    assert.ok(reference.sources.includes(capital.source));
  }
  assert.ok(
    reference.notes.some((note) => note.includes("Constitutional Court")),
  );
  assert.equal(new Set(reference.sources).size, reference.sources.length);
  const nauru = countryReference(
    countries.find((country) => country.id === "NR")!,
  );
  assert.ok(
    nauru.notes.some((note) =>
      note.includes("no officially designated capital"),
    ),
  );
  const palestine = countries.find((country) => country.id === "PS")!;
  assert.ok(countryReference(palestine).notes.includes(palestine.note!));
  assert.match(
    createAssignments([southAfrica], "profile")[0].country.reviewed,
    /^\d{4}-\d{2}-\d{2}$/,
  );
});
