# Edición libre: de tu explicación espontánea al video final

Tú explicas libremente. La edición se arma alrededor de **lo que realmente dijiste**: cada animación se engancha a tus palabras, transcritas palabra por palabra.

## Flujo

```
1. Tu toma (1 o varias)            → video/footage/raw/
2. npm run tomas                   → H.264 1080p 30 fps en public/footage/
3. python scripts/transcribir.py   → transcripciones/<toma>.json (palabras con tiempos)
4. Claude lee la transcripción y la divide en SEGMENTOS por idea (peldaños de la escalera):
     src/data/guion.json  → cada segmento: id, modulo, texto (lo que dijiste), cues (palabras ancla)
     src/data/tomas.json  → cada segmento: archivo, desde, hasta (+ persona / manos si hay rastreo)
   Se recortan muletillas, repeticiones y silencios ENTRE segmentos (máximo 2:55 en total).
5. python scripts/rastrear.py <toma> → recorte con transparencia + manos (para los efectos)
6. npm run tiempos                 → tiempos reales (avisa si pasa de 2:55)
7. npm run render:final && npm run finalizar
```

## Módulos disponibles (campo `modulo` de cada segmento)

| Módulo | Para qué | Cues (palabras ancla) |
|---|---|---|
| `presentador` | Tú a pantalla completa, con rótulos opcionales (`rotulos: [{cue, kicker, texto}]`) | los que use cada rótulo |
| `nulidadDetras` | «NULIDAD PROCESAL» detrás de ti (requiere `persona` en tomas.json) | `nulidad` |
| `partesEnManos` | Las dos partes aparecen sobre tus palmas (requiere `manos`; si no, posición fija). `nombres: {demandante, demandado}` | `demandante`, `demandado` |
| `finalidad` | Actos del proceso, defecto y ficha de glosario | `conflicto`, `garantias`, `actos`, `defectos`, `nulidad`, `impugnatorio`, `validez` |
| `caso` | La notificación extraviada y «¿Prosperaría? No» | `laura`, `apoderado`, `facultad`, `entera`, `contesta`, `pregunta`, `no`, `finalidad`, `perjuicio` |
| `remedio` | Bandejas recurso / remedio | `que`, `resolucion`, `remedio`, `sentencia`, `recurso` |
| `elementos` | Despiece del acto: extrínseco / intrínseco | `donde`, `acto`, `elementos`, `publica`, `forma`, `intrinseco`, `nuestro` |
| `forma` | «Forma ≠ fin» y la bifurcación en dos versiones | `clave`, `fin`, `garantia`, `fallo`, `logro`, `dato`, `nunca`, `sindefensa` |
| `limites` | Candados (imperatividad) y retroceso | `normas`, `pacto`, `esenciales`, `retroceder`, `dilatar`, `principios` |
| `principiosPartes` | Los 4 principios actuados por las partes | `p1`, `p2`, `p3`, `p4` |
| `principios` | Los 4 principios sobre las dos versiones | `p1`, `a437`, `p2`, `primero`, `p3`, `segundo`, `p4`, `causo` |
| `cierre` | Validez provisional, dominó (art. 173), pregunta final y Couture | `vale`, `declare`, `duda`, `pregunta`, `respuesta`, `couture`, `couture2` |

Si una palabra ancla no aparece en lo que dijiste, se fija a mano en `tomas.json → "cues": { "p2": 12.4 }` (segundos dentro del segmento).

## Respaldos
- **Efectos de rastreo:** sin recorte, «NULIDAD» aparece al costado; sin manos detectadas, las partes aparecen en posición fija.
- **Versión sin animaciones:** `npm run render:respaldo`.
- **Sin Remotion:** `npm run plan-c` (solo FFmpeg).
- **Maquetas anteriores:** rama `maqueta-v2` y commits de la v4.
