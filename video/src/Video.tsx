import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import tomas from "./data/tomas.json";
import { Camara } from "./components/Camara";
import { Subtitulos } from "./components/Subtitulos";
import { Progreso } from "./components/Progreso";
import { Titulo, Creditos } from "./components/Titulo";
import { Rotulos } from "./components/Rotulos";
import { Gancho } from "./escenas/Gancho";
import { Concepto } from "./escenas/Concepto";
import { Problema } from "./escenas/Problema";
import { Principios } from "./escenas/Principios";
import { CasoA } from "./escenas/CasoA";
import { CasoB } from "./escenas/CasoB";
import { Cierre } from "./escenas/Cierre";
import { escenas, inicioEscena, duracionEscena, inicioCreditos, cue, f } from "./tiempos";
import { C } from "./theme";

const COMPLETO: Record<string, React.FC> = {
  gancho: Gancho,
  concepto: Concepto,
  problema: Problema,
  principios: Principios,
  casoA: CasoA,
  casoB: CasoB,
  cierre: Cierre,
};

const sinGrabacion = escenas.every((e) => (tomas as Record<string, unknown>)[e.id] == null);

// modo "completo": animaciones avanzadas · modo "respaldo": solo tu toma + rótulos + subtítulos
export const Video: React.FC<{ modo: "completo" | "respaldo" }> = ({ modo }) => {
  const tituloAt = inicioEscena("gancho") + cue("gancho", "titulo");
  return (
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
      <Titulo at={tituloAt} hasta={tituloAt + f(3.6)} />
      {modo === "completo" && <Progreso visibleDesde={tituloAt + f(3.6)} visibleHasta={inicioEscena("cierre")} />}
      <Subtitulos />
      <Creditos at={inicioCreditos()} />
      {sinGrabacion && <Audio src={staticFile("maqueta/voz.mp3")} />}
    </AbsoluteFill>
  );
};
