"""Transcribe las tomas con marcas de tiempo por palabra (faster-whisper).

Uso:  pip install faster-whisper
      python scripts/transcribir.py            (todas las tomas de public/footage)
Salida: transcripciones/<toma>.json  y un resumen legible por consola para elegir tomas.
Usa la GPU NVIDIA si CUDA está disponible; si no, CPU (más lento, pero funciona).
"""
import json, pathlib, sys
from faster_whisper import WhisperModel

MODELO = "large-v3"
CARPETA = pathlib.Path("public/footage")
SALIDA = pathlib.Path("transcripciones")
SALIDA.mkdir(exist_ok=True)
# Vocabulario que Whisper suele escribir mal
PISTA = "Nulidad procesal. Ana María Arrarte. Couture, Calamandrei, Berizonce, Monroy. Emplazamiento, apoderado, convalidación, trascendencia, especificidad. Código Procesal Civil."

try:
    modelo = WhisperModel(MODELO, device="cuda", compute_type="float16")
except Exception as e:  # sin CUDA
    print(f"CUDA no disponible ({e.__class__.__name__}); usando CPU.", file=sys.stderr)
    modelo = WhisperModel(MODELO, device="cpu", compute_type="int8")

archivos = [pathlib.Path(a) for a in sys.argv[1:]] or sorted(CARPETA.glob("*.mp4"))
for a in archivos:
    segmentos, _ = modelo.transcribe(str(a), language="es", word_timestamps=True, initial_prompt=PISTA, vad_filter=True)
    palabras = [{"w": w.word.strip(), "s": round(w.start, 3), "e": round(w.end, 3)} for s in segmentos for w in s.words]
    (SALIDA / f"{a.stem}.json").write_text(json.dumps({"archivo": f"footage/{a.name}", "palabras": palabras}, ensure_ascii=False, indent=1), encoding="utf-8")
    print(f"\n=== {a.name} ===")
    linea, inicio = [], None
    for p in palabras:
        inicio = p["s"] if inicio is None else inicio
        linea.append(p["w"])
        if p["w"].endswith((".", "?", "!")):
            print(f"[{inicio:7.2f}] {' '.join(linea)}")
            linea, inicio = [], None
    if linea:
        print(f"[{inicio:7.2f}] {' '.join(linea)}")
