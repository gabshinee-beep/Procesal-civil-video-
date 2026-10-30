import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Encuadre } from "../components/Encuadre";
import { Versiones } from "./Versiones";
import { useCues } from "../tiempos";
import { C } from "../theme";

// Peldaño 7: los cuatro principios, aplicados en conjunto a las dos versiones del mismo caso.
export const E7Principios: React.FC<{ id?: string }> = ({ id = "principios" }) => {
  const frame = useCurrentFrame();
  const c = useCues(id);
  const activa = [c("p1"), c("p2"), c("p3"), c("p4")].reduce((acc, at, i) => (frame >= at ? i : acc), -1);
  return (
    <AbsoluteFill style={{ background: C.noche }}>
      <Versiones
        filasDesde={0}
        filasActivas={activa >= 0 ? [activa] : []}
        v1={{
          aparece: -30,
          titulo: "Mario se entera y contesta",
          filas: [
            { at: c("a437"), color: C.rojo, texto: "Sí: el art. 437 lo sanciona" },
            { at: c("primero"), color: C.verde, texto: "Cumplió su finalidad: convalidado" },
            { at: c("p3") + 10, color: C.verde, texto: "Sin perjuicio: se defendió" },
            { at: c("causo"), color: C.tintaSuave, texto: "Mario no causó el vicio" },
          ],
          veredicto: { at: c("primero") + 20, texto: "No se anula", color: C.verde },
        }}
        v2={{
          aparece: -30,
          titulo: "Mario nunca se entera",
          sinDefensa: -30,
          filas: [
            { at: c("a437"), color: C.rojo, texto: "Sí: el art. 437 lo sanciona" },
            { at: c("primero") + 12, color: C.rojo, texto: "No: pidió en su 1.ª oportunidad (176)" },
            { at: c("segundo"), color: C.rojo, texto: "Perdió: contestar y probar" },
            { at: c("causo"), color: C.rojo, texto: "No causó el vicio" },
          ],
          veredicto: { at: c("causo") + 12, texto: "Puede proceder la nulidad", color: C.ambar },
        }}
      />
      <Encuadre escenaId={id} etiqueta="Los principios" pasos={[{ at: 0, modo: "centro" }]} />
    </AbsoluteFill>
  );
};
