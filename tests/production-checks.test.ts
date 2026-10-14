import { test } from "node:test";
import assert from "node:assert/strict";
import {
  inspectPageHtml,
  launchBlockers,
} from "../src/lib/seo/production-checks.ts";

const html =
  '<title>Example</title><meta name="description" content="Example description"><link rel="canonical" href="https://owner.site/about"><meta name="robots" content="noindex, follow"><a href="#main-content">Skip to content</a><main id="main-content"><h1>Example</h1><img src="flag.svg" alt=""></main>';
test("production inspection catches indexing, canonical, duplicate-ID and schema failures", () => {
  assert.deepEqual(
    inspectPageHtml(html, "/about", "https://owner.site", false).issues,
    [],
  );
  assert.deepEqual(
    inspectPageHtml(
      html.replace("https://owner.site/about", "https://owner.site"),
      "/",
      "https://owner.site",
      false,
    ).issues,
    [],
  );
  assert.ok(
    inspectPageHtml(
      html,
      "/privacy",
      "https://owner.site",
      false,
    ).issues.includes("Wrong canonical origin or path."),
  );
  assert.ok(
    inspectPageHtml(html, "/about", "https://owner.site", true).issues.includes(
      "Wrong indexing policy.",
    ),
  );
  assert.ok(
    inspectPageHtml(
      html + '<div id="main-content"></div>',
      "/about",
      "https://owner.site",
      false,
    ).issues.includes("Duplicate HTML IDs."),
  );
  assert.ok(
    inspectPageHtml(
      html + '<script type="application/ld+json">{bad}</script>',
      "/about",
      "https://owner.site",
      false,
    ).issues.includes("Invalid JSON-LD."),
  );
});
test("public readiness rejects missing or placeholder launch information", () => {
  assert.equal(launchBlockers({}).length, 5);
  const configured = {
    NEXT_PUBLIC_SITE_URL: "https://owner.site",
    GLOBEPICK_OPERATOR_NAME: "Site maintainer",
    GLOBEPICK_CORRECTIONS_URL: "mailto:corrections@owner.site",
    GLOBEPICK_HOSTING_PROVIDER: "Selected host",
    GLOBEPICK_POLICIES_REVIEWED: "true",
  };
  assert.deepEqual(launchBlockers(configured), []);
  for (const origin of [
    "http://owner.site",
    "https://example.com",
    "https://local.test",
    "https://owner.site/path",
    "https://user:secret@owner.site",
  ])
    assert.ok(
      launchBlockers({ ...configured, NEXT_PUBLIC_SITE_URL: origin }).length >
        0,
    );
  assert.ok(
    launchBlockers({
      ...configured,
      GLOBEPICK_CORRECTIONS_URL: "javascript:alert(1)",
    }).length > 0,
  );
});
