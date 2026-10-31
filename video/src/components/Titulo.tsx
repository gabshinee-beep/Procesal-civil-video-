import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import guion from "../data/guion.json";
import { C, mono, sans, serif } from "../theme";
import { entra, rango, sale } from "../anim";
import { Grano } from "./Panel";

// Cartela de título: hoja de expediente que cubre el plano mientras sigues hablando.
export const Titulo: React.FC<{ at: number; hasta: number }> = ({ at, hasta }) => {
  const frame = useCurrentFrame();
  if (frame < at || frame > hasta) return null;
  const cortina = entra(frame, at, 18);
  const fuera = sale(frame, hasta - 14, 14);
  const palabras = guion.titulo.split(" ");
  return (
    <AbsoluteFill style={{ clipPath: `inset(0 ${(1 - cortina) * 100}% 0 0)`, opacity: fuera }}>
      <AbsoluteFill style={{ background: C.papel }}>
        <Grano />
        <div style={{ position: "absolute", left: 160, top: 250, fontFamily: mono, fontSize: 24, letterSpacing: 6, color: C.rojo }}>
          NULIDAD PROCESAL · CPC ARTS. 171–178
        </div>
        <div style={{ position: "absolute", left: 160, top: 310, width: 1500, fontFamily: serif, fontWeight: 600, fontSize: 104, lineHeight: 1.05, color: C.tinta }}>
          {palabras.map((w, i) => {
            const p = entra(frame, at + 8 + i * 3, 16);
            return (
              <span key={i} style={{ display: "inline-block", marginRight: 26, opacity: p, transform: `translateY(${(1 - p) * 30}px)` }}>
                {w}
              </span>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 160, top: 560, height: 4, width: 520 * rango(frame, at + 22, at + 40), background: C.rojo }} />
        <div style={{ position: "absolute", left: 160, top: 600, fontFamily: sans, fontSize: 36, color: C.tintaSuave, opacity: entra(frame, at + 30, 16) }}>
          {guion.subtitulo}
        </div>
        <div style={{ position: "absolute", left: 160, bottom: 150, fontFamily: mono, fontSize: 22, letterSpacing: 2, color: C.tinta, opacity: entra(frame, at + 36, 16) }}>
          {guion.autor.toUpperCase()} · {guion.curso.toUpperCase()}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Creditos: React.FC<{ at: number }> = ({ at }) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const p = entra(frame, at, 16);
  return (
    <AbsoluteFill style={{ background: C.papel, opacity: p }}>
      <Grano />
      {(guion.creditos as { cita?: string }).cita && (
        <div style={{ position: "absolute", left: 160, top: 120, width: 1600, fontFamily: serif, fontStyle: "italic", fontSize: 52, color: C.tinta, opacity: entra(frame, at + 2, 14) }}>
          {(guion.creditos as { cita?: string }).cita}
        </div>
      )}
      <div style={{ position: "absolute", left: 160, top: 300, fontFamily: mono, fontSize: 22, letterSpacing: 5, color: C.rojo }}>FUENTES</div>
      <div style={{ position: "absolute", left: 160, top: 350, width: 1600 }}>
        {guion.creditos.fuentes.map((s, i) => (
          <div key={i} style={{ fontFamily: serif, fontSize: 40, lineHeight: 1.35, color: C.tinta, marginBottom: 22, opacity: entra(frame, at + 6 + i * 6, 14) }}>
            {s}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 160, bottom: 160, fontFamily: mono, fontSize: 24, letterSpacing: 2, color: C.tinta }}>
        {guion.autor.toUpperCase()} · {guion.curso.toUpperCase()}
      </div>
    </AbsoluteFill>
  );
};
