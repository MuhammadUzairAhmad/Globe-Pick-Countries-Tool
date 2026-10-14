import type { Country } from "../types";

export function LocationMap({ country }: { country: Country }) {
  return (
    <figure className="mt-4">
      <svg
        viewBox="0 0 360 180"
        role="img"
        aria-label={`Approximate location of ${country.name}`}
        className="w-full rounded-control border border-border bg-page"
      >
        <image href="/maps/world-land.svg" width="360" height="180" />
        <circle
          cx={country.location.lng + 180}
          cy={90 - country.location.lat}
          r="5"
          className="fill-brand stroke-surface"
          strokeWidth="2"
        />
      </svg>
      <figcaption className="mt-2 text-xs text-muted">
        Approximate country center: {country.location.lat.toFixed(2)}°,{" "}
        {country.location.lng.toFixed(2)}°. Not a boundary or capital location.
        Land outline: Natural Earth (public domain).{" "}
        <a
          href={`https://www.openstreetmap.org/?mlat=${country.location.lat}&mlon=${country.location.lng}#map=4/${country.location.lat}/${country.location.lng}`}
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
