#!/usr/bin/env python3
# Portadas de sala (Kai, Nexo, Industrial) a partir de la generacion 3:2.
# Uso: python3 docs/refactor-premium/scripts/portada_colecciones.py <sala> <png 3:2> <x0> <centro_movil|ruta 4:5>
#   x0: columnas a recortar a la izquierda (ventana o esquina de muro); 0 = nada
#   centro_movil: x (en px del png original) del centro de la pieza protagonista
#     para el recorte 4:5 movil a alto completo; o una ruta a una imagen 4:5 ya
#     aprobada cuando la pieza no cabe en un 4:5 del 3:2 (caso Nexo).
# Salidas: assets/colecciones/<sala>-portada-{2000w,1200w}.{jpg,webp} (3:2) y
#          <sala>-portada-movil-{1080w,720w}.{jpg,webp} (4:5).
import sys
from pathlib import Path
from PIL import Image

SAL = Path(__file__).resolve().parents[3] / "assets" / "colecciones"


def exportar(im, base, anchos, prop):
    for w in anchos:
        h = round(w / prop)
        r = im.resize((w, h), Image.LANCZOS)
        r.save(f"{base}-{w}w.jpg", quality=86, optimize=True, progressive=True)
        r.save(f"{base}-{w}w.webp", quality=80, method=6)


def main(sala, ruta, x0, movil):
    SAL.mkdir(parents=True, exist_ok=True)
    im = Image.open(ruta).convert("RGB")
    W, H = im.size
    x0 = int(x0)
    ancho = W - x0
    alto = min(H, round(ancho / 1.5))
    ancho = round(alto * 1.5)
    y = (H - alto) // 2
    caja = (x0, y, x0 + ancho, y + alto)
    exportar(im.crop(caja), SAL / f"{sala}-portada", (2000, 1200), 1.5)
    if Path(movil).exists():
        m = Image.open(movil).convert("RGB")
        mw, mh = m.size
        assert abs(mw / mh - 0.8) < 0.01, "la imagen movil debe ser 4:5"
        caja_m = "archivo 4:5 " + str(movil)
    else:
        cx = int(movil)
        mh = H
        mw = round(mh * 0.8)
        mx = min(max(cx - mw // 2, x0), W - mw)
        m = im.crop((mx, 0, mx + mw, mh))
        caja_m = (mx, 0, mx + mw, mh)
    exportar(m, SAL / f"{sala}-portada-movil", (1080, 720), 0.8)
    print("ok", sala, "3:2", caja, "4:5", caja_m)


if __name__ == "__main__":
    main(*sys.argv[1:5])
