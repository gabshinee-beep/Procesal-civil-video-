import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camara } from "../components/Camara";
import { Panel } from "../components/Panel";
import { Ficha } from "../components/Ficha";
import { useCues } from "../tiempos";
import { C, mono, sans, serif } from "../theme";
import { entra, rango, ventana } from "../anim";

export const Concepto: React.FC = () => {
  const frame = useCurrentFrame();
  const c = useCues("concepto");
  const columnas = ventana(frame, c("recurso"), c("vicios"));
  const diagrama = entra(frame, c("vicios") + 4, 18);
  const extr = frame >= c("extrinseco");
  const intr = frame >= c("intrinseco");
  return (
    <AbsoluteFill>
      <Camara escenaId="concepto" etiqueta="Qué es" />
      <Panel kicker="Peldaño 4 · Naturaleza y alcance" continuo>
        <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 50, color: C.tinta }}>¿Qué es la nulidad?</div>
        <div style={{ marginTop: 22, opacity: entra(frame, c("definicion"), 16) }}>
          <span style={{ fontFamily: serif, fontSize: 58, color: C.tinta, position: "relative" }}>
            Medio impugnatorio
            <span style={{ position: "absolute", left: 0, bottom: -4, height: 5, width: `${rango(frame, c("definicion") + 6, c("definicion") + 24) * 100}%`, background: C.rojo }} />
          </span>
          <div style={{ fontFamily: sans, fontSize: 27, color: C.tintaSuave, marginTop: 14 }}>
            para cuestionar la validez de un acto procesal, o de todo el proceso
          </div>
        </div>

        {/* Recurso vs. remedio */}
        <div style={{ position: "absolute", top: 250, left: 0, right: 0, display: "flex", gap: 28, opacity: columnas }}>
          {[
            { at: c("recurso"), nombre: "Recurso", desc: "El acto está contenido en una resolución", ej: "decreto · auto · sentencia" },
            { at: c("remedio"), nombre: "Remedio", desc: "El acto no está en una resolución", ej: "p. ej., una notificación" },
          ].map((k) => {
            const p = entra(frame, k.at, 16);
            return (
              <div key={k.nombre} style={{ flex: 1, padding: 26, border: `3px solid ${C.tinta}`, borderRadius: 12, background: "#FBF8F2", opacity: p, transform: `translateY(${(1 - p) * 18}px)` }}>
                <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 40, color: C.tinta }}>{k.nombre}</div>
                <div style={{ fontFamily: sans, fontSize: 24, color: C.tinta, marginTop: 10 }}>{k.desc}</div>
                <div style={{ fontFamily: mono, fontSize: 19, color: C.tintaSuave, marginTop: 14 }}>{k.ej}</div>
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", top: 530, left: 0, opacity: columnas }}>
          <Ficha at={c("recurso")} texto="ART. 356 CPC" />
        </div>

        {/* Vicios: forma (extrínseco) vs. contenido (intrínseco) */}
        <div style={{ position: "absolute", top: 240, left: 0, width: 560, height: 330, opacity: diagrama }}>
          <div style={{ position: "absolute", inset: 0, border: `4px dashed ${extr ? C.rojo : C.tinta}`, borderRadius: 16 }} />
          <div style={{ position: "absolute", left: 22, top: 14, fontFamily: mono, fontSize: 20, letterSpacing: 3, color: extr ? C.rojo : C.tinta }}>FORMA</div>
          <div style={{ position: "absolute", left: 50, right: 50, top: 70, bottom: 40, background: "#FBF8F2", border: `3px solid ${intr ? C.rojo : C.tinta}`, borderRadius: 12, padding: 20 }}>
            <div style={{ fontFamily: mono, fontSize: 18, letterSpacing: 3, color: C.tintaSuave }}>ACTO PROCESAL · CONTENIDO</div>
            <div style={{ display: "flex", gap: 12, marginTop: 26, flexWrap: "wrap" }}>
              {["Capacidad", "Objeto", "Finalidad"].map((x) => (
                <span key={x} style={{ fontFamily: sans, fontWeight: 600, fontSize: 24, padding: "8px 14px", borderRadius: 8, background: intr ? `${C.rojo}18` : C.papelOscuro, color: intr ? C.rojo : C.tinta }}>
                  {x}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", top: 260, left: 600, width: 270 }}>
          <div style={{ opacity: entra(frame, c("extrinseco"), 14) }}>
            <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 32, color: C.rojo }}>Extrínseco</div>
            <div style={{ fontFamily: sans, fontSize: 22, color: C.tintaSuave }}>vicio en la forma</div>
          </div>
          <div style={{ marginTop: 60, opacity: entra(frame, c("intrinseco"), 14) }}>
            <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 32, color: C.rojo }}>Intrínseco</div>
            <div style={{ fontFamily: sans, fontSize: 22, color: C.tintaSuave }}>vicio en el contenido</div>
          </div>
        </div>
        <div style={{ position: "absolute", top: 595, left: 0 }}>
          <Ficha at={c("vicios") + 10} tipo="autor" texto="Berizonce, citado por Arrarte" color={C.tintaSuave} />
        </div>
      </Panel>
    </AbsoluteFill>
  );
};
