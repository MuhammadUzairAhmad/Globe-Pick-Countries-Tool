import Image from "next/image";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { Place } from "@/features/generator/types";
import { countryPage } from "../lib/pagination";
import { useCountryPageSize } from "../hooks/use-country-page-size";

export function AvailableCountries({
  places,
  ready,
  spinning,
}: {
  places: readonly Place[];
  ready: boolean;
  spinning: boolean;
}) {
  const [requestedOffset, setOffset] = useState(0);
  const pageSize = useCountryPageSize();
  const { countries, page, pageCount, first, last } = countryPage(
    places,
    Math.floor(requestedOffset / pageSize) + 1,
    pageSize,
  );
  const headingId = useId();
  return (
    <section
      aria-labelledby={headingId}
      className="mt-5 border-t border-border pt-5"
    >
      <div className="flex items-center justify-between gap-3">
        <h4 id={headingId} className="text-sm font-semibold">
          Countries in the next spin
        </h4>
        <span className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand">
          {ready ? places.length : "…"}
        </span>
      </div>
      <p className="mt-2 text-xs text-muted">
        {spinning
          ? "The pool updates when this spin ends."
          : "Every available country can win, on any page."}
      </p>
      {!ready ? (
        <div
          aria-hidden="true"
          className="mt-3 grid min-h-[15.5rem] grid-cols-1 content-start gap-2 sm:grid-cols-2"
        >
          {Array.from({ length: pageSize }, (_, index) => (
            <div
              key={index}
              className="flex min-h-14 items-center gap-3 rounded-control border border-border bg-page px-3 py-2"
            >
              <span className="h-6 w-8 rounded bg-border" />
              <span className="h-3 w-20 rounded bg-border" />
            </div>
          ))}
        </div>
      ) : places.length ? (
        <ul
          aria-labelledby={headingId}
          className="mt-3 grid min-h-[15.5rem] grid-cols-1 content-start gap-2 sm:grid-cols-2"
        >
          {countries.map((place) => (
            <li
              key={place.id}
              className="flex min-w-0 min-h-14 items-center gap-3 rounded-control border border-border bg-page px-3 py-2"
            >
              <Image
                src={place.country.flag}
                width={32}
                height={24}
                alt=""
                unoptimized
                className="h-6 w-8 shrink-0 rounded border border-border object-contain"
              />
              <span className="min-w-0 break-words text-sm font-medium">
                {place.country.name}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-3 rounded-control border border-border bg-page p-4 text-sm text-muted">
          No countries are available. Choose another continent, allow repeats,
          or reset picked places.
        </p>
      )}
      <p className="mt-3 text-xs text-muted">
        {!ready
          ? "Loading countries…"
          : places.length
            ? `Showing ${first}–${last} of ${places.length} countries`
            : "0 countries available"}
      </p>
      <nav
        aria-label="Available country pages"
        className="mt-3 flex flex-wrap items-center justify-between gap-2"
      >
        <Button
          variant="secondary"
          size="compact"
          className="min-w-touch gap-1"
          disabled={!ready || spinning || page === 1 || !places.length}
          onClick={() => setOffset((page - 2) * pageSize)}
          aria-label="Previous countries"
        >
          <Icon name="arrow" className="size-4 rotate-180" />
          <span className="hidden min-[360px]:inline">Previous</span>
        </Button>
        <p
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="text-xs text-muted"
        >
          Page {page} of {pageCount}
        </p>
        <Button
          variant="secondary"
          size="compact"
          className="min-w-touch gap-1"
          disabled={!ready || spinning || page === pageCount || !places.length}
          onClick={() => setOffset(page * pageSize)}
          aria-label="Next countries"
        >
          <span className="hidden min-[360px]:inline">Next</span>
          <Icon name="arrow" className="size-4" />
        </Button>
      </nav>
    </section>
  );
}
