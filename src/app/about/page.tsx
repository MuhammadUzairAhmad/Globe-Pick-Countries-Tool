import { Container } from "@/components/layout/container";
import { PageIntro } from "@/components/layout/page-intro";
import { Card } from "@/components/ui/card";
import { Notice } from "@/components/ui/notice";
import { DatasetExplanation } from "@/components/content/dataset-explanation";
import manifest from "@/data/countries/manifest.json";
import { pageMetadata } from "@/lib/seo/site";

export const metadata = pageMetadata("/about");

export default function AboutPage() {
  return (
    <Container className="py-section">
      <PageIntro
        eyebrow="About the project"
        title="About GlobePick"
        description="Pick a country, practice capitals, or find a starting point for a geography lesson."
      />
      <div className="mt-8 max-w-reading space-y-6">
        <Card>
          <h2 className="text-card-title">What you can do</h2>
          <p className="mt-4 text-muted">
            Generate random countries, capitals, or cities for games, school
            projects, and your own practice. Narrow the choices by continent,
            avoid repeats, and save favorites in your browser. Hide capital
            answers when you want to test yourself. For a classroom activity,
            create unique country assignments and print research worksheets with
            optional teacher notes.
          </p>
          <p className="mt-4 text-muted">
            You don’t need an account. Your settings and saved places stay in
            your browser. Share a result using a link, and the person opening it
            will see the same selection.
          </p>
        </Card>
        <div id="sources" className="scroll-mt-6">
          <DatasetExplanation />
        </div>
        <Card>
          <h2 className="text-card-title">Sources and review limits</h2>
          <p className="mt-4 text-muted">
            The adapted country database is based on{" "}
            <a
              href={`https://github.com/mledoze/countries/tree/${manifest.upstream["mledoze/countries"].commit}`}
              className="text-brand underline underline-offset-4"
            >
              the mledoze/countries dataset
            </a>
            . Names, language lists, approximate country coordinates, and most
            currency and capital records follow that community dataset. We check
            that records are complete and that flags and sources are available.
            We have not independently verified every fact. Data reviewed on 14
            October 2026.
          </p>
          <p className="mt-4 text-muted">
            We reviewed exceptional capital roles and transitions against the
            primary sources below: South Africa, Sri Lanka, Bolivia, Benin,
            Eswatini, Malaysia, the Netherlands, Switzerland, Nauru, Equatorial
            Guinea, Indonesia, and Palestine. Equatorial Guinea uses Ciudad de
            la Paz following its January 2026 designation; Sri Lanka’s Kotte and
            Colombo are labeled by role. Zimbabwe’s currency record and
            Micronesia’s missing currency were corrected. The observer-state
            classification follows the{" "}
            <a
              href={manifest.classificationSource}
              className="text-brand underline underline-offset-4"
            >
              United Nations
            </a>
            , rather than the upstream membership flag.
          </p>
          <details className="mt-4">
            <summary className="min-h-touch cursor-pointer py-2 text-sm font-semibold text-brand">
              Review sources and field references
            </summary>
            <ul className="mt-3 space-y-3 text-sm">
              {Object.entries(manifest.sources).map(([id, url]) => (
                <li key={id}>
                  <a
                    href={url}
                    className="break-words text-brand underline underline-offset-4"
                  >
                    {(
                      {
                        za: "South Africa: capital roles",
                        lk: "Sri Lanka: Kotte",
                        "lk-colombo": "Sri Lanka: Colombo",
                        bo: "Bolivia: Sucre and La Paz",
                        nl: "Netherlands: capital and government seat",
                        my: "Malaysia: Kuala Lumpur and Putrajaya",
                        bj: "Benin: Porto-Novo and Cotonou",
                        sz: "Eswatini: Parliament in Lobamba",
                        "sz-mbabane": "Eswatini: Mbabane",
                        ch: "Switzerland: federal city",
                        gq: "Equatorial Guinea: capital designation",
                        id: "Indonesia: capital transition",
                        ps: "Jerusalem: status and capital claims",
                        fm: "Micronesia: currency",
                        nr: "Nauru: no official capital",
                        zw: "Zimbabwe: currency correction",
                      } as Record<string, string>
                    )[id] ?? id}
                  </a>
                </li>
              ))}
            </ul>
          </details>
          <p className="mt-4 text-sm text-muted">
            The Japan example’s capital role is checked against{" "}
            <a
              href="https://www.studyinjapan.go.jp/en/why/47prefectures/kanto/tokyo.html"
              className="text-brand underline underline-offset-4"
            >
              the official Study in Japan Tokyo page
            </a>
            . No population estimates or travel advice are included.
          </p>
        </Card>
        <Card>
          <h2 className="text-card-title">City and town coverage</h2>
          <p className="mt-4 text-muted">
            City mode uses 7,194 selected city and town points from Natural
            Earth, covering 194 of our 195 countries. Nauru has no retained
            records. The source favors regional significance, so coverage is
            uneven and is not a complete city register. Each eligible record is
            equally likely; countries with more records appear more often when
            all countries are selected.
          </p>
          <p className="mt-4 text-muted">
            We retain source names, administrative labels, and approximate
            points, excluding historic places, stations, outside-scope country
            references, and exact name/country/region duplicates. Source capital
            and population fields are not presented as current facts.{" "}
            <a
              href="/data/cities/manifest.json"
              className="text-brand underline underline-offset-4"
            >
              Review coverage and provenance
            </a>
            ,{" "}
            <a
              href="/data/cities/cities.json"
              className="text-brand underline underline-offset-4"
              download
            >
              download city records
            </a>
            , or read the{" "}
            <a
              href="/licenses/cities-Natural-Earth.txt"
              className="text-brand underline underline-offset-4"
            >
              public-domain source notice
            </a>
            .
          </p>
        </Card>
        <Card>
          <h2 className="text-card-title">Attribution and reusable data</h2>
          <ul className="mt-4 space-y-4 text-sm text-muted">
            <li>
              Country database: mledoze/countries contributors,{" "}
              <a
                href="/licenses/countries-ODbL.txt"
                className="text-brand underline underline-offset-4"
              >
                ODbL 1.0
              </a>
              . Download the{" "}
              <a
                href="/data/countries.json"
                download
                className="text-brand underline underline-offset-4"
              >
                adapted database
              </a>{" "}
              and{" "}
              <a
                href="/data/manifest.json"
                download
                className="text-brand underline underline-offset-4"
              >
                source manifest
              </a>
              . Our adaptation is made available under the same license.
            </li>
            <li>
              Flag renditions:{" "}
              <a
                href="https://github.com/lipis/flag-icons"
                className="text-brand underline underline-offset-4"
              >
                lipis/flag-icons
              </a>
              ,{" "}
              <a
                href="/licenses/flags-MIT.txt"
                className="text-brand underline underline-offset-4"
              >
                MIT license
              </a>
              , hosted with the site. These are standardized 4:3 renditions.
            </li>
            <li>
              Land outline:{" "}
              <a
                href="https://www.naturalearthdata.com/about/terms-of-use/"
                className="text-brand underline underline-offset-4"
              >
                Natural Earth 1:110m land, public domain
              </a>
              . It depicts land, not national borders. Markers show approximate
              country centers; small islands may be absent at this scale.
            </li>
            <li>
              Geist font: Geist Project Authors, self-hosted under the{" "}
              <a
                href="/licenses/geist-OFL.txt"
                className="text-brand underline underline-offset-4"
              >
                SIL Open Font License 1.1
              </a>
              . The decorative atlas globe is an original illustration.
            </li>
          </ul>
        </Card>
        <Notice title="Corrections during local development">
          Report a correction to the project maintainer through the channel that
          provided this preview. Include the country, field, and a reliable
          source. A public corrections contact, creator identity, and
          hosting-specific policies must be added before public launch.
        </Notice>
      </div>
    </Container>
  );
}
