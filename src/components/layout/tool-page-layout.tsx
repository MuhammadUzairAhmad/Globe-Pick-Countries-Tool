import { ToolNavigation } from "./tool-navigation";
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
      <ToolNavigation current={`/random-${mode}-generator`} />
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
          <ButtonLink
            href="/country-project-generator"
            variant="secondary"
            className="ml-0 mt-3 sm:ml-3 sm:mt-5"
          >
            Create printable assignments
          </ButtonLink>
        </section>
        <DatasetExplanation />
      </div>
    </Container>
  );
}
