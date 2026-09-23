# Prompts Higgsfield - Colecciones Kai y Nex (fase A)

Fecha: 2026-09-23. Creditos: 186.54 antes, 176.54 despues = **10 gastados** (5 generaciones x 2). Tope de la fase: 10.

## Modelo y ajustes (receta ganadora)
- Modelo `nano_banana_pro` (Higgsfield lo sirve y lo registra como `nano_banana_2`), `resolution: 2k`, 2 creditos por imagen (preflight `get_cost` y transacciones lo confirman). 4k cuesta 4.
- Salida real: 4:5 -> 1856x2304 (0.806, NO es 4:5 exacto; `ambiente_colecciones.py` recorta al centro), 5:4 -> 2304x1856, 1:1 -> 2048x2048. Esta vez sin franjas negras (el script lo verifica de todas formas).
- Alternativas cotizadas: `gpt_image_2_5` 2k high = 2.75 cr (redibuja el objeto, queda de respaldo); `upscale_image` (bytedance) = 2 cr plano en 2k y 4k. Para los rescates se eligio regenerar en vez de escalar: el escalado de 495 px a 2k (x4.7) inventa textura y conserva el blur de WhatsApp; la regeneracion con la fuente de baja + una hermana de alta de la misma coleccion da veta nitida y se controla la geometria con la superposicion de QA.
- Medias: siempre `role: image_references`. Imagen 1 = producto (fuente). Imagen 2 = referencia de material (rescates) o de escena (ambientes: `centro-tv-catania-ambiente.jpg` subido, media 569f4884-aa8f-43a4-8dd3-7210ee61a74a).
- Descargas con `urllib.request.urlretrieve` a `generados/`; cada archivo se abre con PIL y se verifica tamano (6-7 MB PNG).

## Media ids subidos (validos para la fase B)
| Archivo | media_id |
|---|---|
| nex-02-cama.jpg | 03cf7822-7870-48df-9bcd-3ceff20e034d |
| nex-05-comoda.jpg | 9baf1f91-a360-431b-8ffc-92b8d1f4fd80 |
| nex-03-base-cama.jpg | ae38d2b3-0c4e-4728-b7e9-fe86df187ff7 |
| nex-04-buro.jpg | 0ac68c00-69d2-4540-846e-e6ef0be03144 |
| kai-04-comoda.jpg | 736fc9c1-abea-46ce-bf43-3d3f2b718035 |
| nex-07-bufetera.jpg | 29e028e5-1131-4d56-8496-29daeded7227 |
| assets/catalogo/centro-tv-catania-ambiente.jpg (escena) | 569f4884-aa8f-43a4-8dd3-7210ee61a74a |

## Jobs
| # | Pieza | Job id | Aspecto | Referencias | Resultado QA |
|---|---|---|---|---|---|
| 1 | nex-cama rescate | 1167a3fa-fd45-412a-9efc-f1037bcb5024 | 5:4 | nex-02 + nex-03 | Pasa tras correccion local: cabecera 9.6% mas chata que la fuente, estirada en `estudio_colecciones.py` (cabecera_nex) |
| 2 | nex-comoda rescate | abffe091-6a6c-417b-8b8a-778a9007d81d | 1:1 | nex-05 + nex-04 | Pasa directo (superposicion sin lineas dobles) |
| 3 | kai-comoda ambiente v1 | 7215b839-1c13-41fe-ba86-edfcb21a833a | 4:5 | kai-04 + escena Catania | Rechazado: ventana y esquina de muro visibles, ranura gris clara, roble palido. Geometria correcta |
| 4 | nex-bufetera ambiente | 7ce084ec-b7ca-4af6-9930-bb132b426d69 | 4:5 | nex-07 + escena Catania | Pasa directo |
| 5 | kai-comoda ambiente v2 (edicion de #3) | 0893bda2-d5d3-4d37-813a-ce94e854e80a | 4:5 | job #3 + kai-04 | Quita ventana y calienta el roble; la ranura sigue clara y queda esquina en x~175. Se termina local con `ranura_kai.py` (tinte taupe-bronce + recorte). Pasa |

## Prompts exactos

### 1. Rescate nex-cama (plantilla de rescate de estudio)
```
[TASK]
Recreate image 1 as a crisp, high-resolution professional catalogue studio photograph of the exact same bed. Image 1 is a small low-resolution photo of the real product: it defines the design, proportions, layout and camera view, which must stay identical. Image 2 is a high-resolution photo of the same bed base from the same collection: use it only for the true walnut veneer colour, grain sharpness, the light wood slats and the black square-tube legs.

[PRODUCT]
A queen platform bed in American walnut veneer with matte black steel. Headboard: a tall rectangle framed by a thin black square steel tube on the top and both sides; inside it a walnut panel made of a plain horizontal band across the top, then two large plain rectangular walnut panels on the left and right, and between them a narrower recessed centre column with exactly three horizontal protruding walnut slats evenly spaced, then a plain band below; a black steel rail under the headboard panel and a small open gap above the bed base. Bed base: a plain rectangular walnut box with square straight edges and tall side rails, open on top showing seven or eight transverse pale natural wood slats on a black rail. Legs: at each corner a black square-tube leg shaped as a closed square frame with an open square window, the front two connected by a continuous black steel rail under the walnut box.

[COMPOSITION]
Exact straight-on front view, perfectly symmetrical, camera centred at mid height, same framing as image 1. No mattress, no bedding, no pillows, empty bed.

[BACKGROUND AND LIGHT]
Pure white seamless studio background, even and clean, soft diffused key light from the left, gentle soft contact shadow directly under the legs only.

[STYLE]
High-end furniture catalogue product photography, true-to-life colour, sharp natural wood grain, medium format, 85mm, f/11, straight verticals, no perspective distortion.

[AVOID]
Do not change the design: no extra or missing slats, panels, legs or rails, no handles, no added headboard pattern, no rounded corners on the base, no change of wood tone, no metal colour other than matte black. No mattress, no text, no logos, no watermarks, no props, no floor texture, no coloured background, no CGI plastic look, no warped geometry.

resolution: 2k
```
Nota: se pidio fondo blanco puro (no hueso) a proposito: asi el rescate entra al mismo compositor local que los otros 12 renders (fondo -> hueso exacto, misma sombra de contacto y mismo punto de piso). Pedir hueso directo al modelo daria un tono y una sombra propios distintos del resto.

### 2. Rescate nex-comoda
```
[TASK]
Recreate image 1 as a crisp, high-resolution professional catalogue studio photograph of the exact same chest of drawers. Image 1 is a small low-resolution photo of the real product: it defines the design, proportions, drawer layout and camera view, which must stay identical. Image 2 is a high-resolution photo of a nightstand from the same collection: use it only as the reference for the true walnut veneer colour, grain sharpness, the recessed centre column with protruding walnut slats, and the matte black steel finish. Do not copy the nightstand's shape.

[PRODUCT]
A tall walnut chest of drawers, almost square in front view. Flat top with a straight edge. Front: a left column of exactly five plain handle-less drawers stacked, a right column of exactly five plain handle-less drawers stacked, and between them a narrow recessed centre column (about one fifth of the width) with exactly five horizontal protruding walnut slats, one per drawer row, used as finger pulls. Horizontal walnut grain on all drawer fronts, with natural variation in veneer tone from drawer to drawer. Base: slim matte black round steel tube frame with four straight vertical legs, a gently arched front stretcher curving upward at the centre, and low side stretchers.

[COMPOSITION]
Three-quarter view from the front-left exactly as in image 1, camera at mid height, whole piece in frame with margin.

[BACKGROUND AND LIGHT]
Pure white seamless studio background, even and clean, soft diffused key light from the left, gentle soft contact shadow directly under the legs only.

[STYLE]
High-end furniture catalogue product photography, true-to-life colour, sharp natural walnut grain, medium format, 85mm, f/11, straight verticals, no perspective distortion.

[AVOID]
Do not change the design: no extra or missing drawers or slats, no handles or knobs, no tray rim on the top, no X stretcher, no square tube, no change of wood tone, no metal colour other than matte black. No text, no logos, no watermarks, no props, no coloured background, no CGI plastic look, no warped or melted geometry.

resolution: 2k
```

### 3/4. Ambiente (plantilla; se cambian [PRODUCT], el % de ancho y el [AVOID] de producto)
```
[REFERENCE]
Image 1 is the exact real product: reproduce it faithfully as a physical object, identical shape, proportions, drawer and door layout, materials and steel base.
Image 2 is ONLY a scene and lighting reference: match its plaster wall, pale concrete floor, window light and shadow direction, light temperature, colour grade, camera height and the single ceramic vase with a dry olive branch. Do NOT copy the furniture from image 2.

[PRODUCT]
(nex-bufetera) A long walnut sideboard. Top: a shallow tray with a low raised rim on all four sides. Below the top, a slightly projecting band of drawers, from left to right: a plain drawer, a recessed module with one horizontal protruding walnut slat, a plain drawer, then a plain drawer, a recessed module with one horizontal protruding walnut slat, a plain drawer. Below the band, exactly four equal handle-less doors with vertical walnut grain and cathedral figure. Base: slim matte black round steel tube frame with four straight vertical legs with foot caps at the corners, long rails under the cabinet and thin stretchers crossing in an X underneath. No handles, no knobs.
(kai-comoda) A mid-century chest of drawers in light honey oak veneer: a box whose front frame has large rounded corners and whose top wraps around in a soft curve. Exactly six handle-less drawers in two columns of three, separated by a vertical centre divider. Between the first and second row of drawers runs a continuous wide recessed groove in a taupe-bronze colour that forms a stepped wave: in the left column it runs low on the left then steps up diagonally with rounded corners towards the centre; in the right column it starts high next to the centre then steps down diagonally towards the right, mirrored. Between the second and third row the groove is straight. Four tapered splayed round legs in satin champagne metal with small black foot caps. No handles, no knobs.

[COMPOSITION]
4:5 vertical frame. Three-quarter view from the front-left like image 1, camera at about 90 cm. The <piece> stands on the floor against the plaster wall in the lower middle of the frame, about <72 bufetera / 60 comoda> percent of the frame width. The upper half is calm plaster wall carrying the diagonal window shadows from the left. One matte off-white ceramic vase with a single dry olive branch stands on the left end of the top. Nothing else.

[SCENE]
A quiet private gallery room with hand-troweled lime plaster walls in warm bone white, a pale polished concrete floor, no baseboard, late afternoon.

[LIGHTING]
Low raking warm sunlight from a tall window out of frame on the left casting soft-edged diagonal window-mullion shadows across wall and floor, gentle bounce fill, soft contact shadow under every leg.

[STYLE]
Editorial interior photography for a high-end furniture catalogue, calm, natural materials, true-to-life colour, fine film grain, 50mm, f/8, straight verticals.

[AVOID]
No changes to the furniture design: no extra or missing drawers, doors or slats, no handles, <product specific>, no change of wood tone. No people, no rugs, no pictures, no lamps, no books, no text, no logos, no watermarks, no black borders, no CGI render look, no HDR, no warped geometry, no floating furniture.

resolution: 2k
```
[AVOID] especifico: bufetera "no square tube legs, no hairpin legs"; comoda "no change of the wave groove shape, no black legs, no brass or gold shine".

### 5. Edicion kai-comoda v2 (medias: job 7215b839 + kai-04)
```
[TASK]
Edit image 1. Keep image 1 exactly as it is: same camera, same framing, same position and size of the chest of drawers, same drawer layout, same wave-shaped groove geometry, same legs, same vase with olive branch, same concrete floor, same sunlight and shadow pattern on the wall and floor. Make only these three changes:
1. Remove the window and the side wall with the wall corner on the left edge. The same warm bone white lime plaster back wall continues flat and uninterrupted all the way to the left edge of the frame, with the sunlight patch and diagonal window-mullion shadows continuing naturally across it, as if the window is out of frame on the left. The floor continues flat to the left edge with no corner line.
2. Change the colour of all the recessed grooves between the drawers to a dark taupe-bronze, clearly darker than the wood, exactly like the grooves in image 2.
3. Warm the oak veneer to the richer honey-orange oak tone of image 2, keeping it natural under the afternoon light.
Image 2 is the real product and is the reference for groove colour and wood tone only.

[AVOID]
No window, no window frame, no side wall, no wall corner, no change to the furniture shape, drawer count, groove shape or legs, no new objects, no text, no logos, no watermarks, no black borders.

resolution: 2k
```
Aprendizaje: la edicion sobre un job ya aprobado en geometria conserva la pieza casi pixel a pixel (buena via de correccion barata), pero no obedecio el cambio de color fino de la ranura; eso se resolvio local.

## Cambios para la fase B (receta recomendada)
1. Escena: agregar al [SCENE] literal "a single flat continuous plaster wall fills the whole background from edge to edge; the window is out of frame and never visible; no side wall, no room corner". La referencia Catania sola dejo pasar ventana y esquina en 1 de 2.
2. Kai: escribir el color de la ranura como "dark taupe-bronze recess, clearly darker than the oak (about RGB 130/100/75)" y el roble como "warm honey-orange oak"; el modelo tiende a gris claro y roble palido. Si sale claro, `ranura_kai.py` lo corrige (ajustar la caja Y0..Y1 por pieza).
3. Mantener la vista de la fuente (3/4 izquierda o frontal): no pedir otro angulo, es lo que mas protege la geometria.
4. Post local obligatorio: `ambiente_colecciones.py <slug> <png>` (4:5 exacto + franjas + exportes) y `qa_colecciones.py` (agregar la pieza con sus cajas de detalle).

---

# Fase B (2026-09-23)
Creditos: 176.54 antes, 146.54 despues = **30 gastados** (15 generaciones x 2). Tope de la fase: 35. Mismo modelo y ajustes que en la fase A (`nano_banana_pro`, 2k).

## Media ids nuevos
| Archivo | media_id |
|---|---|
| kai-01-credenza.jpg | 5059251c-6d5b-4293-a43c-fe3cf21e74c2 |
| kai-02-mesa-redonda.jpg | 4851ef71-d380-4b89-b0c2-b13e3f53d319 |
| kai-05-mesa-comedor.jpg | 9ea73dde-c549-4a36-babd-dfa38af20f2b |
| kai-06-cama.jpg | abf44cd8-d02f-4407-aa2b-72aff2324141 |
| kai-07-buro.jpg | 2e1fd925-7dfd-458f-8c37-fc757289d920 |
| nex-01-centro-tv.jpg | bf9757ca-5844-490f-8b9b-4b7eb43e9259 |
| nex-06-mesa-centro.jpg | 42a17bb5-ea4b-4bdd-8031-3d8024126c7a |
| rescate/nex-cama-corregida.jpg (rescate con cabecera corregida) | 53495526-9721-425c-b034-68a37ba4e5e5 |
| assets/catalogo/silla-sahara-estudio.jpg | 8f422663-e603-474f-a21a-788cf08b9f14 |
nex-comoda uso como producto el job del rescate abffe091-6a6c-417b-8b8a-778a9007d81d.

## Jobs y resultado
| Pieza | Job id | Aspecto | Imagen 1 | Resultado | Retoque local |
|---|---|---|---|---|---|
| kai-credenza v1 | f7e21fd5-d6f9-4bc2-ba68-5c9fdc95d46a | 4:5 | kai-01 | Rechazado: jamba de ventana en el borde izq. a 8 px de la pieza (no se puede recortar) | - |
| kai-credenza v2 (edicion de v1) | 7f0a4e9b-8717-4cca-9c81-f36e1a0f9ab1 | 4:5 | job v1 + kai-01 | Pasa: muro continuo, geometria identica a v1 | tono_kai (la edicion paso de calida: r/g 1.52, g/b 2.02 -> 1.46/1.76) |
| kai-mesa-redonda | 525ef65a-41d4-4226-bf51-551ce9ae5897 | 4:5 | kai-02 | Pasa (barras quebradas + aro de roble) | tono_kai |
| kai-mesa-comedor | 8d7c62ed-4292-4138-a84b-7d902acf46be | 4:5 | kai-05 | Pasa (2 pedestales) | tono_kai |
| kai-cama | cb04ec71-0f5b-4650-9d31-ec309c369c2a | 4:5 | kai-06 | Pasa (ola del tapiz correcta) | tono_kai |
| kai-buro | 4508dda2-2d7e-4f54-a7ad-b772aa7a07bd | 4:5 | kai-07 | Pasa tras retoque | tono_kai + ranura_kai (505 1200 1300 1480 0) |
| nex-cama | 3b8b1807-8e82-4f73-aa13-f68895dc2041 | 4:5 | rescate corregido | Pasa directo | - |
| nex-comoda | aba5084e-34cb-4b7d-8a05-49f87efefe73 | 4:5 | job rescate | Pasa directo | - |
| nex-buro | a5100608-b074-4ffb-b485-10a0e7bc4c0b | 4:5 | nex-04 | Pasa directo | - |
| nex-mesa-centro | 1a460e50-2de1-4abf-ae82-b6f93070a174 | 4:5 | nex-06 | Pasa directo | - |
| nex-centro-tv | 07aef657-c613-4557-ab58-8e728306758d | 4:5 | nex-01 | Pasa tras retoque: 5a pata inventada al centro | quitar_pata (885 922 1678 1768) |
| portada kai | de48caac-2b97-4758-aec8-878cd6ce1a5f | 3:2 | kai-01 + kai-02 | Pasa tras retoque: 5a pata al centro de la credenza | quitar_pata (975 998 1316 1376) + tono_kai |
| portada nex v1 | b3eeab1e-e4fd-402a-b592-5f8b26d7bc11 | 3:2 | nex-07 + nex-06 | Rechazado: mesa de centro mal armada (marcos negros en ambos extremos) y ventana visible | - |
| portada nex v2 | f901f9f6-e433-4891-9991-5eb07ea6f6f0 | 3:2 | nex-07 sola | Pasa; se recortan 190 px a la izq. (ventana/esquina) | recorte en portada_colecciones.py |
| portada industrial | 02595c83-f3a5-45e3-ba6f-d131c1523cba | 3:2 | ambiente Catania (producto + escena) + Sahara estudio | Pasa directo | - |
En todas, imagen 2 (o 3 en portadas) = escena `centro-tv-catania-ambiente.jpg` (569f4884...).

## Prompts
Ambientes: plantilla de la fase A con estos cambios, ya incorporados en los 10 prompts:
- [SCENE]: "A single flat continuous hand-troweled lime plaster wall in warm bone white fills the whole background from edge to edge; the window is out of frame on the left and never visible; no side wall, no room corner, no baseboard." y en [AVOID] "No window, no window frame, no side wall, no wall corner".
- Kai: "Materials: warm honey-orange oak veneer with fine straight grain; all metal in satin champagne (warm beige metallic, matte, not shiny gold, not brass, not black)." Ranura: "dark taupe-bronze, clearly darker than the oak (about RGB 130/100/75)".
- Mesas Kai: "Pedestal made of exactly eight square-section metal bars arranged evenly in a circle: each bar rises from a solid oak ring on the floor, leans inward to a narrow waist, bends with a sharp kink at about 80 percent of the height and splays outward in a V to the underside of the top" + AVOID "no fewer or more than eight bars, no straight unbent bars".
- Camas: "The bed is made with a plain mattress, simple undyed oatmeal linen bedding and two linen pillows; the bedding sits inside the frame and does not cover the headboard, the rails or the legs" + vase en el piso a la izquierda, sin burós.
- [PRODUCT] de cada pieza = la ficha de FICHAS.md traducida (ver el texto exacto en el historial de jobs de Higgsfield por job id).

Portadas (3:2): "[REFERENCE] Image 1 and image 2 are two exact real products from the same collection ... Image 3 is ONLY a scene and lighting reference" + "[COMPOSITION] 3:2 horizontal frame, wide calm gallery view, camera at about 95 cm ... The <protagonist> stands against the wall exactly in the horizontal centre of the frame and occupies about 40 percent of the frame width; this centre part must work on its own as a vertical 4:5 crop. The <second piece> stands ... fully inside the <right/left> quarter" + 35mm, f/8. Portada nex v2 y la industrial piden ~44% y (nex) "The sideboard is the only piece of furniture".

Edicion credenza v2: mismo texto que la edicion kai-comoda de la fase A, cambiando la pieza y pidiendo quitar "the window opening, the window jamb and the bright vertical strip along the left edge ... No vertical edges, no corner".

## Aprendizajes de la fase B
- La receta de escena mejoro: 2 de 15 salidas aun mostraron ventana (credenza v1, nex portada v1/v2). La edicion sobre un job aprobado la quita sin tocar el mueble.
- El modelo inventa una 5a pata central en piezas largas con 4 patas abiertas (centro TV Nex, credenza en la portada). Revisar siempre bajo el centro del mueble; se quita local con `quitar_pata.py`.
- Madera Kai siempre sale palida; `tono_kai.py` la normaliza a la relacion de la fuente sin tocar muro, metal ni tapiz.
- Portadas: con dos piezas la segunda falla mas (la mesa Nex asimetrica se armo mal). Un protagonista solo o una pieza secundaria de geometria simple (mesa redonda Kai, sillon Sahara) es mas seguro.
- 4:5 movil de la portada Nex: la bufetera ocupa 1376 px de ancho y un 4:5 a alto completo mide 1357 px, no cabe; se usa el ambiente 4:5 aprobado `nex-bufetera-ambiente.jpg` (misma escena y pieza) como version movil. Kai e Industrial salen del recorte 4:5 del 3:2 (x 305-1662 y 382-1739).

## Scripts de acabado (fase B)
- `scripts/tono_kai.py <in> <out>`, `scripts/quitar_pata.py <in> <out> x0 x1 y0 y1`, `scripts/ranura_kai.py <in> <out> [x0 x1 y0 y1 corte_x]`
- `scripts/ambiente_colecciones.py <slug> <png>`
- `scripts/portada_colecciones.py <sala> <png 3:2> <x0> <centro_movil|ruta 4:5>`
- `scripts/qa_colecciones.py` (hojas por pieza, portadas y contacto `qa/ambientes-portadas-contacto.jpg`)
