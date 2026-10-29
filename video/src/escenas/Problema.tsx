import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camara } from "../components/Camara";
import { Panel } from "../components/Panel";
import { Ficha } from "../components/Ficha";
import { LineaTiempo } from "../components/LineaTiempo";
import { CitaCinetica } from "../components/CitaCinetica";
import { useCues } from "../tiempos";
import { C, serif } from "../theme";
import { entra, rango, ventana } from "../anim";

export const Problema: React.FC = () => {
  const frame = useCurrentFrame();
  const c = useCues("problema");
  const fase1 = ventana(frame, 0, c("garantias"));
  const fase2 = ventana(frame, c("garantias"), c("couture"));
  const fase3 = entra(frame, c("couture"), 18);
  const tachar = rango(frame, c("perjuicios") - 20, c("perjuicios") - 4);
  const resaltar = rango(frame, c("perjuicios"), c("perjuicios") + 16);
  return (
    <AbsoluteFill>
      <Camara escenaId="problema" etiqueta="El problema" />
      <Panel kicker="02 · El problema" continuo>
        <div style={{ position: "absolute", inset: 0, opacity: fase1 }}>
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 56, color: C.tinta }}>Anular es retroceder</div>
          <div style={{ marginTop: 10 }}>
            <Ficha at={8} tipo="autor" texto="Monroy, citado por Arrarte" color={C.tintaSuave} />
          </div>
          <LineaTiempo x={0} y={300} ancho={868} aparicion={4} etiquetas={["Demanda", "Emplazamiento", "Contestación", "Audiencia", "Sentencia"]} rebobinar={{ idx: 1, at: c("costo") }} />
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: fase2 }}>
          <div style={{ fontFamily: serif, fontSize: 84, color: C.tinta, marginTop: 70 }}>
            Forma <span style={{ color: C.rojo }}>≠</span> fin
          </div>
          <div style={{ fontFamily: serif, fontSize: 84, color: C.verde, marginTop: 20, opacity: entra(frame, c("garantias") + 30, 16) }}>
            Forma = garantía
          </div>
          <div style={{ marginTop: 40 }}>
            <Ficha at={c("garantias") + 34} tipo="autor" texto="Calamandrei · Morello, citados por Arrarte" color={C.tintaSuave} />
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: fase3 }}>
          <div style={{ fontFamily: serif, fontSize: 140, lineHeight: 0.6, color: C.rojo, marginTop: 30 }}>“</div>
          <CitaCinetica
            escenaId="problema"
            texto="las nulidades no tienen por finalidad satisfacer pruritos formales, sino enmendar perjuicios efectivos."
            respaldoDesde={c("couture") + 20}
            style={{ fontFamily: serif, fontSize: 52, lineHeight: 1.25, color: C.tinta }}
            estilo={(i) =>
              i === 7 || i === 8
                ? { color: tachar > 0.5 ? C.tintaSuave : C.tinta, textDecorationLine: "line-through", textDecorationThickness: 5, textDecorationColor: `rgba(180,35,24,${tachar})` }
                : i >= 11
                  ? { color: resaltar > 0.3 ? C.verde : C.tinta, fontWeight: 600, background: `linear-gradient(to right, ${C.verde}33 ${resaltar * 100}%, transparent ${resaltar * 100}%)` }
                  : {}
            }
          />
          <div style={{ marginTop: 30 }}>
            <Ficha at={c("couture") + 10} tipo="autor" texto="— Eduardo Couture" />
          </div>
        </div>
      </Panel>
    </AbsoluteFill>
  );
};
