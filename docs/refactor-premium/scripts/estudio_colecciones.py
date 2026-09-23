#!/usr/bin/env python3
# Fotos de ESTUDIO de las colecciones Kai y Nex (local, sin creditos).
# Reutiliza el compositor de estudio.py (mismo canvas hueso, misma sombra de
# contacto, mismo punto de piso y mismo ancho relativo) para que las 18 tarjetas
# se lean como una sola sesion.
# Uso: python3 docs/refactor-premium/scripts/estudio_colecciones.py [slug ...]
#
# Diferencias con estudio.py:
# - Fuente: docs/refactor-premium/colecciones/originales (renders de fondo plano
#   247 o 254/255). Antes de recomponer se normaliza el fondo a 254.5 para que
#   la division del compositor lo convierta en hueso exacto sin dejar un
#   rectangulo mas oscuro alrededor del mueble.
# - nex-cama y nex-comoda salen de los rescates Higgsfield (rescate/*.png).

import sys
from pathlib import Path
import numpy as np
from PIL import Image, ImageOps

import estudio as e

RAIZ = Path(__file__).resolve().parents[3]
ORIG = RAIZ / "docs" / "refactor-premium" / "colecciones" / "originales"
RESCATE = RAIZ / "docs" / "refactor-premium" / "colecciones" / "rescate"
CONTACTO = RAIZ / "docs" / "refactor-premium" / "colecciones" / "qa" / "estudio-colecciones-contacto.jpg"

PIEZAS = {
    "kai-credenza": ORIG / "kai-01-credenza.jpg",
    "kai-mesa-redonda": ORIG / "kai-02-mesa-redonda.jpg",
    "kai-mesa-comedor": ORIG / "kai-05-mesa-comedor.jpg",
    "kai-cama": ORIG / "kai-06-cama.jpg",
    "kai-base-cama": ORIG / "kai-03-base-cama.jpg",
    "kai-comoda": ORIG / "kai-04-comoda.jpg",
    "kai-buro": ORIG / "kai-07-buro.jpg",
    "nex-cama": RESCATE / "nex-cama.png",
    "nex-base-cama": ORIG / "nex-03-base-cama.jpg",
    "nex-buro": ORIG / "nex-04-buro.jpg",
    "nex-comoda": RESCATE / "nex-comoda.png",
    "nex-bufetera": ORIG / "nex-07-bufetera.jpg",
    "nex-mesa-centro": ORIG / "nex-06-mesa-centro.jpg",
    "nex-centro-tv": ORIG / "nex-01-centro-tv.jpg",
}


def fondo(img):
    # mediana del borde de 6 px: los renders tienen fondo plano
    b = np.concatenate([img[:6].reshape(-1, 3), img[-6:].reshape(-1, 3),
                        img[:, :6].reshape(-1, 3), img[:, -6:].reshape(-1, 3)])
    return np.median(b, 0)


# Rescate nex-cama (Higgsfield job 1167a3fa): todo coincide con la fuente salvo
# la cabecera, 9.6% mas chata (ancho/alto del marco 1.722 vs 1.571 en nex-02).
# Es un plano frontal y arriba del riel negro (y=997) solo hay cabecera y fondo
# blanco, asi que se estira esa banda en vertical anclada al riel.
def cabecera_nex(im):
    top, riel, k = 138, 997, 1.722 / 1.571
    banda = im.crop((0, top - 20, im.width, riel))
    alto = round(banda.height * k)
    out = im.copy()
    out.paste((255, 255, 255), (0, 0, im.width, riel))
    out.paste(banda.resize((im.width, alto), Image.LANCZOS), (0, riel - alto))
    return out


CORRECCION = {"nex-cama": cabecera_nex}


def procesar(slug, ruta):
    im = ImageOps.exif_transpose(Image.open(ruta)).convert("RGB")
    if slug in CORRECCION:
        im = CORRECCION[slug](im)
    if max(im.size) > 2600:
        im.thumbnail((2600, 2600), Image.LANCZOS)
    img = np.asarray(im).astype(float)
    # fondo -> 254.5 (lo que espera recomponer con tipo "blanco")
    img = np.clip(img * (254.5 / fondo(img))[None, None, :], 0, 255)
    # margen blanco para que el recorte con pad no choque con el borde
    m = int(0.08 * max(img.shape[:2]))
    img = np.pad(img, ((m, m), (m, m), (0, 0)), constant_values=254.5)
    # el compositor de estudio.py trabaja sobre FUENTES/ruta: se le pasa el array
    # por medio de un PREPROCESO que ignora la imagen leida
    e.PREPROCESO[slug] = lambda _img, a=img: a
    tmp = e.FUENTES
    e.FUENTES = Path("/")
    try:
        return e.procesar(slug, str(ruta).lstrip("/"), "blanco")
    finally:
        e.FUENTES = tmp


def guardar(im, slug):
    base = e.SALIDA / f"{slug}-estudio"
    im.save(f"{base}.jpg", quality=85, optimize=True, progressive=True)
    im.save(f"{base}.webp", quality=82, method=6)
    chico = im.resize((800, 1000), Image.LANCZOS)
    chico.save(f"{base}-800w.jpg", quality=85, optimize=True, progressive=True)
    chico.save(f"{base}-800w.webp", quality=82, method=6)


def main():
    elegidas = sys.argv[1:] or [s for s, r in PIEZAS.items() if r.exists()]
    for slug in elegidas:
        guardar(procesar(slug, PIEZAS[slug]), slug)
        print("ok", slug)
    # hoja de contacto: las 6 industriales + todo lo que ya exista de Kai y Nex
    slugs = ["centro-tv-catania", "silla-sahara"] + [s for s in PIEZAS if (e.SALIDA / f"{s}-estudio.jpg").exists()]
    tw, th, gap, por_fila = 320, 400, 16, 8
    filas = -(-len(slugs) // por_fila)
    hoja = Image.new("RGB", (gap + por_fila * (tw + gap), gap + filas * (th + gap)), (250, 250, 248))
    for i, s in enumerate(slugs):
        im = Image.open(e.SALIDA / f"{s}-estudio.jpg").convert("RGB").resize((tw, th), Image.LANCZOS)
        hoja.paste(im, (gap + (i % por_fila) * (tw + gap), gap + (i // por_fila) * (th + gap)))
    CONTACTO.parent.mkdir(parents=True, exist_ok=True)
    hoja.save(CONTACTO, quality=88)
    print("contacto", CONTACTO)


if __name__ == "__main__":
    main()
