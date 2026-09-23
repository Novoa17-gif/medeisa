# Decisiones Fase 3 (refactor por pasos)

Una línea por decisión no trivial. Orden de prioridad: SPEC > DESIGN > BLUEPRINT.

## Paso 0 - Globales

- Fuentes: Cormorant Garamond 300/400 (+ cursivas) y Jost 300/400/500; se quitan Montserrat y Jost 200 (`.hero__wordmark` cae a 300 hasta el paso 1).
- `:root` = bloque Quick Start de DESIGN tal cual; se añade `--color-whatsapp: #25D366` como token (el flotante verde es decisión del usuario) para no dejar el hex suelto.
- Alias LEGADO solo para tokens viejos que aún se usan (`--font-base`, `--font-jost`, `--fw-ultralight`, `--fw-semibold`, `--color-gris`, `--color-texto-oscuro`, `--radio-sm`, `--elev-*`); los que no tenían uso (`--color-gris-mid`, `--color-gris-claro`, `--color-texto-calido`, `--sombra-fuerte`) se borran ya.
- `--fw-semibold` LEGADO apunta a 500 y `--radio-sm` a 5px: así las secciones viejas ya no usan pesos >= 600 ni radio 4px.
- `.btn--rojo` se conserva como LEGADO (usado en Catálogo y Contacto), ahora con 1px de borde y hover `#A80019` en vez de hover transparente con texto rojo pequeño.
- `.btn` se redefine según el componente (Jost 500 12px, +0.18em, 48px, radio 5px) y pierde `translateY` en hover y `scale` en `:active`.
- Estados `:active` con `scale` de cada sección se mueven a su bloque (no se borran) para que cada paso decida; eso cumple la regla "ningún selector fuera de su bloque" sin cambiar el comportamiento.
- `.titulo-seccion` y `.etiqueta` usan `color: inherit`: la banda (clara u oscura) fija el color y el componente sirve en las dos sin modificador.
- `.numero-seccion` a `max(2rem, var(--text-xl))` (32-36px): cumple ">= 32px" de DESIGN/BLUEPRINT también en móvil (revisión: con `--text-xl` solo quedaba en 28px a 375px).
- Skip link = `.skip-link.btn.btn--relleno`; se oculta con `transform` en vez de `top: -100%` y su texto se traduce (`global.skip`).
- Se borran todos los `transition-delay` sueltos (35) y el parche `.contacto__btn-whatsapp.visible`; el escalonado pasa a `--orden` en el HTML (hero 0-3, valores de Nosotros 0-3, datos de Contacto 1-3).
- IO de entrada: threshold 0.15 sin `rootMargin` (DESIGN); IO de enlace activo observa solo `main > section[id]` (arregla el error 13.3).
- i18n: etiquetas con línea se reestructuran como `<p><span línea></span><span data-i18n>texto</span></p>`; las claves ya no llevan `<span>` embebido (arregla el error 13.2).
- `data-wa="x"` resuelve la clave `wa.x`; para las 4 tarjetas viejas del catálogo se crean `wa.libreros|mesas|tv|sillas` (transitorias, se borran en paso 3/8). `data-wa-pieza` queda implementado para el paso 3.
- El mensaje de "Centros de TV" se escribe ya como "cotizar un centro de TV": al crear la clave nueva no tiene sentido copiar el error "escritorio" (13.1).
- Enlace de WhatsApp del footer (icono) se deja sin mensaje ni `data-wa`: el BLUEPRINT solo pide `wa.general` en nav, hero, contacto y flotante.
- Idioma inicial: guardado > idioma del navegador > ES; solo se guarda en `localStorage` cuando el usuario pulsa un botón (antes guardaba también el idioma detectado y lo dejaba fijo). Lectura y escritura dentro de `try/catch`.
- `aplicarIdioma` también traduce `document.title` y `meta[name=description]` (claves `meta.title`, `meta.desc`).
- Selector de idioma por delegación en `.nav__idioma`; `role="region"` -> `group` se deja para el paso 1 (13.6), igual que la limpieza de nav pill y del listener de scroll.
- `CONFIG` sin usar se elimina (13.4); el número vive en `WHATSAPP_NUMERO`.
- Revisión: el `href` estático de "Centros de TV" en el HTML también pasa a "centro de TV" (antes solo cambiaba tras alternar idioma, porque en ES no se reaplica `aplicarIdioma` al cargar).
- Revisión: el desbordamiento de las 5 tarjetas de Valores a 768px ya existía con los tokens viejos (se comprobó); se deja para el paso 2.

## Paso 1 - Nav + Hero

- Hero vertical (9:16) vs horizontal (16:9) no se decide solo por ancho: vertical = `(max-width: 767px), (orientation: portrait) and (max-width: 1279px)`. Con el corte por ancho de 768 una tableta en retrato (768x1024) recortaba el mueble de la foto 16:9; la misma consulta vive en los `<source>`, en el CSS y en `CONSULTA_HERO_VERTICAL` de JS.
- Titular del hero en horizontal: `font-size` calculado para no pisar nunca el mueble (con cover y foco 70% el mueble empieza en `min(48vw, 70vw - 39svh)`; ÷ 5.8em, el ancho medido de "Transformamos"). Queda en ~84px a 1440x900 y 1920x1080; los 140px de `--text-display` montaban el titular sobre el mueble. En vertical se usa `--text-display` tal cual (56px a 375).
- El texto del hero se alinea con el `.contenedor` (mismo borde que el logo del nav) en vez de pegarse a `--space-lg` del borde de la ventana; por debajo de 1352px las dos cosas coinciden.
- Selector ES/EN sobre el hero: el gris piedra del inactivo mide 2.2:1 sobre la foto, así que con el nav transparente los dos botones van en negro y el activo se marca con subrayado rojo + `aria-pressed`; con el nav sólido (papel) vuelve a piedra (6.47:1).
- Contraste medido con el texto oculto, en 4 frames del video (percentil 5 de luminancia bajo cada caja): 1440x900 negro >= 6.2:1 en todo (nav, etiqueta, h1, contorno, pausa); 375x812 >= 14.7:1 en texto y 5.5:1 en el botón de pausa. El póster coincide con el frame 0 (~2/255), así que cubre el caso de reduced-motion.
- LCP medido = el h1 (~750 ms con la entrada), no la imagen. Causa real (revisión): Chrome excluye como candidata a LCP la imagen que ocupa todo el viewport (se comprobó: con 2px menos de alto la imagen pasa a ser el LCP a 184 ms); no es por "bajo peso por píxel" (0.28 bpp, el umbral es 0.05). No se recorta el hero para forzar la métrica: la imagen ya va con `fetchpriority="high"` y pinta antes que el h1; no se agrega `preload`.
- Logo: `assets/logo/medeisa-logo.png` a 280px de ancho (21 KB, antes 682 KB), mostrado a 48px de alto y sin filtro; `alt=""` porque el enlace ya tiene `aria-label` traducible. El footer sigue con `logo.PNG` hasta el paso 6 y el favicon hasta el paso 7.
- `og:image` y la imagen del schema siguen apuntando a `hero-v4.jpeg`: se cambian a `hero-og.jpg` en el paso 7 (metadatos), como marca la tabla de orden.
- El menú móvil vive dentro del `<header>` (antes estaba fuera), así el orden de foco sigue a la hamburguesa; se oculta con `hidden` y entra con `@starting-style` (0.6s, sin animación en navegadores sin soporte). Con el menú abierto el nav pasa a papel (`.encabezado--menu-abierto`).
- Sin JS el nav queda sólido y el CTA del nav visible (`html:not(.js)`), porque no hay IO que lo cambie al salir del hero.
- Botón de pausa: 44px, contorno negro, radio 5px, arriba del flotante de WhatsApp y centrado con él; al pulsarlo cambia la clave del `aria-label` (`hero.pausa` / `hero.reanudar`), que se retraduce al cambiar de idioma (helper `traducirAria`, igual que la hamburguesa con `nav.menu-abrir` / `nav.menu-cerrar`).
- El IO de enlace activo marca también el menú móvil y añade `aria-current="location"`; el hero ahora tiene `id="inicio"` (destino del logo) y ningún enlace lo marca.
- Claves nuevas de nav: `nav.aria`, `nav.logo-aria`, `nav.idioma-aria`, `nav.cta`, `nav.menu-abrir`, `nav.menu-cerrar`. Del hero se borran `hero.eyebrow`, `hero.titulo-l1/l2`, `hero.subtitulo`, `hero.btn-prim`, `hero.cta-ghost`, `hero.deco`.
- Revisión: en móvil real (Safari con barras, 390x664 / 375x553) los botones del hero quedaban encima del mueble (las ramas del jarrón empiezan al 49% del alto de la foto 9:16). En vertical el hero crece a `max(100svh, fin-texto / 0.49, fin-texto + 90.7vw)` con `--hero-texto-fin` 26.5rem (29rem desde 768px, 33rem bajo 360px): el mueble siempre empieza bajo el texto y puede quedar parte bajo el pliegue. Se ajusta el encuadre, no se oscurece (DESIGN).
- Revisión: teléfono apaisado (alto < 500px, p. ej. 812x375, 915x412): los botones del hero se apilan y el padding se compacta; en fila "Ver catálogo" montaba la pata del mueble.
- Revisión: el botón de pausa ya no usa `aria-pressed`; solo cambia su etiqueta (Pausar/Reanudar) y una clase para el icono. Cambiar nombre y estado a la vez daba lecturas contradictorias ("Reanudar, presionado").
- Revisión: `.nav__logo` con `justify-self: start`; en el grid desktop el enlace se estiraba a 412px de ancho (área clicable y anillo de foco invisibles a la derecha del logo).
- Revisión: la clase `.js` se pone con un script inline de una línea en el `<head>`; con solo `main.js` (defer) el primer pintado podía mostrar el nav sólido con CTA (estado sin JS) y luego pasar a transparente.
- Revisión: el botón de pausa se ancla a la primera pantalla (`top: 100svh - ...`), no al fondo del hero (en vertical el hero puede superar el viewport), y lleva relleno papel: sobre el acero negro del mueble el contorno negro solo daba 1:1.

## Paso 2 - Declaración + Nosotros

- Declaración: texto del SPEC ("Hecho a mano en Jalisco, pensado para durar *décadas*." / "Handmade in Jalisco, built to last *decades*."), 52 caracteres; medido: 3 líneas a la izquierda a 375, 2 líneas centradas a 768, 1024 y 1440. Se añade `text-wrap: balance`.
- Foto de Nosotros: `assets/images/nosotros.jpg` (998x1271, única fuente real) recortada a 4:5 desde arriba (se pierden 23px del borde inferior) en `assets/nosotros/nosotros.{jpg,webp}` 992x1240 y `nosotros-800w.{jpg,webp}`; no existe original a 1600px, así que no se genera una versión 1600w inflada. Original sin tocar.
- En móvil y tableta la foto se limita a 28rem (448px) de ancho; a 768 ocupar 696px de ancho x 870 de alto dominaba la sección.
- Se conservan las claves i18n existentes (`nos.enfoque-etiqueta`, `nos.v1.nom`...) en vez de renombrarlas a los nombres del BLUEPRINT: ya funcionan con `data-i18n` y renombrar solo añade riesgo. Claves nuevas: `decl.aria`, `decl.texto`, `nos.alt`, `nos.afil1-desc|lema|aria`, `nos.afil2-desc|lema|aria`.
- Subtítulos de bloque (Enfoque, Misión, Visión, Valores, Afiliaciones) pasan a `<h3>` con clase `.etiqueta`: dan estructura de encabezados bajo el h2; las listas usan `aria-labelledby` a su h3 (se quita el `aria-label` fijo en español del enfoque).
- La etiqueta "Quiénes somos" lleva texto negro: el número 01 ya es la nota roja del grupo (BLUEPRINT 0.3).
- Se conserva el titular original con tres palabras en cursiva ("crecemos con identidad"); cambiar el texto no es parte del refactor visual.
- Valores en 5 columnas solo desde 1280px (3 + 2 entre 768 y 1279): a 1024 cada columna mide 174px y "Commitment" (EN) medía 176px y se desbordaba.
- Afiliaciones: la línea roja de hover/foco es un `::after` escalado desde la izquierda sobre el hairline inferior (sin span extra); `aria-label` con "(abre en nueva pestaña)" en vez de raya.
- Descripción de la intro en negro (texto principal, es el lead); Misión y Visión en piedra `#5C5854` como indica el BLUEPRINT.
- Revisión: en 2 columnas (>= 768) cada afiliación lleva su propio hairline superior; el `border-top` de la lista cruzaba el hueco entre columnas mientras los inferiores iban cortados.

## Paso 3 - Catálogo

- Nombres de pieza iguales en ES y EN (SPEC: "nombres propios NO se traducen, solo la categoría"): el `<h3>` no lleva `data-i18n`, se traducen categoría, alt, botón y mensaje. Por eso no existen claves `cat.<slug>.nombre`; `data-wa-pieza="cat.<slug>.nombre"` se deja así porque el motor solo deriva de ella `cat.<slug>.mensaje`.
- Silla Sahara se muestra como "Sillón Sahara" (SPEC Fase 1); el slug `silla-sahara` se conserva porque así están los archivos.
- Mensajes EN con el nombre sin traducir: "Hi, I would like a quote for the Centro de TV Catania by MEDEISA."
- Título: "Nuestros *productos*" / "Our *products*" (se conserva el texto original, igual que en Nosotros); etiqueta en negro porque el 02 ya es la nota roja; intro nueva en piedra dentro de la cabecera.
- Botón alternar: cambia su texto ("Ver en ambiente" / "Ver en estudio") y NO usa `aria-pressed` (mismo criterio que el botón de pausa del paso 1: nombre y estado a la vez se leían contradictorios); lleva `aria-describedby` al nombre de la pieza para distinguir los 6.
- Con puntero fino el hover del marco muestra el ambiente, el clic en la foto no alterna (si no, el estado quedaba pegado al salir el ratón) y el botón queda invisible y sin `pointer-events` salvo con `:focus-visible`. En táctil alternan el botón y el toque en la foto.
- Foco de teclado: el ambiente se muestra con `.pieza:has(.enlace-cotizar:focus-visible)`, no con cualquier `:focus-visible`; si el botón alternar también lo activara, pulsarlo no cambiaría nada visible.
- Las 6 fotos de ambiente traen franjas negras de 0.35% arriba y abajo (3px a 800w, 7px a 1600w; medido). Se recortan con `transform: scale(1.02)` fijo en el `img` de ambiente (no es zoom animado); corregir los archivos queda pendiente para el paso 8 o una regeneración local.
- `width="800" height="1000"` en los `img` (igual que Nosotros; misma proporción 4:5 que 1600x2000).
- Escalonado de entrada `--orden` = índice % 3 (0-2) en cada `li.pieza`, que es contenedor, no interactivo.
- Padding de banda `--space-2xl` (antes `--space-3xl`, que DESIGN reserva para la Declaración).
- Se borran `prod.*` y las claves transitorias `wa.libreros|mesas|tv|sillas`; `.btn--rojo` LEGADO se queda porque Contacto aún lo usa. El schema ("libreros, mesas, escritorios y sillas") se deja para el paso 7.
- Revisión: con puntero fino, si el foco sale de una pieza que quedó en ambiente por el botón (teclado), vuelve a estudio (`focusout` delegado en el grid); antes quedaba fija en ambiente sin control visible para el ratón.

## Paso 4 - Expo

- 1 foto panorámica (SPEC); `expo-1.jpeg` y `expo-2.jpeg` no se usan. `new-expo.jpeg` solo existe a 1600x900: se generan `assets/expo/expo-{800,1600}w.{jpg,webp}` (sin 2560w inflada); original sin tocar. A 1208px de contenedor en pantallas 2x se verá algo blanda (riesgo aceptado del BLUEPRINT).
- Pesos: 1600w webp 245 KB / jpg 341 KB, 800w webp 86 KB / jpg 105 KB; la foto (celosía y techo de armadura) no baja más sin artefactos visibles.
- Móvil: el marco pasa a 4:3 con `object-position: 30%` (16:9 a 335px de ancho daba 188px de alto y el stand quedaba diminuto); 16:9 desde 768px. La proporción la fija el `aspect-ratio` del marco + `width/height` del img (sin CLS).
- Se renombran `.galeria*` a `.expo*` y el h2 a `id="expo-titulo"`; `id="galeria"` se conserva (anclas de nav y footer).
- Claves `gal.etiqueta|titulo` pasan a `expo.etiqueta|titulo`; `expo.badge` pasa a `expo.edicion`; nuevas `expo.alt` y `expo.dato1-3-lbl|val`. El título "Expo Muebles Ocotlán" es nombre propio: igual en ES y EN.
- "Semestral · Febrero – Agosto" pasa a "Semestral · febrero y agosto" / "Biannual · February and August" (sin raya, meses en minúscula en ES).
- Edición: `<p>` con etiqueta ceniza + "2026" en Cormorant `--text-3xl` papel; sin línea roja propia (el 03 ya es la nota roja del grupo) y sin `aria-label` fijo en español (el texto visible ya se lee "Edición 2026").
- Etiqueta "Presencia semestral" en papel, no roja: el número 03 ya da el acento.
- Descripción en Jost 300 ceniza `#9A9794` (6.81:1 sobre negro); términos del `<dl>` en etiqueta ceniza, valores Jost 400 papel.
- Datos: `<dl>` con `<div>` por par; en móvil filas con hairline inferior; desde 768px 3 columnas con separador vertical `--color-linea-oscura` y hairline arriba y abajo.
- Fondo del marco mientras carga = carbón (panel), no hueso: sobre la banda negra un rectángulo hueso destellaba antes de la foto.
- Padding de banda `--space-2xl` (antes `--space-3xl`, reservado a la Declaración). Sin zoom en hover.
- Revisión: `.numero-seccion` pasa a `font-variant-numeric: lining-nums` (Cormorant pintaba cifras antiguas y "03" se leía "o3"); arregla 01-04 a la vez.

## Paso 5 - Contacto

- Se conservan textos y claves existentes (`cnt.titulo` "Contáctanos", subtexto, horario "Lunes a Viernes · 8:00 am – 4:00 pm"): el BLUEPRINT pide copiar los datos del negocio, no reescribirlos. El titular no lleva cursiva: es una sola palabra y cambiar el texto no es parte del refactor.
- Subtexto dentro de `.cabecera-seccion` en piedra (mismo patrón que `catalogo__intro`); etiqueta "Encuéntranos" en negro porque el 04 ya es la nota roja del grupo.
- Datos en `<dl>` con un `<div>` por par (patrón de Expo); dirección completa en `<address>` (sin cursiva) y copiada tal cual del HTML anterior; `tnum` en teléfono y horario.
- Teléfono con subrayado hairline `#D6D3CF` que pasa a rojo en hover (indica que es enlace sin poner texto rojo) y área táctil de 44px.
- CTA `.btn--relleno` sin icono (DESIGN: sin iconos decorativos); el texto del botón se traduce con `data-i18n` sobre el propio enlace y la entrada va en un contenedor `.contacto__accion`.
- Redes como `<ul>` de enlaces de texto ("Instagram @medeisa.muebles", "Facebook Medeisa") con la línea roja `::after` de nav/afiliaciones; "Síguenos" es un `<p>` con estilo de término (no h3) enlazado a la lista con `aria-labelledby`.
- `aria-label` de redes y del enlace a Maps empiezan con el texto visible y añaden "(abre en nueva pestaña)" (WCAG 2.5.3 label-in-name; el anterior "Abrir ubicación..." no contenía "Ver en Maps"); todos traducibles: `cnt.ig-aria`, `cnt.fb-aria`, `cnt.mapa-aria`, `cnt.mapa-titulo` (title del iframe), `cnt.mapa-link` "Ver en Google Maps" sin flecha ni `&nbsp;`.
- Mapa en `<figure>` con `<figcaption>` (nombre Cormorant 400 + dirección corta piedra + `.btn--contorno`); en móvil el pie se apila, desde 768px nombre a la izquierda y botón a la derecha.
- Recorte del iframe al radio: `isolation: isolate` + `mask-image` (con prefijo `-webkit-`) desde el principio, sin esperar a probar en Safari (no hay WebKit en el entorno de verificación; la máscara es el recorte fiable conocido).
- Fondo del marco del mapa mientras carga = papel, no hueso: sobre la banda hueso el marco sería invisible hasta que carga el iframe.
- Iframe 320px en móvil y 520px desde 768px (en 768-1023 ya hay ancho suficiente aunque siga en una columna).
- Grid desktop `5fr 7fr` desde 1024px con `column-gap: --space-xl`, alineado arriba; padding de banda `--space-2xl` arriba y abajo (antes `--space-3xl` arriba y casi nada abajo).
- Se eliminan del bloque: iconos SVG, borde rojo de 3px, cabecera oscura del mapa, sombra y borde del mapa, grises sueltos `#777773`/`#3A3A38`, estados `:active` con `scale`. `.btn--rojo` LEGADO ya no tiene uso en el HTML; se deja en COMPONENTES COMPARTIDOS para que lo borre el paso 8.

## Paso 6 - Footer + WhatsApp flotante

- Flotante VERDE `#25D366` (SPEC gana al BLUEPRINT, que pedía rojo); hover/active `--color-whatsapp-hover` #1DA851, sin escalar ni pulso; aparición única de opacidad 0.6s (el bloque global de reduced-motion la anula). Icono blanco `--color-icono-flotante`: 1.98:1 sobre el verde, se acepta por ser el glifo de marca WhatsApp (decisión del usuario: verde). Ojo: el círculo verde solo pasa 3:1 sobre negro (10:1); sobre hueso 1.52:1 y papel 1.82:1, la sombra ayuda a separarlo. Desviación WCAG 1.4.11 consciente, pendiente de visto bueno del usuario (alternativa: glifo #0a0a0a, 10:1).
- Foco del flotante: se queda el anillo rojo global (sobre verde se distingue; el anillo negro del BLUEPRINT era por el fondo rojo, que ya no aplica).
- Tokens nuevos `--flotante-tamano` (56px) y `--flotante-margen` (`--space-md` móvil, `--space-lg` desde 768px) + `env(safe-area-inset-*)`; `.hero__pausa` (paso 2) pasa a usarlos para seguir centrado sobre el flotante con el nuevo margen móvil.
- `aria-label` del flotante traducible (`wa.aria`), con "(abre en nueva pestaña)"; `data-wa="general"` ya existía.
- Footer: logo = `assets/logo/medeisa-logo.png` en papel monocromo (`brightness(0) invert(0.96)`): `invert(1)` volvía cian la M roja; rojo del footer queda solo en la línea de hover (BLUEPRINT).
- "Metales de Innovación" (subtítulo de marca) no se traduce, igual que los nombres propios; clave `pie.subtitulo` con el mismo valor en ES/EN.
- Lema `pie.tagline` pasa a `data-i18n-html` con `<em>estilo</em>` / `<em>style</em>`, Cormorant 300 `--text-2xl`, alineado a la derecha desde 768px.
- Redes como texto (Instagram, Facebook, WhatsApp) sin `aria-label`; el aviso de nueva pestaña va en `.sr-only` traducible (`pie.nueva-pestana`) para que el nombre accesible empiece por el texto visible. WhatsApp del footer usa `data-wa="general"`.
- Lista de redes con `aria-label` traducible (`pie.redes-aria`); nav del footer con `pie.nav-aria`. Logo con `nav.logo-aria` (misma frase que el nav) y ancla `#inicio`.
- Créditos dentro del contenedor (la hairline mide lo mismo que el contenido). Para no quedar bajo el flotante: en móvil `padding-bottom` = flotante + 2 márgenes; desde 768px `padding-right` que se reduce a 0 cuando el margen lateral del contenedor ya libra el botón (a 1440 queda alineado con el borde del contenido).
- Se eliminan: borde superior del footer, todos los `rgba(245,244,240,...)`, iconos SVG de redes, `:active` con `scale`, sombra verde, `::before` y `@keyframes pulso-whatsapp`.
