import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Camara } from "../components/Camara";
import { Personaje } from "../estilo/Personaje";
import { escenas, useCues } from "../tiempos";
import { tomaDe } from "../components/Camara";
import { useManos } from "./manos";
import { C, mono, sans, serif } from "../theme";
import { entra, lerp, ventana } from "../anim";

type Seg = { id: string; pregunta?: { n: number; texto: string }; cues: { id: string }[]; rotulos?: { cue: string; kicker: string; texto: string; hasta?: string }[]; nombres?: { demandante?: string; demandado?: string } };
const seg = (id: string) => escenas.find((e) => e.id === id) as unknown as Seg;
const tieneCue = (id: string, c: string) => seg(id).cues.some((x) => x.id === c);

// Rótulo inferior sobrio (término, artículo o autor) que acompaña lo que dices.
const Rotulo: React.FC<{ at: number; hasta: number; kicker: string; texto: string }> = ({ at, hasta, kicker, texto }) => {
  const frame = useCurrentFrame();
  const o = ventana(frame, at, hasta);
  if (o <= 0) return null;
  return (
    <div style={{ position: "absolute", right: 80, bottom: 170, maxWidth: 820, opacity: o, transform: `translateX(${(1 - o) * 30}px)`, background: C.papel, borderLeft: `8px solid ${C.rojo}`, borderRadius: 8, padding: "14px 24px", boxShadow: "0 14px 40px rgba(0,0,0,0.35)" }}>
      <div style={{ fontFamily: mono, fontSize: 18, letterSpacing: 3, color: C.rojo }}>{kicker}</div>
      <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 30, color: C.tinta, marginTop: 4 }}>{texto}</div>
    </div>
  );
};

const Rotulos: React.FC<{ id: string }> = ({ id }) => {
  const c = useCues(id);
  return (
    <>
      {(seg(id).rotulos ?? []).map((r, i) => (
        <Rotulo key={i} at={c(r.cue)} hasta={r.hasta ? c(r.hasta) : c(r.cue) + 150} kicker={r.kicker} texto={r.texto} />
      ))}
    </>
  );
};

// Tu pregunta, en grande y DETRÁS de ti (como portada de revista). Va entre tu cuarto y tu recorte.
export const PreguntaDetras: React.FC<{ id: string; hasta?: number }> = ({ id, hasta }) => {
  const frame = useCurrentFrame();
  const q = seg(id).pregunta;
  if (!q) return null;
  const at = escenas[0].id === id ? 112 : 4;
  const fin = Math.min(at + 120, hasta ?? Infinity);
  const o = Math.min(entra(frame, at, 18), 1 - entra(frame, fin - 10, 14));
  if (o <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 80, right: 80, top: 90, opacity: o, transform: `translateY(${(1 - o) * 30}px)` }}>
      <div style={{ fontFamily: mono, fontSize: 26, letterSpacing: 8, color: C.ambar }}>PREGUNTA {q.n}</div>
      <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 112, lineHeight: 0.98, letterSpacing: -2, color: C.papel, textShadow: "0 8px 30px rgba(0,0,0,0.35)" }}>{q.texto}</div>
    </div>
  );
};

const conRecorte = (id: string) => !!(tomaDe(id) as { persona?: string } | null)?.persona;

// Tú a pantalla completa, con tu pregunta detrás y rótulos opcionales. Módulo «comodín».
export const PreguntaLado: React.FC<{ id: string }> = ({ id }) => {
  const frame = useCurrentFrame();
  const q = seg(id).pregunta;
  if (!q) return null;
  const at = escenas[0].id === id ? 112 : 4;
  const o = Math.min(entra(frame, at, 18), 1 - entra(frame, at + 170, 18));
  if (o <= 0.001) return null;
  return (
    <div style={{ position: "absolute", left: 980, right: 80, top: 330, opacity: o, transform: `translateX(${(1 - o) * 40}px)` }}>
      <div style={{ fontFamily: mono, fontSize: 24, letterSpacing: 8, color: C.ambar }}>PREGUNTA {q.n}</div>
      <div style={{ fontFamily: serif, fontWeight: 700, fontSize: 76, lineHeight: 1.04, color: C.papel, marginTop: 12 }}>{q.texto}</div>
    </div>
  );
};

export const Presentador: React.FC<{ id?: string }> = ({ id = "" }) => (
  <AbsoluteFill>
    <Camara escenaId={id} etiqueta="Presentador" />
    {conRecorte(id) ? <PreguntaDetras id={id} /> : <PreguntaLado id={id} />}
    <Camara escenaId={id} etiqueta="Presentador" capa="persona" />
    <Rotulos id={id} />
  </AbsoluteFill>
);

// «NULIDAD» aparece DETRÁS de ti (si hay recorte); si no, al costado.
export const NulidadDetras: React.FC<{ id?: string }> = ({ id = "" }) => {
  const frame = useCurrentFrame();
  const c = useCues(id);
  const at = tieneCue(id, "nulidad") ? c("nulidad") : 10;
  const p = entra(frame, at, 26);
  const detras = !!(tomaDe(id) as { persona?: string } | null)?.persona;
  const texto = (
    <div style={{ position: "absolute", left: 0, right: 0, top: detras ? 250 : 330, textAlign: detras ? "center" : "right", paddingRight: detras ? 0 : 90, opacity: p, transform: `translateY(${(1 - p) * 50}px) scale(${0.94 + 0.06 * p})` }}>
      <div style={{ fontFamily: serif, fontWeight: 700, fontSize: detras ? 270 : 150, lineHeight: 0.9, letterSpacing: -4, color: C.papel, textShadow: "0 10px 40px rgba(0,0,0,0.35)" }}>NULIDAD</div>
      <div style={{ fontFamily: mono, fontSize: detras ? 40 : 30, letterSpacing: 18, color: C.ambar, marginTop: 14 }}>PROCESAL</div>
    </div>
  );
  return (
    <AbsoluteFill>
      <Camara escenaId={id} etiqueta="Nulidad" zoom={[1, 1.03]} />
      {detras && <PreguntaDetras id={id} hasta={at} />}
      {detras ? texto : <AbsoluteFill style={{ background: "linear-gradient(to right, transparent 45%, rgba(10,9,8,0.6) 70%)", opacity: p }}>{texto}</AbsoluteFill>}
      <Camara escenaId={id} etiqueta="Nulidad" zoom={[1, 1.03]} capa="persona" />
      <Rotulos id={id} />
    </AbsoluteFill>
  );
};

// Las partes aparecen sobre tus palmas (rastreo de manos); si la mano no se detecta, en posición fija.
export const PartesEnManos: React.FC<{ id?: string }> = ({ id = "" }) => {
  const frame = useCurrentFrame();
  const c = useCues(id);
  const palmas = useManos(id);
  const nombres = seg(id).nombres ?? {};
  const atA = tieneCue(id, "demandante") ? c("demandante") : 20;
  const atB = tieneCue(id, "demandado") ? c("demandado") : atA + 40;
  // ¿En qué lado de la pantalla levantó la mano para la demandante? (la palma más alta en ese momento)
  const enA = palmas(atA + 8);
  const ladoA = enA.length ? (enA.reduce((m, p) => (p[1] < m[1] ? p : m))[0] < 960 ? 0 : 1) : 1;
  const reposo: [number, number][] = [[620, 470], [1300, 470]];
  const pos = (lado: number): [number, number] => {
    const ps = palmas(frame);
    const cand = ps.filter((p) => (lado === 0 ? p[0] < 960 : p[0] >= 960) && p[1] < 0.82 * 1080);
    const objetivo = cand.length ? [cand[0][0], cand[0][1] - 30] : reposo[lado];
    return objetivo as [number, number];
  };
  const figura = (quien: "laura" | "mario", at: number, lado: number, nombre?: string) => {
    const p = entra(frame, at, 18);
    if (p <= 0.001) return null;
    const [x, y] = pos(lado);
    return (
      <div style={{ position: "absolute", left: 0, top: 0, opacity: p }}>
        <div style={{ position: "absolute", left: x - 90, top: y - 30, width: 180, height: 60, borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,226,170,0.55), transparent 70%)", filter: "blur(6px)" }} />
        <div style={{ transform: `translateY(${lerp(p, 30, 0)}px)` }}>
          <Personaje quien={quien} x={x} y={y} escala={0.62 + 0.08 * p} etiqueta={false} />
        </div>
        {nombre && (
          <div style={{ position: "absolute", left: x - 150, top: y + 18, width: 300, textAlign: "center", fontFamily: mono, fontSize: 18, letterSpacing: 3, color: C.papel, textShadow: "0 2px 10px rgba(0,0,0,0.8)" }}>
            {nombre.toUpperCase()}
          </div>
        )}
      </div>
    );
  };
  return (
    <AbsoluteFill>
      <Camara escenaId={id} etiqueta="Las partes" zoom={[1, 1]} />
      {figura("laura", atA, ladoA, nombres.demandante ? `${nombres.demandante} · demandante` : "Demandante")}
      {figura("mario", atB, 1 - ladoA, nombres.demandado ? `${nombres.demandado} · demandado` : "Demandado")}
      <Rotulos id={id} />
    </AbsoluteFill>
  );
};
