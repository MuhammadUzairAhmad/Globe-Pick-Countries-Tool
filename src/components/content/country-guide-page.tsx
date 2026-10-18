import { notFound } from "next/navigation";
import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/layout/page-intro";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { PlaceIdentity } from "@/features/generator/components/place-identity";
import { FactList } from "@/features/generator/components/fact-list";
import { countries } from "@/data/countries";
import { findCountryGuide } from "@/data/tool-pages/curated";
import { RelatedLearning } from "@/components/content/related-learning";

export function CountryGuidePage({ slug }: { slug: string }) {
  const guide = findCountryGuide(slug);
  if (!guide) notFound();
  const country = countries.find((country) => country.id === guide.id)!;
  const practice = `/random-capital-generator?gp=1&m=capital&region=all&n=${country.capitals.length}&nr=0&quiz=1&in=${country.id}`;
  return (
    <Container className="py-section">
      <Breadcrumbs
        items={[
          { label: "Home", path: "/" },
          { label: country.name, path: `/countries/${guide.slug}` },
        ]}
      />
      <PageIntro
        eyebrow="Country learning guide"
        title={guide.title}
        description={guide.description}
      />
      <div className="mt-8 max-w-reading space-y-8">
        <p className="text-lg text-muted">{guide.introduction}</p>
        <section>
          <h2>{guide.contextTitle}</h2>
          <p className="mt-4 text-muted">{guide.context}</p>
          <ul className="mt-3 space-y-2 text-sm">
            {guide.sources.map((source) => (
              <li key={source.url}>
                <a
                  href={source.url}
                  className="text-brand underline underline-offset-4"
                >
                  {source.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
        <Card>
          <PlaceIdentity
            country={country}
            title={country.name}
            subtitle={country.continent}
          />
          <FactList
            place={{
              kind: "country",
              id: country.id,
              countryId: country.id,
              country,
            }}
          />
          <p className="mt-4 text-xs text-muted">
            Reference facts follow our dataset reviewed {country.reviewed};
            language lists are not exhaustive. Capital context above uses the
            primary references linked on this page.{" "}
            <a
              href="/about#sources"
              className="text-brand underline underline-offset-4"
            >
              Read the data limitations.
            </a>
          </p>
        </Card>
        <section>
          <h2>Three activities to try</h2>
          <ol className="mt-5 space-y-6">
            {guide.activities.map((activity, index) => (
              <li key={activity.title}>
                <h3>
                  {index + 1}. {activity.title}
                </h3>
                <p className="mt-3 text-muted">{activity.text}</p>
              </li>
            ))}
          </ol>
        </section>
        <section className="border-t border-border pt-6">
          <h2 className="text-card-title">Put the questions into practice</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <ButtonLink href={practice}>
              Practice {country.name}’s capitals
            </ButtonLink>
            <ButtonLink
              href={`/random-city-generator?gp=1&m=city&in=${country.id}`}
              prefetch={false}
              variant="secondary"
            >
              Pick a city in {country.name}
            </ButtonLink>
            <ButtonLink href="/country-project-generator" variant="secondary">
              Create research worksheets
            </ButtonLink>
          </div>
          <p className="mt-4 text-sm text-muted">
            For a country-specific worksheet, choose {country.name} under Choose
            countries in the project tool. Questions are starting points for
            research, not a full account of a country’s people or history.
          </p>
        </section>
        <p className="text-xs text-muted">
          Guide reviewed 14 October 2026. No population estimates, travel
          advice, or exhaustive cultural claims are included.
        </p>
        <RelatedLearning />
      </div>
    </Container>
  );
}
