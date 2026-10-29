import React from "react";
import { useCurrentFrame } from "remotion";
import { C, mono, serif } from "../theme";
import { entra } from "../anim";

// Ficha de norma (mono) o de autor (serif itálica).
export const Ficha: React.FC<{ at: number; texto: string; tipo?: "norma" | "autor"; color?: string; style?: React.CSSProperties }> = ({
  at,
  texto,
  tipo = "norma",
  color = C.tinta,
  style,
}) => {
  const frame = useCurrentFrame();
  const p = entra(frame, at, 14);
  return (
    <span
      style={{
        display: "inline-block",
        padding: tipo === "norma" ? "6px 14px" : "4px 0",
        border: tipo === "norma" ? `2px solid ${color}` : "none",
        borderRadius: 6,
        fontFamily: tipo === "norma" ? mono : serif,
        fontStyle: tipo === "autor" ? "italic" : "normal",
        fontSize: tipo === "norma" ? 22 : 26,
        letterSpacing: tipo === "norma" ? 1 : 0,
        color,
        opacity: p,
        transform: `translateY(${(1 - p) * 10}px)`,
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      {texto}
    </span>
  );
};
