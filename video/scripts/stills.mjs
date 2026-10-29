// Renderiza fotogramas sueltos para revisar el diseño rápido: node scripts/stills.mjs 100 380 2450
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import path from "node:path";

const frames = process.argv.slice(2).map(Number);
const comp = process.env.COMP ?? "Maqueta";
const browserExecutable = process.env.REMOTION_CHROME || null;
const serveUrl = await bundle({ entryPoint: path.resolve("src/index.ts") });
const composition = await selectComposition({ serveUrl, id: comp, browserExecutable });
for (const frame of frames) {
  const output = `out/stills/${comp}-${String(frame).padStart(5, "0")}.png`;
  await renderStill({ serveUrl, composition, frame, output, browserExecutable });
  console.log(output);
}
