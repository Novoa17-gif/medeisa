# MEDEISA - Style Reference
> galería de yeso donde el acero se exhibe como escultura

**Tema:** claro con bandas oscuras

Estructura tomada de Arc (Refero Styles, ver `ref-arc-DESIGN.md`): espaciado generoso, radios binarios 5px / 32px, casi cero sombra, ritmo de bandas claras y oscuras, restricción total. La identidad es MEDEISA: negro industrial, rojo de marca y hueso cálido. Todas las cifras de contraste de este documento están calculadas con la fórmula WCAG 2.1 de luminancia relativa.

MEDEISA funciona como una galería de yeso hueso que exhibe muebles de acero y madera como si fueran piezas de museo. La página alterna entre fotografía luminosa a sangre completa (el hero), bandas silenciosas de papel y hueso dominadas por titulares serif muy ligeros, y bandas negras #0a0a0a que marcan el ritmo como las pausas de un recorrido. Los componentes son esqueléticos: botones de contorno con borde de 1px, 5px de radio en controles, sin sombras, con aire de sobra para que la fotografía y la tipografía cuenten la historia. La voz de display es Gloock (serifa de alto contraste, sin cursiva), editorial y cara; todo lo demás va en Schibsted Grotesk 400/500, neutra y precisa como una pieza de acero cortada con láser. El color es restricción: 98% acromático cálido y un solo acento, el rojo #F11E24, que aparece únicamente en CTAs y detalles finos (líneas, números de sección, etiquetas). La fotografía siempre va contenida en marcos de 32px de radio sobre el lienzo plano, salvo el hero, que va a sangre.

## Tokens - Colores

| Nombre | Valor | Token | Rol |
|--------|-------|-------|-----|
| Hueso | `#E3E1DE` | `--color-hueso` | Lienzo principal de bandas claras y fondo de TODAS las fotos de estudio. Gris cálido de yeso: se lee industrial y caro, no clínico. Se conserva el valor actual del proyecto porque ya coincide con el fondo de estudio y con el muro del hero |
| Papel | `#F5F5F5` | `--color-blanco` | Blanco de marca. Bandas claras alternas (declaración, catálogo), superficie del nav al hacer scroll, texto sobre bandas oscuras |
| Negro | `#0a0a0a` | `--color-negro` | Texto principal y titulares sobre claro, fondo de bandas oscuras (galería, footer), texto de botón de contorno |
| Carbón | `#161616` | `--color-carbon` | Panel elevado dentro de una banda negra (tarjeta de contacto, mapa). Nunca lleva texto rojo |
| Piedra | `#5C5854` | `--color-texto-secundario` | Texto secundario sobre hueso y papel (descripciones, pies de foto, datos de contacto) |
| Ceniza | `#9A9794` | `--color-texto-secundario-oscuro` | Texto secundario sobre negro y carbón |
| Línea clara | `#D6D3CF` | `--color-linea` | Divisores hairline de 1px sobre claro. Decorativo, no transmite información |
| Línea oscura | `rgba(245, 245, 245, 0.14)` | `--color-linea-oscura` | Divisores hairline de 1px sobre negro |
| Borde control | `#6B6661` | `--color-borde-control` | Borde de controles que sí necesitan ser percibidos (selector de idioma, botón de contorno en estado reposo sobre hueso cuando no es negro) |
| Rojo marca | `#F11E24` | `--color-rojo` | Detalles NO textuales o texto grande: líneas de acento, números de sección grandes, anillo de foco, etiquetas sobre negro |
| Rojo profundo | `#C0001F` | `--color-rojo-texto` | Relleno de los botones CTA con texto (Cotizar, WhatsApp del nav/hero) y texto rojo pequeño sobre claro (etiquetas, eyebrow) |
| Rojo profundo hover | `#A80019` | `--color-rojo-hover` | Estado hover/active del CTA relleno |

### Contraste verificado (WCAG 2.1 AA)

Umbrales: 4.5:1 texto normal, 3:1 texto grande (>= 24px regular o >= 18.66px con peso 700; Gloock cuenta como grande desde 24px) y 3:1 para componentes no textuales (bordes, iconos, anillo de foco).

| Texto / elemento | Fondo | Ratio | Resultado | Uso permitido |
|------------------|-------|-------|-----------|---------------|
| `#0a0a0a` negro | `#E3E1DE` hueso | 15.17 | Pasa AAA | Todo texto |
| `#0a0a0a` negro | `#F5F5F5` papel | 18.16 | Pasa AAA | Todo texto |
| `#1C1C1C` texto oscuro actual | `#E3E1DE` hueso | 13.06 | Pasa AAA | Todo texto (se puede unificar en negro) |
| `#5C5854` piedra | `#E3E1DE` hueso | 5.40 | Pasa AA | Texto secundario |
| `#5C5854` piedra | `#F5F5F5` papel | 6.47 | Pasa AA | Texto secundario |
| `#6B6661` borde control | `#E3E1DE` hueso | 4.35 | No pasa como texto; pasa 3:1 no textual | Solo bordes de control |
| `#888888` gris claro actual | `#E3E1DE` hueso | 2.72 | FALLA | Prohibido como texto sobre claro |
| `#F5F5F5` papel | `#0a0a0a` negro | 18.16 | Pasa AAA | Todo texto |
| `#F5F5F5` papel | `#161616` carbón | 16.60 | Pasa AAA | Todo texto |
| `#9A9794` ceniza | `#0a0a0a` negro | 6.81 | Pasa AA | Texto secundario oscuro |
| `#9A9794` ceniza | `#161616` carbón | 6.23 | Pasa AA | Texto secundario oscuro |
| `#F11E24` rojo marca | `#E3E1DE` hueso | 3.25 | FALLA texto normal; pasa texto grande y no textual | Números de sección >= 24px, líneas, foco, icono |
| `#F11E24` rojo marca | `#F5F5F5` papel | 3.89 | FALLA texto normal; pasa texto grande y no textual | Igual que sobre hueso |
| `#F11E24` rojo marca | `#0a0a0a` negro | 4.67 | Pasa AA | Etiquetas/eyebrow pequeñas sobre negro |
| `#F11E24` rojo marca | `#161616` carbón | 4.27 | FALLA texto normal | Solo líneas o texto >= 24px sobre carbón |
| `#C0001F` rojo profundo | `#E3E1DE` hueso | 4.93 | Pasa AA | Etiquetas/eyebrow pequeñas sobre hueso |
| `#C0001F` rojo profundo | `#F5F5F5` papel | 5.91 | Pasa AA | Etiquetas/eyebrow pequeñas sobre papel |
| `#C0001F` rojo profundo | `#0a0a0a` negro | 3.07 | FALLA texto normal | No usar sobre negro, ahí va `#F11E24` |
| `#F5F5F5` papel | `#C0001F` relleno CTA | 5.91 | Pasa AA | Texto del botón CTA |
| `#FFFFFF` blanco | `#C0001F` relleno CTA | 6.44 | Pasa AA | Alternativa de texto del CTA |
| `#F5F5F5` papel | `#A80019` hover CTA | 7.19 | Pasa AA | Texto del CTA en hover |
| `#FFFFFF` / `#F5F5F5` | `#F11E24` rojo marca | 4.24 / 3.89 | FALLA texto normal; pasa 3:1 no textual | Solo el icono del botón flotante, nunca texto |
| `#0a0a0a` negro | `#F11E24` rojo marca | 4.67 | Pasa AA | Permitido, pero no es el estilo elegido |

**Regla del rojo (consecuencia de la tabla):** `#F11E24` nunca se usa como texto pequeño sobre claro ni sobre carbón, ni como fondo de un botón con texto. Texto rojo pequeño sobre hueso/papel = `#C0001F`. Texto rojo pequeño sobre negro = `#F11E24`. Botón CTA con texto = relleno `#C0001F` + texto `#F5F5F5`. El rojo de marca puro queda para líneas, números grandes, foco e iconos, donde basta 3:1.

## Tokens - Tipografía

### Gloock - Display y titulares. Un solo peso (400) y sin cursiva. Serifa de alto contraste con remates afilados: voz de galería y revista de diseño, con más cuerpo que una serifa ligera para que se sostenga junto al acero. Elegida para no sonar a la tipografía por defecto de las páginas hechas con IA (Cormorant, Playfair, Instrument Serif, Fraunces). · `--font-serif`
- **Pesos:** 400 (el token --fw-light cae en 400; no existe más ligera)
- **Tamaños:** 22px, 32px, 48px, 64-88px; hero limitado por el ancho de "Transformamos" (7.3em)
- **Interlineado:** 0.95 (display), 1.05 (heading-lg), 1.15 (heading), 1.25 (subheading)
- **Tracking:** -0.01em en display, -0.005em en titulares, normal en headings (Gloock ya es compacta)
- **Énfasis:** la palabra en `<em>` va sin cursiva y en `--color-enfasis` (rojo `#C0001F` sobre claro, `#F11E24` sobre negro, gris `#5C5854` cuando el énfasis es una frase larga, como en Nosotros)
- **Rol:** hero, titulares de sección (h2), bloque declaración, nombres de producto, números de sección grandes

### Schibsted Grotesk - Todo lo demás: cuerpo, navegación, etiquetas, botones, datos. Grotesca neutra diseñada para medios noruegos; lectura precisa sin la cara genérica de Inter. Variable 400-900; se usan 400 (cuerpo) y 500 (nav, etiquetas, botones). Nunca 600 o más. · `--font-sans`
- **Pesos:** 400, 500
- **Tamaños:** 11px, 12px, 14px, 16px, 18px
- **Interlineado:** 1.3 (etiquetas), 1.6 (cuerpo)
- **Tracking:** normal en cuerpo; +0.18em en mayúsculas de 11-12px (etiquetas, nav, botones); +0.12em en mayúsculas de 14px
- **OpenType:** `"tnum" on` en cifras de contacto y horario

**Fuentes locales:** ambas se alojan en `assets/fonts/` (woff2, subconjunto latino, licencia OFL, 64 KB en total) y se precargan. Sin peticiones a Google: Lighthouse móvil pasó de 92 a 97 (LCP 3.2 s a 2.4 s).

### Escala tipográfica

Nombres compatibles con el CLAUDE.md del proyecto (`--text-*` con `clamp()`). Valores mínimo a 375px y máximo a 1280px o más.

| Rol | Familia | Peso | Tamaño (min - max) | Interlineado | Tracking | Token |
|-----|---------|------|--------------------|--------------|----------|-------|
| etiqueta | Schibsted | 500 | 11 - 12px | 1.3 | +0.18em, mayúsculas | `--text-xs` |
| cuerpo-sm | Schibsted | 400 | 14 - 15px | 1.6 | normal | `--text-sm` |
| cuerpo | Schibsted | 400 | 16 - 18px | 1.6 | normal | `--text-base` |
| subtítulo | Gloock | 400 | 20 - 24px | 1.25 | normal | `--text-lg` |
| heading | Gloock | 400 | 28 - 36px | 1.15 | -0.01em | `--text-xl` |
| heading-lg | Gloock | 400 | 40 - 64px | 1.05 | -0.015em | `--text-2xl` |
| sección | Gloock | 400 | 48 - 88px | 1.0 | -0.02em | `--text-3xl` |
| display (hero) | Gloock | 400 | 56 - 140px | 0.95 | -0.01em | `--text-display` |

Cuerpo de texto nunca por debajo de 14px ni por encima de 18px. Mayúsculas espaciadas solo en etiquetas, nav, botones y enlaces de footer, nunca en titulares ni en cuerpo.

## Tokens - Espaciado y formas

**Densidad:** cómoda, con aire de galería

### Escala de espaciado

Mapeo de la escala de Arc (4 / 10 / 20 / 36 / 72 / 100 / 215px) a los nombres del CLAUDE.md.

| Nombre | Valor | Equivalente Arc | Uso |
|--------|-------|-----------------|-----|
| `--space-xs` | 0.25rem (4px) | 4 | Separación icono-texto |
| `--space-sm` | 0.625rem (10px) | 9-10 | Etiqueta a titular, gap interno de botón |
| `--space-md` | 1.25rem (20px) | 18-20 | Gap entre elementos, padding de tarjeta, gutter móvil |
| `--space-lg` | 2.25rem (36px) | 30-36 | Gap de filas del grid, gutter desktop |
| `--space-xl` | clamp(3rem, 2.2rem + 3.4vw, 4.5rem) (48-72px) | 45-72 | Titular a contenido |
| `--space-2xl` | clamp(4.5rem, 3.3rem + 5vw, 6.25rem) (72-100px) | 72-100 | Padding vertical de banda estándar |
| `--space-3xl` | clamp(6rem, 2.6rem + 14.5vw, 13.4rem) (96-215px) | 215 | Padding de banda "silencio" (declaración) |

### Radios

| Elemento | Valor | Token |
|----------|-------|-------|
| Botones, selector de idioma, controles | 5px | `--radio-control` |
| Toda fotografía contenida (catálogo, nosotros, expo, mapa) | 32px | `--radio-imagen` |
| Líneas del botón hamburguesa | 2px | `--radio-linea` |
| Botón WhatsApp flotante | 50% (círculo) | excepción geométrica, no es un radio intermedio |
| Hero, bandas, tarjetas de texto | 0 | - |

Nunca un radio entre 6px y 31px. En móvil las imágenes conservan 32px.

### Sombras

| Nombre | Valor | Token |
|--------|-------|-------|
| flotante | `0 10px 15px -3px rgba(10, 10, 10, 0.12)` | `--sombra-flotante` |

Única sombra del sistema, solo para el botón WhatsApp flotante (necesita separarse de cualquier fondo). La sombra de contacto de los muebles vive dentro de la fotografía de estudio, no en CSS. Se eliminan `--sombra-fuerte`, `--elev-reposo`, `--elev-hover` y `--elev-superficie`.

### Layout

- **Ancho máximo:** 1280px (`--ancho-contenedor`), columnas de texto largo 720px (`--ancho-texto`)
- **Gutter:** 20px en móvil, 36px desde 768px
- **Gap de sección:** `--space-2xl` estándar, `--space-3xl` en la banda declaración
- **Padding de tarjeta:** 20px
- **Gap entre elementos:** 18-20px
- **Breakpoints:** 480px, 768px, 1024px, 1280px (mobile-first)

## Componentes

### Nav
**Rol:** logo + enlaces + idioma + CTA WhatsApp

Transparente sobre el hero con texto `#0a0a0a` (el hero es claro). Al pasar el hero: fondo `#F5F5F5` sólido con hairline inferior `#D6D3CF`, sin blur ni sombra. Altura 72px. Logo a la izquierda, enlaces al centro (desktop), idioma + CTA a la derecha. En móvil: logo + hamburguesa.

### Enlace de navegación (ghost)
**Rol:** Nosotros, Productos, Galería, Contacto

Schibsted Grotesk 500 12px mayúsculas +0.18em, `#0a0a0a`, sin borde ni fondo. Hover: línea de 1px `#F11E24` que crece desde la izquierda bajo el texto (0.3s ease). Área táctil mínima 44px.

### Botón CTA relleno
**Rol:** WhatsApp en nav y hero, "Cotizar" principal

Fondo `#C0001F`, texto `#F5F5F5` Schibsted Grotesk 500 12px mayúsculas +0.18em, radio 5px, padding 16px x 28px, alto mínimo 48px. Hover/active `#A80019`. Sin sombra. Un solo CTA relleno visible por pantalla.

### Botón de contorno
**Rol:** acciones secundarias ("Ver catálogo", "Ver en mapa")

Transparente, borde 1px `#0a0a0a` (sobre claro) o `#F5F5F5` (sobre negro), texto del mismo color, radio 5px, mismo padding y tipografía que el CTA. Hover: se invierte (fondo del color del borde, texto del fondo). Es el botón por defecto; el relleno rojo es la excepción.

### Enlace "Cotizar" de producto
**Rol:** CTA dentro de cada pieza del catálogo

Texto Schibsted Grotesk 500 12px mayúsculas +0.18em `#0a0a0a` seguido de una línea de 24px `#F11E24` que se alarga a 40px en hover. Abre WhatsApp con el nombre de la pieza prellenado.

### Botón WhatsApp flotante
**Rol:** contacto permanente, esquina inferior derecha

Círculo de 56px, fondo verde WhatsApp `#25D366` (decisión del usuario: se conserva por reconocimiento inmediato; única excepción cromática del sistema), icono `#FFFFFF`, `--sombra-flotante`, `aria-label`. Sin pulso infinito; como mucho una aparición de 0.6s al cargar.

### Hero "Galería de luz"
**Rol:** apertura imponente

100vw x 100svh, imagen o video a sangre con `object-fit: cover`, sin radio, sin `brightness()` ni degradado negro. Video en desktop (16:9) y en móvil (9:16 propio); póster estático solo con `prefers-reduced-motion` o ahorro de datos. Texto `#0a0a0a` en la zona clara del muro: en desktop abajo a la izquierda a `--space-lg` de los bordes; en móvil arriba, bajo el nav (el mueble queda en el tercio inferior). Orden: etiqueta (línea roja + texto negro) + titular display Gloock + CTA relleno + botón de contorno. Botón de pausa del video (WCAG 2.2.2) de 44px y radio 5px. Si la zona del muro baja de 4.5:1 contra el texto pequeño, se ajusta el encuadre de la imagen, no se oscurece la foto.

### Etiqueta meta (eyebrow)
**Rol:** antetítulo de sección ("01 - Nosotros", "Hecho en Jalisco")

Schibsted Grotesk 500 11-12px mayúsculas +0.18em. Precedida por una línea de 24px x 1px `#F11E24`. Color del texto: `#C0001F` sobre claro, `#F11E24` sobre negro, o `#0a0a0a`/`#F5F5F5` si la línea roja ya da el acento (preferido: una sola nota roja por grupo).

### Número de sección
**Rol:** 01, 02, 03... junto al h2

Gloock a 32px o más, `#F11E24` (pasa como texto grande: 3.25 sobre hueso, 3.89 sobre papel, 4.67 sobre negro). Si se usa a menos de 24px, pasa a `#C0001F` sobre claro.

### Bloque declaración
**Rol:** momento de silencio tras el hero

Banda `#F5F5F5`, padding `--space-3xl`, texto centrado máximo 720px, Gloock `--text-2xl` con una palabra de énfasis en rojo ("Hecho a mano en Jalisco, pensado para durar *décadas*"). Nada más en la banda.

### Pieza de catálogo
**Rol:** 6 productos del catálogo

Marco de imagen 4:5 con radio 32px mostrando la foto de estudio; en hover (desktop, `(hover: hover)`) se funde a la foto de ambiente; en táctil, al abrir la pieza. Debajo, sin tarjeta ni borde: nombre en Gloock `--text-lg`, línea (material o colección) en Schibsted Grotesk 400 `--text-sm` `#5C5854`, y enlace "Cotizar". Sin precios. Grid: 1 columna móvil, 2 desde 768px, 3 desde 1024px, gap `--space-md` columnas y `--space-lg` filas.

### Marco de imagen
**Rol:** fotografía en Nosotros, Expo, Galería

Radio 32px, sin borde, sin sombra, sin chrome. La foto es la superficie. `overflow: hidden` para el crossfade.

### Divisor hairline
**Rol:** separadores y retícula

1px `#D6D3CF` sobre claro, `rgba(245,245,245,0.14)` sobre negro. Sin degradados.

### Selector de idioma ES/EN
**Rol:** i18n existente

Dos botones de texto Schibsted Grotesk 500 11px +0.18em; el activo en `#0a0a0a` con subrayado rojo de 1px, el inactivo en `#5C5854`. Contenedor opcional con borde 1px `#6B6661` y radio 5px.

### Botón hamburguesa
**Rol:** menú móvil

Dos líneas de 1px x 20px `#0a0a0a`, radio 2px, área táctil 44px, `aria-label` y `aria-expanded`. Se transforman en X en 0.3s.

### Enlace de footer
**Rol:** redes y navegación del footer

Schibsted Grotesk 500 12px mayúsculas +0.18em `#F5F5F5` sobre negro, gap 20px, sin separadores ni viñetas. Hover: `#F11E24` solo en la línea inferior, no en el texto.

## Do's and Don'ts

### Do
- Usar solo Gloock (titulares) y Schibsted Grotesk (todo lo demás), alojadas en assets/fonts. Máximo 2 familias
- Titulares display en Gloock, tracking -0.005em a -0.01em; el contraste afilado es la firma
- Radio 5px en controles y 32px en toda fotografía contenida, nada intermedio
- Alternar bandas hueso `#E3E1DE` / papel `#F5F5F5` con bandas negras `#0a0a0a`; sin grises intermedios de puente
- Reservar el rojo para CTAs y detalles (líneas, números, etiquetas, foco); una nota roja por grupo visual
- Texto rojo pequeño: `#C0001F` sobre claro, `#F11E24` sobre negro
- Mayúsculas espaciadas (+0.18em) solo en etiquetas, nav, botones y footer
- Dejar que la fotografía de estudio (fondo hueso) y de ambiente (galería de yeso) cargue el peso visual
- Hairlines de 1px `#D6D3CF` para todos los divisores

### Don't
- Nunca rojo en párrafos, titulares completos ni como fondo de sección
- Nunca `#F11E24` como texto de menos de 24px sobre hueso, papel o carbón; nunca como fondo de un botón con texto
- Nunca `#888888` como texto sobre claro (2.72:1)
- Nunca pesos 600 o más; Gloock solo 400, Schibsted Grotesk 400/500
- Nunca sombras, glows, blur ni glassmorphism fuera del botón flotante
- Nunca radios entre 6 y 31px
- Nunca oscurecer el hero con `brightness()` o degradados negros para poder poner texto blanco
- Nunca texto centrado de más de dos líneas; el texto largo va alineado a la izquierda en columna de 720px
- Nunca ilustraciones, iconos decorativos, renders 3D con look de render ni stock genérico; solo fotografía y tipografía
- Nunca mezclar fotos de estudio con fondos distintos ni con proporciones distintas a 4:5 en el mismo grid
- Nunca cuerpo de texto por debajo de 14px ni por encima de 18px

## Surfaces

| Nivel | Nombre | Valor | Propósito |
|-------|--------|-------|-----------|
| 0 | Lienzo | `#E3E1DE` | Bandas claras por defecto (Nosotros, Contacto); mismo tono que el fondo de estudio y el muro del hero |
| 1 | Papel | `#F5F5F5` | Bandas de respiro (declaración, catálogo), nav fijo; hace que las fotos de estudio hueso se lean como piezas enmarcadas |
| 2 | Banda negra | `#0a0a0a` | Bandas oscuras de ritmo (Galería/Expo, footer) |
| 3 | Carbón | `#161616` | Paneles elevados dentro de la banda negra (mapa, tarjeta de datos) |

**Ritmo recomendado de bandas:** Hero (foto clara a sangre) -> Declaración (papel) -> Nosotros (hueso) -> Catálogo (papel) -> Galería/Expo (negro) -> Contacto (hueso) -> Footer (negro). Nunca dos bandas negras seguidas; dos bandas claras seguidas solo si cambian de hueso a papel. El catálogo es una sola banda papel: encabezado, índice y las tres salas (Nexo, Kai, Industrial) separadas por aire y una hairline `#D6D3CF`, nunca con bandas negras ni hueso (en hueso las fotos de estudio se pierden). Expo sigue siendo la banda negra. El catÃ¡logo es una sola banda papel: encabezado, Ã­ndice y las tres salas (Nexo, Kai, Industrial) separadas por aire y una hairline `#D6D3CF`, nunca con bandas negras ni hueso (en hueso las fotos de estudio se pierden). Expo sigue siendo la banda negra.

## Elevation

MEDEISA evita la sombra casi por completo. La profundidad sale de los saltos tonales entre hueso, papel, negro y carbón, y de la luz dentro de la fotografía (sombras de ventana, sombra de contacto), no del CSS. La única sombra CSS es la del botón WhatsApp flotante.

## Imagery

La fotografía es el medio visual principal y siempre muestra el mueble como pieza de museo. La única energía cromática del sistema viene de los materiales: la madera (parota, chapa) y el acero negro. Tratamiento naturalista y cálido, sin saturar, sin HDR, sin viñeta fuerte. Sin personas, sin texto dentro de la imagen, sin marcas de agua.

### Estudio (grid del catálogo)
- **Proporción:** 4:5 exacta, exportar 1600x2000 y 800x1000, WebP calidad ~80, menos de 250 KB la grande
- **Fondo:** hueso `#E3E1DE` uniforme, sin horizonte visible; se permite solo la transición muy suave muro -> piso que genera `scripts/estudio.py` (idéntica en las 6 piezas, unos 10 niveles más oscura abajo), nunca degradados propios por foto
- **Sombra:** una sola sombra de contacto suave bajo patas/base, misma dirección y opacidad en las 6 piezas
- **Encuadre:** pieza centrada ocupando ~72% del ancho (piezas altas limitadas a ~62% de alto), vista 3/4 frontal a altura media, mismo punto de apoyo en todas (y = 1450 de 2000, ver `scripts/estudio.py`)
- **Luz:** difusa, suave, desde la izquierda
- **Producción:** unificar LOCALMENTE a partir de los recortes existentes (sin créditos Higgsfield)

### Ambiente (hover / al abrir)
- **Proporción:** 4:5 igual que estudio (necesario para el crossfade sin saltos)
- **Escena única para las 6 piezas:** galería de muros de yeso hueso, piso de concreto claro pulido, luz rasante de tarde entrando por una ventana a la izquierda que proyecta sombras de marco diagonales en muro y piso, un solo objeto decorativo (cerámica mate o rama seca), nada más
- **Fidelidad:** el mueble debe quedar idéntico a la foto real (forma, veta y tono de madera, perfil y acabado del acero)
- **Producción:** Higgsfield con la foto real como referencia, solo con cotización aprobada

### Hero
- **Escena:** misma galería de yeso, Centro de TV Catania como única pieza, luminosa, sombras de ventana
- **Formatos:** 16:9 a 2560px de ancho para desktop (zona de muro despejada en la mitad izquierda, texto abajo a la izquierda); 9:16 propio para móvil (generado aparte, no recorte), con muro despejado en el 60% superior para el texto
- **Video:** cámara fija, solo avanzan las sombras (Kling 3.0 std, 5s, sin audio), en bucle suave. Dos versiones: 16:9 desktop y 9:16 móvil (~720x1280, H.264 MP4 + WebM, < 1.5 MB). Póster estático solo con `prefers-reduced-motion` o Save-Data

## Layout

Hero a sangre completa (100vw x 100svh); todo lo demás contenido en 1280px con gutter de 20/36px, y texto largo en 720px. El hero lleva el texto abajo a la izquierda sobre el muro claro, nunca centrado sobre el mueble. Tras el hero, una banda de papel con una sola frase centrada (el silencio). Nosotros en hueso con texto a la izquierda y marco de imagen de 32px. Catálogo en papel con grid 1/2/3 columnas. Galería/Expo en banda negra con marcos de 32px. Contacto en hueso con mapa en marco de 32px. Footer negro. Nav transparente sobre el hero y sólido papel después, sin mega-menú.

## Agent Prompt Guide

**Referencia rápida de color**
- texto: `#0a0a0a` (claro) / `#F5F5F5` (oscuro)
- secundario: `#5C5854` (claro) / `#9A9794` (oscuro)
- fondos: `#E3E1DE` lienzo / `#F5F5F5` papel / `#0a0a0a` banda oscura / `#161616` panel
- borde: `#D6D3CF` hairline / `#0a0a0a` botón de contorno
- acento: `#F11E24` (líneas, números grandes, foco, icono flotante) y `#C0001F` (texto rojo pequeño sobre claro, relleno de CTA)

**3 prompts de ejemplo**

1. **Hero galería de luz:** imagen a sangre 100svh de un muro de yeso hueso con luz rasante de tarde y el Centro de TV Catania en el tercio inferior derecho. A la izquierda (centrado en el alto desde 1280px apaisado, abajo en pantallas menores): línea roja 24px + etiqueta Schibsted Grotesk 500 11px +0.18em `#0a0a0a` "MUEBLERÍA INDUSTRIAL · OCOTLÁN, JALISCO" (texto negro: sobre el muro con sombras de ventana el `#C0001F` puede bajar de 4.5:1); titular Gloock `--text-display` `#0a0a0a` "Transformamos acero en *estilo*"; CTA relleno `#C0001F` "COTIZAR POR WHATSAPP" y botón de contorno negro "VER CATÁLOGO".
2. **Bloque declaración:** banda `#F5F5F5`, padding `--space-3xl`, texto centrado máx 720px, Gloock `--text-2xl` `#0a0a0a`, dos líneas. Nada más.
3. **Pieza de catálogo:** marco 4:5 radio 32px con foto de estudio sobre hueso; hover funde a ambiente en 0.6s. Debajo: nombre Gloock 400 `--text-lg`, línea Schibsted Grotesk 400 `--text-sm` `#5C5854`, enlace "COTIZAR" Schibsted Grotesk 500 12px con línea roja de 24px.

## Animation

Quietud con una sola entrada elegante. El mueble y la luz son los que se mueven (video del hero), la interfaz casi no.

- **Entrada al hacer scroll:** `opacity 0 -> 1` + `translateY(16px) -> 0`, 0.6s, `cubic-bezier(0.22, 1, 0.36, 1)` (desaceleración sin sobrepaso, sin rebote), una sola vez, con Intersection Observer (threshold ~0.15). Escalonado máximo 80ms entre hermanos, máximo 4 hermanos escalonados.
- **Hover:** 0.3s ease en color, borde y longitud de líneas. Sin escalar botones.
- **Crossfade estudio -> ambiente:** opacidad 0.6s ease, sin zoom.
- **Prohibido:** rebotes, springs con sobrepaso, parallax, pulsos infinitos, animación de titulares letra por letra.
- **`prefers-reduced-motion: reduce`:** sin desplazamiento (solo opacidad en 200ms o aparición directa), crossfade instantáneo, video del hero reemplazado por su póster.

## Similar Brands

- **Arc** - estructura de referencia: galería industrial, radios 5/32, bandas claras y oscuras, cero sombra
- **Vitra / USM** - mueble como objeto de exhibición sobre fondos neutros y luz controlada
- **Aesop** - hueso cálido, serif ligera, restricción absoluta del color

## Quick Start

### CSS Custom Properties

```css
:root {
  /* Colores - marca */
  --color-negro: #0a0a0a;
  --color-rojo: #F11E24;          /* detalles, números >= 24px, foco, icono flotante */
  --color-rojo-texto: #C0001F;    /* texto rojo pequeño sobre claro, relleno CTA */
  --color-rojo-hover: #A80019;
  --color-blanco: #F5F5F5;        /* papel */
  --color-hueso: #E3E1DE;         /* lienzo y fondo de estudio */
  --color-carbon: #161616;

  /* Colores - texto y líneas */
  --color-texto: var(--color-negro);
  --color-texto-invertido: var(--color-blanco);
  --color-texto-secundario: #5C5854;         /* 5.40 sobre hueso, 6.47 sobre papel */
  --color-texto-secundario-oscuro: #9A9794;  /* 6.81 sobre negro */
  --color-linea: #D6D3CF;
  --color-linea-oscura: rgba(245, 245, 245, 0.14);
  --color-borde-control: #6B6661;

  /* Superficies */
  --superficie-lienzo: var(--color-hueso);
  --superficie-papel: var(--color-blanco);
  --superficie-oscura: var(--color-negro);
  --superficie-panel: var(--color-carbon);

  /* Tipografía - familias */
  --font-serif: 'Gloock', Georgia, 'Times New Roman', serif;
  --font-sans: 'Schibsted Grotesk', 'Helvetica Neue', 'Segoe UI', system-ui, sans-serif;

  /* Tipografía - pesos */
  --fw-light: 300;
  --fw-regular: 400;
  --fw-medium: 500;

  /* Tipografía - escala fluida (375px -> 1280px) */
  --text-xs: clamp(0.6875rem, 0.66rem + 0.11vw, 0.75rem);     /* 11-12 */
  --text-sm: clamp(0.875rem, 0.85rem + 0.11vw, 0.9375rem);    /* 14-15 */
  --text-base: clamp(1rem, 0.95rem + 0.22vw, 1.125rem);       /* 16-18 */
  --text-lg: clamp(1.25rem, 1.15rem + 0.44vw, 1.5rem);        /* 20-24 */
  --text-xl: clamp(1.75rem, 1.54rem + 0.88vw, 2.25rem);       /* 28-36 */
  --text-2xl: clamp(2.5rem, 1.88rem + 2.65vw, 4rem);          /* 40-64 */
  --text-3xl: clamp(3rem, 1.96rem + 4.42vw, 5.5rem);          /* 48-88 */
  --text-display: clamp(3.5rem, 1.33rem + 9.28vw, 8.75rem);   /* 56-140 */

  --leading-display: 0.95;
  --leading-titulo: 1.05;
  --leading-heading: 1.15;
  --leading-cuerpo: 1.6;
  --leading-etiqueta: 1.3;

  --tracking-display: -0.02em;
  --tracking-titulo: -0.015em;
  --tracking-heading: -0.01em;
  --tracking-etiqueta: 0.18em;

  /* Espaciado */
  --space-xs: 0.25rem;
  --space-sm: 0.625rem;
  --space-md: 1.25rem;
  --space-lg: 2.25rem;
  --space-xl: clamp(3rem, 2.2rem + 3.4vw, 4.5rem);
  --space-2xl: clamp(4.5rem, 3.3rem + 5vw, 6.25rem);
  --space-3xl: clamp(6rem, 2.6rem + 14.5vw, 13.4rem);

  /* Layout */
  --ancho-contenedor: 1280px;
  --ancho-texto: 720px;
  --padding-contenedor: var(--space-md);      /* 36px (--space-lg) desde 768px */
  --altura-nav: 4.5rem;

  /* Radios */
  --radio-control: 5px;
  --radio-imagen: 32px;
  --radio-linea: 2px;

  /* Sombra (solo botón flotante) */
  --sombra-flotante: 0 10px 15px -3px rgba(10, 10, 10, 0.12);

  /* Foco */
  --foco: 2px solid var(--color-rojo);
  --foco-offset: 3px;

  /* Movimiento */
  --curva-entrada: cubic-bezier(0.22, 1, 0.36, 1);
  --transicion-hover: 0.3s ease;
  --transicion-entrada: 0.6s var(--curva-entrada);
  --desplazamiento-entrada: 16px;
  --escalonado: 80ms;
}

@media (min-width: 768px) {
  :root { --padding-contenedor: var(--space-lg); }
}
```

### Carga de fuentes

```html
<link rel="preload" href="assets/fonts/gloock-latin.woff2" as="font" type="font/woff2" crossorigin />
<link rel="preload" href="assets/fonts/schibsted-grotesk-latin.woff2" as="font" type="font/woff2" crossorigin />
```

Los `@font-face` viven al inicio de css/styles.css. Sin Google Fonts.
