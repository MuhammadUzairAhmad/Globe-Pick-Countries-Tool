"use client";

import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Field } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { GeneratorFilters } from "@/features/generator/components/generator-filters";
import {
  defaultFilters,
  eligiblePlaces,
  placesForMode,
  selectPlaces,
} from "@/features/generator/lib/selection";
import type { Country, Filters } from "@/features/generator/types";
import {
  createAssignments,
  projectThemes,
  type CountryAssignment,
  type ProjectTheme,
} from "@/features/learning/country-project";
import { WorksheetPreview, type PaperSize } from "./worksheet-preview";

export function ProjectWorkspace({ countries }: { countries: Country[] }) {
  const [filters, setFilters] = useState<Filters>({
    ...defaultFilters,
    quantity: 1,
  });
  const [consumed, setConsumed] = useState<string[]>([]);
  const [theme, setTheme] = useState<ProjectTheme>("profile");
  const [assignments, setAssignments] = useState<CountryAssignment[]>([]);
  const [paper, setPaper] = useState<PaperSize>("a4");
  const [includeTeacherNotes, setIncludeTeacherNotes] = useState(false);
  const [printing, setPrinting] = useState(false);
  const [message, setMessage] = useState("");
  const places = useMemo(
    () => placesForMode(countries, "country"),
    [countries],
  );
  const eligible = eligiblePlaces(places, { ...filters, noRepeat: false });
  const remaining = eligiblePlaces(places, filters, consumed);

  function generate(quantity = filters.quantity) {
    try {
      const result = selectPlaces(remaining, quantity);
      if (!result.ok) {
        setMessage(result.message);
        return;
      }
      const selectedCountries = result.places.map((place) => place.country);
      setAssignments(createAssignments(selectedCountries, theme));
      setConsumed((previous) => [
        ...new Set([
          ...previous,
          ...selectedCountries.map((country) => country.id),
        ]),
      ]);
      setMessage(
        `Created ${selectedCountries.length} ${selectedCountries.length === 1 ? "assignment" : "assignments"}. Each worksheet has a different country.`,
      );
    } catch {
      setMessage(
        "We couldn’t create the assignments. Please try again in a current browser.",
      );
    }
  }
  async function printWorksheets() {
    if (printing || !assignments.length) return;
    setPrinting(true);
    try {
      await document.fonts.ready;
      window.print();
      setMessage(
        "Use your browser’s print dialog to print or save as PDF. Turn off browser headers and footers for a clean worksheet.",
      );
    } catch {
      setMessage(
        "Printing isn’t available here. Open this page in your regular browser and use Print.",
      );
    } finally {
      setPrinting(false);
    }
  }

  return (
    <div className="mt-8 grid items-start gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] print:mt-0 print:block">
      <div className="space-y-5 print:hidden">
        <Card>
          <Field id="project-topic" label="Research topic">
            <select
              id="project-topic"
              value={theme}
              onChange={(event) => setTheme(event.target.value as ProjectTheme)}
              className="min-h-touch w-full rounded-control border border-border bg-surface px-3 text-sm"
            >
              {projectThemes.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </select>
          </Field>
          <p className="mt-3 text-sm text-muted">
            {projectThemes.find((topic) => topic.id === theme)!.description}
          </p>
        </Card>
        <GeneratorFilters
          countries={countries}
          value={filters}
          onChange={setFilters}
          eligible={eligible.length}
          remaining={remaining.length}
          mode="country"
          onGenerate={generate}
          generateLabel="Create assignments"
          quantityLabel="Number of assignments"
          quantityHint="One country per assignment. Choose between 1 and 20."
          onResetFilters={() => {
            setFilters({ ...defaultFilters });
            setMessage(
              "Filters cleared. Previously picked countries are still remembered while repeats are off.",
            );
          }}
          onResetPool={() => {
            setConsumed([]);
            setMessage(
              "All matching countries can be picked again. Your current worksheets are unchanged.",
            );
          }}
        />
        <p className="px-1 text-xs text-muted">
          Assignments stay on this page until you leave or refresh. No student
          information is collected. Filter and topic changes apply to the next
          set you create.
        </p>
      </div>
      <section aria-labelledby="worksheet-title" className="min-w-0">
        <div className="mb-5 space-y-4 print:hidden">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 id="worksheet-title" className="text-card-title">
              Worksheet preview
            </h2>
            <p className="text-sm text-muted">
              {assignments.length * (includeTeacherNotes ? 2 : 1)}{" "}
              {assignments.length * (includeTeacherNotes ? 2 : 1) === 1
                ? "page"
                : "pages"}
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <Field id="paper-size" label="Paper size">
              <select
                id="paper-size"
                value={paper}
                onChange={(event) => setPaper(event.target.value as PaperSize)}
                className="min-h-touch rounded-control border border-border bg-surface px-3 text-sm"
              >
                <option value="a4">A4</option>
                <option value="letter">US Letter</option>
              </select>
            </Field>
            <Button
              onClick={printWorksheets}
              disabled={!assignments.length || printing}
              aria-busy={printing}
            >
              {printing && (
                <Icon
                  name="loading"
                  className="size-4 animate-spin motion-reduce:animate-none"
                />
              )}
              {printing ? "Opening print…" : "Print worksheets"}
            </Button>
          </div>
          <label className="flex min-h-touch items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={includeTeacherNotes}
              onChange={(event) => setIncludeTeacherNotes(event.target.checked)}
              className="size-5 accent-brand"
            />
            Include teacher notes and reference facts
          </label>
          <p
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="min-h-6 text-sm text-muted"
          >
            {message ||
              "Choose your topic and filters, then create a set of assignments."}
          </p>
          {assignments.length > 0 && (
            <p className="text-xs text-muted">
              Student worksheets come first. Teacher notes are added at the end
              only when selected. The preview below is what prints.
            </p>
          )}
        </div>
        {assignments.length ? (
          <WorksheetPreview
            assignments={assignments}
            paper={paper}
            includeTeacherNotes={includeTeacherNotes}
          />
        ) : (
          <Card className="print:hidden">
            <h3>A different country for each assignment</h3>
            <p className="mt-3 text-muted">
              Create a set to see the research questions and writing space. You
              can preview every page before printing.
            </p>
          </Card>
        )}
      </section>
    </div>
  );
}
