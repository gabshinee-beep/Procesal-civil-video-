import React from "react";
import { useCurrentFrame } from "remotion";
import { C, mono, sans, serif } from "../theme";
import { entra, rango } from "../anim";

export type Estado = "activo" | "nulidad" | "validez" | "neutro";
export type Evento = { at: number; estado: Estado; respuesta?: string };

export const PREGUNTAS = [
  { id: "p1", nombre: "Especificidad", pregunta: "¿La ley sanciona el vicio?", art: "Art. 171" },
  { id: "p2", nombre: "Convalidación", pregunta: "¿Se saneó o cumplió su finalidad?", art: "Art. 172" },
  { id: "p3", nombre: "Trascendencia", pregunta: "¿Causó un perjuicio real?", art: "Art. 174" },
  { id: "p4", nombre: "Protección", pregunta: "¿La pide quien lo provocó?", art: "Art. 175.1" },
] as const;

const COLOR: Record<Estado, string> = { activo: C.ambar, nulidad: C.rojo, validez: C.verde, neutro: C.tintaSuave };

const CW = 372;
const CH = 178;
const POS = [
  { x: 0, y: 0 },
  { x: 868 - CW, y: 0 },
  { x: 0, y: CH + 54 },
  { x: 868 - CW, y: CH + 54 },
];
const CENTRO = { x: 434, y: CH + 27 };

// «El expediente bajo examen»: cuatro preguntas conectadas al mismo expediente, sin orden de paso.
export const Tablero: React.FC<{ top: number; aparicion: number; eventos: Partial<Record<string, Evento[]>>; etiquetaExp?: string }> = ({
  top,
  aparicion,
  eventos,
  etiquetaExp = "EXP.",
}) => {
  const frame = useCurrentFrame();
  const estadoDe = (id: string) => {
    const evs = (eventos[id] ?? []).filter((e) => frame >= e.at);
    return evs.length ? evs[evs.length - 1] : undefined;
  };
  return (
    <div style={{ position: "absolute", left: 0, top, width: 868, height: 2 * CH + 54 }}>
      <svg width={868} height={2 * CH + 54} style={{ position: "absolute", inset: 0 }}>
        {POS.map((p, i) => {
          const ev = estadoDe(PREGUNTAS[i].id);
          const cx = p.x === 0 ? p.x + CW : p.x;
          const cy = p.y === 0 ? p.y + CH : p.y;
          const d = rango(frame, aparicion + 10 + i * 4, aparicion + 26 + i * 4);
          return (
            <line
              key={i}
              x1={CENTRO.x}
              y1={CENTRO.y}
              x2={CENTRO.x + (cx - CENTRO.x) * d}
              y2={CENTRO.y + (cy - CENTRO.y) * d}
              stroke={ev ? COLOR[ev.estado] : C.linea}
              strokeWidth={ev ? 4 : 2}
              strokeDasharray={ev ? "0" : "6 6"}
            />
          );
        })}
      </svg>
      {PREGUNTAS.map((q, i) => {
        const ev = estadoDe(q.id);
        const p = entra(frame, aparicion + i * 5, 18);
        const pop = ev ? 1 + 0.04 * (1 - entra(frame, ev.at, 10)) : 1;
        const col = ev ? COLOR[ev.estado] : C.linea;
        const tenue = !ev ? 0.55 : 1;
        return (
          <div
            key={q.id}
            style={{
              position: "absolute",
              left: POS[i].x,
              top: POS[i].y,
              width: CW,
              height: CH,
              boxSizing: "border-box",
              padding: "18px 22px",
              background: "#FBF8F2",
              border: `3px solid ${col}`,
              borderRadius: 12,
              opacity: p * tenue,
              transform: `translateY(${(1 - p) * 16}px) scale(${pop})`,
              boxShadow: ev ? `0 10px 30px ${col}33` : "none",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontFamily: serif, fontWeight: 700, fontSize: 31, color: C.tinta }}>{q.nombre}</span>
              <span style={{ fontFamily: mono, fontSize: 17, color: C.tintaSuave }}>{q.art}</span>
            </div>
            <div style={{ fontFamily: sans, fontSize: 21, color: C.tintaSuave, marginTop: 6 }}>{q.pregunta}</div>
            {ev?.respuesta && (
              <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 21, color: col, marginTop: 12, opacity: entra(frame, ev.at, 12), lineHeight: 1.2 }}>
                {ev.respuesta}
              </div>
            )}
          </div>
        );
      })}
      {/* expediente al centro */}
      <div
        style={{
          position: "absolute",
          left: CENTRO.x - 62,
          top: CENTRO.y - 46,
          width: 124,
          height: 92,
          background: C.papelOscuro,
          border: `2px solid ${C.tinta}`,
          borderRadius: "4px 14px 4px 4px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: mono,
          fontSize: 17,
          color: C.tinta,
          opacity: entra(frame, aparicion, 14),
          boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
        }}
      >
        {etiquetaExp}
      </div>
    </div>
  );
};
