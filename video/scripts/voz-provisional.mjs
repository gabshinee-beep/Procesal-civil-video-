// Genera una VOZ PROVISIONAL (robótica, solo para medir tiempos) y el archivo de tiempos.
// Cuando exista la grabación real, este archivo se reemplaza por tiempos de Whisper.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";

const guion = JSON.parse(readFileSync("src/data/guion.json", "utf8"));
const WPM = Number(process.env.WPM ?? 180);
const PAUSA = 0.45; // segundos entre escenas
const tmp = "out/voz";
mkdirSync(tmp, { recursive: true });
mkdirSync("public/maqueta", { recursive: true });

const dur = (f) =>
  Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());

let t = 0;
const escenas = [];
const partes = [];
for (const e of guion.escenas) {
  const wav = `${tmp}/${e.id}.wav`;
  execFileSync("espeak-ng", ["-v", "es-419", "-s", String(WPM), "-g", "4", "-w", wav, e.texto]);
  const d = dur(wav);
  const palabras = e.texto.split(/\s+/).length;
  escenas.push({ id: e.id, inicio: +t.toFixed(3), duracion: +d.toFixed(3), nPalabras: palabras });
  partes.push(wav);
  t += d + PAUSA;
}
const total = t + guion.creditos.duracionSeg;

// Concatenar con silencios
const lista = partes.flatMap((p) => [`file '${process.cwd()}/${p}'`, `file '${process.cwd()}/${tmp}/silencio.wav'`]).join("\n");
execFileSync("ffmpeg", ["-y", "-v", "error", "-f", "lavfi", "-i", "anullsrc=r=22050:cl=mono", "-t", String(PAUSA), `${tmp}/silencio.wav`]);
writeFileSync(`${tmp}/lista.txt`, lista);
execFileSync("ffmpeg", ["-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", `${tmp}/lista.txt`, "-ar", "48000", "public/maqueta/voz.wav"]);
execFileSync("ffmpeg", ["-y", "-v", "error", "-i", "public/maqueta/voz.wav", "-c:a", "libmp3lame", "-b:a", "96k", "public/maqueta/voz.mp3"]);
rmSync("public/maqueta/voz.wav");

writeFileSync("src/data/timing.json", JSON.stringify({ fuente: "voz-provisional", wpm: WPM, total: +total.toFixed(3), escenas }, null, 2));

const pal = escenas.reduce((a, e) => a + e.nPalabras, 0);
console.log(escenas.map((e) => `${e.id.padEnd(11)} ${e.inicio.toFixed(1).padStart(6)}s  +${e.duracion.toFixed(1)}s  ${e.nPalabras} palabras`).join("\n"));
console.log(`\nPalabras: ${pal} · Total maqueta: ${total.toFixed(1)} s`);
for (const w of [140, 150, 160]) console.log(`Estimado humano a ${w} ppm (+pausas): ${((pal / w) * 60 + escenas.length * PAUSA + guion.creditos.duracionSeg).toFixed(0)} s`);
