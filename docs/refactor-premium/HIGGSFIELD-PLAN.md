# Plan Higgsfield - MEDEISA refactor premium

Estado: COTIZACION. No se ha generado nada. Nada se ejecuta sin aprobacion explicita del usuario (SPEC.md).
Consultado el 2026-09-22 via MCP Higgsfield (solo lectura: balance, models_explore, transactions, historial de generaciones, workflow "product-photoshoot").

- Creditos disponibles: **238.04** (plan Plus).
- Presupuesto recomendado de este plan: **~73 creditos estimados**, techo conservador **~131**. Ruta minima (sin variantes ni correcciones): **~32**. (Incluye hero movil 9:16 y video movil C2, exigidos por el SPEC.)

---

## 1. Como se obtuvieron los costos (leer antes de aprobar)

Higgsfield **no expone precio por generacion** en ninguna herramienta de solo lectura (`models_explore` no devuelve costo; no hay "simulate cost" en este MCP). Los precios de abajo salen de cruzar el historial real de transacciones del usuario (`transactions`) con los parametros de esas mismas generaciones (`show_generations`):

| Modelo y parametros (historial real) | Creditos cobrados | Confianza |
|---|---|---|
| Kling 3.0, mode **pro**, sound **off**, 6 s y 9 s, 1080p | 10.5 y 15.75 = **1.75 cr/s** | Exacto |
| Kling 3.0, mode **std**, sound **on**, 6 s, 720p | 12 = **2.0 cr/s** | Exacto |
| Kling 3.0, mode **std**, sound **off** | nunca usado | Estimado (ver abajo) |
| Seedance 2.5, 720p, audio on, 5 s | 32.5 (6.5 cr/s) | Exacto |
| Seedream 5.0 Pro, 2k (con o sin referencias) | 3 | Exacto |
| GPT Image 2.5 Flare: 2k high / 4k high / 2k xhigh / 4k xhigh | 3 / 4.5 / 5 / 8 | Exacto |
| "Nano Banana Pro" (etiqueta de la transaccion), 2k, 9:16 | 2 | Dudoso: el historial marca ese job como `nano_banana_2` |

**Estimaciones usadas en este plan:**
- **Nano Banana Pro 2k: ~2 cr** (mejor estimacion, fuente: transaccion etiquetada "Nano Banana Pro" = 2). Techo usado: 4 cr.
- **Nano Banana Pro 4k: ~4 cr** (asumiendo que 4k duplica a 2k, como pasa en GPT Image 2.5). Techo: 8 cr.
- **Kling 3.0 std sin audio, 5 s: ~6-7 cr** (debe ser menor que std con audio = 10 cr por 5 s y, por la relacion pro/std de Kling, menor o igual que pro sin audio = 8.75 cr por 5 s). Techo usado: 8.75 cr.

Recomendacion: la primera generacion de cada modelo (A1 y C1) sirve tambien para **confirmar el precio real** en `transactions`; se recalcula este presupuesto antes de seguir.

---

## 2. Modelos elegidos

### A y B (imagenes ambiente + hero): **Nano Banana Pro** (`nano_banana_pro`)

Por que:
1. Es el modelo que el propio Higgsfield **fija** en su workflow oficial `product-photoshoot` para fotos de producto con referencia ("Model is always nano_banana_pro; do not substitute another model"). Es su apuesta para preservar identidad de producto.
2. Acepta **varias imagenes de referencia** (`image_references`): permite pasar foto del mueble + imagen de escena aprobada a la vez. Esto es clave para que las 6 piezas salgan en la misma galeria.
3. Soporta **4:5 y 16:9 nativos** y resolucion **1k / 2k / 4k** (4k para el hero).
4. Barato (estimado ~2 cr en 2k).

Alternativas descartadas:
| Modelo | Motivo |
|---|---|
| GPT Image 2.5 Flare | Costo exacto conocido (3 cr 2k high) y soporta 4:5, pero tiende a "redibujar" el objeto; queda como **respaldo** si Nano Banana Pro deforma una pieza. |
| Seedream 5.0 Pro | Bueno en edicion por instruccion (3 cr) pero **no tiene 4:5** (solo 3:4). |
| Flux Kontext | Sin 4:5, sin 4k. |
| Nano Banana 2 | Tiene inpaint con mascara y 4:5; util solo para corregir un detalle puntual (patas, jaladeras) sin regenerar. |
| Marketing Studio Image / DTC Ads | Orientados a anuncio social, estetica opuesta a la galeria minimalista. |

### C (video hero): **Kling 3.0, mode std, sound off** (`kling3_0`)

| Candidato | start+end frame | Resolucion | Costo 5 s | Veredicto |
|---|---|---|---|---|
| **Kling 3.0 std, sound off** | Si | 720p | ~6-7 (techo 8.75) | **Elegido**: el mas barato con start=end para loop, y buena fidelidad a la imagen inicial. |
| Kling 3.0 pro, sound off | Si | 1080p | 8.75 (exacto) | Upgrade si el 720p se ve blando en monitores grandes. +~2 cr. |
| Kling 3.0 Turbo | Solo start | 720p/1080p | desconocido ("budget") | Sin end_image: no garantiza loop. |
| Seedance 2.0 Mini | Si | 480p/720p | desconocido ("budget") | Tiende a animar de mas; sin historial de precio. |
| MiniMax H3 Max | Si | 768p | desconocido | Sin historial, poco control de camara fija. |
| Seedance 2.5 | Si | 720p | ~32.5 | 5x mas caro. Descartado. |

Nota: Kling 3.0 ofrece 16:9, 9:16 y 1:1. El SPEC exige **video tambien en movil** (9:16 propio, ~720x1280, 5 s, <1.5 MB), asi que se generan dos videos: C1 16:9 (desktop) y C2 9:16 (movil). Kling std da 720p, que en 9:16 es justo 720x1280. El poster estatico solo se usa con prefers-reduced-motion o Save-Data.

---

## 3. Imagenes de referencia (entrada)

Carpeta base (solo lectura): `/Users/alannovoa/Documents/Deiro/Hogar/`

| Pieza | Referencia principal | Referencia de apoyo | Nota |
|---|---|---|---|
| Centro TV Catania | `Mesas de centro : TV/Linea Industrial/Centro de TV Catania/Centro de TV Catania SF2.JPG` (foto real 3965x5950, 7.2 MB) | `.../Centro de TV Catania SF.webp` (frontal 1024) | Exportar copia JPEG de 2048 px al scratchpad antes de subir (no tocar el original). |
| Mesa de Centro Catania | `Mesas de centro : TV/Linea Industrial/Mesa de Centro Catania/Mesa de Centro Catania SF.png` | `.../Mesa de Centro Catania FG.webp` (foto real) | Cubierta en 3 tablones de parota con franjas de acero negro. |
| Silla Sahara | `Comedor/SILLAS Y BANCOS/Línea Industrial /Silla Sahara/Silla Sahara SF.png` | - | Es un sillon tapizado boucle negro con patas negras en "V". Ruta con espacio antes de la "/". |
| Centro TV Sierra Azul | `Mesas de centro : TV/Linea Industrial/Centro de TV Sierra Azul Parota/Centro de TV Sierra Azul SF.png` | - | Solo render; ovalado, barrotes verticales, repisa intermedia de parota. |
| Mesa Centro Sierra Azul Parota | `Mesas de centro : TV/Linea Industrial/Mesa de Centro Sierra Azul Parota/Mesa Centro Sierra Azul.png` | - | Redonda, parota con veta clara central, base de barrotes. |
| Recamara Tulum | `Recamara/Línea Industrial /Juego de Recamara/Recamara Tulum Chapa/Recámara Tulum Chapa SF.png` | - | Juego completo (cama, 2 burós, cajonera). En 4:5 recomiendo **cama + 1 buro** (ver dudas). |

Subida: via `media_upload` / `media_upload_widget` de Higgsfield (subir no consume creditos de generacion). Una vez aprobada A1, su job id se reutiliza como **referencia de escena** para las demas.

---

## 4. Parametros exactos

| ID | Que | Modelo | aspect_ratio | resolution | medias (role) | count |
|---|---|---|---|---|---|---|
| A1 | Ambiente Centro TV Catania (prueba de escena) | nano_banana_pro | 4:5 | 2k | SF2 (image_references) + SF.webp (image_references) | 1 por request, 2 requests |
| A2-A6 | Ambientes restantes | nano_banana_pro | 4:5 | 2k | foto del producto + job A1 aprobado (image_references) | 1 por request, 2 por pieza |
| B1 | Hero desktop | nano_banana_pro | 16:9 | 4k | SF2 + job A1 aprobado | 1 por request, 3 requests |
| B2 | Hero movil (poster movil + frame del video C2) | nano_banana_pro (un 9:16 no sale por recorte del B1: 1215 px de ancho a 4k y el mueble no cabe) | 9:16 | 2k | job B1 aprobado | 1 |
| C1 | Video hero desktop | kling3_0 | 16:9 | (std = 720p) | job B1 como start_image **y** end_image | 1 |
| | | | | | `duration: 5`, `mode: "std"`, `sound: "off"` | |
| C2 | Video hero movil | kling3_0 | 9:16 | (std = 720x1280) | job B2 como start_image **y** end_image | 1 |
| | | | | | `duration: 5`, `mode: "std"`, `sound: "off"`, mismo prompt que C1 | |

Cada prompt de imagen termina con la linea literal `resolution: 2k` (o `resolution: 4k` en B1), como pide el workflow de Higgsfield.

### Archivos de salida (deben coincidir con BLUEPRINT.md)

| ID | Archivos finales en el repo |
|---|---|
| A1-A6 | `assets/catalogo/<slug>-ambiente.webp / .jpg` (1600x2000) y `<slug>-ambiente-800w.webp / .jpg` (800x1000), 4:5 exacto. Slugs: `centro-tv-catania` (A1), `mesa-centro-catania` (A2), `silla-sahara` (A3), `centro-tv-sierra-azul` (A4), `mesa-centro-sierra-azul` (A5, sin "-parota"), `recamara-tulum` (A6) |
| B1 | `assets/hero/hero-{2560w,1920w,1280w}.webp / .jpg` y `assets/hero/hero-og.jpg` (1200x630) |
| B2 | `assets/hero/hero-movil-{1080w,720w}.webp / .jpg` (9:16) |
| C1 | `assets/hero/hero-luz.mp4` y `hero-luz.webm` |
| C2 | `assets/hero/hero-luz-movil.mp4` y `hero-luz-movil.webm` |

---

## 5. Prompts finales (ingles)

### Bloque comun de escena (se incluye en A1-A6 y B1)

```
[SCENE]
A quiet private gallery room with hand-troweled lime plaster walls in a warm bone white (#EFEAE2), a pale polished concrete floor with a soft satin sheen and faint natural mottling, no baseboard, no furniture other than the featured piece. Late afternoon.

[LIGHTING]
Single low raking sunlight entering from a tall window out of frame on the left, around 3200K warm, casting a crisp but slightly soft-edged window-mullion shadow pattern diagonally across the wall and floor. Gentle bounce fill from the concrete floor, deep but open shadows, no artificial lights. Soft contact shadow under every leg.

[ATMOSPHERE]
Calm, restrained, museum-like. Generous negative space. Still air.

[COLOR PALETTE]
Bone white plaster, pale warm grey concrete, the natural wood and matte black steel of the furniture. Low saturation, gentle contrast, warm highlights.

[STYLE]
Editorial interior design photography for a high-end Scandinavian furniture and apothecary brand catalogue: architectural calm, natural materials, true-to-life color, fine film-like grain, medium format look.
```

### Bloque comun AVOID (A1-A6, B1)

```
[AVOID]
no changes to the furniture design: do not alter its shape, proportions, number of drawers, shelves, legs, bars or panels, wood tone, grain direction or steel finish; no added handles, no added legs, no merged or missing parts.
no people, no plants other than the one specified object, no rugs, no pictures on the wall, no lamps, no books, no clutter, no text, no logos, no watermarks, no signatures.
no AI artifacts, no warped or melted geometry, no doubled objects, no plastic or waxy surfaces, no CGI render look, no oversaturated HDR, no HDR halos, no oversharpening, no flat fluorescent light, no harsh flash.
no stock photography feel, no over-staged set, no perfect symmetry, no obviously composited object, no floating furniture, no missing contact shadows.
no flat solid color bands, no empty rectangular areas that look out of place.
```

### A1 - Centro de TV Catania (escena de prueba)

```
[REFERENCE]
Image 1 and image 2 show the exact same real product. Reproduce it faithfully as a physical object placed in the new scene: identical shape, proportions and construction.

[PRODUCT]
A long low TV console: a slim black powder-coated square steel tube frame shaped as a trapezoid that flares outward at the sides, with a thin black steel rail running along the top back edge; a thin light-brown wood top shelf; below it a wood cabinet body with exactly three equal flat-front drawers without handles, warm honey-toned wood with straight grain; two short black steel legs angled inward under the cabinet; a black steel floor rail connecting the frame at the base.

[COMPOSITION]
4:5 vertical frame. Eye-level, three-quarter view from the front-right at about 20 degrees, camera at 90 cm height. The console sits on the floor against the wall, occupying the lower middle of the frame and roughly 70 percent of the frame width. Two thirds of the image is calm plaster wall above it carrying the diagonal window shadow. One small matte unglazed off-white ceramic vessel with a single dry olive branch rests on the far left end of the top shelf. Nothing else.

[SCENE] ... (bloque comun)
[LIGHTING] ... (bloque comun)
[ATMOSPHERE] ... (bloque comun)
[COLOR PALETTE] ... (bloque comun)
[STYLE] ... (bloque comun)

[LENS]
Shot on 50mm, f/8, everything in focus, straight verticals, no distortion.

[AVOID] ... (bloque comun)

resolution: 2k
```

### Encabezado de referencia para A2-A6 (reemplaza [REFERENCE])

```
[REFERENCE]
Image 1 is the exact real product: reproduce it faithfully, identical shape, proportions, materials and construction.
Image 2 is ONLY a scene and lighting reference: match its plaster wall, concrete floor, window-shadow direction, light temperature, color grade and camera height. Do NOT copy any furniture or objects from image 2.
```

### A2 - Mesa de Centro Catania

```
[PRODUCT]
A rectangular coffee table: a thin open black square steel tube frame forming a simple box base with a rectangular floor stretcher; the top is made of three planks of warm reddish-brown parota wood with natural grain, separated by two flat black steel bands running across the top, with slightly eased edges.

[COMPOSITION]
4:5 vertical frame. Three-quarter view from the front-left at about 30 degrees, slightly above table height, camera at 75 cm. The table sits in the lower third of the frame, centered slightly right, about 55 percent of frame width, with the diagonal window shadow crossing the floor and just touching one table leg. One small matte off-white ceramic bowl, empty, sits on the right plank of the table top. Nothing else.

[SCENE] [LIGHTING] [ATMOSPHERE] [COLOR PALETTE] [STYLE] (bloque comun)
[LENS] Shot on 50mm, f/8, straight verticals.
[AVOID] (bloque comun)

resolution: 2k
```

### A3 - Silla Sahara

```
[PRODUCT]
An upholstered lounge armchair: compact boxy shell with a slightly curved back and rounded track arms, covered in a charcoal-black boucle fabric with fine white flecks; four slim square black wooden legs, the front pair set in a distinctive inverted "V" bracing that meets under the arm. Keep the exact fabric texture, arm shape and leg geometry.

[COMPOSITION]
4:5 vertical frame. Three-quarter view from the front-left at about 35 degrees, camera at seat height, 60 cm. The chair sits right of center in the lower half of the frame, about 45 percent of frame width. The window shadow falls diagonally across the wall behind it and one bar of light crosses the seat. One tall slim matte off-white ceramic vase with a single dry branch stands on the floor at the far left edge of the frame, partly cropped. Nothing else.

[SCENE] [LIGHTING] [ATMOSPHERE] [COLOR PALETTE] [STYLE] (bloque comun)
[LENS] Shot on 50mm, f/5.6, chair fully sharp, straight verticals.
[AVOID] (bloque comun) + no wood grain on the fabric, no change of fabric color or pattern.

resolution: 2k
```

### A4 - Centro de TV Sierra Azul

```
[PRODUCT]
A long low TV console with a racetrack-oval footprint: a matte black oval top and matte black oval bottom shelf, joined by evenly spaced slim vertical black steel bars around both rounded ends and along the back; a middle oval shelf in warm brown parota wood floating inside the bars; short black steel sled feet. Keep the exact number and spacing rhythm of the bars.

[COMPOSITION]
4:5 vertical frame. Three-quarter view from the front-right at about 25 degrees, camera at 80 cm height. The console sits against the wall in the lower third, about 75 percent of frame width. The diagonal window shadow crosses the wall above and repeats through the vertical bars onto the floor. One small round matte off-white ceramic vessel sits on the right end of the top. Nothing else.

[SCENE] [LIGHTING] [ATMOSPHERE] [COLOR PALETTE] [STYLE] (bloque comun)
[LENS] Shot on 50mm, f/8, straight verticals.
[AVOID] (bloque comun) + no extra or missing bars, no bent bars.

resolution: 2k
```

### A5 - Mesa de Centro Sierra Azul Parota

```
[PRODUCT]
A round coffee table: a thick round top of solid parota wood with rich brown grain and a distinctive lighter grey-cream sapwood streak running through the center; the base is a round black steel ring on the floor and a matching ring under the top, connected by evenly spaced slim vertical black steel bars, with four slightly thicker bars acting as legs. Keep the exact wood figure and bar rhythm.

[COMPOSITION]
4:5 vertical frame. Viewed from slightly above at about 25 degrees down, camera at 95 cm, front-on. The table sits centered in the lower half of the frame, about 60 percent of frame width. The window shadow falls diagonally across the floor and over half of the table top, revealing the grain. One small low matte off-white ceramic dish sits near the far edge of the top. Nothing else.

[SCENE] [LIGHTING] [ATMOSPHERE] [COLOR PALETTE] [STYLE] (bloque comun)
[LENS] Shot on 50mm, f/8.
[AVOID] (bloque comun) + no resin river, no glass top, no change of wood figure.

resolution: 2k
```

### A6 - Recamara Tulum

```
[PRODUCT]
A queen bed and one matching nightstand from the same set. Bed: low platform in warm honey-orange wood veneer on a slim black steel frame whose side rails end in rounded sled runners; the headboard is a wood panel framed in black steel with two inlaid black steel elongated oval "racetrack" outlines side by side. Nightstand: a single-drawer wood box on a black steel sled frame. Plain undyed natural linen bedding in oatmeal and sand, one folded taupe throw at the foot. Keep the exact headboard pattern and sled legs.

[COMPOSITION]
4:5 vertical frame. Three-quarter view from the front-right foot of the bed at about 30 degrees, camera at 100 cm. The bed occupies the lower 55 percent of the frame, headboard against the plaster wall, nightstand on its left. The diagonal window shadow crosses the headboard wall and the bedding. One small matte off-white ceramic vase with a single dry branch on the nightstand. Nothing else, no dresser.

[SCENE] [LIGHTING] [ATMOSPHERE] [COLOR PALETTE] [STYLE] (bloque comun, with "gallery room" read as a calm bedroom with the same plaster walls and concrete floor)
[LENS] Shot on 35mm, f/8, straight verticals, no wide-angle distortion.
[AVOID] (bloque comun) + no patterned bedding, no extra pillows beyond four, no second headboard motif.

resolution: 2k
```

### B1 - Hero "Galeria de luz" 16:9

```
[REFERENCE]
Image 1 is the exact real product: reproduce it faithfully, identical shape, proportions and construction.
Image 2 is ONLY a scene and lighting reference: match its plaster wall, concrete floor, light temperature and grade. Do NOT copy its framing.

[PRODUCT]
The Catania TV console: slim black powder-coated square steel trapezoid frame flaring outward at the sides, thin black top rail at the back, thin light-brown wood top shelf, honey-toned wood cabinet with exactly three equal handle-less drawers, two short inward-angled black steel legs, black steel floor rail.

[COMPOSITION]
16:9 wide frame, cinematic gallery view. Camera at 85 cm height, straight-on with a slight angle from the left, 35mm. The console is small in the frame, displayed like a single museum piece, placed in the lower-right third: its right end about 8 percent from the right edge, its top at roughly 62 percent of frame height from the top. The left 55 percent of the frame is a wide, calm, evenly lit bone white plaster wall with generous empty space for dark headline text, lightly textured, never a flat color block. Long diagonal window-mullion shadows from a tall window out of frame left sweep across the wall and floor from upper-left to lower-right, reaching behind the console. Floor line at about 72 percent of frame height. One small matte off-white ceramic vessel with a single dry olive branch on the left end of the top shelf.

[SCENE] [LIGHTING] [ATMOSPHERE] [COLOR PALETTE] [STYLE] (bloque comun)
Overall exposure bright and luminous, airy, not moody: the wall reads as light bone white, the shadows are soft warm grey, never black.

[AVOID] (bloque comun) + no dark vignette, no dark gradient, no text, no second furniture piece.

resolution: 4k
```

### B2 - Hero movil 9:16

Se genera (no hay ruta de 0 creditos: el recorte 9:16 de un B1 16:9 a 4k mide 1215x2160 y el mueble no cabe). Sirve de poster movil y de start/end frame del video C2.

```
[REFERENCE]
Image 1 is the approved hero photograph. Recompose the same scene, same product, same light and same grade for a vertical 9:16 frame. Do not change the product.

[COMPOSITION]
9:16 vertical frame. The Catania console sits in the lower third, spanning about 85 percent of the frame width, slightly right of center. The upper 60 percent of the frame is the calm bone white plaster wall with the diagonal window-mullion shadows, leaving generous clean space for dark headline text; keep the shadows soft and away from the top 35 percent where the text sits. Same ceramic vessel and olive branch on the top shelf.

[AVOID] (bloque comun) + no dark vignette, no text.

resolution: 2k
```

### C1 - Video hero (Kling 3.0 std)

Parametros: `model: "kling3_0"`, `aspect_ratio: "16:9"`, `duration: 5`, `mode: "std"`, `sound: "off"`, `medias: [{role: "start_image", value: <job B1>}, {role: "end_image", value: <job B1>}]`.

**C2 (movil):** mismos parametros y mismo prompt con `aspect_ratio: "9:16"` y `<job B2>` como start_image y end_image. Anadir al prompt: "The shadows move only in the lower half of the frame; the upper wall area stays evenly lit." (el texto del hero movil va arriba y su contraste no debe variar frame a frame). Exportar H.264 + WebM a 720x1280, sin audio, < 1.5 MB.

```
One continuous 5-second shot of the provided still photograph, silent. Locked-off tripod camera: absolutely no camera movement, no pan, no tilt, no zoom, no push-in, no parallax, no reframing.
The furniture, the ceramic vessel, the branch, the wall texture and the floor stay perfectly still and identical to the frame.
The only motion is the late afternoon sunlight: the diagonal window-mullion shadows on the plaster wall and the concrete floor drift very slowly and smoothly a few centimetres to the right and slightly down, as the sun moves, then ease back to exactly where they started so the last frame matches the first.
Light intensity and color temperature stay constant, no flicker, no clouds, no dust, no particles, no people, no reflections moving, no exposure change. Real-time, calm, meditative, gallery stillness.
```

Si el modelo trae campo negativo:
```
camera movement, zoom, pan, shake, morphing furniture, moving objects, flicker, exposure pumping, particles, dust, people, text, fast motion, sudden light change
```

Plan B para el loop (0 creditos): si con start=end Kling deja el video casi congelado o con salto, generar solo con `start_image` y hacer el loop localmente con ffmpeg en ping-pong (5 s adelante + 5 s en reversa = 10 s sin costura). Para sombras que se desplazan, el reverso es imperceptible.

---

## 6. Variantes, orden y presupuesto

Orden pensado para no desperdiciar creditos: cada paso depende de que el anterior este aprobado por el usuario.

| Paso | Que | Generaciones | Estimado (cr) | Techo (cr) | Puerta de aprobacion |
|---|---|---|---|---|---|
| 1 | A1 Catania ambiente, 2 variantes | 2 x NBP 2k | 4 | 8 | Usuario aprueba ESCENA (luz, muro, piso, objeto) y fidelidad del mueble. Verificar precio real en `transactions`. |
| 2 | B1 hero 16:9 4k, con A1 como referencia de escena, 3 variantes | 3 x NBP 4k | 12 | 24 | Usuario aprueba hero. |
| 3 | B2 hero movil 9:16, B1 como referencia | 1 x NBP 2k | 2 | 4 | Usuario aprueba hero movil. |
| 4 | C1 video desktop, start=end = B1 | 1 x Kling std off | 7 | 8.75 | Revisar loop y que el mueble no se mueva. Verificar precio real. |
| 4b | C2 video movil 9:16, start=end = B2 | 1 x Kling std off | 7 | 8.75 | Igual que C1; revisar que las sombras no crucen la zona del texto. |
| 5 | A2-A6, 2 variantes cada una, A1 como referencia de escena | 10 x NBP 2k | 20 | 40 | Aprobar pieza por pieza. |
| 6 | Reserva correcciones (max 1 por pieza + 1 hero movil) | 7 x NBP 2k | 14 | 28 | Solo si hay un defecto concreto (patas, barrotes, veta). |
| 7 | Reserva 1 reintento video | 1 x Kling std off | 7 | 8.75 | Solo si C1 o C2 falla. |
| | **Total** | | **~73** | **~131** | Deja entre ~107 y ~165 cr libres de los 238. |

Ruta minima (1 variante por pieza, sin reservas): A1-A6 6 x 2 + B1 4 + B2 2 + C1 7 + C2 7 = **~32 cr**.

Por que 2 variantes en ambientes y 3 en hero: el hero es la pieza de mayor impacto y el encuadre (producto en el tercio derecho-inferior, muro libre a la izquierda) es mas dificil de clavar; en ambientes la escena ya queda fijada por A1, asi que 2 bastan.

---

## 7. Riesgos conocidos

- **Fidelidad**: ningun modelo garantiza el mueble 100 % identico. Lo mas fragil: numero de barrotes (Sierra Azul), veta clara central (mesa Sierra Azul), angulo de patas (Catania, Sahara) y ovalos del cabecero (Tulum). Revisar cada salida contra la referencia antes de aprobar; corregir con 1 refinamiento usando la misma imagen como referencia, o con inpaint en Nano Banana 2.
- **Contaminacion de escena**: al pasar A1 como referencia, el modelo puede copiar el Centro TV Catania dentro de otras escenas. El encabezado [REFERENCE] lo prohibe explicitamente; si ocurre, repetir sin A1 y con el bloque de escena solo en texto.
- **Resolucion del video**: std es 720p. Sobre un muro liso con sombras suaves suele verse bien, pero en pantallas 1440p+ puede notarse blando. Upgrade a pro 1080p = 8.75 cr exactos.
- **Precios estimados**: Nano Banana Pro y Kling std sin audio no tienen precio exacto verificable sin generar; se confirman en el paso 1 y 4.
- **Referencias render vs foto**: Sahara, Sierra Azul (ambos) y Tulum solo tienen render 3D como referencia; el resultado heredara su lectura de material. Catania TV y Mesa Catania tienen foto real.

---

## 8. Dudas para el usuario antes de gastar

1. Recamara Tulum en 4:5: cama + 1 buro (recomendado) o juego completo con cajonera (encuadre mas abierto, mueble mas pequeno)?
2. Objeto decorativo: una sola familia para las 6 (ceramica mate hueso + rama seca de olivo) o alternar ceramica / rama por pieza?
3. Video desktop: aceptar 720p (std, ~7 cr) o subir a 1080p (pro, 8.75 cr exactos)? (El movil C2 se queda en std: 720x1280 es justo el objetivo del SPEC.)
4. Aprobar el paso 1 (A1, 2 variantes, ~4 cr, techo 8) para arrancar.
