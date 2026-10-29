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
    { at: g("gancho", "titulo") - 2, sfx: "papel" },
    { at: g("gancho", "titulo") + 8, sfx: "golpe", vol: 0.8 },
    { at: inicioCreditos(), sfx: "papel" },
  ];
  if (modo === "respaldo") return base;
  return [
    ...base,
    ...[0, 1, 2, 3, 4].map((i) => ({ at: inicioEscena("gancho") + finBRoll("expediente") + 8 + i * 8, sfx: "tic", vol: 0.5 })),
    { at: inicioEscena("gancho") + Math.max(cue("gancho", "grieta"), finBRoll("sobre") + 2), sfx: "grieta" },
    { at: g("gancho", "rebobinar"), sfx: "rebobinar" },
    { at: inicioEscena("concepto") + 4, sfx: "papel", vol: 0.7 },
    { at: g("concepto", "recurso"), sfx: "tic" },
    { at: g("concepto", "remedio"), sfx: "tic" },
    { at: g("concepto", "extrinseco"), sfx: "tic-grave" },
    { at: g("concepto", "intrinseco"), sfx: "tic-grave" },
    ...["problema", "principios", "casoA", "casoB"].map((e) => ({ at: inicioEscena(e), sfx: "papel", vol: 0.6 })),
    { at: g("problema", "costo"), sfx: "rebobinar", vol: 0.6 },
    ...["p1", "p2", "p3", "p4"].map((c) => ({ at: g("principios", c), sfx: "tic-grave", vol: 0.8 })),
    { at: g("casoA", "sancion"), sfx: "tic-grave" },
    { at: g("casoA", "contesto"), sfx: "tic" },
    { at: g("casoA", "sello"), sfx: "sello" },
    { at: g("casoB", "noConvalida"), sfx: "tic-grave" },
    { at: g("casoB", "perjuicio"), sfx: "tic-grave" },
    { at: g("casoB", "proteccion"), sfx: "tic-grave" },
    { at: inicioEscena("casoB") + finBRoll("sello"), sfx: "sello" },
    ...[0, 1, 2, 3].map((i) => ({ at: g("casoB", "domino", 6 + i * 6), sfx: "domino", vol: 0.8 })),
    { at: g("cierre", "no"), sfx: "golpe", vol: 0.7 },
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
