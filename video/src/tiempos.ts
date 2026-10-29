import guion from "./data/guion.json";
import timingJson from "./data/timing.json";

export type Palabra = { w: string; s: number; e: number };
type TiempoEscena = { id: string; inicio: number; duracion: number; nPalabras?: number; cues?: Record<string, number>; palabras?: Palabra[] };
export const timing = timingJson as { fuente: string; total: number; escenas: TiempoEscena[] };
import { FPS } from "./theme";

export type Escena = (typeof guion.escenas)[number];
export const escenas = guion.escenas;

const t = (id: string) => {
  const e = timing.escenas.find((x) => x.id === id);
  if (!e) throw new Error(`Sin tiempos para la escena ${id}`);
  return e;
};

export const f = (seg: number) => Math.round(seg * FPS);

export const inicioEscena = (id: string) => f(t(id).inicio);
// Cada escena dura hasta que empieza la siguiente (incluye la pausa entre escenas).
export const duracionEscena = (id: string) => {
  const i = timing.escenas.findIndex((x) => x.id === id);
  const sig = timing.escenas[i + 1];
  return (sig ? f(sig.inicio) : f(timing.total - guion.creditos.duracionSeg)) - f(timing.escenas[i].inicio);
};

export const duracionTotal = () => f(timing.total);
export const inicioCreditos = () => f(timing.total - guion.creditos.duracionSeg);

// Frame (relativo al inicio de la escena) en que se pronuncia el ancla de un cue.
// Con voz provisional se interpola por posición de caracteres; con Whisper, tiempos reales.
export const cue = (escenaId: string, cueId: string): number => {
  const e = escenas.find((x) => x.id === escenaId)!;
  const c = e.cues.find((x) => x.id === cueId);
  if (!c) throw new Error(`Cue ${cueId} no existe en ${escenaId}`);
  const real = t(escenaId).cues?.[cueId];
  if (real != null) return f(real); // tiempo real (Whisper) de tu toma
  const idx = e.texto.indexOf(c.ancla);
  if (idx < 0) throw new Error(`Ancla «${c.ancla}» no está en el texto de ${escenaId}`);
  return f(t(escenaId).duracion * (idx / e.texto.length));
};

export const useCues = (escenaId: string) => (cueId: string) => cue(escenaId, cueId);
