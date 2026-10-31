import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Encuadre } from "../components/Encuadre";
import { Personaje } from "../estilo/Personaje";
import { Escenario, Juzgado, Sobre, Documento, bezier } from "../v4/Piezas";
import { escenas, useCues } from "../tiempos";
import { C, mono, sans, serif } from "../theme";
import { entra, rango } from "../anim";

// Los cuatro principios ACTUADOS por las partes del caso: cada uno es una mini-escena.
type Seg = { cues: { id: string }[]; nombres?: { demandante?: string; demandado?: string }; orden?: string[] };
// Cada criterio/principio tiene su mini-escena (`v`); el orden lo da el segmento (como lo explicaste).
const DEF: Record<string, { nombre: string; art: string; idea: string; v: string }> = {
  p1: { nombre: "Especificidad", art: "Arts. 171 · 437", idea: "¿La ley sanciona el vicio, expresa o implícitamente?", v: "libro" },
  p2: { nombre: "Convalidación", art: "Art. 172", idea: "Si el acto cumplió su finalidad, queda convalidado", v: "contesta" },
  p3: { nombre: "Trascendencia", art: "Art. 174", idea: "Sin perjuicio real, no hay nulidad", v: "balanza" },
  p4: { nombre: "Protección", art: "Art. 175.1", idea: "Quien causó el vicio no puede pedir la nulidad", v: "tacha" },
  finalidad: { nombre: "Criterio de finalidad", art: "Arts. 171 · 172", idea: "Si el acto cumple su finalidad, vale aunque tenga un error", v: "contesta" },
  proteccion: { nombre: "Protección", art: "Art. 175.1", idea: "Quien causó el vicio no puede pedir la nulidad", v: "tacha" },
  especificidad: { nombre: "Especificidad", art: "Art. 171", idea: "Debe haber una causa legal (expresa o implícita)", v: "libro" },
  convalidacion: { nombre: "Convalidación", art: "Art. 172", idea: "El afectado puede convalidar: expresamente o no reclamando a tiempo", v: "consiente" },
  trascendencia: { nombre: "Trascendencia", art: "Art. 174", idea: "Solo hay nulidad si hay un perjuicio real", v: "balanza" },
};
const LAURA: [number, number] = [980, 700];
const MARIO: [number, number] = [1660, 700];
const JUZ: [number, number] = [1320, 300];

export const PrincipiosPartes: React.FC<{ id?: string }> = ({ id = "" }) => {
  const frame = useCurrentFrame();
  const c = useCues(id);
  const seg = escenas.find((e) => e.id === id) as unknown as Seg;
  const tiene = (k: string) => seg.cues.some((x) => x.id === k);
  const P = (seg.orden ?? ["p1", "p2", "p3", "p4"]).map((id) => ({ id, ...DEF[id] }));
  const ats = P.map((p, i) => (tiene(p.id) ? c(p.id) : 20 + i * 150));
  const vis = actualVis(P, ats, frame);
  const actual = ats.reduce((acc, at, i) => (frame >= at ? i : acc), -1);
  const t = actual >= 0 ? frame - ats[actual] : 0;
  const at0 = actual >= 0 ? ats[actual] : 0;
  const nombres = seg.nombres ?? {};
  return (
    <AbsoluteFill style={{ background: C.noche }}>
      <Escenario kicker="Pregunta 5 · El criterio de finalidad y los principios" x={760}>
        <Juzgado x={JUZ[0]} y={JUZ[1] - 40} escala={0.8} />
        <Personaje quien="laura" x={LAURA[0]} y={LAURA[1]} escala={0.8} nombre={nombres.demandante} />
        <Personaje quien="mario" x={MARIO[0]} y={MARIO[1]} escala={0.8} nombre={nombres.demandado} tenue={vis === "balanza" && t > 20 && t < 90} />

        {/* 1 · Especificidad: el Código se abre y señala el artículo */}
        {vis === "libro" && (
          <div style={{ position: "absolute", left: JUZ[0] - 150, top: 390, width: 300, textAlign: "center", opacity: entra(frame, at0 + 4, 14) }}>
            <svg width={300} height={150}>
              <path d={`M 150 20 L ${150 - 120 * rango(frame, at0 + 4, at0 + 20)} 30 L ${150 - 120 * rango(frame, at0 + 4, at0 + 20)} 140 L 150 130 Z`} fill="#FBF8F2" stroke={C.tinta} strokeWidth={4} />
              <path d={`M 150 20 L ${150 + 120 * rango(frame, at0 + 4, at0 + 20)} 30 L ${150 + 120 * rango(frame, at0 + 4, at0 + 20)} 140 L 150 130 Z`} fill="#FBF8F2" stroke={C.tinta} strokeWidth={4} />
              <text x={90} y={88} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={20} fill={C.tinta}>CPC</text>
              <text x={210} y={88} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={20} fill={C.rojo} opacity={rango(frame, at0 + 20, at0 + 30)}>437</text>
            </svg>
          </div>
        )}

        {/* 2 · Convalidación: el sobre llega mal, pero Mario contesta → el defecto se cura */}
        {vis === "contesta" && (() => {
          const [sx, sy] = bezier([JUZ[0], 330], [1560, 360], [MARIO[0] - 40, 480], rango(frame, at0 + 4, at0 + 30));
          const [dx, dy] = bezier([MARIO[0] - 40, 470], [1500, 330], [JUZ[0] + 20, 340], rango(frame, at0 + 40, at0 + 66));
          const curado = frame >= at0 + 70;
          return (
            <>
              {frame < at0 + 40 && <Sobre x={sx} y={sy} color={C.rojo} />}
              {frame >= at0 + 40 && (
                <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${dx - 1600}px, ${dy - 470}px)` }}>
                  <Documento x={1600} y={470} titulo="CONTESTACIÓN" color={C.verde} escala={0.5} />
                </div>
              )}
              {curado && <div style={{ position: "absolute", left: 1450, top: 520, fontFamily: sans, fontWeight: 700, fontSize: 30, color: C.verde, opacity: entra(frame, at0 + 70, 10) }}>✓ Se defendió</div>}
            </>
          );
        })()}

        {/* 3 · Trascendencia: una balanza pesa el perjuicio real */}
        {vis === "balanza" && (() => {
          const caida = rango(frame, at0 + 14, at0 + 34);
          return (
            <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: entra(frame, at0 + 2, 12), transform: "translateY(110px)" }}>
              <line x1={1320} y1={360} x2={1320} y2={560} stroke={C.tinta} strokeWidth={6} />
              <g transform={`rotate(${caida * 12} 1320 380)`}>
                <line x1={1140} y1={380} x2={1500} y2={380} stroke={C.tinta} strokeWidth={6} />
                <path d="M 1100 440 L 1180 440 L 1140 380 Z M 1460 440 L 1540 440 L 1500 380 Z" fill="none" stroke={C.tinta} strokeWidth={3} />
                <rect x={1470} y={410} width={60} height={30} rx={4} fill={C.rojo} opacity={caida} />
              </g>
              <text x={1500} y={520} textAnchor="middle" fontFamily="Inter" fontWeight={700} fontSize={22} fill={C.rojo} opacity={caida}>¿perjuicio real?</text>
            </svg>
          );
        })()}

        {/* 4 · Protección: si Mario causó el vicio, su pedido de nulidad se rechaza */}
        {vis === "consiente" && (
          <div style={{ position: "absolute", left: MARIO[0] - 330, top: 330, width: 300, opacity: entra(frame, at0 + 4, 12) }}>
            <Documento x={150} y={95} titulo="CONSIENTE" color={C.verde} escala={0.75} />
            <div style={{ position: "absolute", left: 0, top: 200, width: 300, textAlign: "center", fontFamily: sans, fontWeight: 600, fontSize: 22, color: C.verde, opacity: entra(frame, at0 + 30, 10) }}>expresa · o no reclama a tiempo ⏱</div>
          </div>
        )}
        {vis === "tacha" && (
          <div style={{ position: "absolute", left: MARIO[0] - 200, top: 350, width: 260, opacity: entra(frame, at0 + 4, 12) }}>
            <div style={{ position: "relative" }}>
              <Documento x={130} y={95} titulo="PIDE NULIDAD" color={C.tinta} escala={0.75} />
              <svg width={260} height={190} style={{ position: "absolute", left: 0, top: 0, opacity: entra(frame, at0 + 24, 8) }}>
                <path d="M 60 30 L 200 170 M 200 30 L 60 170" stroke={C.rojo} strokeWidth={12} strokeLinecap="round" />
              </svg>
            </div>
          </div>
        )}

        {/* ficha del principio activo + marcador 1–4 */}
        {actual >= 0 && (
          <div key={actual} style={{ position: "absolute", left: 760, top: 800, width: 1100, padding: "18px 24px", background: "#FBF8F2", border: `3px solid ${C.tinta}`, borderRadius: 14, opacity: entra(frame, ats[actual], 12) }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 18 }}>
              <span style={{ fontFamily: mono, fontSize: 20, color: C.rojo }}>{actual + 1}/{P.length}</span>
              <span style={{ fontFamily: serif, fontWeight: 700, fontSize: 40, color: C.tinta }}>{P[actual].nombre}</span>
              <span style={{ fontFamily: mono, fontSize: 18, color: C.tintaSuave }}>{P[actual].art.toUpperCase()}</span>
            </div>
            <div style={{ fontFamily: sans, fontSize: 26, color: C.tinta, marginTop: 6 }}>{P[actual].idea}</div>
          </div>
        )}
        <div style={{ position: "absolute", left: 760, top: 160, display: "flex", gap: 10 }}>
          {P.map((p, i) => (
            <span key={p.id} style={{ padding: "6px 14px", borderRadius: 999, fontFamily: mono, fontSize: 16, letterSpacing: 2, background: i === actual ? C.tinta : "transparent", color: i === actual ? C.papel : i < actual ? C.tinta : C.tintaSuave, border: `2px solid ${i <= actual ? C.tinta : C.linea}` }}>
              {p.nombre.toUpperCase()}
            </span>
          ))}
        </div>
      </Escenario>
      <Encuadre escenaId={id} etiqueta="Los principios" pasos={[{ at: 0, modo: "ventana" }]} />
    </AbsoluteFill>
  );
};

const actualVis = (P: { v: string }[], ats: number[], frame: number) => {
  const i = ats.reduce((acc, at, k) => (frame >= at ? k : acc), -1);
  return i >= 0 ? P[i].v : "";
};
