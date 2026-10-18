import type { Filters, Place } from "../../generator/types.ts";

export const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;

export function landingRotation(index: number, count: number, previous = 0) {
  if (
    !Number.isInteger(count) ||
    count < 1 ||
    !Number.isInteger(index) ||
    index < 0 ||
    index >= count
  )
    throw new Error("The winner must belong to the wheel.");
  const target = normalizeAngle(-((index + 0.5) * 360) / count);
  return previous + 4 * 360 + normalizeAngle(target - normalizeAngle(previous));
}

export function sectorAtPointer(rotation: number, count: number) {
  return count > 0 ? Math.floor(normalizeAngle(-rotation) / (360 / count)) : -1;
}

export function wheelPoint(degrees: number, radius = 140) {
  const radians = ((degrees - 90) * Math.PI) / 180;
  return {
    x: 160 + radius * Math.cos(radians),
    y: 160 + radius * Math.sin(radians),
  };
}

export function sectorPath(index: number, count: number) {
  const start = wheelPoint((index * 360) / count);
  const end = wheelPoint(((index + 1) * 360) / count);
  return `M 160 160 L ${start.x} ${start.y} A 140 140 0 ${360 / count > 180 ? 1 : 0} 1 ${end.x} ${end.y} Z`;
}

export type SpinSnapshot = {
  pool: Place[];
  winner: Place;
  filters: Filters;
};

export function spinSnapshot(
  pool: readonly Place[],
  winner: Place,
  filters: Filters,
): SpinSnapshot {
  if (!pool.some((place) => place.id === winner.id))
    throw new Error("The winner must belong to the wheel.");
  return {
    pool: [...pool],
    winner,
    filters: {
      ...filters,
      quantity: 1,
      include: [...filters.include],
      exclude: [...filters.exclude],
    },
  };
}
