import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import guion from "../data/guion.json";
import { Encuadre } from "../components/Encuadre";
import { Ficha } from "../components/Ficha";
import { LineaTiempo } from "../components/LineaTiempo";
import { CitaCinetica } from "../components/CitaCinetica";
import { finBRoll } from "../components/BRoll";
import { Escenario, Aparece } from "./Piezas";
import { useCues } from "../tiempos";
import { C, mono, sans, serif } from "../theme";
import { entra, ventana } from "../anim";

// Peldaño 8 y conclusión: validez provisional, efectos limitados (art. 173, en pantalla), excepcionalidad.
export const E8Cierre: React.FC<{ id?: string }> = ({ id = "cierre" }) => {
  const frame = useCurrentFrame();
  const c = useCues(id);
  const sello = finBRoll("sello", c("declare"));
  const final = c("pregunta") - 6;
  return (
    <AbsoluteFill style={{ background: C.noche }}>
      <div style={{ position: "absolute", inset: 0, opacity: ventana(frame, 0, final + 14) }}>
        <Escenario kicker="Peldaño 8 · Consecuencias · versión 2" titulo="Validez provisional y efectos limitados" x={480}>
          <LineaTiempo
            x={480}
            y={360}
            ancho={1380}
            aparicion={-40}
            etiquetas={["Demanda de Laura", "Notificación", "Rebeldía", "Audiencia", "Sentencia"]}
            marca={{ idx: 1, desde: 4, hasta: sello, texto: "VALE (PROVISIONALMENTE)", color: C.ambar }}
            sello={{ idx: 1, at: sello, texto: "NULO" }}
            domino={{ desdeIdx: 1, at: sello + 14 }}
          />
          <Aparece at={sello + 36} style={{ left: 480, top: 580 }}>
            <span style={{ fontFamily: mono, fontSize: 20, letterSpacing: 2, color: C.verde }}>▲ LA DEMANDA DE ROSA QUEDA EN PIE</span>
          </Aparece>
          <div style={{ position: "absolute", left: 480, top: 640 }}>
            <Ficha at={sello + 40} texto="ART. 173 CPC · SOLO CAEN LOS ACTOS DEPENDIENTES" color={C.rojo} />
          </div>
          <Aparece at={c("duda")} style={{ left: 480, top: 740, width: 1380 }}>
            <div style={{ padding: "16px 22px", borderLeft: `6px solid ${C.ambar}`, background: C.papelOscuro }}>
              <span style={{ fontFamily: serif, fontWeight: 700, fontSize: 36, color: C.tinta }}>Excepcional</span>
              <span style={{ fontFamily: sans, fontSize: 27, color: C.tintaSuave }}>{"  ·  "}en caso de duda, el proceso continúa</span>
            </div>
          </Aparece>
        </Escenario>
      </div>
      <Encuadre escenaId={id} etiqueta="Cierre" pasos={[{ at: 0, modo: "pip" }, { at: final, modo: "completo" }]} golpes={[{ at: c("respuesta"), escala: 1.08 }]} />
      {frame >= final && (
        <AbsoluteFill style={{ opacity: entra(frame, final + 6, 14) }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 40%, rgba(10,9,8,0.72) 64%)" }} />
          <div style={{ position: "absolute", left: 1060, top: 200, width: 800, opacity: ventana(frame, final, c("couture")) }}>
            <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 64, lineHeight: 1.08, color: C.papel }}>{guion.titulo}</div>
            <div style={{ fontFamily: sans, fontSize: 38, lineHeight: 1.3, color: C.papel, marginTop: 30, opacity: entra(frame, c("respuesta"), 12) }}>
              Solo con un <b style={{ color: C.ambar }}>perjuicio real</b> —como dejar a alguien sin defensa— que no pueda remediarse de otro modo.
            </div>
          </div>
          <div style={{ position: "absolute", left: 1060, top: 300, width: 800, opacity: entra(frame, c("couture"), 16) }}>
            <div style={{ fontFamily: serif, fontSize: 140, lineHeight: 0.6, color: C.rojo }}>“</div>
            <CitaCinetica escenaId={id} texto="la anulación por la anulación no vale." respaldoDesde={c("couture2")} style={{ fontFamily: serif, fontStyle: "italic", fontSize: 66, lineHeight: 1.15, color: C.papel }} />
            <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: 3, color: "rgba(243,237,226,0.7)", marginTop: 26 }}>— EDUARDO COUTURE</div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
