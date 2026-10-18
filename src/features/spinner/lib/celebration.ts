type Particle = {
  animate?: (
    frames: Keyframe[],
    options: KeyframeAnimationOptions,
  ) => { cancel: () => void };
};
type Preference = Pick<
  MediaQueryList,
  "matches" | "addEventListener" | "removeEventListener"
>;
type Visibility = Pick<
  Document,
  "hidden" | "addEventListener" | "removeEventListener"
>;

export const CONFETTI_COUNT = 32;

export function confettiFrames(
  index: number,
  width: number,
  height: number,
): Keyframe[] {
  const direction = index % 2 ? 1 : -1;
  const spread =
    direction * (0.2 + ((index * 7) % 19) / 24) * Math.min(width * 0.45, 250);
  const fall = (0.35 + ((index * 11) % 17) / 25) * Math.min(height, 650);
  const turn = direction * (180 + (index % 5) * 120);
  return [
    { offset: 0, transform: "translate(0, 0) scale(0.2)", opacity: 0 },
    {
      offset: 0.12,
      transform: `translate(${spread * 0.2}px, -25px) rotate(${turn * 0.1}deg)`,
      opacity: 1,
    },
    {
      offset: 0.38,
      transform: `translate(${spread * 0.7}px, ${-60 - (index % 5) * 20}px) rotate(${turn * 0.4}deg)`,
      opacity: 1,
    },
    {
      offset: 1,
      transform: `translate(${spread}px, ${fall}px) rotate(${turn}deg) scale(0.8)`,
      opacity: 0,
    },
  ];
}

// Decorative only: a finite burst, never a second selection or result event.
export function runConfetti(
  particles: readonly Particle[],
  width: number,
  height: number,
  preference: Preference,
  visibility: Visibility,
) {
  if (preference.matches || visibility.hidden) return () => {};
  const animations: { cancel: () => void }[] = [];
  let stopped = false;
  function stop() {
    if (stopped) return;
    stopped = true;
    preference.removeEventListener("change", preferenceChanged);
    visibility.removeEventListener("visibilitychange", visibilityChanged);
    animations.forEach((animation) => animation.cancel());
  }
  function preferenceChanged() {
    if (preference.matches) stop();
  }
  function visibilityChanged() {
    if (visibility.hidden) stop();
  }
  preference.addEventListener("change", preferenceChanged);
  visibility.addEventListener("visibilitychange", visibilityChanged);
  particles.slice(0, CONFETTI_COUNT).forEach((particle, index) => {
    try {
      const animation = particle.animate?.(
        confettiFrames(index, width, height),
        {
          duration: 1000 + (index % 4) * 110,
          delay: (index % 6) * 35,
          easing: "cubic-bezier(0.2, 0.65, 0.5, 1)",
        },
      );
      if (animation) animations.push(animation);
    } catch {
      /* Missing motion support leaves the result usable. */
    }
  });
  return stop;
}
