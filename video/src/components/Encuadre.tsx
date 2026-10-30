import React from "react";
import { useCurrentFrame } from "remotion";
import tomas from "../data/tomas.json";
import { Camara } from "./Camara";
import { C } from "../theme";
import { entra, lerp } from "../anim";

// Tu plano cambia de tamaño según lo que la escena necesita, con transiciones suaves:
// completo (protagonista) · ventana (pantalla dividida) · pip (círculo) · centro (círculo en el corte).
export type Modo = "completo" | "ventana" | "pip" | "centro";
type Rect = { x: number; y: number; w: number; h: number; r: number; s: number; borde: number };
const RECT: Record<Modo, Rect> = {
  completo: { x: 0, y: 0, w: 1920, h: 1080, r: 0, s: 1, borde: 0 },
  ventana: { x: 60, y: 120, w: 620, h: 820, r: 22, s: 0.95, borde: 5 },
  pip: { x: 60, y: 620, w: 320, h: 320, r: 160, s: 0.62, borde: 5 },
  centro: { x: 800, y: 540, w: 320, h: 320, r: 160, s: 0.62, borde: 6 },
};

// Con recorte de persona disponible, los modos «en caja» se vuelven «tú dentro del expediente»:
// el cuarto se disuelve y quedas recortado (estilo collage de papel) en estos puntos de la escena.
const RECORTE: Record<Exclude<Modo, "completo">, { cx: number; cy: number; s: number }> = {
  ventana: { cx: 390, cy: 640, s: 0.78 },
  pip: { cx: 250, cy: 770, s: 0.58 },
  centro: { cx: 960, cy: 760, s: 0.58 },
};

// Punto de tu cara/cuerpo en el plano original (se puede ajustar por toma en tomas.json → "foco").
const focoDe = (escenaId: string, modo: Modo) => {
  const t = (tomas as Record<string, unknown>)[escenaId] as { foco?: { x: number; y: number } } | null;
  const fx = t?.foco?.x ?? 0.3 * 1920;
  const fy = t?.foco?.y ?? 0.4 * 1080;
  if (modo === "completo") return { fx: 960, fy: 540 };
  if (modo === "ventana") return { fx, fy: fy + 120 };
  return { fx, fy };
};

export const Encuadre: React.FC<{ escenaId: string; etiqueta: string; pasos: { at: number; modo: Modo }[]; golpes?: { at: number; escala: number }[] }> = ({
  escenaId,
  etiqueta,
  pasos,
  golpes,
}) => {
  const frame = useCurrentFrame();
  const persona = !!(tomas as Record<string, { persona?: string } | null>)[escenaId]?.persona;
  if (persona) return <EnRecorte escenaId={escenaId} etiqueta={etiqueta} pasos={pasos} golpes={golpes} />;
  const orden = [...pasos].sort((a, b) => a.at - b.at);
  const i = Math.max(0, orden.reduce((acc, p, k) => (frame >= p.at ? k : acc), -1));
  const actual = orden[i];
  const previo = orden[Math.max(0, i - 1)];
  const p = i === 0 ? 1 : entra(frame, actual.at, 20);
  const a = RECT[previo.modo];
  const b = RECT[actual.modo];
  const fa = focoDe(escenaId, previo.modo);
  const fb = focoDe(escenaId, actual.modo);
  const r = (k: keyof Rect) => lerp(p, a[k], b[k]);
  const w = r("w");
  const h = r("h");
  const s = r("s");
  const fx = lerp(p, fa.fx, fb.fx);
  const fy = lerp(p, fa.fy, fb.fy);
  return (
    <div
      style={{
        position: "absolute",
        left: r("x"),
        top: r("y"),
        width: w,
        height: h,
        borderRadius: r("r"),
        overflow: "hidden",
        boxShadow: r("borde") > 0.5 ? `0 0 0 ${r("borde")}px ${C.papel}, 0 18px 50px rgba(0,0,0,0.45)` : "none",
        background: C.noche,
      }}
    >
      <div style={{ position: "absolute", left: 0, top: 0, width: 1920, height: 1080, transformOrigin: "0 0", transform: `translate(${w / 2 - fx * s}px, ${h / 2 - fy * s}px) scale(${s})` }}>
        <Camara escenaId={escenaId} etiqueta={etiqueta} golpes={golpes} zoom={[1, 1.03]} />
      </div>
    </div>
  );
};

// «Tú dentro del expediente»: el cuarto (capa video) se desvanece y tu recorte se ubica en la escena.
const EnRecorte: React.FC<{ escenaId: string; etiqueta: string; pasos: { at: number; modo: Modo }[]; golpes?: { at: number; escala: number }[] }> = ({
  escenaId,
  etiqueta,
  pasos,
  golpes,
}) => {
  const frame = useCurrentFrame();
  let orden = [...pasos].sort((a, b) => a.at - b.at);
  // si la escena empieza ya en modo recorte, el cuarto se disuelve en los primeros cuadros
  if (orden[0].modo !== "completo") orden = [{ at: -100, modo: "completo" }, { ...orden[0], at: Math.max(orden[0].at, 4) }, ...orden.slice(1)];
  const i = Math.max(0, orden.reduce((acc, p, k) => (frame >= p.at ? k : acc), -1));
  const actual = orden[i];
  const previo = orden[Math.max(0, i - 1)];
  const p = i === 0 ? 1 : entra(frame, actual.at, 22);
  const t = (m: Modo) => {
    if (m === "completo") return { tx: 0, ty: 0, s: 1, k: 0 };
    const { fx, fy } = focoDe(escenaId, "pip");
    const r = RECORTE[m];
    return { tx: r.cx - fx * r.s, ty: r.cy - fy * r.s, s: r.s, k: 1 };
  };
  const a = t(previo.modo);
  const b = t(actual.modo);
  const k = lerp(p, a.k, b.k); // 0 = tu cuarto · 1 = recorte en el expediente
  const tx = lerp(p, a.tx, b.tx);
  const ty = lerp(p, a.ty, b.ty);
  const s = lerp(p, a.s, b.s);
  const borde = 5 * k;
  return (
    <>
      {k < 0.999 && (
        <div style={{ position: "absolute", inset: 0, opacity: 1 - k }}>
          <Camara escenaId={escenaId} etiqueta={etiqueta} golpes={golpes} zoom={[1, 1.03]} />
        </div>
      )}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 1920,
          height: 1080,
          transformOrigin: "0 0",
          transform: `translate(${tx}px, ${ty}px) scale(${s})`,
          filter: k > 0.01 ? `drop-shadow(${borde}px 0 0 ${C.papel}) drop-shadow(-${borde}px 0 0 ${C.papel}) drop-shadow(0 ${borde}px 0 ${C.papel}) drop-shadow(0 -${borde}px 0 ${C.papel}) drop-shadow(0 18px 26px rgba(40,30,20,${0.35 * k}))` : "none",
        }}
      >
        <Camara escenaId={escenaId} etiqueta={etiqueta} golpes={golpes} zoom={[1, 1.03]} capa="persona" />
      </div>
    </>
  );
};
