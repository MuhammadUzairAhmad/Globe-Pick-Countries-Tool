export function PageIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-reading">
      <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-brand">
        {eyebrow}
      </p>
      <h1>{title}</h1>
      <p className="mt-5 max-w-reading text-lg text-muted">{description}</p>
    </div>
  );
}
