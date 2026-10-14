# GlobePick — Next.js Frontend-Only, SEO-First Implementation Plan

Version: 1.1  
Date: 14 October 2026  
Status: Ready for incremental local implementation  
Product name: GlobePick (working name; domain and trademark availability remain to be checked)  
Approved design: Light atlas identity with subtle glass navigation  
Mandatory styling: Tailwind CSS with shared design tokens in src/app/globals.css

## 1. Product objective and constraints

Build a fast, accessible geography tool that lets people select random countries and capitals, learn about the result, and create geography activities. Expand into cities after the core workflow is reliable.

Primary audiences: geography learners, teachers, families, and creators. Travel discovery is a later extension, not part of the initial data promise.

The experience should help a visitor complete a task: choose a place, discover it, copy or save it, guess an answer, or create a research assignment.

### Non-negotiable requirements

- Use Next.js App Router, React, TypeScript in strict mode, and Tailwind CSS v4 with CSS-first theme configuration.
- Define shared colors, font families, font sizes, spacing, content widths, and responsive breakpoints in src/app/globals.css. Consume those tokens through Tailwind className utilities inside components.
- Use Tailwind for all component styling, responsive layouts, states, transitions, and print presentation.
- Keep the first release frontend-only: no database, authentication, custom API routes, Server Actions, or separate backend.
- Use local, reviewed geography datasets; no runtime geography API dependency.
- Pre-render useful page content and metadata. Do not turn the whole application into a client-only shell.
- Make components reusable through clear contracts, composition, and controlled variants.
- Use the approved light theme; glass belongs primarily in navigation and floating controls.
- Support phones, tablets, desktops, keyboards, and screen readers.
- Ship incremental working phases with acceptance gates.
- Preserve existing project work if implementation starts in an established repository.
- Never describe SEO, traffic, ad approval, or income as guaranteed.

“Frontend-only” permits Next.js Server Components rendering static HTML at build time. It does not require every component to have a client directive.

A normal Next.js deployment can serve this application without application backend features. A fully static export is optional: adopt it only after checking image handling, metadata, and host routing requirements.

## 2. Scope and release boundaries

| Capability | Core release | Expansion |
| --- | --- | --- |
| Random country | Yes | Additional reviewed filters |
| Random capital | Yes, country-capital pairs | More quiz formats |
| Continent filtering | Yes | Curated regional pages |
| Searchable country inclusion/exclusion | Yes | Reusable saved presets |
| Multiple results | 1–20 | Classroom assignment sets |
| No repeats | Yes | Saved assignment sessions |
| Result facts and map location | Yes | More reviewed information |
| Browser history and favorites | Yes | Cloud sync requires a later backend |
| Copy/share | Yes | Downloadable social cards |
| Guess and reveal | Yes | Daily challenge and progress |
| Printable classroom worksheet | First expansion | Paid packs, later |
| Random city | Second expansion | Curated landmarks |
| Animated wheel | Optional later | Never required to generate |
| Travel budget/visa/safety filters | Deferred | Require maintained, suitable data |
| Accounts, payments, multiplayer | Deferred | Separate backend planning required |

Do not show tabs, filters, or routes for capabilities that are not implemented.

## 3. Visual design system

### Direction

Create an original light geography interface with restrained atlas details. Use flags, continent outlines, and location details as meaningful visuals. Keep the generator prominent and the first screen compact.

| Token | Starting value or rule |
| --- | --- |
| Page background | #F7F9FC |
| Card surface | #FFFFFF |
| Primary text | #172033 |
| Secondary text | #526174 |
| Brand accent | #2563EB |
| Border | #E2E8F0 |
| Content width | Shared maximum around 1200px |
| Gutters | 16px mobile, 24px tablet, 32px desktop |
| Spacing | Consistent 4px-based scale |
| Card radius | Approximately 16–20px |
| Control radius | Consistent rounded controls; pills for appropriate selectors |
| Body text | Approximately 16px with comfortable line height |
| Typography | One self-hosted sans-serif through next/font |
| Motion | Brief 150–250ms feedback; respect reduced motion |

Treat these values as a starting system. Verify contrast in every actual state, including translucent backgrounds, hover, disabled, selected, and focus states.

### Tailwind contract — mandatory

The styling model is: **shared values in globals.css; composition and local appearance in component className.**

- src/app/globals.css is the single source of truth for the common design system.
- Use Tailwind v4 @theme declarations for token-backed utilities. Use @theme inline when mapping a next/font-provided CSS variable to font-sans.
- Define semantic colors, font families, common font sizes and line heights, shared spacing, page gutters, content maximum widths, responsive breakpoints, radii, and shadows centrally.
- Use readable utilities such as bg-page, bg-surface, text-foreground, text-muted, text-brand, text-page-title, max-w-page, p-card, and px-gutter in components.
- Keep flex/grid composition, alignment, visibility, local padding/gaps, responsive changes, hover/focus behavior, and component variants in JSX/TSX className.
- Component-local spacing may use the shared numerical Tailwind scale, such as gap-4 and p-6. Repeated design roles, such as page gutters and card padding, use named shared tokens.
- Do not repeat raw brand hex colors, font declarations, common font-size values, page maximum widths, or shared spacing values in components.
- Avoid arbitrary values such as bg-[#2563EB], text-[16px], and max-w-[1200px] for shared design decisions. A genuinely unique measured layout may use a documented arbitrary value when a new shared token would add no value.
- Do not convert every Tailwind className into a global CSS class. Tailwind utilities are the component styling interface.
- Do not move a component's entire layout into globals.css through large @apply blocks.
- No CSS Modules, styled-components, styled-jsx, or page-specific plain CSS files.
- globals.css may also contain the Tailwind import, narrowly scoped global base rules, and shared theme definitions. It is intentional central configuration, not a second component styling system.
- Use Tailwind responsive, focus-visible, aria/data-state, motion-reduce, and print variants.
- Use clsx plus tailwind-merge through one cn helper if conditional classes require them.
- Use a variant helper such as class-variance-authority only for components with meaningful shared variants.
- Keep full class names discoverable; do not construct class names through interpolation.
- Dynamic selection indexes or map coordinates are data, not style classes. If a later visualization needs runtime CSS variables, use narrowly scoped variables while keeping presentation in Tailwind.
- Build one shared glass component/variant that consumes global surface tokens. It needs a high-opacity readable surface and a solid fallback when backdrop filtering is unavailable.
- Avoid large stacks of blurred panels and continuous decorative effects.

### Global token ownership and component ownership

| Styling concern | Define shared values in globals.css | Use inside component className |
| --- | --- | --- |
| Colors | Semantic page, surface, foreground, muted, brand, border, status colors | bg-page, bg-surface, text-foreground, border-border |
| Font family | font-sans mapped to the next/font variable | font-sans; usually inherited from the root |
| Typography | Common font sizes, line heights, named page/card heading sizes | text-base, text-sm, text-page-title, font-semibold |
| Spacing | Base spacing scale, page gutters, section spacing, card padding | gap-4, p-card, py-section, px-gutter |
| Content maximum width | Page/tool/readable content width tokens | max-w-page, max-w-tool, max-w-reading |
| Screen breakpoints | sm/md/lg/xl viewport thresholds, consistently in rem | md:grid-cols-2, lg:flex-row |
| Radii and shadows | Shared card/control radii and elevation tokens | rounded-card, shadow-card |
| Component layout | No global selector for each component layout | grid, flex, items-center, gap-4, hidden, w-full |
| Interaction | Shared state colors; behavior applied locally | hover:bg-brand-strong, focus-visible:ring-brand |
| Shared visual pattern | Shared tokens; composition owned by Button/Card/Container | Reuse the component or its typed variant |

**Content width and screen size are different:** max-w-page limits content width, while md: and lg: change layout at viewport breakpoints. Keep both values centralized, but do not use a content-width token as a substitute for responsive breakpoints.

### Illustrative Tailwind v4 configuration

This is a starting pattern for the implementation, not a requirement to copy values without visual checks. Add status, control, and additional typography tokens when their actual components need them.

src/app/globals.css:

```css
@import "tailwindcss";

@theme {
  --color-page: #f7f9fc;
  --color-surface: #ffffff;
  --color-foreground: #172033;
  --color-muted: #526174;
  --color-brand: #2563eb;
  --color-brand-strong: #1d4ed8;
  --color-border: #e2e8f0;

  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-base--line-height: 1.6;
  --text-lg: 1.125rem;
  --text-page-title: clamp(2rem, 4vw, 3rem);
  --text-page-title--line-height: 1.15;

  --spacing: 0.25rem;
  --spacing-gutter: 1rem;
  --spacing-gutter-md: 1.5rem;
  --spacing-gutter-lg: 2rem;
  --spacing-card: 1.5rem;
  --spacing-section: 3rem;

  --container-page: 75rem;
  --container-tool: 65rem;
  --container-reading: 48rem;

  --breakpoint-sm: 40rem;
  --breakpoint-md: 48rem;
  --breakpoint-lg: 64rem;
  --breakpoint-xl: 80rem;

  --radius-card: 1.25rem;
  --radius-control: 0.75rem;
  --shadow-card: 0 4px 20px rgb(23 32 51 / 0.06);
}

@theme inline {
  --font-sans: var(--font-globepick), ui-sans-serif, system-ui, sans-serif;
}
```

The root layout applies the next/font variable class that defines --font-globepick, plus font-sans bg-page text-foreground. Do not redefine font-family in individual cards.

A shared Container or tool section then composes the utilities locally:

```tsx
<div className="mx-auto w-full max-w-page px-gutter md:px-gutter-md lg:px-gutter-lg">
  <section className="grid gap-6 py-section lg:grid-cols-2">
    <div className="rounded-card border border-border bg-surface p-card shadow-card">
      <h1 className="text-page-title font-semibold text-foreground">
        Random Country Generator
      </h1>
      <p className="mt-4 text-base text-muted">
        Pick a country and discover somewhere new.
      </p>
    </div>
  </section>
</div>
```

In implementation, reuse Container and Card rather than copying this wrapper markup into each page.

### Redesign workflow

1. Site-wide color, font, type scale, gutter, width, or spacing change: update the relevant tokens in globals.css.
2. Shared card/button appearance change: edit the corresponding reusable component or variant.
3. One feature's alignment, arrangement, or behavior change: edit that feature component's className.
4. Add a new global token only when it represents a shared design decision.
5. Verify representative mobile and desktop pages after token changes. Global changes can affect wrapping, overflow, focus visibility, contrast, and worksheet printing.

Example: changing --color-brand updates all text-brand/bg-brand consumers; changing --container-page updates all max-w-page consumers; changing --spacing-card updates all p-card consumers. A result card's unique grid change remains local to that component.

### Screen composition

Desktop:
1. Compact header: brand, tool links, learning link.
2. H1 and short explanation.
3. Generator workspace: filter panel plus larger result panel.
4. Recent results and saved places.
5. Activity presets and genuinely useful instructions.
6. Dataset explanation, related tools, footer.

Mobile:
1. Header and concise title.
2. Mode navigation.
3. Essential controls and primary action.
4. Result and next actions.
5. History and learning content.

Keep the tool near the top. A large decorative hero must not push it below the first useful viewport.

## 4. Reusable component architecture

Reuse is a requirement, but avoid a universal component with dozens of unrelated flags. Share stable behavior and visual patterns; keep genuinely different workflows distinct.

### Component responsibilities

| Layer | Examples | Responsibilities |
| --- | --- | --- |
| UI primitives | Button, IconButton, Card, Badge, Field, Checkbox, Select, Dialog, Accordion | Appearance, accessible interaction, controlled variants |
| Layout | Container, PageIntro, Section, AppHeader, MobileNavigation, AppFooter | Width, spacing, landmarks, responsive shell |
| Tool shell | ToolPageLayout, ToolNavigation, GeneratorWorkspace | Shared tool layout and slots |
| Generator feature | GeneratorFilters, ContinentFilter, CountrySelector, QuantityControl, GenerateButton | Selection controls and user intents |
| Results | PlaceResultCard, PlaceIdentity, FactList, ResultActions, ResultsGrid | Present normalized data |
| Feedback | EmptyState, InlineNotice, Skeleton, ActionFeedback | Helpful loading, empty, error, and confirmation states |
| Saved state | HistoryList, FavoritesList, StorageNotice | Browser persistence presentation |
| Learning | GuessReveal, ResearchPromptCard, WorksheetPreview | Educational workflow |
| SEO content | HowItWorks, DatasetExplanation, RelatedTools, Breadcrumbs | Pre-rendered useful content |

### Required reuse examples

- Country, capital, and future city pages reuse ToolPageLayout, GeneratorWorkspace, QuantityControl, ResultsGrid, and ResultActions.
- PlaceResultCard composes PlaceIdentity and FactList. Country facts and city facts come from explicit adapters.
- History and favorites reuse PlaceIdentity rather than duplicating flag/name markup.
- The normal generator and classroom activity reuse the selection engine and filter controls.
- Regional pages reuse the generator with a typed initial region; they do not duplicate its source code.
- WorksheetPreview consumes the same normalized result data as on-screen results.
- Glass, buttons, cards, focus styles, widths, and spacing are shared design primitives.

### Component contracts

- Give each component typed props with a clear owner for its state.
- Use controlled controls: value and onChange; do not maintain competing copies of selected filters.
- Use children or specific slots for composition.
- Distinguish actions from navigation: buttons perform actions; links navigate.
- Forward appropriate native attributes and accessibility properties.
- Decorative icons are hidden from assistive technology; icon-only actions have labels.
- Domain cards must not read localStorage or generate random results themselves.
- Keep browser integrations outside presentational UI.
- Prefer explicit country/capital/city types over a large optional-field object.

### Suggested folder structure

Use these directories as responsibility boundaries. Create files when their phase needs them, rather than generating empty scaffolding.

- src/app/
  - layout.tsx, page.tsx, globals.css
  - random-country-generator/page.tsx
  - random-capital-generator/page.tsx
  - random-country-generator/[region]/page.tsx — only curated regions
  - country-project-generator/page.tsx — educational expansion
  - random-city-generator/page.tsx — city expansion
  - countries/[slug]/page.tsx — only reviewed detail pages
  - about/page.tsx, privacy/page.tsx, terms/page.tsx
  - not-found.tsx, error.tsx
  - sitemap.ts, robots.ts
- src/components/ui/
- src/components/layout/
- src/components/content/
- src/features/generator/components/
- src/features/generator/hooks/
- src/features/generator/lib/
- src/features/generator/types.ts
- src/features/saved-places/
- src/features/learning/
- src/features/worksheets/
- src/data/countries/
- src/data/cities/ — added later
- src/data/tool-pages/
- src/lib/seo/
- src/lib/storage/
- src/lib/share/
- src/lib/cn.ts
- public/flags/
- public/maps/
- scripts/validate-geography-data.ts
- tests/

Dependency direction: route composes feature; feature uses domain functions and UI; UI does not import features; domain functions do not import React.

## 5. React and Next.js architecture rules

### Rendering boundary

- Layouts, page introductions, explanatory sections, breadcrumbs, and curated content remain Server Components by default.
- Generator interaction, storage, sharing controls, and quizzes use small Client Component boundaries.
- Do not mark root layout or every page as client components.
- Pass serializable, minimal datasets to interactive features.
- Do not send all city data to every tool.
- Keep metadata generation outside client components.
- Use a deterministic initial render. Generate only from an explicit user action; do not run randomness during render.
- Read browser storage after mounting without overwriting stored data with initial empty state.
- If URL state uses useSearchParams in a static route, isolate it within an appropriate Suspense boundary and verify the production build.

### State and logic

- Begin with feature-local state. Use a reducer when transitions become interdependent.
- Model filters, selected results, consumed IDs, and display preferences explicitly.
- Compute eligible pools and counts from source state; do not synchronize derived state with Effects.
- Use Effects for actual external synchronization, such as storage and browser events.
- Handle generation, copy, reset, and share in event handlers.
- Use useMemo/useCallback only where useful for measured computation or stable component contracts.
- Use stable place IDs as keys.
- Never mutate datasets, result arrays, or state objects.
- Introduce no Redux, global store, or query library without a demonstrated requirement.
- Extract hooks around cohesive behavior, not every individual variable.
- Separate domain errors from copy/share/browser failures.
- Shared content and utilities must have a single source of truth.

## 6. Geography data and selection behavior

### Data contract

Country record:
- Stable ID and slug.
- Common display name and optional alternative/native names.
- Documented continent classification.
- Capital entries with roles/notes when needed.
- Languages and currency information.
- Location coordinate suitable for a location marker.
- Flag asset path.
- Country/territory classification.
- Field-level sources and review dates where appropriate.
- Optional population estimate with its year.
- Reviewed short facts and learning prompts.

Capital mode selects a country-capital pair. Where a country has multiple capitals or different governmental roles, display that information accurately; do not silently flatten it into an incorrect fact.

City record, later:
- Stable city ID, country ID, display name, admin region, coordinates.
- Optional dated population.
- Dataset membership and source.

Publish what is included in the country pool, how territories are treated, the continent model, and the scope of the city dataset. Display actual pool counts rather than a hardcoded global number.

### Selection rules

1. Apply mode and region restrictions.
2. Apply include/exclude country choices.
3. Remove consumed records when no-repeat is enabled.
4. Calculate the remaining eligible count.
5. Select records uniformly from that pool.
6. Always return distinct records within one multi-result batch.
7. With no-repeat off, a record may reappear in a future batch.
8. With no-repeat on, previously generated IDs remain excluded for the current mode’s session, even when filters change, until the user resets the pool.
9. Separate country, capital, and city histories/consumed pools.
10. Offer a clearly labeled reset; never silently reset an exhausted pool.

If quantity exceeds availability, explain the constraint and let the user reduce it or explicitly generate all remaining records. Do not silently duplicate results or ignore filters.

Use a small random-source adapter so deterministic tests are possible. A browser crypto-based bounded integer implementation can use rejection sampling, followed by partial Fisher–Yates selection. Do not use random array sorting. A future wheel animates toward the already chosen result; animation must not determine selection probabilities.

For city mode, initially select uniformly among included city records and explain the resulting dataset distribution. Equal-city and equal-country-first selection are different behaviors.

### Data sourcing

Use appropriate licensed country/flag sources and a curated city extract, such as GeoNames, when cities are introduced. Record attribution and asset licenses. Validate sources rather than copying competitor facts or assets.

Review multiple capitals, transcontinental classifications, missing values, alternative names, and renamed places.

Initial maps can use a lightweight local world map with a location marker plus a link to an external map. Do not represent a center coordinate as a country's precise boundary. Interactive maps are optional later; use an approved tile provider and attribution if added.

## 7. Browser persistence and sharing

### Persistence

- Store only settings, stable IDs, history, and favorites.
- Use versioned storage keys and runtime validation.
- Cap history, initially at 100 entries per mode.
- Explain that favorites remain in this browser and do not sync across devices.
- Handle unavailable storage, quota errors, malformed JSON, and removed dataset IDs.
- Keep generation functional when saving fails.
- Provide clear history/favorites deletion controls.
- Ensure hydration completes before the first persistence write.
- Do not collect user identity, location, or student names for the initial tool.

### Sharing

- A share link preserves whitelisted filters and, optionally, specific result IDs.
- Restore shared results as a replay; do not present them as a fresh random draw.
- Viewing a shared result does not automatically consume the recipient's no-repeat pool.
- Validate mode, region, IDs, quantity, and URL length.
- Use native sharing when available, with a copy-link fallback.
- Handle clipboard failure with a selectable link/text alternative.
- Query variants use the base tool URL as their canonical; exclude them from the sitemap.
- Do not index every result or filter combination.
- Social previews remain tool-level initially; query-specific previews would require an additional strategy.

## 8. SEO-first information architecture

### Route ownership

| Route | Purpose | Initial index policy |
| --- | --- | --- |
| / | Brand/tool hub with distinctive overview and launch links | Index |
| /random-country-generator | Primary country selection tool | Index |
| /random-capital-generator | Capital generation and guessing | Index |
| /random-country-generator/europe | Curated regional tool with useful regional activity content | Add after validation |
| /country-project-generator | Classroom research assignments and worksheet workflow | Add when working |
| /random-city-generator | City tool with honest dataset scope | Add when working |
| /countries/[slug] | Reviewed learning/detail content | Add selectively |
| /about | Creator, purpose, sources, corrections contact | Index |
| /privacy, /terms | Accurate policies for the actual deployed site | Crawlable |
| Filter/result query variants | Shared or customized tool state | Canonical to base tool; not in sitemap |

The homepage and country tool must have different primary content. Do not publish a second identical country tool under a synonym URL.

### Required SEO behavior

- Useful H1, explanation, control labels, sample output, and how-to content appear in initial HTML.
- Give every indexable page a distinct purpose and visible content.
- Define metadataBase from the actual deployment origin.
- Use accurate titles, descriptions, canonical URLs, and Open Graph images.
- Use normal links for tools, regions, breadcrumbs, and reviewed country pages.
- Generate sitemap entries from the same published page registry used for navigation.
- Never submit unfinished, empty, query-variant, or unreviewed country pages.
- Return an actual 404 for invalid regions/slugs.
- Keep robots rules consistent with the indexing strategy.
- Do not confuse robots.txt blocking with removal from the index.
- Include source dates and honest dataset limits.
- Use structured data only when applicable and supported by visible content, such as breadcrumbs and accurate WebApplication information.
- Never invent reviews or ratings, and do not promise FAQ rich results.
- Add an accurate About page and a route for reporting data corrections.
- Avoid mass-produced pages with only the country name or region changed.
- Do not create all country-by-city-by-theme permutations for search traffic.

Keyword targets are hypotheses until researched. Start with country generation, capital generation, no-repeat selection, and classroom assignments. Regional routes require a working prefiltered tool plus worthwhile region-specific content, not merely swapped headings.

Create country detail pages selectively. A tiny fact table copied from a dataset is insufficient reason to publish hundreds of indexable pages.

## 9. UX, accessibility, and performance requirements

### Interaction quality

- Show the eligible and remaining pool count.
- Keep results in the workspace; details open only on request.
- Include regenerate, copy, save, and share actions.
- Show visible feedback for copy/save and failed actions.
- Preserve working filters through navigation and sharing where appropriate.
- Use a mobile filter drawer only if it improves access; basic controls stay visible.
- Never intercept typing with global shortcuts.
- Keep sounds off by default if animation is eventually added.

### Accessibility

- Semantic landmarks, labeled fields, logical headings, and a skip link.
- Full keyboard operation and visible focus.
- At least 44px touch targets as a product usability target.
- Readable contrast verified against WCAG AA criteria.
- Result names announced politely; do not announce an entire long batch repeatedly.
- Predictable focus after dialog operations; no unexpected focus stealing after generation.
- Accessible dialog focus containment and return.
- Flags have suitable alternative text or are decorative when a nearby name already conveys identity.
- Selection and validation do not rely on color alone.
- Reduced-motion preferences respected.
- Display important information as text, not solely inside canvas or maps.

### Performance

- Pre-rendered informative content and a small interactive bundle.
- Local optimized flag assets with fixed dimensions.
- No startup globe/3D library, autoplay video, or heavy map SDK.
- Load optional maps/exports/animations only when requested.
- Partition city data and load only the required dataset.
- Avoid importing feature registries that pull every dataset into every route.
- Reserve result/map/ad space to limit layout movement.
- Product targets: LCP at or below 2.5s, CLS at or below 0.1, INP at or below 200ms, assessed at the 75th percentile when field data exists.
- Use lab measurements before launch, then field observations; a lab score is not a ranking guarantee.
- Reserve future ad positions without obstructing tool controls.

## 10. Incremental execution phases

### Phase 0 — Project and scope audit

Tasks:
- Inspect an existing repository before changing it; read its instructions and package versions.
- Confirm the working name, approved design, frontend-only boundary, and initial routes.
- Choose supported Next.js/React/Tailwind releases at implementation time and commit the lockfile.
- Record data scope, licenses, and definition of country/capital modes.
- Create a short architecture decision record for rendering, storage, and SEO route ownership.

Acceptance:
- Existing working behavior is documented.
- Planned changes reuse existing suitable components.
- No destructive rewrite or unrelated infrastructure is introduced.

### Phase 1 — Foundation and reusable design system

Tasks:
- Set up strict TypeScript, Tailwind, linting, formatting, and path aliases.
- Define shared colors, typography, spacing, gutters, content widths, viewport breakpoints, radii, and shadows in src/app/globals.css, then consume them through component-level Tailwind utilities.
- Build the light/glass design system from these shared tokens.
- Build Container, Button, Card, Field, feedback components, header, footer, and mobile navigation.
- Create homepage and primary tool route shells.
- Add baseline metadata, error/not-found behavior, robots, and sitemap registry.
- Add initial source/policy pages appropriate to the actual feature scope.

Acceptance:
- Shared primitives produce consistent responsive pages.
- Components use Tailwind className utilities; shared design values live in globals.css.
- Changing the brand token and page-width token updates all relevant shared consumers without editing multiple pages.
- A component-specific layout change can be made locally without adding global CSS selectors.
- Tool headings and explanations appear in initial HTML.
- Keyboard navigation and production build pass.

### Phase 2 — Country generator core

Tasks:
- Add reviewed country data, local flags, and build-time validation.
- Implement typed filter and random selection functions.
- Add region, include/exclude, quantity, and no-repeat controls.
- Compose shared result cards and facts.
- Add pool counts, batch selection, reset, exhaustion, and empty states.

Acceptance:
- Only eligible records are selected.
- Batch results are unique.
- No-repeat behavior is consistent across filter changes.
- Empty and exhausted pools are understandable.
- No runtime data API call is needed.
- Production renders without hydration warnings.

### Phase 3 — Capital mode, persistence, and sharing

Tasks:
- Reuse the country selection pipeline for capital-country pairs.
- Add guess/reveal with a clearly hidden answer before reveal.
- Implement versioned history, favorites, and settings.
- Add copy/share adapters, URL validation, and result replay.
- Compose both routes through the same tool shell and controls.

Acceptance:
- Country and capital modes do not duplicate selection logic.
- Multiple-capital facts remain accurate.
- Refresh preserves saved data without initial overwrite.
- Disabled storage and clipboard failure do not break generation.
- Shared links restore the documented state.
- Canonicals remain clean.

### Phase 4 — Educational differentiation

Tasks:
- Implement Country Project Generator using the existing engine.
- Generate unique country assignments and reviewed research prompts.
- Add adjustable assignment quantity within the available pool.
- Compose a worksheet preview and Tailwind print layout.
- Include source notes and answer material where appropriate.
- Avoid student names or account requirements.

Acceptance:
- A teacher can produce a usable activity without registration.
- Worksheets print legibly on A4 and Letter without clipped content.
- Preview and print use the same assignment data.
- Prompts are genuinely educational and checked for accuracy.

### Phase 5 — City expansion

Tasks:
- Curate and validate an appropriately licensed city dataset.
- Document inclusion criteria and per-country coverage.
- Load city data separately from country/capital tools.
- Reuse tool controls, result patterns, storage adapters, and selection engine.
- Support country selection and uniform city-record selection.
- Explain cities with identical names using country/admin region labels.

Acceptance:
- Missing city coverage has an honest empty state.
- City probabilities match the documented method.
- Large city files do not inflate country-page bundles.
- City identity remains unique across names and countries.

### Phase 6 — Curated SEO expansion

Tasks:
- Validate candidate searches and inspect their user intent.
- Add selected regional routes with working initial filters and original activities.
- Publish reviewed country pages only where useful content exists.
- Add crawlable related links, accurate metadata, and suitable structured data.
- Register the deployed site with Search Console and submit the curated sitemap.

Acceptance:
- Each new page serves a distinct useful purpose.
- Sitemap, canonical, navigation, and metadata use the correct domain.
- Invalid slugs return 404.
- Shared/query states create no sitemap explosion.
- Search Console observations guide the next expansion.

### Phase 7 — Launch verification

Tasks:
- Run focused correctness, integration, browser, accessibility, and production checks.
- Check responsive layouts, printing, sharing, and storage failure paths.
- Verify initial HTML, indexing policy, external links, asset licenses, and sources.
- Measure performance under representative mobile conditions.
- Publish once deployment is requested or authorized.

Acceptance:
- All launch criteria below pass.
- No placeholder modes, fabricated facts, console errors, or misleading buttons remain.
- Any unresolved limitations are documented with their user impact.

### Phase 8 — Growth and monetization experiments

After real usage:
- Evaluate worksheet demand before building payment infrastructure.
- Test reviewed downloadable packs.
- Consider unobtrusive advertising after policy/approval requirements are met.
- Add an optional wheel or daily challenge only when it supports a demonstrated use case.
- Measure useful actions, repeat visits, and search performance.
- Plan accounts/payments separately if evidence justifies a backend.

Do not delay the useful free launch for subscriptions, dashboards, or speculative integrations.

## 11. Verification strategy

Use tests to protect meaningful behavior rather than duplicate implementation details.

| Area | Required checks |
| --- | --- |
| Dataset | Unique IDs/slugs, valid coordinates, source/license fields, valid country references, meaningful capitals |
| Selection | Eligible-only picks, uniqueness, exhaustion, insufficient capacity, include/exclude conflicts, no-repeat persistence |
| URL state | Invalid/unknown values, removed IDs, bounded quantity, replay behavior |
| Persistence | Corrupt/old storage, unavailable storage, hydration write race, history cap |
| UI integration | Controlled filters, clear resets, reveal behavior, save/copy feedback |
| Browser flows | Generate → save → refresh; shared-link replay; keyboard use; worksheet print |
| SEO | Initial HTML, correct canonicals, sitemap exclusions, unique route metadata, actual 404 |
| Production | Type checking, linting, build, representative responsive/performance checks |

Selection tests inject a deterministic random source. Do not use flaky statistical tests that require random outcomes to meet arbitrary frequency thresholds.

Once appropriate checks pass, repeat them only when new edits or failures justify it.

## 12. Launch definition of done

- [ ] Country and capital workflows are complete.
- [ ] Tailwind is the sole component styling system.
- [ ] Shared colors, fonts, font sizes, spacing, maximum widths, and breakpoints are centralized in globals.css.
- [ ] Components consume semantic token utilities; shared values are not duplicated as arbitrary values.
- [ ] Shared primitives own repeated className patterns; unique component layouts remain local.
- [ ] Shared components are actually reused across tools.
- [ ] Selection behavior and dataset scope are documented.
- [ ] No-repeat, capacity, empty, and exhausted states work.
- [ ] History/favorites survive refresh and tolerate storage failure.
- [ ] Sharing and clipboard fallbacks work.
- [ ] Accessibility and responsive checks pass.
- [ ] Informative initial HTML and clean metadata are verified.
- [ ] Sitemap contains only published canonical pages.
- [ ] Sources, licenses, attribution, and correction contact are available.
- [ ] Production build passes without hydration warnings.
- [ ] No backend dependency is required for core behavior.
- [ ] SEO and earnings are presented honestly.

Phases 1–3 form the core product. Phase 4 adds the educational differentiator. City and SEO expansion follow without blocking a useful first release.

## 13. Instructions for the implementing coding assistant

Implement this plan incrementally in the local project. Start by inspecting the repository and mapping existing code to the plan. Preserve working features and reuse suitable components.

Use Next.js App Router, strict TypeScript, and Tailwind CSS v4 for every component. Define shared colors, font families, common font sizes/line heights, spacing, page gutters, maximum content widths, responsive breakpoints, radii, and shadows in src/app/globals.css through Tailwind theme tokens. Consume them with semantic Tailwind utilities inside component className. Keep layout composition and component-specific states local. Do not repeat shared arbitrary values, create page CSS files, or move component layouts into large global @apply rules. Keep pages and SEO content pre-renderable; introduce client boundaries only for browser interaction. Separate UI primitives, domain components, hooks, pure selection logic, datasets, and browser adapters. Prefer composition and typed variants over duplicated markup or large flag-driven components.

Complete one phase to a working acceptance gate before proceeding. Do not add accounts, a database, custom APIs, Server Actions, a global state library, or runtime geography APIs to the initial scope. Do not copy competitor content or create thin pages at scale. Report the completed phase, meaningful validation, and unresolved limitations. Never claim an unimplemented feature is available.

## 14. Primary references

Technical references checked while preparing this plan; re-check version-specific details during implementation.

- Next.js Server and Client Components: https://nextjs.org/docs/app/getting-started/server-and-client-components
- Next.js Metadata and OG Images: https://nextjs.org/docs/app/getting-started/metadata-and-og-images
- Tailwind CSS with Next.js: https://tailwindcss.com/docs/installation/framework-guides/nextjs
- Tailwind theme variables and token namespaces: https://tailwindcss.com/docs/theme
- React — You Might Not Need an Effect: https://react.dev/learn/you-might-not-need-an-effect
- Apple Materials guidance: https://developer.apple.com/design/human-interface-guidelines/materials
- Google people-first content: https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- Google SEO Starter Guide: https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- Google spam policies: https://developers.google.com/search/docs/essentials/spam-policies
- GeoNames data and licensing: https://www.geonames.org/export/

