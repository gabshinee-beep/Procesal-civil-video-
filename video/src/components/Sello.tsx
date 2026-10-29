import React from "react";
import { useCurrentFrame } from "remotion";
import { mono } from "../theme";
import { rango, entra } from "../anim";

// Sello de goma: cae desde grande, rebota y queda con textura de tinta.
export const Sello: React.FC<{ at: number; texto: string; color: string; x: number; y: number; giro?: number; tam?: number }> = ({
  at,
  texto,
  color,
  x,
  y,
  giro = -9,
  tam = 64,
}) => {
  const frame = useCurrentFrame();
  if (frame < at) return null;
  const golpe = entra(frame, at, 10);
  const escala = 2.4 - 1.4 * golpe;
  const opacidad = rango(frame, at, at + 4, 0, 0.92);
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: `translate(-50%, -50%) rotate(${giro}deg) scale(${escala})`,
        opacity: opacidad,
        border: `6px solid ${color}`,
        outline: `2px solid ${color}`,
        outlineOffset: 6,
        borderRadius: 10,
        padding: "8px 28px",
        fontFamily: mono,
        fontWeight: 500,
        fontSize: tam,
        letterSpacing: 8,
        color,
        mixBlendMode: "multiply",
        maskImage: "repeating-radial-gradient(circle at 30% 40%, #000 0 3px, rgba(0,0,0,0.78) 3px 5px)",
        WebkitMaskImage: "repeating-radial-gradient(circle at 30% 40%, #000 0 3px, rgba(0,0,0,0.78) 3px 5px)",
      }}
    >
      {texto}
    </div>
  );
};
