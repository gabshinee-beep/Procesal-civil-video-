import React from "react";
import { C, mono } from "../theme";

// Personajes pictográficos sobrios (estilo Isotype): legibles, consistentes, sin caricatura.
export const PERSONAJES = {
  laura: { nombre: "Laura", rol: "DEMANDANTE", color: C.azul },
  mario: { nombre: "Mario", rol: "DEMANDADO", color: "#9A6418" },
  juez: { nombre: "Juez", rol: "ÓRGANO JURISDICCIONAL", color: C.tinta },
  apoderado: { nombre: "Apoderado", rol: "SIN FACULTAD", color: "#8A8172" },
} as const;

export const Personaje: React.FC<{
  quien: keyof typeof PERSONAJES;
  x: number;
  y: number;
  escala?: number;
  tenue?: boolean;
  maletin?: boolean;
  etiqueta?: boolean;
  nombre?: string;
}> = ({ quien, x, y, escala = 1, tenue, maletin, etiqueta = true, nombre }) => {
  const p = PERSONAJES[quien];
  return (
    <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, -100%) scale(${escala})`, transformOrigin: "50% 100%", opacity: tenue ? 0.28 : 1, textAlign: "center" }}>
      <svg width={120} height={170} viewBox="0 0 120 170">
        <circle cx={60} cy={30} r={26} fill={p.color} />
        <path d="M 14 170 L 20 86 Q 22 66 42 64 L 78 64 Q 98 66 100 86 L 106 170 Z" fill={p.color} />
        {quien === "juez" && <path d="M 42 64 L 60 100 L 78 64 Z" fill="#F3EDE2" opacity={0.9} />}
        {maletin && <rect x={86} y={120} width={30} height={24} rx={4} fill={C.tinta} />}
      </svg>
      {etiqueta && (
        <div style={{ marginTop: 6 }}>
          <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 26, color: C.tinta }}>{nombre ?? p.nombre}</div>
          <div style={{ fontFamily: mono, fontSize: 14, letterSpacing: 2, color: p.color }}>{p.rol}</div>
        </div>
      )}
    </div>
  );
};
