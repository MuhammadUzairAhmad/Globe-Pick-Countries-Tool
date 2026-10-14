import Link from "next/link";
import { Glass } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { pages } from "@/lib/seo/site";
import { siteNavigation } from "@/lib/seo/navigation";
import { Container } from "./container";
import { MobileNavigation } from "./mobile-navigation";
import { NavigationDropdown } from "./navigation-dropdown";

export function AppHeader() {
  const navigation = siteNavigation(pages);
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
            className="hidden items-center gap-2 md:flex lg:gap-5"
          >
            <NavigationDropdown
              label="Generators"
              groups={navigation.generators}
            />
            <Link
              href={navigation.worksheets.path}
              className="inline-flex min-h-touch items-center rounded-control px-4 text-sm font-medium text-foreground hover:bg-brand-soft hover:text-brand"
            >
              {navigation.worksheets.label}
            </Link>
            <NavigationDropdown label="Explore" groups={navigation.explore} />
          </nav>
          <MobileNavigation groups={navigation.mobile} />
        </Container>
      </Glass>
    </header>
  );
}
