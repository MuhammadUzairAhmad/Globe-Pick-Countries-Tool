import type { City, Country, Filters, Mode, Place } from "../types";
import { citySource, cityReviewed } from "./city-source.ts";

export const defaultFilters: Filters = {
  continent: "all",
  include: [],
  exclude: [],
  quantity: 1,
  noRepeat: true,
  guess: false,
};

export function placesForMode(
  countries: readonly Country[],
  mode: Mode,
  cities: readonly City[] = [],
): Place[] {
  if (mode === "city") {
    const byCountry = new Map(
      countries.map((country) => [country.id, country]),
    );
    return cities.flatMap((city): Place[] => {
      const country = byCountry.get(city.countryId);
      return country
        ? [{ kind: "city", id: city.id, countryId: country.id, country, city }]
        : [];
    });
  }
  return countries.flatMap((country): Place[] =>
    mode === "country"
      ? [{ kind: "country", id: country.id, countryId: country.id, country }]
      : country.capitals.map((capital) => ({
          kind: "capital",
          id: `${country.id}:${capital.id}`,
          countryId: country.id,
          country,
          capital,
        })),
  );
}

export function eligiblePlaces(
  places: readonly Place[],
  filters: Filters,
  consumed: readonly string[] = [],
): Place[] {
  const used = new Set(consumed);
  return places.filter(
    (place) =>
      (filters.continent === "all" ||
        place.country.continent === filters.continent) &&
      (!filters.include.length || filters.include.includes(place.countryId)) &&
      !filters.exclude.includes(place.countryId) &&
      (!filters.noRepeat || !used.has(place.id)),
  );
}

// Rejection sampling avoids modulo bias. Randomness is invoked only in handlers.
export function cryptoRandomInt(bound: number): number {
  if (!Number.isSafeInteger(bound) || bound < 1 || bound > 2 ** 32)
    throw new Error("Invalid random bound.");
  const ceiling = Math.floor(2 ** 32 / bound) * bound;
  const buffer = new Uint32Array(1);
  let value: number;
  do {
    globalThis.crypto.getRandomValues(buffer);
    value = buffer[0];
  } while (value >= ceiling);
  return value % bound;
}

export type SelectionResult =
  | { ok: true; places: Place[] }
  | { ok: false; code: "quantity" | "empty" | "capacity"; message: string };

export function selectPlaces(
  pool: readonly Place[],
  quantity: number,
  randomInt: (bound: number) => number = cryptoRandomInt,
): SelectionResult {
  if (!Number.isInteger(quantity) || quantity < 1 || quantity > 20)
    return {
      ok: false,
      code: "quantity",
      message: "Choose a whole number from 1 to 20.",
    };
  if (!pool.length)
    return {
      ok: false,
      code: "empty",
      message:
        "No places are available. Change your filters or reset picked places.",
    };
  if (quantity > pool.length)
    return {
      ok: false,
      code: "capacity",
      message: `Only ${pool.length} places remain. Reduce the quantity or choose all remaining.`,
    };
  const shuffled = [...pool];
  for (let i = 0; i < quantity; i++) {
    const offset = randomInt(shuffled.length - i);
    if (
      !Number.isInteger(offset) ||
      offset < 0 ||
      offset >= shuffled.length - i
    )
      throw new Error("Random source returned an invalid index.");
    const chosen = i + offset;
    [shuffled[i], shuffled[chosen]] = [shuffled[chosen], shuffled[i]];
  }
  return { ok: true, places: shuffled.slice(0, quantity) };
}

export function placeName(place: Place): string {
  return place.kind === "country"
    ? place.country.name
    : place.kind === "city"
      ? `${place.city.name}, ${place.city.adminRegion ? `${place.city.adminRegion}, ` : ""}${place.country.name}`
      : `${place.capital.name}, ${place.country.name}`;
}

export function formatPlace(place: Place): string {
  const country = place.country;
  if (place.kind === "city")
    return `${placeName(place)}\nContinent: ${country.continent}\nApproximate city/town point: ${place.city.location.lat}, ${place.city.location.lng}\nData: Natural Earth (public domain); reviewed ${cityReviewed}.\nSource: ${citySource}`;
  const capital =
    place.kind === "capital"
      ? `${place.capital.name} (${place.capital.role})`
      : country.capitals
          .map((entry) => `${entry.name} (${entry.role})`)
          .join("; ");
  const notes =
    place.kind === "capital"
      ? place.capital.note
      : country.capitals
          .filter((entry) => entry.note)
          .map((entry) => `${entry.name}: ${entry.note}`)
          .join("\n");
  const source =
    place.kind === "capital" ? place.capital.source : country.sources.geography;
  return `${place.kind === "country" ? country.name : placeName(place)}\n${country.continent}\nCapital or government seat: ${capital}\nLanguages: ${country.languages.join(", ")}\nCurrencies: ${country.currencies.map((c) => `${c.name} (${c.code})`).join(", ")}${notes ? `\n${notes}` : ""}${country.note ? `\n${country.note}` : ""}\nData: adapted GlobePick / mledoze countries (ODbL 1.0); reviewed ${country.reviewed}.\nSource: ${source}`;
}
