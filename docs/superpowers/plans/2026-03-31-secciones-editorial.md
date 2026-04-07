# Secciones Editorial — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar el lenguaje visual del hero (Cormorant Garamond, Jost ultralight, cero border-radius, acento rojo mínimo) a Nosotros, Productos, Galería, Contacto y Footer.

**Architecture:** Todos los cambios viven en `css/styles.css`. Un único cambio puntual en `index.html` (clases de botones en tarjetas de productos). No se modifica estructura HTML, grids, ni copy.

**Tech Stack:** HTML5 semántico, CSS3 vanilla (sin frameworks), fuentes ya importadas: Cormorant Garamond + Jost + Montserrat.

---

## Archivos a modificar

- `css/styles.css` — todas las reglas de Nosotros, Productos, Galería, Contacto, Footer
- `index.html` — solo las 4 clases de botón en `.producto-tarjeta__btn`

---

### Task 1: Sistema tipográfico compartido

**Files:**
- Modify: `css/styles.css` — bloque compartido de etiquetas y títulos (~líneas 718–740)

- [ ] **Reemplazar las etiquetas compartidas**

Buscar y reemplazar el bloque exacto:
```css
.nosotros__etiqueta,
.productos__etiqueta,
.galeria__etiqueta,
.contacto__etiqueta {
  font-size: var(--text-sm);
  font-weight: var(--fw-semibold);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--color-rojo);
  margin-bottom: var(--space-md);
  transition-delay: 0.05s;
}
```
Por:
```css
.nosotros__etiqueta,
.productos__etiqueta,
.galeria__etiqueta,
.contacto__etiqueta {
  font-family: var(--font-jost);
  font-size: var(--text-sm);
  font-weight: 200;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: rgba(245, 245, 245, 0.5);
  margin-bottom: var(--space-md);
  transition-delay: 0.05s;
}
```

- [ ] **Reemplazar los títulos h2 compartidos**

Buscar y reemplazar el bloque exacto:
```css
.nosotros__titulo,
.productos__titulo,
.galeria__titulo,
.contacto__titulo {
  font-size: var(--text-3xl);
  font-weight: var(--fw-semibold);
  letter-spacing: -0.02em;
  color: var(--color-blanco);
  transition-delay: 0.1s;
}
```
Por:
```css
.nosotros__titulo,
.productos__titulo,
.galeria__titulo,
.contacto__titulo {
  font-family: var(--font-serif);
  font-size: clamp(2.5rem, 5vw, 3.5rem);
  font-weight: 300;
  letter-spacing: -0.01em;
  color: var(--color-blanco);
  transition-delay: 0.1s;
}
```

- [ ] **Verificar en browser:** abrir `index.html`, confirmar que los h2 de todas las secciones muestran Cormorant Garamond y las etiquetas muestran Jost ultralight en blanco.

- [ ] **Commit**
```
feat: sistema tipográfico editorial compartido en secciones
```

---

### Task 2: Sección Nosotros

**Files:**
- Modify: `css/styles.css` — bloque `/* NOSOTROS */`

- [ ] **Eliminar el marco decorativo rojo de la imagen**

Eliminar el bloque completo:
```css
/* Marco decorativo rojo desplazado abajo-izquierda */
.nosotros__imagen-wrap::before {
  content: '';
  position: absolute;
  inset: var(--space-md) var(--space-md) 0 0;
  border: 2px solid var(--color-rojo);
  border-radius: var(--radio-md);
  z-index: 0;
  opacity: 0.7;
}
```
Y en `.nosotros__imagen-wrap` eliminar el `padding: 0 0 var(--space-md) var(--space-md)`:
```css
.nosotros__imagen-wrap {
  position: relative;
  transition-delay: 0.25s;
  align-self: start;
}
```

- [ ] **Quitar border-radius y box-shadow de la imagen**

Reemplazar `.nosotros__imagen`:
```css
.nosotros__imagen {
  position: relative;
  z-index: 1;
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  object-position: center top;
  display: block;
}
```

- [ ] **Cambiar color del guión "—" de valores**

Reemplazar en `.nosotros__valor-icono`:
```css
.nosotros__valor-icono {
  font-size: var(--text-xl);
  font-weight: var(--fw-regular);
  color: rgba(245, 245, 245, 0.4);
  line-height: 1.4;
  flex-shrink: 0;
}
```

- [ ] **Aligerar peso tipográfico de strong en valores**

Reemplazar `.nosotros__valor strong`:
```css
.nosotros__valor strong {
  display: block;
  font-size: var(--text-base);
  font-weight: var(--fw-regular);
  color: var(--color-blanco);
  margin-bottom: var(--space-xs);
}
```

- [ ] **Verificar en browser:** sección Nosotros sin marco rojo, imagen con bordes rectos, guiones en blanco opaco.

- [ ] **Commit**
```
feat: sección nosotros con estética editorial
```

---

### Task 3: Sección Productos

**Files:**
- Modify: `css/styles.css` — bloque `/* PRODUCTOS */`
- Modify: `index.html` — clases de los 4 botones "Cotizar"

- [ ] **Left-align el encabezado de productos**

Reemplazar `.productos__encabezado`:
```css
.productos__encabezado {
  text-align: left;
  margin-bottom: var(--space-2xl);
}
```

- [ ] **Quitar border-radius de las tarjetas y suavizar hover**

Reemplazar `.producto-tarjeta`:
```css
.producto-tarjeta {
  background-color: var(--color-negro);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform var(--transicion-hover), box-shadow var(--transicion-hover);
}
```

Reemplazar `.producto-tarjeta:hover`:
```css
.producto-tarjeta:hover {
  transform: translateY(-4px);
  box-shadow: var(--sombra-suave);
}
```

- [ ] **Aligerar el nombre del producto**

Reemplazar `.producto-tarjeta__nombre`:
```css
.producto-tarjeta__nombre {
  font-family: var(--font-jost);
  font-size: var(--text-base);
  font-weight: 300;
  color: var(--color-blanco);
  line-height: 1.4;
  letter-spacing: 0.03em;
}
```

- [ ] **Nuevo estilo ghost para el botón de tarjeta**

Agregar al final del bloque PRODUCTOS en `css/styles.css`:
```css
/* Botón cotizar en tarjeta: ghost con borde, sin border-radius */
.producto-tarjeta__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0.5rem 1.5rem;
  background-color: transparent;
  color: rgba(245, 245, 245, 0.75);
  border: 1px solid rgba(245, 245, 245, 0.3);
  font-family: var(--font-jost);
  font-size: var(--text-sm);
  font-weight: 300;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  align-self: flex-start;
  margin-top: auto;
  transition:
    background-color var(--transicion-hover),
    color var(--transicion-hover),
    border-color var(--transicion-hover);
}

.producto-tarjeta__btn:hover {
  background-color: var(--color-blanco);
  color: #0a0a08;
  border-color: var(--color-blanco);
}
```

- [ ] **Actualizar clases de los 4 botones en index.html**

En `index.html`, los 4 botones "Cotizar" tienen clase `btn btn--rojo producto-tarjeta__btn`.
Cambiar cada uno a solo `producto-tarjeta__btn`:
```html
<!-- Tarjeta libreros -->
<a class="producto-tarjeta__btn" href="...">Cotizar</a>

<!-- Tarjeta mesas -->
<a class="producto-tarjeta__btn" href="...">Cotizar</a>

<!-- Tarjeta escritorios -->
<a class="producto-tarjeta__btn" href="...">Cotizar</a>

<!-- Tarjeta sillas -->
<a class="producto-tarjeta__btn" href="...">Cotizar</a>
```

- [ ] **Verificar en browser:** encabezado left-aligned, tarjetas sin esquinas redondeadas, botones ghost con borde blanco.

- [ ] **Commit**
```
feat: sección productos con estética editorial
```

---

### Task 4: Sección Galería

**Files:**
- Modify: `css/styles.css` — bloque `/* GALERÍA */`

- [ ] **Left-align el encabezado de galería**

Reemplazar `.galeria__encabezado`:
```css
.galeria__encabezado {
  text-align: left;
  margin-bottom: var(--space-2xl);
}
```

- [ ] **Quitar border-radius de los items**

Reemplazar `.galeria__item`:
```css
.galeria__item {
  overflow: hidden;
}
```

- [ ] **Verificar en browser:** encabezado left-aligned, items de galería con bordes rectos.

- [ ] **Commit**
```
feat: sección galería con estética editorial
```

---

### Task 5: Sección Contacto

**Files:**
- Modify: `css/styles.css` — bloque `/* CONTACTO */`

- [ ] **Simplificar íconos de datos de contacto**

Reemplazar `.contacto__dato-icono`:
```css
.contacto__dato-icono {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(245, 245, 245, 0.55);
  margin-top: 2px;
}
```

- [ ] **Actualizar estilo de labels de datos**

Reemplazar `.contacto__dato-label`:
```css
.contacto__dato-label {
  font-family: var(--font-jost);
  font-size: var(--text-sm);
  font-weight: 200;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(245, 245, 245, 0.45);
}
```

- [ ] **Quitar border-radius del mapa**

Reemplazar `.contacto__mapa-wrap`:
```css
.contacto__mapa-wrap {
  overflow: hidden;
  border: 1px solid rgba(245, 245, 245, 0.08);
  transition-delay: 0.15s;
}
```

- [ ] **Simplificar links de redes sociales**

Reemplazar `.contacto__red`:
```css
.contacto__red {
  display: inline-flex;
  align-items: center;
  gap: var(--space-sm);
  font-family: var(--font-jost);
  font-size: var(--text-sm);
  font-weight: 200;
  letter-spacing: 0.08em;
  color: rgba(245, 245, 245, 0.55);
  padding: var(--space-sm) 0;
  position: relative;
  transition: color var(--transicion-hover);
}

.contacto__red::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 1px;
  background-color: var(--color-blanco);
  transition: width 0.4s ease;
}

.contacto__red:hover {
  color: var(--color-blanco);
}

.contacto__red:hover::after {
  width: 100%;
}
```

- [ ] **Actualizar label "Síguenos"**

Reemplazar `.contacto__redes-label`:
```css
.contacto__redes-label {
  font-family: var(--font-jost);
  font-size: var(--text-sm);
  font-weight: 200;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(245, 245, 245, 0.45);
}
```

- [ ] **Verificar en browser:** íconos simples sin fondos, labels ultralight, mapa con bordes rectos, hover de redes con underline.

- [ ] **Commit**
```
feat: sección contacto con estética editorial
```

---

### Task 6: Footer

**Files:**
- Modify: `css/styles.css` — bloque `/* FOOTER */`

- [ ] **Simplificar logo (quitar fondo blanco redondeado)**

Reemplazar `.pie-pagina__logo-link` y `.pie-pagina__logo-link:hover`:
```css
.pie-pagina__logo-link {
  display: inline-flex;
  align-items: center;
  margin-bottom: var(--space-sm);
  opacity: 0.9;
  transition: opacity var(--transicion-hover);
}

.pie-pagina__logo-link:hover {
  opacity: 1;
}
```

- [ ] **Tagline en Cormorant Garamond italic**

Reemplazar `.pie-pagina__tagline`:
```css
.pie-pagina__tagline {
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 300;
  font-size: var(--text-base);
  letter-spacing: 0.02em;
  color: rgba(245, 245, 245, 0.45);
}
```

- [ ] **Links de navegación en Jost ultralight**

Reemplazar `.pie-pagina__link`:
```css
.pie-pagina__link {
  display: inline-block;
  padding-block: 0.375rem;
  font-family: var(--font-jost);
  font-size: var(--text-sm);
  font-weight: 200;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(245, 245, 245, 0.45);
  transition: color var(--transicion-hover);
}

.pie-pagina__link:hover {
  color: var(--color-blanco);
}
```

- [ ] **Íconos sociales sin border-radius, hover simplificado**

Reemplazar `.pie-pagina__red` y `.pie-pagina__red:hover`:
```css
.pie-pagina__red {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(245, 245, 245, 0.4);
  transition: color var(--transicion-hover);
}

.pie-pagina__red:hover {
  color: var(--color-blanco);
}
```

- [ ] **Verificar en browser:** logo limpio sobre negro, tagline en serif italic, links ultralight, íconos simples sin bordes.

- [ ] **Commit**
```
feat: footer con estética editorial
```

---

## Verificación final

- [ ] Recorrer el sitio completo de arriba a abajo
- [ ] Confirmar que ningún h2 usa Montserrat semibold
- [ ] Confirmar que ninguna etiqueta de sección usa rojo
- [ ] Confirmar que no hay border-radius en tarjetas, imagen, mapa, íconos de contacto
- [ ] Confirmar que el único rojo dentro de las secciones es el botón "Escribir por WhatsApp"
- [ ] Confirmar coherencia visual hero → nosotros → productos → galería → contacto → footer
- [ ] Probar en móvil (o DevTools 375px)
