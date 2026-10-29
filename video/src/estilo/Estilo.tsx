import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import { Personaje } from "./Personaje";
import { Grano } from "../components/Panel";
import { Acabado } from "../components/Camara";
import { C, mono, sans, serif } from "../theme";

// Fotogramas de estilo (solo para decidir la estética; no forman parte del video).
const PiP: React.FC = () => (
  <div style={{ position: "absolute", left: 50, bottom: 60, width: 300, height: 300, borderRadius: 150, overflow: "hidden", border: `5px solid ${C.papel}`, boxShadow: "0 12px 40px rgba(0,0,0,0.4)", background: "radial-gradient(circle at 45% 40%, #5a4e42, #1d1915)" }}>
    <svg width={300} height={300}>
      <ellipse cx={150} cy={120} rx={48} ry={58} fill="#0f0d0b" />
      <path d="M 40 300 C 50 210, 100 185, 150 182 C 200 185, 250 210, 260 300 Z" fill="#0f0d0b" />
    </svg>
  </div>
);

const Sobre: React.FC<{ x: number; y: number }> = ({ x, y }) => (
  <svg width={90} height={60} style={{ position: "absolute", left: x - 45, top: y - 30, transform: "rotate(-8deg)" }}>
    <rect x={2} y={2} width={86} height={56} rx={5} fill="#FBF8F2" stroke={C.tinta} strokeWidth={3} />
    <path d="M 4 6 L 45 34 L 86 6" fill="none" stroke={C.tinta} strokeWidth={3} />
  </svg>
);

const Notificacion: React.FC = () => (
  <AbsoluteFill style={{ background: C.papel }}>
    <Grano />
    <div style={{ position: "absolute", left: 120, top: 70, fontFamily: mono, fontSize: 22, letterSpacing: 5, color: C.rojo }}>EL JUICIO QUE CASI SE ANULÓ · LAS PARTES</div>
    <div style={{ position: "absolute", left: 120, top: 112, fontFamily: serif, fontWeight: 600, fontSize: 56, color: C.tinta }}>La notificación de la demanda</div>
    {/* juzgado */}
    <div style={{ position: "absolute", left: 860, top: 230, width: 200, textAlign: "center" }}>
      <svg width={200} height={130}>
        <path d="M 10 50 L 100 8 L 190 50 Z" fill={C.tinta} />
        {[30, 70, 110, 150].map((x) => <rect key={x} x={x} y={58} width={18} height={56} fill={C.tinta} />)}
        <rect x={10} y={116} width={180} height={12} fill={C.tinta} />
      </svg>
      <div style={{ fontFamily: mono, fontSize: 16, letterSpacing: 3, color: C.tinta }}>JUZGADO</div>
    </div>
    <Personaje quien="rosa" x={420} y={760} />
    <Personaje quien="mario" x={1520} y={760} />
    <Personaje quien="apoderado" x={1140} y={900} escala={0.85} maletin />
    {/* trayecto correcto (punteado gris) y trayecto real (rojo) */}
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
      <path d="M 960 380 C 1200 420, 1450 470, 1520 560" fill="none" stroke={C.linea} strokeWidth={4} strokeDasharray="10 10" />
      <path d="M 960 380 C 1000 520, 1080 640, 1130 720" fill="none" stroke={C.rojo} strokeWidth={5} />
      <text x={1280} y={440} fontFamily="IBM Plex Mono" fontSize={18} fill={C.tintaSuave} letterSpacing={2}>DEBÍA LLEGAR A MARIO</text>
      <text x={1060} y={600} fontFamily="IBM Plex Mono" fontSize={18} fill={C.rojo} letterSpacing={2}>LLEGÓ AL APODERADO</text>
    </svg>
    <Sobre x={1110} y={690} />
    <div style={{ position: "absolute", left: 1600, top: 860, padding: "8px 16px", border: `3px solid ${C.rojo}`, borderRadius: 8, fontFamily: mono, fontSize: 20, color: C.rojo }}>ARTS. 436–437</div>
    <PiP />
    <div style={{ position: "absolute", left: 380, bottom: 80, padding: "10px 24px", borderRadius: 10, background: "rgba(15,14,12,0.78)", fontFamily: sans, fontWeight: 500, fontSize: 34, color: "#F7F3EC" }}>
      la demanda se notificó a un <span style={{ color: C.ambar }}>apoderado</span> sin facultad
    </div>
  </AbsoluteFill>
);

const Bifurcacion: React.FC = () => (
  <AbsoluteFill style={{ background: C.noche }}>
    {[0, 1].map((lado) => (
      <div key={lado} style={{ position: "absolute", left: lado * 964, top: 0, width: 956, height: 1080, background: C.papel, overflow: "hidden" }}>
        <Grano />
        <div style={{ position: "absolute", left: 60, top: 60, fontFamily: mono, fontSize: 22, letterSpacing: 5, color: lado ? C.rojo : C.verde }}>VERSIÓN {lado + 1}</div>
        <div style={{ position: "absolute", left: 60, top: 100, fontFamily: serif, fontWeight: 600, fontSize: 46, color: C.tinta }}>
          {lado ? "Mario nunca se entera" : "Mario se entera y contesta"}
        </div>
        <Personaje quien="mario" x={330} y={640} tenue={!!lado} />
        {!lado && (
          <svg width={160} height={200} style={{ position: "absolute", left: 420, top: 440 }}>
            <rect x={10} y={10} width={130} height={170} rx={8} fill="#FBF8F2" stroke={C.verde} strokeWidth={4} />
            {[50, 80, 110, 140].map((y) => <rect key={y} x={30} y={y} width={90} height={8} rx={4} fill={C.linea} />)}
            <text x={75} y={38} textAnchor="middle" fontFamily="IBM Plex Mono" fontSize={15} fill={C.verde}>CONTESTACIÓN</text>
          </svg>
        )}
        {!!lado && (
          <div style={{ position: "absolute", left: 470, top: 470, fontFamily: serif, fontSize: 120, color: C.rojo, opacity: 0.85 }}>?</div>
        )}
        <div style={{ position: "absolute", left: 60, right: 60, top: 760, display: "flex", gap: 10 }}>
          {["Especificidad", "Convalidación", "Trascendencia", "Protección"].map((q, i) => {
            const col = lado ? C.rojo : i === 1 || i === 2 ? C.verde : i === 0 ? C.rojo : C.linea;
            return (
              <div key={q} style={{ flex: 1, padding: "10px 8px", border: `3px solid ${col}`, borderRadius: 10, background: "#FBF8F2", fontFamily: sans, fontWeight: 600, fontSize: 18, textAlign: "center", color: C.tinta, opacity: col === C.linea ? 0.5 : 1 }}>
                {q}
              </div>
            );
          })}
        </div>
        <div style={{ position: "absolute", left: 60, top: 860, fontFamily: serif, fontWeight: 700, fontSize: 40, color: lado ? C.ambar : C.verde }}>
          {lado ? "Puede proceder la nulidad" : "Convalidado · no se anula"}
        </div>
      </div>
    ))}
    <div style={{ position: "absolute", left: 960 - 160, top: 470, width: 320, height: 320, borderRadius: 160, overflow: "hidden", border: `6px solid ${C.papel}`, boxShadow: "0 12px 40px rgba(0,0,0,0.5)", background: "radial-gradient(circle at 45% 40%, #5a4e42, #1d1915)" }}>
      <svg width={320} height={320}>
        <ellipse cx={160} cy={130} rx={50} ry={60} fill="#0f0d0b" />
        <path d="M 40 320 C 55 225, 105 198, 160 195 C 215 198, 265 225, 280 320 Z" fill="#0f0d0b" />
      </svg>
    </div>
    <Acabado />
  </AbsoluteFill>
);

export const Estilo: React.FC = () => {
  const frame = useCurrentFrame();
  return frame < 30 ? <Notificacion /> : <Bifurcacion />;
};
