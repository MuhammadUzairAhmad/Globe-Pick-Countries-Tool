import Image from "next/image";
import type { Country } from "../types";

export function PlaceIdentity({
  country,
  title,
  subtitle,
  heading = false,
}: {
  country: Country;
  title: string;
  subtitle?: string;
  heading?: boolean;
}) {
  const Name = heading ? "h3" : "p";
  return (
    <div className="flex min-w-0 items-center gap-3">
      <Image
        src={country.flag}
        width={48}
        height={36}
        alt=""
        unoptimized
        className="h-9 w-12 shrink-0 rounded border border-border object-contain"
      />
      <div className="min-w-0">
        <Name className="break-words font-semibold">{title}</Name>
        {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
      </div>
    </div>
  );
}
