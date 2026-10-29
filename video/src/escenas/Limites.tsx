import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camara } from "../components/Camara";
import { Panel } from "../components/Panel";
import { Ficha } from "../components/Ficha";
import { LineaTiempo } from "../components/LineaTiempo";
import { CitaCinetica } from "../components/CitaCinetica";
import { useCues } from "../tiempos";
import { C, sans, serif } from "../theme";
import { entra, rango, ventana } from "../anim";

export const Limites: React.FC = () => {
  const frame = useCurrentFrame();
  const c = useCues("limites");
  const fase1 = ventana(frame, 0, c("couture"));
  const fase2 = entra(frame, c("couture"), 16);
  const tachar = rango(frame, c("perjuicios") - 20, c("perjuicios") - 4);
  const resaltar = rango(frame, c("perjuicios"), c("perjuicios") + 16);
  return (
    <AbsoluteFill>
      <Camara escenaId="limites" etiqueta="Los límites" />
      <Panel kicker="Peldaño 6 · Necesidad de límites" continuo>
        <div style={{ position: "absolute", inset: 0, opacity: fase1 }}>
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 56, color: C.tinta }}>Anular es retroceder</div>
          <div style={{ marginTop: 10 }}>
            <Ficha at={8} tipo="autor" texto="Monroy, citado por Arrarte" color={C.tintaSuave} />
          </div>
          <LineaTiempo x={0} y={300} ancho={868} aparicion={0} etiquetas={["Demanda", "Emplazamiento", "Contestación", "Audiencia", "Sentencia"]} rebobinar={{ idx: 1, at: c("costo") }} />
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: fase2 }}>
          <div style={{ fontFamily: serif, fontSize: 130, lineHeight: 0.6, color: C.rojo, marginTop: 10 }}>“</div>
          <CitaCinetica
            escenaId="limites"
            texto="las nulidades no tienen por finalidad satisfacer pruritos formales, sino enmendar perjuicios efectivos."
            respaldoDesde={c("couture") + 20}
            style={{ fontFamily: serif, fontSize: 50, lineHeight: 1.22, color: C.tinta }}
            estilo={(i) =>
              i === 7 || i === 8
                ? { color: tachar > 0.5 ? C.tintaSuave : C.tinta, textDecorationLine: "line-through", textDecorationThickness: 5, textDecorationColor: `rgba(180,35,24,${tachar})` }
                : i >= 11
                  ? { color: resaltar > 0.3 ? C.verde : C.tinta, fontWeight: 600, background: `linear-gradient(to right, ${C.verde}33 ${resaltar * 100}%, transparent ${resaltar * 100}%)` }
                  : {}
            }
          />
          <div style={{ marginTop: 18 }}>
            <Ficha at={c("couture") + 10} tipo="autor" texto="— Eduardo Couture" />
          </div>
          <div style={{ position: "absolute", left: 0, top: 520, display: "flex", alignItems: "center", gap: 16, opacity: entra(frame, c("criterios"), 14) }}>
            <span style={{ fontFamily: serif, fontSize: 46, color: C.ambar }}>→</span>
            <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 32, color: C.tinta }}>Criterios que limiten la nulidad</span>
          </div>
        </div>
      </Panel>
    </AbsoluteFill>
  );
};
