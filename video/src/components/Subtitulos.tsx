import React from "react";
import { useCurrentFrame } from "remotion";
import { escenas, inicioEscena, palabrasEscena, PalabraF } from "../tiempos";
import { C, sans } from "../theme";

type Bloque = { desde: number; hasta: number; palabras: PalabraF[] };

// Subtítulos en bloques de hasta 8 palabras, cortados en la puntuación; la palabra que estás
// diciendo se resalta. Con tomas reales usan lo que realmente dijiste (Whisper).
export const bloques: Bloque[] = escenas.flatMap((e) => {
  const base = inicioEscena(e.id);
  const ps = palabrasEscena(e.id).map((p) => ({ ...p, desde: p.desde + base, hasta: p.hasta + base }));
  const out: Bloque[] = [];
  let g: PalabraF[] = [];
  const cerrar = () => {
    if (g.length) out.push({ desde: g[0].desde, hasta: g[g.length - 1].hasta + 6, palabras: g });
    g = [];
  };
  for (const p of ps) {
    g.push(p);
    if (g.length >= 8 || /[.?!:;]$/.test(p.w) || (/,$/.test(p.w) && g.length >= 4)) cerrar();
  }
  cerrar();
  // sin solapes: cada bloque termina cuando empieza el siguiente
  out.forEach((b, i) => out[i + 1] && (b.hasta = Math.min(b.hasta, out[i + 1].desde)));
  return out;
});

export const Subtitulos: React.FC = () => {
  const frame = useCurrentFrame();
  const b = bloques.find((x) => frame >= x.desde && frame < x.hasta);
  if (!b) return null;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, bottom: 64, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: 1400, padding: "10px 26px", borderRadius: 10, background: "rgba(15,14,12,0.74)", fontFamily: sans, fontWeight: 500, fontSize: 36, lineHeight: 1.25, color: "#F7F3EC", textAlign: "center" }}>
        {b.palabras.map((p, i) => {
          const dicha = frame >= p.desde;
          const actual = frame >= p.desde && frame < p.hasta + 2;
          return (
            <span key={i} style={{ color: actual ? C.ambar : dicha ? "#F7F3EC" : "rgba(247,243,236,0.55)" }}>
              {p.w}{" "}
            </span>
          );
        })}
      </div>
    </div>
  );
};
