# Refactor premium MEDEISA - Spec compartido

Fuente de verdad para todos los agentes del refactor. Si algo aqui choca con otro documento, gana este.

## Objetivo
Llevar toda la pagina (index.html, css/styles.css, js/main.js) a un look minimalista premium tipo galeria,
tomando como referencia estructural el estilo **Arc** de Refero Styles:
https://styles.refero.design/style/acfb6fa1-3aed-4e64-8522-7f332a796de8
Se copia la estructura (espaciado, radios, ritmo de bandas, restriccion), NO la identidad de Arc.

## Decisiones cerradas por el usuario
- **Tono:** claro con bandas oscuras (canvas hueso/blanco, algunas secciones #0a0a0a para ritmo).
- **Rojo #F11E24:** en CTAs (WhatsApp, Cotizar) + detalles finos (lineas, numeros de seccion, eyebrow). Nunca en parrafos.
- **Tipografia:** serif en titulos grandes (Cormorant Garamond 300, cursiva permitida) + sans limpia para todo lo demas (Jost o Montserrat, elegir una y justificar). Maximo 2 familias en la pagina.
- **Imagenes:** radio 32px en toda la fotografia contenida (catalogo, nosotros, expo). Controles 5px. Nada entre 6 y 31px.
- **Hero:** "Galeria de luz". Foto completa luminosa (NO oscurecer: quitar brightness(0.82) y el degradado negro fuerte). Muro de yeso hueso, Centro TV Catania solo como pieza de museo, sombras de ventana. Version video: camara fija, solo avanzan las sombras (Higgsfield, modelo mas barato: Kling 3.0 std, 5s, sin audio). Texto oscuro sobre zona clara del muro.
  **Video tambien en movil** (la mayoria del trafico es movil): video vertical propio 9:16 (~720x1280, H.264 MP4 + WebM, objetivo <1.5 MB, 5s loop, muted autoplay playsinline). Desktop usa el 16:9. Poster estatico solo con prefers-reduced-motion o Save-Data.
- **Catalogo (6 piezas):** Centro de TV Catania, Mesa de Centro Catania, Silla Sahara, Centro de TV Sierra Azul, Mesa de Centro Sierra Azul Parota, Recamara Tulum.
  Cada pieza tiene 2 imagenes: **estudio** (grid) y **ambiente** (hover en desktop / al abrir en movil).
- **Ambientes:** regenerar TODOS en la misma escena (galeria de yeso hueso, concreto claro, luz rasante de tarde, un solo objeto decorativo). El mueble debe quedar identico a la foto real (forma, madera, acero). Se generan con Higgsfield usando la foto como referencia.
- **Estudio:** unificar LOCALMENTE sin creditos (mismo fondo hueso, misma sombra de contacto, 4:5).
- **Creditos Higgsfield:** 238 disponibles. Nada se genera sin cotizacion aprobada por el usuario.
- **Decisiones Fase 1 (usuario):** boton flotante WhatsApp se queda VERDE #25D366; botones rojos con texto = fondo #C0001F + texto blanco (#F11E24 solo lineas/detalles); ambos videos del hero en 1080p (Kling pro, sin audio); Recamara Tulum = cama + 1 buro en estudio y ambiente; nombre "Sillon Sahara" (patas acero negro); mismo objeto decorativo en los 6 ambientes.
- **Dudas del blueprint resueltas (orquestador, con delegacion del usuario):** h1 del hero = slogan "Transformamos acero en *estilo*"; Declaracion = "Hecho a mano en Jalisco, pensado para durar *decadas*". Nosotros usa la foto real existente assets/images/nosotros.jpg (autenticidad > regla "sin personas"). Expo = 1 foto panoramica (new-expo.jpeg). Nombres propios de piezas NO se traducen (solo la categoria). Tulum = cama + 1 buro en ambas fotos (ya resuelto).
- **Assets finales listos:** assets/catalogo/<slug>-{estudio,ambiente}[-800w].{jpg,webp} (6 piezas); assets/hero/hero-{2560,1920,1280}w, hero-movil-{1080,720}w (.jpg/.webp), hero-og.jpg; videos assets/hero/hero-luz(.mp4/.webm, 1920x1080, 0.8 MB/0.23 MB) y hero-luz-movil(.mp4/.webm, 720x1280, 0.26 MB/0.11 MB): loops de 10 s ida y vuelta (5 s Kling pro + reverso), sin costura, sin audio, camara fija verificada (0 px de deriva). Posters = hero-*w / hero-movil-*w (diferencia de color con el frame 0 ~2/255).
- **Revision por fases:** 1) sistema de diseno + skill + blueprint, 2) imagenes Higgsfield, 3) refactor seccion por seccion, 4) revision final.

## Fuentes de imagen
Carpeta: `/Users/alannovoa/Documents/Deiro/Hogar` (linea industrial = MEDEISA). Solo lectura, no modificar nada ahi.
- Centro TV Catania: `Mesas de centro : TV/Linea Industrial/Centro de TV Catania/` (SF.webp, SF2.JPG 3965x5950 foto real, Amb.webp)
- Mesa de Centro Catania: `Mesas de centro : TV/Linea Industrial/Mesa de Centro Catania/` (SF.png, FG/FG2/FG3.webp fotos reales, Amb.webp)
- Silla Sahara: `Comedor/SILLAS Y BANCOS/Línea Industrial /Silla Sahara/` (SF.png, Amb Ppal.png)
- Centro TV Sierra Azul: `Mesas de centro : TV/Linea Industrial/Centro de TV Sierra Azul Parota/` (SF.png, .png)
- Mesa Centro Sierra Azul Parota: `Mesas de centro : TV/Linea Industrial/Mesa de Centro Sierra Azul Parota/`
- Recamara Tulum: `Recamara/Línea Industrial /Juego de Recamara/Recamara Tulum Chapa/` (SF.png, Amb Ppal.png)
Ojo: varias rutas tienen espacios al final del nombre de carpeta y acentos.

## Restricciones del proyecto
- Vanilla HTML/CSS/JS, sin build, debe abrir con index.html directo. Reglas completas en CLAUDE.md del proyecto.
- Conservar: i18n ES/EN existente, boton WhatsApp flotante, datos del negocio, accesibilidad (skip link, focus, alt), SEO/meta.
- Animaciones: entrada suave 0.6s (fade + desplazamiento corto), sin rebotes, respetar prefers-reduced-motion.
- Hay cambios sin commitear en el repo: no hacer commits ni revertir nada sin aprobacion.

## Artefactos (docs/refactor-premium/)
- `DESIGN.md` - sistema de diseno MEDEISA (formato Refero: tokens, componentes, do/don't).
- `BLUEPRINT.md` - plan seccion por seccion del refactor.
- `HIGGSFIELD-PLAN.md` - prompts, modelo, costo estimado por imagen/video.
- Skill: `~/.claude/skills/medeisa-estilo/SKILL.md`.
