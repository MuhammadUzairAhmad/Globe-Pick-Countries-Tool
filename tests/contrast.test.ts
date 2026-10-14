import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function luminance(hex: string) {
  const channels = [1, 3, 5]
    .map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255)
    .map((value) =>
      value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4,
    );
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}
test("semantic body, link, badge and button colors retain small-text contrast", () => {
  const css = readFileSync("src/app/globals.css", "utf8");
  const colors = Object.fromEntries(
    [...css.matchAll(/--color-([a-z-]+): (#[\da-f]{6});/g)].map((match) => [
      match[1],
      match[2],
    ]),
  );
  for (const [foreground, background] of [
    ["foreground", "page"],
    ["muted", "page"],
    ["muted", "surface"],
    ["brand", "surface"],
    ["surface", "brand"],
    ["brand-strong", "brand-soft"],
    ["accent", "accent-soft"],
    ["danger", "surface"],
    ["success", "surface"],
  ]) {
    const light = Math.max(
      luminance(colors[foreground]),
      luminance(colors[background]),
    );
    const dark = Math.min(
      luminance(colors[foreground]),
      luminance(colors[background]),
    );
    const ratio = (light + 0.05) / (dark + 0.05);
    assert.ok(
      ratio >= 4.5,
      `${foreground} on ${background}: ${ratio.toFixed(2)}`,
    );
  }
});
