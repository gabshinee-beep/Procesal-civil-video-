import { interpolate, spring } from "remotion";
import { FPS } from "./theme";

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

// 0 → 1 con resorte suave desde el frame `at`
export const entra = (frame: number, at: number, dur = 20) =>
  spring({ frame: frame - at, fps: FPS, config: { damping: 200 }, durationInFrames: dur });

// 1 → 0 lineal desde `at`
export const sale = (frame: number, at: number, dur = 12) => interpolate(frame, [at, at + dur], [1, 0], clamp);

// visible entre `a` y `b` (b opcional) con entrada y salida suaves
export const ventana = (frame: number, a: number, b?: number, fade = 12) =>
  Math.min(entra(frame, a), b === undefined ? 1 : sale(frame, b - fade, fade));

export const lerp = (p: number, desde: number, hasta: number) => desde + (hasta - desde) * p;

export const rango = (frame: number, a: number, b: number, desde = 0, hasta = 1) =>
  interpolate(frame, [a, b], [desde, hasta], clamp);
