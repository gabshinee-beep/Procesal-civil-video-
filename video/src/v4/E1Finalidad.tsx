import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Encuadre } from "../components/Encuadre";
import { LineaTiempo } from "../components/LineaTiempo";
import { Escenario, Glosario } from "./Piezas";
import { useCues } from "../tiempos";
import { C, mono, serif } from "../theme";
import { entra } from "../anim";

// Peldaños 1–3: abres tú a pantalla completa con la finalidad del proceso; luego los actos,
// el defecto y la nulidad como herramienta (ficha de glosario).
export const E1Finalidad: React.FC = () => {
  const frame = useCurrentFrame();
  const c = useCues("finalidad");
  const escenario = c("actos") - 6;
  return (
    <AbsoluteFill style={{ background: C.noche }}>
      {frame >= escenario - 2 && (
        <Escenario kicker="Peldaños 2–3 · Los actos y sus defectos" titulo="El proceso avanza con actos" desde={escenario} x={480}>
          <LineaTiempo x={480} y={300} ancho={1380} aparicion={escenario + 6} etiquetas={["Demanda", "Notificación", "Contestación", "Audiencia", "Sentencia"]} grieta={{ idx: 1, at: c("defectos") }} />
          <div style={{ position: "absolute", left: 750, top: 470, fontFamily: mono, fontSize: 19, letterSpacing: 2, color: C.rojo, opacity: entra(frame, c("defectos") + 6, 12) }}>▲ ACTO CON DEFECTO</div>
          <Glosario
            at={c("nulidad")}
            termino="Nulidad procesal"
            x={480}
            y={560}
            w={900}
            lineas={[
              { at: c("impugnatorio"), texto: "Un medio impugnatorio (Arrarte): una herramienta para cuestionar…" },
              { at: c("validez"), texto: "…la validez o eficacia de un acto procesal, o de todo el proceso." },
            ]}
          />
        </Escenario>
      )}
      <Encuadre escenaId="finalidad" etiqueta="Finalidad" pasos={[{ at: 0, modo: "completo" }, { at: escenario, modo: "pip" }]} />
      {frame < escenario + 10 && (
        <AbsoluteFill style={{ opacity: 1 - entra(frame, escenario - 6, 10) }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 40%, rgba(10,9,8,0.7) 64%)", opacity: entra(frame, c("conflicto") - 6, 12) }} />
          <div style={{ position: "absolute", left: 1080, top: 300, width: 780 }}>
            <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: 5, color: C.ambar, opacity: entra(frame, c("conflicto") - 6, 12) }}>PELDAÑO 1 · LA FINALIDAD DEL PROCESO</div>
            <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 76, lineHeight: 1.05, color: C.papel, marginTop: 14, opacity: entra(frame, c("conflicto"), 12) }}>Resolver conflictos…</div>
            <div style={{ fontFamily: serif, fontSize: 60, lineHeight: 1.1, color: "#8FC79C", marginTop: 10, opacity: entra(frame, c("garantias"), 12) }}>…respetando el debido proceso</div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
