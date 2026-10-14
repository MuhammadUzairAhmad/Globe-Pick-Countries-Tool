# Implementation progress

Plan: `GlobePick-Nextjs-SEO-First-Plan.md`. Updated 14 October 2026.

## Completed local gates

- **Phase 0:** audited the original starter, retained the installed stack and configuration, and recorded rendering, storage, and SEO decisions.
- **Phase 1:** shared Tailwind theme/primitives, responsive shell, homepage and learning content, static metadata/social assets, sources/policy pages, error recovery and actual 404 behavior.
- **Phase 2:** 195 offline country records, 195 local flag renditions, source/license manifest and downloadable adapted database; build-time validation; pure uniform selection; continent and searchable include/exclude controls; 1–20 distinct results; persistent no-repeat state; capacity, all-remaining, empty and exhausted states; facts and optional approximate map locations.
- **Phase 3:** 204 capital/government-seat entries with roles; shared country/capital engine and components; guess/check/reveal; separate versioned settings, 100-entry histories, favorites and consumed pools; corruption/storage failure handling; copy/share adapters and selectable fallback text; validated URLs and exact replay without recipient consumption/history; both tools registered for navigation and public-origin sitemap generation.

Phases 4–6 are later expansion. Phase 7 launch verification and deployment are not complete; nothing has been deployed.

## Meaningful validation

- `npm test`: **23 tests pass**, covering eligible-only selection, inclusion/exclusion conflicts, distinct batches without mutation, no-repeat preservation/reset, capacity and quantity failures, independent capital IDs/roles, crypto rejection sampling, copied source/context notes, corrupt/old/oversized storage, deleted IDs, history caps, blocked/quota-limited storage, URL round-trips and invalid states, hydration/replay invariants, clipboard failure fallback, and native-share success/failure/cancellation.
- `npm run validate:data`: passes for all records, unique IDs/slugs, country membership counts, capital IDs/roles, valid coordinates, source URLs/review dates, local flags, licenses, and the identical app/download database plus SHA-256 digest. Validation runs automatically before every production build.
- `npm run lint`, `npm run typecheck`, `npm run format:check`, `git diff --check`, and the final production build pass. All eight content routes remain statically pre-rendered.
- Initial HTML includes tool H1s, useful descriptions, how-to content, control labels, and fixed samples. Local pages are noindex; query variants retain clean base canonicals. A simulated public HTTPS origin confirms seven published base routes, a clean project canonical, and indexable project metadata.
- Baseline read-only production HTTP checks pass for the six original content routes, dataset/manifest downloads, maps, flags, and license notices. Unimplemented city routes and invalid country/regional slugs return actual 404 responses. Local robots permits crawling and omits a sitemap declaration; the local sitemap has no entries.

## Browser acceptance

Tested with the built app, including a second temporary port providing an empty browser-storage origin:

- Continent-filtered batches stay eligible and unique; repeated draws reduce remaining counts without repeating earlier records.
- Save → refresh preserves favorites, history, quantity, continent settings, and consumed IDs. Switching tools preserves separate records and pools.
- South Africa's three distinct entries retain their administrative, legislative, and judicial roles. Guess mode hides answer text in cards and current history/favorite entries and disables copying/saving until reveal.
- Correct and incorrect guesses reveal answers appropriately. Reveal/check controls retain keyboard focus. New draws reset transient guesses, including when the same place appears again.
- The fixed SEO sample is hidden while capital quiz mode is active, so the Japan example does not disclose a Tokyo answer.
- Shared results replay exactly. A fresh recipient had 47 eligible/47 available Asian countries, no history, and no favorites after replaying South Korea; the replay consumed nothing.
- Insufficient capacity produces an explanation and an explicit all-remaining action. Empty continent/inclusion intersections and exhausted pools show clear feedback.
- Clear history/favorites and explicit resets work. Clearing history leaves consumption intact; resetting the pool restores capacity.
- Clipboard copy and share-link fallback copy work. Copied facts retain role, context, attribution, and a source. Actual clipboard-denial and native-share exceptions are covered by adapter tests rather than an OS permission change.
- Optional map/source details load on request, with approximate-center text and an external map link.
- Checked phone (320px/375px), tablet (768px), and desktop (1280px) layouts without horizontal overflow. Phone essential controls were compacted to keep the primary action near the first viewport. No warning/error console entries or hydration warnings were observed on tested final production pages.

These are focused correctness and browser checks, not a full assistive-technology audit or field performance certification. Native device share dialogs depend on browser support.

## Copy, sharing, and wording refinements

- Copy actions show a pending state, then a temporary Copied label and a dismissible live notification visible at the current scroll position. Failed clipboard writes open a dialog with selectable result text; success is only shown after the clipboard promise resolves.
- Share opens a dialog containing the actual link and a Copy link action on every supported browser. Device sharing is an optional action when the browser offers it; failure falls back to copying, while cancellation preserves the link without copying it automatically.
- Dialog feedback appears inside the modal. Escape and Close restore focus to the triggering button. Duplicate async actions are blocked while an operation is pending.
- Home, tool instructions, filters, empty states, saved lists, source explanations, metadata, and policy wording were revised for direct language. Capital roles use badges instead of dash-separated labels; ordinary single capitals use a simple Capital field. Result action columns remain aligned when their labels change.
- Final production browser checks verified copying from a lower result card, visible notifications, link copying and exact restoration, Escape focus restoration, capital role badges, hidden-answer filter links, and a 320px layout without horizontal overflow. No warning/error console entries were observed. Native success, failure, and cancellation are covered by adapter tests; an actual device share sheet was unavailable in the test browser.
- All 16 tests, data validation, lint, type checking, formatting, and the final production build pass. A cached Turbopack error from sandbox-restricted port binding was resolved by refreshing the generated compiler cache and building with local networking enabled.

## Phase 4: country projects

- Added `/country-project-generator`, shared tool navigation, home-page access, route metadata, and sitemap registration. Public configuration now includes seven published base routes.
- Teachers can create 1–20 unique country assignments with the existing continent/include/exclude filters and selection engine. Repeat prevention lasts for the current project-page session, with explicit reset and all-remaining actions. Existing country/capital saved state is not modified.
- Added three authored question sets: Country profile, Land and water, and People and places. Each has four research questions, evidence-based teacher guidance, and a documented editorial review in `docs/research-prompts.md`.
- Worksheet preview and printing share normalized assignment objects. Topic/filter changes apply to the next generated set. A4/US Letter layouts use named paper boxes, 10mm margins, separate sheets, writing space, and source-recording space.
- Optional teacher pages follow all student pages. They include reference facts, capital roles and exceptional notes, dated source material, attribution, and a license link. Open research questions have guidance rather than invented fixed answers.
- Assignments use page memory. There are no accounts, student names, answer-entry forms, new persistence records, runtime geography calls, or backend services.
- Three new domain tests cover filtered unique assignment selection, capacity/bounds, topic support across all 195 countries, independent question snapshots, and exceptional teacher references. All 19 tests pass.
- Production browser checks cover three Oceania assignments followed by the 11 remaining countries without repeats, oversized requests and all-remaining selection, unchanged questions after changing topics, teacher-page toggling, session reset, and refresh clearing page-memory assignments. All three topics were exercised.
- At a 1280px viewport, measured screen paper boxes for 22 student/teacher pages fit Letter and A4 dimensions without horizontal overflow; South Africa and Palestine reference sheets also fit both sizes. At 320px, the full page and worksheet contents have no horizontal overflow. No warning/error browser logs were observed.
- The final build contains the named A4/Letter paper rules, print page breaks, and screen-height resets. Native print/PDF-driver pagination and physical printer output were not exercised by the available browser tool; verify those in the broader launch print/device matrix. Preview and print intentionally render the same assignment objects.

## Phase 5: cities

- Added the city route, home/navigation entry, coverage explanation, public-domain source notice, download/manifest, and offline preparation/validation scripts.
- Retained 7,194 selected city/town records across 194 countries. Nauru has no records; historic places, stations, outside-scope references, and one exact duplicate are excluded. Names and admin labels remain a disclosed source snapshot.
- City mode reuses selection, controlled country/continent filtering, no-repeat, cards, maps, history/favorites, copy feedback, share dialogs, storage validation, and exact replay. Identity is a stable Natural Earth ID; country/admin-region labels disambiguate names.
- City data is imported only by the city route. Links to that route disable prefetching. Country/capital saved records remain separate; the city storage bound supports its full record pool.
- Four new tests cover country eligibility, no-repeat and missing coverage, homonyms, full-pool persistence, and share validation. All 23 tests and both data validators pass.
- Production browser checks verified three Japanese cities, copy/source attribution, save and refresh, shared exact replay without new history, Nauru’s empty state, 320px overflow, and clean warning/error logs. Compiled country, capital, and worksheet HTML contain no city-record payload.

## Remaining launch requirements

The baseline is functional locally. Before public launch: provide the real operator identity and corrections contact, review hosting-specific privacy/terms, set the actual HTTPS deployment origin, complete broader accessibility/performance checks, and authorize deployment. Dataset facts follow a pinned community source with reviewed exceptions; the About page and manifest disclose that this is not an independent audit of every field. Curated SEO expansions remain unimplemented.
