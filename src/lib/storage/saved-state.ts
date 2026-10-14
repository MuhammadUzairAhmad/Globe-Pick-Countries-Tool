import type {
  Filters,
  Mode,
  SavedState,
} from "../../features/generator/types.ts";
import { continents } from "../../features/generator/types.ts";
import { defaultFilters } from "../../features/generator/lib/selection.ts";

export const storageKey = (mode: Mode) => `globepick:v1:${mode}`;
export const emptySavedState = (): SavedState => ({
  version: 1,
  filters: { ...defaultFilters, include: [], exclude: [] },
  consumed: [],
  history: [],
  favorites: [],
});
type StorageAccess = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type ReadResult = { saved: SavedState; warning: string };

export function validateSavedState(
  raw: string | null,
  placeIds: ReadonlySet<string>,
  countryIds: ReadonlySet<string>,
): ReadResult {
  const empty = emptySavedState();
  if (raw === null) return { saved: empty, warning: "" };
  try {
    const maxLength = Math.max(
      150_000,
      Math.min(1_000_000, placeIds.size * 64 + 20_000),
    );
    if (raw.length > maxLength) throw new Error("Storage too large");
    const parsed: unknown = JSON.parse(raw);
    if (
      !parsed ||
      typeof parsed !== "object" ||
      !("version" in parsed) ||
      parsed.version !== 1
    )
      throw new Error("Unsupported version");
    const data = parsed as Record<string, unknown>;
    let repaired = false;
    function ids(
      value: unknown,
      known: ReadonlySet<string>,
      limit = known.size,
    ): string[] {
      if (!Array.isArray(value)) {
        repaired = true;
        return [];
      }
      const clean = [
        ...new Set(
          value.filter(
            (id): id is string => typeof id === "string" && known.has(id),
          ),
        ),
      ].slice(0, limit);
      if (clean.length !== value.length) repaired = true;
      return clean;
    }
    const input =
      data.filters && typeof data.filters === "object"
        ? (data.filters as Record<string, unknown>)
        : {};
    const continent =
      input.continent === "all" ||
      continents.includes(
        input.continent as Filters["continent"] & (typeof continents)[number],
      )
        ? (input.continent as Filters["continent"])
        : "all";
    const quantity =
      typeof input.quantity === "number" &&
      Number.isInteger(input.quantity) &&
      input.quantity >= 1 &&
      input.quantity <= 20
        ? input.quantity
        : 1;
    if (
      continent !== input.continent ||
      quantity !== input.quantity ||
      typeof input.noRepeat !== "boolean" ||
      typeof input.guess !== "boolean"
    )
      repaired = true;
    const filters: Filters = {
      continent,
      quantity,
      include: ids(input.include, countryIds),
      exclude: ids(input.exclude, countryIds),
      noRepeat: typeof input.noRepeat === "boolean" ? input.noRepeat : true,
      guess: typeof input.guess === "boolean" ? input.guess : false,
    };
    const history = Array.isArray(data.history)
      ? data.history
          .filter(
            (entry): entry is { id: string; at: number } =>
              !!entry &&
              typeof entry === "object" &&
              typeof entry.id === "string" &&
              placeIds.has(entry.id) &&
              Number.isSafeInteger(entry.at) &&
              entry.at > 0,
          )
          .slice(0, 100)
          .map(({ id, at }) => ({ id, at }))
      : [];
    if (!Array.isArray(data.history) || history.length !== data.history.length)
      repaired = true;
    return {
      saved: {
        version: 1,
        filters,
        history,
        consumed: ids(data.consumed, placeIds),
        favorites: ids(data.favorites, placeIds),
      },
      warning: repaired
        ? "Some saved data was invalid or belongs to an older dataset and was ignored."
        : "",
    };
  } catch {
    return {
      saved: empty,
      warning:
        "Saved data could not be read. You can keep generating; your next change will save a fresh local record.",
    };
  }
}

export function readSavedState(
  access: () => StorageAccess,
  mode: Mode,
  placeIds: ReadonlySet<string>,
  countryIds: ReadonlySet<string>,
): ReadResult {
  try {
    return validateSavedState(
      access().getItem(storageKey(mode)),
      placeIds,
      countryIds,
    );
  } catch {
    return {
      saved: emptySavedState(),
      warning:
        "Browser storage is unavailable. Generation still works; changes may be lost when you leave.",
    };
  }
}

export function writeSavedState(
  access: () => StorageAccess,
  mode: Mode,
  state: SavedState,
): string {
  try {
    const quantity =
      Number.isInteger(state.filters.quantity) &&
      state.filters.quantity >= 1 &&
      state.filters.quantity <= 20
        ? state.filters.quantity
        : 1;
    access().setItem(
      storageKey(mode),
      JSON.stringify({ ...state, filters: { ...state.filters, quantity } }),
    );
    return "";
  } catch {
    return "Changes could not be saved in this browser. Generation still works; copy anything you want to keep.";
  }
}
