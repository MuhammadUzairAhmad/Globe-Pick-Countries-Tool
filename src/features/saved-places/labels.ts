import type { Place } from "../generator/types.ts";
import { placeName } from "../generator/lib/selection.ts";

export function savedPlaceLabel(place: Place, answerHidden = false): string {
  if (place.kind === "capital")
    return answerHidden
      ? `${place.country.name}, ${place.capital.role}, answer hidden`
      : `${placeName(place)}, ${place.capital.role}`;
  return placeName(place);
}
