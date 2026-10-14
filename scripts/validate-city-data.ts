import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import type { City, Country } from "../src/features/generator/types.ts";
import {
  citySource,
  cityReviewed,
} from "../src/features/generator/lib/city-source.ts";

const raw = readFileSync("src/data/cities/cities.json");
const cities: City[] = JSON.parse(raw.toString());
const countries: Country[] = JSON.parse(
  readFileSync("src/data/countries/countries.json", "utf8"),
);
const manifest = JSON.parse(
  readFileSync("src/data/cities/manifest.json", "utf8"),
);
const known = new Set(countries.map((country) => country.id));
const ids = new Set<string>();
const identities = new Set<string>();
const coverage: Record<string, number> = {};
for (const city of cities) {
  assert.match(city.id, /^ne-\d+$/);
  assert.ok(!ids.has(city.id));
  ids.add(city.id);
  assert.ok(known.has(city.countryId));
  assert.ok(typeof city.name === "string" && city.name.trim());
  assert.equal(typeof city.adminRegion, "string");
  const identity = JSON.stringify([
    city.countryId,
    city.name,
    city.adminRegion,
  ]);
  assert.ok(!identities.has(identity));
  identities.add(identity);
  assert.ok(
    Number.isFinite(city.location.lat) && Math.abs(city.location.lat) <= 90,
  );
  assert.ok(
    Number.isFinite(city.location.lng) && Math.abs(city.location.lng) <= 180,
  );
  coverage[city.countryId] = (coverage[city.countryId] ?? 0) + 1;
}
assert.equal(cities.length, manifest.cityCount);
assert.equal(Object.keys(coverage).length, manifest.coveredCountryCount);
assert.deepEqual(coverage, manifest.coverage);
assert.deepEqual(
  [...known].filter((id) => !coverage[id]).sort(),
  manifest.missingCountryIds,
);
assert.equal(manifest.source, citySource);
assert.equal(manifest.reviewed, cityReviewed);
assert.equal(manifest.license, "Public domain");
assert.equal(createHash("sha256").update(raw).digest("hex"), manifest.sha256);
assert.deepEqual(raw, readFileSync("public/data/cities/cities.json"));
assert.deepEqual(
  manifest,
  JSON.parse(readFileSync("public/data/cities/manifest.json", "utf8")),
);
assert.ok(
  readFileSync("public/licenses/cities-Natural-Earth.txt", "utf8").includes(
    manifest.licenseUrl,
  ),
);
console.log(
  `Validated ${cities.length} city/town records, ${manifest.coveredCountryCount} country coverage counts, unique identities, coordinates, source/license, and digest.`,
);
