# Styling conventions

Use Tailwind utilities in JSX for component styling. `src/app/globals.css` is the single shared stylesheet and owns:

- Light and dark semantic colors, type sizes, spacing, radii, and shadows.
- Body font, text color, and background; common heading weights and sizes; paragraph wrapping.
- Shared focus outlines, text selection, and paper rules.

Keep layout, spacing, responsive changes, and interaction states in `className`. Use conditional utilities for selected states. Override a base heading size inline when its context needs a smaller label.

```tsx
<section className="mx-auto max-w-reading px-gutter md:px-gutter-md">
  <h2 className="mb-4">Choose a place</h2>
  <button
    type="button"
    aria-pressed={selected}
    className={`rounded-control px-4 py-3 ${
      selected
        ? "bg-brand text-on-brand hover:bg-brand-strong"
        : "bg-surface text-foreground hover:bg-brand-soft"
    }`}
  >
    Africa
  </button>
</section>
```

Reuse components for repeated styling. `src/components/ui/button.tsx` owns common button sizing and primary/secondary variants; use `<Button variant="secondary">` for that pattern. Avoid adding component selectors such as `.card-active` or `.button:hover` to the global stylesheet. Avoid assembling incomplete utility strings dynamically because Tailwind needs complete class names.

Utilities such as `bg-surface`, `text-muted`, and `border-border` come from semantic `@theme` tokens. They switch palettes automatically. Use `text-on-brand` over a primary button's `bg-brand`; the surface color is a different role. Reserve `dark:` for differences beyond palette substitution, such as the toggle icon or dialog backdrop. Worksheets explicitly use white paper and black text.

## Theme behavior

The header toggle switches light/dark mode. With no valid saved choice, the app follows the system preference and subsequent system changes. A manual choice is stored separately under `globepick:theme` and syncs to other open tabs. Clearing site storage restores system preference. Blocked storage still permits switching for the current visit.

`src/lib/theme.ts` defines validated preferences and a static head script that applies the palette before paint. `src/lib/theme-browser.ts` handles changes and subscriptions; `ThemeToggle` reads them through `useSyncExternalStore`. This keeps pages statically rendered without cookies or a theme package. Root hydration suppression is limited to the attributes changed by that head script.

Dark palette overrides apply only to screen media. Printed worksheets use the light palette; downloadable PDFs retain their reviewed colors. Changing the shared light palette requires regenerating and reviewing the starter PDFs, as enforced by data validation.

Theme tests cover system/saved preferences, startup, tab synchronization, and storage failures. Contrast tests check twelve semantic text/background pairs in each palette. Browser checks cover responsive layout, rendered controls/dialogs, and paper previews; native printer and assistive-technology checks remain part of launch verification.

## Dark palette studio

Open `/theme-showcase` to compare Forest, Moss, Lagoon, Graphite, Plum, and Espresso. The route is excluded from public navigation and the sitemap and always has noindex metadata. Each palette is scoped with `data-preview-theme` inside the page; switching previews does not write the saved site theme or generator data. Shared country cards, fields, buttons, and atlas artwork demonstrate the palette with Japan, South Africa, and Brazil. Preview country/fact/save controls use page memory only.

Palette tokens remain in `globals.css`; the studio uses inline Tailwind for its layout and states. Contrast checks cover all six preview palettes alongside the existing light/dark colors. A final site palette can be chosen after comparing these options.

References: [Tailwind theme variables](https://tailwindcss.com/docs/theme), [base styles](https://tailwindcss.com/docs/adding-custom-styles), and [manual dark mode](https://tailwindcss.com/docs/dark-mode). The installed Next.js guide is `node_modules/next/dist/docs/01-app/02-guides/preventing-flash-before-hydration.md`.
