import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata("/random-country-generator");

export default function CountryGeneratorPage() {
  return (
    <ToolPageLayout
      mode="country"
      title="Random Country Generator"
      description="Pick a random country for a geography game, school project, or a place to learn about. Choose a continent, ask for several results, or leave it open to the whole world."
      steps={[
        {
          title: "Choose your countries",
          text: "Choose a continent or keep all countries. Under Choose countries, you can include specific countries or leave some out.",
        },
        {
          title: "Pick one or several",
          text: "Generate up to 20 countries at a time. Keep repeats off to avoid previous picks, even after changing filters. Reset picked places when you want to start again.",
        },
        {
          title: "Keep or share a result",
          text: "Read the capital, language, and currency facts. Open the map, save a favorite, copy the facts, or send a link to the same results.",
        },
      ]}
    />
  );
}
