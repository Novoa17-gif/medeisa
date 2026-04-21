/* ================================================================
   MEDEISA — JavaScript principal
   Orden: Configuración → Nav → Hero → Animaciones → WhatsApp
================================================================ */

'use strict';


/* ================================================================
   CONFIGURACIÓN GLOBAL
================================================================ */
const CONFIG = {
  whatsapp: '523921236728',
  mensajeWhatsapp: 'Hola, me gustaría cotizar un producto de MEDEISA.',
};


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

  /* — Link activo según sección visible (Intersection Observer) — */
  const secciones = document.querySelectorAll('main [id]');

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
   HERO — Animación de entrada inmediata al cargar
================================================================ */
const iniciarHero = () => {
  /* Los elementos .animar-entrada del hero se revelan en secuencia
     con el delay definido en CSS (transition-delay). Solo hay que
     agregarles .visible en el siguiente frame para disparar la transición. */
  const elementosHero = document.querySelectorAll('.hero .animar-entrada');

  requestAnimationFrame(() => {
    elementosHero.forEach((el) => el.classList.add('visible'));
  });
};


/* ================================================================
   ANIMACIONES DE ENTRADA (Intersection Observer)
   Activa la clase .visible en elementos con .animar-entrada
   cuando entran al viewport.
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
    {
      threshold: 0.12,
      /* Dispara cuando el elemento lleva al menos 60px dentro del viewport,
         no en el instante en que asoma. Produce revelaciones más intencionales. */
      rootMargin: '0px 0px -60px 0px',
    }
  );

  elementos.forEach((el) => observador.observe(el));
};


/* ================================================================
   IDIOMA — Selector ES / EN
   Motor de traducción sin dependencias externas.
   Estrategia: mapa de selectores CSS → claves de traducción.
   innerHTML para elementos con HTML interno (etiquetas con span de línea,
   títulos con <em>), textContent para textos planos.
================================================================ */

/* ---- Diccionario de traducciones ---- */
const TRADUCCIONES = {
  es: {
    /* Nav */
    'nav.nosotros':   'Nosotros',
    'nav.productos':  'Productos',
    'nav.galeria':    'Galería',
    'nav.contacto':   'Contacto',
    'nav.cotizar':    'Cotizar por WhatsApp',
    /* Hero */
    'hero.eyebrow':   'Ocotlán, Jalisco — Desde 2018',
    'hero.titulo-l1': 'Acero',
    'hero.titulo-l2': 'en estilo',
    'hero.subtitulo': 'Mueblería industrial a medida',
    'hero.btn-prim':  'Ver productos',
    'hero.cta-ghost': 'Cotizar ahora \u00a0→',
    'hero.deco':      'Diseño industrial / hecho a mano',
    /* Nosotros */
    'nos.etiqueta':          '<span class="nosotros__etiqueta-linea" aria-hidden="true"></span>Quiénes somos',
    'nos.titulo':            'Fabricamos con propósito,\n            <em>crecemos con identidad</em>',
    'nos.desc':              'Desde Ocotlán, Jalisco, transformamos acero en piezas que unen técnica artesanal con precisión industrial. Cada mueble nace aquí, pensado para durar décadas.',
    'nos.enfoque-etiqueta':  '<span class="nosotros__sub-etiqueta-linea" aria-hidden="true"></span>Enfoque',
    'nos.enf1':              'Calidad',
    'nos.enf2':              'Diseño',
    'nos.enf3':              'Clientes',
    'nos.enf4':              'Crecimiento',
    'nos.enf5':              'Identidad',
    'nos.enf6':              'Marca',
    'nos.mision-etiqueta':   '<span class="nosotros__sub-etiqueta-linea" aria-hidden="true"></span>Misión',
    'nos.mision-texto':      'Nuestra misión es impulsar la activación económica de la empresa, nuestros colaboradores y socios comerciales, a través de la fabricación de muebles con calidad en procesos, productos y talento humano. Nos enfocamos en generar bienestar en nuestra comunidad, operando de manera responsable y sostenible con el medio ambiente.',
    'nos.vision-etiqueta':   '<span class="nosotros__sub-etiqueta-linea" aria-hidden="true"></span>Visión',
    'nos.vision-texto':      'Ser una empresa líder en la fabricación del mueble, reconocida por nuestro diseño, innovación y compromiso para así expandir nuestra presencia en el mercado nacional e internacional, posicionándonos y consolidándonos como una marca confiable, reconocida y preferida por nuestros clientes.',
    'nos.valores-etiqueta':  '<span class="nosotros__sub-etiqueta-linea" aria-hidden="true"></span>Valores',
    'nos.v1.nom':            'Compromiso',
    'nos.v2.nom':            'Trabajo en equipo',
    'nos.v3.nom':            'Autenticidad',
    'nos.v4.nom':            'Eficiencia',
    'nos.v5.nom':            'Innovación',
    'nos.afil-etiqueta':     '<span class="nosotros__sub-etiqueta-linea" aria-hidden="true"></span>Afiliaciones',
    'nos.afil1-lbl':         'Socio activo',
    'nos.afil2-lbl':         'Afiliado',
    /* Productos */
    'prod.etiqueta': '<span class="productos__etiqueta-linea" aria-hidden="true"></span>Lo que fabricamos',
    'prod.titulo':   'Nuestros productos',
    'prod.libreros': 'Libreros / Estantes industriales',
    'prod.mesas':    'Mesas de centro y auxiliares',
    'prod.escrts':   'Escritorios',
    'prod.sillas':   'Sillas y sillones',
    'prod.cotizar':  'Cotizar',
    /* Galería / Expo */
    'gal.etiqueta':  '<span class="galeria__etiqueta-linea" aria-hidden="true"></span>Presencia anual',
    'gal.titulo':    'Expo Muebles Ocotlán',
    'expo.desc':     'Cada año MEDEISA tiene presencia en Expo Muebles Ocotlán, la feria más importante de la región. Presentamos nuestro catálogo de muebles industriales fabricados a mano y conectamos con clientes de todo Jalisco.',
    /* Contacto */
    'cnt.etiqueta':  '<span class="contacto__etiqueta-linea" aria-hidden="true"></span>Encuéntranos',
    'cnt.titulo':    'Contáctanos',
    'cnt.subtexto':  'Estamos listos para cotizar tu proyecto. Escríbenos o visítanos.',
    'cnt.lbl.tel':   'Teléfono',
    'cnt.lbl.hor':   'Horario',
    'cnt.lbl.dir':   'Dirección',
    'cnt.val.hor':   'Lunes a Viernes · 8:00 am – 4:00 pm',
    'cnt.btn-wa':    'Escribir por WhatsApp',
    'cnt.redes':     'Síguenos',
    /* Footer */
    'pie.tagline':   'Transformamos acero en estilo',
    'pie.nosotros':  'Nosotros',
    'pie.productos': 'Productos',
    'pie.galeria':   'Galería',
    'pie.contacto':  'Contacto',
    'pie.derechos':  'Todos los derechos reservados.',
    'pie.ciudad':    'Ocotlán, Jalisco, México',
  },

  en: {
    /* Nav */
    'nav.nosotros':   'About',
    'nav.productos':  'Products',
    'nav.galeria':    'Gallery',
    'nav.contacto':   'Contact',
    'nav.cotizar':    'Quote via WhatsApp',
    /* Hero */
    'hero.eyebrow':   'Ocotlán, Jalisco — Since 2018',
    'hero.titulo-l1': 'Steel',
    'hero.titulo-l2': 'in style',
    'hero.subtitulo': 'Custom industrial furniture',
    'hero.btn-prim':  'View products',
    'hero.cta-ghost': 'Get a quote \u00a0→',
    'hero.deco':      'Industrial design / handmade',
    /* Nosotros */
    'nos.etiqueta':          '<span class="nosotros__etiqueta-linea" aria-hidden="true"></span>Who we are',
    'nos.titulo':            'We build with purpose,\n            <em>we grow with identity</em>',
    'nos.desc':              'From Ocotlán, Jalisco, we transform steel into pieces that unite artisan technique with industrial precision. Each piece is born here, built to last decades.',
    'nos.enfoque-etiqueta':  '<span class="nosotros__sub-etiqueta-linea" aria-hidden="true"></span>Focus',
    'nos.enf1':              'Quality',
    'nos.enf2':              'Design',
    'nos.enf3':              'Clients',
    'nos.enf4':              'Growth',
    'nos.enf5':              'Identity',
    'nos.enf6':              'Brand',
    'nos.mision-etiqueta':   '<span class="nosotros__sub-etiqueta-linea" aria-hidden="true"></span>Mission',
    'nos.mision-texto':      'Our mission is to drive the economic activation of the company, our collaborators and commercial partners, through the manufacturing of furniture with quality in processes, products and human talent. We focus on generating wellbeing in our community, operating responsibly and sustainably with the environment.',
    'nos.vision-etiqueta':   '<span class="nosotros__sub-etiqueta-linea" aria-hidden="true"></span>Vision',
    'nos.vision-texto':      'To be a leading company in furniture manufacturing, recognized for our design, innovation and commitment, expanding our presence in national and international markets, positioning and consolidating ourselves as a reliable, recognized and preferred brand among our clients.',
    'nos.valores-etiqueta':  '<span class="nosotros__sub-etiqueta-linea" aria-hidden="true"></span>Values',
    'nos.v1.nom':            'Commitment',
    'nos.v2.nom':            'Teamwork',
    'nos.v3.nom':            'Authenticity',
    'nos.v4.nom':            'Efficiency',
    'nos.v5.nom':            'Innovation',
    'nos.afil-etiqueta':     '<span class="nosotros__sub-etiqueta-linea" aria-hidden="true"></span>Affiliations',
    'nos.afil1-lbl':         'Active member',
    'nos.afil2-lbl':         'Affiliate',
    /* Productos */
    'prod.etiqueta': '<span class="productos__etiqueta-linea" aria-hidden="true"></span>What we make',
    'prod.titulo':   'Our products',
    'prod.libreros': 'Industrial Bookshelves & Shelves',
    'prod.mesas':    'Coffee & Side Tables',
    'prod.escrts':   'Desks',
    'prod.sillas':   'Chairs & Armchairs',
    'prod.cotizar':  'Quote',
    /* Galería / Expo */
    'gal.etiqueta':  '<span class="galeria__etiqueta-linea" aria-hidden="true"></span>Annual presence',
    'gal.titulo':    'Expo Muebles Ocotlán',
    'expo.desc':     'Every year MEDEISA participates in Expo Muebles Ocotlán, the most important trade fair in the region. We showcase our catalog of handcrafted industrial furniture and connect with clients from all over Jalisco.',
    /* Contacto */
    'cnt.etiqueta':  '<span class="contacto__etiqueta-linea" aria-hidden="true"></span>Find us',
    'cnt.titulo':    'Contact us',
    'cnt.subtexto':  'We are ready to quote your project. Write to us or visit us.',
    'cnt.lbl.tel':   'Phone',
    'cnt.lbl.hor':   'Hours',
    'cnt.lbl.dir':   'Address',
    'cnt.val.hor':   'Monday to Friday · 8:00 am – 4:00 pm',
    'cnt.btn-wa':    'Message on WhatsApp',
    'cnt.redes':     'Follow us',
    /* Footer */
    'pie.tagline':   'We transform steel into style',
    'pie.nosotros':  'About',
    'pie.productos': 'Products',
    'pie.galeria':   'Gallery',
    'pie.contacto':  'Contact',
    'pie.derechos':  'All rights reserved.',
    'pie.ciudad':    'Ocotlán, Jalisco, Mexico',
  },
};

/* ---- Mapa selector → clave (html:true usa innerHTML) ---- */
const MAPA_TRADUCCION = [
  /* Nav — pill + menú móvil (misma clase, mismo href) */
  { sel: '.nav__link[href="#nosotros"]',  clave: 'nav.nosotros' },
  { sel: '.nav__link[href="#productos"]', clave: 'nav.productos' },
  { sel: '.nav__link[href="#galeria"]',   clave: 'nav.galeria'  },
  { sel: '.nav__link[href="#contacto"]',  clave: 'nav.contacto' },
  { sel: '.nav__btn-whatsapp',            clave: 'nav.cotizar'  },
  /* Hero */
  { sel: '.hero__eyebrow',      clave: 'hero.eyebrow',   html: true },
  { sel: '.hero__titulo-linea1',clave: 'hero.titulo-l1'           },
  { sel: '.hero__titulo-linea2 em', clave: 'hero.titulo-l2'       },
  { sel: '.hero__subtitulo',    clave: 'hero.subtitulo'           },
  { sel: '.hero__btn-primario', clave: 'hero.btn-prim'            },
  { sel: '.hero__cta-ghost',    clave: 'hero.cta-ghost'           },
  { sel: '.hero__deco-texto',   clave: 'hero.deco'                },
  /* Nosotros */
  { sel: '.nosotros__etiqueta',                               clave: 'nos.etiqueta',         html: true },
  { sel: '.nosotros__titulo',                                 clave: 'nos.titulo',           html: true },
  { sel: '.nosotros__descripcion',                            clave: 'nos.desc'                        },
  { sel: '.nosotros__enfoque .nosotros__sub-etiqueta',        clave: 'nos.enfoque-etiqueta', html: true },
  { sel: '.nosotros__enfoque-item:nth-child(1)',               clave: 'nos.enf1'                        },
  { sel: '.nosotros__enfoque-item:nth-child(2)',               clave: 'nos.enf2'                        },
  { sel: '.nosotros__enfoque-item:nth-child(3)',               clave: 'nos.enf3'                        },
  { sel: '.nosotros__enfoque-item:nth-child(4)',               clave: 'nos.enf4'                        },
  { sel: '.nosotros__enfoque-item:nth-child(5)',               clave: 'nos.enf5'                        },
  { sel: '.nosotros__enfoque-item:nth-child(6)',               clave: 'nos.enf6'                        },
  { sel: '.nosotros__mision .nosotros__sub-etiqueta',         clave: 'nos.mision-etiqueta',  html: true },
  { sel: '.nosotros__mision .nosotros__mv-texto',             clave: 'nos.mision-texto'                },
  { sel: '.nosotros__vision .nosotros__sub-etiqueta',         clave: 'nos.vision-etiqueta',  html: true },
  { sel: '.nosotros__vision .nosotros__mv-texto',             clave: 'nos.vision-texto'                },
  { sel: '.nosotros__valores-wrap .nosotros__sub-etiqueta',   clave: 'nos.valores-etiqueta', html: true },
  { sel: '.nosotros__pilares .nosotros__pilar:nth-child(1) .nosotros__pilar-nombre', clave: 'nos.v1.nom' },
  { sel: '.nosotros__pilares .nosotros__pilar:nth-child(2) .nosotros__pilar-nombre', clave: 'nos.v2.nom' },
  { sel: '.nosotros__pilares .nosotros__pilar:nth-child(3) .nosotros__pilar-nombre', clave: 'nos.v3.nom' },
  { sel: '.nosotros__pilares .nosotros__pilar:nth-child(4) .nosotros__pilar-nombre', clave: 'nos.v4.nom' },
  { sel: '.nosotros__pilares .nosotros__pilar:nth-child(5) .nosotros__pilar-nombre', clave: 'nos.v5.nom' },
  { sel: '.nosotros__afamo .nosotros__sub-etiqueta',                                          clave: 'nos.afil-etiqueta', html: true },
  { sel: '.nosotros__afil-cards .nosotros__afamo-card:nth-child(1) .nosotros__afamo-etiqueta', clave: 'nos.afil1-lbl' },
  { sel: '.nosotros__afil-cards .nosotros__afamo-card:nth-child(2) .nosotros__afamo-etiqueta', clave: 'nos.afil2-lbl' },
  /* Productos */
  { sel: '.productos__etiqueta', clave: 'prod.etiqueta', html: true },
  { sel: '.productos__titulo',   clave: 'prod.titulo'              },
  { sel: '.productos__grid .producto-tarjeta:nth-child(1) .producto-tarjeta__nombre', clave: 'prod.libreros' },
  { sel: '.productos__grid .producto-tarjeta:nth-child(2) .producto-tarjeta__nombre', clave: 'prod.mesas'    },
  { sel: '.productos__grid .producto-tarjeta:nth-child(3) .producto-tarjeta__nombre', clave: 'prod.escrts'   },
  { sel: '.productos__grid .producto-tarjeta:nth-child(4) .producto-tarjeta__nombre', clave: 'prod.sillas'   },
  { sel: '.producto-tarjeta__btn', clave: 'prod.cotizar'          },
  /* Galería / Expo */
  { sel: '.galeria__etiqueta', clave: 'gal.etiqueta', html: true  },
  { sel: '.galeria__titulo',   clave: 'gal.titulo'                },
  { sel: '.expo__desc',        clave: 'expo.desc'                 },
  /* Contacto */
  { sel: '.contacto__etiqueta', clave: 'cnt.etiqueta', html: true },
  { sel: '.contacto__titulo',   clave: 'cnt.titulo'               },
  { sel: '.contacto__subtexto', clave: 'cnt.subtexto'             },
  { sel: '.contacto__datos .contacto__dato:nth-child(1) .contacto__dato-label', clave: 'cnt.lbl.tel' },
  { sel: '.contacto__datos .contacto__dato:nth-child(2) .contacto__dato-label', clave: 'cnt.lbl.hor' },
  { sel: '.contacto__datos .contacto__dato:nth-child(3) .contacto__dato-label', clave: 'cnt.lbl.dir' },
  { sel: '.contacto__datos .contacto__dato:nth-child(2) .contacto__dato-valor', clave: 'cnt.val.hor' },
  { sel: '.contacto__btn-texto',  clave: 'cnt.btn-wa'             },
  { sel: '.contacto__redes-label',clave: 'cnt.redes'              },
  /* Footer */
  { sel: '.pie-pagina__tagline',           clave: 'pie.tagline'   },
  { sel: '.pie-pagina__link[href="#nosotros"]',  clave: 'pie.nosotros'  },
  { sel: '.pie-pagina__link[href="#productos"]', clave: 'pie.productos' },
  { sel: '.pie-pagina__link[href="#galeria"]',   clave: 'pie.galeria'   },
  { sel: '.pie-pagina__link[href="#contacto"]',  clave: 'pie.contacto'  },
  { sel: '.pie-pagina__creditos-derechos',       clave: 'pie.derechos'  },
  { sel: '.pie-pagina__creditos-ciudad',         clave: 'pie.ciudad'    },
];

const iniciarIdioma = (recalcularCursor) => {
  const btnES = document.querySelector('.hero__idioma-btn[data-lang="es"]');
  const btnEN = document.querySelector('.hero__idioma-btn[data-lang="en"]');
  if (!btnES || !btnEN) return;

  /* Recuperar preferencia guardada o detectar del navegador */
  const guardado   = localStorage.getItem('medeisa-lang');
  const preferido  = navigator.language?.startsWith('en') ? 'en' : 'es';
  const idiomaInicial = guardado ?? preferido;

  /* Aplicar traducción a todos los elementos del mapa */
  const aplicarIdioma = (lang) => {
    const t = TRADUCCIONES[lang];
    if (!t) return;

    MAPA_TRADUCCION.forEach(({ sel, clave, html }) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (html) {
          el.innerHTML = t[clave] ?? el.innerHTML;
        } else {
          el.textContent = t[clave] ?? el.textContent;
        }
      });
    });

    /* Atributo lang en <html> para accesibilidad y SEO */
    document.documentElement.lang = lang;

    /* Estados activo/inactivo en los botones */
    btnES.classList.toggle('activo', lang === 'es');
    btnEN.classList.toggle('activo', lang === 'en');
    btnES.setAttribute('aria-pressed', String(lang === 'es'));
    btnEN.setAttribute('aria-pressed', String(lang === 'en'));

    /* Persistir elección */
    localStorage.setItem('medeisa-lang', lang);

    /* Recalcular el cursor del nav pill en el siguiente frame,
       una vez que el browser haya repintado los nuevos textos */
    if (typeof recalcularCursor === 'function') {
      requestAnimationFrame(recalcularCursor);
    }
  };

  /* Escuchar clic en cada botón */
  [btnES, btnEN].forEach((btn) => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (btn.classList.contains('activo')) return; // ya activo
      aplicarIdioma(lang);
    });
  });

  /* Aplicar idioma inicial */
  if (idiomaInicial !== 'es') {
    aplicarIdioma(idiomaInicial);
  }
};


/* ================================================================
   NAV PILL — Cursor deslizante estilo 21st.dev/krittyz
   Traducción de React + Framer Motion a vanilla JS:
   - getBoundingClientRect reemplaza los refs de React
   - cubic-bezier(0.34, 1.56, 0.64, 1) replica el spring de Framer Motion
   - MutationObserver sincroniza con el IntersectionObserver del nav activo
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
    cursor.style.left  = `${elRect.left - pillRect.left}px`;
    cursor.style.width = `${elRect.width}px`;
  };

  /* Función pública: recalcula el cursor sobre el link activo actual.
     Se llama desde iniciarIdioma() después de cada cambio de idioma. */
  const recalcularCursor = () => moverCursor(linkActivo);

  /* Esperar el primer frame pintado para que el layout esté listo */
  requestAnimationFrame(recalcularCursor);

  /* Hover: mover al item sobrevolado; al salir, volver al activo */
  links.forEach((link) => {
    link.addEventListener('mouseenter', () => moverCursor(link));
    link.addEventListener('mouseleave', () => moverCursor(linkActivo));

    /* Teclado: Tab para focus, Escape ya lo maneja el nav existente */
    link.addEventListener('focus',  () => moverCursor(link));
    link.addEventListener('blur',   () => moverCursor(linkActivo));

    /* Click: actualizar referencia al link activo manualmente */
    link.addEventListener('click', () => {
      linkActivo = link;
      moverCursor(link);
    });
  });

  /* Sincronizar con la clase .activo que gestiona el IntersectionObserver del nav */
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

  /* Recalcular posición al redimensionar ventana */
  window.addEventListener('resize', recalcularCursor, { passive: true });

  return recalcularCursor;
};


/* ================================================================
   BOTÓN WHATSAPP FLOTANTE
   Visible en todas las secciones, incluido el Hero.
================================================================ */
const iniciarWhatsappFlotante = () => {
  const btn = document.querySelector('.whatsapp-flotante');
  if (!btn) return;

  btn.classList.add('visible');
};


/* ================================================================
   FOOTER — Año dinámico en los créditos
================================================================ */
const iniciarFooter = () => {
  const span = document.getElementById('anio-actual');
  if (span) span.textContent = new Date().getFullYear();
};


/* ================================================================
   INIT — Punto de entrada
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  iniciarNav();
  const recalcularCursor = iniciarNavPill();
  iniciarIdioma(recalcularCursor);
  iniciarHero();
  iniciarAnimacionesEntrada();
  iniciarWhatsappFlotante();
  iniciarFooter();
});
