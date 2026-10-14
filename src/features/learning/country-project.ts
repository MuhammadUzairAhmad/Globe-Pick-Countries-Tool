import type { Country } from "../generator/types.ts";

export const projectThemes = [
  {
    id: "profile",
    title: "Country profile",
    description:
      "Locate a country and research its capital, languages, and currency.",
  },
  {
    id: "land",
    title: "Land and water",
    description:
      "Use maps to investigate location, landscape, and connections.",
  },
  {
    id: "life",
    title: "People and places",
    description:
      "Learn about a place through specific examples and reliable sources.",
  },
] as const;
export type ProjectTheme = (typeof projectThemes)[number]["id"];
export type ResearchPrompt = {
  id: string;
  title: string;
  question: string;
  guidance: string;
};

// Editorially reviewed, country-neutral questions. These ask learners to find
// evidence rather than inventing facts or assuming every country has a coast,
// land borders, a single capital, or one shared language/culture.
export const researchPrompts: Record<ProjectTheme, readonly ResearchPrompt[]> =
  {
    profile: [
      {
        id: "location",
        title: "Find it on a map",
        question:
          "Where is this country? Name its continent and one neighboring country or nearby island. Sketch a small locator map.",
        guidance:
          "Accept well-supported continent conventions. Island countries may have no land neighbors; a nearby island or country is a valid answer.",
      },
      {
        id: "capital",
        title: "Find the capital",
        question:
          "Which city is the capital, or where is the government based? If more than one city has a role, explain the difference.",
        guidance:
          "Use the reference facts as a starting point. Accept multiple capitals or government seats when their roles are correctly explained; some countries have no official capital.",
      },
      {
        id: "language",
        title: "Explore a language",
        question:
          "Find a language used in this country. Where or by whom is it used? Explain why one language does not describe everyone who lives there.",
        guidance:
          "The reference lists languages from the dataset and is not a complete account of language use. Learners should support a specific example and avoid treating a country as culturally uniform.",
      },
      {
        id: "currency",
        title: "Check the currency",
        question:
          "What currency or currencies are used? Give the name, code, and date of your source. Check whether an older source gives a different answer.",
        guidance:
          "Check current official sources when possible. Currency arrangements can change and may include more than one currency. The reference is a dated snapshot.",
      },
    ],
    land: [
      {
        id: "location",
        title: "Locate the country",
        question:
          "Find this country in an atlas. Describe its position using its continent and two nearby places or bodies of water.",
        guidance:
          "Look for relative-location descriptions that agree with a map. Countries can span regions; do not require a single continent convention.",
      },
      {
        id: "landscape",
        title: "Investigate a landscape",
        question:
          "Choose a natural feature in this country, such as a river, hill, lake, or coastline. Locate it and explain one way it affects a nearby place.",
        guidance:
          "The learner chooses a feature that exists; a coastline or mountain is not required. Ask for evidence connecting the feature to a specific nearby place.",
      },
      {
        id: "map",
        title: "Compare two maps",
        question:
          "Compare a physical map and a political map of the country. What does each show? Give one question that each map helps you answer.",
        guidance:
          "Physical maps describe natural features; political maps emphasize administrative areas and borders. Map styles vary, and borders may be disputed. Accept observations supported by the actual maps.",
      },
      {
        id: "connection",
        title: "Follow a connection",
        question:
          "Trace a possible route from this country to another place. What land or water would it cross? Explain what you can and cannot learn from a map alone.",
        guidance:
          "This is a map-reading exercise, not travel advice. A line on a map does not establish transport access, border permissions, safety, or real travel conditions.",
      },
    ],
    life: [
      {
        id: "place",
        title: "Choose a place",
        question:
          "Choose a city, town, or other populated place in this country. Locate it and describe something you learned from a local source.",
        guidance:
          "Look for a named, located place and evidence from an identifiable source. A government, museum, library, or local organization can provide useful context.",
      },
      {
        id: "language",
        title: "Listen to local voices",
        question:
          "Find an example of a language used in that place. Who is the source, and what can their example tell you? What does it leave out?",
        guidance:
          "A single speaker or source does not represent an entire country. Do not ask learners to contact strangers or provide personal information.",
      },
      {
        id: "practice",
        title: "Research a specific example",
        question:
          "Choose a local food, celebration, building, or craft. Describe its connection to a particular place or community, using a source.",
        guidance:
          "Accept specific, sourced examples. Avoid presenting one practice as universal or suggesting that traditions never change. Religious or cultural participation is not required.",
      },
      {
        id: "compare",
        title: "Ask another question",
        question:
          "Compare what two sources say about your example. Where do they agree or differ? Write one new question you would investigate.",
        guidance:
          "Assess the use of evidence, the authors and dates of the sources, and the learner’s follow-up question. There is no single fixed answer.",
      },
    ],
  };

export type CountryAssignment = {
  number: number;
  country: Country;
  theme: ProjectTheme;
  title: string;
  prompts: readonly ResearchPrompt[];
};

export function createAssignments(
  countries: readonly Country[],
  theme: ProjectTheme,
): CountryAssignment[] {
  if (!researchPrompts[theme]) throw new Error("Choose a valid project topic.");
  if (
    !countries.length ||
    countries.length > 20 ||
    new Set(countries.map((country) => country.id)).size !== countries.length
  )
    throw new Error("Choose between 1 and 20 different countries.");
  return countries.map((country, index) => ({
    number: index + 1,
    country,
    theme,
    title: projectThemes.find((entry) => entry.id === theme)!.title,
    prompts: researchPrompts[theme].map((prompt) => ({ ...prompt })),
  }));
}

export function countryReference(country: Country) {
  const facts = [
    { label: "Continent in our dataset", value: country.continent },
    {
      label: "Capitals and government seats",
      value: country.capitals
        .map((capital) => `${capital.name} (${capital.role})`)
        .join("; "),
    },
    { label: "Languages in our dataset", value: country.languages.join(", ") },
    {
      label: "Currencies in our dataset",
      value: country.currencies
        .map((currency) => `${currency.name} (${currency.code})`)
        .join(", "),
    },
  ];
  const notes = [
    ...country.capitals.flatMap((capital) =>
      capital.note ? [`${capital.name}: ${capital.note}`] : [],
    ),
    ...(country.note ? [country.note] : []),
  ];
  const sources = [
    ...new Set([
      country.sources.geography,
      country.sources.languages,
      country.sources.currencies,
      ...country.capitals.map((capital) => capital.source),
    ]),
  ];
  return { facts, notes, sources };
}
