import Link from "next/link";
import manifest from "@/data/cities/manifest.json";
import { Card } from "@/components/ui/card";

export function CityDatasetExplanation() {
  return (
    <Card className="mt-8">
      <h2 className="text-card-title font-semibold">
        Which cities are included?
      </h2>
      <p className="mt-3 text-sm text-muted">
        This tool includes {manifest.cityCount.toLocaleString("en")} selected
        cities and towns across {manifest.coveredCountryCount} of our 195
        countries. Natural Earth selects places for regional significance, so
        this is a sample rather than a complete list. Nauru currently has no
        matching records.
      </p>
      <p className="mt-3 text-sm text-muted">
        Every matching record has an equal chance. In all-country mode,
        countries with more records appear more often. Choose a country to pick
        only from its listed cities and towns. Names and administrative regions
        follow the source snapshot; the map shows an approximate point, not city
        boundaries.
      </p>
      <p className="mt-3 text-sm text-muted">
        We exclude historic places, scientific and weather stations, and country
        references outside our 195-country scope. Exact duplicate
        name/country/region entries are merged by retaining the lowest source
        ID. Data checked {manifest.reviewed}; records have structural checks,
        not an independent review of every place.
      </p>
      <p className="mt-3 text-sm text-muted">
        <a
          href={manifest.descriptionUrl}
          className="text-brand underline underline-offset-4"
        >
          Natural Earth populated places
        </a>{" "}
        is public-domain data. Download the{" "}
        <a
          href="/data/cities/cities.json"
          download
          className="text-brand underline underline-offset-4"
        >
          adapted city records
        </a>{" "}
        or{" "}
        <a
          href="/data/cities/manifest.json"
          download
          className="text-brand underline underline-offset-4"
        >
          per-country coverage and source manifest
        </a>
        . Read the{" "}
        <Link
          href="/licenses/cities-Natural-Earth.txt"
          className="text-brand underline underline-offset-4"
        >
          source notice
        </Link>{" "}
        and{" "}
        <Link
          href="/about#sources"
          className="text-brand underline underline-offset-4"
        >
          geography review limits
        </Link>
        .
      </p>
    </Card>
  );
}
