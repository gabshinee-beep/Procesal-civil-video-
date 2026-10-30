import React from "react";
import { AbsoluteFill, OffthreadVideo, Sequence, staticFile, useCurrentFrame } from "remotion";
import broll from "../data/broll.json";
import tomas from "../data/tomas.json";
import { cue, escenas, f, inicioEscena } from "../tiempos";
import { C, mono, sans, serif } from "../theme";
import { Acabado } from "./Camara";
import { rango } from "../anim";

type Plano = (typeof broll.planos)[number] & { archivo: string | null };

// Un plano se usa si ya tiene archivo, o en la maqueta (sin grabación) como marcador provisional.
const sinGrabacion = escenas.every((e) => (tomas as Record<string, unknown>)[e.id] == null);
const activos = () =>
  (broll.planos as Plano[]).filter((p) => escenas.some((e) => e.id === p.escena) && (p.archivo || sinGrabacion));

// Frame (relativo a la escena del plano) en que termina un B-roll; si el plano no se usa, `respaldo`.
export const finBRoll = (id: string, respaldo = -Infinity) => {
  const p = activos().find((x) => x.id === id);
  return p ? cue(p.escena, p.cue) + p.offset + f(p.dur) : respaldo;
};

// Planos de recurso a pantalla completa. Tu voz sigue sonando debajo (viene de tu toma).
export const BRoll: React.FC = () => (
  <>
    {activos().map((p) => {
      const at = inicioEscena(p.escena) + cue(p.escena, p.cue) + p.offset;
      return (
        <Sequence key={p.id} from={at} durationInFrames={f(p.dur)} name={`B-roll ${p.id}`}>
          <Plano plano={p} />
        </Sequence>
      );
    })}
  </>
);

const Plano: React.FC<{ plano: Plano }> = ({ plano }) => {
  const frame = useCurrentFrame();
  const empuje = 1.04 + rango(frame, 0, f(plano.dur), 0, 0.05);
  if (plano.archivo) {
    return (
      <AbsoluteFill style={{ background: C.noche }}>
        <AbsoluteFill style={{ transform: `scale(${empuje})`, filter: "contrast(1.08) saturate(0.85) sepia(0.08)" }}>
          <OffthreadVideo src={staticFile(plano.archivo)} muted playbackRate={plano.lento ? 0.25 : 1} trimBefore={Math.round((plano.desde ?? 0) * 30)} />
        </AbsoluteFill>
        <Acabado />
      </AbsoluteFill>
    );
  }
  return (
    <AbsoluteFill style={{ background: `radial-gradient(ellipse at 50% 50%, #3a332c, ${C.noche} 75%)`, alignItems: "center", justifyContent: "center" }}>
      <div style={{ transform: `scale(${empuje})`, textAlign: "center", width: 1300 }}>
        <div style={{ fontFamily: mono, fontSize: 22, letterSpacing: 6, color: C.ambar }}>B-ROLL · {plano.modo.toUpperCase()}</div>
        <div style={{ fontFamily: serif, fontSize: 64, color: C.papel, marginTop: 18, lineHeight: 1.1 }}>{plano.descripcion}</div>
        <div style={{ fontFamily: sans, fontSize: 22, color: "rgba(243,237,226,0.5)", marginTop: 18 }}>plano provisional · {plano.dur} s</div>
      </div>
      <Acabado />
    </AbsoluteFill>
  );
};
