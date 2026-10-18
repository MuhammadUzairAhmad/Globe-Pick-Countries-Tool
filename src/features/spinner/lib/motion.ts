type AnimationHandle = { finished: Promise<unknown>; cancel: () => void };
type ChangeSignal = {
  addEventListener: (type: "change", callback: () => void) => void;
  removeEventListener: (type: "change", callback: () => void) => void;
  readonly matches: boolean;
};
type VisibilitySignal = {
  addEventListener: (type: "visibilitychange", callback: () => void) => void;
  removeEventListener: (type: "visibilitychange", callback: () => void) => void;
  readonly hidden: boolean;
};

// Only controls presentation. None of the completion paths can select a place.
export function runWheelMotion({
  animate,
  from,
  to,
  reducedMotion,
  visibility,
  settle,
  schedule = setTimeout,
  unschedule = clearTimeout,
}: {
  animate?: (
    frames: Keyframe[],
    options: KeyframeAnimationOptions,
  ) => AnimationHandle;
  from: number;
  to: number;
  reducedMotion: ChangeSignal;
  visibility: VisibilitySignal;
  settle: () => void;
  schedule?: typeof setTimeout;
  unschedule?: typeof clearTimeout;
}) {
  let done = false;
  let animation: AnimationHandle | undefined;
  let timeout: ReturnType<typeof setTimeout> | undefined;
  function finish() {
    if (done) return;
    done = true;
    reducedMotion.removeEventListener("change", preferenceChanged);
    visibility.removeEventListener("visibilitychange", visibilityChanged);
    if (timeout !== undefined) unschedule(timeout);
    animation?.cancel();
    settle();
  }
  function preferenceChanged() {
    if (reducedMotion.matches) finish();
  }
  function visibilityChanged() {
    if (visibility.hidden) finish();
  }
  reducedMotion.addEventListener("change", preferenceChanged);
  visibility.addEventListener("visibilitychange", visibilityChanged);
  if (!animate || reducedMotion.matches || visibility.hidden) finish();
  else {
    try {
      animation = animate(
        [
          { transform: `rotate(${from}deg)` },
          { transform: `rotate(${to}deg)` },
        ],
        { duration: 3000, easing: "cubic-bezier(0.12, 0.75, 0.16, 1)" },
      );
      animation.finished.then(finish, finish);
      // A suspended or broken animation must not leave the interaction locked.
      timeout = schedule(finish, 3500);
    } catch {
      finish();
    }
  }
  return finish;
}
