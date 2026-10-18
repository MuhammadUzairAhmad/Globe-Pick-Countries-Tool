import type { Ref } from "react";
import type { Place } from "@/features/generator/types";
import { sectorPath, wheelPoint } from "../lib/wheel";

const fills = ["fill-brand-soft", "fill-accent-soft", "fill-surface"];
const denseFills = ["fill-brand/65", "fill-brand/25", "fill-accent/55"];

export function CountryWheel({
  pool,
  rotation,
  wheelRef,
}: {
  pool: readonly Place[];
  rotation: number;
  wheelRef: Ref<HTMLDivElement>;
}) {
  return (
    <div aria-hidden="true" className="relative mx-auto size-60 sm:size-72">
      <div
        ref={wheelRef}
        style={{ transform: `rotate(${rotation}deg)` }}
        className="size-full"
      >
        <svg viewBox="0 0 320 320" className="size-full overflow-visible">
          <circle
            cx="160"
            cy="160"
            r="151"
            className="fill-page stroke-border"
            strokeWidth="2"
          />
          {pool.length === 1 ? (
            <circle
              cx="160"
              cy="160"
              r="140"
              className="fill-brand-soft stroke-border"
            />
          ) : (
            pool.map((place, index) => {
              const angle = ((index + 0.5) * 360) / pool.length;
              const point = wheelPoint(angle, pool.length <= 6 ? 90 : 100);
              const label =
                place.country.name.length > 17
                  ? `${place.country.name.slice(0, 15)}…`
                  : place.country.name;
              return (
                <g key={place.id}>
                  <path
                    d={sectorPath(index, pool.length)}
                    className={`${(pool.length > 24 ? denseFills : fills)[index % fills.length]} stroke-border`}
                    strokeWidth={pool.length > 24 ? 0.6 : 1}
                  />
                  {pool.length <= 24 && (
                    <text
                      x={point.x}
                      y={point.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      transform={`rotate(${angle - 90}, ${point.x}, ${point.y})`}
                      className="fill-foreground"
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
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="flex size-20 flex-col items-center justify-center rounded-full border-4 border-surface bg-page shadow-card">
          <span className="text-xl font-semibold text-brand">G</span>
          <span className="text-[9px] font-medium text-muted">GlobePick</span>
        </div>
      </div>
      <svg
        viewBox="0 0 30 34"
        className="absolute -top-1 left-1/2 h-8 w-7 -translate-x-1/2 fill-brand stroke-surface"
        strokeWidth="2"
      >
        <path d="M2 2H28L15 31Z" />
      </svg>
    </div>
  );
}
