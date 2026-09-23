#!/usr/bin/env python3
# Genera fotos de ESTUDIO unificadas del catalogo MEDEISA (local, PIL + numpy).
# Uso: python3 docs/refactor-premium/scripts/estudio.py [slug ...]
#      sin argumentos regenera todo; con slugs solo esas piezas (la hoja de
#      contacto usa las salidas existentes para el resto)
#
# Idea: cada fuente se "divide" entre su fondo (blanco puro en los renders, o un
# modelo suave del ciclorama gris en la foto real de Catania) y se multiplica por
# el canvas hueso. Asi el fondo se vuelve hueso exacto, los bordes antialias y las
# sombras suaves toman el tono del canvas (sin halos blancos) y el nucleo del mueble
# se compone normal con alfa. Despues se reencuadra todo con la misma escala, el
# mismo punto de piso y una sombra de contacto sintetica comun.

import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageFilter, ImageOps

FUENTES = Path("/Users/alannovoa/Documents/Deiro/Hogar")  # solo lectura
RAIZ = Path(__file__).resolve().parents[3]
SALIDA = RAIZ / "assets" / "catalogo"
CONTACTO = RAIZ / "docs" / "refactor-premium" / "estudio-contacto.jpg"

W, H = 1600, 2000
HUESO = np.array([0xE3, 0xE1, 0xDE], float)
PISO_Y = 1450          # linea donde apoyan las patas
ANCHO_OBJ = 0.72       # fraccion del ancho del canvas
ALTO_MAX = 0.62        # tope de alto (piezas verticales como la silla)

PIEZAS = {
    "centro-tv-catania": ("Mesas de centro : TV/Linea Industrial/Centro de TV Catania/Centro de TV Catania SF2.JPG", "gris"),
    "mesa-centro-catania": ("Mesas de centro : TV/Linea Industrial/Mesa de Centro Catania/Mesa de Centro Catania SF.png", "blanco"),
    "silla-sahara": ("Comedor/SILLAS Y BANCOS/Línea Industrial /Silla Sahara/Silla Sahara SF.png", "blanco"),
    "centro-tv-sierra-azul": ("Mesas de centro : TV/Linea Industrial/Centro de TV Sierra Azul Parota/Centro de TV Sierra Azul SF.png", "blanco"),
    "mesa-centro-sierra-azul": ("Mesas de centro : TV/Linea Industrial/Mesa de Centro Sierra Azul Parota/Mesa Centro Sierra Azul.png", "blanco"),
    "recamara-tulum": ("Recamara/Línea Industrial /Juego de Recamara/Recamara Tulum Chapa/Recámara Tulum Chapa SF.png", "blanco"),
}

# Ancho por pieza: Catania es baja y de perfil delgado; a 0.72 se ve chica junto a
# las demas, asi que se abre a 0.85 para igualar su area visual (w*h) al resto
ANCHO = {"centro-tv-catania": 0.85}


# --- Recamara Tulum: solo cama + buro izquierdo (decision del usuario) ---
def solo_cama_buro(img):
    img = img.copy()
    img[:, 1110:] = 255                                    # fuera la cajonera
    # buro derecho: queda detras de la cama. Arriba de la linea superior de la
    # cama (trazada a mano sobre el render) todo se pinta de blanco; en una banda
    # de tolerancia solo lo que no es tela (madera saturada o acero negro).
    # Junto a la sabana (x<860) la tela es clara (lum>150), asi que el umbral sube y se va la
    # pata oscura; a partir de x=975 no hay riel y la orilla negra de la cobija es cama
    xs = np.arange(786, 1008)
    borde = np.interp(xs, [786, 820, 860, 880, 920, 960, 990, 1008],
                          [518, 529, 544, 552, 562, 575, 585, 592])
    for x, yb in zip(xs, borde.astype(int)):
        img[440:yb - (1 if x < 805 else 6), x] = 255    # x<805: filo de la pata
        if x >= 975:
            continue
        col = img[yb - 6:yb + 8, x]
        sat = col.max(1) - col.min(1)
        lum = col.mean(1)
        tela = (sat < 70) & (lum > (150 if x < 860 else 45)) & (lum < 238)
        # todo lo que queda arriba de la primera tela de la banda es buro o su
        # antialias oscuro; se blanquea completo para dejar un filo limpio
        primera = int(np.argmax(tela)) if tela.any() else len(tela)
        col[:primera] = 255
    return img


PREPROCESO = {"recamara-tulum": solo_cama_buro}


# --- Fondo del canvas: degradado vertical sutil (piso un poco mas oscuro) ---
def canvas():
    y = np.linspace(0, 1, H)[:, None]
    piso = 1 / (1 + np.exp(-(y * H - PISO_Y) / 140))       # transicion suave muro -> piso
    tono = 1.012 - 0.018 * y - 0.028 * piso                 # arriba un pelo mas claro
    base = HUESO[None, None, :] * tono[..., None]
    base = np.broadcast_to(base, (H, W, 3)).copy()
    rng = np.random.default_rng(7)
    base += rng.normal(0, 0.6, (H, W, 1))                    # grano minimo anti-banding
    return base


def suave(a, r):
    im = Image.fromarray((np.clip(a, 0, 1) * 255).astype(np.uint8))
    return np.asarray(im.filter(ImageFilter.GaussianBlur(r))).astype(float) / 255


# --- Modelo del fondo gris (foto real): por fila se interpola el fondo a traves del
# mueble usando solo pixeles de ciclorama; asi respeta la linea muro/piso ---
def fondo_gris(img):
    h, w, _ = img.shape
    s = 4
    peq = img[::s, ::s]
    lum = peq.mean(2)
    sat = peq.max(2) - peq.min(2)
    obj = (sat >= 20) | (lum <= 100)
    obj = np.asarray(Image.fromarray((obj * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9))) > 0
    fondo = np.empty_like(peq)
    xs = np.arange(peq.shape[1])
    for y in range(peq.shape[0]):
        ok = ~obj[y]
        for c in range(3):
            fondo[y, :, c] = np.interp(xs, xs[ok], peq[y, ok, c]) if ok.sum() > 10 else peq[y, :, c]
    im = Image.fromarray(np.clip(fondo, 0, 255).astype(np.uint8))
    im = im.filter(ImageFilter.GaussianBlur(3)).resize((w, h), Image.BILINEAR)
    return np.asarray(im).astype(float)


# --- Cubiertas de madera vistas desde arriba (foto real de Catania) ---
# Son grises-rosadas como el muro, asi que pixel a pixel salen a medias (manchas).
# Se deciden por fila: sobre cada frente macizo (repisa, gabinete) se sube mientras
# la fila, en la mediana, sea mas oscura que el muro. El muro se modela por fila
# con una recta entre los bordes izquierdo y derecho de la foto (fuera del mueble).
def cubiertas(img, alfa, costura):
    h, w, _ = img.shape
    lum = img.mean(2)
    izq = lum[:, 10:110].mean(1)
    der = lum[:, w - 110:w - 10].mean(1)
    t = (np.arange(w) - 60) / (w - 120)
    muro = izq[:, None] + (der - izq)[:, None] * t[None, :]
    dif = 1 - lum / np.maximum(muro, 1)
    alfa = alfa.copy()
    macizo = alfa > 0.5
    y = costura - 1
    while y > h // 4:
        fila = macizo[y]
        cols = np.where(fila)[0]
        # fila de frente macizo: casi todo solido entre sus extremos y ancha
        if len(cols) > w * 0.4 and fila[cols[0]:cols[-1]].mean() > 0.9 and not macizo[y - 1, cols[0]:cols[-1]].mean() > 0.9:
            x0, x1 = cols[0], cols[-1]
            yy = y - 1
            while yy > y - 160 and np.median(dif[yy, x0 + 20:x1 - 20]) > 0.09:
                # en los extremos el frente incluye el poste; ahi solo se toma lo
                # que de verdad es mas oscuro que el muro
                alfa[yy, x0:x1] = np.maximum(alfa[yy, x0:x1], dif[yy, x0:x1] > 0.11)
                yy -= 1
            y = yy
        y -= 1
    return alfa


# --- Recorte: devuelve RGB recompuesto sobre hueso "plano" + alfa del nucleo ---
def recomponer(img, tipo):
    if tipo == "blanco":
        bg = np.full_like(img, 254.5)
    else:
        bg = fondo_gris(img)
    ratio = np.clip(img / np.maximum(bg, 1), 0, 1.0)
    dif = (1 - ratio).max(2)
    sat = (img.max(2) - img.min(2)) / 255
    fuerza = np.maximum(dif, sat * 1.4)
    if tipo == "blanco":
        alfa = np.clip((fuerza - 0.10) / 0.22, 0, 1)
    else:
        # Foto real: el piso de concreto es calido y tiene sombra, asi que el alfa sale
        # solo de la saturacion sobre el fondo (madera) y de la oscuridad absoluta (acero)
        sat_bg = (bg.max(2) - bg.min(2)) / 255
        alfa_madera = np.clip((sat - sat_bg - 0.07) / 0.08, 0, 1)
        # acero iluminado: mucho mas oscuro que el muro. Solo arriba de la linea muro/piso,
        # porque abajo la sombra del concreto daria falsos positivos
        perfil = bg.mean((1, 2))
        costura = int(np.argmin(np.diff(perfil[len(perfil) // 4:]))) + len(perfil) // 4
        rel = np.clip((dif - 0.30) / 0.16, 0, 1)
        rel[costura - 6:] = 0
        # bajo la costura no hay madera (solo patas y riel de acero): las manchas
        # calidas del concreto junto a la pata salian como motas grises
        alfa_madera[costura + 10:] = 0
        am = Image.fromarray((alfa_madera * 255).astype(np.uint8))
        am = am.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(5))
        alfa_madera = np.asarray(am).astype(float) / 255
        alfa_acero = np.maximum(np.clip((92 - img.mean(2)) / 30, 0, 1), rel)
        # sobre el concreto la sombra junto a la pata llega a ~80 de luminancia: ahi
        # el acero se mide contra el piso local (el riel con reflejo queda ~0.35)
        rel_piso = img[costura + 10:].mean(2) / np.maximum(bg[costura + 10:].mean(2), 1)
        alfa_acero[costura + 10:] = np.clip((0.62 - rel_piso) / 0.15, 0, 1)
        # apertura morfologica: quita motas de polvo del concreto sin tocar el perfil de acero
        ac = Image.fromarray((alfa_acero * 255).astype(np.uint8))
        ac = ac.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(5))
        alfa = np.maximum(alfa_madera, np.asarray(ac).astype(float) / 255)
        alfa = np.clip((alfa - 0.45) / 0.15, 0, 1)
        alfa = cubiertas(img, alfa, costura)
    alfa = suave(alfa, 1.2)
    # Las sombras propias se aclaran para que mande la sombra comun
    if tipo == "blanco":
        capa_sombra = 1 - 0.45 * (1 - ratio)
    else:
        # sombra del concreto: se quita el mueble y se difumina para que quede lisa
        lum_r = ratio.mean(2)
        fuera = suave(alfa, 6) < 0.05
        lum_r = np.where(fuera, lum_r, 1.0)
        lum_r = suave(lum_r, 22)
        capa_sombra = np.repeat((1 - 0.30 * (1 - lum_r))[..., None], 3, 2)
    ganancia = 1.0 if tipo == "blanco" else 1.18
    nucleo = np.clip(img * ganancia, 0, 255)
    return nucleo, capa_sombra, alfa


def bbox(alfa, umbral=0.6):
    m = alfa > umbral
    # ignora ruido: filas/columnas con muy pocos pixeles del mueble
    filas = np.where(m.sum(1) > 3)[0]
    cols = np.where(m.sum(0) > 3)[0]
    return cols[0], filas[0], cols[-1] + 1, filas[-1] + 1


def procesar(slug, ruta, tipo):
    im = ImageOps.exif_transpose(Image.open(FUENTES / ruta)).convert("RGB")
    if max(im.size) > 2600:
        im.thumbnail((2600, 2600), Image.LANCZOS)
    img = np.asarray(im).astype(float)
    if slug in PREPROCESO:
        img = PREPROCESO[slug](img)
    nucleo, capa_sombra, alfa = recomponer(img, tipo)
    x0, y0, x1, y1 = bbox(alfa)
    ow, oh = x1 - x0, y1 - y0
    esc = min(W * ANCHO.get(slug, ANCHO_OBJ) / ow, H * ALTO_MAX / oh)

    # Escalar solo la region util (con margen para sombras propias)
    pad = int(0.06 * max(ow, oh))
    cx0, cy0 = max(0, x0 - pad), max(0, y0 - pad)
    cx1, cy1 = min(img.shape[1], x1 + pad), min(img.shape[0], y1 + pad)
    nw, nh = round((cx1 - cx0) * esc), round((cy1 - cy0) * esc)

    def esc_arr(a, rng):
        a = a[cy0:cy1, cx0:cx1]
        im2 = Image.fromarray(np.clip(a / rng * 255, 0, 255).astype(np.uint8))
        return np.asarray(im2.resize((nw, nh), Image.LANCZOS)).astype(float) / 255 * rng

    n = esc_arr(nucleo, 255)
    s = esc_arr(capa_sombra, 1)
    a = esc_arr(alfa, 1)
    # desvanecer bordes del recorte para que no se note el rectangulo
    fy = np.minimum(np.arange(nh), np.arange(nh)[::-1])[:, None]
    fx = np.minimum(np.arange(nw), np.arange(nw)[::-1])[None, :]
    borde = np.clip(np.minimum(fx, fy) / max(8, pad * esc * 0.8), 0, 1)
    s = 1 - (1 - s) * borde[..., None]
    a = a * borde

    # Posicion: centrado en X, patas sobre PISO_Y
    px = round(W / 2 - ((x0 + x1) / 2 - cx0) * esc)
    py = round(PISO_Y - (y1 - cy0) * esc)

    lienzo = canvas()
    # Sombra de contacto comun: elipse difusa + nucleo oscuro bajo las patas
    ancho_px = ow * esc
    yy, xx = np.mgrid[0:H, 0:W]
    for rx, ry, k in ((0.56, 0.030, 0.16), (0.50, 0.010, 0.18)):
        d = ((xx - W / 2) / (ancho_px * rx)) ** 2 + ((yy - PISO_Y) / (H * ry)) ** 2
        lienzo *= (1 - k * np.exp(-d * 2.2))[..., None]
    # Sombra de oclusion con la silueta real proyectada al piso
    sil = np.zeros((H, W))
    sil[py:py + nh, px:px + nw] = a
    sil_img = Image.fromarray((sil * 255).astype(np.uint8))
    proj = np.asarray(sil_img.transform((W, H), Image.AFFINE, (1, 0, 0, 0, 6, -PISO_Y * 5))).astype(float) / 255
    proj = suave(proj, 18) * np.clip(1 - np.abs(yy - PISO_Y) / 40, 0, 1)
    lienzo *= (1 - 0.22 * proj)[..., None]

    reg = lienzo[py:py + nh, px:px + nw]
    reg *= s                                           # sombras/bordes en modo multiplicar
    reg[:] = reg * (1 - a[..., None]) + n * a[..., None]
    out = Image.fromarray(np.clip(lienzo, 0, 255).astype(np.uint8))
    return out


def guardar(im, slug):
    base = SALIDA / f"{slug}-estudio"
    im.save(f"{base}.jpg", quality=85, optimize=True, progressive=True)
    im.save(f"{base}.webp", quality=82, method=6)
    chico = im.resize((800, 1000), Image.LANCZOS)
    chico.save(f"{base}-800w.jpg", quality=85, optimize=True, progressive=True)
    chico.save(f"{base}-800w.webp", quality=82, method=6)


def main():
    SALIDA.mkdir(parents=True, exist_ok=True)
    elegidas = set(sys.argv[1:]) or set(PIEZAS)
    fotos = []
    for slug, (ruta, tipo) in PIEZAS.items():
        if slug in elegidas:
            im = procesar(slug, ruta, tipo)
            guardar(im, slug)
            print("ok", slug)
        else:
            im = Image.open(SALIDA / f"{slug}-estudio.jpg").convert("RGB")
        fotos.append(im)
    tw, th, gap = 480, 600, 24
    hoja = Image.new("RGB", (gap + len(fotos) * (tw + gap), th + 2 * gap), (250, 250, 248))
    for i, im in enumerate(fotos):
        hoja.paste(im.resize((tw, th), Image.LANCZOS), (gap + i * (tw + gap), gap))
    hoja.save(CONTACTO, quality=88)
    print("contacto", CONTACTO)


if __name__ == "__main__":
    main()
