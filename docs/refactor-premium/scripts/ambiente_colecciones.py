#!/usr/bin/env python3
# Termina las fotos de AMBIENTE generadas en Higgsfield para Kai y Nex.
# Uso: python3 docs/refactor-premium/scripts/ambiente_colecciones.py <slug> <png generado>
#
# Nano Banana Pro entrega 4:5 "aproximado" (1856x2304 = 0.806); se recorta al
# 4:5 exacto centrado, se revisa que no traiga franjas negras (defecto de la
# ronda anterior, ver ambiente.py) y se exporta 1600w/800w jpg q86 + webp q80,
# igual que los 6 ambientes industriales.

import sys
from pathlib import Path
import numpy as np
from PIL import Image

CAT = Path(__file__).resolve().parents[3] / "assets" / "catalogo"
W, H = 1600, 2000


def main(slug, ruta):
    img = Image.open(ruta).convert("RGB")
    gris = np.asarray(img.convert("L")).astype(float)
    bordes = [gris[:3].mean(), gris[-3:].mean(), gris[:, :3].mean(), gris[:, -3:].mean()]
    assert min(bordes) > 24, f"franja negra en el borde: {bordes}"
    w, h = img.size
    if w / h > W / H:
        nw = round(h * W / H)
        caja = ((w - nw) // 2, 0, (w - nw) // 2 + nw, h)
    else:
        nh = round(w * H / W)
        caja = (0, (h - nh) // 2, w, (h - nh) // 2 + nh)
    img = img.crop(caja).resize((W, H), Image.LANCZOS)
    base = CAT / f"{slug}-ambiente"
    for sufijo, tam in (("", (W, H)), ("-800w", (W // 2, H // 2))):
        im = img if sufijo == "" else img.resize(tam, Image.LANCZOS)
        im.save(f"{base}{sufijo}.jpg", quality=86, optimize=True, progressive=True)
        im.save(f"{base}{sufijo}.webp", quality=80, method=6)
    print("ok", slug, "recorte", caja)


if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
