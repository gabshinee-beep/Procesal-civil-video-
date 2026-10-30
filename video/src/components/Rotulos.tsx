import React from "react";
import { useCurrentFrame } from "remotion";
import { cue, escenas, f, inicioEscena } from "../tiempos";
import { C, mono, sans } from "../theme";
import { ventana } from "../anim";

// Versión de respaldo: rótulos inferiores sobrios con autores y normas, sin animaciones complejas.
const ROTULOS: [string, string, string, string][] = [
  ["finalidad", "garantias", "PELDAÑO 1 · FINALIDAD DEL PROCESO", "Resolver conflictos respetando el debido proceso"],
  ["finalidad", "impugnatorio", "NULIDAD PROCESAL (ARRARTE)", "Medio impugnatorio: validez o eficacia de un acto o del proceso"],
  ["caso", "facultad", "ARTS. 436–437 CPC", "Notificación a un apoderado sin facultad"],
  ["caso", "finalidad", "SIN NULIDAD", "El acto cumplió su finalidad y no hubo perjuicio efectivo"],
  ["remedio", "remedio", "ART. 356 CPC", "Recurso: acto en resolución · Remedio: acto fuera de ella"],
  ["elementos", "acto", "ART. 140 CC · BERIZONCE", "Capacidad, objeto, finalidad y forma · vicios extrínsecos e intrínsecos"],
  ["forma", "garantia", "CALAMANDREI · MORELLO", "La forma no es un fin: es garantía de defensa"],
  ["limites", "pacto", "ART. IX TP CPC", "Imperatividad: no todas las normas procesales obligan igual"],
  ["principios", "p1", "ARTS. 171, 172, 174, 175.1 CPC", "Especificidad · Convalidación · Trascendencia · Protección"],
  ["cierre", "vale", "VALIDEZ PROVISIONAL · ART. 173", "Vale hasta que el juez declare; solo caen los actos dependientes"],
  ["cierre", "couture2", "EDUARDO COUTURE", "«La anulación por la anulación no vale»"],
];

export const Rotulos: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <>
      {ROTULOS.filter(([esc, cueId]) => escenas.some((e) => e.id === esc && e.cues.some((c) => c.id === cueId))).map(([esc, cueId, kicker, texto]) => {
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
