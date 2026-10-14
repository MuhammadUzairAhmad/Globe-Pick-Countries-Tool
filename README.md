# GlobePick

A frontend-only geography learning tool built with Next.js App Router, React, strict TypeScript, and Tailwind CSS v4. Phases 0–6, local Phase 7 checks, and a Phase 8 starter pack are implemented. Public launch and real-usage experiments are pending.

- Random country, capital/government-seat, and city/town selection with continent and searchable inclusion/exclusion filters.
- Unique batches of 1–20, explicit capacity handling, and separate persistent no-repeat pools.
- Facts, local flags, optional approximate map markers, and visible sources.
- Capital guess/reveal, local history/favorites/settings, copy, and validated shareable replays.
- Country project assignments with three reviewed question sets, optional teacher notes, and printable A4/US Letter worksheets.
- Free four-page Japan/South Africa starter PDFs in A4 and US Letter, with teacher guidance, reference sources, and download checksums.
- Pre-rendered introductions and samples, clean metadata, published-route registry, sitemap, robots, and 404/error handling.

## Develop

Use Node.js 22.18+ for the native TypeScript scripts.

```bash
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). The app needs no runtime geography service or backend.

## Check

```bash
npm test
npm run validate:data
npm run lint
npm run typecheck
npm run format:check
npm run build
# After starting this build on an explicit local origin:
npm run verify:production -- http://127.0.0.1:43075 /tmp/globepick-audit.json
npm run check:launch
```

`prebuild` automatically validates data. Tests cover eligibility, uniqueness, no-repeat behavior, capacity, crypto rejection sampling, storage corruption/limits, share validation, replay state, and browser adapter failures. `npm run format` applies Prettier. `npm run assets:brand` regenerates static brand assets after shared color changes.

Production verification checks published routes, initial HTML, indexing/canonicals, sampled assets, true 404s, and HTML payload budgets. `check:launch` deliberately exits with pending items until the real domain, public contact, host, and policy review are configured. Neither command deploys anything. See `docs/launch-verification.md` for results and remaining print/device/performance checks.

## Data and licenses

195 country records cover 193 UN members plus Palestine and Vatican City (Holy See representation). Capital mode has 204 capital/government-seat entries, each labeled by role. Each eligible country is equally likely in country mode; capital entries are equally likely in capital mode. Countries with multiple seats therefore have more capital entries.

The pinned community database has structural checks and reviewed exceptional cases; it is not an independent audit of every fact. The six-continent filtering model and remaining limitations are documented on About and in `public/data/manifest.json`. The adapted database is downloadable at `/data/countries.json` under ODbL 1.0; flags are vendored from flag-icons under MIT; the Natural Earth land outline is public domain; Geist uses SIL OFL 1.1. Notices are in `public/licenses/`.

`src/data/countries/countries.json` and the downloadable copy must remain identical, with the manifest's SHA-256 digest updated after a reviewed change. `scripts/prepare-geography-data.py SOURCE_DIRECTORY` rebuilds the adapted records and land SVG from staged `countries.json`, `land.geojson`, and `provenance.json`; it makes no network calls. The manifest records the exact upstream commits to use when preparing those inputs. Country data, flags, and maps are not fetched at build time or runtime.

## Structure

- `src/app/globals.css`: common design tokens; component styling uses Tailwind classes.
- `src/components`: shared primitives, layout, and pre-rendered learning content.
- `src/features/generator`: typed records, pure selection/reducer, hydration hook, filters and result components.
- `src/features/learning` and `src/features/saved-places`: quiz and browser-saved place presentation.
- `src/data/countries`: adapted dataset and source manifest.
- `src/lib/storage` and `src/lib/share`: validated browser persistence, URL codec, copy/share adapters.
- `src/lib/seo/site.ts`: published-page registry and metadata configuration.
- `docs/architecture.md`: behavior, decisions, source scope, and launch dependencies.
- `docs/implementation-progress.md`: phase gates and verification.

## Browser data

Each tool has its own versioned localStorage record. Refresh restores settings, history, favorites, and consumed IDs without an initial empty overwrite. Clear controls operate separately; clearing history does not reset the no-repeat pool. There is no account, cloud sync, or cross-tab merging. Storage failures leave the tool usable. Shared results replay without consuming the recipient's pool or adding history.

## Deployment

Nothing is deployed by this task. Without `NEXT_PUBLIC_SITE_URL`, all pages remain noindex, sitemap entries are empty, and metadata uses localhost. Copy `.env.example` to `.env.local` to configure the actual origin and rebuild. Public indexing requires a non-loopback HTTPS origin. A public configuration includes the thirteen published pages in the sitemap; shared query variants canonicalize to their base route.

Before launch, add the maintainer's public identity and corrections contact, review hosting-specific privacy/terms, configure the actual origin, and finish launch accessibility/performance review. No database, authentication, custom API route, or Server Action is used. Three regional generators and two reviewed learning guides are included. Deployment and Search Console registration are deferred until hosting.

## Country projects

Open `/country-project-generator`. Choose a research topic, filter countries, and create 1–20 unique assignments. The existing random-selection engine and filter controls are shared with the country tool. Project assignments and repeat prevention live only in page memory; leaving or refreshing starts a new session. No student names or answers are stored.

Preview and print use the same assignment objects. Select A4 or US Letter and optionally append teacher notes, then use Print worksheets to print or save through the browser. Use the matching paper size, standard scale, and disable browser headers/footers. Research-question review notes are in `docs/research-prompts.md`.

## Starter packs

The project page also offers two static PDF formats of a Japan/South Africa activity. Both reuse the existing country-profile questions, source notes, and teacher references. All eight PDF pages were rendered and visually checked. Build validation checks their source/question digest, download checksums, and shared palette; stale PDFs must be regenerated and reviewed. PDF authoring is offline and does not add a runtime package or backend. See `docs/growth-experiments.md` for regeneration and the experiments deferred until real usage.

## City data

City mode uses 7,194 selected Natural Earth city/town points across 194 countries; Nauru has no retained records. Every matching record is equally likely. In all-country mode, countries with more records appear more often. Population is neither displayed nor used for selection. Historic places, stations, outside-scope country references, and exact name/country/admin-region duplicates are excluded. Source labels are a dated cartographic snapshot, not a complete city register or current boundary authority.

City data is imported only by `/random-city-generator`; city links disable prefetching so country/capital pages do not preload the large dataset. `scripts/prepare-city-data.py SOURCE_GEOJSON` recreates the adaptation offline from the pinned source in `public/data/cities/manifest.json`. Data, per-country counts, source identifiers, method, public-domain notice, and checksums are downloadable. City storage and shared URLs use the same validated adapters with a separate `globepick:v1:city` key.

## Curated learning pages

Africa, Asia, and Europe routes start the existing country generator with a regional filter and include original atlas activities and a source-based country list. Only Japan and South Africa have reviewed country guides. Unknown regional/country slugs return 404; no query permutations are published. Breadcrumb and WebApplication data reflect visible content without ratings or invented reviews. See `docs/seo-research.md` for intent research, source checks, and the deferred Search Console steps.
