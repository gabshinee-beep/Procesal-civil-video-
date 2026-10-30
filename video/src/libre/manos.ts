import { useEffect, useState } from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { tomaDe } from "../components/Camara";

// Datos de rastreo de manos (scripts/rastrear.py). Si no existen, los efectos usan posiciones fijas.
type Cuadro = { f: number; [k: string]: number[] | number | undefined };
type Datos = { fps: number; cuadros: Cuadro[] };

export const useManos = (escenaId: string) => {
  const toma = tomaDe(escenaId) as { manos?: string; desde: number } | null;
  const [datos, setDatos] = useState<Datos | null>(null);
  const [handle] = useState(() => (toma?.manos ? delayRender(`manos ${escenaId}`) : null));
  useEffect(() => {
    if (!toma?.manos || handle === null) return;
    fetch(staticFile(toma.manos))
      .then((r) => r.json())
      .then((d) => {
        setDatos(d);
        continueRender(handle);
      })
      .catch(() => continueRender(handle));
  }, [toma?.manos, handle]);

  // Palmas visibles en el cuadro `frame` de la escena, ordenadas de izquierda a derecha de la pantalla (px).
  return (frame: number): [number, number][] => {
    if (!datos || !toma) return [];
    const i = Math.round(toma.desde * datos.fps) + frame;
    // promedio de 5 cuadros para que nada tiemble
    const acum: Record<string, [number, number, number]> = {};
    for (let k = i - 4; k <= i; k++) {
      const c = datos.cuadros[k];
      if (!c) continue;
      for (const lado of ["palma_izq", "palma_der"]) {
        const v = c[lado] as number[] | undefined;
        if (!v) continue;
        const a = (acum[lado] ??= [0, 0, 0]);
        a[0] += v[0];
        a[1] += v[1];
        a[2] += 1;
      }
    }
    return Object.values(acum)
      .filter((a) => a[2] >= 3)
      .map((a) => [(a[0] / a[2]) * 1920, (a[1] / a[2]) * 1080] as [number, number])
      .sort((p, q) => p[0] - q[0]);
  };
};
