import type { ReactNode } from "react";

export function Notice({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <aside className="rounded-control border border-border bg-brand-soft p-4 text-sm">
      <p className="font-semibold text-foreground">{title}</p>
      <div className="mt-1 text-muted">{children}</div>
    </aside>
  );
}
