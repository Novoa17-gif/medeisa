/* ================================================================
   MEDEISA - JavaScript principal
   Orden: Nav → Hero (entrada + video) → Animaciones →
          Idioma (i18n + WhatsApp) → Catálogo → Footer → Init
================================================================ */

'use strict';

/* Marca que JS está activo: el CSS usa .js .animar-entrada para el
   estado oculto inicial, así si el JS falla el contenido no queda invisible */
document.documentElement.classList.add('js');


/* ================================================================
   NAV
================================================================ */

/* Cambia la clave i18n de un aria-label según el estado y lo aplica ya
   en el idioma actual; aplicarIdioma lo mantiene al cambiar de idioma */
const traducirAria = (el, clave) => {
  if (!el) return;
  el.dataset.i18nAria = clave;
  const valor = TRADUCCIONES[document.documentElement.lang]?.[clave];
  if (valor) el.setAttribute('aria-label', valor);
};

const iniciarNav = () => {
  const encabezado  = document.getElementById('encabezado');
  const hamburguesa = document.querySelector('.nav__hamburguesa');
  const menuMovil   = document.getElementById('menu-movil');
  const hero        = document.querySelector('.hero');
  const enlaces     = document.querySelectorAll('.nav__enlace, .menu-movil__enlace');

  if (!encabezado) return;

  /* — Nav sólido al salir del hero (IO, no eventos de scroll) —
     El margen superior negativo descuenta la altura del nav fijo */
  if (hero) {
    const alturaNav = encabezado.offsetHeight;
    const observadorHero = new IntersectionObserver(
      ([entrada]) => {
        encabezado.classList.toggle('encabezado--solido', !entrada.isIntersecting);
      },
      { rootMargin: `-${alturaNav}px 0px 0px 0px` }
    );
    observadorHero.observe(hero);
  } else {
    encabezado.classList.add('encabezado--solido');
  }

  /* — Menú móvil — */
  const alternarMenu = (abrir) => {
    if (!hamburguesa || !menuMovil) return;
    hamburguesa.setAttribute('aria-expanded', String(abrir));
    traducirAria(hamburguesa, abrir ? 'nav.menu-cerrar' : 'nav.menu-abrir');
    menuMovil.hidden = !abrir;
    encabezado.classList.toggle('encabezado--menu-abierto', abrir);
  };

  hamburguesa?.addEventListener('click', () => {
    alternarMenu(hamburguesa.getAttribute('aria-expanded') !== 'true');
  });

  /* Delegación: un solo listener cierra el menú al elegir un enlace */
  menuMovil?.addEventListener('click', (e) => {
    if (e.target.closest('a')) alternarMenu(false);
  });

  /* Escape cierra y devuelve el foco a la hamburguesa */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburguesa?.getAttribute('aria-expanded') === 'true') {
      alternarMenu(false);
      hamburguesa.focus();
    }
  });

  /* Al pasar a desktop el menú móvil no existe: se cierra */
  window.matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    if (e.matches) alternarMenu(false);
  });

  /* — Enlace activo según la sección visible —
     Solo secciones hijas directas de main (no los h2 con id) */
  const secciones = document.querySelectorAll('main > section[id]');

  const observadorSecciones = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (!entrada.isIntersecting) return;
        const destino = `#${entrada.target.id}`;
        enlaces.forEach((enlace) => {
          const activo = enlace.getAttribute('href') === destino;
          enlace.classList.toggle('activo', activo);
          if (activo) enlace.setAttribute('aria-current', 'location');
          else enlace.removeAttribute('aria-current');
        });
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  secciones.forEach((s) => observadorSecciones.observe(s));
};


/* ================================================================
   HERO - Animación de entrada inmediata al cargar
================================================================ */
const iniciarHero = () => {
  /* Los elementos .animar-entrada del hero se revelan en secuencia
     según su --orden. Solo hay que agregarles .visible en el siguiente
     frame para disparar la transición. */
  const elementosHero = document.querySelectorAll('.hero .animar-entrada');

  requestAnimationFrame(() => {
    elementosHero.forEach((el) => el.classList.add('visible'));
  });
};


/* ================================================================
   HERO - Video "Galería de luz"
   La imagen es el LCP; el video se carga después de load, solo sin
   reduced-motion ni Save-Data, y cada dispositivo baja solo su versión.
================================================================ */

/* Misma consulta que los <source> verticales del <picture> y el CSS */
const CONSULTA_HERO_VERTICAL = '(max-width: 767px), (orientation: portrait) and (max-width: 1279px)';

const iniciarVideoHero = () => {
  const hero   = document.querySelector('.hero');
  const video  = hero?.querySelector('.hero__video');
  const imagen = hero?.querySelector('.hero__imagen');
  const pausa  = hero?.querySelector('.hero__pausa');

  if (!hero || !video) return;

  const movimientoReducido = window.matchMedia('(prefers-reduced-motion: reduce)');
  const vertical = window.matchMedia(CONSULTA_HERO_VERTICAL);

  if (movimientoReducido.matches || navigator.connection?.saveData) return;

  let pausadoPorUsuario = false;
  let heroVisible = true;

  const reproducir = async () => {
    if (pausadoPorUsuario || !heroVisible || document.hidden) return;
    try {
      await video.play();
    } catch {
      /* Autoplay bloqueado (p. ej. bajo consumo en iOS): se queda la imagen */
    }
  };

  /* Crea las dos fuentes (webm primero) de la versión que toca y recarga */
  const cargarFuentes = () => {
    const sufijo = vertical.matches ? 'Movil' : '';
    const fragmento = document.createDocumentFragment();

    [['webm', 'video/webm'], ['mp4', 'video/mp4']].forEach(([formato, tipo]) => {
      const fuente = document.createElement('source');
      fuente.src = video.dataset[`fuente${sufijo}${formato === 'webm' ? 'Webm' : 'Mp4'}`];
      fuente.type = tipo;
      fragmento.append(fuente);
    });

    hero.classList.remove('hero--video-activo');
    video.replaceChildren(fragmento);
    video.poster = imagen?.currentSrc ?? '';
    video.load();
    reproducir();
  };

  const arrancar = () => {
    cargarFuentes();

    /* Solo al reproducir de verdad se muestra el video y su control */
    video.addEventListener('playing', () => {
      hero.classList.add('hero--video-activo');
      if (pausa) pausa.hidden = false;
    });

    /* Rotación o cambio de tamaño: cambia a la otra proporción */
    vertical.addEventListener('change', cargarFuentes);

    /* Fuera de vista o pestaña oculta: pausa; al volver, reanuda */
    new IntersectionObserver(([entrada]) => {
      heroVisible = entrada.isIntersecting;
      if (heroVisible) reproducir();
      else video.pause();
    }).observe(hero);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) video.pause();
      else reproducir();
    });

    /* Si el usuario activa reduced-motion con la página abierta */
    movimientoReducido.addEventListener('change', (e) => {
      if (!e.matches) return;
      pausadoPorUsuario = true;
      video.pause();
      hero.classList.remove('hero--video-activo');
      if (pausa) pausa.hidden = true;
    });

    /* Botón de pausa (WCAG 2.2.2) */
    pausa?.addEventListener('click', () => {
      pausadoPorUsuario = !pausadoPorUsuario;
      /* Solo cambia la etiqueta (no aria-pressed): un toggle no debe cambiar
         de nombre y de estado a la vez ("Reanudar, presionado" confunde) */
      pausa.classList.toggle('hero__pausa--pausado', pausadoPorUsuario);
      traducirAria(pausa, pausadoPorUsuario ? 'hero.reanudar' : 'hero.pausa');
      if (pausadoPorUsuario) video.pause();
      else reproducir();
    });
  };

  /* Después de load y en un momento ocioso: no compite con el LCP */
  const alEstarOcioso = () =>
    'requestIdleCallback' in window
      ? requestIdleCallback(arrancar, { timeout: 2000 })
      : setTimeout(arrancar, 200);

  if (document.readyState === 'complete') alEstarOcioso();
  else window.addEventListener('load', alEstarOcioso, { once: true });
};


/* ================================================================
   ANIMACIONES DE ENTRADA (Intersection Observer)
   Activa la clase .visible en elementos con .animar-entrada
   cuando entran al viewport, una sola vez.
================================================================ */
const iniciarAnimacionesEntrada = () => {
  const elementos = document.querySelectorAll('.animar-entrada');

  if (!elementos.length) return;

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          entrada.target.classList.add('visible');
          observador.unobserve(entrada.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  elementos.forEach((el) => observador.observe(el));
};


/* ================================================================
   IDIOMA - Selector ES / EN
   Motor de traducción por atributos, sin dependencias externas:
   - data-i18n="clave"        → textContent
   - data-i18n-html="clave"   → innerHTML (solo claves con <em>)
   - data-i18n-alt="clave"    → atributo alt
   - data-i18n-aria="clave"   → atributo aria-label
   - data-i18n-title="clave"  → atributo title
   - data-wa="x"              → href de WhatsApp con el mensaje wa.x
   - data-wa-pieza="cat.<slug>.nombre" → href con cat.<slug>.mensaje
   Cada sección edita solo su bloque, delimitado por comentarios idénticos
   en ES y EN.
================================================================ */

const WHATSAPP_NUMERO = '523921236728';
const CLAVE_IDIOMA = 'medeisa-lang';

/* ---- Diccionario de traducciones ---- */
const TRADUCCIONES = {
  es: {
    /* --- GLOBAL --- */
    'meta.title':  'MEDEISA — Mueblería Industrial en Ocotlán, Jalisco',
    'meta.desc':   'MEDEISA — Mueblería industrial en Ocotlán, Jalisco. Transformamos acero en estilo. Cotiza tus muebles metálicos a medida.',
    'global.skip': 'Saltar al contenido principal',
    'wa.general':  'Hola, me gustaría cotizar un producto de MEDEISA.',
    'wa.aria':     'Contactar por WhatsApp (abre en nueva pestaña)',

    /* --- NAV --- */
    'nav.aria':         'Navegación principal',
    'nav.logo-aria':    'MEDEISA, ir al inicio',
    'nav.nosotros':     'Nosotros',
    'nav.productos':    'Productos',
    'nav.galeria':      'Expo',
    'nav.contacto':     'Contacto',
    'nav.idioma-aria':  'Idioma',
    'nav.cta':          'Cotizar por WhatsApp',
    'nav.menu-abrir':   'Abrir menú de navegación',
    'nav.menu-cerrar':  'Cerrar menú de navegación',

    /* --- HERO --- */
    'hero.etiqueta':  'Mueblería industrial · Ocotlán, Jalisco',
    'hero.titulo':    'Transformamos acero en <em>estilo</em>',
    'hero.cta':       'Cotizar por WhatsApp',
    'hero.catalogo':  'Ver catálogo',
    'hero.alt':       'Centro de TV Catania de acero negro y madera exhibido solo frente a un muro de yeso hueso con sombras de ventana',
    'hero.pausa':     'Pausar animación de fondo',
    'hero.reanudar':  'Reanudar animación de fondo',

    /* --- DECLARACION --- */
    'decl.aria':   'Declaración de marca',
    'decl.texto':  'Hecho a mano en Jalisco, pensado para durar <em>décadas</em>.',

    /* --- NOSOTROS --- */
    'nos.etiqueta':          'Quiénes somos',
    'nos.titulo':            'Fabricamos con propósito, <em>crecemos con identidad</em>',
    'nos.desc':              'Desde Ocotlán, Jalisco, transformamos acero en piezas que unen técnica artesanal con precisión industrial. Cada mueble nace aquí, pensado para durar décadas.',
    'nos.enfoque-etiqueta':  'Enfoque',
    'nos.enf1':              'Acero calibrado',
    'nos.enf2':              'Soldadura a mano',
    'nos.enf3':              'Fabricación a medida',
    'nos.enf4':              'Acabados al horno',
    'nos.enf5':              'Diseño propio',
    'nos.enf6':              'Entrega en todo Jalisco',
    'nos.mision-etiqueta':   'Misión',
    'nos.mision-texto':      'Nuestra misión es impulsar la activación económica de la empresa, nuestros colaboradores y socios comerciales, a través de la fabricación de muebles con calidad en procesos, productos y talento humano. Nos enfocamos en generar bienestar en nuestra comunidad, operando de manera responsable y sostenible con el medio ambiente.',
    'nos.vision-etiqueta':   'Visión',
    'nos.vision-texto':      'Ser una empresa líder en la fabricación del mueble, reconocida por nuestro diseño, innovación y compromiso para así expandir nuestra presencia en el mercado nacional e internacional, posicionándonos y consolidándonos como una marca confiable, reconocida y preferida por nuestros clientes.',
    'nos.valores-etiqueta':  'Valores',
    'nos.v1.nom':            'Compromiso',
    'nos.v2.nom':            'Trabajo en equipo',
    'nos.v3.nom':            'Autenticidad',
    'nos.v4.nom':            'Eficiencia',
    'nos.v5.nom':            'Innovación',
    'nos.afil-etiqueta':     'Afiliaciones',
    'nos.afil1-lbl':         'Socio activo',
    'nos.afil2-lbl':         'Afiliado',
    'nos.alt':               'Integrante del equipo MEDEISA, de espaldas y con la playera de la marca, acomoda decoración en un librero de acero negro y madera',
    'nos.afil1-desc':        'Asociación de Fabricantes de Muebles de Ocotlán',
    'nos.afil1-lema':        'La Capital del Mueble',
    'nos.afil1-aria':        'AFAMO, Asociación de Fabricantes de Muebles de Ocotlán (abre en nueva pestaña)',
    'nos.afil2-desc':        'Cámara de la Industria del Mueble de Jalisco',
    'nos.afil2-lema':        'Jalisco, México',
    'nos.afil2-aria':        'CIMEJAL, Cámara de la Industria del Mueble de Jalisco (abre en nueva pestaña)',

    /* --- CATALOGO --- */
    'cat.etiqueta':    'Lo que fabricamos',
    'cat.titulo':      'Nuestros <em>productos</em>',
    'cat.intro':       'Una selección de nuestra línea industrial: acero y madera trabajados en Jalisco. Cotiza cualquier pieza por WhatsApp.',
    'cat.cotizar':     'Cotizar por WhatsApp',
    'cat.ver-ambiente': 'Ver en ambiente',
    'cat.ver-estudio':  'Ver en estudio',
    'cat.centro-tv-catania.categoria': 'Centro de TV · Acero y madera',
    'cat.centro-tv-catania.alt':       'Centro de TV Catania: estructura trapezoidal de acero negro, repisa superior de madera y gabinete de madera miel con tres cajones sin jaladeras, sobre fondo hueso',
    'cat.centro-tv-catania.mensaje':   'Hola, me interesa cotizar el Centro de TV Catania de MEDEISA.',
    'cat.mesa-centro-catania.categoria': 'Mesa de centro · Acero y parota',
    'cat.mesa-centro-catania.alt':       'Mesa de Centro Catania: base rectangular de tubo de acero negro y cubierta de tablones de parota unidos por dos bandas de acero negro, sobre fondo hueso',
    'cat.mesa-centro-catania.mensaje':   'Hola, me interesa cotizar la Mesa de Centro Catania de MEDEISA.',
    'cat.silla-sahara.categoria': 'Sala · Tapizado bouclé y acero',
    'cat.silla-sahara.alt':       'Sillón Sahara: sillón individual tapizado en bouclé gris carbón con patas de acero negro en V invertida, sobre fondo hueso',
    'cat.silla-sahara.mensaje':   'Hola, me interesa cotizar el Sillón Sahara de MEDEISA.',
    'cat.centro-tv-sierra-azul.categoria': 'Centro de TV · Acero y parota',
    'cat.centro-tv-sierra-azul.alt':       'Centro de TV Sierra Azul: mueble ovalado de acero negro con barras verticales y repisa central de parota, sobre fondo hueso',
    'cat.centro-tv-sierra-azul.mensaje':   'Hola, me interesa cotizar el Centro de TV Sierra Azul de MEDEISA.',
    'cat.mesa-centro-sierra-azul.categoria': 'Mesa de centro · Parota maciza y acero',
    'cat.mesa-centro-sierra-azul.alt':       'Mesa de Centro Sierra Azul Parota: cubierta redonda de parota maciza con veta clara al centro sobre base circular de barras verticales de acero negro, sobre fondo hueso',
    'cat.mesa-centro-sierra-azul.mensaje':   'Hola, me interesa cotizar la Mesa de Centro Sierra Azul Parota de MEDEISA.',
    'cat.recamara-tulum.categoria': 'Recámara · Chapa de madera y acero',
    'cat.recamara-tulum.alt':       'Recámara Tulum: cama con cabecera de chapa de madera y marco de acero negro con dos óvalos, y un buró a juego, ambos sobre patines de acero negro, sobre fondo hueso',
    'cat.recamara-tulum.mensaje':   'Hola, me interesa cotizar la Recámara Tulum de MEDEISA.',

    /* --- EXPO --- */
    'expo.etiqueta':   'Presencia semestral',
    'expo.titulo':     'Expo Muebles Ocotlán',
    'expo.desc':       'Dos veces al año, en febrero y agosto, MEDEISA tiene presencia en Expo Muebles Ocotlán, la feria más importante de la región. Presentamos nuestro catálogo de muebles industriales fabricados a mano y conectamos con clientes de todo Jalisco.',
    'expo.edicion':    'Edición',
    'expo.alt':        'Stand de MEDEISA en Expo Muebles Ocotlán: letrero negro con el logo, celosía de listones claros y libreros, mesas y estanterías de acero negro y madera iluminados con luz cálida',
    'expo.dato1-lbl':  'Evento',
    'expo.dato1-val':  'Expo Muebles Ocotlán',
    'expo.dato2-lbl':  'Participación',
    'expo.dato2-val':  'Semestral · febrero y agosto',
    'expo.dato3-lbl':  'Sede',
    'expo.dato3-val':  'Ocotlán, Jalisco',

    /* --- CONTACTO --- */
    'cnt.etiqueta':  'Encuéntranos',
    'cnt.titulo':    'Contáctanos',
    'cnt.subtexto':  'Estamos listos para cotizar tu proyecto. Escríbenos o visítanos.',
    'cnt.lbl.tel':   'Teléfono',
    'cnt.lbl.hor':   'Horario',
    'cnt.lbl.dir':   'Dirección',
    'cnt.val.hor':   'Lunes a Viernes · 8:00 am – 4:00 pm',
    'cnt.btn-wa':    'Escribir por WhatsApp',
    'cnt.redes':     'Síguenos',
    'cnt.ig-aria':   'Instagram @medeisa.muebles (abre en nueva pestaña)',
    'cnt.fb-aria':   'Facebook Medeisa (abre en nueva pestaña)',
    'cnt.mapa-titulo': 'Ubicación de MEDEISA en Google Maps',
    'cnt.mapa-link': 'Ver en Google Maps',
    'cnt.mapa-aria': 'Ver en Google Maps: ubicación de MEDEISA (abre en nueva pestaña)',

    /* --- FOOTER --- */
    'pie.tagline':   'Transformamos acero en <em>estilo</em>',
    'pie.subtitulo': 'Metales de Innovación',
    'pie.nav-aria':  'Navegación del pie de página',
    'pie.redes-aria': 'Redes sociales',
    'pie.nueva-pestana': ' (abre en nueva pestaña)',
    'pie.nosotros':  'Nosotros',
    'pie.productos': 'Productos',
    'pie.galeria':   'Expo',
    'pie.contacto':  'Contacto',
    'pie.derechos':  'Todos los derechos reservados.',
    'pie.ciudad':    'Ocotlán, Jalisco, México',

    /* --- WHATSAPP FLOTANTE --- */
  },

  en: {
    /* --- GLOBAL --- */
    'meta.title':  'MEDEISA — Industrial Furniture in Ocotlán, Jalisco',
    'meta.desc':   'MEDEISA — Industrial furniture maker in Ocotlán, Jalisco. We transform steel into style. Get a quote for custom metal furniture.',
    'global.skip': 'Skip to main content',
    'wa.general':  'Hello, I would like a quote for a MEDEISA product.',
    'wa.aria':     'Contact us on WhatsApp (opens in a new tab)',

    /* --- NAV --- */
    'nav.aria':         'Main navigation',
    'nav.logo-aria':    'MEDEISA, back to top',
    'nav.nosotros':     'About',
    'nav.productos':    'Products',
    'nav.galeria':      'Expo',
    'nav.contacto':     'Contact',
    'nav.idioma-aria':  'Language',
    'nav.cta':          'Quote on WhatsApp',
    'nav.menu-abrir':   'Open navigation menu',
    'nav.menu-cerrar':  'Close navigation menu',

    /* --- HERO --- */
    'hero.etiqueta':  'Industrial furniture · Ocotlán, Jalisco',
    'hero.titulo':    'We transform steel into <em>style</em>',
    'hero.cta':       'Quote on WhatsApp',
    'hero.catalogo':  'View catalog',
    'hero.alt':       'Catania TV stand in black steel and wood, displayed alone against an off-white plaster wall with window shadows',
    'hero.pausa':     'Pause background animation',
    'hero.reanudar':  'Play background animation',

    /* --- DECLARACION --- */
    'decl.aria':   'Brand statement',
    'decl.texto':  'Handmade in Jalisco, built to last <em>decades</em>.',

    /* --- NOSOTROS --- */
    'nos.etiqueta':          'Who we are',
    'nos.titulo':            'We build with purpose, <em>we grow with identity</em>',
    'nos.desc':              'From Ocotlán, Jalisco, we transform steel into pieces that unite artisan technique with industrial precision. Each piece is born here, built to last decades.',
    'nos.enfoque-etiqueta':  'Focus',
    'nos.enf1':              'Calibrated steel',
    'nos.enf2':              'Hand welding',
    'nos.enf3':              'Made to measure',
    'nos.enf4':              'Oven-cured finishes',
    'nos.enf5':              'In-house design',
    'nos.enf6':              'Delivery across Jalisco',
    'nos.mision-etiqueta':   'Mission',
    'nos.mision-texto':      'Our mission is to drive the economic activation of the company, our collaborators and commercial partners, through the manufacturing of furniture with quality in processes, products and human talent. We focus on generating wellbeing in our community, operating responsibly and sustainably with the environment.',
    'nos.vision-etiqueta':   'Vision',
    'nos.vision-texto':      'To be a leading company in furniture manufacturing, recognized for our design, innovation and commitment, expanding our presence in national and international markets, positioning and consolidating ourselves as a reliable, recognized and preferred brand among our clients.',
    'nos.valores-etiqueta':  'Values',
    'nos.v1.nom':            'Commitment',
    'nos.v2.nom':            'Teamwork',
    'nos.v3.nom':            'Authenticity',
    'nos.v4.nom':            'Efficiency',
    'nos.v5.nom':            'Innovation',
    'nos.afil-etiqueta':     'Affiliations',
    'nos.afil1-lbl':         'Active member',
    'nos.afil2-lbl':         'Affiliate',
    'nos.alt':               'MEDEISA team member, seen from behind in a branded T-shirt, styling decor on a black steel and wood bookshelf',
    'nos.afil1-desc':        'Association of Furniture Manufacturers of Ocotlán',
    'nos.afil1-lema':        'The Furniture Capital',
    'nos.afil1-aria':        'AFAMO, Association of Furniture Manufacturers of Ocotlán (opens in a new tab)',
    'nos.afil2-desc':        'Jalisco Furniture Industry Chamber',
    'nos.afil2-lema':        'Jalisco, Mexico',
    'nos.afil2-aria':        'CIMEJAL, Jalisco Furniture Industry Chamber (opens in a new tab)',

    /* --- CATALOGO --- */
    'cat.etiqueta':    'What we make',
    'cat.titulo':      'Our <em>products</em>',
    'cat.intro':       'A selection from our industrial line: steel and wood crafted in Jalisco. Request a quote for any piece on WhatsApp.',
    'cat.cotizar':     'Quote on WhatsApp',
    'cat.ver-ambiente': 'View in room',
    'cat.ver-estudio':  'View in studio',
    'cat.centro-tv-catania.categoria': 'TV console · Steel and wood',
    'cat.centro-tv-catania.alt':       'Centro de TV Catania: trapezoidal black steel frame, wooden top shelf and honey-toned wood cabinet with three handleless drawers, on a bone background',
    'cat.centro-tv-catania.mensaje':   'Hi, I would like a quote for the Centro de TV Catania by MEDEISA.',
    'cat.mesa-centro-catania.categoria': 'Coffee table · Steel and parota',
    'cat.mesa-centro-catania.alt':       'Mesa de Centro Catania: rectangular black steel tube base and a top of parota planks joined by two black steel bands, on a bone background',
    'cat.mesa-centro-catania.mensaje':   'Hi, I would like a quote for the Mesa de Centro Catania by MEDEISA.',
    'cat.silla-sahara.categoria': 'Living · Bouclé and steel',
    'cat.silla-sahara.alt':       'Sillón Sahara: armchair upholstered in charcoal bouclé with black steel legs in an inverted V, on a bone background',
    'cat.silla-sahara.mensaje':   'Hi, I would like a quote for the Sillón Sahara by MEDEISA.',
    'cat.centro-tv-sierra-azul.categoria': 'TV console · Steel and parota',
    'cat.centro-tv-sierra-azul.alt':       'Centro de TV Sierra Azul: oval black steel console with vertical bars and a central parota shelf, on a bone background',
    'cat.centro-tv-sierra-azul.mensaje':   'Hi, I would like a quote for the Centro de TV Sierra Azul by MEDEISA.',
    'cat.mesa-centro-sierra-azul.categoria': 'Coffee table · Solid parota and steel',
    'cat.mesa-centro-sierra-azul.alt':       'Mesa de Centro Sierra Azul Parota: round solid parota top with a light streak through the center on a circular base of vertical black steel bars, on a bone background',
    'cat.mesa-centro-sierra-azul.mensaje':   'Hi, I would like a quote for the Mesa de Centro Sierra Azul Parota by MEDEISA.',
    'cat.recamara-tulum.categoria': 'Bedroom · Wood veneer and steel',
    'cat.recamara-tulum.alt':       'Recámara Tulum: bed with a wood veneer headboard framed in black steel with two oval outlines, and a matching nightstand, both on black steel sled legs, on a bone background',
    'cat.recamara-tulum.mensaje':   'Hi, I would like a quote for the Recámara Tulum by MEDEISA.',

    /* --- EXPO --- */
    'expo.etiqueta':   'Biannual presence',
    'expo.titulo':     'Expo Muebles Ocotlán',
    'expo.desc':       'Twice a year, in February and August, MEDEISA participates in Expo Muebles Ocotlán, the most important trade fair in the region. We showcase our catalog of handcrafted industrial furniture and connect with clients from all over Jalisco.',
    'expo.edicion':    'Edition',
    'expo.alt':        'MEDEISA booth at Expo Muebles Ocotlán: black sign with the logo, light slatted screen, and black steel and wood bookshelves, tables and shelving lit with warm light',
    'expo.dato1-lbl':  'Event',
    'expo.dato1-val':  'Expo Muebles Ocotlán',
    'expo.dato2-lbl':  'Participation',
    'expo.dato2-val':  'Biannual · February and August',
    'expo.dato3-lbl':  'Venue',
    'expo.dato3-val':  'Ocotlán, Jalisco',

    /* --- CONTACTO --- */
    'cnt.etiqueta':  'Find us',
    'cnt.titulo':    'Contact us',
    'cnt.subtexto':  'We are ready to quote your project. Write to us or visit us.',
    'cnt.lbl.tel':   'Phone',
    'cnt.lbl.hor':   'Hours',
    'cnt.lbl.dir':   'Address',
    'cnt.val.hor':   'Monday to Friday · 8:00 am – 4:00 pm',
    'cnt.btn-wa':    'Message on WhatsApp',
    'cnt.redes':     'Follow us',
    'cnt.ig-aria':   'Instagram @medeisa.muebles (opens in a new tab)',
    'cnt.fb-aria':   'Facebook Medeisa (opens in a new tab)',
    'cnt.mapa-titulo': 'MEDEISA location on Google Maps',
    'cnt.mapa-link': 'View on Google Maps',
    'cnt.mapa-aria': 'View on Google Maps: MEDEISA location (opens in a new tab)',

    /* --- FOOTER --- */
    'pie.tagline':   'We transform steel into <em>style</em>',
    'pie.subtitulo': 'Metales de Innovación',
    'pie.nav-aria':  'Footer navigation',
    'pie.redes-aria': 'Social media',
    'pie.nueva-pestana': ' (opens in a new tab)',
    'pie.nosotros':  'About',
    'pie.productos': 'Products',
    'pie.galeria':   'Expo',
    'pie.contacto':  'Contact',
    'pie.derechos':  'All rights reserved.',
    'pie.ciudad':    'Ocotlán, Jalisco, Mexico',

    /* --- WHATSAPP FLOTANTE --- */
  },
};

/* ---- Enlace de WhatsApp con mensaje prellenado (función pura) ---- */
const crearEnlaceWhatsapp = (mensaje = '') =>
  `https://wa.me/${WHATSAPP_NUMERO}${mensaje ? `?text=${encodeURIComponent(mensaje)}` : ''}`;

/* ---- Preferencia guardada: localStorage puede lanzar (Safari privado) ---- */
const leerIdiomaGuardado = () => {
  try {
    return localStorage.getItem(CLAVE_IDIOMA);
  } catch {
    return null;
  }
};

const guardarIdioma = (lang) => {
  try {
    localStorage.setItem(CLAVE_IDIOMA, lang);
  } catch {
    /* Sin almacenamiento: el idioma solo dura la visita */
  }
};

/* Atributos traducibles → cómo se aplican */
const ATRIBUTOS_I18N = [
  ['i18n',       (el, v) => { el.textContent = v; }],
  ['i18nHtml',   (el, v) => { el.innerHTML = v; }],
  ['i18nAlt',    (el, v) => el.setAttribute('alt', v)],
  ['i18nAria',   (el, v) => el.setAttribute('aria-label', v)],
  ['i18nTitle',  (el, v) => el.setAttribute('title', v)],
];

const SELECTOR_I18N =
  '[data-i18n],[data-i18n-html],[data-i18n-alt],[data-i18n-aria],[data-i18n-title],[data-wa],[data-wa-pieza]';

/* Aplica un idioma en una sola pasada sobre el DOM */
const aplicarIdioma = (lang) => {
  const t = TRADUCCIONES[lang];
  if (!t) return;

  document.querySelectorAll(SELECTOR_I18N).forEach((el) => {
    const { dataset } = el;

    ATRIBUTOS_I18N.forEach(([attr, aplicar]) => {
      const valor = dataset[attr] && t[dataset[attr]];
      if (valor !== undefined && valor !== '') aplicar(el, valor);
    });

    if (dataset.wa) {
      el.href = crearEnlaceWhatsapp(t[`wa.${dataset.wa}`]);
    }

    if (dataset.waPieza) {
      const base = dataset.waPieza.replace(/\.nombre$/, '');
      el.href = crearEnlaceWhatsapp(t[`${base}.mensaje`]);
    }
  });

  /* Atributo lang, título y descripción para accesibilidad y SEO */
  document.documentElement.lang = lang;
  if (t['meta.title']) document.title = t['meta.title'];
  document.querySelector('meta[name="description"]')?.setAttribute('content', t['meta.desc'] ?? '');
};

const iniciarIdioma = () => {
  const selector = document.querySelector('.idioma');
  const botones = selector?.querySelectorAll('.idioma__boton[lang]') ?? [];
  if (!botones.length) return;

  /* Estado visual y accesible: el nombre accesible es el texto visible (ES/EN) */
  const marcarBotones = (lang) => {
    botones.forEach((btn) => {
      const activo = btn.lang === lang;
      btn.classList.toggle('activo', activo);
      btn.setAttribute('aria-pressed', String(activo));
    });
  };

  const cambiarIdioma = (lang) => {
    aplicarIdioma(lang);
    marcarBotones(lang);
  };

  /* Delegación: un solo listener para el selector */
  selector.addEventListener('click', (e) => {
    const btn = e.target.closest('.idioma__boton[lang]');
    if (!btn || btn.classList.contains('activo')) return;
    cambiarIdioma(btn.lang);
    guardarIdioma(btn.lang);
  });

  /* Idioma inicial: guardado > navegador > español (el HTML ya viene en ES) */
  const preferido = navigator.language?.startsWith('en') ? 'en' : 'es';
  const idiomaInicial = leerIdiomaGuardado() ?? preferido;

  if (idiomaInicial !== 'es' && TRADUCCIONES[idiomaInicial]) {
    cambiarIdioma(idiomaInicial);
  }
};


/* ================================================================
   CATÁLOGO - Alternar estudio / ambiente
   Un solo listener delegado en el grid. El botón alterna siempre; tocar
   la foto solo alterna en táctil (con ratón ya lo hace el hover).
================================================================ */
const iniciarCatalogo = () => {
  const grid = document.querySelector('.catalogo__grid');
  if (!grid) return;

  const punteroFino = window.matchMedia('(hover: hover) and (pointer: fine)');

  const alternarPieza = (pieza, forzar) => {
    const ambiente = pieza.classList.toggle('pieza--ambiente', forzar);
    const alternar = pieza.querySelector('.pieza__alternar');
    if (!alternar) return;

    /* El texto del botón cambia con el estado; aplicarIdioma lo mantiene
       al cambiar de idioma porque se actualiza su data-i18n */
    const clave = ambiente ? 'cat.ver-estudio' : 'cat.ver-ambiente';
    alternar.dataset.i18n = clave;
    alternar.textContent = TRADUCCIONES[document.documentElement.lang]?.[clave] ?? alternar.textContent;
  };

  grid.addEventListener('click', (e) => {
    const boton = e.target.closest('.pieza__alternar');
    const marco = e.target.closest('.pieza__marco');
    if (!boton && (!marco || punteroFino.matches)) return;
    alternarPieza(marco.closest('.pieza'));
  });

  /* Con puntero fino el botón solo se ve con foco: si el foco sale de la
     pieza se vuelve a estudio, para que el ambiente no quede fijo sin
     control visible (el clic en la foto no alterna con ratón) */
  grid.addEventListener('focusout', (e) => {
    if (!punteroFino.matches) return;
    const pieza = e.target.closest('.pieza');
    if (!pieza?.classList.contains('pieza--ambiente') || pieza.contains(e.relatedTarget)) return;
    alternarPieza(pieza, false);
  });
};


/* ================================================================
   FOOTER - Año dinámico en los créditos
================================================================ */
const iniciarFooter = () => {
  const span = document.getElementById('anio-actual');
  if (span) span.textContent = new Date().getFullYear();
};


/* ================================================================
   INIT - Punto de entrada
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  iniciarNav();
  iniciarIdioma();
  iniciarHero();
  iniciarVideoHero();
  iniciarAnimacionesEntrada();
  iniciarCatalogo();
  iniciarFooter();
});
