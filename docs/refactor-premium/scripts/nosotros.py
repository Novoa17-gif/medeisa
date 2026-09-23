#!/usr/bin/env python3
# Regenera assets/nosotros desde assets/images/nosotros.jpg (998x1271) en 4:5,
# quitando la franja gris uniforme de ~9 px del borde derecho del original.
# Uso: python3 docs/refactor-premium/scripts/nosotros.py (idempotente: lee siempre el original)

from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parents[3]
FUENTE = RAIZ / "assets" / "images" / "nosotros.jpg"
DESTINO = RAIZ / "assets" / "nosotros"

img = Image.open(FUENTE).convert("RGB")
assert img.size == (998, 1271), img.size
# Columnas 989-997 son la franja: se conservan 3..987 (984 px) y se centra el alto en 4:5
ancho = 984
alto = ancho * 5 // 4          # 1230
x, y = 3, (img.height - alto) // 2
limpia = img.crop((x, y, x + ancho, y + alto))

for sufijo, tam in (("", (ancho, alto)), ("-800w", (800, 1000))):
    salida = limpia if sufijo == "" else limpia.resize(tam, Image.LANCZOS)
    salida.save(DESTINO / f"nosotros{sufijo}.jpg", quality=86, optimize=True, progressive=True)
    salida.save(DESTINO / f"nosotros{sufijo}.webp", quality=80, method=6)
    print(f"nosotros{sufijo}", salida.size)
