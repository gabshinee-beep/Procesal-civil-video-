import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camara } from "../components/Camara";
import { LineaTiempo } from "../components/LineaTiempo";
import { useCues } from "../tiempos";
import { C, mono, serif } from "../theme";
import { entra, ventana } from "../anim";

export const Gancho: React.FC = () => {
  const frame = useCurrentFrame();
  const c = useCues("gancho");
  return (
    <AbsoluteFill>
      <Camara escenaId="gancho" etiqueta="Gancho" zoom={[1.06, 1]} />
      <AbsoluteFill style={{ background: "linear-gradient(to right, transparent 38%, rgba(10,9,8,0.62) 62%)" }} />
      <div style={{ position: "absolute", left: 900, top: 262, fontFamily: mono, fontSize: 20, letterSpacing: 4, color: "rgba(243,237,226,0.7)", opacity: entra(frame, c("linea"), 16) }}>
        EXPEDIENTE N.° 0421-2024 · PROCESO DE CONOCIMIENTO
      </div>
      <LineaTiempo
        x={900}
        y={420}
        ancho={940}
        oscuro
        anios
        aparicion={c("linea") + 6}
        etiquetas={["Demanda", "Emplazamiento", "Contestación", "Audiencia", "Sentencia"]}
        grieta={{ idx: 1, at: c("grieta") }}
        rebobinar={{ idx: 1, at: c("rebobinar") }}
      />
      <div style={{ position: "absolute", left: 1088, top: 622, fontFamily: mono, fontSize: 19, letterSpacing: 2, color: C.rojo, opacity: entra(frame, c("grieta") + 6, 12) }}>
        ▲ NOTIFICACIÓN DEFECTUOSA
      </div>
      <div style={{ position: "absolute", left: 900, top: 680, fontFamily: serif, fontWeight: 600, fontSize: 96, color: C.papel, opacity: ventana(frame, c("rebobinar") + 8, c("titulo")) }}>
        ¿Todo?
      </div>
    </AbsoluteFill>
  );
};
