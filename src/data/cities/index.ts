import data from "./cities.json";
import type { City } from "@/features/generator/types";

// Imported only by the city route, never by the shared country/capital modules.
export const cities = data as City[];
