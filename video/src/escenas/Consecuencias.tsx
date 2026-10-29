import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camara } from "../components/Camara";
import { Panel } from "../components/Panel";
import { Ficha } from "../components/Ficha";
import { LineaTiempo } from "../components/LineaTiempo";
import { duracionEscena, useCues } from "../tiempos";
import { C, mono, sans, serif } from "../theme";
import { entra } from "../anim";

export const Consecuencias: React.FC = () => {
  const frame = useCurrentFrame();
  const c = useCues("consecuencias");
  return (
    <AbsoluteFill>
      <Camara escenaId="consecuencias" etiqueta="Efectos" />
      <Panel kicker="Peldaño 8 · Consecuencias" continuo salida={duracionEscena("consecuencias")}>
        <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 46, color: C.tinta }}>Efectos limitados</div>
        <div style={{ fontFamily: sans, fontSize: 25, color: C.tintaSuave, marginTop: 8 }}>Solo cae el acto nulo y lo que depende de él.</div>
        <LineaTiempo
          x={0}
          y={210}
          ancho={868}
          aparicion={-60}
          etiquetas={["Demanda", "Emplazamiento", "Rebeldía", "Audiencia", "Sentencia"]}
          domino={{ desdeIdx: 1, at: c("domino") + 4 }}
          sello={{ idx: 1, at: -60, texto: "NULO" }}
        />
        <div style={{ position: "absolute", left: 0, top: 400, fontFamily: mono, fontSize: 19, letterSpacing: 2, color: C.verde, opacity: entra(frame, c("enpie"), 14) }}>
          ▲ LA DEMANDA QUEDA EN PIE
        </div>
        <div style={{ position: "absolute", left: 0, top: 450 }}>
          <Ficha at={c("a173")} texto="ART. 173 CPC · EXTENSIÓN DE LA NULIDAD" color={C.rojo} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 530, padding: "14px 20px", borderLeft: `6px solid ${C.ambar}`, background: C.papelOscuro, opacity: entra(frame, c("excepcional"), 14) }}>
          <span style={{ fontFamily: serif, fontWeight: 700, fontSize: 34, color: C.tinta }}>Excepcional</span>
          <span style={{ fontFamily: sans, fontSize: 25, color: C.tintaSuave }}>{"  ·  "}en caso de duda, el proceso continúa</span>
        </div>
      </Panel>
    </AbsoluteFill>
  );
};
