import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validateSavedState,
  readSavedState,
  writeSavedState,
  emptySavedState,
  storageKey,
} from "../src/lib/storage/saved-state.ts";
import {
  createShareUrl,
  parseSharedUrl,
  MAX_SHARE_URL_LENGTH,
} from "../src/lib/share/url-state.ts";
import { copyText, shareLink } from "../src/lib/share/browser.ts";
import {
  generatorReducer,
  initialState,
} from "../src/features/generator/lib/state.ts";
import { defaultFilters } from "../src/features/generator/lib/selection.ts";

const countryIds = new Set(["JP", "DE", "ZA"]);
const placeIds = new Set(["JP", "DE", "ZA"]);

test("storage preserves valid records, bounds history, and removes deleted dataset IDs", () => {
  const saved = {
    ...emptySavedState(),
    consumed: ["JP", "GONE", "JP"],
    favorites: ["DE", "GONE"],
    history: Array.from({ length: 120 }, (_, i) => ({ id: "JP", at: i + 1 })),
  };
  const validated = validateSavedState(
    JSON.stringify(saved),
    placeIds,
    countryIds,
  );
  assert.deepEqual(validated.saved.consumed, ["JP"]);
  assert.deepEqual(validated.saved.favorites, ["DE"]);
  assert.equal(validated.saved.history.length, 100);
  assert.ok(validated.warning);
  for (const raw of [
    "{broken",
    JSON.stringify({ version: 0 }),
    JSON.stringify(null),
    " ".repeat(150_001),
  ]) {
    const result = validateSavedState(raw, placeIds, countryIds);
    assert.deepEqual(result.saved, emptySavedState());
    assert.ok(result.warning);
  }
});

test("invalid stored settings use bounded defaults without accepting unknown countries", () => {
  const raw = JSON.stringify({
    ...emptySavedState(),
    filters: {
      continent: "Mars",
      quantity: 999,
      noRepeat: "false",
      guess: {},
      include: ["JP", "MISSING"],
      exclude: null,
    },
  });
  const { saved, warning } = validateSavedState(raw, placeIds, countryIds);
  assert.equal(saved.filters.continent, "all");
  assert.equal(saved.filters.quantity, 1);
  assert.equal(saved.filters.noRepeat, true);
  assert.deepEqual(saved.filters.include, ["JP"]);
  assert.deepEqual(saved.filters.exclude, []);
  assert.ok(warning);
});

test("unavailable and quota-limited storage does not throw or stop generation state", () => {
  const unavailable = () => {
    throw new Error("Access denied");
  };
  assert.ok(
    readSavedState(unavailable, "country", placeIds, countryIds).warning,
  );
  assert.ok(writeSavedState(unavailable, "country", emptySavedState()));
  const storage = {
    getItem: () => null,
    setItem: () => {
      throw new Error("Quota exceeded");
    },
    removeItem: () => {},
  };
  assert.ok(writeSavedState(() => storage, "country", emptySavedState()));
  assert.notEqual(storageKey("country"), storageKey("capital"));
});

test("share URL round-trips whitelisted filters and an exact result replay", () => {
  const filters = {
    ...defaultFilters,
    continent: "Asia" as const,
    include: ["JP"],
    exclude: ["DE"],
    quantity: 20,
    noRepeat: false,
  };
  const url = createShareUrl("https://example.com", "country", filters, ["JP"]);
  const parsed = parseSharedUrl(
    url + "&untrusted=ignored",
    "country",
    placeIds,
    countryIds,
  );
  assert.ok(parsed.ok && parsed.state);
  assert.deepEqual(parsed.state.filters, filters);
  assert.deepEqual(parsed.state.resultIds, ["JP"]);
  assert.equal(new URL(url).pathname, "/random-country-generator");
});

test("invalid share states are rejected, including wrong mode, IDs, repeated fields and excessive length", () => {
  const base = "https://example.com/random-country-generator?gp=1&m=country";
  for (const suffix of [
    "&n=0",
    "&n=21",
    "&n=1.5",
    "&n=1&n=2",
    "&region=Mars",
    "&nr=yes",
    "&p=GONE",
    "&p=JP,JP",
    "&in=JP&out=JP",
    "&m=capital",
    "&p=" + Array(21).fill("JP").join(","),
  ])
    assert.equal(
      parseSharedUrl(base + suffix, "country", placeIds, countryIds).ok,
      false,
      suffix,
    );
  assert.equal(
    parseSharedUrl(
      base + "&extra=" + "x".repeat(MAX_SHARE_URL_LENGTH),
      "country",
      placeIds,
      countryIds,
    ).ok,
    false,
  );
  assert.equal(
    parseSharedUrl(
      base.replace("gp=1", "gp=2"),
      "country",
      placeIds,
      countryIds,
    ).ok,
    false,
  );
  assert.equal(
    parseSharedUrl(
      base.replace("/random-country-generator", "/other"),
      "country",
      placeIds,
      countryIds,
    ).ok,
    false,
  );
});

test("hydrate and replay do not write initial empty data or consume history/pools", () => {
  const saved = {
    ...emptySavedState(),
    consumed: ["DE"],
    favorites: ["ZA"],
    history: [{ id: "DE", at: 1 }],
  };
  const state = generatorReducer(initialState(), {
    type: "hydrate",
    saved,
    warning: "",
    shared: { filters: defaultFilters, resultIds: ["JP"] },
    message: "replay",
  });
  assert.equal(state.hydrated, true);
  assert.equal(state.dirty, false);
  assert.equal(state.replay, true);
  assert.deepEqual(state.saved.consumed, ["DE"]);
  assert.deepEqual(state.saved.history, saved.history);
  const replay = generatorReducer(state, { type: "replay", ids: ["ZA"] });
  assert.deepEqual(replay.saved, state.saved);
  const changed = generatorReducer(state, {
    type: "filters",
    filters: { ...defaultFilters, continent: "Europe" },
  });
  assert.deepEqual(changed.saved.consumed, ["DE"]);
  const generated = generatorReducer(changed, {
    type: "generated",
    ids: ["JP"],
    at: 2,
    message: "generated",
  });
  assert.deepEqual(generated.saved.consumed, ["DE", "JP"]);
  assert.equal(generated.dirty, true);
  const cleared = generatorReducer(generated, { type: "clear-history" });
  assert.deepEqual(cleared.saved.consumed, ["DE", "JP"]);
  assert.deepEqual(cleared.saved.history, []);
});

test("copy and share provide selectable fallback text, and cancellation is handled", async () => {
  const denied = {
    writeText: async () => {
      throw new Error("Denied");
    },
  };
  assert.equal((await copyText("Japan", denied)).fallback, "Japan");
  assert.equal((await copyText("Japan")).fallback, "Japan");
  const writes: string[] = [];
  const clipboard = {
    writeText: async (text: string) => {
      writes.push(text);
    },
  };
  const success = await shareLink("https://example.com", undefined, clipboard);
  assert.equal(success.fallback, "");
  assert.equal(success.outcome, "copied");
  assert.match(success.message, /Link copied/);
  assert.deepEqual(writes, ["https://example.com"]);
  const nativeFail = await shareLink(
    "https://example.com",
    async () => {
      throw new Error("No share handler");
    },
    denied,
  );
  assert.equal(nativeFail.fallback, "https://example.com");
  assert.equal(nativeFail.outcome, "manual");
  assert.match(nativeFail.message, /Select and copy the link/);
  const cancelled = await shareLink(
    "https://example.com",
    async () => {
      const error = new Error();
      error.name = "AbortError";
      throw error;
    },
    clipboard,
  );
  assert.equal(cancelled.outcome, "cancelled");
  assert.equal(cancelled.fallback, "");
  assert.deepEqual(writes, ["https://example.com"]);
});

test("native share success does not also copy a link", async () => {
  const requests: ShareData[] = [];
  const feedback = await shareLink(
    "https://example.com/results",
    async (data) => {
      requests.push(data);
    },
    {
      writeText: async () =>
        assert.fail("Native sharing must not write the clipboard"),
    },
  );
  assert.equal(feedback.outcome, "shared");
  assert.equal(feedback.fallback, "");
  assert.equal(requests[0].url, "https://example.com/results");
});

test("failed native sharing falls back to copying the share link", async () => {
  const writes: string[] = [];
  const feedback = await shareLink(
    "https://example.com/results",
    async () => {
      throw new Error("Unsupported by device");
    },
    {
      writeText: async (value) => {
        writes.push(value);
      },
    },
  );
  assert.equal(feedback.outcome, "copied");
  assert.match(feedback.message, /Link copied/);
  assert.deepEqual(writes, ["https://example.com/results"]);
});
