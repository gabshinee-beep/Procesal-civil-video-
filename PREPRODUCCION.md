# Microdocumental: Nulidad procesal (Arrarte), plan de preproducción

> Proyecto: video individual de máximo 3:00 para Derecho Procesal Civil II (Universidad de Lima)
> Entrega: **viernes 30/10/2026, 23:59 (hora de Perú)**, a halonzo@ulima.edu.pe y rgayoso@ulima.edu.pe
> Fecha de este plan: **jueves 29/10/2026**. Quedan unas 40 horas reales.

---

## 0. Tres alertas antes de empezar

1. **El plazo es mañana.** El plan tiene que caber en unas 14 a 16 horas de trabajo efectivo. Por eso todo lo que sigue está pensado para producirse en paralelo y con un video de respaldo asegurado desde el jueves en la noche.
2. **No uses teleprompter con el texto completo.** El profesor exige que la exposición "no debe ser leída", y leer un teleprompter es leer: se nota en la mirada y en la entonación. La solución es grabar por bloques (*beats*) de 15 a 30 segundos, guiándote solo con 3 o 4 palabras clave por bloque. Los cortes entre bloques se disimulan con *punch-ins* (acercamientos de cámara) y gráficos.
3. **Pasarse de 3:00 equivale a no presentar.** La meta es una duración total de **2:45 a 2:50**, con la tarjeta final incluida. El script de render comprobará la duración y fallará si supera 2:55.

---

## A. Comparación técnica de herramientas

| Criterio | **Remotion + Agent Skills** | **DaVinci Resolve 21.1 (gratis)** | **FFmpeg** | **Motion Canvas / Revideo** | **HyperFrames (HeyGen)** |
|---|---|---|---|---|---|
| 1. Calidad visual | ★★★★★ (React/CSS, tipografía editorial) | ★★★★★ (si se hace a mano) | ★★ | ★★★★ (vectorial) | ★★★★ |
| 2. Editar grabación real del presentador | ★★★★ (`<OffthreadVideo>`, recortes por código) | ★★★★★ | ★★★ (cortes por timecode) | ★★ | ★★★ |
| 3. Motion graphics precisos | ★★★★★ | ★★★ (Fusion, curva de aprendizaje alta) | ★ | ★★★★★ | ★★★★ |
| 4. Sincronía gráficos ↔ voz | ★★★★★ (timestamps de Whisper → frames) | ★★★ (a mano) | ★★ | ★★★ | ★★★★ |
| 5. Revisar y modificar escenas | ★★★★★ (Claude edita código, Studio recarga en vivo) | ★★★ (manual) | ★★★ | ★★★★ | ★★★★ |
| 6. Subtítulos / audio / transiciones | ★★★★ (`@remotion/captions`, `@remotion/transitions`; audio básico) | ★★★★★ (Fairlight) | ★★★★ en audio (`loudnorm`, `afftdn`) | ★★ | ★★★ |
| 7. Tiempo de implementación | ★★★★ (lo escribe Claude Code) | ★★ (si no lo dominas) | ★★★★★ | ★★ | ★★★ |
| 8. Windows + i7-14700KF | ✅ (render por CPU, aprovecha los 28 hilos) | ✅ | ✅ | ✅ | ✅ (menos probado) |
| 9. Riesgo de errores de render | Medio-bajo | Bajo | Bajo | Medio | Medio (proyecto joven, v0.x) |
| 10. Viable antes del viernes | **Alta** | Media | Alta (como herramienta auxiliar) | Baja | Media |

### Hallazgos clave (verificados)

- **Remotion** tiene *Agent Skills* oficiales para Claude Code: `npx skills add remotion-dev/skills` o `npx remotion skills add`. Los subtítulos con marcas de tiempo por palabra salen de `@remotion/install-whisper-cpp` (`transcribe()` + `convertToCaptions()`) y se agrupan con `createTikTokStyleCaptions()` de `@remotion/captions`. La licencia es gratuita para personas naturales. Los renders son SDR: si el video de entrada es HDR, `<OffthreadVideo>` hace *tone-mapping* automático, pero conviene grabar en SDR desde el iPhone.
- **DaVinci Resolve 21.1** (septiembre de 2026) trae un **servidor MCP nativo** para asistentes como Claude Code, pero según el manual y la prensa especializada funciona en **Studio**, y el *scripting* en Python **pasó a ser exclusivo de Studio**. En la versión gratuita, la edición es 100 % manual. Comprar Studio (≈ US$ 295) para este trabajo no compensa.
- **Motion Canvas** es excelente para animaciones vectoriales tipo 3Blue1Brown, pero no está pensado para editar un *talking head*, y su mantenimiento no está claro (Revideo es un *fork*). Aprenderlo en 40 horas no es viable.
- **HyperFrames** (HeyGen, Apache 2.0) convierte HTML en MP4 y está diseñado para agentes. Es prometedor, pero sigue en v0.x, tiene menos documentación y menos casos probados que Remotion. No vale la pena el riesgo con plazo de 40 horas.
- **FFmpeg** no compite con las demás: es la navaja suiza que rodea al pipeline. Sirve para transcodificar el material del iPhone, normalizar el volumen, comprobar la duración y comprimir.

### Decisión técnica

**Remotion como compositor único + FFmpeg (antes y después) + Whisper (marcas de tiempo).**
- La grabación del presentador, los gráficos, los subtítulos y los efectos de sonido viven en un solo proyecto de código, versionado y que Claude Code puede modificar.
- DaVinci Resolve gratuito queda solo como **plan de emergencia manual** y únicamente si ya lo dominas.
- Todo se combina en una sola herramienta porque así no hay *round-trips* (exportar con alpha e importar) entre programas: cada traspaso es un punto de falla más.

---

## B. Tres conceptos creativos

### Concepto 1: «Los cuatro filtros» ⭐ (recomendado)

- **Concepto narrativo.** Un mismo vicio (un emplazamiento mal hecho) pasa **dos veces** por la misma "máquina" de cuatro filtros: especificidad, convalidación, trascendencia y protección. En el caso 1, el demandado se entera y contesta, así que el vicio se detiene en el filtro 2 (convalidado). En el caso 2, nunca se enteró, así que pasa los cuatro filtros, el juez declara la nulidad y caen en dominó solo los actos dependientes (art. 173).
- **Estética.** "Expediente editorial": papel marfil, tinta negra, rojo de sello (NULO) y verde o azul tinta (CONVALIDADO). Serif editorial para títulos, grotesca para el texto y monoespaciada para "Art. 171 CPC".
- **Papel del presentador.** Guía que "abre el expediente". Aparece a pantalla completa en el gancho y el cierre, y en formato dividido (tarjeta a la izquierda, diagrama a la derecha) durante el análisis.
- **Recursos de edición.** Filtros que se iluminan al nombrarlos, sello animado con efecto de sonido, fichas de norma y de autor, rastreador de progreso (●●○○), *punch-ins* y subtítulos discretos.
- **Cómo ayuda a entender.** Convierte los principios en un **algoritmo de decisión**, que es justo lo que Arrarte sostiene: los principios "no pueden aplicarse de manera aislada, pues se trata de pautas concatenadas". La variación controlada (mismo vicio, distinto resultado) demuestra la tesis central: **la forma es garantía, no fin**.
- **Dificultad.** Media.
- **Riesgos.** Alta densidad de palabras; el diagrama podría competir con la voz.
- **Qué la haría memorable.** El momento en que el sello "NULO" se convierte en "CONVALIDADO".

### Concepto 2: «Rebobinar»

- **Concepto narrativo.** El proceso es una línea de tiempo luminosa (demanda → emplazamiento → contestación → audiencia → sentencia). Anular equivale a **rebobinar**, y eso tiene un costo: como dice Monroy, la nulidad "implica un retroceso en el *iter* procesal". Los principios son **frenos** que impiden rebobinar sin necesidad, y el art. 173 se ve como fichas de dominó que caen solo hacia adelante.
- **Estética.** Oscura y cinematográfica, al estilo de un *keynote* o de Vox.
- **Papel del presentador.** Narrador frente a la línea de tiempo.
- **Dificultad.** Media-alta.
- **Fortaleza.** Muestra mejor que nada el costo de la nulidad y su extensión (art. 173).
- **Debilidad.** Los cuatro principios quedan menos claros como lista de verificación.
- **Qué la haría memorable.** El rebobinado visual con su sonido.

### Concepto 3: «Abogado del diablo»

- **Concepto narrativo.** Tú interpretas dos papeles: el litigante que quiere anularlo todo (el "uso malicioso e indiscriminado" que critica Arrarte en su introducción) y el juez que le aplica cada principio. Se graba como pantalla dividida o plano y contraplano.
- **Estética.** Drama judicial / *talk show*.
- **Dificultad.** Alta en la grabación (dos vestuarios, miradas, actuación); baja en gráficos.
- **Riesgos.** Que parezca más teatro que contenido, el doble de tiempo de grabación y la credibilidad actoral.
- **Qué la haría memorable.** El humor y la dialéctica.

### Recomendación

**Concepto 1 como columna vertebral + dos piezas del Concepto 2** (la línea de tiempo en el gancho y el dominó del art. 173). Opcionalmente, una mini-cita del Concepto 3: en el gancho, tú mismo dices "¡Todo es nulo!" con un encuadre distinto y tinte rojo, como si fueras la otra parte (4 segundos y barato de grabar).

---

## C. Por qué esta dirección (crítica a la propuesta inicial)

1. **El título es bueno, pero se puede afinar.** «¿Un error puede anular un juicio?» funciona. **«¿Basta un error para anular un juicio?»** es mejor, porque "basta" apunta a la tesis (la suficiencia) y la respuesta final cierra el círculo: *"Solo si ese error dejó a alguien sin defensa."*
2. **Los 18 escalones no se explican: se dramatizan.** En 3 minutos caben unas 400 palabras. La escalera sigue presente como lógica interna, pero el espectador la recorre a través de **un caso**, no de una lista.
3. **Precisión conceptual (esto suma puntos con un profesor de procesal).** En tu escalera, los puntos 10 a 17 aparecen todos como "principios". En Arrarte son **4 principios** (especificidad, convalidación, trascendencia y protección) y **4 características** (excepcional, interpretación restringida, aplicación restringida y validez provisional). Además, Arrarte advierte que el Código no los llama así: la especificidad está en el **art. 171** como "principio de legalidad", la trascendencia aparece en el **174** como "interés para pedir la nulidad" y la protección figura en el **175.1** como causal de improcedencia. Decir esto en una frase demuestra dominio.
4. **"Interactuar con los conceptos" sí, pero en versión simple.** Basta con un gesto hacia el lado del panel y gráficos que aparecen en ese lado. Nada de *tracking* de manos: son horas de trabajo con alto riesgo.
5. **Una sola gramática de transiciones.** Muchas transiciones cinematográficas distintas suenan a plantilla; un solo lenguaje consistente suena a dirección.

---

## Beat sheet (guion por bloques; no es para leer)

Velocidad estimada: unas 150 palabras por minuto. La duración real se valida en el ensayo.

| # | Tiempo | Bloque | Ideas clave (tarjeta) | Visual |
|---|---|---|---|---|
| 0 | 0:00–0:14 | **Gancho** | 2 años · sentencia a favor · "la notificación estaba mal: todo es nulo" · ¿basta un error? | Línea de tiempo que se construye; grieta roja en "emplazamiento"; empieza a rebobinar. |
| 1 | 0:14–0:17 | Título | — | «¿Basta un error para anular un juicio?» · tu nombre |
| 2 | 0:17–0:38 | **Qué es** | medio impugnatorio · acto o todo el proceso · recurso si está en resolución / remedio si no (art. 356) · vicio extrínseco (forma) vs. intrínseco (capacidad, objeto, finalidad; Berizonce) | Ficha "acto procesal" con sus 4 elementos; la forma se resalta "por fuera". |
| 3 | 0:38–0:58 | **El problema** | anular = retroceder (Monroy) · formas = garantías, no fines (Calamandrei) · Couture: "no para satisfacer pruritos formales, sino enmendar perjuicios efectivos" · la ley pone 4 filtros | Cita de Couture en tipografía editorial; aparecen los 4 filtros. |
| 4 | 0:58–1:30 | **Caso 1** | notificaron a apoderado sin facultades · F1 especificidad: sí, art. 437 + 171 · F2 convalidación: se apersonó y contestó → cumplió su finalidad (art. 172) | El vicio avanza, se detiene en F2 y recibe el sello verde **CONVALIDADO**. |
| 5 | 1:30–2:15 | **Caso 2** | mismo vicio, pero nunca se enteró · F2: pide en su primera oportunidad, no hay convalidación · F3 trascendencia: no hay nulidad sin agravio, debe precisar la defensa perdida (art. 174) · F4 protección: no causó el vicio (art. 175.1) · el acto vale hasta que el juez declare · art. 173: caen solo los actos dependientes | Pasa los 4 filtros, sello rojo **NULO** y dominó: cae desde el emplazamiento hacia adelante y la demanda queda en pie. |
| 6 | 2:15–2:40 | **Cierre** | excepcional · en duda, el proceso continúa · "¿Basta un error? Solo si dejó a alguien sin defensa" · Couture: "la anulación por la anulación no vale" | Vuelta a pantalla completa; la línea de tiempo del gancho se restaura. |
| 7 | 2:40–2:46 | Tarjeta final | Arrarte, *Ius et Veritas* n.° 11 · CPC arts. 171–176, 437 | Fuentes · nombre · curso |

**Normas que se citan (verificar en SPIJ antes de grabar):** 171 (legalidad/finalidad), 172 (convalidación, subsanación, integración), 173 (extensión), 174 (interés), 175.1 (protección), 176 (oportunidad), 436–437 (emplazamiento al apoderado y su nulidad; el 437 dice expresamente que no hay nulidad si el emplazado comparece y no la formula en el plazo).

---

## D. Flujo de trabajo: del guion al MP4

```
1. Beat sheet → 3 ensayos cronometrados (en voz alta, sin texto)
2. Prueba técnica de 30 s (luz + audio) → revisar en audífonos
3. Grabación por bloques (2–3 tomas por bloque) + 10 s de silencio ambiente
4. Ingesta en la PC (cable USB-C) → carpeta footage/raw
5. FFmpeg: transcodificar a H.264 SDR 30 fps CFR (proxies) + extraer WAV
6. Whisper (es, large-v3, GPU) → transcripción con marcas por palabra → elegir la mejor toma por bloque → edl.json
7. Audio: limpieza suave (afftdn / arnndn) + loudnorm a −16 LUFS / −1.5 dBTP
8. Remotion: composición 1920×1080 a 30 fps
     ├─ escenas por bloque (Sequence) con su layout: full / split / gráfico
     ├─ componentes: Filtro, Sello, FichaNorma, CitaAutor, LíneaDeTiempo, Dominó, Subtítulos
     └─ cues.ts: gráficos anclados a palabras ("filtro dos" → frame N)
9. Revisión en Remotion Studio → render de borrador en 720p → verlo en el celular
10. Pase jurídico (artículos, autores, términos) + pase de duración
11. Render final: H.264 CRF 18, AAC 192k → ffprobe (duración < 2:55) + ebur128
12. Subir a Drive ("Cualquier persona con el enlace") → probar en incógnito → enviar el correo
```

**División del trabajo.** Mientras tú grabas, Claude construye el proyecto Remotion (sistema de diseño y componentes) en este repositorio con audio provisional. Luego lo clonas en tu PC, colocas tu material y haces el render local. Así la grabación y la animación avanzan en paralelo.

**Configuración del iPhone 17 Pro**
- Cámara trasera principal (1× o 2×), **4K a 30 fps**, horizontal y en trípode a la altura de los ojos.
- **Ajustes → Cámara → Grabar video → Video HDR: DESACTIVADO** (evita colores lavados).
- **Formatos → "Más compatible"** (H.264).
- Bloqueo de exposición y enfoque (AE/AF Lock).
- Luz de ventana de frente o en diagonal. **El sol se pone cerca de las 17:50 en Lima**, así que hay que grabar antes de las 17:00 o usar lámparas.
- Encuadre: tú en el tercio izquierdo, con aire a la derecha para los gráficos. Al grabar en 4K y entregar en 1080p, los *punch-ins* no pierden calidad.
- **Audio** (por orden de preferencia): micrófono de solapa USB-C, luego AirPods compatibles con la grabación de "calidad de estudio" de iOS 26 y, por último, el iPhone a menos de un metro en un cuarto con cortinas y cama. Apaga el ventilador y la refrigeradora cercana.

---

## E. Calendario (jueves 29 → viernes 30)

| Cuándo | Tú | Claude |
|---|---|---|
| **Jue, ahora → 13:00** | Aprobar el plan y responder la sección H · verificar artículos en SPIJ · hacer las tarjetas de palabras clave · 3 ensayos con cronómetro | Estructura del proyecto Remotion, sistema de diseño y componentes (filtros, sello, fichas, línea de tiempo, dominó) |
| **Jue 13:00–17:00** | Montar el set · prueba de 30 s · **grabar todos los bloques** (2–3 tomas) · 10 s de silencio ambiente | Animación de los bloques 2–6 con la duración estimada |
| **Jue 18:00–21:00** | Pasar los videos a la PC · instalar Node, FFmpeg y Git · clonar el repositorio | Scripts de FFmpeg y Whisper · selección de tomas · **video de respaldo** (tus tomas cortadas + subtítulos) |
| **Jue 21:00–00:30** | Correr el pipeline y renderizar el **primer corte completo** | Ajustar los cues a tus marcas de tiempo reales |
| **Vie 09:00–13:00** | Revisión crítica (celular + audífonos) · pase jurídico | Correcciones, pulido, efectos de sonido, color |
| **Vie 13:00–16:00** | Render final · control de calidad · subir a Drive | Lista de verificación (duración, volumen, enlace) |
| **Vie ≤ 18:00** | **ENVIAR** · guardar captura del correo enviado | — |
| Vie 18:00–23:59 | Margen de seguridad de 6 h (no se usa salvo emergencia) | — |

**Regla dura:** si a las **16:00 del viernes** la versión completa no pasó el control de calidad, se envía la mejor versión que exista. El video de respaldo del jueves en la noche garantiza que siempre haya algo presentable.

---

## F. Riesgos y prevención

| Riesgo | Prob. | Impacto | Prevención |
|---|---|---|---|
| Duración > 3:00 | Media | **Fatal** | Meta de 2:45 · aserción en el script de render · `ffprobe` antes de subir |
| "Parece leído" | Media | Alto | Sin teleprompter · grabar por bloques · solo palabras clave |
| Audio deficiente | Media | Alto | Micrófono cercano · prueba de 30 s · `loudnorm` · subtítulos como respaldo |
| HEVC/HDR del iPhone da problemas | Media | Medio | HDR apagado + "Más compatible" · transcodificar con FFmpeg igual |
| Falla del render de Remotion en Windows | Baja-media | Alto | Render de borrador el jueves · Node LTS · rutas sin tildes ni espacios · video de respaldo |
| Error jurídico (artículo mal citado) | Baja-media | **Alto** | Verificar en SPIJ · pase jurídico el viernes · citar solo lo que está en Arrarte + CPC |
| Correo y enlace (permisos de Drive, peso, hora) | Media | **Fatal** | Enlace "Cualquier persona con el enlace" probado en incógnito · enviar antes de las 18:00 · enlace de respaldo (YouTube no listado) · enviar desde la cuenta @ulima |
| Gráficos que tapan el contenido | Media | Alto | Regla: cada animación corresponde a una frase; si no, se elimina |
| Música con derechos | Baja | Medio | Sin música o pista libre a −28 LUFS · solo efectos de sonido propios o libres |
| Cansancio / falta de tiempo | Alta | Medio | Paralelizar · cortar el bloque 2 (recurso/remedio) si hace falta tiempo |

---

## G. Cinco mejoras de alto impacto

1. **Variación controlada.** El mismo vicio pasa dos veces por los mismos filtros con resultados opuestos. Es la técnica más potente para enseñar una regla: el profesor ve que entiendes el *porqué*, no solo el *qué*.
2. **Estructura circular.** La pregunta del título se responde con la última frase y la línea de tiempo dañada del gancho se restaura al final. Da sensación de obra cerrada.
3. **Código de color + rastreador de progreso.** Rojo = vicio/nulo, verde = convalidado, ámbar = filtro en evaluación, y un indicador ●●○○ persistente. El espectador siempre sabe en qué parte del razonamiento está.
4. **Rigor visible.** Fichas breves con *autor + obra* y *artículo + sumilla*, más la frase sobre cómo los llama el Código (legalidad 171, interés 174, improcedencia 175.1). Responde directamente al criterio "referencia a autores, las normas, o dar ejemplos".
5. **El audio primero.** Micrófono cercano, normalización a −16 LUFS, silencio ambiente para las transiciones y subtítulos limpios (corregidos a mano: *Arrarte, Couture, pas de nullité sans grief*). El correo del profesor menciona el audio de forma explícita.

**Extra:** cerrar con un **"resumen en una imagen"** de 3 segundos (los 4 filtros + el art. 173) que el profesor pueda pausar.

---

## H. Información necesaria antes de empezar

1. **Disponibilidad real** hoy y mañana (clases, trabajo). ¿Puedes grabar hoy antes de las 17:00?
2. **Audio:** ¿tienes micrófono de solapa? ¿Qué modelo de AirPods? ¿Tienes trípode?
3. **Lugar de grabación:** ¿cuarto con ventana? ¿Qué se ve detrás de ti?
4. **PC:** ¿tienes Node, Git y FFmpeg instalados? ¿Cuál es tu GPU exacta? ¿Has usado Remotion o DaVinci alguna vez?
5. **Requisitos formales:** ¿el profesor pidió nombre, código o sección en el video? ¿Algún formato de cita?
6. **Dirección creativa:** ¿apruebas «Los cuatro filtros» + los elementos de «Rebobinar»? ¿Tono sobrio o con un toque de humor (el cameo de "¡todo es nulo!")?
7. **Título:** ¿«¿Basta un error para anular un juicio?» o mantienes el original?
8. **Repositorio:** ¿autorizas a Claude a crear el proyecto Remotion en este repo y hacer *push* para que lo clones?

---

## Fuentes

- Remotion: Agent Skills: https://www.remotion.dev/docs/ai/skills
- Remotion: CLI `skills`: https://www.remotion.dev/docs/cli/skills
- Remotion: Whisper.cpp → captions: https://remotion.dev/docs/install-whisper-cpp/convert-to-captions
- Remotion: formatos de video: https://www.remotion.dev/docs/miscellaneous/video-formats
- Remotion: HDR: https://www.remotion.dev/docs/hdr
- Remotion: licencia: https://remotion.dev/license
- Remotion: edición visual en Studio: https://cloudrun.remotion.dev/docs/visual-editing
- DaVinci Resolve 21 (notas oficiales): https://www.blackmagicdesign.com/support/content/readme/baf7c071c0524fbf8ccc961925c9f443
- Resolve 21.1, MCP: https://www.cgchannel.com/2026/09/blackmagic-design-releases-resolve-21-1/
- Resolve 21.1, Python pasa a Studio: https://www.pugetsystems.com/blog/2026/09/10/how-davinci-resolve-free-v21-1-scripting-changes-affect-puget-bench/
- Motion Canvas: https://github.com/motion-canvas/motion-canvas
- Revideo: https://docs.re.video/
- HyperFrames: https://themenonlab.blog/blog/heygen-hyperframes-video-as-code
- iOS 26 y AirPods (grabación de estudio): https://www.macrumors.com/2025/08/08/ios-26-7-new-airpods-features/
- CPC art. 172: https://lpderecho.pe/articulo-172-codigo-procesal-civil-principios-convalidacion-subsanacion-o-integracion/
- CPC art. 174: https://lpderecho.pe/articulo-174-codigo-procesal-civil-interes-para-pedir-nulidad/
- CPC art. 175: https://lpderecho.pe/articulo-175-del-codigo-procesal-civil-inadmisibilidad-o-improcedencia-del-pedido-de-nulidad/
- CPC art. 176: https://lpderecho.pe/articulo-176-codigo-procesal-civil-oportunidad-tramite-oficio/
- CPC art. 436: https://lpderecho.pe/articulo-436-codigo-procesal-civil-emplazamiento-apoderado/
- CPC art. 437: https://lpderecho.pe/jurisprudencia-articulo-437-del-codigo-procesal-civil-nulidad-emplazamiento-defectuoso/
- Texto oficial (para verificar): SPIJ, https://spij.minjus.gob.pe
