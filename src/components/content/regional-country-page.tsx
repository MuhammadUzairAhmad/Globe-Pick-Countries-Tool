import Link from "next/link";
import { notFound } from "next/navigation";
import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { countries } from "@/data/countries";
import { findRegion, countryGuides } from "@/data/tool-pages/curated";

export function RegionalCountryPage({ slug }: { slug: string }) {
  const region = findRegion(slug);
  if (!region) notFound();
  const pool = countries.filter(
    (country) => country.continent === region.continent,
  );
  return (
    <ToolPageLayout
      mode="country"
      title={region.title}
      description={region.description}
      initialContinent={region.continent}
      canonicalPath={region.path}
      steps={[
        {
          title: `Start with ${region.continent}`,
          text: `The continent filter starts on ${region.continent}, with ${pool.length} countries in this dataset. Include or exclude countries to narrow it. Changing a filter does not erase previous picks.`,
        },
        {
          title: "Choose one or a set",
          text: "Generate up to 20 unique countries. Keep repeats off to work through the available pool. If fewer remain, choose the all-remaining action or reset picked places.",
        },
        {
          title: "Use the result as evidence",
          text: "Locate each country in an atlas, check the capital roles, and record the source of a fact you want to investigate. Shared results open the same selection in the main country tool.",
        },
      ]}
      editorial={
        <section className="mt-8 max-w-reading space-y-5">
          <h2>{region.activityTitle}</h2>
          <p className="text-muted">{region.activity}</p>
          <p className="text-muted">{region.discussion}</p>
          <h2 className="text-card-title">Countries in this filter</h2>
          <p className="text-sm text-muted">
            These {pool.length} names follow our country coverage and continent
            conventions. The filter is a learning convenience, not a definition
            of borders or recognition.
          </p>
          <ul className="grid gap-2 text-sm sm:grid-cols-2 md:grid-cols-3">
            {pool.map((country) => {
              const guide = countryGuides.find(
                (guide) => guide.id === country.id,
              );
              return (
                <li key={country.id}>
                  {guide ? (
                    <Link
                      href={`/countries/${guide.slug}`}
                      className="text-brand underline underline-offset-4"
                    >
                      {country.name}
                    </Link>
                  ) : (
                    country.name
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      }
    />
  );
}
