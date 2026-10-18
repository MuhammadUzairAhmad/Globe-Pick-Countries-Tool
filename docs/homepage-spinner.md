# Homepage spinner verification

Implemented locally on 19 October 2026. Hosting remains deferred; no push or deployment was performed.

## Behavior and scope

The settings panel now has Countries/Cities tabs with arrow/Home/End keyboard navigation and focus restoration. Cities load only after activation, with loading feedback and retry on failure. Users choose a country before spinning a city or town. The country selector includes per-country dataset counts and an honest empty state for Nauru. Fresh visits default to Countries; the tab and selected city country last for the current page session. Each tab retains its selection and result while inactive, and uses its existing mode-specific storage key, history, favorites, and no-repeat pool. The city spinner preserves full-tool batch quantity and custom choices; it validates saved IDs against the complete city dataset and scopes only effective selection filters. City replays restore the corresponding country without a new draw.

Both modes use the same equal-sector wheel, pagination, motion/skip handling, result modal, confetti, map/source disclosure, and copy/share feedback. City lists and results include administrative-region/country context; share links replay one exact city on the existing city-generator route.

The original homepage hero and atlas artwork remain. Its primary action, “Spin the wheel,” links to the spinner section on the same page; Practice capitals opens the existing capital tool. A separate country-spinner section follows the hero, with settings and filters on the left and the wheel and Spin button on the right from 1280px. Below that desktop breakpoint, including landscape tablets, a flex column places the wheel first and settings below it. The square wheel fits the available width, reaching 576px on desktop and 448px on tablets, with a matching center badge and pointer. Each spin picks one country through the existing uniform crypto-backed selection engine. When the wheel settles, a native result modal displays the selected country with a short confetti burst, facts, optional map/sources, Save/Copy/Share, Back to wheel, and Spin again. Closing it leaves View last country by the wheel; no result card or anchor requires scrolling down. Saved replays use the same modal without a celebration. The full country tool retains batches of 1–20; capital practice, city selection, worksheets, published routes, and Lagoon/light themes retain their existing workflows.

The spinner and country generator share the validated `globepick:v1:country` record. The spinner offers continent and no-repeat settings and always uses all countries in that continent. The full tool’s saved include/exclude choices are ignored by the spinner and preserved when it writes history, favorites, or settings. Consumed countries stay excluded until the pool is explicitly reset or repeats are enabled, and recent picks and favorites appear in both views. A spin never changes the saved batch quantity. On Back, the spinner refreshes shared saved lists and the latest batch quantity and stored custom choices while retaining its own continent/no-repeat settings and result.

A synchronous guard blocks repeated clicks before React renders. The accepted country is recorded once at spin start. An immutable pool/filter snapshot determines the wheel’s landing and the share link; settling cannot draw another country. Links open `/random-country-generator` with quantity one, the accepted pick’s filters, and its exact country ID. Replays neither consume countries nor append history.

The wheel uses equal SVG sectors. Small pools have labels; dense pools use a restrained range of brand tints, with the available-country list and explicit result supplying readable names. The always-visible available-country list shows local flags and names, four countries per page below 640px and eight from 640px, with Previous/Next controls. Resizing anchors pagination to the current first country. Only list presentation is paginated; selection always uses the entire available pool. Settings changes reset to page one; shrinking pools clamp to a valid page. The list retains the accepted pool while spinning and updates on settlement, preserving the delayed reveal. It has no inner scrollbar. It loads no flag for wheel sectors. The accepted sector gains a highlight only when motion settles. A stationary circular frame clips the rotating SVG viewport, preventing its transformed bounding box from causing horizontal scrolling at angled stops. The Spin action includes a rotation icon with reduced-motion-aware feedback. Settings fit their own content height and show a prominent availability count. Component styling uses inline Tailwind and existing global theme roles.

The modal places a larger local flag and country heading above the shared capital/language/currency facts in tiles. It reuses the existing source/map disclosure and Save/Copy/Share controls without a nested result-card border or duplicate country heading. Spin again remains the primary footer action; native modal focus and dismissal behavior are retained.

The homepage presents the wheel as its primary action. A secondary link directly
below the wheel opens the country or city generator for the active tab, where
users can select up to 20 results and use the full filters. The city link disables
prefetching so it does not load city records before they are requested. The tool
cards below the spinner use “Pick multiple countries” and “Pick multiple cities”
to distinguish these workflows from a single spin; capital practice and worksheets
remain separate tools.

## Automated checks

- 54 tests pass, including every landing sector in pools of 1, 2, 3, 24, 25, 195, and 769 across successive rotations.
- Generation tests cover one history entry, filtered/no-repeat selection, retained batch quantity, empty pools, existing batch/quiz messages, and single-pick route resume with successful or failed storage reads.
- Pool tests verify that spinner draws/shares ignore custom choices without erasing them, cached resume refreshes the stored choices, every available country appears across four- and eight-item pages, off-page countries can win, and empty/shrinking pools clamp pagination safely.
- Snapshot tests verify retained pool/filter arrays and exact one-country share round-trips after the original filters change.
- Controlled motion tests cover normal completion, skip/cleanup, rejection, missing/throwing animation APIs, hidden documents, reduced-motion preference changes, initial reduced motion, and timeout. Repeated completion signals settle once and remove listeners/timers. These are adapter tests; reduced-motion emulation and hidden-tab lifecycle were not separately exercised on physical devices.
- Confetti tests cover bounded trajectories, a maximum of 32 particles, finite motion under 1.6 seconds, reduced-motion/hidden-document suppression, missing or throwing animation APIs, and idempotent cancellation on preference changes, tab hiding, or cleanup. Native modal focus and Copy/Share layering are browser checks.
- Existing storage, sharing fallbacks/cancellation, quiz, city, worksheet model, contrast, SEO, and production inspection tests continue to pass.
- Lint, TypeScript, formatting of changed files, geography/city/PDF validation, and production compilation pass. The user’s pre-existing reference-link edits in the main plan are preserved separately.

## Browser acceptance

Verified against the local production server through the in-app browser:

- Double-click Spin adds one country; the busy view hides the new winner until settlement. Normal completion and keyboard Enter → Show result now reveal the accepted result. After the modal closes, focus returns to the triggering wheel/result control.
- Leaving during animation and returning with Back reveals the accepted result without restarting the spin. A six-country batch in the full tool shares history/consumption with Home, and a subsequent homepage spin leaves the full tool’s quantity at six.
- Save and Copy provide the existing saved state and visible clipboard feedback. Sharing a country after changing the current continent still uses the original continent and quantity one. Opening that exact link displays the country without adding history.
- The earlier custom-pool version was checked with empty and Japan-only pools. Those include/exclude controls have now been removed from the spinner; the underlying engine still handles empty and single-country pools. Spin retains focus when its accepted pick exhausts the pool; unavailable actions use `aria-disabled` and the handler refuses a new draw.
- Phone, tablet, and desktop layouts fit without horizontal overflow. Tested viewport requests were 375 × 812, 768 × 1024, and 1280 × 900 (the browser reserves 15px for its scrollbar). The original compact-hero version placed Spin near the bottom of the first phone viewport; the owner’s subsequent layout request restores the full hero and places the spinner in the following section. Temporary viewport overrides were reset afterward.
- The simplified list was checked with first/last-page boundaries, eight loaded local flags, keyboard Previous/Next, and automatic page-one reset when the continent changes. The list has no inner overflow on phones; tablet/desktop layouts also fit. Saving Japan-only/Pakistan-excluded choices in the full generator did not restrict the spinner. A spin retained quantity six and those custom choices in the full generator, while its share link contained no custom include/exclude fields. Test-only custom choices were restored afterward.
- The revised layout was checked on the production build: the original hero immediately precedes the spinner. The latest layout places panels side by side from 1280px and stacks the wheel before settings below that width without horizontal overflow. Filtering to Europe and spinning/skipping returned a European country with the existing result controls.
- The larger wheel was checked at 320px, 375px, 768px, 1024px, 1279px, 1280px, and 1440px: desktop measured 576px, tablets 448px, and narrow phones fit their card. Wheel-first order below 1280px and settings-left order above it fit without horizontal overflow. A tablet spin survived a resize to phone width, and skipping opened the accepted result modal with one history entry; closing restored focus to Spin. Temporary viewport overrides were reset and observed warning/error logs were empty.
- Light mode and Lagoon dark mode were inspected. Dense light sectors were strengthened after visual review; the later layout revision restores the original hero alignment and separates settings from the wheel.
- Result-modal acceptance covers normal/skip completion with visible confetti, Save/Copy, an overlaid Share dialog whose Escape closes only sharing, modal Escape/backdrop dismissal, unchanged scroll position and restored trigger focus, manual reopening, Spin again adding exactly one new history entry, and saved replay without confetti/history changes. Keyboard Tab and Shift+Tab wrap within the result. Phone map details scroll inside the modal with header/footer actions retained; light/dark and default-height layouts fit without horizontal overflow. Temporary viewport overrides were reset and observed warning/error logs are empty.
- Visual refinement acceptance covers four/eight-country pages and resize anchoring, compact phone navigation with 44px targets, both themes, one country heading and shared fact tiles, long 320px result text, keyboard wrapping, copy/share layering, and highlight only after settlement. Angled stops initially exposed transformed SVG overflow; the circular clipping frame now keeps the page within its viewport at 320px, 375px, 768px, 1024px, 1280px, and 1440px. Temporary viewport overrides were reset and observed warning/error logs were empty.
- Capital generation, hiding/revealing its answer and copying it, city generation, and worksheet creation still work. Worksheet screen paper remains white with black text.

## Production and payloads

All thirteen published pages pass the HTTP verifier, with five genuine 404s, sixteen sampled assets including unchanged PDF bytes, clean canonicals, and no city-record payload in initial HTML on other routes. The homepage’s city chunk loads only after Cities is selected. The homepage remains statically pre-rendered with one H1. No new published URL or sitemap query permutation was added. Local noindex and the empty sitemap remain appropriate while hosting is deferred.

| Build output                            | Before spinner |  With spinner |
| --------------------------------------- | -------------: | ------------: |
| HTML, uncompressed                      |   74,702 bytes | 337,985 bytes |
| HTML, gzip equivalent                   |   12,215 bytes |  42,851 bytes |
| Directly referenced JS, uncompressed    |  600,846 bytes | 655,861 bytes |
| Directly referenced JS, gzip equivalent |  186,639 bytes | 204,606 bytes |

Measurements include serialized country data in HTML and the script files directly referenced by the generated homepage. They are gzip equivalents from local build files, not a network waterfall or field performance score. The existing HTML budget is 120,000 gzip bytes for Home; city mode has its separate budget. There is no new spinner package or external geography request. The Cities tab loads its local dataset chunk on demand.

## Remaining launch checks

Real-device screen-reader operation, representative throttled mobile performance/Core Web Vitals, native print drivers, and physical printer output remain launch checks. Production browser acceptance and controlled lifecycle tests do not certify those environments. Public domain/contact/hosting configuration and Search Console remain deferred as requested.
