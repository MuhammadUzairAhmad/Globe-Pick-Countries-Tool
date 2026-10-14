export function CapitalRoleBadge({ role }: { role: string }) {
  return (
    <span className="inline-flex rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand-strong">
      {role}
    </span>
  );
}
