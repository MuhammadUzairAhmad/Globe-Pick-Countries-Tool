import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  regionalPages,
  countryGuides,
  findRegion,
  findCountryGuide,
} from "../src/data/tool-pages/curated.ts";
import { pages, pageMetadata } from "../src/lib/seo/site.ts";
import {
  defaultFilters,
  filtersForRegion,
  eligiblePlaces,
  placesForMode,
} from "../src/features/generator/lib/selection.ts";
import {
  breadcrumbData,
  serializeStructuredData,
  webApplicationData,
} from "../src/lib/seo/structured-data.ts";
import type { Country } from "../src/features/generator/types.ts";

const countries: Country[] = JSON.parse(
  readFileSync("src/data/countries/countries.json", "utf8"),
);

test("regional defaults override stale country choices without changing draw settings", () => {
  const saved = {
    ...defaultFilters,
    include: ["JP"],
    exclude: ["ZA"],
    quantity: 5,
  };
  const preset = filtersForRegion(saved, "Africa");
  assert.deepEqual(preset.include, []);
  assert.deepEqual(preset.exclude, []);
  assert.equal(preset.continent, "Africa");
  assert.equal(preset.quantity, 5);
  assert.deepEqual(saved.include, ["JP"]);
  const pool = eligiblePlaces(placesForMode(countries, "country"), preset);
  assert.equal(pool.length, 54);
  assert.ok(pool.every((place) => place.country.continent === "Africa"));
  assert.equal(filtersForRegion(saved), saved);
});

test("only curated slugs and clean canonical routes are published", () => {
  assert.equal(regionalPages.length, 3);
  assert.equal(countryGuides.length, 2);
  assert.equal(pages.length, 13);
  assert.equal(new Set(pages.map((page) => page.path)).size, pages.length);
  for (const page of pages) {
    assert.ok(!page.path.includes("?") && !page.path.includes("#"));
    assert.equal(pageMetadata(page.path).alternates?.canonical, page.path);
  }
  assert.equal(findRegion("not-a-region"), undefined);
  assert.equal(findCountryGuide("unreviewed-country"), undefined);
  for (const guide of countryGuides) {
    assert.ok(countries.some((country) => country.id === guide.id));
    assert.equal(guide.activities.length, 3);
    assert.ok(
      guide.sources.every(
        (source) => new URL(source.url).protocol === "https:",
      ),
    );
  }
});

test("structured data follows visible breadcrumbs and escapes script delimiters", () => {
  const items = [
    { label: "Home", path: "/" },
    { label: "Africa", path: "/random-country-generator/africa" },
  ];
  const breadcrumbs = breadcrumbData("https://example.com", items);
  assert.deepEqual(
    breadcrumbs.itemListElement.map((item) => item.name),
    items.map((item) => item.label),
  );
  assert.deepEqual(
    breadcrumbs.itemListElement.map((item) => item.position),
    [1, 2],
  );
  assert.equal(
    breadcrumbs.itemListElement[1].item,
    "https://example.com/random-country-generator/africa",
  );
  const hostile = { name: "</script><script>alert(1)</script>" };
  const serialized = serializeStructuredData(hostile);
  assert.ok(!serialized.includes("<"));
  assert.deepEqual(JSON.parse(serialized), hostile);
  const app = webApplicationData(
    "https://example.com",
    "/random-country-generator",
    "Country picker",
    "Pick countries.",
  );
  assert.equal(app.isAccessibleForFree, true);
  assert.ok(!("aggregateRating" in app) && !("review" in app));
});
