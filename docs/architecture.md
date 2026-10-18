# GlobePick architecture and scope

Updated 18 October 2026. Implements Phases 0–6 of the local plan, local launch checks, and starter-pack preparation.

## Starting point and stack

The repository contained an unchanged create-next-app page, root layout, and global CSS. No product features were replaced. Next.js 16.4.0, React 19.3.0, Tailwind CSS 4, and strict TypeScript 5 are retained, with the existing Turbopack Tailwind integration, Cache Components, and Partial Prefetching configuration. Version-specific local Next.js guides were read before implementation. Native TypeScript test/data scripts need Node.js 22.18+; this workspace uses Node.js 26.

## Rendering and styling

Routes, introductions, samples, how-to content, dataset explanations, and metadata remain Server Components and are statically pre-rendered. Generator interaction is a Client Component boundary, with pure selection/state functions, presentational country/capital components, and separate browser adapters. There are no custom API routes, Server Actions, authentication, database, runtime geography requests, or global state libraries.

`src/app/globals.css` owns shared Tailwind theme tokens and base body/heading/paragraph defaults. Components compose inline Tailwind utilities for layout, responsive behavior, and states; repeated patterns use shared components and variants. See `styling.md`. Country and capital tools reuse ToolPageLayout, GeneratorWorkspace, GeneratorFilters, QuantityControl, ResultsGrid, PlaceResultCard, PlaceIdentity, FactList, ResultActions, and saved-place lists. Glass has an opaque fallback. The vendored Geist font uses `next/font/local`; no remote font request is needed. Original brand assets are generated from theme colors by `scripts/generate-brand-assets.mjs`.

The header theme toggle follows the system until a manual choice is saved under `globepick:theme`. A static inline head script validates that choice and applies root theme attributes before paint; no cookie or request-specific rendering is needed. A `useSyncExternalStore` subscription handles system changes, manual changes, and cross-tab storage events. Storage failures retain a working per-visit toggle. Semantic utilities consume the selected palette, with separate foreground-on-brand and overlay roles. Dark overrides apply only to screen media; worksheet paper and printed output use white/light colors.

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

`src/lib/seo/site.ts` is the registry for metadata, navigation, and sitemap generation. All working tools are published in that registry; home remains a distinct hub. Canonicals use base routes, including shared query variants. Only three regional and two country-guide slugs are published; lookup guards send unknown slugs to actual 404 responses.

Set `NEXT_PUBLIC_SITE_URL` to the real HTTPS origin and rebuild for deployment. Missing configuration uses localhost for local previews, marks every page noindex, and emits an empty sitemap without a robots sitemap declaration. Robots permits crawling so page-level noindex is visible. A configured public origin produces only the thirteen published pages, never query combinations. Social previews stay tool-level.

## Remaining release work

Phase 6’s local implementation is complete; deployment and Search Console are deferred. Phase 7 launch review still needs the real operator identity and corrections contact, hosting-specific policy review, the actual deployment origin, broader accessibility/performance checks, and deployment authorization. No site was deployed as part of this implementation.

## City expansion

The city route alone imports 7,194 adapted records from Natural Earth’s public-domain populated-places dataset. Shared modules import the City type and a small source-URL constant, never city records. City links disable prefetching. Country references resolve against the existing 195-country scope, leaving 194 covered countries and an honest Nauru empty state. The manifest records exclusions, duplicate merging, source commit/digests, and per-country counts.

City mode extends the Place discriminated union and reuses selection, filters, cards, facts, optional maps, persistence, save/copy/share feedback, and URL validation. Country and administrative-region context distinguish homonyms. Neither population nor source capital classifications are presented as current facts. Equal probability applies to eligible city records, so larger country record pools have more chances in all-country mode. Storage validation has a bounded dataset-aware size limit so a full city consumed/favorite pool does not corrupt itself.

## Curated SEO

Five reviewed routes share the page registry. Africa/Asia/Europe reuse the same workspace and initialize its reducer with the region; hydration clears stale inclusion/exclusion filters for that landing page without resetting saved history, favorites, or consumed IDs. Clear filters restores the preset. Share URLs open the main generator with a versioned region/result state. Japan and South Africa guides contain original research activities and checked capital context, with dated dataset tables and primary links. Only five explicit static route files are published. Cache Components forbids dynamicParams, and streamed unknown dynamic routes returned HTTP 200 during testing; explicit routes ensure real root 404 responses. Shared content lookups retain defensive notFound guards.

Native JSON-LD scripts escape `<`. Visible breadcrumbs produce BreadcrumbList data; picker pages produce accurate free WebApplication data. Related links are crawlable, while sitemap URLs contain neither queries nor unpublished permutations. Search research is qualitative; no search volume, rankings, or Search Console observations are invented.

## Starter packs and verification

The project page links two static four-page starter PDFs; files are loaded only when requested. The offline TypeScript exporter creates normalized content through the same assignment/reference model. A Python authoring script lays it out with embedded DejaVu fonts, source links, and an attached font notice. A4 and Letter artifacts are rendered and reviewed before publication. Build-time checks compare model/palette/digests with the reviewed artifacts, preventing stale question/reference exports from silently shipping. PDF authoring is neither a browser dependency nor a runtime backend.

The production verifier reads the existing published registry and checks initial HTML, metadata, canonicals/indexing, schemas, genuine 404s, sampled assets, exact served PDF bytes, and HTML payload budgets. The configuration check uses the installed Next environment loader and records missing public launch details. It does not modify visible operator/policy content or authorize deployment. See `launch-verification.md` and `growth-experiments.md` for the remaining device, hosting, and real-usage gates.

## Cached navigation and grouped links

Each generator session is keyed by the installed Next router’s `bfcacheId`: fresh link visits apply their incoming preset, while browser Back/Forward retains the previous session. First hydration reads storage/URL state once. Activity reactivation preserves results, filters, and quiz progress while refreshing shared consumed IDs, history, and favorites; unavailable storage never replaces working memory. Saved-place replay is an explicit focus/scroll action, and hidden capital labels expose roles rather than answers.

The header groups published tools under Generators, keeps Worksheets direct, and groups regions/guides under Explore. The logo is the Home link; About/policies live in the expanded footer. Navigation group construction validates destinations against the page registry. Dropdowns are normal disclosure navigation with native links, Tab/Escape support, focus return, and outside-click dismissal. Tablet/desktop footer groups use the same link definitions; phone navigation remains scrollable and its footer retains policy links.

## Homepage country spinner

The homepage remains a Server Component, renders the original hero with its atlas artwork, and passes country records into a separate client spinner section below it. The section places settings left and the wheel/action right from 1280px. Below that desktop breakpoint, a flex column puts the wheel before settings, including landscape tablets. The wheel uses an available-width square capped at 576px on desktop and 448px on tablets; CSS alone changes the layout so resizing keeps the same mounted animation and state. That workspace uses the existing generator hook in single-pick mode and the same country storage record. Single-pick mode refreshes the stored batch quantity on route reactivation. The spinner also refreshes stored include/exclude choices so it can preserve the full tool’s latest choices when saving. Its effective selection filters ignore those custom choices while keeping its own continent/no-repeat settings and last result. Existing full generators keep their own batch behavior.

`prepareGeneration` returns the selected places and the sole generated reducer event. The spinner locks its handler synchronously, accepts one country, snapshots the ordered pool and share filters, then illustrates that choice with an equal-sector SVG and native Web Animations. Pure landing geometry targets the fixed top pointer. No randomness occurs during rendering or on animation completion. The pool stays fixed for the accepted animation and landed result; changing filters or resetting picks redraws it, and a new spin snapshots the current available pool.

Motion cleanup, skipping, reduced-motion changes, animation failure/timeout, document hiding, and Activity route deactivation settle the accepted result once. Result content and name-bearing announcements wait until settlement. SVG content is decorative; ordinary controls, a country-pool list, a live status, and result cards provide the accessible interaction. The spinner reuses existing copy/share feedback and result cards. Its own settings are limited to continent and no-repeat. An always-open eight-country paginated list shows local flags and names without an inner scrollbar; pagination never limits selection. No extra storage key, spinner dependency, backend, city-record import, or public route was added. See `homepage-spinner.md` for verification.

## Spinner result presentation

A completed spin opens a native modal using the already accepted result and generator revision. Dismissal and manual reopening are presentation state only; they never dispatch another generated event. Spin again closes the modal and invokes the existing guarded selection handler. Saved-place replay opens the same modal without confetti. There is no duplicate result card below the wheel; View last country reopens its details.

The result dialog traps focus through `showModal`, focuses its heading, handles Escape/backdrop/Close, locks background scrolling, and restores the visible trigger on cleanup. Its content scrolls within the viewport while header and footer actions remain available. Copy feedback is rendered inline inside the result; the shared copy/share dialog is a sibling above it in the native top layer, preserving its trigger focus and keeping cancellation separate. The existing full generators retain their default feedback behavior.

A decorative native-animation burst uses at most 32 themed particles for under 1.6 seconds. Its paths are deterministic visual geometry, independent of selection randomness. Reduced motion, hidden documents, unsupported motion, and cleanup suppress/cancel it. A frame-scheduled played ref avoids Strict Mode cancellation and repeated celebrations when Activity restarts effects. Manual result reopening and saved replay do not celebrate.
