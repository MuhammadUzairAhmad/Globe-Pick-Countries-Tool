import Link from "next/link";
import { Glass } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { pages } from "@/lib/seo/site";
import { Container } from "./container";
import { MobileNavigation } from "./mobile-navigation";

export function AppHeader() {
  const links = [
    ...pages.filter((page) => page.published && page.header),
    { path: "/#learning", label: "Learning ideas" },
  ];
  return (
    <header className="relative z-20 print:hidden">
      <Glass>
        <Container className="flex min-h-20 items-center justify-between gap-6">
          <Link
            href="/"
            aria-label="GlobePick home"
            className="inline-flex min-h-touch items-center gap-2.5 text-lg font-bold tracking-tight"
          >
            <span className="flex size-9 items-center justify-center rounded-control bg-brand text-surface">
              <Icon name="globe" className="size-6" />
            </span>
            Globe<span className="-ml-2 text-brand">Pick</span>
          </Link>
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-5 xl:flex"
          >
            {links.map(({ path, label }) => (
              <Link
                key={path}
                href={path}
                prefetch={path === "/random-city-generator" ? false : undefined}
                className="inline-flex min-h-touch items-center text-sm font-medium text-muted transition-colors hover:text-brand motion-reduce:transition-none"
              >
                {label}
              </Link>
            ))}
          </nav>
          <MobileNavigation
            links={links.map(({ path, label }) => ({ path, label }))}
          />
        </Container>
      </Glass>
    </header>
  );
}
