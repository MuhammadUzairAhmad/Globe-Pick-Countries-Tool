import { InformationPage } from "@/components/layout/information-page";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata("/terms");

export default function TermsPage() {
  return (
    <InformationPage
      title="Using this preview"
      description="GlobePick is under development. These notes describe the current preview and its intended educational use; public terms will be reviewed before launch."
      sections={[
        {
          title: "What is available",
          content:
            "Country and capital generators, continent and country filters, multiple results, avoiding repeats, capital practice, browser favorites, and shared results are available. There are no paid services, accounts, or subscriptions. City tools and printable worksheets are not included.",
        },
        {
          title: "Educational use",
          content:
            "Use the learning ideas as starting points for your own research. Check facts against the linked sources and your teaching materials. GlobePick does not provide travel, visa, safety, financial, or legal advice.",
        },
        {
          title: "Sources and corrections",
          content:
            "The About and sources page identifies dataset coverage, review limitations, and the database, flag, map, and font licenses. The adapted database is available under ODbL 1.0. Report factual errors to the project maintainer through the channel that provided the preview. Features, datasets, and these notes may change during development.",
        },
      ]}
    />
  );
}
