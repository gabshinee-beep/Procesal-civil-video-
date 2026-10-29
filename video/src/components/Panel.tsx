import React from "react";
import { useCurrentFrame } from "remotion";
import { C, mono, PANEL } from "../theme";
import { entra, sale } from "../anim";

// Hoja de papel a la derecha del encuadre. Todo el razonamiento se dibuja aquí.
export const Panel: React.FC<{ kicker: string; entrada?: number; salida?: number; children: React.ReactNode }> = ({
  kicker,
  entrada = 0,
  salida,
  children,
}) => {
  const frame = useCurrentFrame();
  const p = entra(frame, entrada, 22);
  const s = salida === undefined ? 1 : sale(frame, salida - 10, 10);
  return (
    <div
      style={{
        position: "absolute",
        left: PANEL.x,
        top: PANEL.y,
        width: PANEL.w,
        height: PANEL.h,
        background: C.papel,
        borderRadius: 14,
        boxShadow: "0 30px 80px rgba(0,0,0,0.45), 0 2px 0 rgba(255,255,255,0.6) inset",
        transform: `translateX(${(1 - p) * 80}px)`,
        opacity: p * s,
        overflow: "hidden",
      }}
    >
      <Grano />
      <div style={{ position: "absolute", left: 56, top: 40, fontFamily: mono, fontSize: 20, letterSpacing: 3, color: C.rojo, textTransform: "uppercase" }}>
        {kicker}
      </div>
      <div style={{ position: "absolute", left: 56, right: 56, top: 92, bottom: 48 }}>{children}</div>
    </div>
  );
};

export const Grano: React.FC = () => (
  <svg width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: 0.18, mixBlendMode: "multiply" }}>
    <filter id="grano">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves={2} stitchTiles="stitch" />
      <feColorMatrix values="0 0 0 0 0.35  0 0 0 0 0.3  0 0 0 0 0.22  0 0 0 0.55 0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#grano)" />
  </svg>
);
