import React from "react";
import { useCurrentFrame } from "remotion";
import { escenas, inicioEscena, f } from "../tiempos";
import { C, mono, serif } from "../theme";
import { entra, sale } from "../anim";

// Tus preguntas como capítulos: al empezar cada una, aparece en grande unos segundos.
type ConPregunta = { id: string; pregunta?: { n: number; texto: string } };
export const preguntas = () => (escenas as unknown as ConPregunta[]).filter((e) => e.pregunta);

export const Preguntas: React.FC = () => {
  const frame = useCurrentFrame();
  const total = preguntas().length;
  return (
    <>
      {preguntas().map((e) => {
        // la primera pregunta espera a que termine el título de apertura
        const at = inicioEscena(e.id) === 0 ? f(3.6) : inicioEscena(e.id) + 4;
        const hasta = at + f(3.2);
        if (frame < at || frame > hasta) return null;
        const o = Math.min(entra(frame, at, 14), sale(frame, hasta - 10, 10));
        return (
          <div key={e.id} style={{ position: "absolute", right: 70, top: 300, width: 860, padding: "30px 38px", borderRadius: 18, background: "rgba(20,18,16,0.88)", boxShadow: "0 20px 60px rgba(0,0,0,0.45)", opacity: o, transform: `translateX(${(1 - o) * 40}px)` }}>
            <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: 6, color: C.ambar }}>
              PREGUNTA {e.pregunta!.n} DE {total}
            </div>
            <div style={{ fontFamily: serif, fontWeight: 600, fontSize: 58, lineHeight: 1.1, color: C.papel, marginTop: 12 }}>{e.pregunta!.texto}</div>
          </div>
        );
      })}
    </>
  );
};
