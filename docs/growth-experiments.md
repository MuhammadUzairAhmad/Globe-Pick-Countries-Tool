# Phase 8: starter packs and later experiments

Prepared 14 October 2026. Hosting is deferred. No visitors, worksheet demand, search traffic, advertising approval, or revenue have been observed by this task.

## Available locally

The Country Project Generator now offers a free Japan/South Africa country-profile pack in A4 and US Letter. Each is four pages: two student worksheets, then two teacher sheets. The teaching focus is map location, single/multiple capital roles, language use, currencies, and source comparison. Questions reuse the existing reviewed project model; there is no second prompt library or runtime PDF dependency.

Both PDFs have been rendered and all eight pages visually inspected. Checks confirm page count, paper dimensions, nonempty extracted text, source links, and an attached DejaVu font notice. Reference facts remain a dated community snapshot; the PDF explains that these are neither exhaustive language lists nor a complete independent factual audit. Physical printer testing and assistive-technology reading order/tagging remain unverified. The normal project generator remains the flexible HTML option.

The manifest identifies countries, review date, PDF sizes/digests, shared palette, and source/question digest. Build validation fails if prompts, reference facts, palette, or downloadable bytes drift from the reviewed artifacts. Regeneration is an editorial operation, not an automatic build step.

## Rebuild offline

Use Node 22.18+, Python with `reportlab` and `pypdf`, DejaVu Sans regular/bold TTF files, and Poppler for review.

```bash
mkdir -p tmp/pdfs
node --experimental-strip-types scripts/export-starter-pack.ts tmp/pdfs/country-profile-source.json
python3 scripts/generate-starter-packs.py tmp/pdfs/country-profile-source.json /usr/share/fonts/truetype/dejavu
pdftoppm -png output/pdf/globepick-country-profile-a4.pdf tmp/pdfs/a4
pdftoppm -png output/pdf/globepick-country-profile-letter.pdf tmp/pdfs/letter
# Inspect every page before accepting a new artifact.
npx prettier --write src/data/worksheet-packs/manifest.json public/packs/manifest.json
npm run validate:data
```

On this workstation the bundled Python is `/home/uzairahmad/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3`. Other machines can use any suitable local Python environment. Intermediates and `output/pdf/` are ignored; distributable copies and matching manifests live in `public/packs/` and `src/data/worksheet-packs/`. Typeface notices are attached inside the PDFs and published under `public/licenses/worksheet-fonts-DejaVu.txt`. Questions/teaching notes may be copied and adapted for classroom use; database attribution and ODbL source information accompany the references.

## Decisions after real usage

| Question                             | Small experiment after hosting                                                                                                                               | Evidence to review                                                                                                 | Decision boundary                                                                                                 |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Do teachers use ready-made packs?    | Invite a small voluntary teacher group to try this free pack and the configurable generator. Review after four weeks, extending if participation is too low. | Completed classroom use, layout problems, time saved, and topic requests. A download alone does not establish use. | Fix usability first. Build another reviewed topic only when repeated requests support it.                         |
| Which learning pages help visitors?  | Register the actual domain in Search Console and compare query intent with curated pages.                                                                    | Impressions, relevant queries, coverage problems, and voluntary feedback about completed tasks.                    | Improve useful pages; do not mass-produce thin country/filter pages.                                              |
| Does repeat use justify a challenge? | Ask returning users which activity they repeat and why.                                                                                                      | Repeat quiz/classroom tasks and an explicit need for a daily or wheel format.                                      | Prototype one optional format only when it improves that task and respects reduced motion.                        |
| Is monetization appropriate?         | Review actual demand, costs, hosting policies, and provider requirements.                                                                                    | Evidence that payment or advertising supports the product without obstructing controls or learners.                | Advertising approval and account/payment/backend planning are separate later work. No integrations are added now. |

These are hypotheses and proposed observation windows, not measured results or traffic/revenue forecasts. No analytics script, tracking cookie, user identifier, teacher survey submission, or outreach is included.

If measurement is authorized later, distinguish requests from outcomes: a successful generation, copied share link, print-dialog request, and PDF request are different events; none proves learning or classroom use. Aggregate host request logs can include personal data and repeated/bot traffic. Review the host and privacy policy before collecting/retaining them. Search Console and voluntary teacher feedback can guide the first decision without inventing application analytics.
