# Curated SEO selection

Reviewed 14 October 2026. Search results are qualitative intent evidence, not search-volume estimates or ranking promises. Search Console registration and actual query/click observations are deferred with hosting, as requested by the project owner.

The candidate phrases “random African country generator”, “random Asian country generator”, and “random European country generator” surfaced focused random-picker pages and classroom/map-practice use cases. Result snippets and titles were inspected for the task users expect. No competitor text, facts, activities, layout, or country-count convention was copied.

Selected routes:

| Route                              | User task                       | Distinct content                                                                |
| ---------------------------------- | ------------------------------- | ------------------------------------------------------------------------------- |
| `/random-country-generator/africa` | Pick from Africa immediately    | Compare inland/coastal positions and map scales; a source-based country list    |
| `/random-country-generator/asia`   | Pick from Asia immediately      | Compare continent conventions and island/land-neighbor evidence                 |
| `/random-country-generator/europe` | Pick from Europe immediately    | Separate geographic grouping from organization membership using current sources |
| `/countries/japan`                 | Research Japan using evidence   | Compare maps, investigate a place beyond Tokyo, and make an evidence notebook   |
| `/countries/south-africa`          | Understand capital-role answers | A city/role/institution chart, map-scale comparison, and precise quiz wording   |

Regional controls render their preset in initial HTML. Hydration overrides stale stored continent/include/exclude filters while retaining quantity, history, favorites, and consumed IDs. Clear filters restores the region preset. Shared selections use the existing main country URL with the selected region and result IDs; they do not create extra sitemap entries.

Only the five curated routes are registered. The five pages use explicit static route files and shared content components. Next.js 16.4 with Cache Components does not support `dynamicParams`; a tested dynamic fallback rendered not-found content with HTTP 200 after streaming. Explicit static routes avoid that ambiguity and leave unknown URLs to the root 404 handler. Shared lookup guards still use `notFound()` for defensive validation.

Country guide facts checked against primary sources:

- [Study in Japan: Tokyo](https://www.studyinjapan.go.jp/en/why/47prefectures/kanto/tokyo.html), identifying Tokyo as Japan’s capital.
- [South African Government: provinces](https://www.gov.za/about-sa/south-africas-provinces), identifying Pretoria, Cape Town, and Bloemfontein and their roles.
- [Department of Justice: courts](https://www.justice.gov.za/about/sa-courts.html), distinguishing the Constitutional Court in Johannesburg from the Supreme Court of Appeal in Bloemfontein.

Other table facts follow the dated adapted country dataset and retain its disclosed review limits. Activities are original research questions, not exhaustive cultural descriptions. The old Japan example PDF URL returned 404 during this review and was replaced with the working official Tokyo page; its wording now distinguishes the checked capital role from other dataset facts.

Breadcrumb structured data follows visible navigation. Tool pages use factual WebApplication data with free access, without invented ratings, reviews, or organizations. Native JSON-LD scripts escape `<` to prevent embedded script delimiters. Canonicals and sitemaps use the configured origin; local previews remain noindex with no sitemap entries.

After deployment, verify the owned domain in Search Console, submit `/sitemap.xml`, inspect these five pages, and use observed queries and useful actions to decide whether another curated page is justified. Do not infer demand or publish hundreds of country variants from these candidate searches.
