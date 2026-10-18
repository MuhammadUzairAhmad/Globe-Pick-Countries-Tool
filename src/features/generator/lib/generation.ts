import { placeName, selectPlaces, cryptoRandomInt } from "./selection.ts";
import type { Mode, Place } from "../types.ts";

// One accepted selection supplies both the returned places and the reducer event.
// Callers may animate these places, but never need to draw again on completion.
export function prepareGeneration(
  pool: readonly Place[],
  quantity: number,
  mode: Mode,
  guess: boolean,
  randomInt = cryptoRandomInt,
  at = Date.now(),
) {
  const selected = selectPlaces(pool, quantity, randomInt);
  if (!selected.ok) return selected;
  const names = selected.places
    .slice(0, 3)
    .map((place) =>
      guess && mode === "capital" ? place.country.name : placeName(place),
    )
    .join(", ");
  const count = selected.places.length;
  const label =
    mode === "country"
      ? count === 1
        ? "country"
        : "countries"
      : mode === "city"
        ? count === 1
          ? "city or town"
          : "cities and towns"
        : guess
          ? count === 1
            ? "capital question"
            : "capital questions"
          : count === 1
            ? "capital or government seat"
            : "capitals and government seats";
  return {
    ...selected,
    action: {
      type: "generated" as const,
      ids: selected.places.map((place) => place.id),
      at,
      message: `Picked ${count} ${label}: ${names}${count > 3 ? ", and more" : ""}.`,
    },
  };
}
