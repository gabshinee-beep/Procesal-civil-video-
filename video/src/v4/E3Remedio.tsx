import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Encuadre } from "../components/Encuadre";
import { Ficha } from "../components/Ficha";
import { Escenario, Sobre, Documento, Aparece } from "./Piezas";
import { useCues } from "../tiempos";
import { C, mono, sans, serif } from "../theme";
import { entra, rango } from "../anim";

const Bandeja: React.FC<{ x: number; titulo: string; sub: string; ej: string; activa: boolean; at: number }> = ({ x, titulo, sub, ej, activa, at }) => {
  const frame = useCurrentFrame();
  return (
    <div style={{ position: "absolute", left: x, top: 560, width: 500, height: 330, boxSizing: "border-box", padding: "24px 28px", borderRadius: 16, border: `4px solid ${activa ? C.rojo : C.tinta}`, background: activa ? "#FFF6EF" : "#FBF8F2", opacity: entra(frame, at, 16), boxShadow: activa ? `0 0 0 8px ${C.rojo}22` : "none" }}>
      <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 48, color: activa ? C.rojo : C.tinta }}>{titulo}</div>
      <div style={{ fontFamily: sans, fontSize: 25, color: C.tinta, marginTop: 6 }}>{sub}</div>
      <div style={{ fontFamily: mono, fontSize: 18, color: C.tintaSuave, marginTop: 10 }}>{ej}</div>
    </div>
  );
};

// Peldaño 4a: ¿recurso o remedio? Depende de QUÉ acto se cuestiona (art. 356).
export const E3Remedio: React.FC = () => {
  const frame = useCurrentFrame();
  const c = useCues("remedio");
  const caeSobre = rango(frame, c("remedio") - 6, c("remedio") + 10);
  const caeSent = rango(frame, c("recurso") - 6, c("recurso") + 10);
  return (
    <AbsoluteFill style={{ background: C.noche }}>
      <Escenario kicker="Peldaño 4 · ¿Qué se cuestiona?" titulo="¿Recurso o remedio?" x={760}>
        <Bandeja x={760} titulo="Recurso" sub="El acto está en una resolución" ej="decreto · auto · sentencia" activa={frame >= c("recurso")} at={6} />
        <Bandeja x={1340} titulo="Remedio" sub="El acto no está en una resolución" ej="notificación · audiencia" activa={frame >= c("remedio") && frame < c("sentencia")} at={10} />
        <Aparece at={c("resolucion")} style={{ left: 1420, top: 240, width: 360, textAlign: "center" }}>
          <div style={{ fontFamily: mono, fontSize: 18, letterSpacing: 2, color: C.tintaSuave }}>NOTIFICACIÓN DEL CASO</div>
        </Aparece>
        {frame >= c("resolucion") && <Sobre x={1590} y={330 + caeSobre * 480} escala={1.4} giro={-6 + caeSobre * 6} />}
        {frame >= c("sentencia") && <Documento x={1010} y={310 + caeSent * 470} titulo="SENTENCIA" escala={0.75} />}
        <div style={{ position: "absolute", left: 760, top: 230 }}>
          <Ficha at={c("remedio")} texto="ART. 356 CPC" />
        </div>
      </Escenario>
      <Encuadre escenaId="remedio" etiqueta="¿Recurso o remedio?" pasos={[{ at: 0, modo: "ventana" }]} />
    </AbsoluteFill>
  );
};
