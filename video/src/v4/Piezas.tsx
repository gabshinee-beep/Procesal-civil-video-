import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Grano } from "../components/Panel";
import { C, mono, sans, serif } from "../theme";
import { entra } from "../anim";

// Piezas visuales del «expediente de Rosa y Mario», reutilizadas en todas las escenas v4.

export const Escenario: React.FC<{ kicker: string; titulo?: string; desde?: number; children?: React.ReactNode; x?: number }> = ({ kicker, titulo, desde = 0, children, x = 120 }) => {
  const frame = useCurrentFrame();
  const o = entra(frame, desde, 18);
  return (
    <AbsoluteFill style={{ background: C.papel, opacity: o }}>
      <Grano />
      <div style={{ position: "absolute", left: x, top: 118, fontFamily: mono, fontSize: 20, letterSpacing: 5, color: C.rojo, textTransform: "uppercase" }}>{kicker}</div>
      {titulo && <div style={{ position: "absolute", left: x, top: 150, fontFamily: serif, fontWeight: 600, fontSize: 50, color: C.tinta }}>{titulo}</div>}
      {children}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, transparent 65%, rgba(60,45,30,0.18) 100%)", pointerEvents: "none" }} />
    </AbsoluteFill>
  );
};

export const Aparece: React.FC<{ at: number; children: React.ReactNode; style?: React.CSSProperties; dy?: number; hasta?: number }> = ({ at, children, style, dy = 14, hasta }) => {
  const frame = useCurrentFrame();
  const p = entra(frame, at, 16);
  const s = hasta === undefined ? 1 : 1 - entra(frame, hasta, 12);
  if (p <= 0.001 || s <= 0.001) return null;
  return <div style={{ position: "absolute", opacity: p * s, transform: `translateY(${(1 - p) * dy}px)`, ...style }}>{children}</div>;
};

// Ficha de glosario: el término jurídico + su traducción a lenguaje claro.
export const Glosario: React.FC<{ at: number; termino: string; lineas: { at: number; texto: string }[]; x: number; y: number; w?: number }> = ({ at, termino, lineas, x, y, w = 560 }) => {
  const frame = useCurrentFrame();
  const p = entra(frame, at, 16);
  return (
    <div style={{ position: "absolute", left: x, top: y, width: w, padding: "22px 26px", background: "#FBF8F2", border: `3px solid ${C.tinta}`, borderRadius: 14, boxShadow: "0 16px 40px rgba(60,45,30,0.18)", opacity: p, transform: `translateY(${(1 - p) * 16}px)` }}>
      <div style={{ fontFamily: mono, fontSize: 16, letterSpacing: 3, color: C.tintaSuave }}>GLOSARIO</div>
      <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 40, color: C.rojo, marginTop: 4 }}>{termino}</div>
      {lineas.map((l, i) => (
        <div key={i} style={{ fontFamily: sans, fontSize: 24, lineHeight: 1.3, color: C.tinta, marginTop: 8, opacity: entra(frame, l.at, 14) }}>
          {l.texto}
        </div>
      ))}
    </div>
  );
};

export const Juzgado: React.FC<{ x: number; y: number; escala?: number }> = ({ x, y, escala = 1 }) => (
  <div style={{ position: "absolute", left: x, top: y, transform: `translate(-50%, 0) scale(${escala})`, transformOrigin: "50% 0", textAlign: "center" }}>
    <svg width={200} height={130}>
      <path d="M 10 50 L 100 8 L 190 50 Z" fill={C.tinta} />
      {[30, 70, 110, 150].map((xx) => <rect key={xx} x={xx} y={58} width={18} height={56} fill={C.tinta} />)}
      <rect x={10} y={116} width={180} height={12} fill={C.tinta} />
    </svg>
    <div style={{ fontFamily: mono, fontSize: 16, letterSpacing: 3, color: C.tinta }}>JUZGADO</div>
  </div>
);

export const Sobre: React.FC<{ x: number; y: number; giro?: number; escala?: number; color?: string }> = ({ x, y, giro = -6, escala = 1, color = C.tinta }) => (
  <svg width={96} height={64} style={{ position: "absolute", left: x - 48, top: y - 32, transform: `rotate(${giro}deg) scale(${escala})` }}>
    <rect x={3} y={3} width={90} height={58} rx={6} fill="#FBF8F2" stroke={color} strokeWidth={3} />
    <path d="M 6 8 L 48 36 L 90 8" fill="none" stroke={color} strokeWidth={3} />
  </svg>
);

export const Documento: React.FC<{ x: number; y: number; titulo: string; color?: string; escala?: number }> = ({ x, y, titulo, color = C.tinta, escala = 1 }) => (
  <svg width={150} height={190} style={{ position: "absolute", left: x - 75, top: y - 95, transform: `scale(${escala})` }}>
    <rect x={6} y={6} width={138} height={178} rx={8} fill="#FBF8F2" stroke={color} strokeWidth={4} />
    <text x={75} y={36} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={titulo.length > 11 ? 12 : 15} fill={color}>{titulo}</text>
    {[60, 88, 116, 144].map((yy) => <rect key={yy} x={26} y={yy} width={98} height={8} rx={4} fill={C.linea} />)}
  </svg>
);

// Punto sobre una curva cuadrática (para que los documentos viajen con naturalidad).
export const bezier = (p0: [number, number], p1: [number, number], p2: [number, number], t: number): [number, number] => {
  const u = 1 - t;
  return [u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1]];
};

export const Candado: React.FC<{ abierto: boolean; color: string }> = ({ abierto, color }) => (
  <svg width={90} height={110} viewBox="0 0 90 110">
    <path d={abierto ? "M 22 50 L 22 30 Q 22 8 45 8 Q 68 8 68 30 L 68 34" : "M 22 50 L 22 30 Q 22 8 45 8 Q 68 8 68 30 L 68 50"} fill="none" stroke={color} strokeWidth={9} strokeLinecap="round" />
    <rect x={8} y={48} width={74} height={56} rx={10} fill={color} />
    <circle cx={45} cy={72} r={7} fill="#FBF8F2" />
  </svg>
);
