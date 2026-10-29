import React from "react";
import { useCurrentFrame } from "remotion";
import { escenas, f, timing } from "../tiempos";
import { sans } from "../theme";

type Bloque = { desde: number; hasta: number; texto: string };

// Parte el texto de cada escena en frases cortas (máx. ~9 palabras) y las reparte en el tiempo.
// Con la grabación real, esto se reemplaza por los tiempos palabra a palabra de Whisper.
const trocear = (texto: string) => {
  const piezas = texto.match(/[^,.;:?!]+[,.;:?!]*/g)?.map((s) => s.trim()).filter(Boolean) ?? [texto];
  const out: string[] = [];
  for (const p of piezas) {
    const ult = out[out.length - 1];
    if (ult && ult.split(" ").length + p.split(" ").length <= 9 && !/[.?!]$/.test(ult)) out[out.length - 1] = `${ult} ${p}`;
    else out.push(p);
  }
  return out.flatMap((s) => {
    const w = s.split(" ");
    if (w.length <= 11) return [s];
    const mitad = Math.ceil(w.length / 2);
    return [w.slice(0, mitad).join(" "), w.slice(mitad).join(" ")];
  });
};

export const bloques: Bloque[] = escenas.flatMap((e) => {
  const t = timing.escenas.find((x) => x.id === e.id)!;
  if (t.palabras?.length) {
    // Con tomas reales: subtítulos con lo que realmente dijiste, palabra a palabra
    const out: Bloque[] = [];
    let grupo: typeof t.palabras = [];
    for (const p of t.palabras) {
      grupo.push(p);
      if (grupo.length >= 8 || /[.?!,:;]$/.test(p.w)) {
        out.push({ desde: f(t.inicio + grupo[0].s), hasta: f(t.inicio + p.e + 0.15), texto: grupo.map((g) => g.w).join(" ") });
        grupo = [];
      }
    }
    if (grupo.length) out.push({ desde: f(t.inicio + grupo[0].s), hasta: f(t.inicio + grupo[grupo.length - 1].e + 0.15), texto: grupo.map((g) => g.w).join(" ") });
    return out;
  }
  const partes = trocear(e.texto);
  const total = partes.reduce((a, p) => a + p.length, 0);
  let acc = 0;
  return partes.map((p) => {
    const desde = f(t.inicio + (t.duracion * acc) / total);
    acc += p.length;
    const hasta = f(t.inicio + (t.duracion * acc) / total);
    return { desde, hasta, texto: p.replace(/^¿?/, (m) => m) };
  });
});

export const Subtitulos: React.FC = () => {
  const frame = useCurrentFrame();
  const b = bloques.find((x) => frame >= x.desde && frame < x.hasta);
  if (!b) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, display: "flex", justifyContent: "center" }}>
      <div
        style={{
          maxWidth: 1400,
          padding: "10px 26px",
          borderRadius: 10,
          background: "rgba(15,14,12,0.74)",
          fontFamily: sans,
          fontWeight: 500,
          fontSize: 36,
          lineHeight: 1.25,
          color: "#F7F3EC",
          textAlign: "center",
        }}
      >
        {b.texto}
      </div>
    </div>
  );
};
