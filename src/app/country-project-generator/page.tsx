import Link from "next/link";
import { ToolNavigation } from "@/components/layout/tool-navigation";
import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/layout/page-intro";
import { DatasetExplanation } from "@/components/content/dataset-explanation";
import { ProjectWorkspace } from "@/features/worksheets/project-workspace";
import { countries } from "@/data/countries";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata("/country-project-generator");

export default function CountryProjectPage() {
  return (
    <Container className="py-8 md:py-section print:max-w-none print:p-0">
      <div className="print:hidden">
        <PageIntro
          eyebrow="Geography for the classroom"
          title="Country Project Generator"
          description="Create country research assignments for a class, a group, or your own learning. Pick a topic, choose how many countries you need, and print the worksheets. No account or student details needed."
        />
      </div>
      <ToolNavigation current="/country-project-generator" />
      <ProjectWorkspace countries={countries} />
      <div className="mt-section max-w-reading print:hidden">
        <h2 className="text-section-title font-semibold">
          Make a classroom activity in three steps
        </h2>
        <ol className="mt-6 space-y-4">
          <li>
            <h3 className="font-semibold">1. Choose a topic and countries</h3>
            <p className="mt-1 text-sm text-muted">
              Start with a country profile, explore land and water, or research
              people and places. Filter by continent or include specific
              countries. Create up to 20 assignments at once.
            </p>
          </li>
          <li>
            <h3 className="font-semibold">2. Review the questions</h3>
            <p className="mt-1 text-sm text-muted">
              Each worksheet has four research questions and space for answers
              and sources. Check the questions against your learners’ needs.
              Students can continue longer answers or map sketches on another
              sheet.
            </p>
          </li>
          <li>
            <h3 className="font-semibold">3. Print or save as PDF</h3>
            <p className="mt-1 text-sm text-muted">
              Choose A4 or US Letter and add teacher notes if you want them.
              Select Print worksheets, then use your browser’s print dialog. Use
              the matching paper size, standard scale, and turn off browser
              headers and footers.
            </p>
          </li>
        </ol>
        <h2 className="mt-8 text-section-title font-semibold">
          What’s in the teacher notes?
        </h2>
        <p className="mt-4 text-muted">
          Reference facts cover capitals and government seats, languages, and
          currencies from our dated country dataset. Research questions about
          landscapes and communities have no single answer key; the notes
          explain what evidence to look for. Country questions account for
          islands, multiple capitals, changing currencies, and variation within
          communities.
        </p>
        <p className="mt-4 text-sm text-muted">
          Use a current atlas and compare sources. The continent groups and
          reference facts follow the same{" "}
          <Link
            href="/about#sources"
            className="text-brand underline underline-offset-4"
          >
            sources and limitations
          </Link>{" "}
          as our country generator.
        </p>
        <DatasetExplanation />
      </div>
    </Container>
  );
}
