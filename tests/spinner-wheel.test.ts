import { test } from "node:test";
import assert from "node:assert/strict";
import {
  landingRotation,
  sectorAtPointer,
  spinSnapshot,
} from "../src/features/spinner/lib/wheel.ts";
import { runWheelMotion } from "../src/features/spinner/lib/motion.ts";
import { readFileSync } from "node:fs";
import {
  placesForMode,
  defaultFilters,
} from "../src/features/generator/lib/selection.ts";
import { createShareUrl, parseSharedUrl } from "../src/lib/share/url-state.ts";
import type { Country } from "../src/features/generator/types.ts";

test("every sector lands under the fixed pointer across successive rotations", () => {
  for (const count of [1, 2, 3, 24, 25, 195]) {
    let previous = 0;
    for (let lap = 0; lap < 3; lap++)
      for (let index = 0; index < count; index++) {
        const rotation = landingRotation(index, count, previous);
        assert.equal(
          sectorAtPointer(rotation, count),
          index,
          `${count} sectors, winner ${index}`,
        );
        assert.ok(rotation >= previous + 1440);
        previous = rotation;
      }
  }
  assert.equal(sectorAtPointer(0, 0), -1);
  assert.throws(() => landingRotation(0, 0));
});

test("spin snapshots retain the accepted pool and share quantity one with the original filters", () => {
  const countries: Country[] = JSON.parse(
    readFileSync("src/data/countries/countries.json", "utf8"),
  );
  const pool = placesForMode(
    countries.filter((c) => ["JP", "PK"].includes(c.id)),
    "country",
  );
  const filters = {
    ...defaultFilters,
    quantity: 6,
    continent: "Asia" as const,
    include: ["JP", "PK"],
    exclude: ["DE"],
  };
  const snapshot = spinSnapshot(pool, pool[0], filters);
  pool.pop();
  filters.include.pop();
  filters.exclude.push("FR");
  assert.equal(snapshot.pool.length, 2);
  assert.deepEqual(snapshot.filters.include, ["JP", "PK"]);
  assert.deepEqual(snapshot.filters.exclude, ["DE"]);
  const url = createShareUrl(
    "https://example.org",
    "country",
    snapshot.filters,
    [snapshot.winner.id],
  );
  const parsed = parseSharedUrl(
    url,
    "country",
    new Set(countries.map((c) => c.id)),
    new Set(countries.map((c) => c.id)),
  );
  assert.ok(parsed.ok && parsed.state);
  assert.equal(new URL(url).pathname, "/random-country-generator");
  assert.equal(parsed.state.filters.quantity, 1);
  assert.deepEqual(parsed.state.resultIds, [snapshot.winner.id]);
  assert.deepEqual(parsed.state.filters, snapshot.filters);
});

test("normal, skip, rejection, hidden-route and reduced-motion completion settle exactly once", async () => {
  for (const scenario of [
    "normal",
    "skip",
    "reject",
    "hidden",
    "preference",
    "reduced",
    "missing",
    "throws",
    "timeout",
  ]) {
    let completed = 0;
    let cancelled = 0;
    let resolve!: () => void;
    let reject!: () => void;
    const finished = new Promise<void>((yes, no) => {
      resolve = yes;
      reject = no;
    });
    const mediaListeners = new Set<() => void>();
    const visibilityListeners = new Set<() => void>();
    const media = {
      matches: scenario === "reduced",
      addEventListener: (_: string, fn: () => void) => {
        mediaListeners.add(fn);
      },
      removeEventListener: (_: string, fn: () => void) => {
        mediaListeners.delete(fn);
      },
    };
    const visibility = {
      hidden: false,
      addEventListener: (_: string, fn: () => void) => {
        visibilityListeners.add(fn);
      },
      removeEventListener: (_: string, fn: () => void) => {
        visibilityListeners.delete(fn);
      },
    };
    let deadline: (() => void) | undefined;
    const stop = runWheelMotion({
      from: 0,
      to: 1800,
      reducedMotion: media,
      visibility,
      animate:
        scenario === "missing"
          ? undefined
          : () => {
              if (scenario === "throws") throw Error("Unavailable");
              return {
                finished,
                cancel: () => {
                  cancelled++;
                },
              };
            },
      settle: () => {
        completed++;
      },
      schedule: ((fn: () => void) => {
        deadline = fn;
        return 1;
      }) as unknown as typeof setTimeout,
      unschedule: (() => {
        deadline = undefined;
      }) as unknown as typeof clearTimeout,
    });
    if (scenario === "normal") resolve();
    if (scenario === "reject") reject();
    if (scenario === "hidden") {
      visibility.hidden = true;
      visibilityListeners.forEach((fn) => fn());
    }
    if (scenario === "preference") {
      media.matches = true;
      mediaListeners.forEach((fn) => fn());
    }
    if (scenario === "timeout") deadline?.();
    if (scenario === "skip") stop();
    await Promise.resolve();
    stop();
    stop();
    resolve();
    await Promise.resolve();
    assert.equal(completed, 1, scenario);
    assert.ok(cancelled <= 1, scenario);
    assert.equal(mediaListeners.size + visibilityListeners.size, 0, scenario);
    assert.equal(deadline, undefined, scenario);
  }
});
