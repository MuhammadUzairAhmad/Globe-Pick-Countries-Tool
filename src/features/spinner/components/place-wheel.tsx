import type { Ref } from "react";
import type { Place } from "@/features/generator/types";
import { sectorPath, wheelPoint } from "../lib/wheel";

const fills = ["fill-brand-soft", "fill-brand/15", "fill-brand/25"];
const denseFills = ["fill-brand/15", "fill-brand/25", "fill-brand/35"];

export function PlaceWheel({
  pool,
  rotation,
  wheelRef,
  winnerId,
}: {
  pool: readonly Place[];
  rotation: number;
  wheelRef: Ref<HTMLDivElement>;
  winnerId?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className="relative isolate mx-auto aspect-square w-full max-w-sm sm:max-w-md xl:max-w-xl"
    >
      <div className="absolute inset-5 -z-10 rounded-full bg-brand/10 blur-2xl" />
      <div className="size-full overflow-hidden rounded-full">
        <div
          ref={wheelRef}
          style={{ transform: `rotate(${rotation}deg)` }}
          className="size-full"
        >
          <svg viewBox="0 0 320 320" className="size-full overflow-visible">
            <circle
              cx="160"
              cy="160"
              r="153"
              className="fill-page stroke-border"
              strokeWidth="1"
            />
            <circle
              cx="160"
              cy="160"
              r="148"
              className="fill-none stroke-brand/25"
              strokeWidth="0.75"
            />
            {pool.length === 1 ? (
              <circle
                cx="160"
                cy="160"
                r="140"
                className={
                  winnerId === pool[0].id
                    ? "fill-brand stroke-brand-strong"
                    : "fill-brand-soft stroke-border"
                }
              />
            ) : (
              pool.map((place, index) => {
                const won = place.id === winnerId;
                const angle = ((index + 0.5) * 360) / pool.length;
                const point = wheelPoint(angle, pool.length <= 6 ? 90 : 100);
                const name =
                  place.kind === "city" ? place.city.name : place.country.name;
                const label = name.length > 17 ? `${name.slice(0, 15)}…` : name;
                return (
                  <g key={place.id}>
                    <path
                      d={sectorPath(index, pool.length)}
                      className={
                        won
                          ? "fill-brand stroke-on-brand"
                          : `${(pool.length > 24 ? denseFills : fills)[index % fills.length]} stroke-surface`
                      }
                      strokeWidth={won ? 1.1 : pool.length > 24 ? 0.25 : 0.8}
                    />
                    {pool.length <= 24 && (
                      <text
                        x={point.x}
                        y={point.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${angle - 90}, ${point.x}, ${point.y})`}
                        className={won ? "fill-on-brand" : "fill-foreground"}
                        fontSize={pool.length > 12 ? 7 : 10}
                        fontWeight="500"
                      >
                        {label}
                      </text>
                    )}
                  </g>
                );
              })
            )}
            {!pool.length && (
              <circle
                cx="160"
                cy="160"
                r="140"
                className="fill-page stroke-border"
                strokeDasharray="4 5"
              />
            )}
          </svg>
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="flex size-16 flex-col items-center justify-center rounded-full border-4 border-surface bg-page shadow-card ring-4 ring-brand/10 sm:size-24 xl:size-28">
          <span className="text-xl font-semibold text-brand sm:text-2xl xl:text-3xl">
            G
          </span>
          <span className="text-[8px] font-medium text-muted sm:text-[10px] xl:text-xs">
            GlobePick
          </span>
        </div>
      </div>
      <svg
        viewBox="0 0 30 34"
        className="absolute -top-1 left-1/2 h-8 w-7 -translate-x-1/2 fill-brand stroke-surface sm:h-10 sm:w-9 xl:h-12 xl:w-10"
        strokeWidth="2"
      >
        <path d="M2 2H28L15 31Z" />
      </svg>
    </div>
  );
}
