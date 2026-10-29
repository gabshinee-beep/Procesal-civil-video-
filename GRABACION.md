# Plan de grabación · jueves 29/10

> Tú te encargas de explicar; la edición se arma sola alrededor de lo que digas.
> Meta: tener todo grabado **antes de las 18:00 del jueves**.

## 0. Antes de nada
- **Dormir.** Una cara trasnochada se nota más que cualquier efecto.
- Comprar: **micrófono de solapa USB-C con cable de 2 m o más**, **trípode para celular** y **audífonos USB-C**. Para salir de dudas, ver la respuesta del chat.
- Ensayar 3 veces con las **tarjetas** de `GUION.md` (guion v4) y cronometrar. Si pasas de 2:50, recorta en este orden: (1) «como la competencia territorial», (2) «El nuestro es extrínseco», (3) «y puede usarse para dilatarlo», (4) «o de todo el proceso».

## 1. Set (15 min)
- **Luz:** ventana de frente o en diagonal, nunca a tu espalda. Si es de noche, lámpara cálida rebotada en una pared blanca frente a ti.
- **Fondo:** ordenado, con algo de profundidad (estante, libros). Nada de pared blanca pegada a tu espalda.
- **Encuadre:** horizontal, cámara a la altura de los ojos, plano medio (de la cintura o el pecho hacia arriba). **Tú en el tercio izquierdo** del encuadre: el lado derecho queda libre para los gráficos.
- **Ropa:** camisa lisa de color sólido (azul, blanco hueso, gris). Evita rayas finas porque "vibran" en video.
- **Micrófono:** cápsula a unos 20 cm de la boca, cable por dentro de la camisa.
- **Silencio:** apaga ventilador, televisor y aire acondicionado. Pon el celular en modo avión para que no entren llamadas mientras grabas.

## 2. Ajustes del iPhone
- *Ajustes → Cámara → Grabar video:* **4K a 30 fps** · **Video HDR: desactivado**
- *Ajustes → Cámara → Formatos:* **Más compatible**
- En la app Cámara, mantén el dedo sobre tu cara hasta que aparezca **"Bloqueo AE/AF"**.
- Lente principal **1×** (o 2× si te alejas más). Nunca el gran angular 0,5×, que deforma la cara.

## 3. Prueba de 30 segundos (obligatoria)
Graba la Escena 1 y escúchala con los audífonos. Revisa que la voz suene cercana, sin eco ni zumbido, y que no se escuche el roce del micrófono con la ropa.
Opcional: mándame el clip y te confirmo si el audio está aprobado.

## 4. Grabación principal: tú hablando (A-roll)
Graba **escena por escena**, en orden, con **2 o 3 tomas** cada una. Antes de cada toma:
1. Di en voz alta *"escena 3, toma 2"* y da **una palmada** (después se recorta).
2. Mira la tarjeta y respira 2 segundos.
3. Mira al lente (no a la pantalla) y explica. Si te equivocas, **no cortes**: haz una pausa y repite la frase. Yo elijo la buena.

**Guion v4** (8 escenas, ver `GUION.md`). Encuadre único para todas: plano medio, **tú un poco a la izquierda del centro** y con aire sobre la cabeza. Yo te recorto en ventana o círculo según la escena.

| # | Escena | Duración aprox. | Indicación |
|---|---|---|---|
| 1 | Finalidad | 22 s | Abres tú, mirando al lente: "Todo proceso tiene una finalidad…" |
| 2 | El caso | 19 s | Tono de narrador ("Rosa demanda a Mario"); en "¿Prosperaría…?" haz una pausa; el "No" firme |
| 3 | ¿Recurso o remedio? | 14 s | Pausado, didáctico |
| 4 | Elementos y vicios | 17 s | Puedes contar con los dedos: capacidad, objeto, finalidad, forma |
| 5 | La forma como garantía | 22 s | "Y esta es la clave" con énfasis; en "cambiemos un dato", gesto con la mano |
| 6 | Necesidad de límites | 17 s | Contraste: "algunas… otras…" |
| 7 | Los principios | 20 s | Cuenta 1, 2, 3, 4 con los dedos |
| 8 | Consecuencias y cierre | 18 s | Mira al lente; pausa antes de "Solo cuando…" |

**Energía:** un 20 % más de lo que te parece natural. En cámara, lo "normal" se ve apagado.

## 5. Planos de recurso (B-roll), unos 15 minutos
Son los planos que hacen que el video se vea **documental**. Tu voz sigue sonando debajo.

| Archivo | Plano | Cómo |
|---|---|---|
| `BROLL_expediente.MOV` | Pila de papeles o folder sobre la mesa; la cámara avanza lento hacia ellos | Video 4K 30. Detalle de abogado: numera los folios arriba a la derecha (1, 2, 3…), como en un expediente real |
| `BROLL_sobre.MOV` | Un sobre se desliza por debajo de una puerta | **Cámara lenta 4K 120**, celular en el piso. Escribe en el sobre con plumón grueso: **CÉDULA DE NOTIFICACIÓN** |
| `BROLL_lectura.MOV` | Tu lectura de Arrarte impresa y subrayada | Video 4K 30, a unos 15 cm, paneo lento sobre el título y el resaltado |
| `BROLL_sello.MOV` | Mano golpeando un sello de goma sobre una hoja | **Cámara lenta 4K 120**, plano cerrado. Sirve cualquier sello (los venden en Tai Loy); el "NULO" lo pongo yo |

🚫 **Nada de martillo de juez.** En Perú no se usa; es un cliché del cine gringo y un profesor de procesal lo nota.

Graba cada plano 3 o 4 veces, de 5 segundos cada uno.

## 6. Pasar los archivos a la PC
- Cable USB-C → app **Fotos** de Windows → Importar. Así se copian los originales.
- Renombra los B-roll como en la tabla de arriba. Los de tus explicaciones pueden quedar como `IMG_XXXX`.
- Cópialo todo a `video/footage/raw/` y sigue el `video/README.md`, o ábrelo con Claude Code y pídele: *"procesa mis tomas"*.
- Si un clip en cámara lenta **ya se ve lento en la PC**, en `video/src/data/broll.json` cambia `"lento": true` a `false`.
