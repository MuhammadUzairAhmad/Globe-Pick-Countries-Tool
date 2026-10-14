import type { Country } from "../generator/types.ts";
import {
  countryReference,
  createAssignments,
} from "../learning/country-project.ts";

export const starterPack = {
  id: "country-profile",
  title: "Japan and South Africa",
  description:
    "Two country profiles, four research questions each, and teacher notes with dated reference facts.",
  countryIds: ["JP", "ZA"],
  reviewed: "2026-10-14",
  pages: 4,
} as const;

export function starterPackContent(countries: readonly Country[]) {
  const selected = starterPack.countryIds.map((id) => {
    const country = countries.find((entry) => entry.id === id);
    if (!country) throw new Error(`Starter pack country ${id} is unavailable.`);
    return country;
  });
  return {
    ...starterPack,
    purpose:
      "Locate two countries and compare a single capital with several capital roles. Use evidence to research languages and currencies.",
    assignments: createAssignments(selected, "profile").map((assignment) => ({
      number: assignment.number,
      title: assignment.title,
      country: {
        id: assignment.country.id,
        name: assignment.country.name,
        reviewed: assignment.country.reviewed,
      },
      prompts: assignment.prompts,
      reference: countryReference(assignment.country),
      furtherReading:
        assignment.country.id === "JP"
          ? [
              {
                title: "Study in Japan: Tokyo",
                url: "https://www.studyinjapan.go.jp/en/why/47prefectures/kanto/tokyo.html",
              },
            ]
          : [
              {
                title: "South African government: provinces and capitals",
                url: "https://www.gov.za/about-sa/south-africas-provinces",
              },
              {
                title: "Department of Justice: courts and their roles",
                url: "https://www.justice.gov.za/about/sa-courts.html",
              },
            ],
    })),
  };
}
