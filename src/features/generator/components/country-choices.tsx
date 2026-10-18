import { useId, useState } from "react";
import { Field } from "@/components/ui/field";
import type { Country, Filters } from "../types";

export function CountryChoices({
  countries,
  value,
  onChange,
}: {
  countries: readonly Country[];
  value: Filters;
  onChange: (value: Filters) => void;
}) {
  const id = useId();
  const [search, setSearch] = useState("");
  const query = search.trim().toLocaleLowerCase();
  const found = countries.filter((country) =>
    [country.name, country.id, ...country.alternatives].some((name) =>
      name.toLocaleLowerCase().includes(query),
    ),
  );
  function choose(id: string, choice: "all" | "include" | "exclude") {
    onChange({
      ...value,
      include: [
        ...value.include.filter((entry) => entry !== id),
        ...(choice === "include" ? [id] : []),
      ],
      exclude: [
        ...value.exclude.filter((entry) => entry !== id),
        ...(choice === "exclude" ? [id] : []),
      ],
    });
  }
  return (
    <details>
      <summary className="min-h-touch cursor-pointer py-2 text-sm font-semibold text-brand">
        Choose countries ({value.include.length} included,{" "}
        {value.exclude.length} excluded)
      </summary>
      <p className="mt-2 text-xs text-muted">
        Choose Include for the countries you want, or Exclude to leave countries
        out. If you don’t include any, we’ll use all countries in your chosen
        continent.
      </p>
      <Field id={`${id}-search`} label="Search countries">
        <input
          id={`${id}-search`}
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Country name or code"
          className="mt-2 min-h-touch w-full rounded-control border border-border bg-surface px-3 text-sm"
        />
      </Field>
      <p className="mt-2 text-xs text-muted">
        {found.length > 30
          ? `Showing the first 30 of ${found.length} matches. Search to narrow the list.`
          : `${found.length} matching countries.`}
      </p>
      <div
        className="mt-3 max-h-72 space-y-2 overflow-y-auto overscroll-contain rounded-control border border-border p-2"
        tabIndex={0}
        aria-label="Country selection list"
      >
        {found.slice(0, 30).map((country) => (
          <div
            key={country.id}
            className="rounded-control border border-border p-2"
          >
            <label
              htmlFor={`${id}-${country.id}`}
              className="block text-sm font-medium"
            >
              {country.name}
            </label>
            <select
              id={`${id}-${country.id}`}
              value={
                value.exclude.includes(country.id)
                  ? "exclude"
                  : value.include.includes(country.id)
                    ? "include"
                    : "all"
              }
              onChange={(event) =>
                choose(
                  country.id,
                  event.target.value as "all" | "include" | "exclude",
                )
              }
              className="mt-1 min-h-touch w-full rounded-control border border-border bg-surface px-2 text-sm"
            >
              <option value="all">Use continent setting</option>
              <option value="include">Include</option>
              <option value="exclude">Exclude</option>
            </select>
          </div>
        ))}
        {!found.length && (
          <p className="p-2 text-sm text-muted">
            No countries match this search.
          </p>
        )}
      </div>
    </details>
  );
}
