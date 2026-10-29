import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Fuentes empaquetadas en public/fonts (OFL, Google Fonts): el render no depende de internet.
const fuentes = [
  { family: "Fraunces", url: "fonts/Fraunces-var.woff2", weight: "100 900", style: "normal" },
  { family: "Fraunces", url: "fonts/Fraunces-var-italic.woff2", weight: "100 900", style: "italic" },
  { family: "Inter", url: "fonts/Inter-var.woff2", weight: "100 900", style: "normal" },
  { family: "IBM Plex Mono", url: "fonts/IBMPlexMono-400.woff2", weight: "400", style: "normal" },
  { family: "IBM Plex Mono", url: "fonts/IBMPlexMono-500.woff2", weight: "500", style: "normal" },
];
for (const x of fuentes) loadFont({ ...x, url: staticFile(x.url) });

export const serif = "Fraunces, Georgia, serif";
export const sans = "Inter, Arial, sans-serif";
export const mono = "'IBM Plex Mono', monospace";

// Código de color: rojo = apunta a la nulidad · verde = apunta a la validez · ámbar = en examen
export const C = {
  papel: "#F3EDE2",
  papelOscuro: "#E4D9C6",
  tinta: "#1B1A17",
  tintaSuave: "#5C564C",
  linea: "#CDBFA8",
  rojo: "#B42318",
  verde: "#2F6B3F",
  ambar: "#B7791F",
  azul: "#1F3A5F",
  noche: "#141210",
};

export const FPS = 30;
export const W = 1920;
export const H = 1080;

// Panel de papel a la derecha (el presentador queda en el tercio izquierdo)
export const PANEL = { x: 880, y: 120, w: 980, h: 760 };
