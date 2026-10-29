import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import guion from "../data/guion.json";
import { Camara } from "../components/Camara";
import { useCues } from "../tiempos";
import { CitaCinetica } from "../components/CitaCinetica";
import { C, mono, sans, serif } from "../theme";
import { entra, ventana } from "../anim";

export const Cierre: React.FC = () => {
  const frame = useCurrentFrame();
  const c = useCues("cierre");
  return (
    <AbsoluteFill>
      <Camara escenaId="cierre" etiqueta="Cierre" zoom={[1, 1.04]} golpes={[{ at: c("no"), escala: 1.12 }]} />
      <AbsoluteFill style={{ background: "linear-gradient(to right, transparent 38%, rgba(10,9,8,0.66) 62%)" }} />
      <div style={{ position: "absolute", left: 900, top: 200, width: 940 }}>
        <div style={{ opacity: ventana(frame, c("excepcional"), c("pregunta")) }}>
          <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: 4, color: C.ambar }}>CARACTERÍSTICAS</div>
          <div style={{ fontFamily: serif, fontSize: 64, color: C.papel, marginTop: 12 }}>Excepcional</div>
          <div style={{ fontFamily: sans, fontSize: 30, color: "rgba(243,237,226,0.8)", marginTop: 10 }}>En caso de duda, el proceso continúa.</div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 900, top: 200, width: 940, opacity: ventana(frame, c("pregunta"), c("couture2")) }}>
        <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 66, lineHeight: 1.08, color: C.papel }}>{guion.titulo}</div>
        <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 120, color: C.rojo, marginTop: 20, opacity: entra(frame, c("no"), 6) }}>No.</div>
        <div style={{ fontFamily: sans, fontSize: 34, lineHeight: 1.3, color: C.papel, marginTop: 10, opacity: entra(frame, c("respuesta"), 16) }}>
          Solo si deja a alguien <b style={{ color: C.ambar }}>sin defensa</b> y no hay otro modo de remediarlo.
        </div>
      </div>
      <div style={{ position: "absolute", left: 900, top: 300, width: 940, opacity: entra(frame, c("couture2"), 18) }}>
        <div style={{ fontFamily: serif, fontSize: 140, lineHeight: 0.6, color: C.rojo }}>“</div>
        <CitaCinetica escenaId="cierre" texto="la anulación por la anulación no vale." respaldoDesde={c("couture2")} style={{ fontFamily: serif, fontStyle: "italic", fontSize: 68, lineHeight: 1.15, color: C.papel }} />
        <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: 3, color: "rgba(243,237,226,0.7)", marginTop: 26 }}>— EDUARDO COUTURE</div>
      </div>
    </AbsoluteFill>
  );
};
