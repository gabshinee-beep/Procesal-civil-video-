import React from "react";
import { useCurrentFrame } from "remotion";
import { C, mono, serif } from "../theme";
import { entra } from "../anim";

// Etiquetas que aparecen sobre tus manos cuando las levantas (posiciones medidas con rastreo de pose,
// ya convertidas a la posición de tu recorte en la escena). t en segundos del video final.
const ETIQUETAS = [
  { t0: 36.4, t1: 38.2, x: 193, y: 400, texto: "RECURSO", sub: "acto en resolución", color: C.rojo },
  { t0: 38.4, t1: 39.6, x: 627, y: 435, texto: "REMEDIO", sub: "acto fuera de resolución", color: C.azul },
  { t0: 63.6, t1: 66.0, x: 219, y: 458, texto: "INTRÍNSECO", sub: "capacidad · objeto · finalidad", color: C.rojo },
  { t0: 66.8, t1: 68.4, x: 621, y: 493, texto: "EXTRÍNSECO", sub: "la forma", color: C.azul },
];

export const EtiquetasMano: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {ETIQUETAS.map((e) => {
        const a = Math.round(e.t0 * 30);
        const b = Math.round(e.t1 * 30);
        if (frame < a || frame > b + 10) return null;
        const p = entra(frame, a, 12);
        const o = Math.min(p, 1 - entra(frame, b, 10));
        return (
          <div key={e.texto} style={{ position: "absolute", left: e.x, top: e.y, opacity: o, transform: `translate(-50%, -100%) translateY(${(1 - p) * 30}px) scale(${0.7 + 0.3 * p})` }}>
            <div style={{ position: "absolute", left: "50%", bottom: -46, width: 120, height: 60, transform: "translateX(-50%)", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,226,170,0.7), transparent 70%)", filter: "blur(6px)" }} />
            <div style={{ padding: "12px 22px", borderRadius: 14, background: "#FBF8F2", border: `4px solid ${e.color}`, boxShadow: "0 14px 34px rgba(0,0,0,0.3)", textAlign: "center", whiteSpace: "nowrap" }}>
              <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 40, color: e.color, letterSpacing: 1 }}>{e.texto}</div>
              <div style={{ fontFamily: mono, fontSize: 15, letterSpacing: 2, color: C.tintaSuave, marginTop: 2 }}>{e.sub.toUpperCase()}</div>
            </div>
          </div>
        );
      })}
    </>
  );
};
