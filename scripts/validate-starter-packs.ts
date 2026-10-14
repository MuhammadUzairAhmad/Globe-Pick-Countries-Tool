import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import type { Country } from "../src/features/generator/types.ts";
import { starterPackContent } from "../src/features/worksheets/starter-pack.ts";

const countries = JSON.parse(
  readFileSync("src/data/countries/countries.json", "utf8"),
) as Country[];
const pack = starterPackContent(countries);
const manifestBytes = readFileSync("src/data/worksheet-packs/manifest.json");
const manifest = JSON.parse(manifestBytes.toString()) as {
  id: string;
  reviewed: string;
  countryIds: string[];
  sourceSha256: string;
  palette: Record<string, string>;
  files: {
    paper: string;
    path: string;
    pages: number;
    bytes: number;
    sha256: string;
  }[];
};
const digest = (input: string | Buffer) =>
  createHash("sha256").update(input).digest("hex");
assert.equal(manifest.id, pack.id);
assert.equal(manifest.reviewed, pack.reviewed);
assert.deepEqual(manifest.countryIds, pack.countryIds);
assert.equal(
  manifest.sourceSha256,
  digest(JSON.stringify(pack) + "\n"),
  "Questions/reference facts changed. Rebuild and visually review the starter PDFs.",
);
assert.deepEqual(manifestBytes, readFileSync("public/packs/manifest.json"));
assert.deepEqual(
  manifest.files.map((file) => file.paper),
  ["a4", "letter"],
);
const css = readFileSync("src/app/globals.css", "utf8");
assert.deepEqual(Object.keys(manifest.palette).sort(), [
  "brand",
  "foreground",
  "muted",
]);
for (const [name, color] of Object.entries(manifest.palette)) {
  assert.equal(
    color,
    css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1],
    "Shared PDF colors changed; rebuild the packs.",
  );
}
for (const file of manifest.files) {
  assert.equal(file.path, `/packs/globepick-country-profile-${file.paper}.pdf`);
  const content = readFileSync("public" + file.path);
  assert.ok(content.subarray(0, 8).toString().startsWith("%PDF-"));
  assert.equal(content.length, file.bytes);
  assert.equal(digest(content), file.sha256, "Download checksum mismatch.");
  assert.equal(file.pages, pack.pages);
}
assert.ok(
  readFileSync("public/licenses/worksheet-fonts-DejaVu.txt", "utf8").includes(
    "Bitstream",
  ),
);
console.log(
  "Validated two starter PDFs, source/question consistency, shared palette, download digests, and font notice.",
);
