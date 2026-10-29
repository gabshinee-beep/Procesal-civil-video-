// Genera ../GUION.md (documento de revisión) desde src/data/guion.json, la fuente única del guion.
import { readFileSync, writeFileSync } from "node:fs";

const g = JSON.parse(readFileSync("src/data/guion.json", "utf8"));
const t = JSON.parse(readFileSync("src/data/timing.json", "utf8"));
const mmss = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
const palabras = g.escenas.reduce((a, e) => a + e.texto.split(/\s+/).length, 0);

let md = `# Guion ${g.version}\n\n**${g.titulo}** · ${g.subtitulo}\n\n`;
md += `> Total: **${palabras} palabras**. A 150 palabras/min ≈ ${mmss((palabras / 150) * 60 + 7)} con pausas y créditos. Límite interno: 2:55.\n`;
md += `> Los tiempos son **estimados** (voz provisional). Con tus tomas reales se recalculan solos.\n`;
md += `> ⚠️ El texto exacto sirve para revisar el contenido jurídico; **para grabar usa solo la tarjeta** de cada escena.\n\n`;
for (const [i, e] of g.escenas.entries()) {
  const tt = t.escenas.find((x) => x.id === e.id);
  md += `---\n\n## Escena ${i + 1} · ${e.seccion}  \`${mmss(tt.inicio)}–${mmss(tt.inicio + tt.duracion)}\`  (${e.texto.split(/\s+/).length} palabras)\n\n`;
  md += `**🎙️ Lo que dices**\n\n> ${e.texto}\n\n`;
  md += `**🎬 Lo que se ve**\n\n${e.visual}\n\n`;
  md += `**🃏 Tarjeta (lo único que miras antes de la toma)**\n\n${e.tarjeta.map((k) => `\`${k}\``).join(" → ")}\n\n`;
  md += `**📚 Fundamento**: ${e.fundamento}\n\n`;
}
md += `---\n\n## Créditos (${g.creditos.duracionSeg} s)\n\n${g.creditos.fuentes.map((f) => `- ${f}`).join("\n")}\n`;
writeFileSync("../GUION.md", md);
console.log(`GUION.md generado (${palabras} palabras)`);
