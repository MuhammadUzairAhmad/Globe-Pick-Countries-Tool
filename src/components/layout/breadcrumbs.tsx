import Link from "next/link";
import { StructuredData } from "@/components/content/structured-data";
import { breadcrumbData } from "@/lib/seo/structured-data";
import { siteOrigin } from "@/lib/seo/site";

export function Breadcrumbs({
  items,
}: {
  items: readonly { label: string; path: string }[];
}) {
  return (
    <>
      <nav aria-label="Breadcrumbs" className="mb-5 print:hidden">
        <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
          {items.map((item, index) => (
            <li key={item.path} className="flex items-center gap-2">
              {index > 0 && <span aria-hidden="true">›</span>}
              {index === items.length - 1 ? (
                <span aria-current="page">{item.label}</span>
              ) : (
                <Link
                  href={item.path}
                  className="text-brand underline-offset-4 hover:underline"
                >
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <StructuredData value={breadcrumbData(siteOrigin.href, items)} />
    </>
  );
}
