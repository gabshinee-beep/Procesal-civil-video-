import React from "react";
import { useCurrentFrame } from "remotion";
import { cue, f, inicioEscena } from "../tiempos";
import { C, mono, sans } from "../theme";
import { ventana } from "../anim";

// Versión de respaldo: rótulos inferiores sobrios con autores y normas, sin animaciones complejas.
const ROTULOS: [string, string, string, string][] = [
  ["proceso", "garantias", "PELDAÑO 1 · FINALIDAD DEL PROCESO", "Resolver conflictos respetando garantías"],
  ["proceso", "nulidad", "PELDAÑOS 2–3", "Los actos pueden tener vicios → existe la nulidad"],
  ["concepto", "recurso", "PELDAÑO 4 · ART. 356 CPC", "Recurso: acto en resolución · Remedio: acto fuera de ella"],
  ["concepto", "vicios", "BERIZONCE, CIT. POR ARRARTE", "Vicios extrínsecos (forma) e intrínsecos (contenido)"],
  ["formas", "garantias", "PELDAÑO 5 · CALAMANDREI", "Las formas no son fines: son garantías"],
  ["limites", "couture", "PELDAÑO 6 · EDUARDO COUTURE", "«No satisfacer pruritos formales, sino enmendar perjuicios efectivos»"],
  ["principios", "p1", "PELDAÑO 7 · PRINCIPIOS (ARRARTE)", "Especificidad · Convalidación · Trascendencia · Protección"],
  ["casoA", "sancion", "ART. 437 CPC", "Nulidad del emplazamiento defectuoso"],
  ["casoA", "sello", "ARTS. 172 Y 437 CPC", "Convalidado: el acto cumplió su finalidad"],
  ["casoB", "perjuicio", "ART. 174 CPC", "Interés: acreditar el perjuicio y la defensa perdida"],
  ["casoB", "proteccion", "ART. 175.1 CPC", "Improcedente si lo pide quien causó el vicio"],
  ["consecuencias", "a173", "PELDAÑO 8 · ART. 173 CPC", "Extensión: caen solo los actos dependientes"],
  ["cierre", "couture2", "EDUARDO COUTURE", "«La anulación por la anulación no vale»"],
];

export const Rotulos: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {ROTULOS.map(([esc, cueId, kicker, texto]) => {
        const at = inicioEscena(esc) + cue(esc, cueId);
        const o = ventana(frame, at, at + f(4.2));
        if (o <= 0) return null;
        return (
          <div key={kicker + cueId} style={{ position: "absolute", left: 80, bottom: 170, opacity: o, transform: `translateX(${(1 - o) * -30}px)`, background: C.papel, borderLeft: `8px solid ${C.rojo}`, borderRadius: 8, padding: "14px 24px", maxWidth: 1100 }}>
            <div style={{ fontFamily: mono, fontSize: 18, letterSpacing: 3, color: C.rojo }}>{kicker}</div>
            <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 30, color: C.tinta, marginTop: 4 }}>{texto}</div>
          </div>
        );
      })}
    </>
  );
};
