import { test } from "node:test";
import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import {
  readThemePreference,
  resolveTheme,
  saveThemePreference,
  themeBootstrapScript,
  themeStorageKey,
} from "../src/lib/theme.ts";
import {
  changeTheme,
  getThemeSnapshot,
  subscribeTheme,
} from "../src/lib/theme-browser.ts";

test("theme preferences validate saved values and otherwise follow the system", () => {
  assert.equal(resolveTheme("light", true), "light");
  assert.equal(resolveTheme("dark", false), "dark");
  assert.equal(resolveTheme(null, true), "dark");
  assert.equal(resolveTheme("invalid", false), "light");
  assert.equal(
    readThemePreference(() => ({ getItem: () => "dark" })),
    "dark",
  );
  assert.equal(
    readThemePreference(() => ({ getItem: () => "invalid" })),
    null,
  );
  assert.equal(
    readThemePreference(() => {
      throw new Error("Blocked");
    }),
    null,
  );
  const writes: [string, string][] = [];
  assert.equal(
    saveThemePreference(
      () => ({
        setItem: (key, value) => {
          writes.push([key, value]);
        },
      }),
      "dark",
    ),
    true,
  );
  assert.deepEqual(writes, [[themeStorageKey, "dark"]]);
  assert.equal(
    saveThemePreference(() => {
      throw new Error("Quota");
    }, "light"),
    false,
  );
});

test("the pre-paint script applies a validated preference even with unavailable storage", () => {
  for (const [stored, prefersDark, expected, preference] of [
    ["light", true, "light", "light"],
    ["dark", false, "dark", "dark"],
    [null, true, "dark", "system"],
    ["invalid", false, "light", "system"],
    ["blocked", true, "dark", "system"],
  ] as const) {
    const dataset: Record<string, string> = {};
    runInNewContext(themeBootstrapScript, {
      document: { documentElement: { dataset } },
      localStorage: {
        getItem: () => {
          if (stored === "blocked") throw new Error("Blocked");
          return stored;
        },
      },
      matchMedia: () => ({ matches: prefersDark }),
    });
    assert.deepEqual(dataset, { theme: expected, themePreference: preference });
  }
});

test("theme subscription follows system changes, syncs tabs, and remains usable when saving fails", () => {
  const previousDocument = Object.getOwnPropertyDescriptor(
    globalThis,
    "document",
  );
  const previousWindow = Object.getOwnPropertyDescriptor(globalThis, "window");
  const dataset = { theme: "light", themePreference: "system" };
  const media = Object.assign(new EventTarget(), { matches: false });
  let stored: string | null = null;
  let blocked = false;
  let notifications = 0;
  const fakeWindow = Object.assign(new EventTarget(), {
    matchMedia: () => media,
  });
  Object.defineProperty(fakeWindow, "localStorage", {
    get() {
      if (blocked) throw new Error("Blocked");
      return {
        getItem: () => stored,
        setItem: (_key: string, value: string) => {
          stored = value;
        },
      };
    },
  });
  function storageEvent(key: string | null = themeStorageKey) {
    fakeWindow.dispatchEvent(Object.assign(new Event("storage"), { key }));
  }
  let unsubscribe: (() => void) | undefined;
  try {
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: { documentElement: { dataset } },
    });
    Object.defineProperty(globalThis, "window", {
      configurable: true,
      value: fakeWindow,
    });
    unsubscribe = subscribeTheme(() => notifications++);
    media.matches = true;
    media.dispatchEvent(new Event("change"));
    assert.equal(getThemeSnapshot(), "dark");
    assert.equal(dataset.themePreference, "system");
    changeTheme("light");
    assert.equal(stored, "light");
    media.dispatchEvent(new Event("change"));
    assert.equal(getThemeSnapshot(), "light");
    stored = "dark";
    storageEvent();
    assert.equal(getThemeSnapshot(), "dark");
    stored = null;
    storageEvent(null);
    assert.equal(dataset.themePreference, "system");
    assert.equal(getThemeSnapshot(), "dark");
    blocked = true;
    changeTheme("light");
    assert.equal(getThemeSnapshot(), "light");
    unsubscribe();
    const before = notifications;
    storageEvent();
    media.dispatchEvent(new Event("change"));
    assert.equal(notifications, before);
  } finally {
    unsubscribe?.();
    if (previousDocument)
      Object.defineProperty(globalThis, "document", previousDocument);
    else Reflect.deleteProperty(globalThis, "document");
    if (previousWindow)
      Object.defineProperty(globalThis, "window", previousWindow);
    else Reflect.deleteProperty(globalThis, "window");
  }
});
