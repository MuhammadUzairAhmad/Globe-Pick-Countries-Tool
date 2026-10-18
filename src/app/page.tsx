import Link from "next/link";
import { Container } from "@/components/layout/container";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon, type IconName } from "@/components/ui/icon";
import { HomepageSpinner } from "@/features/spinner/components/homepage-spinner";
import { countries } from "@/data/countries";
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
      <HomepageSpinner countries={countries}>
        <div className="lg:self-start lg:pt-12">
          <p className="text-sm font-medium text-brand">
            Geography for curious minds
          </p>
          <h1 className="mt-3">
            Spin the wheel.
            <br />
            <span className="text-brand">Discover a country.</span>
          </h1>
          <p className="mt-4 max-w-reading text-lg text-muted">
            Find a country for your next game or school project. Spin, explore
            its facts, and see where it takes you.
          </p>
          <div className="mt-4 flex flex-wrap gap-x-5">
            <Link
              href="/random-country-generator"
              className="inline-flex min-h-touch items-center gap-2 text-sm font-semibold text-brand underline underline-offset-4"
            >
              Pick several countries <Icon name="arrow" className="size-4" />
            </Link>
            <Link
              href="/random-capital-generator"
              className="inline-flex min-h-touch items-center text-sm font-semibold text-brand underline underline-offset-4"
            >
              Practice capitals
            </Link>
          </div>
          <p className="mt-3 hidden text-xs text-muted lg:block">
            Free to use. No account needed.
          </p>
        </div>
      </HomepageSpinner>
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
