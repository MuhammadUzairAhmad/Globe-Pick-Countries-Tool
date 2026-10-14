import data from "./countries.json";
import type { Country } from "@/features/generator/types";

// Validated before every production build by scripts/validate-geography-data.ts.
export const countries = data as Country[];
