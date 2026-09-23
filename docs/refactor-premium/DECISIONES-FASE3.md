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
