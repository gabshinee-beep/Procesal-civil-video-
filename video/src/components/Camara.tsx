import React from "react";
import { AbsoluteFill, OffthreadVideo, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import tomas from "../data/tomas.json";
import { C, mono, sans } from "../theme";
import { rango } from "../anim";

type Toma = { archivo: string; desde: number } | null;

// Plano del presentador. Sin grabación todavía, muestra una toma provisional con la silueta
// en el tercio izquierdo (el mismo encuadre que debes usar al grabar).
export const Camara: React.FC<{ escenaId: string; etiqueta: string; zoom?: [number, number] }> = ({
  escenaId,
  etiqueta,
  zoom = [1, 1.04],
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();
  const toma = (tomas as unknown as Record<string, Toma>)[escenaId];
  const escala = rango(frame, 0, durationInFrames, zoom[0], zoom[1]);

  if (toma) {
    return (
      <AbsoluteFill style={{ transform: `scale(${escala})`, transformOrigin: "30% 40%" }}>
        <OffthreadVideo src={staticFile(toma.archivo)} trimBefore={Math.round(toma.desde * fps)} />
      </AbsoluteFill>
    );
  }

  const respiro = Math.sin(frame / 22) * 4;
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 28% 45%, #4a4036 0%, #2a241f 45%, ${C.noche} 100%)` }}>
      <AbsoluteFill style={{ transform: `scale(${escala})`, transformOrigin: "30% 40%" }}>
        {/* luz de ventana */}
        <div style={{ position: "absolute", left: -200, top: -100, width: 900, height: 900, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,228,190,0.16), transparent 65%)" }} />
        {/* silueta */}
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
          <g transform={`translate(560 ${300 + respiro})`} fill="#0f0d0b" opacity={0.92}>
            <ellipse cx={0} cy={110} rx={118} ry={145} />
            <rect x={-48} y={230} width={96} height={90} rx={30} />
            <path d="M -330 780 C -320 470, -190 360, 0 340 C 190 360, 320 470, 330 780 Z" />
          </g>
        </svg>
      </AbsoluteFill>
      <div style={{ position: "absolute", left: 60, bottom: 160, fontFamily: mono, fontSize: 20, letterSpacing: 2, color: "rgba(243,237,226,0.55)", textTransform: "uppercase" }}>
        ● Toma provisional · {etiqueta}
      </div>
      <div style={{ position: "absolute", left: 60, bottom: 130, fontFamily: sans, fontSize: 18, color: "rgba(243,237,226,0.4)" }}>
        Aquí va tu grabación (plano medio, tercio izquierdo)
      </div>
    </AbsoluteFill>
  );
};
