#!/usr/bin/env python3
# Retoque local (sin creditos) del ambiente kai-comoda v2: Nano Banana dejo la
# ranura ola en gris beige claro; en la pieza real es taupe-bronce (fuente
# kai-04: ranura 129/103/78 vs madera 206/142/80). Se enmascara la ranura por
# baja saturacion dentro de la banda de cajones y se tine conservando el
# sombreado. Tambien recorta la esquina de muro que queda a la izquierda.
# Uso: python3 docs/refactor-premium/scripts/ranura_kai.py <entrada.png> <salida.png> [x0 x1 y0 y1 corte_x]
#   sin caja usa la de kai-comoda v2 (380 1420 1345 1640, corte 200); corte_x 0 = sin recorte
import sys
import numpy as np
from PIL import Image, ImageFilter

RANURA_SRC = np.array([129, 103, 78.])
MADERA_SRC = np.array([206, 142, 80.])
X0, X1, Y0, Y1, CORTE_X = 380, 1420, 1345, 1640, 200   # kai-comoda v2: banda de ranuras y esquina en x~175
if len(sys.argv) > 3:
    X0, X1, Y0, Y1, CORTE_X = map(int, sys.argv[3:8])

img = np.asarray(Image.open(sys.argv[1]).convert("RGB")).astype(float)
r = img[Y0:Y1, X0:X1]
sat, lum = r.max(2) - r.min(2), r.mean(2)
m = (sat < np.median(sat) * 0.62) & (lum > 90)
mi = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
alfa = np.asarray(mi.filter(ImageFilter.GaussianBlur(1.2))).astype(float)[..., None] / 255
madera = np.median(r[(sat > np.median(sat))], 0)           # madera del ambiente
objetivo = RANURA_SRC * madera / MADERA_SRC                 # misma relacion ranura/madera que la fuente
l_ran = np.median(lum[m])
tinte = objetivo[None, None, :] * (lum / l_ran)[..., None]  # conserva luz y sombra
img[Y0:Y1, X0:X1] = r * (1 - alfa) + tinte * alfa
out = Image.fromarray(np.clip(img, 0, 255).astype(np.uint8))
if CORTE_X:
    w, h = out.size
    nh = round((w - CORTE_X) * 5 / 4)
    y = (h - nh) // 2
    out = out.crop((CORTE_X, y, w, y + nh))
out.save(sys.argv[2])
print("madera", madera.round(), "ranura objetivo", objetivo.round(), "mascara", round(float(m.mean()), 3))
