import { useState, type ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { FactList } from "./fact-list";
import { PlaceIdentity } from "./place-identity";
import { LocationMap } from "./location-map";
import type { Place } from "../types";
import { CapitalRoleBadge } from "./capital-role-badge";

export function PlaceResultCard({
  place,
  actions,
  learning,
  answerHidden = false,
}: {
  place: Place;
  actions?: ReactNode;
  learning?: ReactNode;
  answerHidden?: boolean;
}) {
  const country = place.country;
  const [mapOpen, setMapOpen] = useState(false);
  return (
    <Card>
      <PlaceIdentity
        country={country}
        title={country.name}
        subtitle={country.continent}
        heading={place.kind === "country"}
      />
      {learning}
      {!answerHidden && place.kind === "capital" && (
        <div className="mt-4">
          <h3 className="text-card-title font-semibold">
            {place.capital.name}
          </h3>
          <div className="mt-2">
            <CapitalRoleBadge role={place.capital.role} />
          </div>
          {place.capital.note && (
            <p className="mt-2 text-sm text-muted">{place.capital.note}</p>
          )}
        </div>
      )}
      {!answerHidden && (
        <>
          <FactList place={place} />
          {country.note && (
            <p className="mt-4 rounded-control bg-brand-soft p-3 text-sm text-muted">
              {country.note}
            </p>
          )}
          <details
            onToggle={(event) => setMapOpen(event.currentTarget.open)}
            className="group mt-4 border-t border-border pt-2"
          >
            <summary className="flex min-h-touch cursor-pointer items-center text-sm font-medium text-brand">
              Map and sources
            </summary>
            {mapOpen && <LocationMap country={country} />}
            {place.kind === "country" &&
              country.capitals.map(
                (capital) =>
                  capital.note && (
                    <p key={capital.id} className="mt-3 text-sm text-muted">
                      {capital.name}: {capital.note}
                    </p>
                  ),
              )}
            <p className="mt-3 text-xs text-muted">
              Data reviewed {country.reviewed}.{" "}
              <a
                href={
                  place.kind === "capital"
                    ? place.capital.source
                    : country.sources.geography
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand underline underline-offset-4"
              >
                {place.kind === "capital"
                  ? "Capital source"
                  : "Country data source"}{" "}
                (new tab)
              </a>{" "}
              <a
                href="/about#sources"
                className="text-brand underline underline-offset-4"
              >
                About this data
              </a>
            </p>
          </details>
        </>
      )}
      {actions && (
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
          {actions}
        </div>
      )}
    </Card>
  );
}
