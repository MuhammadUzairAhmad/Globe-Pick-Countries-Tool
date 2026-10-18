# Implementation progress

Plan: `GlobePick-Nextjs-SEO-First-Plan.md`. Updated 18 October 2026.

## Completed local gates

- **Phase 0:** audited the original starter, retained the installed stack and configuration, and recorded rendering, storage, and SEO decisions.
- **Phase 1:** shared Tailwind theme/primitives, responsive shell, homepage and learning content, static metadata/social assets, sources/policy pages, error recovery and actual 404 behavior.
- **Phase 2:** 195 offline country records, 195 local flag renditions, source/license manifest and downloadable adapted database; build-time validation; pure uniform selection; continent and searchable include/exclude controls; 1–20 distinct results; persistent no-repeat state; capacity, all-remaining, empty and exhausted states; facts and optional approximate map locations.
- **Phase 3:** 204 capital/government-seat entries with roles; shared country/capital engine and components; guess/check/reveal; separate versioned settings, 100-entry histories, favorites and consumed pools; corruption/storage failure handling; copy/share adapters and selectable fallback text; validated URLs and exact replay without recipient consumption/history; both tools registered for navigation and public-origin sitemap generation.

Phases 4–6 are implemented below. Phase 7 has local checks; broader device/performance verification and deployment remain pending. Nothing has been deployed.

## Meaningful validation

- `npm test`: **37 tests pass**, covering eligible-only selection, inclusion/exclusion conflicts, distinct batches without mutation, no-repeat preservation/reset, capacity and quantity failures, independent capital IDs/roles, crypto rejection sampling, copied source/context notes, corrupt/old/oversized storage, deleted IDs, history caps, blocked/quota-limited storage, URL round-trips and invalid states, hydration/replay invariants, clipboard failure fallback, native-share success/failure/cancellation, theme preferences/startup/synchronization, and both palettes' text contrast.
- `npm run validate:data`: passes for all records, unique IDs/slugs, country membership counts, capital IDs/roles, valid coordinates, source URLs/review dates, local flags, licenses, and the identical app/download database plus SHA-256 digest. Validation runs automatically before every production build.
- `npm run lint`, `npm run typecheck`, `npm run format:check`, `git diff --check`, and the final production build pass. All thirteen content routes remain statically pre-rendered.
- Initial HTML includes tool H1s, useful descriptions, how-to content, control labels, and fixed samples. Local pages are noindex; query variants retain clean base canonicals. A simulated public HTTPS origin confirms thirteen published routes, a clean project canonical, and indexable project metadata.
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

## Phase 6: curated SEO

- Added working Africa/Asia/Europe regional country pages and reviewed Japan/South Africa activity guides. Only these five curated slugs are registered, bringing the published registry to thirteen pages.
- Regional presets are present in the initial reducer and HTML. Hydration overrides stale stored continent/include/exclude choices; quantity and saved histories/favorites/consumption survive. Clear filters restores the region preset. Shares use the main tool’s bounded URL codec.
- Added visible breadcrumbs, factual WebApplication/BreadcrumbList data, escaped JSON-LD serialization, related links, distinct metadata, and original region/country activities. Only five explicit static route files are published. This avoids Cache Components’ streamed dynamic fallback returning HTTP 200 for unknown slugs. Shared lookups retain defensive notFound guards.
- Qualitative search-intent/source research is recorded in `docs/seo-research.md`. Three new tests cover presets, publication scope/canonicals, and schema/XSS boundaries. All 26 tests pass.
- The old Japan example PDF URL returned 404 and was replaced with the official Study in Japan Tokyo page, with clearer source scope. Japan/South Africa guide capital context is supported by checked primary references.
- Production checks verified all five curated pages return 200, unknown regional and country slugs return 404, initial Africa HTML selects Africa, and JSON-LD parses as BreadcrumbList/WebApplication. Browser checks verified stale Japan-only settings become an Africa pool, favorites survive, Clear filters restores Africa, guide links preset South Africa’s three hidden capital questions, Japan fits at 320px, and no warning/error logs appear.
- Hosting was explicitly deferred by the owner. Real-domain deployment, Search Console registration/submission, and post-launch observations are pending; none are claimed complete.

## Phase 7: local launch checks

- Added a repeatable read-only production verifier for all thirteen published pages, five true 404s, twelve sampled assets, sitemap scope, clean query canonicals, initial HTML, picker schemas, and HTML payload budgets. No city-record payload appears on other pages.
- Added launch configuration checks with Next environment loading. The real origin, maintainer/contact, hosting provider, and policy review are deliberately pending while hosting is deferred. Environment entries alone do not update the public pages.
- Added production-inspection and palette-contrast regression tests, bringing the suite to 29 passing tests. Related-learning links now use the shared touch height.
- Keyboard checks confirm mobile menu operation and Escape focus return, skip-link focus, and accessible city control labels. Responsive layouts and production warning/error logs pass the focused checks.
- `docs/launch-verification.md` records commands, observations, payload budgets, and remaining native printing, assistive-technology, representative mobile performance, deployment, and Search Console work. Local HTTP timings are not field Core Web Vitals.

## Phase 8: local preparation

- Added a free Japan/South Africa country-profile pack in A4 and US Letter to the project page. Each PDF has two student worksheets and two teacher sheets with questions from the existing model, dated reference facts, primary/community sources, and attribution.
- Offline authoring produces static files; no browser PDF library, accounts, payments, advertisements, analytics, or new search route was introduced. DejaVu fonts are embedded with an attached/published notice.
- Rendered and visually inspected all eight pages; checked page counts, exact paper boxes, extracted text, source links, and font attachments. Native printer output and PDF reading-order/tagging checks remain pending.
- Added source/question and palette consistency checks plus downloadable-file digests to prebuild validation. Production HTTP verification includes both PDFs, their manifest, and the font notice, bringing sampled assets to sixteen.
- Final production verification passes for thirteen pages, five genuine 404s, and sixteen assets, with byte-identical served PDFs. A browser click downloaded the A4 pack with its reviewed checksum. New download controls fit phone/tablet/desktop layouts, meet the shared touch height, and produce no observed warning/error logs. All 29 tests, data/artifact validation, lint, type checking, formatting, and compilation pass.
- `docs/growth-experiments.md` records concrete hypotheses and decision boundaries. Real usage, Search Console observations, advertising approval, monetization decisions, optional challenges, and backend planning are deferred. This phase is prepared for experimentation, not validated by visitors.

## Review fixes and navigation refinement

- Fixed the four review findings: enabling practice clears answer-containing announcements; cached Back/Forward navigation retains the active batch and quiz input/reveal state; opening a saved place focuses and scrolls to the results; history/favorite action labels identify the actual place and capital role without exposing hidden answers.
- Initialization runs once per generator session. Activity reactivation synchronizes shared saved lists/consumed IDs while retaining this view’s filters, results, and quiz progress. Failed storage reads retain working memory. A resumed effect skips its stale persistence write before the synchronized state is applied.
- The installed Next router’s `bfcacheId` keys the generator session. A fresh link visit reapplies its preset even at the same URL, while Back/Forward restores the existing session. Changed shared URLs are handled independently; incoming URLs for another route do not modify a hidden workspace.
- Added five focused regression tests for practice announcements, reactivation, storage failures/replay, hidden-safe place labels, and published navigation destinations. The suite now has 34 passing tests. Browser flows below were exercised against the compiled app; they are manual integration checks, not an automated browser suite.
- Production browser checks confirm Tokyo’s status is cleared on hiding answers, its entered/correct guess survives About → Back, and Open moves focus to the visible results heading. A two-country base batch survives an Africa visit and another draw; the shared history contains three picks and the global available pool becomes 192. Repeated South Africa guide visits reapply the preset, while Back retains all three generated role questions.
- The header now has Generators and Explore dropdowns plus a direct Worksheets link. The logo opens Home; About and policies are in the footer. Grouped links are checked against the published registry, and city prefetch remains disabled. Keyboard Arrow Down/Tab/Escape, focus return, outside clicks, exclusive dropdown opening, and the scrollable phone menu pass focused checks.
- The footer has grouped tool, learning, and policy links with larger tablet/desktop spacing. Phone policy links remain compact; all footer groups appear from tablet size. Phone/tablet/desktop layouts have no horizontal overflow. Observed warning/error logs are empty.
- All 34 tests, data/artifact validation, lint, type checking, formatting, and compilation pass. The final production audit passes thirteen pages, five genuine 404s, and sixteen assets.

## Shared styling and dark mode

- Moved common body, heading, and paragraph defaults into the single global stylesheet, removing repeated heading utilities across pages and components. Layout, spacing, responsive styles, and states remain inline Tailwind; shared buttons retain reusable variants. `docs/styling.md` records the conventions.
- Added screen light/dark semantic palettes and an always-visible header toggle. A validated head script applies the saved or system preference before paint. System changes apply until a manual choice; manual choices persist separately and sync between tabs. Blocked storage leaves the toggle usable for the visit.
- Reviewed primary-button foregrounds, active tool navigation, toggle icons, dialog overlays, and semantic text colors in both themes. Twelve text/background pairs per palette meet 4.5:1 in focused contrast tests.
- Browser checks confirmed the initial dark system preference, an explicit light choice surviving reload, and cross-tab changes. Generation and the share dialog render in dark mode. Worksheet previews remain white with black text; A4 desktop dimensions and A4/Letter responsive fit were checked. Native print-driver verification remains pending.
- At 320px, 768px, and the default desktop viewport, the header/toggle and tested pages have no horizontal overflow. The mobile menu and theme toggle work together; the toggle is 44px square. Observed production warning/error logs are empty.
- All 37 tests, data/artifact validation, lint, type checking, formatting, compilation, and the production HTTP audit pass. The audit checks thirteen pages, five genuine 404s, sixteen assets, and clean query canonicals. Hosting remains deferred.

## Remaining launch requirements

The baseline is functional locally. Before public launch: provide the real operator identity and corrections contact, review hosting-specific privacy/terms, set the actual HTTPS deployment origin, complete broader accessibility/performance checks, and authorize deployment. Dataset facts follow a pinned community source with reviewed exceptions; the About page and manifest disclose that this is not an independent audit of every field. Deployment/Search Console and real-usage growth experiments remain pending.

## Homepage country spinner: 19 October 2026

- Completed all four phases of `GlobePick-Landing-Spinner-Plan.md`, with a local commit per phase and no push or deployment.
- Added one-country spinning to the server-rendered homepage. The existing full country, capital, city, and worksheet routes remain available with Lagoon/light styling.
- The shared engine returns the accepted selection and records it once. The wheel snapshots that available pool and lands on the chosen sector; completion and interruptions only reveal the existing result.
- Country filters, consumed IDs, history, and favorites share `globepick:v1:country`. The spinner preserves the full tool’s batch quantity, including cached navigation back from that tool. Share links capture quantity one and the pick’s original filters.
- Extracted the existing country-choice controls and copy/share feedback for reuse. Added a readable available-country list, country facts/maps/sources, saved replay, keyboard spin/skip, and accessible status messages.
- Automated geometry, snapshot/sharing, generation/reducer, and motion fallback checks bring the suite to 43 passing tests. Browser checks cover repeated clicks, normal/skip completion, cached route interruption, shared lists, batch quantity, exact replay, empty/one-country pools, save/copy/share feedback, responsive layouts, both themes, and existing tool workflows. See `homepage-spinner.md` for payload measurements and the remaining real-device/assistive-technology limits.

## Homepage spinner layout revision

- Restored the original homepage hero with its heading, atlas artwork, introduction, and tool links.
- Moved the spinner directly below the hero in its own section. Tablet and desktop layouts put settings/filters on the left and the wheel and Spin button on the right; phones stack those panels. Results and saved lists remain below the panels.
- Selection, persistence, share snapshots, animation/skip behavior, and existing tool routes are unchanged.
- Verification: 43 tests, lint, production build/TypeScript, all thirteen published routes, five real 404s, and sixteen assets pass. Browser checks confirm the original hero precedes the feature, tablet/desktop columns, phone stacking, both themes, filter/spin/skip behavior, and no observed warning/error logs.

## Spinner pool simplification and flag pages

- Removed include/exclude controls and counts from the spinner. Its continent and no-repeat settings operate on every country in the selected continent; custom selections in the full tool do not restrict spinner draws or shares.
- Preserved the full tool’s stored custom choices and batch quantity when saving spinner changes. Cached Home reactivation refreshes those stored fields so it does not overwrite newer choices from the full tool.
- Replaced the collapsed, internally scrolling pool list with an always-open list of local flags and country names, eight per page, Previous/Next navigation, and visible page/range counts. Pagination only changes the displayed rows; every available country can win.
- The list resets for continent/no-repeat changes, clamps to a valid page as the pool shrinks, and keeps the accepted pool visible during motion so the winner is revealed at settlement.
- Four new tests cover effective filters and unchanged custom settings, cached state, page coverage/off-page eligibility, and empty/shrinking page bounds. All 47 tests pass.
- Production build/TypeScript, lint, formatting, the thirteen-page HTTP audit, five real 404s, and sixteen assets pass. Browser checks confirm flag loading, keyboard/page boundaries, filter reset, unchanged full-tool custom choices/quantity, clean share snapshots, and responsive Lagoon/light layouts without observed console warnings/errors.

## Spinner celebration and result modal

- Replaced the below-wheel result card and scrolling details link with an automatic native result modal after a spin settles, plus View last country to reopen it.
- Kept country facts/maps/sources and Save/Copy/Share, and added Back to wheel and Spin again. Presentation changes never select or record a second country. Saved replay opens without confetti.
- Added a short 32-particle native-animation confetti burst using semantic theme colors, with reduced-motion/hidden-tab suppression, bounded geometry, finite duration, and cancellation/cleanup.
- Added modal focus, Escape/backdrop dismissal, background scroll locking, and trigger restoration. Copy notifications stay within the result modal; sharing opens the existing dialog above it. Full generators keep their feedback behavior.
- Three motion-adapter tests bring the suite to 50 passing tests.
- Production build/TypeScript, lint, formatting, the thirteen-page HTTP audit, five real 404s, and sixteen assets pass. Browser checks cover normal/skip reveal and visible confetti, no extra selection on modal close/reopen/replay, one new pick from Spin again, Save/Copy/Share layering, Escape/backdrop dismissal, Tab/Shift+Tab wrapping, scroll/focus restoration, long map content, light/dark themes, and phone/default-window sizing. Observed warning/error logs are empty; real-device/assistive-technology checks remain launch work.

## Larger wheel and responsive panel order

- Increased the desktop wheel from 320px to a responsive square capped at 576px, with a larger center badge and pointer. It fits its panel width and no longer sits inside a large vertically centered gap.
- Kept settings on the left and the wheel on the right from 1280px. Below that width, a flex column presents the wheel and Spin button before settings, including 1024px landscape tablets. The same mounted wheel and controls remain in use when resizing.
- The available-country list uses two columns from 640px so wider tablet settings stay compact. Phones retain one column, page controls, and local flags. The wheel heading wraps without squeezing its title.
- Browser measurements at 320px, 375px, 768px, 1024px, 1279px, 1280px, and 1440px confirm the intended order, a square wheel, and no horizontal overflow. The desktop wheel measures 576px and tablet wheel 448px; narrow phones fit the available card width.
- Verification: 50 tests, lint, TypeScript/production build, changed-file formatting, and the production HTTP audit pass. A tablet spin survived resizing to phone width and opened the same accepted result modal with one added history entry; closing returned focus to Spin. Observed warning/error logs are empty, and temporary viewport overrides were reset.

## Spinner visual refinement

- Replaced the dense accent stripes with softer brand tints, a finer double rim, a subtle glow, and a highlighted accepted sector after settlement. The winner is not highlighted during motion.
- Added a rotation icon and reduced-motion-aware button feedback. Settings now fit their own content, with a clearer available-country count.
- Added four-country phone pages below 640px and retained eight-country pages above it. An item offset keeps the current country visible when resizing, and selection still uses the complete eligible pool. Navigation uses compact padding, labeled arrows on the narrowest phones, and 44px minimum targets.
- Redesigned the native result modal with a larger flag, one prominent country heading, shared fact tiles, a flat body, and a clear Spin again action. Shared button padding variants keep the compact controls consistent while default generator cards retain their presentation.
- Added a pagination test covering complete phone-page coverage, the last page, shrinking pools, and an empty pool. All 51 tests and lint pass.
- Browser acceptance covers 320–1440px in both themes, four/eight-country page counts and resize anchoring, one-line compact footer controls, 44px narrow-phone navigation, delayed winner highlighting, normal/skip settlement, copy feedback, Share layering, Escape, keyboard focus wrapping, and saved replay without another history entry. Long phone headings and facts wrap inside the modal. Temporary viewport overrides were reset; observed warning/error logs were empty.
- Fixed a rotated SVG bounding-box overflow found after settlement. A stationary circular clipping frame contains the animated layer while leaving the pointer and center badge fixed. Even with an 815px transformed wheel box in a 576px frame, the page has no horizontal overflow at the tested phone/tablet/desktop widths.
- Final production build/TypeScript, changed-file formatting, lint, all thirteen published pages, five genuine 404s, and sixteen assets pass. Payload measurements are updated in `homepage-spinner.md`. Changes remain local; hosting is deferred.

## Hero link to the spinner

- Renamed the homepage hero’s primary action to “Spin the country wheel” and linked it to `#country-spinner` on the same page.
- Browser verification confirms the spinner heading is visible after clicking, the route stays on Home, and history/favorites counts do not change. Lint, changed-file formatting, and the production build/TypeScript pass.
- Country/City tabs were discussed as the next feature; this change implements the hero link only.

## Country and city spinner tabs

- Added Countries/Cities tabs inside settings, with arrow/Home/End keyboard support, activation focus, loading status, and retry feedback. Each workspace retains its filters and last result through React Activity. Fresh visits default to Countries.
- City records load only after selecting Cities. A country is required before spinning; the selector shows dataset coverage, including the explicit Nauru empty state. Lists show city/town names, administrative regions, and local flags, with four/eight-item pages.
- Generalized the wheel, motion hook, paginated list, and result modal for both place types. City results include their country/region, approximate coordinates, map/source disclosure, Save/Copy/Share, confetti, and Spin again. The hero action is now “Spin the wheel.”
- Reused the existing city storage key, history, favorites, no-repeat pool, and exact city-generator share links. A single-country effective filter overrides stale full-tool filters while preserving stored custom choices and batch quantity. Validation uses every city ID so choosing one country cannot erase another country’s saved places.
- Added three city-spinner tests for country scope, raw-filter preservation, other-country stored IDs, one accepted selection, exact city sharing, snapshots, no-repeat across country changes, and missing coverage. Landing geometry also covers 769 sectors. All 54 tests, lint, changed-file formatting, production TypeScript/build, and data/PDF validation pass.
- Browser checks cover country and city picks, small-pool city labels (Bhutan’s four places), mode switching and retained selections, keyboard tabs, selection required, empty/single-place exhaustion, separate histories, Save/Unsave, Copy feedback, Share layering and exact replay, city map data, modal focus wrapping, app-navigation return, and both themes. At 320/375/768/1024/1280/1440px, page counts, wheel-first tablet/phone order, desktop columns, and angled-wheel clipping fit without horizontal overflow. Observed warning/error logs were empty and temporary viewport overrides were reset.
- The production audit passes all thirteen pages, five genuine 404s, and sixteen assets. A build-file assertion confirms that city records are absent from initial homepage HTML and directly referenced JavaScript; payload measurements are updated in `homepage-spinner.md`. Changes are local; hosting remains deferred. Forced network-failure and physical-device assistive-technology checks were not performed.

## Clearer wheel and multiple-pick entry points

- Kept “Spin the wheel” as the main homepage action and revised the supporting text around a single country or city spin, facts, maps, and favorites.
- Added “Need multiple results or more filters?” below the wheel. It opens the full country or city generator for the active tab; the city link keeps prefetching disabled.
- Reframed the following section around lists, capital practice, and worksheets. Country/city cards now describe up to 20 results and full filters, with “Pick multiple countries” and “Pick multiple cities” as secondary actions.
- Existing selection, saved settings, tool pages, and capital/worksheet workflows remain intact. Browser checks confirm both contextual links and both renamed cards open their intended routes, the city tab survives return navigation, and the country tool retains its stored batch quantity.
- Verification: all 54 tests, lint, production TypeScript/build, data/PDF validation, and the thirteen-page production audit pass. New labels fit at requested widths of 320, 768, and 1440 pixels without horizontal overflow. Observed warning/error logs are empty; changes remain local.

## Equal-height desktop spinner panels

- Stretched both cards to their shared desktop grid row height, so settings and the wheel align at the top and bottom without fixed heights. Below 1280px, the stacked cards keep their natural heights and wheel-first order.
- Browser measurements confirm equal heights in country mode at 1280/1440px and in empty and populated city modes at 1440px. Tablet/phone checks at 768/375px retain natural stacking without horizontal overflow; temporary viewport overrides were reset.
- Lint, changed-file formatting, production TypeScript/build, and data/PDF validation pass. Observed browser warning/error logs are empty. Changes remain local.
