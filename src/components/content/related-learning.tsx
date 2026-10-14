import Link from "next/link";
import { regionalPages, countryGuides } from "@/data/tool-pages/curated";

export function RelatedLearning() {
  return (
    <section
      className="mt-8 border-t border-border pt-6"
      aria-labelledby="related-learning-title"
    >
      <h2 id="related-learning-title" className="text-card-title font-semibold">
        Explore a region or a learning guide
      </h2>
      <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm">
        {regionalPages.map((region) => (
          <li key={region.slug}>
            <Link
              href={region.path}
              className="text-brand underline underline-offset-4"
            >
              Pick countries in {region.continent}
            </Link>
          </li>
        ))}
        {countryGuides.map((guide) => (
          <li key={guide.slug}>
            <Link
              href={`/countries/${guide.slug}`}
              className="text-brand underline underline-offset-4"
            >
              {guide.id === "JP"
                ? "Japan map activities"
                : "South Africa’s capital roles"}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
