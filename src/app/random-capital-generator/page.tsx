import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata("/random-capital-generator");

export default function CapitalGeneratorPage() {
  return (
    <ToolPageLayout
      mode="capital"
      title="Random Capital Generator"
      description="Pick a random capital and learn about its country, or hide the answers to test yourself. For countries with several capitals or government seats, each city’s role is shown."
      steps={[
        {
          title: "Choose where to practice",
          text: "Choose a continent or specific countries, then set how many results you want. Each matching capital or government seat has an equal chance of being picked.",
        },
        {
          title: "Test yourself",
          text: "Turn on Hide answers so I can practice. Type a guess and select Check guess, or choose Reveal answer when you’re ready.",
        },
        {
          title: "Learn and save",
          text: "Check each city’s role and read the source notes for more context. Reveal an answer before saving, copying, or sharing it.",
        },
      ]}
    />
  );
}
