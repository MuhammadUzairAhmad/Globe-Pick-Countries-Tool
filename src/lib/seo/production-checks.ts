export function inspectPageHtml(
  html: string,
  path: string,
  canonicalOrigin: string,
  indexable: boolean,
) {
  const issues: string[] = [];
  if ((html.match(/<h1\b/g) ?? []).length !== 1)
    issues.push("Expected one H1.");
  if (!/<title>[^<]+<\/title>/.test(html)) issues.push("Missing page title.");
  if (!/<meta[^>]+name="description"[^>]+content="[^"]+"/.test(html))
    issues.push("Missing description.");
  const canonical = html.match(
    /<link[^>]+rel="canonical"[^>]+href="([^"]+)"/,
  )?.[1];
  try {
    if (
      !canonical ||
      new URL(canonical).href !== new URL(path, canonicalOrigin).href
    )
      throw new Error();
  } catch {
    issues.push("Wrong canonical origin or path.");
  }
  const robots =
    html.match(/<meta[^>]+name="robots"[^>]+content="([^"]+)"/)?.[1] ?? "";
  if (
    indexable
      ? !robots.includes("index,") || robots.includes("noindex")
      : !robots.includes("noindex")
  )
    issues.push("Wrong indexing policy.");
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  if (new Set(ids).size !== ids.length) issues.push("Duplicate HTML IDs.");
  if (!ids.includes("main-content") || !html.includes('href="#main-content"'))
    issues.push("Missing skip-link destination.");
  for (const image of html.matchAll(/<img\b[^>]*>/g))
    if (!/\balt=/.test(image[0])) issues.push("Image without alt attribute.");
  const schemas: unknown[] = [];
  for (const script of html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    try {
      schemas.push(JSON.parse(script[1]));
    } catch {
      issues.push("Invalid JSON-LD.");
    }
  }
  if (path.startsWith("/random-")) {
    const kinds = schemas.map(
      (schema) => (schema as { "@type"?: string })["@type"],
    );
    if (!kinds.includes("BreadcrumbList") || !kinds.includes("WebApplication"))
      issues.push("Picker schema missing.");
  }
  return { issues, canonical, schemas };
}

export function launchBlockers(
  env: Record<string, string | undefined>,
): string[] {
  const blockers: string[] = [];
  try {
    const origin = new URL(env.NEXT_PUBLIC_SITE_URL ?? "");
    if (
      origin.protocol !== "https:" ||
      origin.username ||
      origin.password ||
      origin.pathname !== "/" ||
      origin.search ||
      origin.hash ||
      [
        "localhost",
        "127.0.0.1",
        "[::1]",
        "example.com",
        "example.org",
        "example.net",
      ].includes(origin.hostname) ||
      /\.(example|invalid|test)$/.test(origin.hostname)
    )
      throw new Error();
  } catch {
    blockers.push("Set the actual public HTTPS origin.");
  }
  if (!env.GLOBEPICK_OPERATOR_NAME?.trim())
    blockers.push("Provide the public maintainer/operator identity.");
  try {
    const contact = new URL(env.GLOBEPICK_CORRECTIONS_URL ?? "");
    if (
      contact.protocol !== "https:" &&
      !(
        contact.protocol === "mailto:" &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.pathname)
      )
    )
      throw new Error();
    if (contact.username || contact.password) throw new Error();
  } catch {
    blockers.push("Provide a real HTTPS or mailto corrections contact.");
  }
  if (!env.GLOBEPICK_HOSTING_PROVIDER?.trim())
    blockers.push("Choose the hosting provider and review its data practices.");
  if (env.GLOBEPICK_POLICIES_REVIEWED !== "true")
    blockers.push(
      "Review and update the public privacy/terms for the selected host.",
    );
  return blockers;
}
