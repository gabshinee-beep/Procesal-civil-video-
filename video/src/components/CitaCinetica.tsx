import React from "react";
import { useCurrentFrame } from "remotion";
import { marcasFragmento } from "../tiempos";
import { entra } from "../anim";

// Cita que aparece palabra a palabra, exactamente cuando la pronuncias.
// `estilo(i, palabra)` permite tachar o resaltar palabras concretas.
export const CitaCinetica: React.FC<{
  escenaId: string;
  texto: string;
  respaldoDesde: number;
  style?: React.CSSProperties;
  estilo?: (i: number, palabra: string) => React.CSSProperties;
}> = ({ escenaId, texto, respaldoDesde, style, estilo }) => {
  const frame = useCurrentFrame();
  const marcas = marcasFragmento(escenaId, texto, respaldoDesde);
  return (
    <div style={style}>
      {texto.split(/\s+/).map((w, i) => {
        const p = entra(frame, marcas[i] - 2, 10);
        return (
          <span key={i} style={{ display: "inline-block", marginRight: "0.26em", opacity: 0.12 + 0.88 * p, transform: `translateY(${(1 - p) * 8}px)`, ...estilo?.(i, w) }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};
