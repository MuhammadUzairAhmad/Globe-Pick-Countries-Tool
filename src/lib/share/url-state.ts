import {
  continents,
  type Filters,
  type Mode,
} from "../../features/generator/types.ts";
import { defaultFilters } from "../../features/generator/lib/selection.ts";

export const MAX_SHARE_URL_LENGTH = 6000;
export const toolPath = (mode: Mode) => `/random-${mode}-generator`;
export type SharedState = { filters: Filters; resultIds: string[] };
export type SharedResult =
  { ok: true; state: SharedState | null } | { ok: false; message: string };

export function parseSharedUrl(
  href: string,
  mode: Mode,
  placeIds: ReadonlySet<string>,
  countryIds: ReadonlySet<string>,
): SharedResult {
  try {
    if (href.length > MAX_SHARE_URL_LENGTH)
      throw new Error("Link is too long.");
    const url = new URL(href);
    if (!url.searchParams.has("gp")) return { ok: true, state: null };
    const params = url.searchParams;
    for (const key of [
      "gp",
      "m",
      "region",
      "n",
      "nr",
      "quiz",
      "in",
      "out",
      "p",
    ])
      if (params.getAll(key).length > 1)
        throw new Error("Duplicate link fields.");
    if (
      params.get("gp") !== "1" ||
      params.get("m") !== mode ||
      url.pathname !== toolPath(mode)
    )
      throw new Error("Unsupported link version or tool mode.");
    const region = params.get("region") ?? "all";
    if (
      region !== "all" &&
      !continents.includes(region as (typeof continents)[number])
    )
      throw new Error("Unknown continent.");
    const rawQuantity = params.get("n") ?? "1";
    if (!/^(?:[1-9]|1[0-9]|20)$/.test(rawQuantity))
      throw new Error("Invalid quantity.");
    function flag(key: string, fallback: boolean): boolean {
      const value = params.get(key);
      if (value === null) return fallback;
      if (value !== "0" && value !== "1") throw new Error("Invalid option.");
      return value === "1";
    }
    function ids(
      key: string,
      known: ReadonlySet<string>,
      max: number,
    ): string[] {
      const value = params.get(key);
      if (!value) return [];
      const entries = value.split(",");
      if (
        entries.length > max ||
        new Set(entries).size !== entries.length ||
        entries.some((id) => !known.has(id))
      )
        throw new Error("Unknown, repeated, or too many place IDs.");
      return entries;
    }
    const include = ids("in", countryIds, countryIds.size);
    const exclude = ids("out", countryIds, countryIds.size);
    if (include.some((id) => exclude.includes(id)))
      throw new Error("Conflicting country choices.");
    return {
      ok: true,
      state: {
        filters: {
          continent: region as Filters["continent"],
          quantity: Number(rawQuantity),
          noRepeat: flag("nr", true),
          guess: flag("quiz", false),
          include,
          exclude,
        },
        resultIds: ids("p", placeIds, 20),
      },
    };
  } catch (error) {
    return {
      ok: false,
      message: `Shared link ignored: ${error instanceof Error ? error.message : "invalid link."}`,
    };
  }
}

export function createShareUrl(
  origin: string,
  mode: Mode,
  filters: Filters = defaultFilters,
  resultIds: readonly string[] = [],
): string {
  if (resultIds.length > 20) throw new Error("Share at most 20 results.");
  const url = new URL(toolPath(mode), origin);
  url.search = new URLSearchParams({
    gp: "1",
    m: mode,
    region: filters.continent,
    n: String(
      Number.isInteger(filters.quantity) &&
        filters.quantity >= 1 &&
        filters.quantity <= 20
        ? filters.quantity
        : 1,
    ),
    nr: filters.noRepeat ? "1" : "0",
    quiz: filters.guess ? "1" : "0",
    ...(filters.include.length ? { in: filters.include.join(",") } : {}),
    ...(filters.exclude.length ? { out: filters.exclude.join(",") } : {}),
    ...(resultIds.length ? { p: resultIds.join(",") } : {}),
  }).toString();
  if (url.href.length > MAX_SHARE_URL_LENGTH)
    throw new Error(
      "This selection is too large to share as a link. Reduce the country list.",
    );
  return url.href;
}
