import { test } from "node:test";
import assert from "node:assert/strict";
import {
  CONFETTI_COUNT,
  confettiFrames,
  runConfetti,
} from "../src/features/spinner/lib/celebration.ts";

function signals() {
  const mediaTarget = new EventTarget();
  const visibilityTarget = new EventTarget();
  return {
    media: {
      matches: false,
      addEventListener: mediaTarget.addEventListener.bind(mediaTarget),
      removeEventListener: mediaTarget.removeEventListener.bind(mediaTarget),
    },
    visibility: {
      hidden: false,
      addEventListener:
        visibilityTarget.addEventListener.bind(visibilityTarget),
      removeEventListener:
        visibilityTarget.removeEventListener.bind(visibilityTarget),
    },
    mediaTarget,
    visibilityTarget,
  };
}

test("confetti stays bounded on phone and desktop and fades out within a short finite burst", () => {
  for (const [width, height] of [
    [300, 500],
    [600, 850],
  ]) {
    const { media, visibility } = signals();
    const captured: {
      frames: Keyframe[];
      options: KeyframeAnimationOptions;
      index: number;
    }[] = [];
    const particles = Array.from({ length: 100 }, (_, index) => ({
      animate: (frames: Keyframe[], options: KeyframeAnimationOptions) => {
        captured.push({ frames, options, index });
        return { cancel() {} };
      },
    }));
    const stop = runConfetti(particles, width, height, media, visibility);
    assert.equal(captured.length, CONFETTI_COUNT);
    for (const { frames, options, index } of captured) {
      assert.deepEqual(frames, confettiFrames(index, width, height));
      assert.equal(frames[0].opacity, 0);
      assert.equal(frames.at(-1)!.opacity, 0);
      const final = String(frames.at(-1)!.transform).match(
        /translate\((-?[\d.]+)px, (-?[\d.]+)px\)/,
      )!;
      assert.ok(Math.abs(Number(final[1])) <= Math.min(width * 0.45, 250));
      assert.ok(
        Number(final[2]) > 0 && Number(final[2]) <= Math.min(height, 650),
      );
      assert.ok(Number(options.duration) + Number(options.delay) < 1600);
      assert.ok(!options.iterations || options.iterations === 1);
    }
    stop();
  }
});

test("reduced motion, hidden tabs, unavailable animation, and rejection keep celebration optional", () => {
  for (const disabled of ["reduced", "hidden"]) {
    const { media, visibility } = signals();
    media.matches = disabled === "reduced";
    visibility.hidden = disabled === "hidden";
    let calls = 0;
    runConfetti(
      [
        {
          animate: () => {
            calls++;
            return { cancel() {} };
          },
        },
      ],
      320,
      600,
      media,
      visibility,
    )();
    assert.equal(calls, 0);
  }
  const { media, visibility } = signals();
  let cancelled = 0;
  const stop = runConfetti(
    [
      {},
      {
        animate: () => {
          throw Error("Unavailable");
        },
      },
      {
        animate: () => ({
          cancel: () => {
            cancelled++;
          },
        }),
      },
    ],
    320,
    600,
    media,
    visibility,
  );
  stop();
  stop();
  assert.equal(cancelled, 1);
});

test("preference changes, tab hiding, and cleanup cancel the burst only once", () => {
  for (const change of ["preference", "visibility", "cleanup"]) {
    const { media, visibility, mediaTarget, visibilityTarget } = signals();
    let cancelled = 0;
    const stop = runConfetti(
      Array.from({ length: CONFETTI_COUNT }, () => ({
        animate: () => ({
          cancel: () => {
            cancelled++;
          },
        }),
      })),
      320,
      600,
      media,
      visibility,
    );
    if (change === "preference") {
      media.matches = true;
      mediaTarget.dispatchEvent(new Event("change"));
    }
    if (change === "visibility") {
      visibility.hidden = true;
      visibilityTarget.dispatchEvent(new Event("visibilitychange"));
    }
    stop();
    stop();
    mediaTarget.dispatchEvent(new Event("change"));
    visibilityTarget.dispatchEvent(new Event("visibilitychange"));
    assert.equal(cancelled, CONFETTI_COUNT);
  }
});
