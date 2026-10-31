// Construye src/data/timing.json a partir de las TOMAS REALES (tomas.json + transcripciones/).
// Cada escena dura lo que dura tu toma (hasta − desde); los gráficos se anclan a las palabras que
// realmente dijiste. Si un ancla no aparece (no estás leyendo, es normal), se usa la posición
// proporcional y se avisa; puedes fijarla a mano en tomas.json → "cues": { "grieta": 3.4 }.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const guion = JSON.parse(readFileSync("src/data/guion.json", "utf8"));
const tomas = JSON.parse(readFileSync("src/data/tomas.json", "utf8"));
const GAP = Number(process.env.GAP ?? 0.15);
const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ ]/g, "").trim();

let t = 0;
const escenas = [];
for (const e of guion.escenas) {
  const toma = tomas[e.id];
  if (!toma?.archivo || toma.hasta == null) throw new Error(`Falta toma (archivo, desde, hasta) para «${e.id}» en tomas.json`);
  const tr = path.join("transcripciones", path.basename(toma.archivo).replace(/\.[^.]+$/, ".json"));
  const palabras = existsSync(tr)
    ? JSON.parse(readFileSync(tr, "utf8")).palabras.filter((p) => p.s >= toma.desde && p.e <= toma.hasta).map((p) => ({ ...p, s: +(p.s - toma.desde).toFixed(3), e: +(p.e - toma.desde).toFixed(3) }))
    : [];
  const duracion = toma.hasta - toma.desde;
  const cues = {};
  for (const c of e.cues) {
    if (toma.cues?.[c.id] != null) { cues[c.id] = toma.cues[c.id]; continue; }
    const objetivo = norm(c.ancla).split(" ");
    const i = palabras.findIndex((_, k) => objetivo.every((w, j) => norm(palabras[k + j]?.w ?? "") === w));
    if (i >= 0) cues[c.id] = palabras[i].s;
    else {
      cues[c.id] = +(duracion * (e.texto.indexOf(c.ancla) / e.texto.length)).toFixed(3);
      console.warn(`⚠ ${e.id}/${c.id}: no dijiste «${c.ancla}»; usando ${cues[c.id]} s (ajústalo en tomas.json si hace falta)`);
    }
  }
  escenas.push({ id: e.id, inicio: +t.toFixed(3), duracion: +duracion.toFixed(3), cues, palabras });
  t += duracion + GAP;
}
const total = t + guion.creditos.duracionSeg;
writeFileSync("src/data/timing.json", JSON.stringify({ fuente: "tomas", total: +total.toFixed(3), escenas }, null, 1));
console.log(escenas.map((e) => `${e.id.padEnd(11)} ${e.inicio.toFixed(1).padStart(6)}s +${e.duracion.toFixed(1)}s`).join("\n"));
console.log(`\nTOTAL: ${total.toFixed(1)} s ${total > 175 ? "❌ SUPERA 2:55: recorta tomas" : "✅"}`);
