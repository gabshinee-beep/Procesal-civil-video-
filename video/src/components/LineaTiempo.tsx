import React from "react";
import { useCurrentFrame } from "remotion";
import { C, mono, sans } from "../theme";
import { entra, rango } from "../anim";

type Props = {
  x: number;
  y: number;
  ancho: number;
  etiquetas: string[];
  aparicion: number;
  oscuro?: boolean;
  grieta?: { idx: number; at: number };
  rebobinar?: { idx: number; at: number };
  domino?: { desdeIdx: number; at: number };
  anios?: boolean;
  marca?: { idx: number; desde: number; hasta: number; texto: string; color: string };
  sello?: { idx: number; at: number; texto: string };
};

// Línea de tiempo del proceso: actos procesales como tarjetas sobre una línea.
export const LineaTiempo: React.FC<Props> = ({ x, y, ancho, etiquetas, aparicion, oscuro, grieta, rebobinar, domino, anios, marca, sello }) => {
  const frame = useCurrentFrame();
  const n = etiquetas.length;
  const gap = 18;
  const cw = (ancho - gap * (n - 1)) / n;
  const ch = 118;
  const linea = rango(frame, aparicion, aparicion + 8 * n + 10);
  const tinta = oscuro ? C.papel : C.tinta;

  const centro = (i: number) => i * (cw + gap) + cw / 2;

  return (
    <div style={{ position: "absolute", left: x, top: y, width: ancho, height: ch + 140 }}>
      {/* línea base */}
      <div style={{ position: "absolute", left: 0, top: ch + 34, height: 3, width: ancho * linea, background: oscuro ? "rgba(243,237,226,0.5)" : C.linea }} />
      {anios && (
        <div style={{ position: "absolute", left: 0, top: ch + 52, width: ancho, display: "flex", justifyContent: "space-between", fontFamily: mono, fontSize: 18, color: oscuro ? "rgba(243,237,226,0.6)" : C.tintaSuave, opacity: linea }}>
          <span>AÑO 0</span>
          <span style={{ opacity: rango(frame, aparicion + 20, aparicion + 30) }}>AÑO 1</span>
          <span style={{ opacity: rango(frame, aparicion + 38, aparicion + 48) }}>AÑO 2</span>
        </div>
      )}
      {etiquetas.map((et, i) => {
        const p = entra(frame, aparicion + i * 8, 16);
        const agrietada = grieta && grieta.idx === i && frame >= grieta.at;
        const temblor = grieta && rebobinar && i > grieta.idx && frame >= rebobinar.at ? Math.sin(frame * 1.7 + i) * rango(frame, rebobinar.at, rebobinar.at + 6) * 3 : 0;
        const cae = domino && i >= domino.desdeIdx ? entra(frame, domino.at + (i - domino.desdeIdx) * 6, 22) : 0;
        const tachado = domino && i >= domino.desdeIdx && frame >= domino.at;
        const borde = agrietada || tachado ? C.rojo : oscuro ? "rgba(243,237,226,0.25)" : C.linea;
        return (
          <div key={et} style={{ position: "absolute", left: i * (cw + gap), top: 0, width: cw, height: ch }}>
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
                background: oscuro ? "rgba(243,237,226,0.94)" : "#FBF8F2",
                border: `2px solid ${borde}`,
                boxShadow: "0 8px 22px rgba(0,0,0,0.18)",
                opacity: p * (1 - cae * 0.55),
                transform: `translateY(${(1 - p) * 20}px) translateX(${temblor}px) rotate(${cae * 14}deg) translateY(${cae * 26}px)`,
                transformOrigin: "100% 100%",
                padding: "14px 11px",
                boxSizing: "border-box",
                position: "relative",
              }}
            >
              <div style={{ fontFamily: mono, fontSize: 15, color: C.tintaSuave }}>{String(i + 1).padStart(2, "0")}</div>
              <div style={{ fontFamily: sans, fontWeight: 600, fontSize: cw > 200 ? 23 : 18, color: C.tinta, marginTop: 8, lineHeight: 1.1 }}>{et}</div>
              {agrietada && <Grieta frame={frame} at={grieta!.at} w={cw} h={ch} />}
              {sello && sello.idx === i && frame >= sello.at && (
                <div style={{ position: "absolute", left: "50%", top: "52%", transform: `translate(-50%, -50%) rotate(-14deg) scale(${2.2 - 1.2 * entra(frame, sello.at, 10)})`, border: `4px solid ${C.rojo}`, borderRadius: 6, padding: "2px 10px", fontFamily: mono, fontWeight: 500, fontSize: 30, letterSpacing: 4, color: C.rojo, background: "rgba(251,248,242,0.85)", opacity: rango(frame, sello.at, sello.at + 4) }}>{sello.texto}</div>
              )}
              {tachado && (
                <div style={{ position: "absolute", left: 10, right: 10, top: ch / 2 + 10, height: 3, background: C.rojo, transform: `scaleX(${cae})`, transformOrigin: "left" }} />
              )}
            </div>
            {marca && marca.idx === i && frame >= marca.desde && frame < marca.hasta && (
              <div style={{ position: "absolute", left: 0, top: ch + 56, fontFamily: mono, fontSize: 17, letterSpacing: 2, color: marca.color, whiteSpace: "nowrap", opacity: entra(frame, marca.desde, 10) }}>▲ {marca.texto}</div>
            )}
            {/* nodo sobre la línea */}
            <div style={{ position: "absolute", left: cw / 2 - 7, top: ch + 28, width: 14, height: 14, borderRadius: 7, background: agrietada || tachado ? C.rojo : tinta, opacity: p }} />
          </div>
        );
      })}
      {rebobinar && frame >= rebobinar.at && (
        <svg width={ancho} height={80} style={{ position: "absolute", left: 0, top: -80, overflow: "visible" }}>
          {(() => {
            const x1 = centro(n - 1);
            const x0 = centro(rebobinar.idx);
            const d = `M ${x1} 66 C ${x1} 10, ${x0} 10, ${x0} 62`;
            const largo = Math.abs(x1 - x0) * 1.3 + 80;
            const dib = rango(frame, rebobinar.at, rebobinar.at + 22);
            return (
              <>
                <path d={d} fill="none" stroke={C.rojo} strokeWidth={5} strokeLinecap="round" strokeDasharray={largo} strokeDashoffset={largo * (1 - dib)} />
                <path d={`M ${x0 - 12} 50 L ${x0} 70 L ${x0 + 12} 50`} fill="none" stroke={C.rojo} strokeWidth={5} strokeLinecap="round" opacity={dib > 0.95 ? 1 : 0} />
                <text x={(x0 + x1) / 2} y={4} textAnchor="middle" fontFamily={mono} fontSize={20} fill={C.rojo} letterSpacing={3} opacity={dib}>
                  ◀◀ RETROCESO
                </text>
              </>
            );
          })()}
        </svg>
      )}
    </div>
  );
};

const Grieta: React.FC<{ frame: number; at: number; w: number; h: number }> = ({ frame, at, w, h }) => {
  const p = rango(frame, at, at + 10);
  const largo = 400;
  return (
    <svg width={w} height={h} style={{ position: "absolute", inset: 0 }}>
      <path
        d={`M ${w * 0.55} -4 L ${w * 0.47} ${h * 0.25} L ${w * 0.6} ${h * 0.42} L ${w * 0.44} ${h * 0.62} L ${w * 0.56} ${h * 0.8} L ${w * 0.5} ${h + 4}`}
        fill="none"
        stroke={C.rojo}
        strokeWidth={4}
        strokeDasharray={largo}
        strokeDashoffset={largo * (1 - p)}
      />
    </svg>
  );
};
