#!/usr/bin/env python3
# Quita las franjas negras (~0.35% arriba y abajo) de las fotos de AMBIENTE del
# catalogo y regenera 1600w y 800w (.jpg/.webp) en 4:5, sin franjas.
# Uso: python3 docs/refactor-premium/scripts/ambiente.py
# Fuente: el propio <slug>-ambiente.jpg (1600x2000); no hay original mayor.
# No es idempotente: correrlo dos veces recorta otra vez el borde.

from pathlib import Path
from PIL import Image

CATALOGO = Path(__file__).resolve().parents[3] / "assets" / "catalogo"
W, H = 1600, 2000
UMBRAL = 24  # luminancia media de fila por debajo de la cual se considera franja


def franja(img, desde_abajo=False):
    gris = img.convert("L")
    filas = range(H - 1, -1, -1) if desde_abajo else range(H)
    n = 0
    for y in filas:
        fila = gris.crop((0, y, W, y + 1))
        if sum(fila.get_flattened_data()) / W >= UMBRAL:
            break
        n += 1
    return n


for fuente in sorted(CATALOGO.glob("*-ambiente.jpg")):
    img = Image.open(fuente).convert("RGB")
    assert img.size == (W, H), fuente
    # +2 px de margen para el antialias entre franja y foto
    arriba, abajo = franja(img) + 2, franja(img, True) + 2
    alto = H - arriba - abajo
    ancho = round(alto * W / H)
    x = (W - ancho) // 2
    limpia = img.crop((x, arriba, x + ancho, arriba + alto)).resize((W, H), Image.LANCZOS)
    base = fuente.with_suffix("")
    for sufijo, tam in (("", (W, H)), ("-800w", (W // 2, H // 2))):
        salida = limpia if sufijo == "" else limpia.resize(tam, Image.LANCZOS)
        salida.save(f"{base}{sufijo}.jpg", quality=86, optimize=True, progressive=True)
        salida.save(f"{base}{sufijo}.webp", quality=80, method=6)
    print(fuente.name, "franjas", arriba - 2, abajo - 2, "recorte", ancho, "x", alto)
