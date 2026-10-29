// PLAN C (sin Remotion): une tus tomas elegidas y quema subtítulos, solo con FFmpeg.
// Úsalo si el render de Remotion fallara a última hora. Lee tomas.json (archivo, desde, hasta).
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const guion = JSON.parse(readFileSync("src/data/guion.json", "utf8"));
const tomas = JSON.parse(readFileSync("src/data/tomas.json", "utf8"));
mkdirSync("out/plan-c", { recursive: true });

const srt = [];
let t = 0;
let n = 1;
const ts = (s) => new Date(s * 1000).toISOString().slice(11, 23).replace(".", ",");
const partes = guion.escenas.map((e, i) => {
  const tm = tomas[e.id];
  if (!tm?.archivo || tm.hasta == null) throw new Error(`Falta toma para «${e.id}» en tomas.json`);
  const parte = `out/plan-c/${String(i).padStart(2, "0")}-${e.id}.mp4`;
  execFileSync("ffmpeg", ["-y", "-v", "error", "-ss", String(tm.desde), "-to", String(tm.hasta), "-i", `public/${tm.archivo}`, "-c:v", "libx264", "-crf", "18", "-c:a", "aac", "-ar", "48000", parte]);
  // subtítulos repartidos por longitud de frase (aproximados)
  const d = tm.hasta - tm.desde;
  const frases = e.texto
    .match(/[^.?!:;,]+[.?!:;,]?/g)
    .map((s) => s.trim())
    .reduce((acc, fr) => {
      const ult = acc[acc.length - 1];
      if (ult && ult.split(" ").length + fr.split(" ").length <= 10 && !/[.?!]$/.test(ult)) acc[acc.length - 1] = `${ult} ${fr}`;
      else acc.push(fr);
      return acc;
    }, []);
  const total = frases.reduce((a, s) => a + s.length, 0);
  let acc = 0;
  for (const fr of frases) {
    const a = t + (d * acc) / total;
    acc += fr.length;
    srt.push(`${n++}\n${ts(a)} --> ${ts(t + (d * acc) / total)}\n${fr}\n`);
  }
  t += d;
  return parte;
});
writeFileSync("out/plan-c/lista.txt", partes.map((p) => `file '${p.replace("out/plan-c/", "")}'`).join("\n"));
writeFileSync("out/plan-c/subtitulos.srt", srt.join("\n"));
execFileSync("ffmpeg", ["-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", "out/plan-c/lista.txt", "-vf", "subtitles=out/plan-c/subtitulos.srt:force_style='FontName=Arial,FontSize=11,Outline=1,Shadow=0,MarginV=18,BorderStyle=3,BackColour=&H80000000'", "-c:v", "libx264", "-crf", "18", "-c:a", "aac", "out/plan-c/plan-c.mp4"]);
console.log(`Plan C listo: out/plan-c/plan-c.mp4 (${t.toFixed(1)} s)`);
