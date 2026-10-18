import type { Place } from "../types";
import { CapitalRoleBadge } from "./capital-role-badge";

export function FactList({
  place,
  appearance = "plain",
}: {
  place: Place;
  appearance?: "plain" | "tiles";
}) {
  const country = place.country;
  const tiles = appearance === "tiles";
  const tileClass = tiles
    ? "min-w-0 rounded-control border border-border bg-surface p-3"
    : undefined;
  const listClass = tiles
    ? "grid grid-cols-2 gap-3"
    : "mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-2";
  if (place.kind === "city")
    return (
      <dl className={listClass}>
        {[
          { label: "Country", value: country.name },
          { label: "Continent", value: country.continent },
          {
            label: "Administrative region",
            value: place.city.adminRegion || "Not listed in this source",
          },
          {
            label: "Approximate coordinates",
            value: `${place.city.location.lat.toFixed(3)}°, ${place.city.location.lng.toFixed(3)}°`,
          },
        ].map((fact) => (
          <div key={fact.label} className={tileClass}>
            <dt className="text-xs text-muted">{fact.label}</dt>
            <dd className="mt-1 break-words text-sm">{fact.value}</dd>
          </div>
        ))}
      </dl>
    );
  return (
    <dl
      className={
        tiles
          ? "grid grid-cols-2 gap-3"
          : "mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-2"
      }
    >
      {place.kind === "country" && (
        <div className={tiles ? `${tileClass} col-span-2` : "sm:col-span-2"}>
          <dt className="text-xs text-muted">
            {country.capitals.length === 1 &&
            country.capitals[0].role === "Capital"
              ? "Capital"
              : "Capitals and government seats"}
          </dt>
          <dd className="mt-2 space-y-2 text-sm">
            {country.capitals.map((capital) => (
              <div
                key={capital.id}
                className="flex flex-wrap items-center gap-x-2 gap-y-1"
              >
                <span className="font-medium">{capital.name}</span>
                {(capital.role !== "Capital" ||
                  country.capitals.length > 1) && (
                  <CapitalRoleBadge role={capital.role} />
                )}
              </div>
            ))}
          </dd>
        </div>
      )}
      <div className={tileClass}>
        <dt className="text-xs text-muted">
          {country.languages.length === 1 ? "Language" : "Languages"}
        </dt>
        <dd className="mt-1 break-words text-sm">
          {country.languages.join(", ")}
        </dd>
      </div>
      <div className={tileClass}>
        <dt className="text-xs text-muted">
          {country.currencies.length === 1 ? "Currency" : "Currencies"}
        </dt>
        <dd className="mt-1 break-words text-sm">
          {country.currencies
            .map((currency) => `${currency.name} (${currency.code})`)
            .join(", ")}
        </dd>
      </div>
    </dl>
  );
}
