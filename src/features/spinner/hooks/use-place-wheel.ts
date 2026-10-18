"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { landingRotation, type SpinSnapshot } from "../lib/wheel";
import { runWheelMotion } from "../lib/motion";

type WheelState = {
  snapshot: SpinSnapshot;
  from: number;
  rotation: number;
  spinning: boolean;
};

export function usePlaceWheel() {
  const [wheel, setWheel] = useState<WheelState | null>(null);
  const element = useRef<HTMLDivElement>(null);
  const locked = useRef(false);
  const finish = useRef<(() => void) | null>(null);
  const rotation = useRef(0);

  function start(choose: () => SpinSnapshot | undefined) {
    // React state alone cannot block two handlers before the next render.
    if (locked.current) return;
    locked.current = true;
    try {
      const snapshot = choose();
      if (!snapshot) {
        locked.current = false;
        return;
      }
      const from = rotation.current;
      const to = landingRotation(
        snapshot.pool.findIndex((p) => p.id === snapshot.winner.id),
        snapshot.pool.length,
        from,
      );
      rotation.current = to;
      setWheel({ snapshot, from, rotation: to, spinning: true });
    } catch (error) {
      locked.current = false;
      throw error;
    }
  }

  useLayoutEffect(() => {
    if (!wheel?.spinning) return;
    const node = element.current;
    const stop = runWheelMotion({
      animate:
        wheel.snapshot.pool.length > 1 ? node?.animate?.bind(node) : undefined,
      from: wheel.from,
      to: wheel.rotation,
      reducedMotion: window.matchMedia("(prefers-reduced-motion: reduce)"),
      visibility: document,
      settle: () => {
        locked.current = false;
        setWheel((current) =>
          current?.snapshot === wheel.snapshot
            ? { ...current, spinning: false }
            : current,
        );
      },
    });
    finish.current = stop;
    // Activity also runs this cleanup when a route is hidden.
    return () => {
      stop();
      finish.current = null;
    };
  }, [wheel]);

  return {
    wheel,
    element,
    start,
    skip: () => finish.current?.(),
    reset: () => {
      if (locked.current) return;
      rotation.current = 0;
      setWheel(null);
    },
  };
}
