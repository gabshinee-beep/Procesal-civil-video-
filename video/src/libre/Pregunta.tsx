import React from "react";
import { useCurrentFrame } from "remotion";
import { escenas, inicioEscena, f } from "../tiempos";
import { tomaDe } from "../components/Camara";
import { C, mono, serif } from "../theme";
import { entra, sale } from "../anim";

// Tus preguntas como capítulos: al empezar cada una, aparece en grande unos segundos.
type ConPregunta = { id: string; pregunta?: { n: number; texto: string } };
export const preguntas = () => (escenas as unknown as ConPregunta[]).filter((e) => e.pregunta);

export const Preguntas: React.FC = () => {
  const frame = useCurrentFrame();
    return (
    <>
      {preguntas()
        .filter((e) => {
          const m = (e as { modulo?: string }).modulo;
          const detras = (m === "presentador" || m === "nulidadDetras") && !!(tomaDe(e.id) as { persona?: string } | null)?.persona;
          return !detras;
        })
        .map((e) => {
        // la primera pregunta espera a que termine el título de apertura
        const at = inicioEscena(e.id) === 0 ? f(3.6) : inicioEscena(e.id) + 4;
        const hasta = at + f(3.2);
        if (frame < at || frame > hasta) return null;
        const o = Math.min(entra(frame, at, 14), sale(frame, hasta - 10, 10));
        return (
          <div key={e.id} style={{ position: "absolute", left: 60, top: 26, maxWidth: 1300, padding: "12px 24px", borderRadius: 12, background: "rgba(20,18,16,0.9)", boxShadow: "0 12px 40px rgba(0,0,0,0.35)", opacity: o, transform: `translateY(${(1 - o) * -20}px)`, display: "flex", alignItems: "baseline", gap: 18 }}>
            <span style={{ fontFamily: mono, fontSize: 20, letterSpacing: 5, color: C.ambar, whiteSpace: "nowrap" }}>
              PREGUNTA {e.pregunta!.n}
            </span>
            <span style={{ fontFamily: serif, fontWeight: 600, fontSize: 40, color: C.papel }}>{e.pregunta!.texto}</span>
          </div>
        );
      })}
    </>
  );
};
