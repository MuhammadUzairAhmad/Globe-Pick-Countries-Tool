import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon, type IconName } from "@/components/ui/icon";
import { AtlasArt } from "@/components/content/atlas-art";
import { ExampleResult } from "@/components/content/example-result";
import { RelatedLearning } from "@/components/content/related-learning";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata("/");

const ideas: {
  icon: IconName;
  audience: string;
  title: string;
  text: string;
  prompt: string;
}[] = [
  {
    icon: "book",
    audience: "For the classroom",
    title: "Research a country",
    text: "Pick a country and find out about its people, languages, and neighbors.",
    prompt:
      "Choose a country from an atlas. Identify its capital, a neighboring country or nearby island, and a language spoken there. Record a source for each answer.",
  },
  {
    icon: "compass",
    audience: "For independent learners",
    title: "Trace a route",
    text: "See which countries and oceans lie between you and a place you’ve picked.",
    prompt:
      "Find Japan and Tokyo in an atlas. Trace a route from your country. Which seas, countries, or oceans would the route cross?",
  },
  {
    icon: "globe",
    audience: "For friends and family",
    title: "Play a guessing game",
    text: "Take turns giving clues about a country. How quickly can everyone guess it?",
    prompt:
      "One person chooses a country and gives three clues without saying its name. Everyone else can ask one question before making a guess.",
  },
];

export default function Home() {
  return (
    <Container>
      <section className="grid items-center gap-8 py-section lg:grid-cols-2 lg:gap-12">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-muted">
            <span className="size-1.5 rounded-full bg-accent" />
            Geography for curious minds
          </p>
          <h1 className="mt-6">
            Pick a country.
            <br />
            <span className="text-brand">Test your geography.</span>
          </h1>
          <p className="mt-5 max-w-reading text-lg text-muted">
            Choose a random country for your next game or school project, or see
            how many capitals you remember.
          </p>
          <p className="mt-4 max-w-reading text-base text-muted">
            Filter by continent, pick several places at once, and save the ones
            you want to learn more about.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <ButtonLink href="/random-country-generator">
              Pick a random country
              <Icon name="arrow" className="size-4" />
            </ButtonLink>
            <ButtonLink href="/random-capital-generator" variant="secondary">
              Practice capitals
            </ButtonLink>
          </div>
          <p className="mt-5 text-xs text-muted">
            Free to use. No account needed.
          </p>
        </div>
        <div className="relative overflow-hidden rounded-card border border-border bg-surface p-6">
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-widest text-muted">
            <span>Explore the world</span>
            <Icon name="compass" className="size-5 text-brand" />
          </div>
          <AtlasArt />
          <div className="flex items-end justify-between gap-4 border-t border-border pt-5">
            <div>
              <p className="text-card-title font-semibold">
                195 countries to choose from
              </p>
              <p className="mt-1 text-sm text-muted">Which one will you get?</p>
            </div>
            <span className="hidden size-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand sm:flex">
              <Icon name="arrow" />
            </span>
          </div>
        </div>
      </section>
      <section
        aria-labelledby="building-title"
        className="border-t border-border py-section"
      >
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-brand">
              A simple toolkit
            </p>
            <h2 id="building-title" className="mt-3 tracking-tight">
              What would you like to pick?
            </h2>
          </div>
          <p className="text-sm text-muted">
            Explore countries, practice capitals, or make a worksheet.
          </p>
        </div>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          <Card>
            <div className="flex items-center justify-between gap-3">
              <span className="flex size-11 items-center justify-center rounded-control bg-brand-soft text-brand">
                <Icon name="globe" className="size-6" />
              </span>
            </div>
            <h3 className="mt-5">Random country generator</h3>
            <p className="mt-3 text-muted">
              Get one country or a set of up to 20. Choose a continent, leave
              out countries you don’t want, and keep repeats off for a fresh
              pick each time.
            </p>
            <ButtonLink href="/random-country-generator" className="mt-5">
              Pick a country
            </ButtonLink>
          </Card>
          <Card>
            <div className="flex items-center justify-between gap-3">
              <span className="flex size-11 items-center justify-center rounded-control bg-accent-soft text-accent">
                <Icon name="pin" className="size-6" />
              </span>
            </div>
            <h3 className="mt-5">Random capital generator</h3>
            <p className="mt-3 text-muted">
              Learn a capital and its country, or hide the answers and test
              yourself. Check your guess when you’re ready.
            </p>
            <ButtonLink
              href="/random-capital-generator"
              variant="secondary"
              className="mt-5"
            >
              Practice capitals
            </ButtonLink>
          </Card>
          <Card>
            <span className="flex size-11 items-center justify-center rounded-control bg-accent-soft text-accent">
              <Icon name="compass" className="size-6" />
            </span>
            <h3 className="mt-5">Random city generator</h3>
            <p className="mt-3 text-muted">
              Choose a country and discover a city or town to locate on a map.
              Clear country and region labels help you tell places with the same
              name apart.
            </p>
            <ButtonLink
              href="/random-city-generator"
              prefetch={false}
              variant="secondary"
              className="mt-5"
            >
              Pick a city
            </ButtonLink>
          </Card>
          <Card>
            <span className="flex size-11 items-center justify-center rounded-control bg-brand-soft text-brand">
              <Icon name="book" className="size-6" />
            </span>
            <h3 className="mt-5">Country project generator</h3>
            <p className="mt-3 text-muted">
              Create a different country assignment for each learner. Choose
              research questions, preview the worksheets, and print with
              optional teacher notes.
            </p>
            <ButtonLink
              href="/country-project-generator"
              variant="secondary"
              className="mt-5"
            >
              Create worksheets
            </ButtonLink>
          </Card>
        </div>
      </section>
      <section
        id="learning"
        aria-labelledby="learning-title"
        className="scroll-mt-6 border-t border-border py-section"
      >
        <p className="text-xs font-semibold uppercase tracking-widest text-brand">
          Learning ideas
        </p>
        <h2 id="learning-title" className="mt-3 tracking-tight">
          Three activities to try
        </h2>
        <p className="mt-3 text-muted">
          Use your results and an atlas to get started.
        </p>
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {ideas.map((idea) => (
            <Card key={idea.title}>
              <Icon name={idea.icon} className="size-6 text-brand" />
              <p className="mt-5 text-xs font-medium text-muted">
                {idea.audience}
              </p>
              <h3 className="mt-2">{idea.title}</h3>
              <p className="mt-3 text-sm text-muted">{idea.text}</p>
              <details className="group mt-5 border-t border-border pt-2">
                <summary className="flex min-h-touch cursor-pointer list-none items-center justify-between gap-2 text-sm font-semibold text-brand">
                  Try this activity
                  <span
                    aria-hidden="true"
                    className="text-lg group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="pb-2 text-sm text-muted">{idea.prompt}</p>
              </details>
            </Card>
          ))}
        </div>
      </section>
      <section
        aria-labelledby="approach-title"
        className="grid items-center gap-8 border-t border-border py-section lg:grid-cols-2 lg:gap-12"
      >
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-brand">
            Inside each result
          </p>
          <h2 id="approach-title" className="mt-3 tracking-tight">
            Get to know the place you picked
          </h2>
          <p className="mt-4 text-muted">
            Each result includes the capital, languages, currencies, and a map.
            Source links are there when you want to check a fact or read more.
          </p>
          <ul className="mt-6 space-y-3">
            {[
              "Facts with sources you can check",
              "A map to help you locate the country",
              "Favorites you can come back to",
            ].map((text) => (
              <li key={text} className="flex items-center gap-3 text-sm">
                <Icon name="check" className="size-5 shrink-0 text-brand" />
                {text}
              </li>
            ))}
          </ul>
          <Link
            href="/about#sources"
            className="mt-6 inline-flex min-h-touch items-center gap-2 text-sm font-semibold text-brand underline-offset-4 hover:underline"
          >
            Read about our sources
            <Icon name="arrow" className="size-4" />
          </Link>
        </div>
        <ExampleResult />
      </section>
      <div className="pb-section">
        <RelatedLearning />
      </div>
    </Container>
  );
}
