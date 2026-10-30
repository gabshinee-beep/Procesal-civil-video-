import guion from "./data/guion.json";
import timingJson from "./data/timing.json";

export type Palabra = { w: string; s: number; e: number };
type TiempoEscena = { id: string; inicio: number; duracion: number; nPalabras?: number; cues?: Record<string, number>; palabras?: Palabra[] };
export const timing = timingJson as unknown as { fuente: string; total: number; escenas: TiempoEscena[] };
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

const norm = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9ñ]/g, "");

// Palabras de una escena con sus frames (relativos a la escena): reales si hay transcripción,
// si no, repartidas por la posición de cada palabra en el texto del guion.
export type PalabraF = { w: string; desde: number; hasta: number };
export const palabrasEscena = (id: string): PalabraF[] => {
  const te = t(id);
  if (te.palabras?.length) return te.palabras.map((p) => ({ w: p.w, desde: f(p.s), hasta: f(p.e) }));
  const e = escenas.find((x) => x.id === id)!;
  const L = e.texto.length;
  return [...e.texto.matchAll(/\S+/g)].map((m) => ({
    w: m[0],
    desde: f((te.duracion * m.index!) / L),
    hasta: f((te.duracion * (m.index! + m[0].length)) / L),
  }));
};

// Frame en que se pronuncia cada palabra de un fragmento (para citas que aparecen palabra a palabra).
export const marcasFragmento = (id: string, fragmento: string, respaldoDesde: number): number[] => {
  const pals = palabrasEscena(id);
  const obj = fragmento.split(/\s+/).map(norm);
  const k = pals.findIndex((_, i) => norm(pals[i].w) === obj[0] && norm(pals[i + 1]?.w ?? "") === obj[1]);
  if (k >= 0) return obj.map((_, j) => pals[Math.min(k + j, pals.length - 1)].desde + (k + j >= pals.length ? 4 * j : 0));
  return obj.map((_, j) => respaldoDesde + j * 6); // si lo dijiste distinto: 5 palabras por segundo
};
