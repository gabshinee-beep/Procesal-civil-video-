import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camara } from "../components/Camara";
import { Panel } from "../components/Panel";
import { Tablero } from "../components/Tablero";
import { useCues } from "../tiempos";
import { C, sans, serif } from "../theme";
import { entra } from "../anim";

export const Principios: React.FC = () => {
  const frame = useCurrentFrame();
  const c = useCues("principios");
  return (
    <AbsoluteFill>
      <Camara escenaId="principios" etiqueta="Principios" />
      <Panel kicker="03 · El expediente bajo examen" continuo>
        <div style={{ display: "flex", alignItems: "baseline", gap: 16, opacity: entra(frame, c("conjunto"), 16) }}>
          <span style={{ fontFamily: serif, fontWeight: 600, fontSize: 38, color: C.tinta }}>Pautas concatenadas</span>
          <span style={{ fontFamily: sans, fontSize: 24, color: C.tintaSuave }}>no un checklist: se aplican en conjunto</span>
        </div>
        <Tablero
          top={86}
          aparicion={6}
          eventos={{
            p1: [{ at: c("p1"), estado: "activo" }],
            p2: [{ at: c("p2"), estado: "activo" }],
            p3: [{ at: c("p3"), estado: "activo" }],
            p4: [{ at: c("p4"), estado: "activo" }],
          }}
        />
      </Panel>
    </AbsoluteFill>
  );
};
