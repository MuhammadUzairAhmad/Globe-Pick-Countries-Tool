import type { ReactNode } from "react";
import {
  countryReference,
  type CountryAssignment,
} from "@/features/learning/country-project";

export type PaperSize = "a4" | "letter";

function WorksheetPage({
  children,
  paper,
  label,
}: {
  children: ReactNode;
  paper: PaperSize;
  label: string;
}) {
  return (
    <article
      aria-label={label}
      data-worksheet-page
      data-paper={paper}
      className={`mx-auto w-full border border-border bg-white p-5 text-sm leading-normal text-black shadow-card sm:p-[10mm] print:w-full print:max-w-none print:min-h-0 print:break-inside-avoid print:break-after-page print:border-0 print:p-0 print:shadow-none last:print:break-after-auto ${paper === "a4" ? "max-w-[210mm] xl:min-h-[297mm]" : "max-w-[215.9mm] xl:min-h-[279.4mm]"}`}
    >
      {children}
    </article>
  );
}

function SheetHeading({
  assignment,
  teacher = false,
}: {
  assignment: CountryAssignment;
  teacher?: boolean;
}) {
  return (
    <header className="border-b border-black/30 pb-3">
      <p className="text-xs font-semibold">
        GlobePick •{" "}
        {teacher ? "Teacher notes" : `Assignment ${assignment.number}`} •{" "}
        {assignment.title}
      </p>
      <h3 className="mt-2 text-2xl font-semibold leading-tight">
        {assignment.country.name}
      </h3>
    </header>
  );
}

function StudentWorksheet({ assignment }: { assignment: CountryAssignment }) {
  return (
    <>
      <SheetHeading assignment={assignment} />
      <p className="mt-4">
        Use an atlas and at least one other reliable source. Answer in your own
        words. Keep a record of the sources you use.
      </p>
      <ol className="mt-5 space-y-5">
        {assignment.prompts.map((prompt, index) => (
          <li key={prompt.id}>
            <h4 className="font-semibold">
              {index + 1}. {prompt.title}
            </h4>
            <p className="mt-1">{prompt.question}</p>
            <div aria-hidden="true" className="mt-2 space-y-5">
              <div className="border-b border-black/30" />
              <div className="border-b border-black/30" />
              <div className="border-b border-black/30" />
            </div>
          </li>
        ))}
      </ol>
      <section aria-label="Sources used" className="mt-6">
        <h4 className="font-semibold">Your sources</h4>
        <p className="mt-1 text-xs">
          Write the title or website, author or organization, and date. For a
          website, include the page address.
        </p>
        <div aria-hidden="true" className="mt-5 space-y-6">
          <div className="border-b border-black/30" />
          <div className="border-b border-black/30" />
        </div>
      </section>
      <p className="mt-6 border-t border-black/30 pt-3 text-xs">
        No single source tells the whole story. Check dates and compare evidence
        before drawing a conclusion.
      </p>
    </>
  );
}

function TeacherNotes({ assignment }: { assignment: CountryAssignment }) {
  const reference = countryReference(assignment.country);
  return (
    <>
      <SheetHeading assignment={assignment} teacher />
      <p className="mt-4">
        Use these notes to guide discussion. Open research questions have more
        than one valid answer; assess the evidence and explanation.
      </p>
      <dl className="mt-4 space-y-2 text-xs">
        {reference.facts.map((fact) => (
          <div key={fact.label}>
            <dt className="font-semibold">{fact.label}</dt>
            <dd className="mt-0.5">{fact.value}</dd>
          </div>
        ))}
      </dl>
      {reference.notes.length > 0 && (
        <div className="mt-3 space-y-1 text-xs">
          {reference.notes.map((note) => (
            <p key={note}>{note}</p>
          ))}
        </div>
      )}
      <ol className="mt-5 space-y-3 text-xs">
        {assignment.prompts.map((prompt, index) => (
          <li key={prompt.id}>
            <h4 className="font-semibold">
              {index + 1}. {prompt.title}
            </h4>
            <p className="mt-1">{prompt.guidance}</p>
          </li>
        ))}
      </ol>
      <section className="mt-5 border-t border-black/30 pt-3 text-xs">
        <h4 className="font-semibold">Reference sources</h4>
        <p className="mt-1">
          Data reviewed {assignment.country.reviewed}. This is a dated
          reference, not an independent check of every fact. Verify changing
          information against current sources.
        </p>
        <ul className="mt-2 space-y-2">
          {reference.sources.map((source) => (
            <li key={source}>
              <a href={source} className="[overflow-wrap:anywhere] underline">
                {source}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-3">
          Country facts adapted from mledoze/countries under{" "}
          <a
            href="https://opendatacommons.org/licenses/odbl/1-0/"
            className="underline"
          >
            ODbL 1.0
          </a>
          . Adapted data and license notices are available from GlobePick’s
          About and sources page.
        </p>
      </section>
    </>
  );
}

export function WorksheetPreview({
  assignments,
  paper,
  includeTeacherNotes,
}: {
  assignments: readonly CountryAssignment[];
  paper: PaperSize;
  includeTeacherNotes: boolean;
}) {
  return (
    <div
      className={`space-y-6 print:space-y-0 ${paper === "a4" ? "print:[page:project-a4]" : "print:[page:project-letter]"}`}
    >
      {assignments.map((assignment) => (
        <WorksheetPage
          key={assignment.country.id}
          paper={paper}
          label={`Assignment ${assignment.number}: ${assignment.country.name}`}
        >
          <StudentWorksheet assignment={assignment} />
        </WorksheetPage>
      ))}
      {includeTeacherNotes &&
        assignments.map((assignment) => (
          <WorksheetPage
            key={`teacher-${assignment.country.id}`}
            paper={paper}
            label={`Teacher notes: ${assignment.country.name}`}
          >
            <TeacherNotes assignment={assignment} />
          </WorksheetPage>
        ))}
    </div>
  );
}
