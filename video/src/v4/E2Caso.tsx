import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Encuadre } from "../components/Encuadre";
import { Personaje } from "../estilo/Personaje";
import { Escenario, Juzgado, Sobre, Documento, Aparece, bezier } from "./Piezas";
import { finBRoll } from "../components/BRoll";
import { useCues } from "../tiempos";
import { C, mono, sans, serif } from "../theme";
import { entra, rango } from "../anim";

// El caso: la notificación extraviada. Mario se entera y contesta → no prosperaría la nulidad.
export const E2Caso: React.FC<{ id?: string }> = ({ id = "caso" }) => {
  const frame = useCurrentFrame();
  const c = useCues(id);
  const sale = Math.max(c("apoderado"), finBRoll("sobre"));
  const t1 = rango(frame, sale, sale + 26);
  const [sx, sy] = frame < c("entera") ? bezier([830, 370], [1260, 380], [1470, 470], t1) : bezier([1470, 470], [1300, 420], [1110, 470], rango(frame, c("entera"), c("entera") + 22));
  const tc = rango(frame, c("contesta"), c("contesta") + 26);
  const [cx, cy] = bezier([1110, 470], [960, 400], [830, 380], tc);
  return (
    <AbsoluteFill style={{ background: C.noche }}>
      <Escenario kicker="El caso de Laura y Mario" titulo="Una notificación defectuosa">
        <Juzgado x={830} y={230} />
        <Aparece at={c("laura")}><Personaje quien="laura" x={560} y={700} /></Aparece>
        <Aparece at={c("laura") + 10}><Personaje quien="mario" x={1100} y={700} /></Aparece>
        <Aparece at={c("apoderado") - 4}><Personaje quien="apoderado" x={1480} y={720} escala={0.9} maletin /></Aparece>
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <path d="M 830 370 Q 1000 410 1100 450" fill="none" stroke={C.linea} strokeWidth={4} strokeDasharray="10 10" opacity={entra(frame, sale, 14)} />
          <path d="M 830 370 Q 1260 380 1470 470" fill="none" stroke={C.rojo} strokeWidth={5} strokeDasharray={900} strokeDashoffset={900 * (1 - t1)} />
          {frame >= c("entera") && <path d="M 1470 470 Q 1300 420 1110 470" fill="none" stroke={C.ambar} strokeWidth={4} strokeDasharray="6 8" opacity={entra(frame, c("entera"), 10)} />}
        </svg>
        <Aparece at={sale + 6} style={{ left: 930, top: 420 }}>
          <span style={{ fontFamily: mono, fontSize: 17, letterSpacing: 2, color: C.tintaSuave }}>DEBÍA LLEGAR A MARIO</span>
        </Aparece>
        <Aparece at={c("facultad")} style={{ left: 1390, top: 760 }}>
          <span style={{ padding: "6px 14px", border: `3px solid ${C.rojo}`, borderRadius: 8, background: "#FBF8F2", fontFamily: mono, fontSize: 19, color: C.rojo }}>SIN FACULTAD · ARTS. 436–437</span>
        </Aparece>
        {frame >= sale && frame < c("contesta") + 30 && <Sobre x={sx} y={sy} />}
        {frame >= c("contesta") && <div style={{ position: "absolute", left: 0, top: 0, transform: `translate(${cx - 1110}px, ${cy - 470}px)` }}><Documento x={1110} y={470} titulo="CONTESTACIÓN" color={C.verde} escala={0.6} /></div>}
        <Aparece at={c("entera") + 6} style={{ left: 1150, top: 500 }}>
          <span style={{ fontFamily: sans, fontWeight: 600, fontSize: 22, color: C.ambar }}>Mario se entera</span>
        </Aparece>
      </Escenario>
      <Encuadre escenaId={id} etiqueta="El caso" pasos={[{ at: 0, modo: "pip" }, { at: c("pregunta") - 6, modo: "completo" }]} golpes={[{ at: c("no"), escala: 1.08 }]} />
      {/* el texto de la respuesta va por encima de tu plano */}
      <AbsoluteFill style={{ opacity: frame >= c("pregunta") ? 1 : 0, pointerEvents: "none" }}>
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 40%, rgba(10,9,8,0.7) 64%)", opacity: entra(frame, c("pregunta"), 14) }} />
        <div style={{ position: "absolute", left: 1080, top: 260, width: 780, opacity: entra(frame, c("pregunta"), 14) }}>
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 60, color: C.papel }}>¿Prosperaría una nulidad?</div>
          <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 110, color: C.verde, marginTop: 10, opacity: entra(frame, c("no"), 8) }}>No.</div>
          <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 34, color: C.papel, marginTop: 6, opacity: entra(frame, c("finalidad"), 12) }}>✓ El acto cumplió su finalidad</div>
          <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 34, color: C.papel, marginTop: 10, opacity: entra(frame, c("perjuicio"), 12) }}>✓ No hubo perjuicio efectivo</div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
