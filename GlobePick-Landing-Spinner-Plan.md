# GlobePick homepage spinner plan

Date: 18 October 2026  
Status: Implemented locally on 19 October 2026; see [verification notes](docs/homepage-spinner.md)

Scope: A working country spinner on `/`, using the existing Lagoon/light design and country-generator functionality

This extends [the main implementation plan](GlobePick-Nextjs-SEO-First-Plan.md). The requested homepage spinner moves the earlier optional wheel into the next implementation scope. The existing country, capital, city, and worksheet routes remain working tools.

## 1. Intended experience

A visitor can open the homepage, spin the wheel, and learn about the selected country without navigating to another page.

1. Choose a continent or keep all continents.
2. Optionally include/exclude countries and keep previous picks excluded.
3. Select **Spin a country**.
4. The wheel lands on the selected country and displays its flag and name.
5. Read the existing country facts and map/source details, save a favorite, copy, share, or spin again.

One spin selects one country. The existing country tool continues to offer batches of 1–20. Capital practice, cities, and worksheets remain accessible through their existing links; their own spinner modes are outside this first increment.

### Reference direction

- [Random.country](https://random.country/) demonstrates direct country discovery followed by country information and a map. Use the simple discovery flow as a reference.
- [Country Picker Wheel](https://pickerwheel.com/tools/random-country-generator/) documents a wheel, continent and country choices, elimination behavior, results, and sharing. Use these interaction ideas with GlobePick's existing no-repeat controls.
- Keep GlobePick's original layout, wording, reviewed 195-country scope, source notices, and Lagoon/light palettes. Do not import competitor data, code, branding, or extra country facts.

## 2. Homepage layout

Replace the decorative atlas panel in the hero with an interactive spinner card. Keep the homepage's server-rendered heading, short introduction, learning content, and links to other tools.

| Area           | Proposed behavior                                                                                                                                   |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| Desktop        | Brief introduction on the left; spinner and its primary action on the right. Show the last result immediately below the hero.                       |
| Phone/tablet   | Short heading and one-sentence introduction, then the wheel and Spin button. Put secondary explanations and saved lists below the working tool.     |
| Primary action | One prominent Spin button inside the spinner card. Remove the duplicate hero country-generation link; keep a quieter link to the full country tool. |
| Quick controls | Continent, no-repeat checkbox, available-country count, and an expandable country-choice section.                                                   |
| Active filters | Show the selected continent and included/excluded counts even when country choices are collapsed. Never apply invisible saved restrictions.         |
| Result         | Reuse the existing country card, flag, facts, optional map, source details, and Save/Copy/Share controls.                                           |
| Saved places   | Provide a compact expandable recent-results/favorites area using the existing saved-place components.                                               |

Keep the primary interaction near the first viewport at common phone sizes such as 375 × 812. At smaller heights, allow normal scrolling rather than shrinking controls below the shared touch size. Avoid automatic result dialogs or forced scrolling after every spin: show the winner beside/below the wheel and offer a **View details** anchor if needed.

## 3. Selection, storage, and sharing contract

The wheel must use the existing generator as its source of truth.

| Existing code                                   | Reuse or small extension                                                                                                                                                                  |
| ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/features/generator/lib/selection.ts`       | Reuse `placesForMode`, `eligiblePlaces`, `selectPlaces`, and the crypto random adapter.                                                                                                   |
| `src/features/generator/hooks/use-generator.ts` | Reuse hydration, generation, warnings, persistence, and route-reactivation handling. Extend generation to return the successful selection to its caller while retaining existing callers. |
| `src/features/generator/lib/state.ts`           | Reuse the existing generated/favorite/replay/reset actions. A spin records one generated country.                                                                                         |
| `src/lib/storage/saved-state.ts`                | Use the existing `globepick:v1:country` record, history, favorites, and consumed pool. Do not create a separate spinner history or repeat pool.                                           |
| `src/lib/share`                                 | Reuse validated links, clipboard/device-share fallbacks, dialogs, and visible feedback.                                                                                                   |
| Generator UI components                         | Reuse country cards, result actions, saved lists, Field/Button/Card primitives, and appropriate country-choice controls.                                                                  |

### Required behavior

- Restore saved country filters and show their active summary. Loading storage must never erase the existing record. Keep Spin disabled until hydration finishes.
- Draw with an explicit count of one. Do not overwrite the full tool's saved batch quantity just because the visitor used the spinner.
- A successful Spin selects and records its country once at the start. Animation completion, skipping, or failure must never generate or record a second country. Leaving during a spin still counts that accepted pick, consistent with the existing Generate action.
- Keep all existing no-repeat semantics: filter changes and clearing history do not reset consumption; the explicit pool reset does. Enabling repeats permits earlier picks, while subsequent no-repeat mode still remembers generated IDs.
- Keep the current country pool, result, and filter snapshot for the accepted spin. Share that result with effective quantity `1`, using `/random-country-generator?...` through the existing codec. Do not share a one-country result with an unrelated saved batch quantity or later filter changes.
- Opening shared results or a previous favorite/history entry is a replay. It does not consume another country or add another history entry.
- Home → country tool → Back must refresh shared consumed IDs/history/favorites without stale writes or losing the retained result. Preserve the current cached-navigation behavior; do not assume a route unmounts when hidden.
- Retain the existing browser-storage failure behavior and cross-tab limitations. This increment does not introduce a new synchronization protocol or backend.

## 4. Wheel rendering and motion

### Real pool, readable presentation

- Render an original SVG wheel with equal-size sectors for the available countries, in a stable order, and a fixed pointer.
- For pools of up to 24 countries, show short readable country labels where they fit. For larger pools, keep the sectors but omit cramped labels; show the pool count and provide the country-choice/list disclosure. Always display the final winner in normal readable text.
- Handle zero countries with an explanatory empty/exhausted state. Handle one country with a full-circle sector and an immediate or minimal-motion result.
- Use local country flags only for the selected result; do not load 195 flag images for wheel sectors.

### Selection comes before animation

1. Lock the spin handler against repeated clicks and verify that hydration and eligibility are ready.
2. Snapshot the ordered available pool and effective filters.
3. Call the existing generation path once for one country; record that result through the existing reducer/persistence flow.
4. Calculate the target sector from that exact country ID. Rotate several turns and stop at the sector's center under the pointer.
5. Reveal the selected result and announce it once. Unlock the controls.

The animation illustrates an existing uniform choice; it does not calculate a second winner from timing or wheel physics.

- Keep the spin pool fixed while moving and when displaying the landed result. Consumption updates must not remove the winning sector halfway through the animation. Rebuild the available wheel for the next spin; an idle filter change can redraw it immediately while retaining a clearly labeled last-result card.
- Use a short, finite animation of about three seconds. Prefer native `Element.animate()` so a returned Animation object can be controlled without a wheel/physics dependency. Keep a narrow rotation value or SVG transform as runtime data; component presentation stays in Tailwind. [MDN animation reference](https://developer.mozilla.org/en-US/docs/Web/API/Element/animate)
- Track only the presentation state needed: idle, spinning, and settled, plus the current pool/winner/rotation snapshot. Keep the animation handle and immediate click guard in refs. Do not update React state on every animation frame.
- During rotation, show **Spinning…** and defer the winner line, result card, and the existing reducer's name-bearing live message until settlement. The accepted pick is already recorded; visual reveal must not dispatch another generated action.
- Disable pool-changing controls and result replay/actions during a spin. Provide **Show result now**, which finishes the current visual reveal without another draw.
- Reduced motion, unsupported animation, animation rejection, a hidden tab, and route deactivation must settle the already selected result safely. On reactivation, show the accepted result rather than restarting or rerolling it. Clean up animation handles/listeners and ignore stale completion callbacks.

## 5. Design, accessibility, and rendering

- Keep semantic theme values in `src/app/globals.css`; use inline Tailwind for layout, responsive behavior, hover/focus, and selected states. Add shared wheel color tokens only if the existing palette roles are insufficient.
- Match Lagoon's teal surfaces, sea-glass accent, borders, typography, and shared buttons. Verify light mode as well.
- Use a native button with a visible busy label such as **Spinning…**. Support Enter/Space and retain keyboard focus. If Show result now disappears after activation, return focus to Spin. Announce the result once through the existing live-status pattern after settling.
- Make the decorative SVG hidden from assistive technology. Provide the country pool, result, errors, and controls as ordinary labeled HTML. Country names and states must not rely on color.
- Honor the system's reduced-motion setting, including a preference change during an active spin. The same chosen country appears without the rotation. [MDN reduced-motion reference](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)
- Keep the homepage a Server Component. Introduce a focused client spinner boundary; do not move the entire homepage or root layout to the client.
- Pre-render a stable wheel/loading frame without choosing a random country during render. Reserve its dimensions to avoid layout shifts while storage hydrates.
- Import country data only for this feature. Do not preload the city dataset, use runtime geography requests, or add a spinner package.
- Keep `/` a useful hub with a quick picker and the dedicated country route a fuller batch/filter workflow. Adjust homepage wording/metadata to describe the actual spinner without duplicating the full tool page. Keep base canonicals and the existing curated sitemap scope.
- Read the installed Next guides again during implementation. Relevant current guides are `preserving-ui-state.md` and `use-router.md`; Activity can retain hidden routes and restart their effects.

## 6. Implementation phases

Complete and verify each phase before the next. Make a local commit for each implementation phase; do not push.

| Phase                         | Changes                                                                                                                                                                                        | Acceptance gate                                                                                                                                                   | Suggested commit                                                     |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1. Shared generation contract | Return the selected country from the existing generation path; define spin snapshots and one-pick/shared-storage behavior. Extract only the filter/action pieces genuinely needed by both UIs. | Tests cover single-pick generation, unchanged saved batch quantity, no-repeat pool, and exactly one history entry. Existing tools keep their behavior.            | `refactor: expose shared country selection for the homepage spinner` |
| 2. Wheel and motion           | Add pure sector/landing-angle helpers, the SVG wheel, animation lifecycle, reduced motion, skip, and error fallback.                                                                           | Every selected country maps to the correct pointer sector, including zero/one-country states and interrupted animation. No second selection occurs on completion. | `feat: add accessible country spinner with deterministic landing`    |
| 3. Homepage integration       | Replace the hero artwork; connect filters, result details, saved places, and shared copy/share feedback. Update homepage wording and metadata.                                                 | A visitor can spin, inspect, save, copy, share, and continue to the full tool directly from Home in either theme.                                                 | `feat: add the country spinner to the GlobePick homepage`            |
| 4. Verification and polish    | Exercise responsive layouts, cached navigation, failures, hydration, output payloads, and existing tool regressions. Update documentation and fix only observed issues.                        | Checks below pass and remaining device/performance limitations are recorded honestly.                                                                             | `test: verify homepage spinner and shared generator behavior`        |

Indicative new files belong under `src/features/spinner/`: a homepage workspace, a presentational country wheel, a small animation hook if needed, and a pure wheel-geometry helper. Keep shared selection/storage in their existing generator modules. Extract existing copy/share feedback from `GeneratorWorkspace` only as needed; do not duplicate that implementation or rewrite the whole workspace.

## 7. Verification checklist

| Area                     | Required checks                                                                                                                                                                                                              |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Eligibility and geometry | Every winner belongs to the filtered pool, excluding consumed IDs when no-repeat is on. Pointer math works for every sector in representative pools of 1, 2, 3, 24, 25, and 195 countries, across successive rotations.      |
| State and persistence    | Rapid repeated clicks produce one draw. Empty/exhausted pools produce no history entry. Home and the country tool share history/favorites/consumption; filters and batch quantity remain coherent.                           |
| Motion lifecycle         | Normal finish, Show result now, reduced motion, animation API absence/rejection, tab hiding, Strict Mode, and cached-route reactivation reveal the same selected country once.                                               |
| Replay and sharing       | Spin links reopen the exact result without consumption/history changes; links use quantity one and the selection's filters. Copy pending/success/failure and native-share fallback/cancellation retain current feedback.     |
| Responsive/accessibility | Phone, tablet, desktop, keyboard, visible focus, result announcement, readable large pools, theme toggle, and no horizontal overflow. Check short screens as well as normal phone heights.                                   |
| SEO and performance      | Initial useful homepage HTML, one H1, correct metadata/canonical, no extra sitemap permutations, no city data on Home, stable wheel space, and existing HTML payload budgets. Record before/after HTML and JavaScript sizes. |
| Existing functionality   | Country/capital/city generators, capital practice, saved-place replay, worksheets, shared URLs, and white print presentation still work.                                                                                     |

Run the existing unit tests, data validators, lint, type checking, formatting, production build, and production verifier. Add focused tests for new selection/geometry/lifecycle behavior; do not add tests that only mirror JSX or class strings. Use visible-state browser checks for the finished feature, with real-device and assistive-technology gaps recorded where not exercised.

## 8. Completion boundary

The increment is complete when users can spin directly on Home with matching filters, a correct landing, full existing country-result actions, shared browser state, both themes, reduced motion, and passing regression checks.

Sound effects, confetti, custom wheel themes, flag-only modes, user-entered countries, wheel downloads, full-screen presentation, accounts, paid features, and capital/city spinners are later options. They are not required to deliver this homepage feature.
