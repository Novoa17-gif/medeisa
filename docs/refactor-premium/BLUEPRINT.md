# Blueprint del refactor premium MEDEISA

Plan sección por sección para la Fase 3. Fuentes: `SPEC.md` (gana siempre), `DESIGN.md` (sistema), `ref-arc-DESIGN.md` (estructura), `HIGGSFIELD-PLAN.md` (assets). Referencias `archivo:línea` tomadas del estado del repo al 2026-09-22 (rama `refactor/premium`, commit `62aaf7c`).

---

## 0. Decisiones transversales

### 0.1 Ritmo de bandas (toda la página)

| # | Sección | id (se conserva) | Banda | Fondo | Número |
|---|---------|------------------|-------|-------|--------|
| 1 | Nav | `encabezado` | transparente sobre hero, papel después | - / `#F5F5F5` | - |
| 2 | Hero "Galería de luz" | (nuevo `inicio`) | foto clara a sangre | imagen/video | - |
| 3 | Declaración (NUEVA) | - | papel | `#F5F5F5` | - |
| 4 | Nosotros | `nosotros` | hueso | `#E3E1DE` | 01 |
| 5 | Catálogo | `productos` | papel | `#F5F5F5` | 02 |
| 6 | Expo / Galería | `galeria` | NEGRA | `#0a0a0a` | 03 |
| 7 | Contacto | `contacto` | hueso | `#E3E1DE` | 04 |
| 8 | Footer | - | NEGRA | `#0a0a0a` | - |

Cumple las reglas de DESIGN: nunca dos negras seguidas; claras seguidas solo alternando papel/hueso. Los ids `nosotros`, `productos`, `galeria`, `contacto` NO se renombran (anclas del nav, footer, enlaces externos y buscadores).

### 0.2 Nomenclatura

Se mantiene el patrón que ya usa el proyecto: `bloque__elemento--modificador`, con cada palabra en kebab-case y en español. Nombres nuevos en español (`nav__enlace`, no `nav__link`). Ojo: `.encabezado` ya es el header fijo del sitio; el encabezado de cada sección se llama `.cabecera-seccion` para no chocar.

### 0.3 Componentes compartidos (se crean en el paso 0, los usan todas las secciones)

| Clase | Qué es | Reglas clave |
|-------|--------|--------------|
| `.cabecera-seccion` | Contenedor de número + etiqueta + h2 | Alineada a la izquierda, `margin-bottom: var(--space-xl)` |
| `.numero-seccion` | "01", "02"... | Cormorant 300, >= 32px, `#F11E24` (texto grande: pasa sobre hueso, papel y negro) |
| `.etiqueta` + `.etiqueta__linea` | Eyebrow | Jost 500 `--text-xs` mayúsculas +0.18em; línea 24x1px `#F11E24`; texto `--color-texto` (claro) o `--color-texto-invertido` (negro). Una sola nota roja por grupo: si ya hay número rojo, la etiqueta va sin texto rojo |
| `.titulo-seccion` | h2 | Cormorant 300 `--text-3xl`, `--leading-titulo`, `--tracking-display`; `<em>` cursiva 300 para una palabra |
| `.btn` | Base de botón | Jost 500 12px mayúsculas +0.18em, radio 5px, padding 16x28, `min-height: 48px`, sin sombra, sin `translateY`, sin `scale` en hover |
| `.btn--relleno` | CTA rojo | Fondo `--color-rojo-texto` (#C0001F), texto papel; hover/active `--color-rojo-hover` |
| `.btn--contorno` | Botón por defecto | Borde 1px `--color-negro`, texto negro; hover invierte. `.btn--contorno-claro` para bandas negras (borde y texto papel) |
| `.enlace-cotizar` + `.enlace-cotizar__linea` | CTA de pieza | Texto Jost 500 12px, línea roja 24px que crece a 40px en hover/focus |
| `.marco-imagen` | Toda foto contenida | `border-radius: var(--radio-imagen)` (32px), `overflow: hidden`, sin borde ni sombra, fondo hueso mientras carga |
| `.animar-entrada` | Revelado al scroll | Ver 0.5 |

### 0.4 Regla de CTA relleno por pantalla

DESIGN pide "un solo CTA relleno visible por pantalla" y a la vez CTA relleno en nav y hero. Resolución: el CTA del nav está oculto mientras el hero es visible (el hero ya trae su CTA relleno) y aparece cuando el nav pasa a sólido. El nav es chrome fijo y no cuenta para la regla en las demás bandas. Catálogo usa `.enlace-cotizar` (no relleno); Contacto usa un relleno.

### 0.5 Movimiento global

- Revelado: `opacity 0 -> 1` + `translateY(var(--desplazamiento-entrada))` (16px, antes 24px `styles.css:205`), `var(--transicion-entrada)` con `--curva-entrada`, threshold 0.15, una sola vez.
- Escalonado: `transition-delay: calc(var(--orden, 0) * var(--escalonado))` en `.js .animar-entrada:not(.visible)` y `.animar-entrada.visible`; `--orden` se pone en el HTML (`style="--orden: 2"`), máximo 3. Se eliminan los `transition-delay` sueltos por elemento (hay más de 25 en `styles.css`).
- Regla nueva: `.animar-entrada` nunca va directo sobre un elemento interactivo (botón, enlace). Se envuelve. Así el retardo de entrada no contamina el hover y desaparece el parche `.contacto__btn-whatsapp.visible { transition-delay: 0s }` (`styles.css:2059`).
- `prefers-reduced-motion`: se conserva el bloque global `styles.css:127-144` (los `!important` están justificados ahí), se añade: crossfade instantáneo, video del hero no se carga.

---

## 1. Nav

### Estado actual
- HTML `index.html:69-132`: logo (PNG 2259x1535 de 682 KB, `index.html:74`), "pill" con cursor deslizante (`index.html:78-86`), selector ES/EN con `role="region"` (`index.html:89`), hamburguesa de 3 líneas, menú móvil fuera del header (`index.html:125-132`). No hay CTA de WhatsApp en el nav.
- CSS `styles.css:281-560`: logo forzado a blanco con `filter: brightness(0) invert(1)` (`:351`), glassmorphism (`:308-313`, `:355-365`, `:488-496`), cursor con curva de sobrepaso `cubic-bezier(0.34, 1.56, 0.64, 1)` (`:388`), sombra en `::after` (`:296-305`). Desktop desde 768px (`:528`).
- JS `main.js:25-86` (scroll listener para `.scrolled`, hamburguesa, Escape, IO de enlace activo) y `main.js:432-493` (pill + MutationObserver).

### Estado objetivo
- **Banda:** transparente sobre el hero (claro) con texto `#0a0a0a`; al salir del hero, fondo papel sólido + hairline inferior `--color-linea`. Sin blur, sin sombra. Altura 72px (`--altura-nav`).
- **Móvil (< 1024px):** logo izquierda; a la derecha selector ES/EN + hamburguesa de 2 líneas (1px x 20px, radio 2px). Menú: panel papel a ancho completo bajo el nav, enlaces en Cormorant 300 `--text-xl` alineados a la izquierda con hairlines entre ellos, y al final `.btn--relleno` "Cotizar por WhatsApp" a ancho completo.
- **Desktop (>= 1024px):** grid `1fr auto 1fr`: logo | 4 enlaces | idioma + CTA relleno compacto. Se sube el corte de 768 a 1024 porque logo + 4 enlaces con +0.18em + idioma + CTA no caben en 768px.
- **Tipografía:** enlaces Jost 500 12px mayúsculas +0.18em; hover y activo con línea 1px `#F11E24` que crece desde la izquierda (0.3s ease). Área táctil 44px.
- **Rojo:** línea de hover/activo, subrayado del idioma activo, relleno del CTA.

### Cambios concretos
- **HTML**
  - `<header class="encabezado">` + `<nav class="nav contenedor">` se conservan.
  - Logo: quitar el filtro (el PNG es oscuro, el footer lo invierte). Exportar `assets/logo/medeisa-logo.png` a 280px de ancho (2x de 140) y apuntar ahí; favicon a `assets/logo/favicon-32.png` y `favicon-180.png`.
  - Eliminar `.nav__pill` y `.nav__cursor`; la lista queda `<ul class="nav__enlaces">` con `<a class="nav__enlace">`.
  - Selector: `<div class="idioma" role="group" aria-label="Idioma / Language">` con `<button class="idioma__boton" lang="es">ES</button>` y `lang="en"`. Se quita `.hero__idioma-sep` (el activo se marca con subrayado rojo).
  - CTA nuevo: `<a class="btn btn--relleno nav__cta" data-wa="general" ...>` con texto i18n (`nav.cta`; el CTA del menú móvil usa la misma clave).
  - i18n del nav: conservar las claves actuales de los 4 enlaces (compartidas con el menú móvil) y añadir `nav.cta`, `nav.menu-abrir` / `nav.menu-cerrar` (`aria-label` de la hamburguesa según `aria-expanded`), `nav.idioma-aria` (grupo ES/EN) y `skip` (texto del skip link).
  - Hamburguesa: 2 `span.nav__hamburguesa-linea`.
  - Menú móvil: `<div class="menu-movil" id="menu-movil" hidden>` (usar `hidden`/`inert` en vez de solo `aria-hidden` + `visibility`), con `<ul class="menu-movil__enlaces">` + CTA.
  - Enlace activo: además de la clase, `aria-current="location"`.
- **CSS:** reescribir el bloque NAV completo (`styles.css:281-560`). Eliminar `.encabezado::after`, todos los `backdrop-filter` y sus `@media (prefers-reduced-transparency)`, `.nav__pill`, `.nav__cursor`, `.hero__idioma-*`. Nuevo modificador `.encabezado--solido` (sustituye `.scrolled`). `.nav__cta` oculto (`visibility: hidden; opacity: 0`) salvo en `.encabezado--solido`.
- **JS**
  - Sustituir el scroll listener (`main.js:34-39`) por un IntersectionObserver sobre `.hero` que alterna `.encabezado--solido` (regla del CLAUDE.md: IO, no scroll events).
  - Arreglar el IO de enlace activo: hoy observa `main [id]` (`main.js:69`), que incluye `nosotros-titulo`, `productos-titulo`, etc.; cuando uno de esos entra, apaga todos los enlaces. Observar solo `main > section[id]`.
  - Cerrar menú al pulsar enlace: una sola escucha delegada en el menú en lugar de un listener por enlace (`main.js:50-56`).
  - Eliminar `iniciarNavPill` completo (`main.js:425-493`) y el parámetro `recalcularCursor` de `iniciarIdioma`.

### Riesgos
- i18n: los enlaces del nav y del menú móvil comparten clave; al renombrar `.nav__link` hay que usar `data-i18n` (paso 0) para no perder la traducción.
- Accesibilidad: `aria-label="Español (idioma actual)"` no contiene el texto visible "ES" (WCAG 2.5.3). Usar texto visible "ES"/"EN", `lang` en cada botón y `aria-pressed`; el nombre accesible queda "ES".
- Contraste: el nav transparente depende de que el tercio superior del hero sea claro. Verificar con la imagen final.
- El logo actual de 682 KB se carga dos veces (nav y footer). Optimizarlo es el mayor ahorro barato de la página.

---

## 2. Hero "Galería de luz"

### Estado actual
- HTML `index.html:139-190`: overlay oscuro, eyebrow, wordmark "MEDEISA", divisor, h1 "Acero / en estilo", subtítulo, dos CTAs (contorno blanco a `#productos` y texto a WhatsApp), texto decorativo y línea de scroll pulsante.
- CSS `styles.css:563-938`: imagen en `.hero::before` como `background-image` (`hero-v4.jpeg`, `hero-phone.jpeg` en móvil `:887`) con `filter: saturate(0.75) brightness(0.82)` (`:584`), dos degradados negros (`:593-612` y `:892-901`), texto blanco con `text-shadow`.
- JS `main.js:92-101` revela los `.animar-entrada` del hero en el primer frame. i18n `main.js:152-158`, `main.js:298-304`.

### Estado objetivo
- **Banda:** foto clara a sangre, `100vw x 100svh`, sin radio. Sin `brightness()`, sin degradado, sin `text-shadow`. Texto `#0a0a0a`.
- **Desktop (>= 768px):** imagen 16:9 con el Centro de TV Catania en el tercio inferior derecho; bloque de texto abajo a la izquierda, a `--space-lg` de los bordes, `max-width` ~55% del ancho (zona de muro libre). Video encima de la imagen cuando se activa.
- **Móvil (< 768px):** imagen y video verticales 9:16 propios (SPEC: la mayoría del tráfico es móvil, el video también va en móvil); texto ARRIBA, bajo el nav, sobre la zona de muro despejada (el mueble queda en el tercio inferior).
- **Componentes (en orden):** `.etiqueta` (línea roja + texto NEGRO: sobre muro con sombras de ventana el `#C0001F` puede caer bajo 4.5:1), h1 display, fila de acciones `.btn--relleno` "Cotizar por WhatsApp" + `.btn--contorno` "Ver catálogo". Botón de pausa del video.
- **Tipografía:** h1 Cormorant 300 `--text-display` (56-140px), `--leading-display` 0.95, `--tracking-display`; una palabra en cursiva.
- **Rojo:** línea de la etiqueta y relleno del CTA. Nada más.
- **Texto propuesto** (ver dudas): etiqueta "Mueblería industrial · Ocotlán, Jalisco"; h1 "Transformamos acero en *estilo*".

### Estructura HTML

```html
<section class="hero" id="inicio" aria-labelledby="hero-titulo">
  <div class="hero__medio">
    <picture class="hero__poster">
      <source media="(max-width: 767px)" type="image/webp"
              srcset="assets/hero/hero-movil-720w.webp 720w, assets/hero/hero-movil-1080w.webp 1080w"
              sizes="100vw" />
      <source media="(max-width: 767px)"
              srcset="assets/hero/hero-movil-720w.jpg 720w, assets/hero/hero-movil-1080w.jpg 1080w"
              sizes="100vw" />
      <source type="image/webp"
              srcset="assets/hero/hero-1280w.webp 1280w, assets/hero/hero-1920w.webp 1920w, assets/hero/hero-2560w.webp 2560w"
              sizes="100vw" />
      <img class="hero__imagen"
           src="assets/hero/hero-1920w.jpg"
           srcset="assets/hero/hero-1280w.jpg 1280w, assets/hero/hero-1920w.jpg 1920w, assets/hero/hero-2560w.jpg 2560w"
           sizes="100vw" width="2560" height="1440"
           alt="Centro de TV Catania de acero negro y madera exhibido solo frente a un muro de yeso hueso con sombras de ventana"
           data-i18n-alt="hero.alt"
           fetchpriority="high" decoding="async" />
    </picture>
    <!-- Sin <source> en el HTML: JS inyecta la version 16:9 (>= 768px) o 9:16 (movil), nunca con reduced-motion ni Save-Data -->
    <video class="hero__video" autoplay muted loop playsinline preload="metadata"
           aria-hidden="true" tabindex="-1"
           data-fuente-webm="assets/hero/hero-luz.webm"
           data-fuente-mp4="assets/hero/hero-luz.mp4"
           data-fuente-movil-webm="assets/hero/hero-luz-movil.webm"
           data-fuente-movil-mp4="assets/hero/hero-luz-movil.mp4"></video>
  </div>

  <div class="hero__contenido contenedor">
    <p class="etiqueta hero__etiqueta animar-entrada">
      <span class="etiqueta__linea" aria-hidden="true"></span>
      <span data-i18n="hero.etiqueta">Mueblería industrial · Ocotlán, Jalisco</span>
    </p>
    <h1 class="hero__titulo animar-entrada" id="hero-titulo" style="--orden: 1"
        data-i18n-html="hero.titulo">Transformamos acero en <em>estilo</em></h1>
    <div class="hero__acciones animar-entrada" style="--orden: 2">
      <a class="btn btn--relleno" data-wa="general" href="https://wa.me/523921236728?text=..."
         target="_blank" rel="noopener noreferrer" data-i18n="hero.cta">Cotizar por WhatsApp</a>
      <a class="btn btn--contorno" href="#productos" data-i18n="hero.catalogo">Ver catálogo</a>
    </div>
  </div>

  <button class="hero__pausa" type="button" aria-pressed="false" hidden
          data-i18n-aria="hero.pausa" aria-label="Pausar animación de fondo">
    <span class="hero__pausa-icono" aria-hidden="true"></span>
  </button>
</section>
```

Por qué así:
- **Imagen primero, video después.** El `<picture>` es el LCP y el fallback universal (sin JS, reduced-motion, ahorro de datos, error de reproducción o autoplay bloqueado). El `<video>` se superpone con `opacity: 0` y hace fundido de 0.6s a 1 al disparar `playing`, así no hay salto.
- **`autoplay muted loop playsinline preload="metadata"`** quedan en el tag como pide el SPEC, pero sin `<source>` hijos: así nada se descarga antes de `load` ni con reduced-motion/Save-Data, y cada dispositivo baja solo su versión (16:9 o 9:16). Tampoco lleva atributo `poster` en el HTML (el navegador lo descargaría aunque el video esté oculto); JS asigna `video.poster = img.currentSrc` al activarlo, que ya está en caché.
- **Botón de pausa** (WCAG 2.2.2: contenido en movimiento que dura más de 5s y arranca solo). Control de 44px, radio 5px, esquina inferior derecha, visible solo cuando el video está activo. Queda por encima del botón flotante de WhatsApp (ajustar `bottom` para que no se solapen) o a la izquierda de él.

### Cambios concretos
- **HTML:** reemplazar `index.html:139-190` por la estructura de arriba. Eliminar `.hero__overlay`, `.hero__wordmark` (el logo ya está en el nav), `.hero__divisor`, `.hero__subtitulo` (su contenido pasa a la etiqueta), `.hero__deco-texto`, `.hero__scroll`.
- **CSS:** reescribir el bloque HERO completo (`styles.css:563-938`).
  - `.hero`: `position: relative; min-height: 100svh; display: grid;` `align-items: start` en móvil (texto arriba, `padding-top: calc(var(--altura-nav) + var(--space-lg))`), `align-items: end` desde 768px (`padding-bottom: var(--space-xl)`).
  - `.hero__medio`, `.hero__imagen`, `.hero__video`: `position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover;` con `object-position` en variable (`--hero-foco-x/y`) para ajustar encuadre sin tocar la foto. Móvil: foco centrado abajo; desktop: `right bottom`.
  - `.hero__video { opacity: 0; transition: opacity var(--transicion-entrada); }` y `.hero--video-activo .hero__video { opacity: 1; }`. `@media (prefers-reduced-motion: reduce) { .hero__video { display: none; } }` (el video SÍ se muestra en móvil).
  - `.hero__titulo`: `max-width: 11ch` aprox. para cortar en 2-3 líneas dentro del muro libre.
  - Eliminar: `.hero::before`, `.hero__overlay` (y su versión móvil), `.hero__wordmark`, `.hero__divisor`, `.hero__subtitulo`, `.hero__btn-primario`, `.hero__cta-ghost`, `.hero__deco-texto`, `.hero__scroll`, `.hero__scroll-linea`, `@keyframes pulso-linea`, los `transition-delay` por elemento y el `@media (min-width: 768px) .hero__titulo` suelto (`:934-938`).
- **JS**
  - Conservar `iniciarHero` (revelado inmediato).
  - Nuevo `iniciarVideoHero()`:
    1. Sale si `matchMedia('(prefers-reduced-motion: reduce)').matches` o `navigator.connection?.saveData`. Elige fuentes con `matchMedia('(min-width: 768px)')`: `data-fuente-webm|mp4` (16:9) o `data-fuente-movil-webm|mp4` (9:16). En `change` de esa media query (rotación, resize) cambia las fuentes y vuelve a llamar `load()`.
    2. Espera a `load` + `requestIdleCallback` (con fallback `setTimeout`) para no competir con el LCP.
    3. Crea las dos `<source>` (webm, luego mp4) en un `DocumentFragment`, asigna `poster = img.currentSrc`, `video.load()`, `video.play()` dentro de `try/catch` (la promesa puede rechazarse por políticas de autoplay: se queda la imagen).
    4. En `playing`: añade `.hero--video-activo` y muestra `.hero__pausa`.
    5. IO sobre `.hero`: pausa el video fuera de vista y lo reanuda al volver (si el usuario no lo pausó). También en `visibilitychange`.
    6. `matchMedia` de reduced-motion con `change`: si se activa, pausa y quita la clase.
    7. Botón de pausa alterna `video.pause()/play()` y `aria-pressed`; su `aria-label` viene de i18n.
  - i18n: claves nuevas `hero.etiqueta`, `hero.titulo` (html, lleva `<em>`), `hero.cta`, `hero.catalogo`, `hero.alt`, `hero.pausa`, `hero.reanudar`. Se borran `hero.titulo-l1`, `hero.titulo-l2`, `hero.subtitulo`, `hero.btn-prim`, `hero.cta-ghost`, `hero.deco`.

### Assets necesarios (carpeta nueva `assets/hero/`)

| Archivo | Tamaño px | Formato | Peso objetivo | Origen |
|---------|-----------|---------|---------------|--------|
| `hero-2560w.webp` / `.jpg` | 2560 x 1440 (16:9) | WebP q~80 / JPEG q~82 progresivo | < 350 KB webp, < 500 KB jpg | B1 aprobado (4k) reducido |
| `hero-1920w.webp` / `.jpg` | 1920 x 1080 | igual | < 220 KB webp | B1 |
| `hero-1280w.webp` / `.jpg` | 1280 x 720 | igual | < 120 KB webp | B1 |
| `hero-movil-1080w.webp` / `.jpg` | 1080 x 1920 (9:16) | igual | < 200 KB webp | B2 (ver nota) |
| `hero-movil-720w.webp` / `.jpg` | 720 x 1280 (9:16) | igual | < 110 KB webp | B2 |
| `hero-luz.mp4` | 1280 x 720 (std) o 1920 x 1080 (pro) | H.264, sin pista de audio, `+faststart`, loop 5s (start = end; 10s ping-pong solo si se usa el plan B) | < 2.5 MB | C1 |
| `hero-luz.webm` | igual que mp4 | VP9 (o AV1), sin audio | < 2 MB | C1 |
| `hero-luz-movil.mp4` | 720 x 1280 (9:16) | H.264, sin audio, `+faststart`, loop 5s | < 1.5 MB (SPEC) | C2 |
| `hero-luz-movil.webm` | 720 x 1280 (9:16) | VP9, sin audio | < 1.5 MB | C2 |
| `hero-og.jpg` | 1200 x 630 | JPEG | < 200 KB | B1 recortado |

Nota sobre el formato móvil: el hero es `100svh` a sangre. Un iPhone de 390x844 tiene proporción ~9:19.5; con una imagen 4:5 y `object-fit: cover` solo se ve el 58% central del ancho y el mueble queda recortado. Además el SPEC cerró video vertical propio 9:16 en móvil. Un 9:16 no sale por recorte local del B1 (en 3840x2160 el recorte es 1215 px de ancho y el mueble mide más), así que **B2 se genera en 9:16** (~2 cr, techo 4) y sirve de póster móvil y de frame inicial/final del video C2. Queda descartada la alternativa 4:5 de 0 créditos.

Placeholder mientras B1 no esté aprobado: no usar `hero-v4.jpeg` (es oscura, luminancia media 103/255, el texto negro no pasaría). Usar fondo `--color-hueso` plano con `centro-tv-catania-estudio.webp` a la derecha, solo para desarrollo.

### Riesgos
- **Contraste sin scrim:** verificar con script (muestreo de píxeles en la caja del texto, en la imagen y en 3 frames del video) que la etiqueta y los botones contra el muro dan >= 4.5:1 y el h1 >= 3:1. Si falla, se mueve `object-position` o se regenera el encuadre; nunca se oscurece.
- **Movimiento de sombras bajo el texto:** si las sombras de ventana cruzan la zona del texto en el video, el contraste varía frame a frame. Pedir en C1 que las sombras se muevan en la mitad derecha o verificar el peor frame.
- **SEO/i18n:** el h1 cambia de "Acero en estilo" a la frase del slogan; actualizar `og:image`, `og:title` si procede, y la imagen del schema (`index.html:13`, `:57`) a `hero-og.jpg`.
- **Rendimiento:** LCP = `hero__imagen`; nunca `loading="lazy"` en ella. El video no debe iniciar antes de `load`. Considerar `<link rel="preload" as="image" imagesrcset="..." imagesizes="100vw" fetchpriority="high">` solo si el LCP medido lo pide.
- **Safari iOS:** `autoplay` exige `muted` + `playsinline`; en modo de bajo consumo iOS no reproduce, y queda la imagen (correcto).

---

## 3. Declaración (sección NUEVA)

### Estado actual
No existe. Tras el hero entra directamente Nosotros (`index.html:195`).

### Estado objetivo
- **Banda:** papel, padding vertical `--space-3xl` (96-215px). El silencio de galería entre hero y contenido.
- **Layout:** una sola frase, Cormorant 300 `--text-2xl`, una palabra en cursiva, `max-width: var(--ancho-texto)` (720px). Alineada a la izquierda en móvil (a 40px en 335px de ancho serían 4 líneas centradas, que DESIGN prohíbe) y centrada desde 768px, máximo 2 líneas.
- **Rojo:** ninguno.

### Cambios concretos
- **HTML:** `<section class="declaracion" aria-label="Declaración de marca" data-i18n-aria="decl.aria"><div class="contenedor"><p class="declaracion__texto animar-entrada" data-i18n-html="decl.texto">...</p></div></section>`.
- **CSS:** bloque nuevo DECLARACIÓN.
- **JS:** solo claves i18n `decl.texto`, `decl.aria`.
- **Texto propuesto:** "Hecho a mano en Jalisco, pensado para durar *décadas*." / "Handmade in Jalisco, built to last *decades*." (reutiliza la idea de `nos.desc`; ver dudas por si el usuario prefiere el slogan aquí y otra frase en el hero).

### Riesgos
Ninguno técnico. Mantener la frase en <= 56 caracteres para respetar 2 líneas a 720px.

---

## 4. Nosotros (01)

### Estado actual
- HTML `index.html:195-357`: sin foto. Bloques: titular + descripción (`:199-219`), Enfoque 6 palabras (`:222-235`), Misión y Visión (`:240-269`), Valores 01-05 (`:274-307`), Afiliaciones AFAMO y CIMEJAL como tarjetas enlazadas (`:310-354`).
- CSS `styles.css:941-1489`: tarjetas con fondo blanco translúcido, `box-shadow: var(--elev-hover)`, `translateY(-4px)` y curva con sobrepaso (`:1395`, `:1434`); reglas de `.nosotros__pilares` a 3 columnas (`:1465-1489`) anuladas por `.nosotros__valores-wrap` (`:1359-1414`); colores sueltos `#3A3A38`, `#767672`; enfoque se pone rojo en hover (`:1284`, texto rojo pequeño sobre hueso: falla contraste).
- i18n `main.js:160-182` y `main.js:306-328` (selectores `:nth-child`, frágiles).

### Estado objetivo
- **Banda:** hueso.
- **Bloque A (intro):**
  - Móvil: `.cabecera-seccion` (número 01 + etiqueta "Quiénes somos" + h2), descripción, y debajo `.marco-imagen` 4:5.
  - Desktop (>= 1024px): grid de 12 columnas; texto en columnas 1-6, imagen en 8-12, alineados arriba.
- **Bloque B (Enfoque):** lista de 6 términos con hairlines (`--color-linea`) arriba y abajo; 2 columnas en móvil, 3 desde 768px. Jost 500 12px mayúsculas +0.18em negro. Sin hover rojo.
- **Bloque C (Misión y Visión):** 2 columnas desde 768px con hairline vertical; cada una con `.etiqueta` y párrafo Jost 400 `--text-base` color `--color-texto-secundario`, `max-width: 60ch`.
- **Bloque D (Valores):** `<ol>` de 5 filas en móvil y 5 columnas desde 1024px (3 + 2 en tablet), hairline superior, número Cormorant 300 32px `--color-texto-secundario` y nombre Cormorant 300 `--text-xl` negro. Sin tarjetas, sin sombra, sin hover que levante.
- **Bloque E (Afiliaciones):** 2 filas enlazadas (1 columna móvil, 2 desde 768px) con hairlines: etiqueta ("Socio activo"), nombre Cormorant 300 `--text-xl`, descripción `--text-sm` piedra, lema cursiva. Hover/focus: línea roja 1px inferior que crece desde la izquierda.
- **Rojo:** número "01" y líneas de etiqueta; línea de hover de afiliaciones. Nada de texto rojo pequeño.

### Cambios concretos
- **HTML**
  - Sustituir la estructura por: `.nosotros__intro` (con `.nosotros__texto` y `<figure class="nosotros__figura marco-imagen">`), `.nosotros__enfoque` (`<ul class="nosotros__enfoque-lista">`), `.nosotros__mision-vision`, `<ol class="valores">` con `li.valores__item` (`span.valores__numero` + `span.valores__nombre`), `<ul class="afiliaciones">` con `a.afiliacion`.
  - Imagen: `<picture>` con `assets/nosotros/nosotros-800w.webp|jpg` y `nosotros-1600w.webp|jpg` (4:5, 1600x2000), `loading="lazy"`, `width`/`height`, alt i18n. Origen a decidir (ver dudas).
  - Conservar íntegros: texto de misión, visión, 6 términos de enfoque, 5 valores, los 2 enlaces externos con `target="_blank"`, `rel` y `aria-label` que avisa "abre en nueva pestaña".
  - Quitar `.nosotros__divisor`, `.nosotros__sep` (los hairlines van como `border` en CSS, no como spans vacíos).
- **CSS:** reescribir el bloque NOSOTROS completo (`styles.css:941-1489`). Eliminar todo lo de tarjetas (`.nosotros__afamo-card`, `-izq`, `-der`, `-acento`, `.nosotros__afil-cards`), `.nosotros__pilares` y sus overrides, `.nosotros__sub-etiqueta` (pasa a `.etiqueta`), `#3A3A38`, `#767672`, `rgba(255,255,255,.45/.55/.7)`.
- **JS:** solo i18n. Claves nuevas o renombradas: `nos.etiqueta` (solo texto, sin `<span>`), `nos.titulo` (html), `nos.desc`, `nos.alt`, `nos.enfoque`, `nos.enf1..6`, `nos.mision`, `nos.mision-texto`, `nos.vision`, `nos.vision-texto`, `nos.valores`, `nos.v1..v5`, `nos.afil`, `nos.afil1-lbl`, `nos.afil2-lbl`, más las nuevas para contenido que hoy NO se traduce: `nos.afil1-desc`, `nos.afil1-lema`, `nos.afil2-desc`, `nos.afil2-lema`, `nos.afil1-aria`, `nos.afil2-aria`.

### Riesgos
- Contenido: es la sección con más texto; comparar palabra por palabra ES y EN antes y después.
- i18n: hoy las descripciones y lemas de AFAMO/CIMEJAL y los `aria-label` quedan en español al cambiar a EN. Se corrige aquí.
- La foto de `assets/images/nosotros.jpg` muestra a una persona de espaldas con la playera de marca; DESIGN dice "sin personas" en la fotografía. Decisión del usuario.
- Largo de sección en móvil: 5 bloques. Mantener `--space-xl` entre bloques, no `--space-2xl`, para que no se vuelva eterna.

---

## 5. Catálogo (02)

### Estado actual
- HTML `index.html:362-480`: 4 tarjetas por categoría (Libreros, Mesas, Centros de TV, Sillas) con imágenes viejas de `assets/producto-*` (2 PNG de 1.3 y 1.7 MB), botón rojo "Cotizar". El de Centros de TV manda el mensaje "cotizar un escritorio" (`index.html:444`, error de contenido).
- CSS `styles.css:1491-1706`: `.productos__etiqueta` definida dos veces (`:1492` en blanco y `:1530`), título compartido con galería duplicado (`:1504` y `:1742`), tarjeta con sombra, `translateY(-6px)`, zoom de imagen, `mix-blend-mode`, parches por foto (`--mesa`, `--silla`, `--tv` con `sepia`).
- i18n `main.js:184-190`, `main.js:330-336` (por `:nth-child`).

### Estado objetivo
- **Banda:** papel (las fotos de estudio en hueso se leen como piezas enmarcadas).
- **Layout:** `.cabecera-seccion` (02 + etiqueta + h2) y opcionalmente una línea de introducción; grid de 6 piezas: 1 columna móvil, 2 desde 768px, 3 desde 1024px (3x2). `column-gap: var(--space-md)`, `row-gap: var(--space-lg)`.
- **Pieza:** marco 4:5 radio 32px con foto de estudio; debajo, sin tarjeta ni borde: nombre Cormorant 400 `--text-lg`, categoría Jost 400 `--text-sm` piedra, `.enlace-cotizar`.
- **Crossfade estudio -> ambiente:** opacidad 0.6s ease, sin zoom.
  - Desktop (`(hover: hover) and (pointer: fine)`): al pasar el ratón sobre el marco.
  - Teclado: cuando cualquier control de la pieza tiene `:focus-visible` (`.pieza:has(:focus-visible)`), igual que el hover.
  - Táctil: tocar el marco o el botón `.pieza__alternar` alterna la clase `.pieza--ambiente` y `aria-pressed`.
  - `prefers-reduced-motion`: cambio instantáneo.
- **Rojo:** número 02, línea de la etiqueta, línea de `.enlace-cotizar`. Sin precios.

### Estructura HTML de una pieza

```html
<li class="pieza" data-pieza="centro-tv-catania">
  <article class="pieza__articulo" aria-labelledby="pieza-centro-tv-catania">
    <div class="pieza__marco marco-imagen">
      <picture class="pieza__foto pieza__foto--estudio">
        <source type="image/webp"
                srcset="assets/catalogo/centro-tv-catania-estudio-800w.webp 800w, assets/catalogo/centro-tv-catania-estudio.webp 1600w"
                sizes="(min-width: 1280px) 389px, (min-width: 1024px) calc((100vw - 112px) / 3), (min-width: 768px) calc((100vw - 92px) / 2), calc(100vw - 40px)" />
        <img src="assets/catalogo/centro-tv-catania-estudio-800w.jpg"
             srcset="assets/catalogo/centro-tv-catania-estudio-800w.jpg 800w, assets/catalogo/centro-tv-catania-estudio.jpg 1600w"
             sizes="(igual que arriba)"
             width="1600" height="2000" loading="lazy" decoding="async"
             alt="..." data-i18n-alt="cat.centro-tv-catania.alt" />
      </picture>
      <picture class="pieza__foto pieza__foto--ambiente">
        <source type="image/webp" srcset="assets/catalogo/centro-tv-catania-ambiente-800w.webp 800w, assets/catalogo/centro-tv-catania-ambiente.webp 1600w" sizes="..." />
        <img src="assets/catalogo/centro-tv-catania-ambiente-800w.jpg"
             srcset="assets/catalogo/centro-tv-catania-ambiente-800w.jpg 800w, assets/catalogo/centro-tv-catania-ambiente.jpg 1600w"
             sizes="..." width="1600" height="2000" loading="lazy" decoding="async" alt="" />
      </picture>
      <button class="pieza__alternar" type="button" aria-pressed="false"
              data-i18n="cat.ver-ambiente">Ver en ambiente</button>
    </div>
    <h3 class="pieza__nombre" id="pieza-centro-tv-catania" data-i18n="cat.centro-tv-catania.nombre">Centro de TV Catania</h3>
    <p class="pieza__categoria" data-i18n="cat.centro-tv-catania.categoria">Centro de TV · Acero y madera</p>
    <a class="enlace-cotizar" data-wa-pieza="cat.centro-tv-catania.nombre"
       href="https://wa.me/523921236728?text=Hola%2C%20me%20interesa%20cotizar%20el%20Centro%20de%20TV%20Catania%20de%20MEDEISA."
       target="_blank" rel="noopener noreferrer"
       aria-describedby="pieza-centro-tv-catania">
      <span data-i18n="cat.cotizar">Cotizar por WhatsApp</span>
      <span class="enlace-cotizar__linea" aria-hidden="true"></span>
    </a>
  </article>
</li>
```

- La foto de ambiente lleva `alt=""`: es el mismo mueble y duplicaría la lectura; el estado lo comunica el botón.
- El `href` estático en español es el fallback sin JS; JS lo reconstruye al cambiar de idioma.
- `.pieza__alternar`: control de 44px, radio 5px, fondo papel, texto negro, esquina inferior izquierda del marco. Visible siempre en táctil; en dispositivos con hover queda `opacity: 0` y aparece con `:focus-visible` (sigue siendo accesible por teclado). Texto alterna "Ver en ambiente" / "Ver en estudio".

### Datos de las 6 piezas (orden del SPEC)

| slug | Nombre ES | Nombre EN (propuesta) | Categoría ES | Categoría EN | Mensaje WhatsApp ES |
|------|-----------|-----------------------|--------------|--------------|---------------------|
| `centro-tv-catania` | Centro de TV Catania | Catania TV Console | Centro de TV · Acero y madera | TV console · Steel and wood | Hola, me interesa cotizar el Centro de TV Catania de MEDEISA. |
| `mesa-centro-catania` | Mesa de Centro Catania | Catania Coffee Table | Mesa de centro · Acero y parota | Coffee table · Steel and parota | Hola, me interesa cotizar la Mesa de Centro Catania de MEDEISA. |
| `silla-sahara` | Silla Sahara | Sahara Armchair | Sala · Tapizado bouclé y acero | Living · Bouclé and steel | Hola, me interesa cotizar la Silla Sahara de MEDEISA. |
| `centro-tv-sierra-azul` | Centro de TV Sierra Azul | Sierra Azul TV Console | Centro de TV · Acero y parota | TV console · Steel and parota | Hola, me interesa cotizar el Centro de TV Sierra Azul de MEDEISA. |
| `mesa-centro-sierra-azul` | Mesa de Centro Sierra Azul Parota | Sierra Azul Parota Coffee Table | Mesa de centro · Parota maciza y acero | Coffee table · Solid parota and steel | Hola, me interesa cotizar la Mesa de Centro Sierra Azul Parota de MEDEISA. |
| `recamara-tulum` | Recámara Tulum | Tulum Bedroom Set | Recámara · Chapa de madera y acero | Bedroom · Wood veneer and steel | Hola, me interesa cotizar la Recámara Tulum de MEDEISA. |

Mensaje EN: "Hi, I would like a quote for the {nombre EN} by MEDEISA." Plantilla en `TRADUCCIONES` con artículo incluido en una clave por pieza (`cat.<slug>.mensaje`) para no pelear con el género en español.

Alt de estudio (ES, verificar contra la foto final): se derivan de las descripciones `[PRODUCT]` de `HIGGSFIELD-PLAN.md` (ej. Catania: "Centro de TV Catania: estructura trapezoidal de acero negro, repisa superior de madera clara y gabinete de madera miel con tres cajones sin jaladeras, sobre fondo hueso").

### Assets

- Estudio (ya existen, 1600x2000 y 800x1000, WebP + JPEG): `assets/catalogo/<slug>-estudio.webp|.jpg` y `<slug>-estudio-800w.webp|.jpg`. Los 6 slugs de la tabla ya están en disco con esos nombres. Nota: el slug real es `mesa-centro-sierra-azul` (sin "-parota"); se respeta.
- Ambiente (Fase 2, Higgsfield A1-A6): mismo patrón, `assets/catalogo/<slug>-ambiente.webp|.jpg` (1600x2000) y `<slug>-ambiente-800w.webp|.jpg` (800x1000). 4:5 exacto (si no, el crossfade salta). Peso: < 250 KB la grande WebP, < 90 KB la 800w.
- Mientras no existan los ambientes: la pieza se publica sin `<picture class="pieza__foto--ambiente">` ni `.pieza__alternar` (el CSS y JS no deben romperse si faltan).

### Cambios concretos
- **HTML:** reemplazar `index.html:362-480`. `<section class="catalogo" id="productos" aria-labelledby="catalogo-titulo">`, `<ul class="catalogo__grid" role="list">` con 6 `li.pieza`.
- **CSS:** reescribir PRODUCTOS (`styles.css:1491-1706`) como bloque CATÁLOGO. Eliminar `.productos__*`, `.producto-tarjeta*` completo (incluidos `--degradado`, `--mesa`, `--silla`, `--tv` y su `filter: sepia`), el título compartido `.productos__titulo, .galeria__titulo` (`:1504-1513`), la regla oscura `.productos__etiqueta` (`:1492-1501`) y `.producto-tarjeta .btn--rojo:hover`.
  - `.pieza__marco { position: relative; aspect-ratio: 4 / 5; background: var(--color-hueso); }`, `.pieza__foto { position: absolute; inset: 0; }`, `img { width: 100%; height: 100%; object-fit: cover; }`.
  - `.pieza__foto--ambiente { opacity: 0; transition: opacity var(--transicion-entrada); }` y las tres vías de activación descritas arriba.
- **JS**
  - Nuevo `iniciarCatalogo()`: un solo `click` delegado en `.catalogo__grid`; si el objetivo está dentro de `.pieza__marco` (botón o imagen), alterna `.pieza--ambiente` en la pieza, `aria-pressed` y el texto del botón (desde i18n). Sin listeners por tarjeta.
  - WhatsApp: función pura `crearEnlaceWhatsapp(mensaje)` que usa `CONFIG.whatsapp` (hoy `CONFIG` existe en `main.js:16-19` pero nadie lo usa) y `encodeURIComponent`. `iniciarIdioma` reescribe los `href` de `[data-wa]` y `[data-wa-pieza]` en cada cambio de idioma.
  - i18n: `cat.etiqueta`, `cat.titulo`, `cat.intro`, `cat.cotizar`, `cat.ver-ambiente`, `cat.ver-estudio`, y por pieza `cat.<slug>.nombre|categoria|alt|mensaje`. Se borran `prod.libreros`, `prod.mesas`, `prod.escrts`, `prod.sillas`, `prod.cotizar`, `prod.etiqueta`, `prod.titulo`.

### Riesgos
- **Rendimiento:** 12 imágenes (6 estudio + 6 ambiente) con `loading="lazy"`; la de ambiente se descarga aunque esté oculta (opacidad no frena lazy). Coste estimado a 800w: ~6 x 15-60 KB + ~6 x 90 KB. Aceptable; si no, cargar ambiente al primer `pointerenter`/tap (el primer hover tendría retardo).
- **i18n:** los nombres propios se traducen parcialmente; confirmar nombres EN con el usuario.
- **Contenido que se pierde:** desaparecen las categorías genéricas "Libreros / Estantes" y "Sillas y sillones". El schema (`index.html:37`) dice "Fabricamos libreros, mesas, escritorios y sillas"; revisar para que coincida con el catálogo nuevo.
- **Accesibilidad:** `:has()` tiene soporte amplio (2023+); si falla, el teclado ve solo la foto de estudio, lo cual es aceptable. Nombre accesible del enlace: "Cotizar por WhatsApp" + descripción por `aria-describedby` con el nombre de la pieza (6 enlaces con el mismo texto visible quedan distinguibles).
- `.pieza__alternar` superpuesto a la foto: verificar contraste papel sobre la foto (el botón tiene fondo propio, no depende de la foto).

---

## 6. Expo / Galería (03)

### Estado actual
- HTML `index.html:485-537`: encabezado centrado, descripción + badge "Edición 2026", 1 foto panorámica (`new-expo.jpeg`, 1600x900, sin `width`/`height` en `:515-517`, provoca CLS), franja de 3 datos.
- CSS `styles.css:1709-1923`: fondo hueso, radio 2px, zoom en hover, colores `#777773`.
- i18n `main.js:192-195`, `main.js:338-341`; "Evento", "Participación", "Sede" y sus valores NO se traducen.

### Estado objetivo
- **Banda:** NEGRA (única banda oscura de contenido, da el respiro de ritmo entre catálogo papel y contacto hueso).
- **Layout:** `.cabecera-seccion` alineada a la izquierda (03 + etiqueta + h2 en papel). Intro en grid: descripción (Jost 300 `--text-base` ceniza, `max-width: 60ch`) a la izquierda; a la derecha "2026" en Cormorant 300 `--text-3xl` papel con etiqueta "Edición" encima. Debajo, foto en `.marco-imagen` 16:9 a ancho de contenedor. Debajo, `<dl class="expo__datos">` en 3 columnas desde 768px (1 columna en móvil) con hairlines `--color-linea-oscura`: término en etiqueta ceniza, valor en Jost 400 papel.
- **Rojo:** número 03 (`#F11E24` sobre negro, 4.67:1), línea de etiqueta. Si la etiqueta lleva texto rojo sobre negro, debe ser `#F11E24`, nunca `#C0001F` (3.07:1).
- Sin zoom al hover.

### Cambios concretos
- **HTML:** `<section class="expo" id="galeria" aria-labelledby="expo-titulo">` (se conserva `id="galeria"`). Unificar `galeria__*` y `expo__*` en `expo__*`. Foto: `<figure class="expo__figura marco-imagen">` + `<picture>` con `assets/expo/expo-800w.webp|jpg`, `expo-1600w.webp|jpg` (y `expo-2560w` si hay original de mayor resolución), `width="1600" height="900"`, `loading="lazy"`. Datos como `<dl>` con `<div>` por par.
- **CSS:** reescribir el bloque EXPO (`styles.css:1709-1923`). Eliminar `.galeria__*`, `.expo__badge*` (pasa a `.expo__edicion`), `.expo__foto` y su hover, `#777773`, el `@media (max-width: 600px)` (se pasa a mobile-first).
- **JS:** solo i18n. Claves: `expo.etiqueta`, `expo.titulo`, `expo.desc`, `expo.edicion`, `expo.alt`, y nuevas `expo.dato1-lbl|val`, `expo.dato2-lbl|val`, `expo.dato3-lbl|val`. Se borran `gal.etiqueta`, `gal.titulo`, `expo.badge`.

### Riesgos
- `new-expo.jpeg` es 1600px: a 1280px de contenedor en pantallas 2x se verá blanda. Pedir original o aceptar.
- Contraste de texto secundario sobre negro: usar `#9A9794` (6.81:1), no los `rgba` blancos actuales.
- El CLAUDE.md pide "Galería: grid de fotos"; hoy solo hay 1 foto. `expo-1.jpeg` y `expo-2.jpeg` existen y solo las usa el sitemap. Opción: 1 foto grande + 2 pequeñas (ver dudas).
- "Edición 2026" es contenido fechado; ya está así hoy.

---

## 7. Contacto (04)

### Estado actual
- HTML `index.html:542-695`: etiqueta con indentación rota (`:548-551`), datos en `<ul>` con iconos SVG que el CSS oculta (`display: none`, `styles.css:2006`), botón WhatsApp rojo con icono, redes con icono, mapa con cabecera oscura y enlace "Ver en Maps", iframe con `sandbox`, `title`, `loading="lazy"`.
- CSS `styles.css:1926-2198`: borde izquierdo rojo de 3px en cada dato (`:2001`), `font-family: var(--font-base)` (Montserrat, `:2149`) y peso 600 en el nombre del mapa, sombra `--elev-superficie` en el mapa, `#777773` / `#3A3A38`.
- i18n `main.js:197-206`, `main.js:343-352`.

### Estado objetivo
- **Banda:** hueso.
- **Layout:** móvil una columna (info, luego mapa). Desde 1024px, 2 columnas (5/12 info, 7/12 mapa), alineadas arriba.
- **Info:** `.cabecera-seccion` (04 + etiqueta + h2), subtexto piedra, `<dl class="contacto__datos">` con hairlines entre filas: término en etiqueta negra, valor Jost 400 `--text-base` negro con `font-feature-settings: "tnum"` en teléfono y horario; dirección dentro de `<address>`. Luego `.btn--relleno` "Escribir por WhatsApp" (sin icono o con icono de 16px `aria-hidden`), y redes como enlaces de texto en mayúsculas (Instagram @medeisa.muebles, Facebook Medeisa) con línea roja en hover.
- **Mapa:** `.marco-imagen` 32px con el iframe (altura 320px móvil, 520px desktop). Debajo del marco, pie de mapa claro: nombre "MEDEISA S.A. de C.V." Cormorant 400 `--text-lg`, dirección corta piedra, `.btn--contorno` "Ver en Google Maps".
- **Rojo:** número 04, línea de etiqueta, relleno del CTA, línea hover de redes. Se quita el borde rojo de 3px por dato.

### Cambios concretos
- **HTML:** reemplazar `index.html:542-695`. Quitar los 3 SVG de `.contacto__dato-icono` y los SVG de redes (texto en su lugar). Conservar `href="tel:+523921236728"`, el `href` de WhatsApp con `data-wa="general"`, los 2 enlaces de redes, el iframe con TODOS sus atributos actuales, y el `aria-label` del enlace a Maps.
- **CSS:** reescribir el bloque CONTACTO (`styles.css:1926-2198`). Eliminar `.contacto__dato-icono`, `.contacto__mapa-header*`, `.contacto__mapa-icono`, el hack `.contacto__btn-whatsapp.visible`, los `transition-delay` por `nth-child`, la sombra y el borde del mapa. Para que Safari recorte el iframe con el radio: `.contacto__mapa-marco { overflow: hidden; isolation: isolate; }` (y si aún se escapa, `-webkit-mask-image: -webkit-radial-gradient(white, black)`).
- **JS:** solo i18n. Claves: `cnt.etiqueta`, `cnt.titulo`, `cnt.subtexto`, `cnt.lbl.tel|hor|dir`, `cnt.val.hor`, `cnt.btn-wa`, `cnt.redes`, `cnt.mapa-link` (sin `&nbsp;` ni flecha en HTML crudo), `cnt.mapa-aria`, `cnt.mapa-titulo` (el `title` del iframe hoy no se traduce).

### Riesgos
- Datos del negocio: teléfono, horario (L-V 8:00-16:00) y dirección completa deben coincidir con CLAUDE.md y con el schema (`index.html:39-55`). No reescribir a mano; copiar.
- El iframe de Google Maps es el recurso más pesado tras el hero; se queda con `loading="lazy"`.
- `sandbox` del iframe: no tocarlo (hoy funciona con `allow-scripts allow-same-origin allow-popups`).

---

## 8. Footer

### Estado actual
- HTML `index.html:702-780`: logo invertido + tagline, nav de 4 enlaces, 3 iconos (Instagram, Facebook, WhatsApp), créditos con año dinámico.
- CSS `styles.css:2200-2321`: textos con `rgba(245,244,240,.45-.65)` (el de `.45` en iconos queda bajo 3:1), `--color-texto-calido`.
- JS `main.js:499-502` (año). i18n `main.js:208-214`, `main.js:354-360`.

### Estado objetivo
- **Banda:** NEGRA. Sin borde superior (viene de Contacto hueso, el salto tonal basta).
- **Layout:** móvil apilado; desde 768px, fila 1: marca (logo invertido + "Metales de Innovación" en etiqueta ceniza) a la izquierda y slogan "Transformamos acero en *estilo*" en Cormorant 300 `--text-2xl` papel a la derecha o debajo; fila 2: nav + redes como enlaces de texto (Instagram, Facebook, WhatsApp); hairline `--color-linea-oscura`; fila 3: créditos Jost 400 12px ceniza con "Ocotlán, Jalisco, México".
- **Tipografía:** enlaces Jost 500 12px mayúsculas +0.18em papel, gap 20px, hover: solo línea inferior `#F11E24`.
- **Rojo:** únicamente la línea de hover.

### Cambios concretos
- **HTML:** conservar estructura `<footer class="pie-pagina">`; sustituir iconos de redes por texto (nombre accesible = texto visible, se quitan los `aria-label`). Añadir `<p class="pie-pagina__subtitulo">Metales de Innovación</p>` (dato de marca que hoy no aparece en ningún lado de la página). Logo apunta al PNG optimizado.
- **CSS:** reescribir el bloque FOOTER (`styles.css:2200-2321`). Sustituir todos los `rgba(245,244,240,...)` por `--color-texto-invertido` y `--color-texto-secundario-oscuro`.
- **JS:** conservar `iniciarFooter`. i18n: `pie.tagline` (html por el `<em>`), `pie.subtitulo`, `pie.*` de enlaces, `pie.derechos`, `pie.ciudad`.

### Riesgos
- El texto del slogan se repite (hero y footer). Es intencional como cierre; si el hero usa otra frase, el footer conserva el slogan oficial.
- Redes: verificar URLs exactas (Facebook usa `profile.php?id=61580795922902`, no "facebook.com/Medeisa").

---

## 9. Botón WhatsApp flotante

### Estado actual
- HTML `index.html:785-795`: enlace con `aria-label`, SVG 28px.
- CSS `styles.css:2324-2368`: verde `#25D366`, sombra verde, `scale(1.1)` en hover, pulso `::before` 3 veces (`@keyframes pulso-whatsapp`). `:active` con `scale(0.92)` (`styles.css:276-279`).

### Estado objetivo
- Círculo de 56px, fondo `#F11E24`, icono `#FFFFFF` 28px (4.24:1, pasa 3:1 no textual), `--sombra-flotante` (la única sombra del sistema). Hover y active: fondo `--color-rojo-hover`, sin escalar. Aparición única de 0.6s al cargar (opacidad), sin pulso.
- Posición: `right` y `bottom` `var(--space-md)` en móvil, `var(--space-lg)` desde 768px, sumando `env(safe-area-inset-bottom)`.
- Anillo de foco: con fondo rojo, el `outline` rojo no se ve; usar `outline: 2px solid var(--color-negro)` + `outline-offset: 3px` en este botón (o doble anillo papel/negro).

### Cambios concretos
- **HTML:** conservar; añadir `data-wa="general"` para que el mensaje cambie de idioma, y `data-i18n-aria="wa.aria"`.
- **CSS:** reescribir el bloque (`styles.css:2324-2368`). Eliminar `::before`, `@keyframes pulso-whatsapp`, `box-shadow` verde, `transform: scale` de hover y de `:active` (bloque `styles.css:255-279`).
- **JS:** solo el reescrito de `href` por idioma (compartido con Catálogo).

### Riesgos
- En móvil puede tapar el `.enlace-cotizar` de la última pieza del grid o el botón de pausa del hero: dejar `padding-bottom` suficiente en la última banda y posicionar `.hero__pausa` a la izquierda del flotante.
- Se pierde el verde que la gente asocia a WhatsApp; es decisión cerrada del DESIGN.

---

## 10. Globales

### Estado actual
- `<head>` `index.html:1-60`: carga Cormorant + Jost 200/300/400 + Montserrat 300-600 (`:25`); `og:image` y schema apuntan a `hero-v4.jpeg`; favicon es el PNG de 682 KB.
- Tokens `styles.css:10-72`: escala de espaciado y texto que no coincide con DESIGN, tokens muertos o prohibidos (ver lista de eliminación), `body` negro con texto blanco (`styles.css:92-100`).
- JS `main.js:1-19` (clase `.js`, CONFIG sin usar), `main.js:109-132` (IO de entrada), `main.js:144-422` (i18n por mapa de selectores), `main.js:508-515` (init).

### Estado objetivo
- Fuentes: `Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Jost:wght@300;400;500&display=swap`. Montserrat fuera.
- `:root`: exactamente el bloque de `DESIGN.md` (Quick Start), más `--color-rojo-hover`. `body { background: var(--superficie-papel); color: var(--color-texto); font-family: var(--font-sans); }`.
- `:focus-visible` global: `outline: var(--foco); outline-offset: var(--foco-offset)`. Sobre bandas negras el rojo sigue pasando 3:1 (4.67).
- Skip link: `.btn--relleno` visual (hoy usa `--color-rojo` de fondo con texto, que falla 3.89:1, y peso 600).
- `html { scroll-padding-top: var(--altura-nav); }` se conserva.

### Motor i18n (cambio de arquitectura, paso 0)

Hoy `MAPA_TRADUCCION` (`main.js:291-361`) liga cada texto a selectores CSS con `:nth-child`; cualquier cambio de marcado rompe la traducción en silencio, y hay un error real: `hero.eyebrow` se aplica con `innerHTML` (`main.js:298`) sobre un `<p>` que contiene el `<span>` de la línea, así que en inglés la línea roja desaparece.

Nuevo contrato:
- `data-i18n="clave"`: `textContent`.
- `data-i18n-html="clave"`: `innerHTML`, solo para claves con `<em>` (titulares). Las etiquetas ya no llevan `<span>` dentro de la traducción: el `<span class="etiqueta__linea">` queda fuera del elemento traducido.
- `data-i18n-alt`, `data-i18n-aria` (aria-label), `data-i18n-title`.
- `data-wa="general"` y `data-wa-pieza="<clave del nombre>"`: `href` de WhatsApp reconstruido con `crearEnlaceWhatsapp()`. Mensajes: `wa.general` (nav, hero, contacto, flotante) y `cat.<slug>.mensaje` (piezas); `data-wa-pieza` apunta a la clave del nombre y el mensaje se toma de `cat.<slug>.mensaje`.
- `aplicarIdioma(lang)`: un `querySelectorAll('[data-i18n],[data-i18n-html],[data-i18n-alt],[data-i18n-aria],[data-i18n-title],[data-wa],[data-wa-pieza]')` y una pasada; actualiza `html[lang]`, `document.title` y `meta[name=description]` (claves `meta.title`, `meta.desc`).
- `localStorage` dentro de `try/catch` (hoy `main.js:369` y `:400` sin protección; en Safari privado puede lanzar).
- `TRADUCCIONES.es` y `.en` se ordenan en bloques por sección con comentarios delimitadores idénticos (`/* --- HERO --- */`, etc.) para que cada agente edite solo el suyo.

### Orden del archivo `styles.css` (marcadores fijos)

```
VARIABLES / RESET / BASE / ACCESIBILIDAD / UTILIDADES / ANIMACIÓN DE ENTRADA
COMPONENTES COMPARTIDOS (btn, etiqueta, numero-seccion, cabecera-seccion, titulo-seccion, marco-imagen, enlace-cotizar)
NAV / HERO / DECLARACIÓN / NOSOTROS / CATÁLOGO / EXPO / CONTACTO / FOOTER / WHATSAPP FLOTANTE
```

Cada bloque abre con `/* ====== NOMBRE ====== */` y ningún selector de una sección aparece fuera de su bloque (hoy `.productos__etiqueta` vive dentro de Nosotros, `styles.css:1491`, y los estados `:active` de todas las secciones viven arriba, `styles.css:255-279`).

### Riesgos
- Cambiar `--space-*` y `--text-*` en el paso 0 mueve el espaciado de secciones aún no refactorizadas. Es aceptable (todas se reescriben), pero el paso 0 no debe publicarse solo.
- Para que cada paso sea verificable por separado, el paso 0 deja alias temporales de los tokens viejos marcados `/* LEGADO: borrar en paso 8 */` (`--font-base`, `--font-jost`, `--color-texto-oscuro`, `--radio-sm`, `--elev-*`, `--fw-semibold`, `--color-gris-claro`...). Si el paso 8 no se hace, quedan tokens muertos.
- `body` pasa de negro a papel: secciones viejas que heredaban blanco (`.productos__etiqueta` en `styles.css:1498` tiene color explícito, bien) podrían quedar con texto claro sobre claro hasta su paso. Revisar visualmente tras el paso 0.

---

## 11. Orden de implementación (Fase 3)

Cada paso es una unidad verificable sola y cierra con su verificación.

| Paso | Qué | Depende de | Verificación mínima |
|------|-----|------------|---------------------|
| 0 | Globales: fuentes, tokens (con alias LEGADO), reset/base, foco, skip link, animación de entrada con `--orden`, componentes compartidos, reorden de `styles.css` en bloques con marcadores, motor i18n con `data-i18n` sobre el HTML ACTUAL (sin cambio visual de secciones), `crearEnlaceWhatsapp`, arreglo del IO de enlace activo | nada | ES/EN cambia todos los textos que cambiaban antes (y la línea del eyebrow ya no se pierde); sin errores en consola; la página abre con doble clic en `index.html` |
| 1 | Nav + Hero (juntos: el nav de texto negro solo funciona sobre el hero claro) | 0; B1, B2, C1 y C2 aprobados (o placeholder claro) | Contraste medido en la zona del texto (imagen y peor frame de ambos videos); video 16:9 en desktop y 9:16 en móvil, póster con reduced-motion o Save-Data; botón de pausa en ambos; LCP es la imagen; 375, 768, 1024, 1440 px |
| 2 | Declaración + Nosotros | 0 | Texto ES/EN completo comparado con el original; teclado en afiliaciones |
| 3 | Catálogo | 0 (ambientes de Fase 2 opcionales) | Hover desktop, tap móvil, foco teclado, reduced-motion; 6 enlaces de WhatsApp con mensaje correcto en ES y EN |
| 4 | Expo | 0 | Contraste sobre negro; sin CLS en la foto |
| 5 | Contacto | 0 | Datos del negocio idénticos; mapa recortado a 32px en Safari; `tel:` funciona |
| 6 | Footer + WhatsApp flotante | 0 | Foco visible en el flotante; no tapa CTAs en 375px |
| 7 | Metadatos y SEO: `og:image`, schema, `sitemap.xml` (hoy lista imágenes que no existen), favicon | 1, 3 | Validar JSON-LD y sitemap |
| 8 | Limpieza: borrar alias LEGADO, CSS huérfano, claves i18n sin uso; revisión final | todos | Búsqueda de cada token/clase eliminada con `grep` sin resultados; Lighthouse a11y y rendimiento |

### Paralelismo

- **Secuencial obligatorio:** paso 0, luego paso 1. El 0 toca todos los bloques y el motor i18n; el 1 define la paleta de fondo/nav de la que dependen las capturas de verificación del resto.
- **En paralelo tras el 1 (bloques disjuntos):** 2 (Declaración + Nosotros), 3 (Catálogo), 4 (Expo), 5 (Contacto), 6 (Footer + flotante). Cada agente solo edita:
  - en `index.html`, entre los comentarios delimitadores de su sección;
  - en `styles.css`, dentro de su bloque con marcador (nunca VARIABLES ni COMPONENTES COMPARTIDOS: si necesita un token o componente nuevo, lo pide al orquestador);
  - en `main.js`, su bloque en `TRADUCCIONES.es` y `.en` y, si aplica, su función `iniciarX` (solo Catálogo añade una).
- Punto de choque real: los tres agentes escriben el mismo archivo. La herramienta Edit rechaza la edición si el archivo cambió desde la última lectura, así que no se pierde trabajo, pero habrá reintentos. Si se quiere paralelo sin fricción: como máximo 2 agentes a la vez, o que cada uno trabaje en un worktree y el orquestador integre en serie (los bloques no se solapan, la integración es limpia).
- Los pasos 7 y 8 van al final y en serie.

---

## 12. Lista de lo que se elimina

### Fuentes
- Montserrat 300/400/500/600 (solo la usan `--font-base` en `.btn` `styles.css:226` y `.contacto__mapa-nombre` `styles.css:2149`).
- Jost 200 (solo `.hero__wordmark`). Se añade Jost 500.

### Tokens muertos o prohibidos (`styles.css:10-72`)
`--font-base`, `--font-jost` (renombrado a `--font-sans`), `--fw-ultralight`, `--fw-semibold`, `--color-gris`, `--color-gris-mid`, `--color-gris-claro` (#888, 2.72:1, prohibido), `--color-texto-oscuro` (se unifica en `--color-texto`), `--color-texto-calido`, `--radio-sm` (4px, fuera del sistema 5/32), `--sombra-fuerte`, `--elev-reposo`, `--elev-hover`, `--elev-superficie`. Se sustituyen valores de `--space-*` y `--text-*` por los de DESIGN.

### Colores sueltos en CSS
`#0a0a08`, `#3A3A38`, `#777773`, `#767672`, `#F2F0ED`, `#E4DED6`, `#D8D0C6`, `#a80019` literal (pasa a token), `#25D366`, todos los `rgba(245,245,245,x)`, `rgba(245,244,240,x)`, `rgba(0,0,0,x)` y `rgba(28,28,28,x)` usados como texto o línea.

### CSS huérfano o prohibido
- Estados `:active` con `scale` (`styles.css:255-279`) y `.btn:hover { translateY }` (`:240-242`).
- Todo `backdrop-filter` y sus `@media (prefers-reduced-transparency)` (`:308-325`, `:362-373`, `:494-509`).
- `.encabezado::after`, `.nav__pill`, `.nav__cursor` y su `@media` reduced-motion (`:392-396`).
- Hero completo viejo: `.hero::before`, `.hero__overlay`, `.hero__wordmark`, `.hero__divisor`, `.hero__subtitulo`, `.hero__btn-primario`, `.hero__cta-ghost`, `.hero__deco-texto`, `.hero__scroll*`, `@keyframes pulso-linea`, `.hero__idioma-*`.
- Nosotros: `.nosotros__pilares` base (`:1033-1080`, `:1465-1489`, anulado), tarjetas de valores y afiliaciones con sombra y `translateY`, curvas `cubic-bezier(0.34, 1.56, 0.64, 1)`, `.nosotros__divisor`, `.nosotros__sep`, `.nosotros__sub-etiqueta*`, hover rojo del enfoque.
- Duplicados: `.productos__etiqueta` (`:1492` y `:1530`), `.productos__titulo, .galeria__titulo` (`:1504`) frente a `.galeria__titulo` (`:1742`).
- `.producto-tarjeta*` completo con `mix-blend-mode`, `filter: saturate() sepia()` y modificadores por foto.
- `.expo__foto` hover `scale`, `.expo__badge*`, `.galeria__*`.
- `.contacto__dato-icono` (oculto con `display: none`), `.contacto__mapa-header*`, `.contacto__btn-whatsapp.visible`, borde rojo de 3px por dato.
- `.whatsapp-flotante::before`, `@keyframes pulso-whatsapp`.
- Todos los `transition-delay` fijos por elemento (se sustituyen por `--orden`).
- `.sr-only` se CONSERVA (se usará en el botón de pausa si hace falta).

### JS
- `iniciarNavPill` completo (`main.js:425-493`) y el parámetro `recalcularCursor`.
- `MAPA_TRADUCCION` (`main.js:291-361`), sustituido por `data-i18n`.
- Listener de `scroll` del nav (`main.js:34-39`).
- Claves i18n sin uso tras el refactor: `hero.titulo-l1`, `hero.titulo-l2`, `hero.subtitulo`, `hero.btn-prim`, `hero.cta-ghost`, `hero.deco`, `prod.*`, `gal.*`, `expo.badge`, las variantes de etiqueta con `<span>` embebido.

### HTML
- SVG ocultos de contacto (`index.html:564-598`), iconos de redes en contacto y footer (se pasan a texto), `.hero__overlay`, `.hero__scroll`, `.hero__deco-texto`, spans vacíos de divisores y separadores.

### Assets (solo listar, NO borrar)
- Capturas `.png` sueltas en la raíz: **no hay ninguna** a fecha 2026-09-22. `.playwright-mcp/` contiene 29 archivos `.yml`/`.log` (ignorados por git en `.gitignore`), sin imágenes.
- En `assets/` quedan sin uso tras el refactor:
  - `producto-librero-monte-calido.jpg`, `producto-mesa-sierra-azul.png` (1.3 MB), `producto-centro-tv-catania.jpg`, `producto-sillon-sahara.png` (1.7 MB): sustituidos por `assets/catalogo/`.
  - `hero-v4.jpeg`, `hero-phone.jpeg`: sustituidos por `assets/hero/` (tras el paso 7, porque `og:image`, schema y sitemap aún apuntan a `hero-v4.jpeg`).
  - `hero-v3.jpg` (893 KB), `afamo.jpg`, `cimejal.jpeg`: ya hoy sin ninguna referencia.
  - `expo-1.jpeg`, `expo-2.jpeg`: solo en `sitemap.xml` (salvo que se use la opción de grid en Expo).
  - `images/nosotros.jpg`: hoy sin referencia (salvo que se elija para Nosotros).
  - `logo.PNG` (682 KB): sustituir por versión optimizada; la carpeta `assets/logo/` existe vacía.
- `sitemap.xml:64-97` referencia `producto-librero.jpg`, `producto-mesa.jpg`, `producto-escritorio.jpg`, `producto-comedor.jpg`, que no existen: corregir en el paso 7.

---

## 13. Errores existentes detectados (se corrigen dentro de su paso)

1. `index.html:444`: la tarjeta "Centros de TV" abre WhatsApp con "cotizar un escritorio". (Paso 3)
2. `main.js:298`: el eyebrow del hero pierde su línea al cambiar a EN por `innerHTML`. (Paso 0)
3. `main.js:69`: el IO de enlace activo observa también los ids de los h2 y apaga el enlace activo. (Paso 0)
4. `main.js:16-19`: `CONFIG` declarado y nunca usado. (Paso 0)
5. `main.js:369`, `:400`: `localStorage` sin `try/catch`. (Paso 0)
6. `index.html:89`: `role="region"` en el selector de idioma (debe ser `group`). (Paso 1)
7. `index.html:515-517`: imagen de expo sin `width`/`height` (CLS). (Paso 4)
8. `styles.css:152-162`: skip link con texto sobre `#F11E24` (3.89:1, falla) y peso 600. (Paso 0)
9. `styles.css:1284`: enfoque en hover pone texto rojo pequeño sobre hueso (3.25:1, falla). (Paso 2)
10. Varios textos no se traducen hoy: descripciones y lemas de afiliaciones, datos de Expo, `title` del iframe, `aria-label` de redes y del flotante. (Pasos 2, 4, 5, 6)

---

## 14. Dudas abiertas (las referencias "ver dudas" de este documento apuntan aquí)

1. **Textos del hero y de la Declaración** (secciones 2 y 3): ¿el slogan "Transformamos acero en *estilo*" va en el h1 del hero y la Declaración usa "Hecho a mano en Jalisco, pensado para durar *décadas*", o al revés?
2. **Foto de Nosotros** (sección 4): `assets/images/nosotros.jpg` muestra a una persona de espaldas (DESIGN dice "sin personas"). ¿Se usa igual, se usa otra foto real del taller, o se genera una?
3. **Expo** (sección 6): ¿1 foto panorámica o 1 grande + 2 pequeñas con `expo-1.jpeg` y `expo-2.jpeg`? ¿Hay original de `new-expo.jpeg` a más de 1600px?
4. **Nombres en inglés** del catálogo (sección 5, tabla): confirmar o dejar los nombres propios sin traducir.
5. **Recámara Tulum:** la foto de estudio actual muestra el juego completo (cama, 2 burós y cajonera) y se ve mucho más pequeña que las demás; el ambiente A6 propone cama + 1 buró. Si estudio y ambiente muestran conjuntos distintos, el crossfade cambia de contenido. Decidir un solo encuadre para ambas.
