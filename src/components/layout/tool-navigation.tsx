import Link from "next/link";

const tools = [
  { path: "/random-country-generator", label: "Countries" },
  { path: "/random-capital-generator", label: "Capitals" },
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
          aria-current={current === tool.path ? "page" : undefined}
          className={
            current === tool.path
              ? "inline-flex min-h-touch items-center rounded-control bg-brand px-5 text-sm font-semibold text-surface"
              : "inline-flex min-h-touch items-center rounded-control border border-border bg-surface px-5 text-sm font-medium text-muted hover:bg-brand-soft"
          }
        >
          {tool.label}
        </Link>
      ))}
    </nav>
  );
}
