import { CountryGuidePage } from "@/components/content/country-guide-page";
import { pageMetadata } from "@/lib/seo/site";
export const metadata = pageMetadata("/countries/japan");
export default function Page() {
  return <CountryGuidePage slug="japan" />;
}
