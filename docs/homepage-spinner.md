# Homepage spinner verification

Implemented locally on 19 October 2026. Hosting remains deferred; no push or deployment was performed.

## Behavior and scope

The original homepage hero, atlas artwork, wording, and links are restored. A separate country-spinner section follows the hero, with settings and filters on the left and the wheel and Spin button on the right from the tablet breakpoint. Phones stack settings above the wheel. Each spin picks one country through the existing uniform crypto-backed selection engine. The full country tool retains batches of 1–20; capital practice, city selection, worksheets, published routes, and Lagoon/light themes retain their existing workflows.

The spinner and country generator share the validated `globepick:v1:country` record. The spinner offers continent and no-repeat settings and always uses all countries in that continent. The full tool’s saved include/exclude choices are ignored by the spinner and preserved when it writes history, favorites, or settings. Consumed countries stay excluded until the pool is explicitly reset or repeats are enabled, and recent picks and favorites appear in both views. A spin never changes the saved batch quantity. On Back, the spinner refreshes shared saved lists and the latest batch quantity and stored custom choices while retaining its own continent/no-repeat settings and result.

A synchronous guard blocks repeated clicks before React renders. The accepted country is recorded once at spin start. An immutable pool/filter snapshot determines the wheel’s landing and the share link; settling cannot draw another country. Links open `/random-country-generator` with quantity one, the accepted pick’s filters, and its exact country ID. Replays neither consume countries nor append history.

The wheel uses equal SVG sectors. Small pools have labels; dense pools use stronger decorative color bands, with the available-country list and explicit result supplying readable names. The always-visible available-country list shows local flags and names, eight countries per page, with Previous/Next controls. Only list presentation is paginated; selection always uses the entire available pool. Settings changes reset to page one; shrinking pools clamp to a valid page. The list retains the accepted pool while spinning and updates on settlement, preserving the delayed reveal. It has no inner scrollbar. It loads no flag for wheel sectors. Component styling uses inline Tailwind and existing global theme roles.

## Automated checks

- 47 tests pass, including every landing sector in pools of 1, 2, 3, 24, 25, and 195 across successive rotations.
- Generation tests cover one history entry, filtered/no-repeat selection, retained batch quantity, empty pools, existing batch/quiz messages, and single-pick route resume with successful or failed storage reads.
- Pool tests verify that spinner draws/shares ignore custom choices without erasing them, cached resume refreshes the stored choices, every available country appears across the eight-item pages, off-page countries can win, and empty/shrinking pools clamp pagination safely.
- Snapshot tests verify retained pool/filter arrays and exact one-country share round-trips after the original filters change.
- Controlled motion tests cover normal completion, skip/cleanup, rejection, missing/throwing animation APIs, hidden documents, reduced-motion preference changes, initial reduced motion, and timeout. Repeated completion signals settle once and remove listeners/timers. These are adapter tests; reduced-motion emulation and hidden-tab lifecycle were not separately exercised on physical devices.
- Existing storage, sharing fallbacks/cancellation, quiz, city, worksheet model, contrast, SEO, and production inspection tests continue to pass.
- Lint, TypeScript, formatting of changed files, geography/city/PDF validation, and production compilation pass. The user’s pre-existing reference-link edits in the main plan are preserved separately.

## Browser acceptance

Verified against the local production server through the in-app browser:

- Double-click Spin adds one country; the busy view hides the new winner until settlement. Normal completion and keyboard Enter → Show result now reveal the accepted result. Skip returns focus to Spin.
- Leaving during animation and returning with Back reveals the accepted result without restarting the spin. A six-country batch in the full tool shares history/consumption with Home, and a subsequent homepage spin leaves the full tool’s quantity at six.
- Save and Copy provide the existing saved state and visible clipboard feedback. Sharing a country after changing the current continent still uses the original continent and quantity one. Opening that exact link displays the country without adding history.
- The earlier custom-pool version was checked with empty and Japan-only pools. Those include/exclude controls have now been removed from the spinner; the underlying engine still handles empty and single-country pools. Spin retains focus when its accepted pick exhausts the pool; unavailable actions use `aria-disabled` and the handler refuses a new draw.
- Phone, tablet, and desktop layouts fit without horizontal overflow. Tested viewport requests were 375 × 812, 768 × 1024, and 1280 × 900 (the browser reserves 15px for its scrollbar). The original compact-hero version placed Spin near the bottom of the first phone viewport; the owner’s subsequent layout request restores the full hero and places the spinner in the following section. Temporary viewport overrides were reset afterward.
- The simplified list was checked with first/last-page boundaries, eight loaded local flags, keyboard Previous/Next, and automatic page-one reset when the continent changes. The list has no inner overflow on phones; tablet/desktop layouts also fit. Saving Japan-only/Pakistan-excluded choices in the full generator did not restrict the spinner. A spin retained quantity six and those custom choices in the full generator, while its share link contained no custom include/exclude fields. Test-only custom choices were restored afterward.
- The revised layout was checked on the production build: the original hero immediately precedes the spinner; tablet and desktop panels align side by side, and phone panels stack settings before the wheel without horizontal overflow. Filtering to Europe and spinning/skipping returned a European country with the existing result controls.
- Light mode and Lagoon dark mode were inspected. Dense light sectors were strengthened after visual review; the later layout revision restores the original hero alignment and separates settings from the wheel.
- Capital generation, hiding/revealing its answer and copying it, city generation, and worksheet creation still work. Worksheet screen paper remains white with black text.

## Production and payloads

All thirteen published pages pass the HTTP verifier, with five genuine 404s, sixteen sampled assets including unchanged PDF bytes, clean canonicals, and no city-record payload on other routes. The homepage remains statically pre-rendered with one H1. No new published URL or sitemap query permutation was added. Local noindex and the empty sitemap remain appropriate while hosting is deferred.

| Build output                            | Before spinner |  With spinner |
| --------------------------------------- | -------------: | ------------: |
| HTML, uncompressed                      |   74,702 bytes | 335,620 bytes |
| HTML, gzip equivalent                   |   12,215 bytes |  42,386 bytes |
| Directly referenced JS, uncompressed    |  600,846 bytes | 643,045 bytes |
| Directly referenced JS, gzip equivalent |  186,639 bytes | 200,537 bytes |

Measurements include serialized country data in HTML and the script files directly referenced by the generated homepage. They are gzip equivalents from local build files, not a network waterfall or field performance score. The existing HTML budget is 120,000 gzip bytes for Home; city mode has its separate budget. There is no new spinner package or geography network request.

## Remaining launch checks

Real-device screen-reader operation, representative throttled mobile performance/Core Web Vitals, native print drivers, and physical printer output remain launch checks. Production browser acceptance and controlled lifecycle tests do not certify those environments. Public domain/contact/hosting configuration and Search Console remain deferred as requested.
