import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import type { Country } from "../src/features/generator/types.ts";

const text = readFileSync("src/data/countries/countries.json", "utf8");
const data: Country[] = JSON.parse(text);
const manifest = JSON.parse(
  readFileSync("src/data/countries/manifest.json", "utf8"),
);
assert.equal(data.length, 195, "Unexpected country scope");
assert.equal(data.filter((c) => c.classification === "UN member").length, 193);
assert.equal(
  new Set(data.map((c) => c.id)).size,
  data.length,
  "Duplicate country IDs",
);
assert.equal(
  new Set(data.map((c) => c.slug)).size,
  data.length,
  "Duplicate country slugs",
);
const capitalIds = new Set<string>();
for (const country of data) {
  assert.match(country.id, /^[A-Z]{2}$/);
  assert.match(country.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
  assert.ok(country.name.trim());
  assert.ok(
    [
      "Africa",
      "Asia",
      "Europe",
      "North America",
      "South America",
      "Oceania",
    ].includes(country.continent),
  );
  assert.ok(
    Number.isFinite(country.location.lat) &&
      Math.abs(country.location.lat) <= 90,
  );
  assert.ok(
    Number.isFinite(country.location.lng) &&
      Math.abs(country.location.lng) <= 180,
  );
  assert.match(country.reviewed, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(
    country.capitals.length &&
      country.languages.length &&
      country.currencies.length,
  );
  assert.equal(country.flag, `/flags/${country.id.toLowerCase()}.svg`);
  assert.ok(existsSync(`public${country.flag}`), `Missing ${country.flag}`);
  const flag = readFileSync(`public${country.flag}`, "utf8");
  assert.match(flag, /<svg/);
  assert.ok(
    !/<script|onload=|https?:\/\/[^"']+\.(?:png|jpg)/i.test(flag),
    "Unsafe flag asset",
  );
  for (const url of Object.values(country.sources))
    assert.equal(new URL(url).protocol, "https:");
  for (const currency of country.currencies) {
    assert.match(currency.code, /^[A-Z]{3}$/);
    assert.ok(currency.name.trim());
  }
  for (const capital of country.capitals) {
    const id = `${country.id}:${capital.id}`;
    assert.ok(!capitalIds.has(id), `Duplicate capital ${id}`);
    capitalIds.add(id);
    assert.ok(capital.name.trim() && capital.role.trim());
    assert.equal(new URL(capital.source).protocol, "https:");
  }
}
assert.equal(capitalIds.size, manifest.capitalEntryCount);
assert.equal(
  createHash("sha256").update(text).digest("hex"),
  manifest.sha256,
  "Dataset digest changed; update the manifest",
);
assert.equal(
  text,
  readFileSync("public/data/countries.json", "utf8"),
  "Downloadable database differs from app database",
);
for (const file of ["countries-ODbL.txt", "flags-MIT.txt", "geist-OFL.txt"])
  assert.ok(existsSync(`public/licenses/${file}`));
assert.ok(existsSync("public/maps/world-land.svg"));
assert.equal(
  data.find((c) => c.id === "GQ")?.capitals[0].name,
  "Ciudad de la Paz",
);
assert.equal(data.find((c) => c.id === "LK")?.capitals.length, 2);
assert.equal(data.find((c) => c.id === "ZA")?.capitals.length, 3);
console.log(
  `Validated ${data.length} countries, ${capitalIds.size} capital/seat entries, flags, sources, licenses, coordinates, and database digest.`,
);
