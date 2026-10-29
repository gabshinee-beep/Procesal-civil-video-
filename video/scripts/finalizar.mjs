// Paso final: normaliza el volumen (−16 LUFS, −1.5 dBTP) y verifica la duración.
// Uso: node scripts/finalizar.mjs out/video.mp4   → out/FINAL_Nulidad_Procesal.mp4
import { execFileSync, spawnSync } from "node:child_process";

const entrada = process.argv[2] ?? "out/maqueta.mp4";
const salida = process.argv[3] ?? "out/FINAL_Nulidad_Procesal.mp4";
const LIMITE = 175; // 2:55: margen de 5 s bajo los 3:00 del profesor

const dur = (f) => Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());

// Pasada 1: medir
const med = spawnSync("ffmpeg", ["-hide_banner", "-i", entrada, "-af", "loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json", "-f", "null", "-"], { encoding: "utf8" }).stderr;
const m = JSON.parse(med.slice(med.lastIndexOf("{"), med.lastIndexOf("}") + 1));
// Pasada 2: aplicar
const af = `loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${m.input_i}:measured_TP=${m.input_tp}:measured_LRA=${m.input_lra}:measured_thresh=${m.input_thresh}:offset=${m.target_offset}:linear=true`;
execFileSync("ffmpeg", ["-y", "-v", "error", "-i", entrada, "-c:v", "copy", "-af", af, "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart", salida]);

const d = dur(salida);
const mm = `${Math.floor(d / 60)}:${String(Math.round(d % 60)).padStart(2, "0")}`;
console.log(`Sonoridad original: ${m.input_i} LUFS → −16 LUFS`);
console.log(`Duración: ${d.toFixed(2)} s (${mm})`);
if (d > LIMITE) {
  console.error(`❌ SUPERA ${LIMITE} s. NO ENVIAR: recorta antes.`);
  process.exit(1);
}
console.log(`✅ ${salida} listo para subir.`);
