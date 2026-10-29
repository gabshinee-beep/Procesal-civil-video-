import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camara } from "../components/Camara";
import { Panel } from "../components/Panel";
import { Ficha } from "../components/Ficha";
import { useCues } from "../tiempos";
import { C, sans, serif } from "../theme";
import { entra } from "../anim";

const Caja: React.FC<{ texto: string; color: string; at: number }> = ({ texto, color, at }) => {
  const frame = useCurrentFrame();
  const p = entra(frame, at, 14);
  return (
    <div style={{ padding: "16px 20px", border: `3px solid ${color}`, borderRadius: 12, background: "#FBF8F2", fontFamily: sans, fontWeight: 600, fontSize: 25, color, opacity: p, transform: `scale(${0.9 + 0.1 * p})` }}>
      {texto}
    </div>
  );
};

export const Formas: React.FC = () => {
  const frame = useCurrentFrame();
  const c = useCues("formas");
  const pulso = frame >= c("sentido") ? 1 + 0.06 * Math.sin((frame - c("sentido")) / 4) : 1;
  return (
    <AbsoluteFill>
      <Camara escenaId="formas" etiqueta="Las formas" />
      <Panel kicker="Peldaño 5 · La cuestión fundamental" continuo>
        <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 50, color: C.tinta, opacity: entra(frame, c("pregunta") - 4, 14) }}>¿Para qué existen las formas?</div>
        <div style={{ fontFamily: serif, fontSize: 66, color: C.tinta, marginTop: 34, opacity: entra(frame, c("garantias") - 10, 14) }}>
          Forma <span style={{ color: C.rojo }}>≠</span> fin
        </div>
        <div style={{ fontFamily: serif, fontSize: 66, color: C.verde, marginTop: 6, opacity: entra(frame, c("garantias") + 8, 14) }}>Forma = garantía</div>
        <div style={{ marginTop: 14 }}>
          <Ficha at={c("garantias") + 14} tipo="autor" texto="Calamandrei · Morello, citados por Arrarte" color={C.tintaSuave} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 440, display: "flex", alignItems: "center", gap: 16 }}>
          <Caja texto="Forma incumplida" color={C.rojo} at={c("falla")} />
          <span style={{ fontFamily: serif, fontSize: 44, color: C.tintaSuave, opacity: entra(frame, c("falla") + 10, 10) }}>+</span>
          <Caja texto="Nadie indefenso" color={C.verde} at={c("falla") + 14} />
          <span style={{ fontFamily: serif, fontSize: 44, color: C.tintaSuave, opacity: entra(frame, c("sentido") - 4, 10) }}>=</span>
          <span style={{ fontFamily: serif, fontWeight: 700, fontSize: 54, color: C.rojo, opacity: entra(frame, c("sentido"), 10), transform: `scale(${pulso})`, display: "inline-block" }}>¿anular?</span>
        </div>
      </Panel>
    </AbsoluteFill>
  );
};
