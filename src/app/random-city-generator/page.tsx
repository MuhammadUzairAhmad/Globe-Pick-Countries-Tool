import { ToolPageLayout } from "@/components/layout/tool-page-layout";
import { CityDatasetExplanation } from "@/components/content/city-dataset-explanation";
import { cities } from "@/data/cities";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata("/random-city-generator");

export default function CityGeneratorPage() {
  return (
    <ToolPageLayout
      mode="city"
      cities={cities}
      title="Random City Generator"
      description="Pick a city or town for a map game, a writing prompt, or a place to research. Choose a country or continent, get up to 20 results, and save the places you want to revisit."
      dataset={<CityDatasetExplanation />}
      steps={[
        {
          title: "Choose where to look",
          text: "Choose a country or continent. Each country option shows how many records it has. You can also include or exclude several countries.",
        },
        {
          title: "Pick one or a set",
          text: "Generate up to 20 different city or town records. Keep repeats off to work through the available places. Each eligible record has an equal chance.",
        },
        {
          title: "Locate and keep a result",
          text: "Country and administrative-region labels help distinguish identical names. Open the map, save a favorite, copy the details, or share the same selection.",
        },
      ]}
    />
  );
}
