import { launchBlockers } from "../src/lib/seo/production-checks.ts";

import nextEnvironment from "@next/env";
const { loadEnvConfig } = nextEnvironment;

loadEnvConfig(process.cwd());
const blockers = launchBlockers(process.env);
if (blockers.length) {
  console.log("Public launch is pending:");
  for (const blocker of blockers) console.log(`- ${blocker}`);
  process.exitCode = 1;
} else {
  console.log(
    "Required public launch configuration is present. Confirm the public policy/contact content, run production verification against this build, deploy to the selected host, and verify the owned domain in Search Console.",
  );
}
