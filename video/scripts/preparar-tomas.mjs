// Convierte las tomas del iPhone (HEVC/HDR/VFR) a H.264 SDR 1080p 30 fps constantes.
// Uso: node scripts/preparar-tomas.mjs  (lee footage/raw/*, escribe public/footage/*.mp4)
import { execFileSync } from "node:child_process";
import { mkdirSync, readdirSync } from "node:fs";
import path from "node:path";

const ORIGEN = "footage/raw";
const DESTINO = "public/footage";
mkdirSync(DESTINO, { recursive: true });

const probe = (f) =>
  JSON.parse(execFileSync("ffprobe", ["-v", "error", "-select_streams", "v:0", "-show_entries", "stream=color_transfer,width,height", "-of", "json", f]).toString()).streams[0];

for (const archivo of readdirSync(ORIGEN).filter((f) => /\.(mov|mp4|m4v)$/i.test(f))) {
  const entrada = path.join(ORIGEN, archivo);
  const salida = path.join(DESTINO, archivo.replace(/\.[^.]+$/, ".mp4").replace(/\s+/g, "_"));
  const v = probe(entrada);
  const hdr = ["arib-std-b67", "smpte2084"].includes(v.color_transfer);
  const filtros = [
    hdr ? "zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,tonemap=hable:desat=0,zscale=t=bt709:m=bt709:r=tv,format=yuv420p" : null,
    "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2",
    "fps=30",
  ].filter(Boolean).join(",");
  console.log(`${archivo} → ${salida}${hdr ? " (HDR → SDR)" : ""}`);
  execFileSync("ffmpeg", ["-y", "-v", "error", "-stats", "-i", entrada, "-vf", filtros, "-c:v", "libx264", "-preset", "medium", "-crf", "16", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "256k", "-ar", "48000", "-movflags", "+faststart", salida], { stdio: "inherit" });
}
