import React from "react";
import { useCurrentFrame } from "remotion";
import { escenas, inicioEscena } from "../tiempos";
import { C, mono } from "../theme";

// Indicador de avance: el espectador siempre sabe en qué parte del razonamiento está.
export const Progreso: React.FC<{ visibleDesde: number; visibleHasta: number }> = ({ visibleDesde, visibleHasta }) => {
  const frame = useCurrentFrame();
  if (frame < visibleDesde || frame >= visibleHasta) return null;
  const secciones = escenas.filter((e) => e.layout === "panel");
  const actual = [...escenas].reverse().find((e) => frame >= inicioEscena(e.id))?.id;
  return (
    <div style={{ position: "absolute", left: 880, top: 58, display: "flex", gap: 10 }}>
      {secciones.map((e) => {
        const activo = e.id === actual;
        return (
          <div
            key={e.id}
            style={{
              fontFamily: mono,
              fontSize: 16,
              letterSpacing: 2,
              textTransform: "uppercase",
              padding: "6px 12px",
              borderRadius: 999,
              color: activo ? C.noche : "rgba(243,237,226,0.7)",
              background: activo ? C.papel : "rgba(243,237,226,0.12)",
              border: "1px solid rgba(243,237,226,0.3)",
            }}
          >
            {e.seccion}
          </div>
        );
      })}
    </div>
  );
};
