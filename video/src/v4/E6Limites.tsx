import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Encuadre } from "../components/Encuadre";
import { Ficha } from "../components/Ficha";
import { LineaTiempo } from "../components/LineaTiempo";
import { Escenario, Candado, Aparece } from "./Piezas";
import { useCues } from "../tiempos";
import { C, mono, sans, serif } from "../theme";
import { entra, ventana } from "../anim";

// Peldaño 6: no todas las normas obligan igual (imperatividad) + anular retrocede/dilata → principios.
export const E6Limites: React.FC = () => {
  const frame = useCurrentFrame();
  const c = useCues("limites");
  const fase1 = ventana(frame, 0, c("retroceder") - 4);
  const fase2 = entra(frame, c("retroceder") - 4, 16);
  return (
    <AbsoluteFill style={{ background: C.noche }}>
      <Escenario kicker="Peldaño 6 · Necesidad de límites" x={760}>
        <div style={{ position: "absolute", inset: 0, opacity: fase1 }}>
          <div style={{ position: "absolute", left: 760, top: 150, fontFamily: serif, fontWeight: 600, fontSize: 50, color: C.tinta }}>No todas las normas obligan igual</div>
          {[
            { at: c("pacto"), abierto: true, t: "Admiten pacto", s: "p. ej., competencia territorial (art. 25)", col: C.tintaSuave },
            { at: c("esenciales"), abierto: false, t: "Esenciales", s: "protegen la defensa: obligatorias", col: C.rojo },
          ].map((k, i) => (
            <Aparece key={i} at={k.at} style={{ left: 760 + i * 560, top: 300, width: 520 }}>
              <div style={{ padding: 28, borderRadius: 16, border: `4px solid ${k.col}`, background: "#FBF8F2", display: "flex", gap: 24, alignItems: "center" }}>
                <Candado abierto={k.abierto} color={k.col} />
                <div>
                  <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 38, color: C.tinta }}>{k.t}</div>
                  <div style={{ fontFamily: sans, fontSize: 23, color: C.tintaSuave, marginTop: 6 }}>{k.s}</div>
                </div>
              </div>
            </Aparece>
          ))}
          <div style={{ position: "absolute", left: 760, top: 560 }}>
            <Ficha at={c("pacto")} texto="ART. IX TP CPC · IMPERATIVIDAD" />
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: fase2 }}>
          <div style={{ position: "absolute", left: 760, top: 150, fontFamily: serif, fontWeight: 600, fontSize: 50, color: C.tinta }}>Anular es retroceder</div>
          <LineaTiempo x={760} y={360} ancho={1100} aparicion={c("retroceder") - 4} etiquetas={["Demanda", "Notificación", "Contestación", "Audiencia", "Sentencia"]} rebobinar={{ idx: 1, at: c("retroceder") + 6 }} />
          <Aparece at={c("dilatar")} style={{ left: 760, top: 600 }}>
            <span style={{ fontFamily: mono, fontSize: 22, letterSpacing: 3, color: C.rojo }}>⏱ RIESGO: DILATAR EL PROCESO</span>
          </Aparece>
          <Aparece at={c("principios")} style={{ left: 760, top: 700, width: 1100 }}>
            <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 30, color: C.tinta, marginBottom: 16 }}>→ Principios que limitan la nulidad</div>
            <div style={{ display: "flex", gap: 14 }}>
              {["Especificidad", "Convalidación", "Trascendencia", "Protección"].map((p, i) => (
                <span key={p} style={{ padding: "10px 18px", border: `3px solid ${C.ambar}`, borderRadius: 10, background: "#FBF8F2", fontFamily: serif, fontWeight: 700, fontSize: 26, color: C.tinta, opacity: entra(frame, c("principios") + 6 + i * 5, 10) }}>
                  {p}
                </span>
              ))}
            </div>
          </Aparece>
        </div>
      </Escenario>
      <Encuadre escenaId="limites" etiqueta="Necesidad de límites" pasos={[{ at: 0, modo: "ventana" }]} />
    </AbsoluteFill>
  );
};
