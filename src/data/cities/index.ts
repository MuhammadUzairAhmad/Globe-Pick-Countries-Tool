import data from "./cities.json";
import type { City } from "@/features/generator/types";

// Imported by the city route and on demand when the homepage Cities tab opens.
export const cities = data as City[];
