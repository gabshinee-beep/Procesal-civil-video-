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
import { escenas, inicioEscena, duracionEscena, inicioCreditos, cue, f } from "./tiempos";
import { Presentador, NulidadDetras, PartesEnManos } from "./libre/Modulos";
import { PrincipiosPartes } from "./libre/PrincipiosPartes";
import { Preguntas } from "./libre/Pregunta";
import { EtiquetasMano } from "./libre/EtiquetasMano";

// La escalera aparece desde el primer peldaño 2 en adelante y se oculta en la conclusión.
const inicioEscalera = () => {
  const e = escenas.find((x) => (x.peldanos as { n: number }[]).some((p) => p.n >= 2));
  return e ? inicioEscena(e.id) : 0;
};
const finEscalera = () => {
  const ult = escenas[escenas.length - 1];
  const tieneP = ult.cues.some((c) => c.id === "pregunta");
  return tieneP ? inicioEscena(ult.id) + cue(ult.id, "pregunta") - 6 : inicioEscena(ult.id) + duracionEscena(ult.id);
};
import { C, mono, serif } from "./theme";
import { entra, sale } from "./anim";

const COMPLETO: Record<string, React.FC<{ id?: string }>> = {
  finalidad: E1Finalidad,
  caso: E2Caso,
  remedio: E3Remedio,
  elementos: E4Elementos,
  forma: E5Forma,
  limites: E6Limites,
  principios: E7Principios,
  cierre: E8Cierre,
  presentador: Presentador,
  nulidadDetras: NulidadDetras,
  partesEnManos: PartesEnManos,
  principiosPartes: PrincipiosPartes,
};

const sinGrabacion = escenas.every((e) => (tomas as Record<string, unknown>)[e.id] == null);

// Título de apertura sobre el B-roll del expediente.
const TituloCine: React.FC<{ hasta: number }> = ({ hasta }) => {
  const frame = useCurrentFrame();
  if (frame > hasta) return null;
  const o = Math.min(entra(frame, 4, 16), sale(frame, hasta - 8, 8));
  return (
    <AbsoluteFill style={{ opacity: o }}>
      <div style={{ position: "absolute", left: 980, top: 380, fontFamily: mono, fontSize: 22, letterSpacing: 6, color: C.ambar }}>{guion.subtitulo.toUpperCase()}</div>
      <div style={{ position: "absolute", left: 980, right: 70, top: 420, fontFamily: serif, fontWeight: 600, fontSize: 84, lineHeight: 1.05, color: C.papel }}>{guion.titulo}</div>
    </AbsoluteFill>
  );
};

// modo "completo": animaciones · modo "respaldo": solo tu toma + rótulos + subtítulos
export const Video: React.FC<{ modo: "completo" | "respaldo" }> = ({ modo }) => (
  <AbsoluteFill style={{ background: C.noche }}>
    {escenas.map((e) => {
      const modulo = (e as { modulo?: string }).modulo ?? e.id;
      const Escena = COMPLETO[modulo] ?? Presentador;
      return (
        <Sequence key={e.id} from={inicioEscena(e.id)} durationInFrames={duracionEscena(e.id)} name={e.seccion}>
          {modo === "completo" ? <Escena id={e.id} /> : <Camara escenaId={e.id} etiqueta={e.seccion} />}
        </Sequence>
      );
    })}
    {modo === "respaldo" && <Rotulos />}
    {modo === "completo" && <Escalera visibleDesde={inicioEscalera()} visibleHasta={finEscalera()} />}
    <BRoll />
    {modo === "completo" && <Preguntas />}
    {modo === "completo" && <EtiquetasMano />}
    <TituloCine hasta={escenas.length ? inicioEscena(escenas[0].id) + finBRoll("expediente", f(3.2)) : 0} />
    <Subtitulos />
    <Creditos at={inicioCreditos()} />
    <Sonido modo={modo} />
    {sinGrabacion && <Audio src={staticFile("maqueta/voz.mp3")} />}
  </AbsoluteFill>
);
