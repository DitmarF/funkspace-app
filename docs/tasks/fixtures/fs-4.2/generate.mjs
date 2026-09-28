// Run from the repository root: node docs/tasks/fixtures/fs-4.2/generate.mjs [output-directory]
// Offline diagnostic export, never imported by the frontend or a frame loop.
import { build } from "esbuild";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { format } from "prettier";

const source = "frontend/domain/particles/ParticleScene.ts";
const output = resolve(process.argv[2] ?? "docs/tasks/fixtures/fs-4.2");
const result = await build({
  entryPoints: [source],
  bundle: true,
  write: false,
  format: "esm",
  platform: "neutral",
  metafile: true,
});
const model = await import(
  `data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`
);
const state = model.createParticleScene({ width: 640, height: 360 });
const initial = model.getParticleStill(state);
for (let step = 0; step < 20; step++) model.advanceParticles(state, 50);
const later = model.getParticleStill(state);
const sourceSha256 = createHash("sha256")
  .update(await readFile(source))
  .digest("hex");
const fixture = {
  revision: 1,
  source,
  sourceSha256,
  description:
    "Unmasked rules fixture. No production art, theme or moving-scene acceptance.",
  frames: [
    { elapsedMs: 0, steps: [], still: initial },
    { elapsedMs: 1000, steps: Array(20).fill(50), still: later },
  ],
};
const circles = (still) =>
  still.particles
    .map(
      (p) =>
        `    <circle cx="${p.x.toFixed(6)}" cy="${p.y.toFixed(6)}" r="${p.radius.toFixed(6)}"/>`,
    )
    .join("\n");
const panel = (x, title, still, id) => `
  <text x="${x}" y="103" font-size="18" fill="#171717">${title}</text>
  <svg x="${x}" y="122" width="640" height="360" viewBox="0 0 640 360" overflow="hidden" aria-label="${id}">
    <rect width="640" height="360" fill="#ffffff"/>
    <g fill="#171717">
${circles(still)}
    </g>
  </svg>
  <rect x="${x}" y="122" width="640" height="360" fill="none" stroke="#767676"/>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1352" height="532" viewBox="0 0 1352 532" role="img" aria-labelledby="title description">
  <title id="title">Aperture: deterministic particle rules fixture</title>
  <desc id="description">Two static snapshots of the same seeded field at zero and one second. This shows unmasked particle data, not the SPACE design or live motion.</desc>
  <rect width="1352" height="532" fill="#f3f3f3"/>
  <g font-family="system-ui, sans-serif">
    <text x="24" y="34" font-size="24" fill="#171717">Aperture — particle rules fixture</text>
    <text x="24" y="62" font-size="16" fill="#414141">120 particles · speed 1× · size 1× · seed 0x46533431 · 640 × 360 CSS px per panel</text>
${panel(24, "Initial seeded still", initial, "Initial particle positions")}
${panel(688, "After 1,000 ms (20 accepted 50 ms steps)", later, "Positions after one simulated second")}
    <text x="24" y="514" font-size="16" fill="#414141">Diagnostic colors only. No SPACE artwork, mask, browser runtime or visual/motion approval is implied.</text>
  </g>
</svg>
`;
await mkdir(output, { recursive: true });
await writeFile(
  resolve(output, "particle-still.json"),
  await format(JSON.stringify(fixture), { parser: "json" }),
);
await writeFile(resolve(output, "particle-still.svg"), svg);
console.log(
  JSON.stringify(
    {
      sourceSha256,
      output,
      frames: 2,
      particlesPerFrame: 120,
      dependencyInputs: Object.keys(result.metafile.inputs),
    },
    null,
    2,
  ),
);
