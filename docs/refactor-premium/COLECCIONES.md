# Catalogo por colecciones - Spec

Fuente de verdad para el catalogo nuevo (Nexo + Kai + Industrial). Complementa SPEC.md y DESIGN.md; si choca con ellos en el catalogo, gana este.

## Investigacion (2026-09-23)
- Refero Styles: teenage engineering, Bang & Olufsen, Symbol Audio, Adanola, ARTU, Stykka, MDF Italia Contract, Glein Atelier, COS, ARKET.
- Sitios de mueble elite revisados en vivo: Gubi, Audo, Carl Hansen & Son, Minotti, Fritz Hansen, Vitra, Ethnicraft, B&B Italia, Apparatus, Pierre Augustin Rose, Hem, Frama, De La Espada.
- Coinciden en: la coleccion como capitulo (portada editorial + rejilla), un solo formato y un solo fondo en toda la rejilla, estudio primero y ambiente al pasar el cursor (Carl Hansen, fundido ~0.5 s), tarjeta invisible (sin sombra ni borde) con texto en 2 niveles, variantes resumidas en texto en vez de tarjetas aparte (Audo "5 COLOURS"), ritmo claro/oscuro entre grupos, indice fijo de anclas (Gubi), carriles solo en movil (B&O). No usan carruseles en desktop para el catalogo, ni botones llamativos por tarjeta, ni mezcla de fondos.

## Concepto MEDEISA: "Tres salas de una galeria"
Cada coleccion es una sala: portada editorial + 6 piezas con cedula de museo. Combinacion propia de:
- Capitulo editorial (Ethnicraft / Fritz Hansen): foto de ambiente grande + nombre + una frase + muestras de material.
- Un solo fondo papel para las tres salas: se separan con aire y una hairline, no con bandas oscuras (decision del cliente 2026-09-23; en hueso las tarjetas de estudio se pierden).
- Rejilla 3x2 calmada con estudio -> ambiente al hover (Carl Hansen).
- Indice fijo de anclas Nexo / Kai / Industrial (Gubi), activo con linea roja.
- Carril horizontal por coleccion solo en movil (B&O) para que 18 piezas no sean 18 pantallas de scroll.
- Cedula de museo propia: "KAI - 03" en etiqueta sobre el nombre (numeracion por sala).

## Curaduria: 6 piezas por sala (18 tarjetas, todo el material se usa)
La base de cama sin cabecera no es tarjeta aparte: es variante de la cama ("Con o sin cabecera"), como las variantes de color en Audo. Asi las tres salas quedan en 3x2 exacto.

| Sala | Orden | Pieza | slug | Fuente | Nota |
|---|---|---|---|---|---|
| Nexo | 01 | Cama Nexo | nexo-cama | nex-02 (baja resolucion, rescatar) (+ nex-03 variante) | "Con o sin cabecera" |
| Nexo | 01 | Buro Nexo | nexo-buro | nex-04 | |
| Nexo | 01 | Comoda Nexo | nexo-comoda | nex-05 (baja resolucion, rescatar) | |
| Nexo | 01 | Bufetera Nexo | nexo-bufetera | nex-07 | portada de sala |
| Nexo | 01 | Mesa de centro Nexo | nexo-mesa-centro | nex-06 | |
| Nexo | 01 | Centro de TV Nexo | nexo-centro-tv | nex-01 | |
| Kai | 02 | Credenza Kai | kai-credenza | kai-01 | portada de sala |
| Kai | 02 | Mesa redonda Kai | kai-mesa-redonda | kai-02 | |
| Kai | 02 | Mesa de comedor Kai | kai-mesa-comedor | kai-05 | ovalada, dos bases |
| Kai | 02 | Cama Kai | kai-cama | kai-06 (+ kai-03 variante) | "Con o sin cabecera" |
| Kai | 02 | Comoda Kai | kai-comoda | kai-04 | |
| Kai | 02 | Buro Kai | kai-buro | kai-07 | |
| Industrial | 03 | (las 6 actuales, sin cambios) | ver assets/catalogo | - | ya tienen estudio + ambiente |

Nombres provisionales hasta que el cliente pase los reales. Fotos fuente: docs/refactor-premium/colecciones/originales/.

Orden de salas (decision del cliente 2026-09-23): Nexo = Sala 01, Kai = Sala 02, Industrial = Sala 03. La cedula de cada pieza conserva su numeracion por sala.

Bandas de la pagina: Nosotros (hueso) -> catalogo completo: encabezado + indice + Nexo + Kai + Industrial (una sola banda papel, salas separadas por aire y una hairline --color-linea al ancho del contenido) -> Expo (negro) -> Contacto (hueso) -> footer (negro). Ninguna sala lleva fondo negro ni hueso.

## Layout
Desktop (>= 1024):
- Encabezado general del catalogo (h2 "Nuestras colecciones") + indice fijo de anclas bajo la nav: "Nexo 06 · Kai 06 · Industrial 06". Activo con linea roja (IntersectionObserver).
- Cada sala: portada en split 7/5 (foto de ambiente 32px de radio a un lado, texto al otro; lados alternados entre salas: Nexo foto a la izquierda, Kai a la derecha, Industrial a la izquierda). Texto: etiqueta "Sala 02", nombre en Gloock --text-3xl, una frase, 2 muestras de material (circulos 14px) con nombre, conteo "6 piezas".
- Debajo, rejilla 3 columnas x 2 filas, tarjetas 4:5 estudio, fundido a ambiente al hover (0.6 s). Cedula: "NEXO - 03" (etiqueta), nombre Gloock, linea de material en Schibsted, variante si aplica, enlace "Cotizar por WhatsApp" con linea roja (componente actual).
Tablet (768-1023): portada apilada, rejilla 2 columnas.
Movil (< 768): portada a todo el ancho (4:5), luego carril horizontal con scroll-snap (1.15 tarjetas visibles, gutter 16 px), sin flechas; en desktop no hay carril.

## Assets que necesita la pagina
Tarjetas (18): assets/catalogo/<slug>-{estudio,ambiente}[-800w].{jpg,webp}, 1600x2000 (4:5), igual que las 6 actuales.
- Estudio: fondo hueso #E3E1DE, sombra de contacto suave, pieza centrada con el mismo margen relativo que las actuales. Se hace LOCAL (sin creditos) salvo nexo-cama y nexo-comoda, que se rescatan con Higgsfield por baja resolucion.
- Ambiente: la MISMA escena que los 6 ambientes actuales (galeria de yeso hueso, piso de concreto claro, luz rasante de tarde, el mismo objeto decorativo). El mueble identico a la foto fuente.
Portadas de sala (Kai y Nexo): assets/colecciones/<sala>-portada-{2000w,1200w}.{jpg,webp} en 3:2 y <sala>-portada-movil-{1080w,720w} en 4:5. Una escena por sala con la pieza de portada protagonista (y a lo mas 1-2 piezas mas de la misma sala), misma galeria y luz. Industrial reutiliza material existente (se decide al maquetar).

## Presupuesto Higgsfield (aprobado por el usuario: 32 creditos, tope 45)
- Rescate nexo-cama y nexo-comoda: 2 x 2 = 4
- Ambientes 12 piezas: 12 x 2 = 24
- Portadas Kai y Nexo: 2 x 2 = 4
- Total 32; margen para repetir hasta 45. Nada fuera de esto sin aprobacion.
- Fase A (prueba): rescate (4) + 2 ambientes de prueba, uno Kai y uno Nexo (4) = 8. Se revisa con el usuario antes del lote.
