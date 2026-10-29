"""Rastreo para efectos «de TikTok»: te recorta del fondo y sigue tus manos, cuadro a cuadro.

Uso:  pip install mediapipe opencv-python
      python scripts/rastrear.py public/footage/IMG_1234.mp4   (o sin argumentos: todas las tomas)

Genera, por cada toma:
  public/footage/<toma>_persona.webm  → tú recortado con transparencia (para poner gráficos DETRÁS de ti)
  public/footage/<toma>_manos.json    → posición de muñecas, palmas e índices por cuadro (para que
                                        las cosas salgan de tu mano o sigan tus dedos)
Los modelos (MediaPipe, Google) se descargan solos la primera vez en scripts/modelos/.
"""
import json, pathlib, subprocess, sys, urllib.request
import cv2, numpy as np, mediapipe as mp
from mediapipe.tasks.python import vision, BaseOptions

MODELOS = {
    "segmento": "https://storage.googleapis.com/mediapipe-models/image_segmenter/selfie_multiclass_256x256/float32/latest/selfie_multiclass_256x256.tflite",
    "manos": "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/latest/hand_landmarker.task",
    "pose": "https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_full/float16/latest/pose_landmarker_full.task",
}
DIR = pathlib.Path(__file__).parent / "modelos"


def modelo(nombre):
    DIR.mkdir(exist_ok=True)
    f = DIR / pathlib.Path(MODELOS[nombre]).name
    if not f.exists():
        print(f"Descargando modelo {nombre}…")
        urllib.request.urlretrieve(MODELOS[nombre], f)
    return str(f)


def suavizar(prev, nuevo, a=0.55):
    if prev is None or nuevo is None:
        return nuevo
    return [round(a * n + (1 - a) * p, 4) for p, n in zip(prev, nuevo)]


def procesar(ruta: pathlib.Path):
    cap = cv2.VideoCapture(str(ruta))
    fps = cap.get(cv2.CAP_PROP_FPS) or 30
    W, H = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    modo = vision.RunningMode.VIDEO
    seg = vision.ImageSegmenter.create_from_options(vision.ImageSegmenterOptions(base_options=BaseOptions(model_asset_path=modelo("segmento")), running_mode=modo, output_confidence_masks=True))
    manos = vision.HandLandmarker.create_from_options(vision.HandLandmarkerOptions(base_options=BaseOptions(model_asset_path=modelo("manos")), running_mode=modo, num_hands=2, min_hand_detection_confidence=0.4))
    pose = vision.PoseLandmarker.create_from_options(vision.PoseLandmarkerOptions(base_options=BaseOptions(model_asset_path=modelo("pose")), running_mode=modo))

    salida = ruta.with_name(ruta.stem + "_persona.webm")
    ff = subprocess.Popen(["ffmpeg", "-y", "-v", "error", "-f", "rawvideo", "-pix_fmt", "rgba", "-s", f"{W}x{H}", "-r", str(fps), "-i", "-",
                           "-c:v", "libvpx-vp9", "-pix_fmt", "yuva420p", "-b:v", "6M", "-auto-alt-ref", "0", str(salida)], stdin=subprocess.PIPE)
    cuadros, previo, mascara_prev = [], {}, None
    i = 0
    while True:
        ok, bgr = cap.read()
        if not ok:
            break
        rgb = cv2.cvtColor(bgr, cv2.COLOR_BGR2RGB)
        img = mp.Image(image_format=mp.ImageFormat.SRGB, data=np.ascontiguousarray(rgb))
        t = int(i * 1000 / fps)
        # 1) recorte de persona (1 − fondo), bordes suaves y estables entre cuadros
        fondo = seg.segment_for_video(img, t).confidence_masks[0].numpy_view()
        m = 1.0 - fondo.reshape(fondo.shape[0], fondo.shape[1])
        m = cv2.resize(m, (W, H), interpolation=cv2.INTER_LINEAR)
        m = cv2.GaussianBlur(m, (0, 0), 2.0)
        if mascara_prev is not None:
            m = 0.65 * m + 0.35 * mascara_prev
        mascara_prev = m
        alfa = np.clip((m - 0.35) / 0.3, 0, 1)
        ff.stdin.write(np.dstack([rgb, (alfa * 255).astype(np.uint8)]).tobytes())
        # 2) manos y muñecas (coordenadas normalizadas 0–1)
        dato = {"f": i}
        hm = manos.detect_for_video(img, t)
        for lm, lado in zip(hm.hand_landmarks, hm.handedness):
            nombre = "der" if lado[0].category_name == "Left" else "izq"  # imagen sin espejo: la mano «Left» es tu derecha
            palma = [round(np.mean([lm[k].x for k in (0, 5, 9, 13, 17)]), 4), round(np.mean([lm[k].y for k in (0, 5, 9, 13, 17)]), 4)]
            dato[f"palma_{nombre}"] = suavizar(previo.get(f"palma_{nombre}"), palma)
            dato[f"indice_{nombre}"] = suavizar(previo.get(f"indice_{nombre}"), [round(lm[8].x, 4), round(lm[8].y, 4)])
            dedos = sum(1 for tip, pip in ((8, 6), (12, 10), (16, 14), (20, 18)) if lm[tip].y < lm[pip].y)
            dato[f"dedos_{nombre}"] = dedos
        pm = pose.detect_for_video(img, t)
        if pm.pose_landmarks:
            p = pm.pose_landmarks[0]
            dato["cabeza"] = [round(p[0].x, 4), round(p[0].y, 4)]
            dato["hombros"] = [round((p[11].x + p[12].x) / 2, 4), round((p[11].y + p[12].y) / 2, 4)]
        previo.update({k: v for k, v in dato.items() if isinstance(v, list)})
        cuadros.append(dato)
        i += 1
    ff.stdin.close()
    ff.wait()
    (ruta.with_name(ruta.stem + "_manos.json")).write_text(json.dumps({"fps": fps, "ancho": W, "alto": H, "cuadros": cuadros}))
    con_mano = sum(1 for c in cuadros if any(k.startswith("palma") for k in c))
    print(f"{ruta.name}: {i} cuadros · manos visibles en {100 * con_mano / max(i, 1):.0f} % · {salida.name}")


if __name__ == "__main__":
    rutas = [pathlib.Path(a) for a in sys.argv[1:]] or sorted(p for p in pathlib.Path("public/footage").glob("*.mp4") if not p.stem.startswith("BROLL"))
    for r in rutas:
        procesar(r)
