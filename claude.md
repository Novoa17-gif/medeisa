# MEDEISA — Sitio Web Oficial

## Proyecto
Landing page de presentación para MEDEISA S.A. de C.V., mueblería industrial
en Ocotlán, Jalisco, México. El objetivo es dar presencia digital profesional
y generar contacto directo vía WhatsApp.

## Stack
- HTML5 semántico + CSS3 + JavaScript ES2024 vanilla
- Google Fonts (Montserrat)
- Sin frameworks, sin dependencias externas
- Sin build tools — debe correr abriendo index.html directo

## Identidad de marca
- Slogan: "Transformamos acero en estilo"
- Subtítulo: "Metales de Innovación"
- Tipografía: Montserrat (300, 400, 500, 600)
- Negro: #0a0a0a
- Rojo: #F11E24
- Blanco: #F5F5F5
- Estilo: moderno, minimalista, industrial

## Datos del negocio
- WhatsApp: 3921236728
- Horario: Lunes a Viernes 8am – 4pm
- Dirección: Carr. Santa Rosa La Barca KM 49+200, Cuitzeo, Poncitlán, Jalisco CP 45965
- Instagram: @medeisa.muebles
- Facebook: Medeisa

## Estructura de archivos
```
medeisa/
├── CLAUDE.md
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
└── assets/
    ├── logo/
    └── images/
```

## Secciones (en orden)
1. Nav — logo + links + botón WhatsApp
2. Hero — imagen principal + slogan + CTA
3. Nosotros — historia + valores + foto
4. Productos — 4 a 5 tarjetas sin precios, CTA "Cotizar"
5. Galería — grid de fotos
6. Contacto — teléfono, horario, dirección, Google Maps embed
7. Footer — logo, redes sociales, créditos
8. Botón WhatsApp flotante fijo esquina inferior derecha

---

## Estándares de código — Elite Tier 2026

### HTML
- HTML5 semántico estricto: usar <main>, <section>, <article>, <nav>, <header>, <footer>, <aside> correctamente
- Cada <section> debe tener su <h2> o aria-label para accesibilidad
- Atributos alt descriptivos en todas las imágenes
- Meta tags completos: charset, viewport, description, og:title, og:description, og:image
- Preconnect a Google Fonts en el <head>
- Scripts al final del <body> con defer
- Sin divitis — usar el elemento semántico correcto siempre

### CSS
- Todas las variables en :root al inicio del archivo
- Sistema de espaciado con variables: --space-xs, --space-sm, --space-md, --space-lg, --space-xl, --space-2xl
- Sistema tipográfico con variables: --text-sm, --text-base, --text-lg, --text-xl, --text-2xl, --text-3xl
- Mobile-first obligatorio: estilos base para móvil, media queries para desktop
- Breakpoints estándar: 480px, 768px, 1024px, 1280px
- Usar CSS custom properties para todo lo que se repita
- Animaciones con prefers-reduced-motion respetado
- Usar clamp() para tipografía fluida responsive
- Usar CSS Grid y Flexbox — sin floats, sin hacks
- Nombrado de clases en kebab-case descriptivo en español
- Agrupar estilos por sección con comentarios delimitadores claros
- Sin !important salvo casos excepcionales justificados
- Transiciones suaves: 0.3s ease para hover, 0.6s ease para animaciones de entrada

### JavaScript
- ES2024 moderno: const/let, arrow functions, template literals, optional chaining
- Sin var en ningún caso
- Funciones puras cuando sea posible
- Intersection Observer para animaciones al hacer scroll (no scroll events)
- Event delegation donde aplique
- Sin jQuery ni librerías externas
- Código organizado en módulos lógicos con comentarios de sección
- Manejo de errores con try/catch donde aplique
- No manipular el DOM en bucles — agrupar cambios

### Performance
- Imágenes con loading="lazy" en todo lo que esté below the fold
- Fuentes con font-display: swap
- CSS crítico inline si es necesario para el hero
- Sin bloqueo de render — todo async/defer

### Accesibilidad (WCAG 2.1 AA)
- Contraste mínimo 4.5:1 en texto normal, 3:1 en texto grande
- Focus visible en todos los elementos interactivos
- Navegación por teclado funcional
- aria-label en botones que solo tienen ícono
- Skip link al inicio del body para saltar al contenido principal

### Git / Commits
- Commits en español, descriptivos y atómicos
- Un commit por sección terminada
- Formato: "feat: agrega sección hero con animación de entrada"

---

## Forma de trabajar

- Avanzar sección por sección — nunca todo de una vez
- Antes de escribir código, explicar en 2-3 líneas qué se va a hacer y por qué
- Si hay más de una forma de resolver algo, presentar las opciones primero
- Si se toma una decisión técnica importante, justificarla brevemente
- Código comentado en español
- Al terminar cada sección, indicar qué sigue
- No instalar dependencias externas sin consultar primero
- Priorizar legibilidad sobre cleverness