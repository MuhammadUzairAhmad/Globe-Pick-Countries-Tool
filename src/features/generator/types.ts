export const continents = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "South America",
  "Oceania",
] as const;
export type Continent = (typeof continents)[number];
export type Mode = "country" | "capital" | "city";
export type City = {
  id: string;
  name: string;
  countryId: string;
  adminRegion: string;
  location: { lat: number; lng: number };
};
export type Capital = {
  id: string;
  name: string;
  role: string;
  note?: string;
  source: string;
};
export type Country = {
  id: string;
  slug: string;
  name: string;
  alternatives: string[];
  continent: Continent;
  classification: "UN member" | "UN observer representation";
  capitals: Capital[];
  languages: string[];
  currencies: { code: string; name: string }[];
  location: { lat: number; lng: number };
  flag: string;
  reviewed: string;
  sources: {
    identity: string;
    geography: string;
    languages: string;
    currencies: string;
  };
  note?: string;
};
export type Place =
  | { kind: "country"; id: string; countryId: string; country: Country }
  | {
      kind: "capital";
      id: string;
      countryId: string;
      country: Country;
      capital: Capital;
    }
  | {
      kind: "city";
      id: string;
      countryId: string;
      country: Country;
      city: City;
    };
export type Filters = {
  continent: Continent | "all";
  include: string[];
  exclude: string[];
  quantity: number;
  noRepeat: boolean;
  guess: boolean;
};
export type HistoryEntry = { id: string; at: number };
export type SavedState = {
  version: 1;
  filters: Filters;
  consumed: string[];
  history: HistoryEntry[];
  favorites: string[];
};
