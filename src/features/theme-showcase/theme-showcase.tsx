"use client";

import { useState } from "react";
import { AtlasArt } from "@/components/content/atlas-art";
import { Container } from "@/components/layout/container";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Icon } from "@/components/ui/icon";
import { PlaceResultCard } from "@/features/generator/components/place-result-card";
import type { Country } from "@/features/generator/types";
import { darkPalettes } from "./palettes";

export function ThemeShowcase({ samples }: { samples: Country[] }) {
  const [paletteId, setPaletteId] = useState<string>("graphite");
  const [sampleIndex, setSampleIndex] = useState(0);
  const [showFacts, setShowFacts] = useState(true);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const palette = darkPalettes.find((entry) => entry.id === paletteId)!;
  const country = samples[sampleIndex];
  const saved = savedIds.includes(country.id);

  return (
    <div data-preview-theme={palette.id} className="bg-page text-foreground">
      <Container className="py-8 md:py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">
              GlobePick design studio
            </p>
            <h1 className="mt-2 text-3xl sm:text-4xl">Find your dark side.</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted">
              Six dark palettes, one familiar layout. Choose a card, then try
              the controls in the preview below.
            </p>
          </div>
          <p className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-muted">
            Preview only · your site theme stays saved
          </p>
        </div>

        <div
          className="mt-7 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6"
          role="group"
          aria-label="Dark theme options"
        >
          {darkPalettes.map((entry, index) => (
            <button
              key={entry.id}
              type="button"
              data-preview-theme={entry.id}
              aria-label={`Preview ${entry.name}`}
              aria-pressed={palette.id === entry.id}
              onClick={() => setPaletteId(entry.id)}
              className={`min-w-0 rounded-card border bg-page p-3 text-left text-foreground transition-colors hover:border-brand motion-reduce:transition-none ${
                palette.id === entry.id
                  ? "border-brand ring-2 ring-brand/40"
                  : "border-border"
              }`}
            >
              <span
                aria-hidden="true"
                className="flex h-16 items-center gap-2 rounded-control border border-border bg-surface p-2"
              >
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-soft text-brand">
                  <Icon name="globe" className="size-5" />
                </span>
                <span className="grid flex-1 gap-1.5">
                  <span className="h-1.5 w-4/5 rounded-full bg-foreground/80" />
                  <span className="h-1 w-3/5 rounded-full bg-muted/60" />
                  <span className="mt-0.5 h-3 w-1/2 rounded bg-brand" />
                </span>
              </span>
              <span className="mt-3 flex items-center justify-between gap-2 text-sm font-semibold">
                {entry.name}
                <span className="flex size-5 items-center justify-center text-xs text-brand">
                  {palette.id === entry.id ? (
                    <Icon name="check" className="size-4" />
                  ) : (
                    `0${index + 1}`
                  )}
                </span>
              </span>
            </button>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="palette-preview-title" className="text-card-title">
              {palette.name}
              <span className="ml-3 text-sm font-normal text-muted">
                {palette.mood}
              </span>
            </h2>
            <p className="mt-1 text-sm text-muted">{palette.description}</p>
          </div>
          <p role="status" className="text-xs text-muted">
            Viewing {palette.name} · {darkPalettes.length} palettes
          </p>
        </div>

        <section
          aria-labelledby="palette-preview-title"
          className="mt-4 overflow-hidden rounded-card border border-border bg-page shadow-floating"
        >
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-surface px-5 py-4 md:px-8">
            <p className="flex items-center gap-2.5 font-semibold">
              <span className="flex size-9 items-center justify-center rounded-control bg-brand text-on-brand">
                <Icon name="globe" className="size-6" />
              </span>
              <span>
                Globe<span className="text-brand">Pick</span>
              </span>
            </p>
            <div className="flex items-center gap-2 text-xs text-muted">
              <Icon name="moon" className="size-4 text-brand" />
              {palette.name} dark theme
            </div>
          </div>

          <div className="grid items-center gap-5 border-b border-border px-5 py-7 md:grid-cols-[1.6fr_1fr] md:px-8">
            <div>
              <p className="text-xs font-medium text-accent">
                A little curiosity goes a long way
              </p>
              <h2 className="mt-3 max-w-lg text-3xl leading-tight sm:text-4xl">
                Pick a place.
                <br />
                <span className="text-brand">Follow your curiosity.</span>
              </h2>
              <p className="mt-3 max-w-lg text-sm text-muted">
                Discover a country, learn its capital, and find your next
                classroom adventure.
              </p>
            </div>
            <div className="mx-auto hidden w-full max-w-64 md:block">
              <AtlasArt />
            </div>
          </div>

          <div className="grid items-start gap-5 p-5 md:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] md:p-8">
            <div className="min-w-0 space-y-4">
              <Card>
                <h3 className="text-lg">Try this palette</h3>
                <div className="mt-5">
                  <Field id="preview-country" label="Sample country">
                    <select
                      id="preview-country"
                      value={sampleIndex}
                      onChange={(event) =>
                        setSampleIndex(Number(event.target.value))
                      }
                      className="min-h-touch w-full rounded-control border border-border bg-surface px-3 text-sm text-foreground hover:border-brand"
                    >
                      {samples.map((sample, index) => (
                        <option key={sample.id} value={index}>
                          {sample.name}
                        </option>
                      ))}
                    </select>
                  </Field>
                </div>
                <label className="mt-4 flex min-h-touch cursor-pointer items-center gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={showFacts}
                    onChange={(event) => setShowFacts(event.target.checked)}
                    className="size-5 accent-brand"
                  />
                  Show country facts
                </label>
                <Button
                  className="mt-4 w-full"
                  onClick={() =>
                    setSampleIndex((current) => (current + 1) % samples.length)
                  }
                >
                  Next sample
                  <Icon name="arrow" className="size-4" />
                </Button>
                <ButtonLink
                  href="/random-country-generator"
                  variant="secondary"
                  className="mt-3 w-full"
                >
                  Open country tool
                </ButtonLink>
              </Card>
              <div className="rounded-control border border-border bg-brand-soft p-4 text-sm">
                <p className="font-medium text-brand">Made for curious minds</p>
                <p className="mt-1 text-muted">
                  Compare links, labels, controls, and country facts against
                  each background.
                </p>
              </div>
            </div>

            <div className="min-w-0 space-y-4">
              <PlaceResultCard
                key={country.id}
                place={{
                  kind: "country",
                  id: country.id,
                  countryId: country.id,
                  country,
                }}
                answerHidden={!showFacts}
              />
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-card border border-border bg-surface p-4">
                <p role="status" className="flex items-center gap-2 text-sm">
                  <Icon
                    name={saved ? "check" : "book"}
                    className={`size-4 shrink-0 ${saved ? "text-success" : "text-brand"}`}
                  />
                  {saved
                    ? `${country.name} saved in this preview.`
                    : "A place worth learning about."}
                </p>
                <Button
                  variant="secondary"
                  aria-pressed={saved}
                  aria-label={`${saved ? "Unsave" : "Save"} ${country.name} in preview`}
                  onClick={() =>
                    setSavedIds((current) =>
                      saved
                        ? current.filter((id) => id !== country.id)
                        : [...current, country.id],
                    )
                  }
                >
                  {saved ? "Saved" : "Save country"}
                </Button>
              </div>
              <p className="text-xs text-muted">
                Sample countries and saves are only for this preview. Choose
                another palette to compare the same content.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-5 border-t border-border bg-surface px-5 py-5 md:px-8">
            <p className="text-sm text-muted">A whole world to get to know.</p>
            <div className="flex gap-2" aria-label="Palette colors">
              {[
                ["Page background", "bg-page"],
                ["Card surface", "bg-surface"],
                ["Main text", "bg-foreground"],
                ["Primary accent", "bg-brand"],
                ["Warm accent", "bg-accent"],
              ].map(([label, color]) => (
                <span
                  key={label}
                  role="img"
                  aria-label={label}
                  title={label}
                  className={`size-6 rounded-full border border-border ${color}`}
                />
              ))}
            </div>
          </div>
        </section>
      </Container>
    </div>
  );
}
