import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camara } from "../components/Camara";
import { Panel } from "../components/Panel";
import { LineaTiempo } from "../components/LineaTiempo";
import { useCues } from "../tiempos";
import { C, mono, sans, serif } from "../theme";
import { entra, ventana } from "../anim";

const Parte: React.FC<{ texto: string; x: number; at: number }> = ({ texto, x, at }) => {
  const frame = useCurrentFrame();
  const p = entra(frame, at, 16);
  return (
    <div style={{ position: "absolute", left: x, top: 210, width: 260, padding: "18px 0", textAlign: "center", border: `3px solid ${C.tinta}`, borderRadius: 12, background: "#FBF8F2", fontFamily: sans, fontWeight: 600, fontSize: 26, color: C.tinta, opacity: p, transform: `translateY(${(1 - p) * 14}px)` }}>
      {texto}
    </div>
  );
};

export const Proceso: React.FC = () => {
  const frame = useCurrentFrame();
  const c = useCues("proceso");
  const diagrama = ventana(frame, 0, c("actos"));
  const actos = entra(frame, c("actos"), 18);
  return (
    <AbsoluteFill>
      <Camara escenaId="proceso" etiqueta="El proceso" />
      <Panel kicker="Peldaños 1–3 · El proceso" entrada={4}>
        <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 48, color: C.tinta }}>El proceso</div>
        <div style={{ fontFamily: sans, fontSize: 26, color: C.tintaSuave, marginTop: 6, opacity: entra(frame, c("finalidad"), 14) }}>
          resolver conflictos <b style={{ color: C.verde }}>respetando garantías</b>
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: diagrama }}>
          <div style={{ position: "absolute", left: 334, top: 120, width: 200, padding: "14px 0", textAlign: "center", background: C.tinta, color: C.papel, borderRadius: 12, fontFamily: mono, fontSize: 22, letterSpacing: 3, opacity: entra(frame, c("finalidad"), 14) }}>
            JUEZ
          </div>
          <Parte texto="Demandante" x={20} at={c("finalidad") + 6} />
          <Parte texto="Demandado" x={588} at={c("finalidad") + 10} />
          <div style={{ position: "absolute", left: 300, top: 205, width: 268, textAlign: "center", fontFamily: serif, fontSize: 54, color: C.tintaSuave, opacity: entra(frame, c("finalidad") + 14, 14) }}>⇄</div>
          <div style={{ position: "absolute", left: 0, right: 0, top: 330, textAlign: "center", opacity: entra(frame, c("garantias"), 14) }}>
            <span style={{ display: "inline-block", padding: "12px 24px", border: `3px solid ${C.verde}`, borderRadius: 10, fontFamily: sans, fontWeight: 600, fontSize: 26, color: C.verde }}>
              Garantía: ambas partes pueden defenderse
            </span>
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: actos }}>
          <div style={{ position: "absolute", left: 0, top: 150, fontFamily: mono, fontSize: 20, letterSpacing: 3, color: C.tintaSuave }}>EL PROCESO ESTÁ HECHO DE ACTOS</div>
          <LineaTiempo x={0} y={200} ancho={868} aparicion={c("actos") + 4} etiquetas={["Notificación", "Audiencia", "Resolución"]} grieta={{ idx: 0, at: c("vicios") }} />
          <div style={{ position: "absolute", left: 0, top: 400, fontFamily: mono, fontSize: 19, letterSpacing: 2, color: C.rojo, opacity: entra(frame, c("vicios") + 6, 12) }}>▲ ACTO VICIADO</div>
          <div style={{ position: "absolute", left: 0, top: 470, display: "flex", alignItems: "center", gap: 18, opacity: entra(frame, c("nulidad"), 14) }}>
            <span style={{ fontFamily: serif, fontWeight: 700, fontSize: 52, color: C.rojo }}>Nulidad</span>
            <span style={{ fontFamily: sans, fontSize: 26, color: C.tinta }}>la herramienta para cuestionarlo</span>
          </div>
        </div>
      </Panel>
    </AbsoluteFill>
  );
};
