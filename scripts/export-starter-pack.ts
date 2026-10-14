import { readFileSync, writeFileSync } from "node:fs";
import type { Country } from "../src/features/generator/types.ts";
import { starterPackContent } from "../src/features/worksheets/starter-pack.ts";

const output = process.argv[2];
if (!output) throw new Error("Pass the intermediate JSON output path.");
const countries = JSON.parse(
  readFileSync("src/data/countries/countries.json", "utf8"),
) as Country[];
writeFileSync(output, JSON.stringify(starterPackContent(countries)) + "\n");
