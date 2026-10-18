import Link from "next/link";

const tools = [
  { path: "/random-country-generator", label: "Countries" },
  { path: "/random-capital-generator", label: "Capitals" },
  { path: "/random-city-generator", label: "Cities" },
  { path: "/country-project-generator", label: "Country projects" },
] as const;

export function ToolNavigation({
  current,
}: {
  current: (typeof tools)[number]["path"];
}) {
  return (
    <nav
      aria-label="Geography tools"
      className="mt-6 flex flex-wrap gap-2 print:hidden"
    >
      {tools.map((tool) => (
        <Link
          key={tool.path}
          href={tool.path}
          prefetch={tool.path === "/random-city-generator" ? false : undefined}
          aria-current={current === tool.path ? "page" : undefined}
          className={`inline-flex min-h-touch items-center rounded-control px-5 text-sm ${
            current === tool.path
              ? "bg-brand font-semibold text-on-brand"
              : "border border-border bg-surface font-medium text-muted hover:bg-brand-soft"
          }`}
        >
          {tool.label}
        </Link>
      ))}
    </nav>
  );
}
