export type NavigationLink = { path: string; label: string };
export type NavigationGroup = { title: string; links: NavigationLink[] };

export function siteNavigation(
  pages: readonly { path: string; published: boolean }[],
) {
  function link(path: string, label: string): NavigationLink {
    if (
      !pages.some((page) => page.published && page.path === path.split("#")[0])
    )
      throw new Error(`Navigation points to an unpublished page: ${path}`);
    return { path, label };
  }
  const generators = {
    title: "Generators",
    links: [
      link("/random-country-generator", "Countries"),
      link("/random-capital-generator", "Capitals"),
      link("/random-city-generator", "Cities"),
    ],
  };
  const worksheets = link("/country-project-generator", "Worksheets");
  const regions = {
    title: "Pick a region",
    links: [
      link("/random-country-generator/africa", "Africa"),
      link("/random-country-generator/asia", "Asia"),
      link("/random-country-generator/europe", "Europe"),
    ],
  };
  const learning = {
    title: "Learning guides",
    links: [
      link("/countries/japan", "Japan activities"),
      link("/countries/south-africa", "South Africa’s capitals"),
      link("/#learning", "More learning ideas"),
    ],
  };
  return {
    generators: [generators],
    explore: [regions, learning],
    worksheets,
    mobile: [
      { ...generators, links: [...generators.links, worksheets] },
      regions,
      learning,
    ],
    footer: [
      generators,
      { title: "Classroom & learning", links: [worksheets, ...learning.links] },
      {
        title: "About GlobePick",
        links: [
          link("/about", "About and sources"),
          link("/privacy", "Privacy"),
          link("/terms", "Terms of use"),
        ],
      },
    ],
  };
}
