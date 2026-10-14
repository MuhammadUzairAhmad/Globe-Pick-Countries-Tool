import assert from "node:assert/strict";
import { writeFileSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { performance } from "node:perf_hooks";
import nextEnvironment from "@next/env";
const { loadEnvConfig } = nextEnvironment;
import { inspectPageHtml } from "../src/lib/seo/production-checks.ts";

loadEnvConfig(process.cwd());
const { pages, siteOrigin, isPublicSite } =
  await import("../src/lib/seo/site.ts");

const base = new URL(process.argv[2] ?? "");
assert.ok(
  ["http:", "https:"].includes(base.protocol) &&
    base.pathname === "/" &&
    !base.username &&
    !base.password &&
    !base.search &&
    !base.hash,
  "Pass an explicit test-server origin.",
);
const report: {
  route: string;
  status: number;
  htmlBytes: number;
  gzipBytes: number;
  responseMs: number;
  issues: string[];
}[] = [];
const cityId = (
  JSON.parse(readFileSync("src/data/cities/cities.json", "utf8")) as {
    id: string;
  }[]
)[0].id;
for (const page of pages) {
  const started = performance.now();
  const response = await fetch(new URL(page.path, base));
  const html = await response.text();
  const responseMs = Math.round(performance.now() - started);
  const checked = inspectPageHtml(
    html,
    page.path,
    siteOrigin.href,
    isPublicSite,
  );
  const gzipBytes = gzipSync(html).length;
  if (response.status !== 200) checked.issues.push("Expected HTTP 200.");
  const budget = page.path === "/random-city-generator" ? 250_000 : 120_000;
  if (gzipBytes > budget)
    checked.issues.push(`HTML exceeds ${budget}-byte gzip budget.`);
  if (page.path !== "/random-city-generator" && html.includes(cityId))
    checked.issues.push("City-record payload leaked into another route.");
  report.push({
    route: page.path,
    status: response.status,
    htmlBytes: Buffer.byteLength(html),
    gzipBytes,
    responseMs,
    issues: checked.issues,
  });
}
const missing = [
  "/countries/unreviewed",
  "/countries/ghana",
  "/random-country-generator/unreviewed",
  "/random-country-generator/oceania",
  "/random-city-generator/unreviewed",
];
for (const path of missing) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 404, `${path} must return 404`);
  await response.text();
}
const assets = [
  "/data/countries.json",
  "/data/manifest.json",
  "/data/cities/cities.json",
  "/data/cities/manifest.json",
  "/flags/jp.svg",
  "/maps/world-land.svg",
  "/licenses/countries-ODbL.txt",
  "/licenses/flags-MIT.txt",
  "/licenses/geist-OFL.txt",
  "/licenses/cities-Natural-Earth.txt",
  "/social-preview.png",
  "/icon.svg",
];
for (const path of assets) {
  const response = await fetch(new URL(path, base));
  assert.equal(response.status, 200, `${path} must load`);
  await response.arrayBuffer();
}
const sitemap = await (await fetch(new URL("/sitemap.xml", base))).text();
const entries = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
  (match) => match[1],
);
assert.deepEqual(
  entries.sort(),
  isPublicSite
    ? pages
        .filter((page) => page.published)
        .map((page) => new URL(page.path, siteOrigin).href)
        .sort()
    : [],
);
const query = await (
  await fetch(
    new URL("/random-country-generator/africa?gp=1&m=country&p=ZA", base),
  )
).text();
assert.ok(
  query.includes(
    `href="${new URL("/random-country-generator/africa", siteOrigin).href}"`,
  ),
  "Query canonical must stay clean",
);
const output = {
  checkedAt: new Date().toISOString(),
  profile:
    "Local production server, unthrottled HTTP requests; gzip-equivalent HTML budgets, not field Core Web Vitals.",
  canonicalOrigin: siteOrigin.href,
  indexable: isPublicSite,
  routes: report,
  genuine404s: missing.length,
  assets: assets.length,
  sitemapEntries: entries.length,
};
if (process.argv[3])
  writeFileSync(process.argv[3], JSON.stringify(output, null, 2) + "\n");
console.table(
  report.map(({ route, gzipBytes, responseMs, issues }) => ({
    route,
    gzipKB: Math.round(gzipBytes / 1024),
    localResponseMs: responseMs,
    issues: issues.join(" "),
  })),
);
assert.ok(
  report.every((row) => row.issues.length === 0),
  "Production page audit failed.",
);
console.log(
  `Verified ${report.length} pages, ${missing.length} genuine 404s, ${assets.length} assets, clean query canonicals, and ${entries.length} sitemap entries.`,
);
