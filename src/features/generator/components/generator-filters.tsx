import { CountryChoices } from "./country-choices";
import { QuantityControl } from "./quantity-control";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { continents, type Country, type Filters, type Mode } from "../types";

export function GeneratorFilters({
  countries,
  value,
  onChange,
  eligible,
  remaining,
  mode,
  onGenerate,
  onResetPool,
  onResetFilters,
  ready = true,
  generateLabel,
  quantityLabel,
  quantityHint,
  cityCoverage,
}: {
  countries: readonly Country[];
  value: Filters;
  onChange: (value: Filters) => void;
  eligible: number;
  remaining: number;
  mode: Mode;
  onGenerate: (quantity?: number) => void;
  onResetPool: () => void;
  onResetFilters: () => void;
  ready?: boolean;
  generateLabel?: string;
  quantityLabel?: string;
  quantityHint?: string;
  cityCoverage?: Record<string, number>;
}) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-card-title">Filters</h2>
        <button
          type="button"
          onClick={onResetFilters}
          className="min-h-touch px-2 text-sm font-medium text-brand"
        >
          Clear filters
        </button>
      </div>
      <fieldset
        disabled={!ready}
        className="mt-4 min-w-0 space-y-3 lg:space-y-5"
      >
        <div className="grid grid-cols-2 items-start gap-3 lg:grid-cols-1">
          <Field id="continent" label="Continent">
            <select
              id="continent"
              value={value.continent}
              onChange={(event) =>
                onChange({
                  ...value,
                  continent: event.target.value as Filters["continent"],
                })
              }
              className="min-h-touch w-full rounded-control border border-border bg-surface px-3 py-2 text-sm"
            >
              <option value="all">All continents</option>
              {continents.map((continent) => (
                <option key={continent}>{continent}</option>
              ))}
            </select>
          </Field>
          <QuantityControl
            value={value.quantity}
            onChange={(quantity) => onChange({ ...value, quantity })}
            label={quantityLabel}
            hint={quantityHint}
          />
        </div>
        {mode === "city" && (
          <Field id="city-country" label="Country">
            <select
              id="city-country"
              value={
                value.include.length === 1
                  ? value.include[0]
                  : value.include.length
                    ? "custom"
                    : "all"
              }
              onChange={(event) => {
                const id = event.target.value;
                onChange({
                  ...value,
                  include: id === "all" ? [] : [id],
                  exclude: value.exclude.filter((entry) => entry !== id),
                });
              }}
              className="min-h-touch w-full rounded-control border border-border bg-surface px-3 py-2 text-sm"
            >
              <option value="all">All countries</option>
              {value.include.length > 1 && (
                <option value="custom" disabled>
                  Custom country selection
                </option>
              )}
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name} ({cityCoverage?.[country.id] ?? 0}{" "}
                  {cityCoverage?.[country.id] === 1 ? "record" : "records"})
                </option>
              ))}
            </select>
          </Field>
        )}
        <label className="flex min-h-touch items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={value.noRepeat}
            onChange={(event) =>
              onChange({ ...value, noRepeat: event.target.checked })
            }
            className="size-5 accent-brand"
          />
          Don’t repeat previous picks
        </label>
        {mode === "capital" && (
          <label className="flex min-h-touch items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={value.guess}
              onChange={(event) =>
                onChange({ ...value, guess: event.target.checked })
              }
              className="size-5 accent-brand"
            />
            Hide answers so I can practice
          </label>
        )}
        <Button
          className="w-full"
          onClick={() => onGenerate()}
          disabled={!ready}
        >
          {generateLabel ??
            `Generate ${mode === "country" ? "countries" : mode === "city" ? "cities" : "capitals"}`}
        </Button>
        <div className="rounded-control bg-page p-3 text-sm">
          <p>
            <strong>{remaining}</strong> of {eligible} matching{" "}
            {mode === "country"
              ? "countries"
              : mode === "city"
                ? "cities and towns"
                : "capitals and government seats"}{" "}
            available
          </p>
          <p className="mt-1 text-xs text-muted">
            {mode === "city"
              ? "Each matching city or town record has an equal chance. Countries with more records appear more often."
              : mode === "capital"
                ? "Each capital or government seat has an equal chance. Countries with more than one entry can appear more often."
                : "Each matching country has an equal chance."}
          </p>
        </div>
        {remaining > 0 && remaining < value.quantity && (
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => onGenerate(remaining)}
            disabled={!ready}
          >
            Generate all {remaining} remaining
          </Button>
        )}
        <CountryChoices
          countries={countries}
          value={value}
          onChange={onChange}
        />
        <button
          type="button"
          onClick={onResetPool}
          className="min-h-touch w-full text-sm font-medium text-brand"
        >
          Reset picked places
        </button>
      </fieldset>
    </Card>
  );
}
