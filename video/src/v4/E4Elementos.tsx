import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Encuadre } from "../components/Encuadre";
import { Ficha } from "../components/Ficha";
import { Escenario, Sobre, Aparece } from "./Piezas";
import { useCues } from "../tiempos";
import { C, mono, sans, serif } from "../theme";
import { entra } from "../anim";

// Peldaño 4b: despiece del acto procesal en sus elementos; ¿dónde está el defecto?
const CAPAS = ["Forma", "Capacidad", "Objeto", "Finalidad"];
export const E4Elementos: React.FC<{ id?: string }> = ({ id = "elementos" }) => {
  const frame = useCurrentFrame();
  const c = useCues(id);
  const abre = entra(frame, c("elementos") - 6, 24);
  const extr = frame >= c("forma");
  const intr = frame >= c("intrinseco");
  return (
    <AbsoluteFill style={{ background: C.noche }}>
      <Escenario kicker="Peldaño 4 · ¿Dónde está el defecto?" titulo="Los elementos del acto" x={760}>
        <Aparece at={c("acto")} style={{ left: 760, top: 222 }}>
          <Ficha at={c("acto")} texto="ART. 140 CC · ACTO JURÍDICO" />
        </Aparece>
        {CAPAS.map((capa, i) => {
          const esForma = i === 0;
          const roja = esForma ? extr : intr;
          const y = 320 + i * 30 + abre * i * 116;
          return (
            <div key={capa} style={{ position: "absolute", left: 1000 + (1 - abre) * 40, top: y, width: 640, height: 100, boxSizing: "border-box", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", borderRadius: 14, background: esForma ? "transparent" : "#FBF8F2", border: `${esForma ? "5px dashed" : "4px solid"} ${roja ? C.rojo : C.tinta}`, opacity: entra(frame, c("donde") + i * 3, 14), transform: `skewX(-8deg)` }}>
              <span style={{ fontFamily: serif, fontWeight: 700, fontSize: 38, color: roja ? C.rojo : C.tinta, transform: "skewX(8deg)" }}>{capa}</span>
              {esForma && extr && <span style={{ fontFamily: mono, fontSize: 20, letterSpacing: 2, color: C.rojo, transform: "skewX(8deg)" }}>VICIO EXTRÍNSECO</span>}
              {i === 2 && intr && <span style={{ fontFamily: mono, fontSize: 20, letterSpacing: 2, color: C.rojo, transform: "skewX(8deg)" }}>VICIO INTRÍNSECO</span>}
            </div>
          );
        })}
        <Aparece at={c("publica")} style={{ left: 1000, top: 868 }}>
          <span style={{ fontFamily: sans, fontSize: 24, color: C.tintaSuave }}>…adaptados a la naturaleza pública del proceso</span>
        </Aparece>
        {frame >= c("nuestro") && (
          <div style={{ position: "absolute", left: 0, top: 0, opacity: entra(frame, c("nuestro"), 12) }}>
            <Sobre x={890} y={370} escala={1.2} color={C.rojo} />
            <div style={{ position: "absolute", left: 790, top: 420, width: 200, textAlign: "center", fontFamily: mono, fontSize: 16, letterSpacing: 2, color: C.rojo }}>NUESTRO CASO →</div>
          </div>
        )}
      </Escenario>
      <Encuadre escenaId={id} etiqueta="Elementos y vicios" pasos={[{ at: 0, modo: "ventana" }]} />
    </AbsoluteFill>
  );
};
