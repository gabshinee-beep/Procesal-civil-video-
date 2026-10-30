import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Encuadre } from "../components/Encuadre";
import { Versiones } from "./Versiones";
import { useCues } from "../tiempos";
import { C, sans, serif } from "../theme";
import { entra } from "../anim";

// Peldaño 5 (el corazón): la forma es garantía, no fin → el mismo defecto se bifurca.
export const E5Forma: React.FC<{ id?: string }> = ({ id = "forma" }) => {
  const frame = useCurrentFrame();
  const c = useCues(id);
  const split = c("dato") - 4;
  return (
    <AbsoluteFill style={{ background: C.noche }}>
      {frame >= split && (
        <Versiones v1={{ aparece: split, titulo: "Mario se entera y contesta" }} v2={{ aparece: c("nunca") - 8, titulo: "Mario nunca se entera", sinDefensa: c("sindefensa") }} />
      )}
      <Encuadre
        escenaId={id}
        etiqueta="La forma como garantía"
        pasos={[{ at: 0, modo: "completo" }, { at: split, modo: "centro" }]}
        golpes={[{ at: c("clave"), escala: 1.08 }]}
      />
      {frame < split + 10 && (
        <AbsoluteFill style={{ opacity: 1 - entra(frame, split - 6, 10) }}>
          <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, transparent 40%, rgba(10,9,8,0.7) 64%)" }} />
          <div style={{ position: "absolute", left: 1080, top: 230, width: 780 }}>
            <div style={{ fontFamily: serif, fontSize: 78, color: C.papel, opacity: entra(frame, c("fin"), 12) }}>
              Forma <span style={{ color: C.rojo }}>≠</span> fin
            </div>
            <div style={{ fontFamily: serif, fontSize: 78, color: "#8FC79C", opacity: entra(frame, c("garantia"), 12) }}>Forma = garantía</div>
            <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 32, color: C.papel, marginTop: 34, opacity: entra(frame, c("fallo"), 12) }}>✗ En el caso, falló la forma…</div>
            <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 32, color: "#8FC79C", marginTop: 10, opacity: entra(frame, c("logro"), 12) }}>✓ …pero se logró la finalidad</div>
          </div>
        </AbsoluteFill>
      )}
    </AbsoluteFill>
  );
};
