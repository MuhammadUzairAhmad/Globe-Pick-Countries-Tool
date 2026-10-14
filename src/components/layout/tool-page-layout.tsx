import Link from "next/link";
import { DatasetExplanation } from "@/components/content/dataset-explanation";
import { ExampleResult } from "@/components/content/example-result";
import { Container } from "./container";
import { PageIntro } from "./page-intro";
import { GeneratorWorkspace } from "@/features/generator/components/generator-workspace";
import { countries } from "@/data/countries";
import { ButtonLink } from "@/components/ui/button";

type ToolPageProps = {
  mode: "country" | "capital";
  title: string;
  description: string;
  steps: readonly { title: string; text: string }[];
};

export function ToolPageLayout({
  mode,
  title,
  description,
  steps,
}: ToolPageProps) {
  return (
    <Container className="py-8 md:py-section">
      <PageIntro
        eyebrow="Pick a place. Learn something new."
        title={title}
        description={description}
      />
      <nav aria-label="Geography tools" className="mt-6 flex flex-wrap gap-2">
        {(["country", "capital"] as const).map((tool) => (
          <Link
            key={tool}
            href={`/random-${tool}-generator`}
            aria-current={mode === tool ? "page" : undefined}
            className={
              mode === tool
                ? "inline-flex min-h-touch items-center rounded-control bg-brand px-5 text-sm font-semibold text-surface"
                : "inline-flex min-h-touch items-center rounded-control border border-border bg-surface px-5 text-sm font-medium text-muted hover:bg-brand-soft"
            }
          >
            {tool === "country" ? "Countries" : "Capitals"}
          </Link>
        ))}
      </nav>
      <div className="mt-8 max-w-tool">
        <GeneratorWorkspace
          key={mode}
          countries={countries}
          mode={mode}
          example={<ExampleResult mode={mode} />}
        />
        <section className="mt-section max-w-reading">
          <h2 className="text-section-title font-semibold">
            How to use this generator
          </h2>
          <ol className="my-6 space-y-4">
            {steps.map((step, index) => (
              <li key={step.title}>
                <h3 className="font-semibold">
                  {index + 1}. {step.title}
                </h3>
                <p className="mt-1 text-sm text-muted">{step.text}</p>
              </li>
            ))}
          </ol>
          <h2 className="text-section-title font-semibold">
            Try a geography activity today
          </h2>
          <p className="mt-4 text-muted">
            Pick a country above, then find it in an atlas. Name its capital and
            a neighboring country or nearby island. What else would you like to
            know about it?
          </p>
          <ButtonLink href="/#learning" variant="secondary" className="mt-5">
            More learning ideas
          </ButtonLink>
        </section>
        <DatasetExplanation />
      </div>
    </Container>
  );
}
