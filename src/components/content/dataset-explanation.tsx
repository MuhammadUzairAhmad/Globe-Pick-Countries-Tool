import Link from "next/link";
import manifest from "@/data/countries/manifest.json";
import { Card } from "@/components/ui/card";

export function DatasetExplanation() {
  return (
    <Card className="mt-8">
      <h2 className="text-card-title">Which countries are included?</h2>
      <p className="mt-3 text-sm text-muted">
        You can pick from {manifest.countryCount} countries: the 193 UN members,
        Palestine, and Vatican City, which represents the Holy See’s territory.
        Dependent territories and other non-member entities are excluded. The
        capital tool includes {manifest.capitalEntryCount} capitals and
        government seats, with a label explaining each city’s role.
      </p>
      <p className="mt-3 text-sm text-muted">
        Countries are grouped into six continents using our source’s categories.
        North America includes Central America and the Caribbean. Russia is
        listed under Europe; Türkiye, Cyprus, Armenia, Georgia, Azerbaijan, and
        Kazakhstan are under Asia. These groups help you filter results and do
        not define borders or recognition.
      </p>
      <p className="mt-3 text-sm text-muted">
        Data reviewed on 14 October 2026. Read more about our checks and known
        limitations in the{" "}
        <Link
          href="/about#sources"
          className="text-brand underline underline-offset-4"
        >
          sources and licenses
        </Link>
        . Each matching country has an equal chance of being picked. In the
        capital tool, each capital or government seat has an equal chance, so a
        country with several entries can appear more often.
      </p>
      <p className="mt-3 text-xs text-muted">
        Contains information from mledoze/countries, made available under the{" "}
        <a
          href="/licenses/countries-ODbL.txt"
          className="text-brand underline underline-offset-4"
        >
          Open Database License 1.0
        </a>
        . The{" "}
        <a
          href="/data/countries.json"
          download
          className="text-brand underline underline-offset-4"
        >
          adapted database (JSON)
        </a>{" "}
        is available under the same license.
      </p>
    </Card>
  );
}
