import React from "react";
import { Audio, Sequence, staticFile } from "remotion";
import audio from "../data/audio.json";
import { finBRoll } from "./BRoll";
import { cue, escenas, inicioEscena, inicioCreditos, duracionTotal } from "../tiempos";

type Ev = { at: number; sfx: string; vol?: number };

// Diseño sonoro por tipo de escena (módulo): cada efecto acompaña un momento del razonamiento.
const tiene = (id: string, c: string) => (escenas.find((e) => e.id === id)?.cues ?? []).some((x) => x.id === c);
const porModulo = (id: string, modulo: string): Ev[] => {
  const g = (c: string, d = 0): number | null => (tiene(id, c) ? inicioEscena(id) + cue(id, c) + d : null);
  const ev = (c: string, sfx: string, vol?: number, d = 0): Ev[] => {
    const at = g(c, d);
    return at === null ? [] : [{ at, sfx, vol }];
  };
  const inicio: Ev[] = [{ at: inicioEscena(id), sfx: "papel", vol: 0.5 }];
  switch (modulo) {
    case "finalidad":
      return [...ev("conflicto", "tic", 0.6), ...ev("actos", "papel", 0.7, -6), ...ev("defectos", "grieta"), ...ev("nulidad", "tic-grave")];
    case "nulidadDetras":
      return [...ev("nulidad", "golpe", 0.7)];
    case "partesEnManos":
      return [...ev("demandante", "tic"), ...ev("demandado", "tic")];
    case "caso":
      return [...inicio, ...ev("facultad", "tic-grave"), ...ev("contesta", "papel", 0.5), ...ev("no", "golpe", 0.5)];
    case "remedio":
      return [...inicio, ...ev("remedio", "sello", 0.5, 8), ...ev("recurso", "sello", 0.5, 8)];
    case "elementos":
      return [...inicio, ...ev("forma", "grieta", 0.8), ...ev("intrinseco", "tic-grave")];
    case "forma":
      return [...ev("dato", "rebobinar", 0.5, -4)];
    case "limites":
      return [...inicio, ...ev("pacto", "tic"), ...ev("esenciales", "tic-grave"), ...ev("retroceder", "rebobinar", 0.6, 6)];
    case "principios":
    case "principiosPartes":
      return [...inicio, ...["p1", "p2", "p3", "p4"].flatMap((c) => ev(c, "tic-grave", 0.8))];
    case "cierre": {
      const s = tiene(id, "declare") ? inicioEscena(id) + finBRoll("sello", cue(id, "declare")) : null;
      return s === null ? [] : [{ at: s, sfx: "sello" }, ...[0, 1, 2, 3].map((i) => ({ at: s + 14 + i * 6, sfx: "domino", vol: 0.8 }))];
    }
    default:
      return [];
  }
};

const eventos = (modo: "completo" | "respaldo"): Ev[] => {
  const base: Ev[] = [{ at: 2, sfx: "golpe", vol: 0.6 }, { at: inicioCreditos(), sfx: "papel" }];
  if (modo === "respaldo") return base;
  return [...base, ...escenas.flatMap((e) => porModulo(e.id, (e as { modulo?: string }).modulo ?? e.id))];
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
