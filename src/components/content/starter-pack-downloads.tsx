import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { starterPack } from "@/features/worksheets/starter-pack";
import manifest from "@/data/worksheet-packs/manifest.json";

export function StarterPackDownloads() {
  return (
    <Card className="mt-section print:hidden">
      <p className="text-sm font-semibold text-brand">
        Free classroom starter pack
      </p>
      <h2 className="mt-2 text-card-title font-semibold">
        {starterPack.title}
      </h2>
      <p className="mt-3 max-w-reading text-muted">
        {starterPack.description} Compare one capital with several capital
        roles, locate each country, and research languages and currencies. Use
        an atlas and current sources to support your answers.
      </p>
      <p className="mt-3 text-sm text-muted">
        Each PDF has two student sheets followed by two teacher sheets. Reviewed
        14 October 2026. The questions match the Country profile topic above;
        reference facts use the same dated country dataset.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        {manifest.files.map((file) => (
          <ButtonLink
            key={file.paper}
            href={file.path}
            prefetch={false}
            download
            variant="secondary"
          >
            Download {file.paper === "a4" ? "A4" : "US Letter"} PDF
            <span className="font-normal text-muted">
              {Math.ceil(file.bytes / 1024)} KB
            </span>
          </ButtonLink>
        ))}
      </div>
      <p className="mt-4 text-sm text-muted">
        Print pages 1–2 for learners and keep pages 3–4 as teacher notes. Choose
        the matching paper size and print at actual size. Longer answers and map
        sketches can continue on another sheet. Questions and teaching notes may
        be copied and adapted for classroom use.
      </p>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <Link
          href="/countries/japan"
          className="inline-flex min-h-touch items-center text-brand underline underline-offset-4"
        >
          Japan activities
        </Link>
        <Link
          href="/countries/south-africa"
          className="inline-flex min-h-touch items-center text-brand underline underline-offset-4"
        >
          South Africa activities
        </Link>
        <a
          href="/packs/manifest.json"
          className="inline-flex min-h-touch items-center text-brand underline underline-offset-4"
        >
          File details and checksums
        </a>
        <a
          href="/licenses/worksheet-fonts-DejaVu.txt"
          className="inline-flex min-h-touch items-center text-brand underline underline-offset-4"
        >
          Worksheet font license
        </a>
      </div>
    </Card>
  );
}
