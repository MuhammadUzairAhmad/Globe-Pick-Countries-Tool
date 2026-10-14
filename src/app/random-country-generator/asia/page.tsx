import { RegionalCountryPage } from "@/components/content/regional-country-page";
import { pageMetadata } from "@/lib/seo/site";
export const metadata = pageMetadata("/random-country-generator/asia");
export default function Page() {
  return <RegionalCountryPage slug="asia" />;
}
