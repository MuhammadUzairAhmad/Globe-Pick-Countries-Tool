import { useEffect, useRef } from "react";
import { CONFETTI_COUNT, runConfetti } from "../lib/celebration";

const colors = ["bg-brand", "bg-accent", "bg-success", "bg-muted"];

export function ConfettiBurst({ enabled }: { enabled: boolean }) {
  const root = useRef<HTMLDivElement>(null);
  const played = useRef(false);
  useEffect(() => {
    if (!enabled || played.current) return;
    let stop = () => {};
    // Strict Mode can cancel its first setup before this frame. Activity retains
    // played, so returning to the route never repeats a completed celebration.
    const frame = requestAnimationFrame(() => {
      const host = root.current;
      if (!host || played.current) return;
      played.current = true;
      stop = runConfetti(
        [...host.querySelectorAll("span")],
        host.clientWidth,
        host.clientHeight,
        window.matchMedia("(prefers-reduced-motion: reduce)"),
        document,
      );
    });
    return () => {
      cancelAnimationFrame(frame);
      stop();
    };
  }, [enabled]);
  return (
    <div
      ref={root}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-20 overflow-hidden"
    >
      {Array.from({ length: CONFETTI_COUNT }, (_, index) => (
        <span
          key={index}
          className={`absolute left-1/2 top-1/4 h-3 w-1.5 opacity-0 ${colors[index % colors.length]} ${index % 3 ? "rounded-sm" : "rounded-full"}`}
        />
      ))}
    </div>
  );
}
