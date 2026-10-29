import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camara } from "../components/Camara";
import { Panel } from "../components/Panel";
import { Tablero } from "../components/Tablero";
import { Ficha } from "../components/Ficha";
import { LineaTiempo } from "../components/LineaTiempo";
import { useCues } from "../tiempos";
import { C, mono, sans, serif } from "../theme";
import { entra, ventana } from "../anim";

export const CasoB: React.FC = () => {
  const frame = useCurrentFrame();
  const c = useCues("casoB");
  const cambio = c("provisional") - 8; // el tablero cede el lugar a la línea de tiempo
  const tablero = ventana(frame, 0, cambio);
  const efectos = entra(frame, cambio, 18);
  return (
    <AbsoluteFill>
      <Camara escenaId="casoB" etiqueta="Caso B" />
      <Panel kicker="05 · Caso B · cambia un solo dato">
        <div style={{ position: "absolute", inset: 0, opacity: tablero }}>
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 30, color: C.tinta, opacity: entra(frame, c("datoB"), 16) }}>
            El demandado <span style={{ color: C.rojo }}>nunca se enteró</span>; el proceso siguió sin él
          </div>
          <Tablero
            top={76}
            aparicion={0}
            etiquetaExp="CASO B"
            eventos={{
              p1: [{ at: c("datoB") + 20, estado: "nulidad", respuesta: "Sí: el art. 437 lo sanciona" }],
              p2: [{ at: c("noConvalida"), estado: "nulidad", respuesta: "No: pidió a tiempo (art. 176)" }],
              p3: [{ at: c("perjuicio"), estado: "nulidad", respuesta: "Perdió: contestar y probar" }],
              p4: [{ at: c("proteccion"), estado: "nulidad", respuesta: "No: él no causó el vicio" }],
            }}
          />
          <div style={{ position: "absolute", left: 0, top: 520, display: "flex", alignItems: "center", gap: 18 }}>
            <span style={{ fontFamily: serif, fontWeight: 700, fontSize: 44, color: C.ambar, opacity: entra(frame, c("procede"), 14) }}>Puede proceder</span>
            <span style={{ fontFamily: sans, fontSize: 24, color: C.tintaSuave, opacity: entra(frame, c("procede") + 10, 14) }}>la nulidad (requiere declaración judicial)</span>
          </div>
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: efectos }}>
          <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 46, color: C.tinta }}>
            {frame < c("domino") ? "Validez provisional" : "¿Qué cae?"}
          </div>
          <div style={{ fontFamily: sans, fontSize: 25, color: C.tintaSuave, marginTop: 8 }}>
            {frame < c("domino") ? "El acto viciado vale hasta que el juez declare la nulidad." : "Solo el acto nulo y lo que depende de él. Lo anterior queda en pie."}
          </div>
          <LineaTiempo
            x={0}
            y={250}
            ancho={868}
            aparicion={cambio}
            etiquetas={["Demanda", "Emplazamiento", "Rebeldía", "Audiencia", "Sentencia"]}
            domino={{ desdeIdx: 1, at: c("domino") + 6 }}
            marca={{ idx: 1, desde: cambio + 20, hasta: c("declara"), texto: "VALE (PROVISIONALMENTE)", color: C.ambar }}
            sello={{ idx: 1, at: c("declara"), texto: "NULO" }}
          />
          <div style={{ position: "absolute", left: 0, top: 440, fontFamily: mono, fontSize: 19, letterSpacing: 2, color: C.verde, opacity: entra(frame, c("domino") + 30, 14) }}>
            ▲ QUEDA EN PIE
          </div>
          <div style={{ position: "absolute", left: 0, top: 520 }}>
            <Ficha at={c("a173")} texto="ART. 173 CPC · EXTENSIÓN DE LA NULIDAD" color={C.rojo} />
          </div>
        </div>
      </Panel>
    </AbsoluteFill>
  );
};
