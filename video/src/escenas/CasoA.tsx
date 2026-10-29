import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camara } from "../components/Camara";
import { Panel } from "../components/Panel";
import { Tablero } from "../components/Tablero";
import { Ficha } from "../components/Ficha";
import { Sello } from "../components/Sello";
import { useCues } from "../tiempos";
import { C, serif } from "../theme";
import { entra } from "../anim";

export const CasoA: React.FC = () => {
  const frame = useCurrentFrame();
  const c = useCues("casoA");
  return (
    <AbsoluteFill>
      <Camara escenaId="casoA" etiqueta="Caso A" />
      <Panel kicker="04 · Caso A · se defendió a tiempo">
        <div style={{ display: "flex", alignItems: "center", gap: 18, opacity: entra(frame, c("vicio"), 16) }}>
          <span style={{ fontFamily: serif, fontWeight: 600, fontSize: 30, color: C.tinta }}>Emplazamiento a apoderado sin facultad</span>
          <Ficha at={c("vicio") + 6} texto="ARTS. 436–437" color={C.rojo} />
        </div>
        <Tablero
          top={76}
          aparicion={0}
          etiquetaExp="CASO A"
          eventos={{
            p1: [{ at: c("sancion"), estado: "nulidad", respuesta: "Sí: el art. 437 lo sanciona" }],
            p2: [{ at: c("contesto"), estado: "validez", respuesta: "Cumplió su finalidad: contestó" }],
            p3: [{ at: c("contesto") + 24, estado: "validez", respuesta: "Sin perjuicio: se defendió" }],
          }}
        />
        <div style={{ position: "absolute", left: 0, top: 500, opacity: entra(frame, c("sello"), 14) }}>
          <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 48, color: C.verde }}>No se anula</div>
          <Ficha at={c("sello") + 4} texto="ARTS. 172 Y 437" color={C.verde} style={{ marginTop: 8 }} />
        </div>
      </Panel>
      <Sello at={c("sello")} texto="CONVALIDADO" color={C.verde} x={1580} y={790} tam={46} />
    </AbsoluteFill>
  );
};
