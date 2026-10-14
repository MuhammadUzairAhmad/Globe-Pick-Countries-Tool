import Link from "next/link";
import { pages } from "@/lib/seo/site";
import { Icon } from "@/components/ui/icon";
import { Container } from "./container";

export function AppFooter() {
  return (
    <footer className="mt-auto border-t border-border bg-surface py-8 print:hidden">
      <Container className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
        <div>
          <Link
            href="/"
            className="inline-flex min-h-touch items-center gap-2 font-semibold"
          >
            <Icon name="globe" className="size-5 text-brand" />
            GlobePick
          </Link>
          <p className="text-sm text-muted">
            A little curiosity. A whole world.
          </p>
        </div>
        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap gap-x-6 gap-y-1"
        >
          {pages
            .filter((page) => page.published && page.footer)
            .map((page) => (
              <Link
                key={page.path}
                href={page.path}
                className="inline-flex min-h-touch items-center text-sm text-muted hover:text-brand"
              >
                {page.label}
              </Link>
            ))}
        </nav>
        <p className="text-xs text-muted">Pick. Practice. Learn.</p>
      </Container>
    </footer>
  );
}
