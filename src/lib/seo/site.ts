import type { Metadata } from "next";

const configuredOrigin = process.env.NEXT_PUBLIC_SITE_URL;

function getOrigin(): URL {
  if (!configuredOrigin) return new URL("http://localhost:3000");
  const url = new URL(configuredOrigin);
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.pathname !== "/" ||
    url.search ||
    url.hash
  ) {
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin without credentials, a path, query, or fragment.",
    );
  }
  return url;
}

export const siteOrigin = getOrigin();
export const isPublicSite =
  Boolean(configuredOrigin) &&
  siteOrigin.protocol === "https:" &&
  !["localhost", "127.0.0.1", "[::1]"].includes(siteOrigin.hostname);

export const pages = [
  {
    path: "/",
    label: "Home",
    title: "GlobePick: Random Countries and Capital Practice",
    description:
      "Pick random countries, practice capitals, and save your favorite results. Free geography tools for games, school projects, and learning.",
    published: true,
    header: true,
    footer: false,
  },
  {
    path: "/about",
    label: "About and sources",
    title: "About GlobePick and Our Geography Sources",
    description:
      "Learn how GlobePick works, which countries are included, and where our geography facts come from.",
    published: true,
    header: true,
    footer: true,
  },
  {
    path: "/privacy",
    label: "Privacy",
    title: "GlobePick Privacy: Browser Saving and Sharing",
    description:
      "What GlobePick does with cookies, personal information, external links, and browser storage.",
    published: true,
    header: false,
    footer: true,
  },
  {
    path: "/terms",
    label: "Terms of use",
    title: "Using the GlobePick development preview",
    description:
      "The scope and limitations of the GlobePick geography learning preview.",
    published: true,
    header: false,
    footer: true,
  },
  {
    path: "/random-country-generator",
    label: "Random country",
    title: "Random Country Generator: Continent Filters and No Repeats",
    description:
      "Generate 1–20 random countries with continent filters, custom country pools, no repeats, browser favorites, and shareable results.",
    published: true,
    header: true,
    footer: false,
  },
  {
    path: "/country-project-generator",
    label: "Country projects",
    title: "Country Project Generator: Printable Geography Worksheets",
    description:
      "Create unique country research assignments with four questions, optional teacher notes, and printable A4 or US Letter worksheets. No account needed.",
    published: true,
    header: true,
    footer: false,
  },
  {
    path: "/random-capital-generator",
    label: "Random capital",
    title: "Random Capital Generator: Practice and Learn",
    description:
      "Generate random capital-country pairs, practice with guess and reveal, and explore the roles of capitals and government seats.",
    published: true,
    header: true,
    footer: false,
  },
] as const;

export type PagePath = (typeof pages)[number]["path"];

export function pageMetadata(path: PagePath): Metadata {
  const page = pages.find((entry) => entry.path === path)!;
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: path },
    robots: { index: isPublicSite && page.published, follow: true },
    openGraph: {
      title: page.title,
      description: page.description,
      url: path,
      siteName: "GlobePick",
      type: "website",
      images: [
        {
          url: "/social-preview.png",
          width: 1200,
          height: 630,
          alt: "GlobePick: Pick a country. Practice capitals.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: page.title,
      description: page.description,
      images: ["/social-preview.png"],
    },
  };
}
