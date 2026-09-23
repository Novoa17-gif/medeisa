/* ================================================================
   MEDEISA - JavaScript principal
   Orden: Nav → Hero → Animaciones → Idioma (i18n + WhatsApp) →
          Nav pill → Footer → Init
================================================================ */

'use strict';

/* Marca que JS está activo: el CSS usa .js .animar-entrada para el
   estado oculto inicial, así si el JS falla el contenido no queda invisible */
document.documentElement.classList.add('js');


/* ================================================================
   NAV
================================================================ */
const iniciarNav = () => {
  const encabezado   = document.getElementById('encabezado');
  const hamburguesa  = document.querySelector('.nav__hamburguesa');
  const menuMovil    = document.getElementById('nav-menu-movil');
  const linksNav     = document.querySelectorAll('.nav__link');

  if (!encabezado) return;

  /* — Fondo sólido al hacer scroll — */
  const manejarScroll = () => {
    encabezado.classList.toggle('scrolled', window.scrollY > 40);
  };

  window.addEventListener('scroll', manejarScroll, { passive: true });
  manejarScroll(); // estado inicial

  /* — Menú móvil hamburguesa — */
  hamburguesa?.addEventListener('click', () => {
    const abierto = hamburguesa.getAttribute('aria-expanded') === 'true';
    hamburguesa.setAttribute('aria-expanded', String(!abierto));
    menuMovil.setAttribute('aria-hidden', String(abierto));
    menuMovil.classList.toggle('abierto', !abierto);
  });

  /* — Cerrar menú móvil al hacer clic en cualquier link — */
  linksNav.forEach((link) => {
    link.addEventListener('click', () => {
      hamburguesa?.setAttribute('aria-expanded', 'false');
      menuMovil?.setAttribute('aria-hidden', 'true');
      menuMovil?.classList.remove('abierto');
    });
  });

  /* — Cerrar menú móvil con tecla Escape (accesibilidad) — */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && hamburguesa?.getAttribute('aria-expanded') === 'true') {
      hamburguesa.setAttribute('aria-expanded', 'false');
      menuMovil?.setAttribute('aria-hidden', 'true');
      menuMovil?.classList.remove('abierto');
      hamburguesa.focus();
    }
  });

  /* — Link activo según sección visible (Intersection Observer) —
     Solo se observan las secciones con id, no los h2 con id que viven
     dentro de ellas (antes apagaban el enlace activo). */
  const secciones = document.querySelectorAll('main > section[id]');

  const observadorNav = new IntersectionObserver(
    (entradas) => {
      entradas.forEach((entrada) => {
        if (entrada.isIntersecting) {
          linksNav.forEach((link) => {
            const activo = link.getAttribute('href') === `#${entrada.target.id}`;
            link.classList.toggle('activo', activo);
          });
        }
      });
    },
    { rootMargin: '-40% 0px -55% 0px' }
  );

  secciones.forEach((s) => observadorNav.observe(s));
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

    /* --- NAV --- */
    'nav.nosotros':   'Nosotros',
    'nav.productos':  'Productos',
    'nav.galeria':    'Expo',
    'nav.contacto':   'Contacto',

    /* --- HERO --- */
    'hero.eyebrow':   'Ocotlán, Jalisco',
    'hero.titulo-l1': 'Acero',
    'hero.titulo-l2': 'en estilo',
    'hero.subtitulo': 'Mueblería industrial a medida',
    'hero.btn-prim':  'Ver productos',
    'hero.cta-ghost': 'Cotizar ahora  →',
    'hero.deco':      'Diseño industrial / hecho a mano',

    /* --- DECLARACION --- */

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

    /* --- CATALOGO --- */
    'prod.etiqueta': 'Lo que fabricamos',
    'prod.titulo':   'Nuestros productos',
    'prod.libreros': 'Libreros / Estantes industriales',
    'prod.mesas':    'Mesas de centro y auxiliares',
    'prod.escrts':   'Centros de TV',
    'prod.sillas':   'Sillas y sillones',
    'prod.cotizar':  'Cotizar',
    'wa.libreros':   'Hola, me gustaría cotizar un librero o estante industrial.',
    'wa.mesas':      'Hola, me gustaría cotizar una mesa de centro o auxiliar.',
    'wa.tv':         'Hola, me gustaría cotizar un centro de TV.',
    'wa.sillas':     'Hola, me gustaría cotizar sillas o sillones.',

    /* --- EXPO --- */
    'gal.etiqueta':  'Presencia semestral',
    'gal.titulo':    'Expo Muebles Ocotlán',
    'expo.desc':     'Dos veces al año, en febrero y agosto, MEDEISA tiene presencia en Expo Muebles Ocotlán, la feria más importante de la región. Presentamos nuestro catálogo de muebles industriales fabricados a mano y conectamos con clientes de todo Jalisco.',
    'expo.badge':    'Edición',

    /* --- CONTACTO --- */
    'cnt.etiqueta':  'Encuéntranos',
    'cnt.titulo':    'Contáctanos',
    'cnt.subtexto':  'Estamos listos para cotizar tu proyecto. Escríbenos o visítanos.',
    'cnt.lbl.tel':   'Teléfono',
    'cnt.lbl.hor':   'Horario',
    'cnt.lbl.dir':   'Dirección',
    'cnt.val.hor':   'Lunes a Viernes · 8:00 am – 4:00 pm',
    'cnt.btn-wa':    'Escribir por WhatsApp',
    'cnt.mapa-link': 'Ver en Maps →',
    'cnt.redes':     'Síguenos',

    /* --- FOOTER --- */
    'pie.tagline':   'Transformamos acero en estilo',
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

    /* --- NAV --- */
    'nav.nosotros':   'About',
    'nav.productos':  'Products',
    'nav.galeria':    'Expo',
    'nav.contacto':   'Contact',

    /* --- HERO --- */
    'hero.eyebrow':   'Ocotlán, Jalisco',
    'hero.titulo-l1': 'Steel',
    'hero.titulo-l2': 'in style',
    'hero.subtitulo': 'Custom industrial furniture',
    'hero.btn-prim':  'View products',
    'hero.cta-ghost': 'Get a quote  →',
    'hero.deco':      'Industrial design / handmade',

    /* --- DECLARACION --- */

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

    /* --- CATALOGO --- */
    'prod.etiqueta': 'What we make',
    'prod.titulo':   'Our products',
    'prod.libreros': 'Industrial Bookshelves & Shelves',
    'prod.mesas':    'Coffee & Side Tables',
    'prod.escrts':   'TV Stands',
    'prod.sillas':   'Chairs & Armchairs',
    'prod.cotizar':  'Quote',
    'wa.libreros':   'Hello, I would like a quote for an industrial bookshelf or shelf.',
    'wa.mesas':      'Hello, I would like a quote for a coffee or side table.',
    'wa.tv':         'Hello, I would like a quote for a TV stand.',
    'wa.sillas':     'Hello, I would like a quote for chairs or armchairs.',

    /* --- EXPO --- */
    'gal.etiqueta':  'Biannual presence',
    'gal.titulo':    'Expo Muebles Ocotlán',
    'expo.desc':     'Twice a year, in February and August, MEDEISA participates in Expo Muebles Ocotlán, the most important trade fair in the region. We showcase our catalog of handcrafted industrial furniture and connect with clients from all over Jalisco.',
    'expo.badge':    'Edition',

    /* --- CONTACTO --- */
    'cnt.etiqueta':  'Find us',
    'cnt.titulo':    'Contact us',
    'cnt.subtexto':  'We are ready to quote your project. Write to us or visit us.',
    'cnt.lbl.tel':   'Phone',
    'cnt.lbl.hor':   'Hours',
    'cnt.lbl.dir':   'Address',
    'cnt.val.hor':   'Monday to Friday · 8:00 am – 4:00 pm',
    'cnt.btn-wa':    'Message on WhatsApp',
    'cnt.mapa-link': 'View on Maps →',
    'cnt.redes':     'Follow us',

    /* --- FOOTER --- */
    'pie.tagline':   'We transform steel into style',
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

const iniciarIdioma = (recalcularCursor) => {
  const botones = document.querySelectorAll('.hero__idioma-btn[data-lang]');
  if (!botones.length) return;

  /* Estado visual y accesible de los botones del selector */
  const marcarBotones = (lang) => {
    botones.forEach((btn) => {
      const activo = btn.dataset.lang === lang;
      btn.classList.toggle('activo', activo);
      btn.setAttribute('aria-pressed', String(activo));
    });
    document.querySelector('.hero__idioma-btn[data-lang="es"]')
      ?.setAttribute('aria-label', lang === 'es' ? 'Español (idioma actual)' : 'Español');
    document.querySelector('.hero__idioma-btn[data-lang="en"]')
      ?.setAttribute('aria-label', lang === 'en' ? 'English (current language)' : 'English');
  };

  const cambiarIdioma = (lang) => {
    aplicarIdioma(lang);
    marcarBotones(lang);

    /* Recalcular el cursor del nav pill una vez repintados los textos */
    if (typeof recalcularCursor === 'function') {
      requestAnimationFrame(recalcularCursor);
    }
  };

  /* Delegación: un solo listener para el selector */
  document.querySelector('.nav__idioma')?.addEventListener('click', (e) => {
    const btn = e.target.closest('.hero__idioma-btn[data-lang]');
    if (!btn || btn.classList.contains('activo')) return;
    cambiarIdioma(btn.dataset.lang);
    guardarIdioma(btn.dataset.lang);
  });

  /* Idioma inicial: guardado > navegador > español (el HTML ya viene en ES) */
  const preferido = navigator.language?.startsWith('en') ? 'en' : 'es';
  const idiomaInicial = leerIdiomaGuardado() ?? preferido;

  if (idiomaInicial !== 'es' && TRADUCCIONES[idiomaInicial]) {
    cambiarIdioma(idiomaInicial);
  }
};


/* ================================================================
   NAV PILL - Cursor deslizante (se elimina en el paso 1)
================================================================ */
const iniciarNavPill = () => {
  const pill    = document.querySelector('.nav__pill');
  const cursor  = document.querySelector('.nav__cursor');
  const links   = document.querySelectorAll('.nav__pill .nav__link');

  if (!pill || !cursor || !links.length) return;

  let linkActivo = links[0];

  /* Mueve y redimensiona el cursor sobre el elemento dado */
  const moverCursor = (el) => {
    const pillRect = pill.getBoundingClientRect();
    const elRect   = el.getBoundingClientRect();
    const x = elRect.left - pillRect.left;
    cursor.style.transform = `translateX(${x}px)`;
    cursor.style.width = `${elRect.width}px`;
  };

  /* Recalcula el cursor sobre el link activo actual (tras cambio de idioma) */
  const recalcularCursor = () => moverCursor(linkActivo);

  requestAnimationFrame(recalcularCursor);

  links.forEach((link) => {
    link.addEventListener('mouseenter', () => moverCursor(link));
    link.addEventListener('mouseleave', () => moverCursor(linkActivo));
    link.addEventListener('focus',  () => moverCursor(link));
    link.addEventListener('blur',   () => moverCursor(linkActivo));
    link.addEventListener('click', () => {
      linkActivo = link;
      moverCursor(link);
    });
  });

  /* Sincronizar con la clase .activo que gestiona el Intersection Observer del nav */
  const observerClase = new MutationObserver(() => {
    const activoActual = document.querySelector('.nav__pill .nav__link.activo');
    if (activoActual && activoActual !== linkActivo) {
      linkActivo = activoActual;
      moverCursor(activoActual);
    }
  });

  links.forEach((link) => {
    observerClase.observe(link, { attributes: true, attributeFilter: ['class'] });
  });

  window.addEventListener('resize', recalcularCursor, { passive: true });

  return recalcularCursor;
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
  const recalcularCursor = iniciarNavPill();
  iniciarIdioma(recalcularCursor);
  iniciarHero();
  iniciarAnimacionesEntrada();
  iniciarFooter();
});
