# Video · Nulidad procesal (Remotion)

Un solo proyecto produce tres versiones a partir de las mismas tomas:

| Versión | Comando | Qué es |
|---|---|---|
| **Final** | `npm run render:final` | Tu toma + animaciones completas + subtítulos |
| **Plan B** | `npm run render:respaldo` | Tu toma + rótulos sobrios + subtítulos (sin animaciones complejas) |
| **Plan C** | `npm run plan-c` | Solo FFmpeg: une tus tomas y quema subtítulos (si Remotion fallara) |

El guion vive en **`src/data/guion.json`**: lo usan la maqueta, los subtítulos y `../GUION.md` (`npm run guion`).

## Instalación en Windows (una vez, unos 10 minutos)

```powershell
winget install OpenJS.NodeJS.LTS Git.Git Gyan.FFmpeg Python.Python.3.12
# cerrar y abrir la terminal
git clone https://github.com/gabshinee-beep/Procesal-civil-video-.git
cd Procesal-civil-video-\video
npm install
pip install faster-whisper
npm run studio        # vista previa en http://localhost:3000
```

Remotion descarga su propio Chrome la primera vez. Las fuentes ya vienen en `public/fonts`.

## Del iPhone al MP4

1. **Grabar** cada escena por separado (2 o 3 tomas), mirando solo la tarjeta de `../GUION.md`.
   El iPhone debe estar en 4K/30, con *Video HDR* desactivado y en horizontal, y tú en el tercio izquierdo del encuadre.
2. **Copiar** los `.MOV` del iPhone a `video/footage/raw/` (por cable USB-C o iCloud).
3. **Preparar** (HEVC/HDR → H.264 SDR 1080p 30 fps): `npm run tomas`
4. **Transcribir**: `python scripts/transcribir.py` (imprime cada toma con sus tiempos).
5. **Elegir tomas**: en `src/data/tomas.json`, indica por escena `archivo`, `desde` y `hasta` en segundos.
   Claude Code puede hacerlo leyendo la transcripción.
6. **B-roll**: en `src/data/broll.json`, pon `"archivo": "footage/BROLL_sobre.mp4"` (etc.) en cada plano.
7. **Tiempos reales**: `npm run tiempos` (avisa si el total supera 2:55).
8. **Revisar**: `npm run studio`
9. **Render**: `npm run render:final` y luego `npm run finalizar`, que normaliza a −16 LUFS, verifica la duración
   y genera `out/FINAL_Nulidad_Procesal.mp4`.

## Utilidades

- `node scripts/sfx.mjs`: regenera los efectos de sonido sintetizados (`public/sfx/`). Puedes reemplazar cualquiera por uno real con el mismo nombre.
- `src/data/audio.json`: volumen de los efectos y música opcional (libre de derechos, a volumen bajo).

- `npm run voz`: regenera la voz provisional robótica que solo sirve para medir tiempos.
- `node scripts/stills.mjs 120 900 3200`: fotogramas sueltos para revisar el diseño.
