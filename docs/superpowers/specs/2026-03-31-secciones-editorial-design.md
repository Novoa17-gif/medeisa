# MEDEISA — Diseño editorial para secciones restantes

**Fecha:** 2026-03-31  
**Alcance:** Nosotros, Productos, Galería, Contacto, Footer  
**Referencia visual:** Hero section (ya implementado)

---

## Objetivo

Aplicar el lenguaje visual del hero a todas las secciones. El hero establece: Cormorant Garamond light para títulos, Jost ultralight para labels/soporte, jerarquía por opacidad, cero border-radius, acento rojo reservado a un solo elemento por sección.

---

## Sistema tipográfico (consistente con hero)

| Elemento | Fuente | Peso | Tracking | Opacidad |
|---|---|---|---|---|
| Etiqueta de sección | Jost | 200 | 0.22em | blanco 50% |
| H2 título de sección | Cormorant Garamond | 300 | -0.01em | blanco 100% |
| Cuerpo / descripción | Montserrat (existente) | 300 | — | blanco 70% |
| Labels pequeños (contacto) | Jost | 200 | 0.15em | blanco 45% |

---

## Cambios por sección

### NOSOTROS

**CSS — solo `css/styles.css`:**
- Etiquetas compartidas (`.nosotros__etiqueta`, etc.): cambiar a Jost 200, blanco 50%, quitar `color: var(--color-rojo)` y reducir `font-weight: 600 → 200`
- Títulos compartidos (`.nosotros__titulo`, etc.): cambiar a Cormorant Garamond 300, tamaño `clamp(2.5rem, 5vw, 3.5rem)`, quitar `font-weight: 600`
- `.nosotros__imagen-wrap::before`: eliminar (marco rojo decorativo)
- `.nosotros__imagen`: quitar `border-radius: var(--radio-md)`, quitar `box-shadow`
- `.nosotros__valor-icono`: cambiar `color: var(--color-rojo)` → `rgba(245,245,245,0.4)`
- `.nosotros__valor strong`: reducir `font-weight: 600 → 400`

### PRODUCTOS

**CSS — solo `css/styles.css`:**
- `.productos__encabezado`: cambiar `text-align: center` → `text-align: left`
- `.producto-tarjeta`: quitar `border-radius: var(--radio-md)`, reducir hover translateY a `-4px`
- `.producto-tarjeta:hover`: reducir `box-shadow` a `var(--sombra-suave)`
- `.producto-tarjeta__nombre`: cambiar `font-weight: 600 → 300`, añadir `font-family: var(--font-jost)`
- `.producto-tarjeta__btn` (`.btn--rojo`): reemplazar con estilo ghost igual que `hero__btn-primario` — nueva clase `.btn--ghost` o aplicar directamente en tarjeta
- `.producto-tarjeta__cuerpo`: reducir `padding: var(--space-lg)` → `var(--space-md) var(--space-lg)`

**HTML — `index.html`:**
- Cambiar clase `btn btn--rojo producto-tarjeta__btn` → `producto-tarjeta__btn` (con nuevo estilo propio)

### GALERÍA

**CSS — solo `css/styles.css`:**
- `.galeria__encabezado`: cambiar `text-align: center` → `text-align: left`
- `.galeria__item`: quitar `border-radius: var(--radio-md)`

### CONTACTO

**CSS — solo `css/styles.css`:**
- `.contacto__dato-icono`: quitar `background-color`, quitar `border`, quitar `border-radius`, cambiar `color` a `rgba(245,245,245,0.55)`, reducir a `width/height: 24px`
- `.contacto__dato-label`: cambiar a Jost 200, tracking 0.15em, color `rgba(245,245,245,0.45)`
- `.contacto__mapa-wrap`: quitar `border-radius: var(--radio-md)`
- `.contacto__red`: quitar `border-radius: var(--radio-sm)`, simplificar hover (underline/opacidad en vez de fondo rojo)
- `.contacto__redes-label`: aplicar mismo estilo Jost 200 que labels

### FOOTER

**CSS — solo `css/styles.css`:**
- `.pie-pagina__logo-link`: quitar `background: rgba(255,255,255,0.88)`, quitar `border-radius`, quitar `backdrop-filter` — logo directo sobre negro
- `.pie-pagina__tagline`: cambiar a Cormorant Garamond italic 300
- `.pie-pagina__link`: cambiar a Jost 200, tracking 0.15em
- `.pie-pagina__red`: quitar `border-radius: var(--radio-sm)`, cambiar hover a solo cambio de opacidad (sin fondo rojo)

---

## Lo que NO cambia

- WhatsApp flotante (verde #25D366, identidad de plataforma)
- Botón "Escribir por WhatsApp" en Contacto (rojo es correcto — CTA principal)
- Layouts / grids de todas las secciones
- Fondos alternantes `#0a0a0a` / `#1a1a1a`
- Animaciones de entrada (`.animar-entrada`)
- Nav
- Contenido de texto (copy)

---

## Verificación

1. Abrir `index.html` en browser, recorrer todas las secciones
2. Confirmar que etiquetas y títulos usan las nuevas fuentes
3. Confirmar que no hay border-radius en tarjetas, mapa, imagen nosotros
4. Confirmar que acento rojo solo aparece en: divisor hero, botón WhatsApp contacto, nav CTA
5. Confirmar que hero y resto del sitio se sienten como un sistema cohesionado
