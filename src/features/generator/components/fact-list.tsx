import type { Place } from "../types";
import { CapitalRoleBadge } from "./capital-role-badge";

export function FactList({ place }: { place: Place }) {
  const country = place.country;
  return (
    <dl className="mt-5 grid gap-4 border-t border-border pt-4 sm:grid-cols-2">
      {place.kind === "country" && (
        <div className="sm:col-span-2">
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
      <div>
        <dt className="text-xs text-muted">
          {country.languages.length === 1 ? "Language" : "Languages"}
        </dt>
        <dd className="mt-1 text-sm">{country.languages.join(", ")}</dd>
      </div>
      <div>
        <dt className="text-xs text-muted">
          {country.currencies.length === 1 ? "Currency" : "Currencies"}
        </dt>
        <dd className="mt-1 text-sm">
          {country.currencies
            .map((currency) => `${currency.name} (${currency.code})`)
            .join(", ")}
        </dd>
      </div>
    </dl>
  );
}
