# Local launch verification

Checked 19 October 2026. Hosting is deferred by the owner. This is a local verification record, not a public-launch sign-off.

## Repeatable checks

```bash
npm test
npm run lint
npm run typecheck
npm run format:check
npm run build
npm run start -- --hostname 127.0.0.1 --port 43075
# In another terminal, with the same environment used for the build:
npm run verify:production -- http://127.0.0.1:43075 /tmp/globepick-audit.json
npm run check:launch
```

The HTTP verifier reads the shared published-page registry. It checks successful pages, one H1, metadata, indexing policy, canonical origin/path, duplicate HTML IDs, skip-link destination, image alt attributes, parseable picker schemas, five genuine 404 responses, sixteen data/brand/license/pack assets, sitemap scope, and query canonicals. It also detects the first city-record ID leaking into other pages. This is a focused check, not a general crawler or complete accessibility audit.

The launch check loads `.env*` with the installed Next environment loader. It rejects missing or example public origins, maintainer/contact details, host selection, and policy review. These fields do not automatically write the public About or policy pages; update and review that visible content before setting the review flag. Passing configuration checks does not verify domain ownership, deployment, legal adequacy, or Search Console registration.

## Results

Updated for the starter packs, generator/navigation fixes, light/dark styling, and the homepage spinner. See [spinner verification](homepage-spinner.md) for its focused checks.

- 47 domain, storage, sharing, schema, production-inspection, theme, and contrast tests pass. Country, city, and starter-pack validators, lint, type checking, formatting, and production compilation pass.
- Thirteen published content pages return 200; five unreviewed paths return actual 404. Sixteen sampled assets load, including byte-identical reviewed PDFs. Local metadata remains noindex and the local sitemap has zero entries.
- Gzip-equivalent HTML is about 34–36 KB for country/capital/regional tools and 212 KB for city mode. The verifier budgets 120 KB per normal page and 250 KB for city mode. These cover HTML including serialized component data, not all JavaScript, fonts, images, or a network waterfall.
- Browser acceptance covers generation, capacity, no repeats, guess/reveal, save/refresh, replay, visible copy/share feedback, dialog focus return, missing city coverage, and worksheet preview. See `implementation-progress.md` for exercised flows and adapter failure tests.
- City-page controls have accessible labels; the keyboard-operated mobile menu opens with Enter, closes with Escape, and restores focus. The skip link moves focus to the main content. Phone, tablet, and desktop checks found no horizontal overflow; observed production logs contain no warnings/errors.
- Twelve semantic small-text color pairs in each light/dark palette meet 4.5:1 using the WCAG contrast formula. This does not certify every composited, disabled, focus, or assistive-technology state. Standalone related-learning links and the theme toggle have the shared 44px minimum touch size.
- The rendered theme follows the initial system preference, preserves a manual choice after reload, and syncs between open tabs. Dark generators and share dialogs render with the semantic palette. White worksheet previews fit A4/Letter layouts; screen-only dark overrides preserve light print colors. Phone/tablet/desktop checks show no horizontal overflow or observed warning/error logs.

## Pending before public launch

1. Supply the actual HTTPS origin, public maintainer identity, corrections contact, and hosting provider; update About/privacy/terms and rebuild.
2. Exercise printable worksheets through actual A4/Letter browser PDF drivers and representative physical printers. Screen paper measurements passed, but driver pagination has not been tested.
3. Run a representative throttled mobile performance audit and real-device/assistive-technology checks. Available browser inspection provides DOM/layout checks but no navigation timing or CPU/network throttling. Local HTTP timings are not LCP, CLS, or INP measurements. Collect 75th-percentile field observations after deployment before assessing the product targets.
4. Deploy when requested, verify the owned domain in Search Console, submit the curated sitemap, and inspect real coverage/search observations.

No analytics, advertisements, payment infrastructure, accounts, or public deployment were introduced for these checks.
