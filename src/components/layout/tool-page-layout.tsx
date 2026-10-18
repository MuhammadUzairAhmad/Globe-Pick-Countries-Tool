import type { ReactNode } from "react";
import type { City, Continent, Mode } from "@/features/generator/types";
import { Breadcrumbs } from "./breadcrumbs";
import { StructuredData } from "@/components/content/structured-data";
import { RelatedLearning } from "@/components/content/related-learning";
import { siteOrigin, type PagePath } from "@/lib/seo/site";
import { webApplicationData } from "@/lib/seo/structured-data";
import { ToolNavigation } from "./tool-navigation";
import { DatasetExplanation } from "@/components/content/dataset-explanation";
import { ExampleResult } from "@/components/content/example-result";
import { Container } from "./container";
import { PageIntro } from "./page-intro";
import { GeneratorWorkspace } from "@/features/generator/components/generator-workspace";
import { countries } from "@/data/countries";
import { ButtonLink } from "@/components/ui/button";

type ToolPageProps = {
  mode: Mode;
  cities?: City[];
  dataset?: ReactNode;
  initialContinent?: Continent;
  canonicalPath?: PagePath;
  editorial?: ReactNode;
  title: string;
  description: string;
  steps: readonly { title: string; text: string }[];
};

export function ToolPageLayout({
  mode,
  title,
  description,
  steps,
  cities,
  dataset,
  initialContinent,
  canonicalPath,
  editorial,
}: ToolPageProps) {
  const path = canonicalPath ?? `/random-${mode}-generator`;
  return (
    <Container className="py-8 md:py-section">
      <Breadcrumbs
        items={
          canonicalPath
            ? [
                { label: "Home", path: "/" },
                { label: "Countries", path: "/random-country-generator" },
                { label: initialContinent ?? title, path },
              ]
            : [
                { label: "Home", path: "/" },
                { label: title, path },
              ]
        }
      />
      <StructuredData
        value={webApplicationData(siteOrigin.href, path, title, description)}
      />
      <PageIntro
        eyebrow="Pick a place. Learn something new."
        title={title}
        description={description}
      />
      <ToolNavigation current={`/random-${mode}-generator`} />
      <div className="mt-8 max-w-tool">
        <GeneratorWorkspace
          key={`${mode}:${initialContinent ?? "all"}`}
          countries={countries}
          mode={mode}
          cities={cities}
          initialContinent={initialContinent}
          example={mode === "city" ? undefined : <ExampleResult mode={mode} />}
        />
        <section className="mt-section max-w-reading">
          <h2>How to use this generator</h2>
          <ol className="my-6 space-y-4">
            {steps.map((step, index) => (
              <li key={step.title}>
                <h3 className="text-base">
                  {index + 1}. {step.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
          <h2>Try a geography activity today</h2>
          <p className="mt-4 text-muted">
            {mode === "city"
              ? "Find a result on a map. Describe its location using a nearby river, coastline, road, or other place. Compare the map with a local source and write one question you’d like to investigate."
              : "Pick a country above, then find it in an atlas. Name its capital and a neighboring country or nearby island. What else would you like to know about it?"}
          </p>
          <ButtonLink href="/#learning" variant="secondary" className="mt-5">
            More learning ideas
          </ButtonLink>
          <ButtonLink
            href="/country-project-generator"
            variant="secondary"
            className="ml-0 mt-3 sm:ml-3 sm:mt-5"
          >
            Create printable assignments
          </ButtonLink>
        </section>
        {editorial}
        {dataset ?? <DatasetExplanation />}
        <RelatedLearning />
      </div>
    </Container>
  );
}
