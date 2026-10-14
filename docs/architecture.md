# GlobePick architecture and scope

Updated 14 October 2026. Implements Phases 0–4 of the local plan.

## Starting point and stack

The repository contained an unchanged create-next-app page, root layout, and global CSS. No product features were replaced. Next.js 16.4.0, React 19.3.0, Tailwind CSS 4, and strict TypeScript 5 are retained, with the existing Turbopack Tailwind integration, Cache Components, and Partial Prefetching configuration. Version-specific local Next.js guides were read before implementation. Native TypeScript test/data scripts need Node.js 22.18+; this workspace uses Node.js 26.

## Rendering and styling

Routes, introductions, samples, how-to content, dataset explanations, and metadata remain Server Components and are statically pre-rendered. Generator interaction is a Client Component boundary, with pure selection/state functions, presentational country/capital components, and separate browser adapters. There are no custom API routes, Server Actions, authentication, database, runtime geography requests, or global state libraries.

`src/app/globals.css` owns shared Tailwind theme tokens. Components compose Tailwind utilities. Country and capital tools reuse ToolPageLayout, GeneratorWorkspace, GeneratorFilters, QuantityControl, ResultsGrid, PlaceResultCard, PlaceIdentity, FactList, ResultActions, and saved-place lists. Glass has an opaque fallback. The vendored Geist font uses `next/font/local`; no remote font request is needed. Original brand assets are generated from theme colors by `scripts/generate-brand-assets.mjs`.

## Dataset and geography model

The offline pool contains 195 records: 193 UN members, Palestine, and Vatican City representing the Holy See. Non-member territories and other entities are outside this scope. This classification overrides an incorrect upstream membership flag for Palestine. The six continent groups retain upstream regional assignments, splitting the Americas into North America (including Central America and the Caribbean) and South America. Transcontinental conventions are explained on each tool page and in the downloadable manifest.

The adapted database is based on a pinned mledoze/countries commit. Structural validation checks every record, ID, slug, coordinate, asset, source, license, coverage count, and database digest before every production build. Exceptional capital roles, selected transitions, and missing/outdated currency records were reviewed against linked primary sources. Remaining fields follow the community snapshot; this is not an independent audit of every fact. Review date: 14 October 2026. No population estimates or travel advice are included.

Country mode selects uniformly over country records. Capital mode selects uniformly over 204 distinct capital/government-seat entries, so a country with multiple entries has more chances than a country with one. Roles distinguish constitutional capitals, administrative seats, federal cities, claimed capitals, and other arrangements. Sri Lanka, South Africa, Bolivia, Benin, Malaysia, the Netherlands, and Eswatini have explicit role entries. Equatorial Guinea uses Ciudad de la Paz following its January 2026 designation. Nauru does not have an officially designated capital; Yaren is labeled as a de facto government district. Indonesia's transition to Nusantara and Jerusalem's disputed status are noted.

The adapted database and provenance manifest are downloadable under ODbL 1.0. Flag-icons renditions are locally vendored under MIT. Natural Earth's public-domain 1:110m land outline is locally generated; it shows land rather than country borders. Markers are approximate country centers, not capital coordinates. Maps mount on request. Small islands can be absent at this scale. Sources and full license notices are linked from About and the tools.

## Selection and state

The pure engine applies continent restrictions, then inclusion/exclusion choices (exclusions win), then the consumed-ID pool. Empty inclusion means all countries. Partial Fisher–Yates selection produces 1–20 unique entries per batch. A crypto bounded-integer adapter uses rejection sampling to avoid modulo bias and is invoked only in event handlers. Capacity errors never duplicate entries or silently reset the pool; an explicit all-remaining action is available.

A feature reducer owns settings, results, reveal state, history, favorites, replay state, and hydration status. Derived pools are computed from source state. Every fresh draw records consumed IDs, including draws while no-repeat is off; turning it back on excludes those draws until reset. Filter changes and clearing history do not reset consumption. Country and capital modes have separate state and storage keys. A mode key forces the interactive boundary to remount when switching tools.

Quiz answers are hidden in result cards and current history/favorite entries until revealed. Copy/save actions for hidden answers are disabled. Sharing while answers are hidden shares filters only. Quiz controls remain mounted during reveal to retain keyboard focus, and a new draw resets transient guesses.

## Browser persistence and sharing

Storage keys are `globepick:v1:country` and `globepick:v1:capital`. Only versioned settings, stable IDs, timestamps, up to 100 history entries per mode, and favorites are stored. Reads validate versions, quantity bounds, arrays, known IDs, and record size. Corrupt or removed data is ignored with notice; blocked storage and quota errors do not prevent generation. Hydration never writes initial empty state: only actual user changes set the persistence flag. Each tool exposes clear-history, clear-favorites, clear-filters, and pool-reset controls. There is no cloud sync or cross-tab merge protocol.

Share links encode whitelisted, versioned mode, continent, quantity, no-repeat, quiz, include/exclude IDs, and optional result IDs. Parsing bounds total URL length and rejects wrong modes, unknown IDs/continents, conflicting choices, duplicate fields/IDs, invalid flags, and batches over 20. Shared results are replays: they neither consume the recipient's pool nor add history. Share opens a native HTML dialog with a selectable URL and Copy link action. An optional device-share action falls back to copying if native sharing fails; cancellation leaves the link available. Copy operations show pending and copied button states plus a dismissible live notification. Failed clipboard writes open selectable result text in the same dialog primitive. Dialog dismissal restores trigger focus, and feedback is rendered inside an open dialog so it remains visible above the backdrop. Quiz guesses and identity fields are never included.

## Country projects and worksheets

The Country Project Generator reuses `GeneratorFilters`, `QuantityControl`, `placesForMode`, `eligiblePlaces`, and `selectPlaces`. Its page-memory state is independent of saved country/capital state. Country inclusion/exclusion, quantity limits, no-repeat behavior, capacity errors, all-remaining generation, and explicit pool reset follow the same engine. No student names, answers, or assignment records are persisted.

`src/features/learning/country-project.ts` owns three authored and editorially reviewed topics, normalized `CountryAssignment` objects, and the teacher-reference adapter. Generated questions are snapshots; changing controls does not rewrite current assignments. `WorksheetPreview` renders those same objects for screen and print. Student pages come first; teacher pages are optional and appended afterward. Teacher references preserve capital roles, exceptional notes, review dates, source URLs, and attribution.

Named A4 and Letter `@page` rules supply 10mm margins. All worksheet styling uses Tailwind, including print visibility, page breaks, borders, typography, and reset of screen-only page heights. Header, navigation, controls, explanations, and footer are hidden when printing. Browser print handles paper/PDF output; there is no PDF generation backend or new dependency.

## Routes and SEO

`src/lib/seo/site.ts` is the registry for metadata, navigation, and sitemap generation. Both working tools are published in that registry; home remains a distinct hub. Canonicals use base routes, including shared query variants. No region/country detail routes are published, so unknown slugs return actual 404 responses.

Set `NEXT_PUBLIC_SITE_URL` to the real HTTPS origin and rebuild for deployment. Missing configuration uses localhost for local previews, marks every page noindex, and emits an empty sitemap without a robots sitemap declaration. Robots permits crawling so page-level noindex is visible. A configured public origin produces only the seven published base pages, never query combinations. Social previews stay tool-level.

## Remaining release work

Phases 5–6 are later expansion. Phase 7 launch review still needs the real operator identity and corrections contact, hosting-specific policy review, the actual deployment origin, broader accessibility/performance checks, and deployment authorization. No site was deployed as part of this implementation.
