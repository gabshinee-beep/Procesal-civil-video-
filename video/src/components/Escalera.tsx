import React from "react";
import { useCurrentFrame } from "remotion";
import guion from "../data/guion.json";
import { cue, escenas, inicioEscena } from "../tiempos";
import { C, mono } from "../theme";
import { entra } from "../anim";

// La escalera de ideas, visible: cada peldaño se enciende cuando el razonamiento llega a él.
const peldanoActual = (frame: number) => {
  let n = 0;
  let demo = false;
  for (const e of escenas) {
    const base = inicioEscena(e.id);
    if (frame < base) break;
    for (const p of e.peldanos as { n: number; cue?: string }[]) {
      if (frame >= base + (p.cue ? cue(e.id, p.cue) : 0)) n = Math.max(n, p.n);
    }
    demo = e.id.startsWith("caso");
  }
  return { n, demo };
};

export const Escalera: React.FC<{ visibleDesde: number; visibleHasta: number }> = ({ visibleDesde, visibleHasta }) => {
  const frame = useCurrentFrame();
  if (frame < visibleDesde || frame >= visibleHasta) return null;
  const { n, demo } = peldanoActual(frame);
  const o = entra(frame, visibleDesde, 16);
  return (
    <div style={{ position: "absolute", left: 880, top: 30, height: 74, display: "flex", alignItems: "flex-end", gap: 14, opacity: o }}>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4 }}>
        {guion.escalera.map((_, i) => {
          const k = i + 1;
          const on = k <= n;
          return (
            <div
              key={k}
              style={{
                width: 20,
                height: 8 + i * 8,
                borderRadius: 3,
                background: k === n ? C.rojo : on ? C.papel : "rgba(243,237,226,0.16)",
                transition: "none",
              }}
            />
          );
        })}
      </div>
      <div style={{ fontFamily: mono, fontSize: 17, letterSpacing: 2.5, color: C.papel, textTransform: "uppercase", paddingBottom: 2 }}>
        <span style={{ color: C.rojo }}>{demo ? "Demostración" : `Peldaño ${n}/8`}</span>
        {"  ·  "}
        {demo ? "los principios, aplicados" : guion.escalera[n - 1]}
      </div>
    </div>
  );
};
