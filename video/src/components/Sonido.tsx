import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import audio from "../data/audio.json";
import { finBRoll } from "./BRoll";
import { cue, inicioEscena, inicioCreditos, duracionTotal } from "../tiempos";

type Ev = { at: number; sfx: string; vol?: number };

// Diseño sonoro: cada efecto está anclado a un momento del razonamiento, nunca de adorno.
const eventos = (modo: "completo" | "respaldo"): Ev[] => {
  const g = (esc: string, c: string, d = 0) => inicioEscena(esc) + cue(esc, c) + d;
  const base: Ev[] = [
    { at: 2, sfx: "golpe", vol: 0.6 },
    { at: inicioCreditos(), sfx: "papel" },
  ];
  if (modo === "respaldo") return base;
  return [
    ...base,
    { at: g("finalidad", "conflicto"), sfx: "tic", vol: 0.6 },
    { at: g("finalidad", "actos", -6), sfx: "papel", vol: 0.7 },
    { at: g("caso", "laura"), sfx: "tic" },
    { at: g("caso", "laura", 10), sfx: "tic" },
    ...[0, 1, 2, 3, 4].map((i) => ({ at: g("finalidad", "actos", 4 + i * 8), sfx: "tic", vol: 0.5 })),
    { at: g("finalidad", "defectos"), sfx: "grieta" },
    { at: g("finalidad", "nulidad"), sfx: "tic-grave" },
    { at: inicioEscena("caso") + Math.max(cue("caso", "apoderado"), finBRoll("sobre")), sfx: "papel", vol: 0.6 },
    { at: g("caso", "facultad"), sfx: "tic-grave" },
    { at: g("caso", "contesta"), sfx: "papel", vol: 0.5 },
    { at: g("caso", "no"), sfx: "golpe", vol: 0.5 },
    { at: inicioEscena("remedio"), sfx: "papel", vol: 0.6 },
    { at: g("remedio", "remedio", 8), sfx: "sello", vol: 0.5 },
    { at: g("remedio", "recurso", 8), sfx: "sello", vol: 0.5 },
    { at: inicioEscena("elementos"), sfx: "papel", vol: 0.6 },
    { at: g("elementos", "forma"), sfx: "grieta", vol: 0.8 },
    { at: g("elementos", "intrinseco"), sfx: "tic-grave" },
    { at: g("forma", "dato", -4), sfx: "rebobinar", vol: 0.5 },
    { at: inicioEscena("limites"), sfx: "papel", vol: 0.6 },
    { at: g("limites", "pacto"), sfx: "tic" },
    { at: g("limites", "esenciales"), sfx: "tic-grave" },
    { at: g("limites", "retroceder", 6), sfx: "rebobinar", vol: 0.6 },
    ...["p1", "p2", "p3", "p4"].map((c) => ({ at: g("principios", c), sfx: "tic-grave", vol: 0.8 })),
    { at: inicioEscena("cierre") + finBRoll("sello"), sfx: "sello" },
    ...[0, 1, 2, 3].map((i) => ({ at: inicioEscena("cierre") + finBRoll("sello") + 14 + i * 6, sfx: "domino", vol: 0.8 })),
  ];
};

export const Sonido: React.FC<{ modo: "completo" | "respaldo" }> = ({ modo }) => (
  <>
    {eventos(modo).map((e, i) => (
      <Sequence key={i} from={Math.max(0, e.at)} durationInFrames={60} name={`sfx ${e.sfx}`}>
        <Audio src={staticFile(`sfx/${e.sfx}.mp3`)} volume={audio.sfx * (e.vol ?? 1)} />
      </Sequence>
    ))}
    {audio.musica && <Audio src={staticFile(audio.musica)} volume={audio.volumenMusica} loop endAt={duracionTotal()} />}
  </>
);
