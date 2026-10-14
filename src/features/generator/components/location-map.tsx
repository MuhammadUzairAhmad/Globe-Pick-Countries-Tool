import type { Place } from "../types";

export function LocationMap({ place }: { place: Place }) {
  const location =
    place.kind === "city" ? place.city.location : place.country.location;
  const name =
    place.kind === "city"
      ? `${place.city.name}, ${place.country.name}`
      : place.country.name;
  return (
    <figure className="mt-4">
      <svg
        viewBox="0 0 360 180"
        role="img"
        aria-label={`Approximate location of ${name}`}
        className="w-full rounded-control border border-border bg-page"
      >
        <image href="/maps/world-land.svg" width="360" height="180" />
        <circle
          cx={location.lng + 180}
          cy={90 - location.lat}
          r="5"
          className="fill-brand stroke-surface"
          strokeWidth="2"
        />
      </svg>
      <figcaption className="mt-2 text-xs text-muted">
        {place.kind === "city"
          ? "Approximate city/town point"
          : "Approximate country center"}
        : {location.lat.toFixed(2)}°, {location.lng.toFixed(2)}°. This marker
        does not show a boundary. Land outline: Natural Earth (public domain).{" "}
        <a
          href={`https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lng}#map=${place.kind === "city" ? 8 : 4}/${location.lat}/${location.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand underline underline-offset-4"
        >
          Open map (new tab)
        </a>
      </figcaption>
    </figure>
  );
}
