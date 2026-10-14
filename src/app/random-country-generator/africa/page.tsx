import { RegionalCountryPage } from "@/components/content/regional-country-page";
import { pageMetadata } from "@/lib/seo/site";
export const metadata = pageMetadata("/random-country-generator/africa");
export default function Page() {
  return <RegionalCountryPage slug="africa" />;
}
