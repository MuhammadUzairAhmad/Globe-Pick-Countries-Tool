export const regionalPages = [
  {
    slug: "africa",
    path: "/random-country-generator/africa",
    continent: "Africa",
    title: "Random African Country Generator",
    description:
      "Pick countries from Africa for map practice, research, or a geography game. Start with the Africa filter, choose a set, and explore each result.",
    activityTitle: "Compare inland and coastal locations",
    activity:
      "Pick three countries. Locate each in an atlas and decide whether it has a coastline. For an inland country, find a route on a map to a coast and name the countries it crosses. Explain what a map can tell you and what still needs a source. Do not treat a mapped route as travel advice.",
    discussion:
      "Use different map scales to compare what you can see. A continent-wide view is useful for relative location; a country map can reveal details hidden at that scale. Record which map supported each observation.",
  },
  {
    slug: "asia",
    path: "/random-country-generator/asia",
    continent: "Asia",
    title: "Random Asian Country Generator",
    description:
      "Pick countries from Asia for an atlas activity, capital practice, or a research project. The generator starts with Asia selected and keeps your results unique.",
    activityTitle: "Investigate a boundary convention",
    activity:
      "Pick two countries and locate them in two atlases. Compare how the atlases group countries into continents. If they use different conventions, describe the difference without calling either map a complete account of a place. Our filtering model puts Russia in Europe and Türkiye, Cyprus, Armenia, Georgia, Azerbaijan, and Kazakhstan in Asia.",
    discussion:
      "Then compare an island country with a country that has land neighbors. Use map evidence to explain one difference in relative location. A nearby island is a valid comparison when a country has no land border.",
  },
  {
    slug: "europe",
    path: "/random-country-generator/europe",
    continent: "Europe",
    title: "Random European Country Generator",
    description:
      "Pick countries from Europe for geography practice or classroom activities. Start with Europe selected, keep repeats off, and save or share a set.",
    activityTitle: "Separate geography from membership",
    activity:
      "Pick three countries and locate them in an atlas. Research whether each is a member of a regional organization of your choice, using that organization’s current member list. Keep the geographic grouping separate from membership: a Europe filter does not tell you whether a country belongs to the European Union.",
    discussion:
      "Build a comparison table with columns for map location, organization membership, source, and date. If maps group a transcontinental country differently, explain the convention you used. Our dataset groups Russia with Europe.",
  },
] as const;

export const countryGuides = [
  {
    slug: "japan",
    id: "JP",
    title: "Japan Geography Activities: Maps, Tokyo, and Sources",
    description:
      "Explore Japan through map comparisons, a Tokyo research activity, and evidence-based source questions. Includes reference facts and linked primary sources.",
    introduction:
      "Use Japan as a starting point for learning how maps and sources answer different questions. Begin with its location and capital, then investigate a particular place rather than assuming a country can be described by one fact or one voice.",
    contextTitle: "Start with Tokyo, then widen the view",
    context:
      "Tokyo is Japan’s capital, as identified by the government-approved Study in Japan website. A capital label helps locate government institutions, but it does not explain the whole country. Treat the reference facts below as a starting point and use local sources to explore a specific place.",
    activities: [
      {
        title: "Compare a locator map with a detailed map",
        text: "Find Japan and Tokyo in an atlas. Sketch a locator map with surrounding water and nearby places. Next, look at a more detailed Tokyo map. Write one question that each map can answer and one that it cannot. Keep scale and the map’s purpose in mind.",
      },
      {
        title: "Research a place beyond the capital",
        text: "Choose another city or town from our Japan-filtered city tool. Locate it, compare its position with Tokyo, and find a source from a museum, local authority, library, or community organization. Describe one specific example and explain why it should not be treated as typical of everyone in Japan.",
      },
      {
        title: "Make an evidence notebook",
        text: "For each fact you record, note the source, author or organization, and date. Compare a map, the Study in Japan page, and a local source. Do they answer the same question? When they differ, decide what extra evidence would help rather than choosing whichever answer is shortest.",
      },
    ],
    sources: [
      {
        label: "Study in Japan: Tokyo",
        url: "https://www.studyinjapan.go.jp/en/why/47prefectures/kanto/tokyo.html",
      },
    ],
  },
  {
    slug: "south-africa",
    id: "ZA",
    title: "South Africa Geography Activities: Understand the Three Capitals",
    description:
      "Learn the roles of Pretoria, Cape Town, and Bloemfontein, then investigate maps and source labels. Includes practical activities and primary references.",
    introduction:
      "South Africa is a useful example of why a capital question needs context. Instead of memorizing an unlabeled list, connect each city with its role and the evidence behind that label. Then use those cities as starting points for a wider map investigation.",
    contextTitle: "Three capital roles, one careful answer",
    context:
      "The South African Government identifies Pretoria as the administrative capital, Cape Town as the legislative capital, and Bloemfontein as the judicial capital and home of the Supreme Court of Appeal. The Constitutional Court is in Johannesburg. Those distinctions matter when comparing sources: a court location and a traditional capital label are not interchangeable.",
    activities: [
      {
        title: "Build a city-and-role chart",
        text: "Make columns for city, capital role, institution, and source. Use the government’s provinces page to connect the three capital labels with their institutions. Add the Constitutional Court’s location using the Department of Justice source. Explain why ‘What is the capital?’ needs a more specific answer here.",
      },
      {
        title: "Compare locations at two scales",
        text: "Locate Pretoria, Cape Town, Bloemfontein, and Johannesburg in an atlas. Describe their relative positions and the provinces listed by your source. Change the map scale and identify what becomes easier or harder to see. A city point does not show its whole administrative area.",
      },
      {
        title: "Check an oversimplified quiz answer",
        text: "Write a quiz question that names the role being tested, then exchange it with another learner. Compare your wording with a question that asks only for ‘the capital’. Record which answers you would accept and why. Finish by researching a specific place or community, using a dated source rather than generalizing from a national label.",
      },
    ],
    sources: [
      {
        label: "South African Government: provinces and capital roles",
        url: "https://www.gov.za/about-sa/south-africas-provinces",
      },
      {
        label: "Department of Justice: courts in South Africa",
        url: "https://www.justice.gov.za/about/sa-courts.html",
      },
    ],
  },
] as const;

export function findRegion(slug: string) {
  return regionalPages.find((region) => region.slug === slug);
}
export function findCountryGuide(slug: string) {
  return countryGuides.find((guide) => guide.slug === slug);
}
