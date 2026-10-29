import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import guion from "./data/guion.json";
import tomas from "./data/tomas.json";
import { Camara } from "./components/Camara";
import { Subtitulos } from "./components/Subtitulos";
import { Escalera } from "./components/Escalera";
import { Creditos } from "./components/Titulo";
import { Rotulos } from "./components/Rotulos";
import { BRoll, finBRoll } from "./components/BRoll";
import { Sonido } from "./components/Sonido";
import { E1Finalidad } from "./v4/E1Finalidad";
import { E2Caso } from "./v4/E2Caso";
import { E3Remedio } from "./v4/E3Remedio";
import { E4Elementos } from "./v4/E4Elementos";
import { E5Forma } from "./v4/E5Forma";
import { E6Limites } from "./v4/E6Limites";
import { E7Principios } from "./v4/E7Principios";
import { E8Cierre } from "./v4/E8Cierre";
import { escenas, inicioEscena, duracionEscena, inicioCreditos, cue } from "./tiempos";
import { C, mono, serif } from "./theme";
import { entra, sale } from "./anim";

const COMPLETO: Record<string, React.FC> = {
  finalidad: E1Finalidad,
  caso: E2Caso,
  remedio: E3Remedio,
  elementos: E4Elementos,
  forma: E5Forma,
  limites: E6Limites,
  principios: E7Principios,
  cierre: E8Cierre,
};

const sinGrabacion = escenas.every((e) => (tomas as Record<string, unknown>)[e.id] == null);

// Título de apertura sobre el B-roll del expediente.
const TituloCine: React.FC<{ hasta: number }> = ({ hasta }) => {
  const frame = useCurrentFrame();
  if (frame > hasta) return null;
  const o = Math.min(entra(frame, 4, 16), sale(frame, hasta - 8, 8));
  return (
    <AbsoluteFill style={{ opacity: o, background: "linear-gradient(to top, rgba(10,9,8,0.75), transparent 60%)" }}>
      <div style={{ position: "absolute", left: 120, bottom: 300, fontFamily: mono, fontSize: 22, letterSpacing: 6, color: C.ambar }}>LA NULIDAD PROCESAL SEGÚN ANA MARÍA ARRARTE</div>
      <div style={{ position: "absolute", left: 120, bottom: 190, fontFamily: serif, fontWeight: 600, fontSize: 84, color: C.papel }}>{guion.titulo}</div>
    </AbsoluteFill>
  );
};

// modo "completo": animaciones · modo "respaldo": solo tu toma + rótulos + subtítulos
export const Video: React.FC<{ modo: "completo" | "respaldo" }> = ({ modo }) => (
  <AbsoluteFill style={{ background: C.noche }}>
    {escenas.map((e) => {
      const Escena = COMPLETO[e.id];
      return (
        <Sequence key={e.id} from={inicioEscena(e.id)} durationInFrames={duracionEscena(e.id)} name={e.seccion}>
          {modo === "completo" ? <Escena /> : <Camara escenaId={e.id} etiqueta={e.seccion} />}
        </Sequence>
      );
    })}
    {modo === "respaldo" && <Rotulos />}
    {modo === "completo" && (
      <Escalera visibleDesde={inicioEscena("finalidad") + cue("finalidad", "actos") - 6} visibleHasta={inicioEscena("cierre") + cue("cierre", "pregunta") - 6} />
    )}
    <BRoll />
    <TituloCine hasta={inicioEscena("finalidad") + finBRoll("expediente")} />
    <Subtitulos />
    <Creditos at={inicioCreditos()} />
    <Sonido modo={modo} />
    {sinGrabacion && <Audio src={staticFile("maqueta/voz.mp3")} />}
  </AbsoluteFill>
);
