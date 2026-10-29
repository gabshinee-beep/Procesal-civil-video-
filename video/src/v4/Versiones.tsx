import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Grano } from "../components/Panel";
import { Personaje } from "../estilo/Personaje";
import { Documento } from "./Piezas";
import { C, mono, sans, serif } from "../theme";
import { entra } from "../anim";

// «La bifurcación»: el mismo defecto, dos versiones de la historia, lado a lado.
export type Celda = { at: number; color: string; texto: string };
export type Lado = {
  aparece: number;
  titulo: string;
  sinDefensa?: number; // frame en que se marca «SIN DEFENSA»
  filas?: (Celda | undefined)[]; // una por principio
  veredicto?: { at: number; texto: string; color: string };
};
const PRINCIPIOS = [
  { nombre: "Especificidad", art: "171 · 437" },
  { nombre: "Convalidación", art: "172" },
  { nombre: "Trascendencia", art: "174" },
  { nombre: "Protección", art: "175.1" },
];

export const Versiones: React.FC<{ v1: Lado; v2: Lado; filasDesde?: number; filasActivas?: number[] }> = ({ v1, v2, filasDesde, filasActivas = [] }) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ background: C.noche }}>
      {[v1, v2].map((lado, k) => {
        const p = entra(frame, lado.aparece, 20);
        const x0 = k === 0 ? 60 : 1160; // contenido de cada mitad (deja libre el corte central)
        const sinDef = lado.sinDefensa !== undefined && frame >= lado.sinDefensa;
        return (
          <div key={k} style={{ position: "absolute", left: k * 964, top: 0, width: 956, height: 1080, background: C.papel, overflow: "hidden", opacity: p, transform: `translateX(${(1 - p) * (k ? 60 : -60)}px)` }}>
            <Grano />
            <div style={{ position: "absolute", left: x0 - k * 964, top: 118, fontFamily: mono, fontSize: 22, letterSpacing: 5, color: k ? C.rojo : C.verde }}>VERSIÓN {k + 1}</div>
            <div style={{ position: "absolute", left: x0 - k * 964, top: 152, fontFamily: serif, fontWeight: 600, fontSize: 42, color: C.tinta }}>{lado.titulo}</div>
            <Personaje quien="mario" x={x0 - k * 964 + 170} y={450} escala={0.8} tenue={k === 1} />
            {k === 0 ? (
              <Documento x={x0 + 360} y={360} titulo="CONTESTACIÓN" color={C.verde} escala={0.9} />
            ) : (
              <div style={{ position: "absolute", left: x0 - k * 964 + 330, top: 260, fontFamily: serif, fontSize: 130, color: C.rojo, opacity: 0.85 }}>?</div>
            )}
            {sinDef && (
              <div style={{ position: "absolute", left: x0 - k * 964 + 300, top: 400, padding: "6px 14px", border: `3px solid ${C.rojo}`, borderRadius: 8, fontFamily: mono, fontSize: 20, letterSpacing: 2, color: C.rojo, opacity: entra(frame, lado.sinDefensa!, 10) }}>
                SIN DEFENSA
              </div>
            )}
            {filasDesde !== undefined &&
              PRINCIPIOS.map((pr, i) => {
                const celda = lado.filas?.[i];
                const on = celda && frame >= celda.at;
                const activa = filasActivas.includes(i);
                const pf = entra(frame, filasDesde + i * 4, 14);
                return (
                  <div key={pr.nombre} style={{ position: "absolute", left: x0 - k * 964, top: 500 + i * 92, width: 700, height: 78, boxSizing: "border-box", padding: "10px 18px", background: "#FBF8F2", border: `3px solid ${on ? celda!.color : activa ? C.ambar : C.linea}`, borderRadius: 12, opacity: pf, display: "flex", alignItems: "center", gap: 18 }}>
                    <div style={{ width: 230 }}>
                      <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 27, color: C.tinta }}>{pr.nombre}</div>
                      <div style={{ fontFamily: mono, fontSize: 14, color: C.tintaSuave }}>ART. {pr.art}</div>
                    </div>
                    {on && <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 22, lineHeight: 1.2, color: celda!.color, opacity: entra(frame, celda!.at, 10) }}>{celda!.texto}</div>}
                  </div>
                );
              })}
            {lado.veredicto && frame >= lado.veredicto.at && (
              <div style={{ position: "absolute", left: x0 - k * 964, top: 880, fontFamily: serif, fontWeight: 700, fontSize: 40, color: lado.veredicto.color, opacity: entra(frame, lado.veredicto.at, 12) }}>
                {lado.veredicto.texto}
              </div>
            )}
          </div>
        );
      })}
    </AbsoluteFill>
  );
};
