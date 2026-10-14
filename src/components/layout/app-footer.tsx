import Link from "next/link";
import { pages } from "@/lib/seo/site";
import { siteNavigation } from "@/lib/seo/navigation";
import { Icon } from "@/components/ui/icon";
import { Container } from "./container";

export function AppFooter() {
  const navigation = siteNavigation(pages);
  return (
    <footer className="mt-auto border-t border-border bg-surface pt-10 pb-6 md:pt-16 md:pb-8 lg:pt-20 print:hidden">
      <Container>
        <div className="grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-3 md:gap-y-10 lg:grid-cols-[minmax(0,1.4fr)_repeat(3,minmax(0,1fr))] lg:gap-x-12">
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link
              href="/"
              className="inline-flex min-h-touch items-center gap-3 text-card-title font-bold tracking-tight"
            >
              <span className="flex size-10 items-center justify-center rounded-control bg-brand-soft text-brand">
                <Icon name="globe" className="size-6" />
              </span>
              GlobePick
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted">
              Pick a place, practice its capital, or create an activity for your
              classroom.
            </p>
          </div>
          {navigation.footer.map((group, index) => (
            <nav
              key={group.title}
              aria-labelledby={`footer-group-${index}`}
              className={
                index === navigation.footer.length - 1
                  ? "col-span-2 min-w-0 md:col-span-1"
                  : "hidden min-w-0 md:block"
              }
            >
              <h2
                id={`footer-group-${index}`}
                className="mb-3 text-sm font-semibold"
              >
                {group.title}
              </h2>
              <ul
                className={
                  index === navigation.footer.length - 1
                    ? "flex flex-wrap gap-x-6 md:block"
                    : ""
                }
              >
                {group.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={link.path}
                      prefetch={
                        link.path === "/random-city-generator"
                          ? false
                          : undefined
                      }
                      className="inline-flex min-h-touch items-center text-sm text-muted hover:text-brand"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <div className="mt-8 flex flex-col gap-2 border-t border-border pt-5 text-xs text-muted sm:flex-row sm:items-center sm:justify-between md:mt-12 md:pt-6">
          <p>Free geography tools for learners and teachers.</p>
          <p>No account needed. Your favorites stay in this browser.</p>
        </div>
      </Container>
    </footer>
  );
}
