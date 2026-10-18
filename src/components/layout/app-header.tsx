import Link from "next/link";
import { Glass } from "@/components/ui/card";
import { Icon } from "@/components/ui/icon";
import { pages } from "@/lib/seo/site";
import { siteNavigation } from "@/lib/seo/navigation";
import { Container } from "./container";
import { MobileNavigation } from "./mobile-navigation";
import { NavigationDropdown } from "./navigation-dropdown";
import { ThemeToggle } from "./theme-toggle";

export function AppHeader() {
  const navigation = siteNavigation(pages);
  return (
    <header className="relative z-20 print:hidden">
      <Glass>
        <Container className="flex min-h-20 items-center justify-between gap-3 md:gap-6">
          <Link
            href="/"
            aria-label="GlobePick home"
            className="inline-flex min-h-touch shrink-0 items-center gap-2 text-base font-bold tracking-tight sm:gap-2.5 sm:text-lg"
          >
            <span className="flex size-8 items-center justify-center rounded-control bg-brand text-on-brand sm:size-9">
              <Icon name="globe" className="size-6" />
            </span>
            <span>
              Globe<span className="text-brand">Pick</span>
            </span>
          </Link>
          <div className="flex shrink-0 items-center gap-1 sm:gap-2">
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
            <ThemeToggle />
            <MobileNavigation groups={navigation.mobile} />
          </div>
        </Container>
      </Glass>
    </header>
  );
}
