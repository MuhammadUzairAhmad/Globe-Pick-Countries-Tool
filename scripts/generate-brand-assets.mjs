import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

// Share the app's semantic color tokens with generated, static brand assets.
const theme = await readFile(
  new URL("../src/app/globals.css", import.meta.url),
  "utf8",
);
const color = (name) => {
  const value = theme.match(
    new RegExp(`--color-${name}:\\s*(#[a-fA-F0-9]+)`),
  )?.[1];
  if (!value) throw new Error(`Missing color token: ${name}`);
  return value;
};
const brand = color("brand");
const onBrand = color("on-brand");
const icon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="${brand}"/><g fill="none" stroke="${onBrand}" stroke-width="2.5"><circle cx="32" cy="32" r="20"/><ellipse cx="32" cy="32" rx="9" ry="20"/><path d="M12 32h40"/></g></svg>`;
await writeFile(new URL("../src/app/icon.svg", import.meta.url), icon + "\n");
const png = await sharp(Buffer.from(icon)).resize(32, 32).png().toBuffer();
const header = Buffer.alloc(22);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(1, 4);
header[6] = 32;
header[7] = 32;
header.writeUInt16LE(1, 10);
header.writeUInt16LE(32, 12);
header.writeUInt32LE(png.length, 14);
header.writeUInt32LE(22, 18);
await writeFile(
  new URL("../src/app/favicon.ico", import.meta.url),
  Buffer.concat([header, png]),
);

const social = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${color("page")}"/><g fill="none" stroke="${color("atlas")}" stroke-width="2"><circle cx="1000" cy="320" r="260"/><ellipse cx="1000" cy="320" rx="160" ry="260"/><ellipse cx="1000" cy="320" rx="60" ry="260"/><ellipse cx="1000" cy="320" rx="260" ry="100"/><ellipse cx="1000" cy="320" rx="260" ry="190"/></g><rect x="72" y="72" width="52" height="52" rx="14" fill="${brand}"/><g stroke="${onBrand}" fill="none" stroke-width="2"><circle cx="98" cy="98" r="17"/><ellipse cx="98" cy="98" rx="8" ry="17"/><path d="M81 98h34"/></g><g font-family="sans-serif"><text x="142" y="110" font-size="34" font-weight="700" fill="${color("foreground")}">GlobePick</text><text x="72" y="280" font-size="72" font-weight="700" fill="${color("foreground")}">A little curiosity.</text><text x="72" y="370" font-size="72" font-weight="700" fill="${brand}">A whole world.</text><text x="76" y="530" font-size="26" fill="${color("muted")}">Geography for curious people &amp; classrooms.</text></g></svg>`;
await sharp(Buffer.from(social))
  .png()
  .toFile(new URL("../public/social-preview.png", import.meta.url).pathname);
console.log(
  "Generated icon, favicon, and social preview from shared color tokens.",
);
