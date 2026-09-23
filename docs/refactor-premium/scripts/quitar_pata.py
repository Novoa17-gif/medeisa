#!/usr/bin/env python3
# Retoque local (sin creditos): borra una pata inventada por el modelo (p. ej.
# una 5a pata al centro) interpolando cada fila entre las columnas vecinas
# izquierda y derecha, con el grano del fondo. Solo sirve para columnas angostas
# sobre fondo liso (muro, piso, sombra bajo el mueble).
# Uso: python3 docs/refactor-premium/scripts/quitar_pata.py <entrada> <salida> x0 x1 y0 y1
import sys
import numpy as np
from PIL import Image

ent, sal = sys.argv[1], sys.argv[2]
x0, x1, y0, y1 = map(int, sys.argv[3:7])
img = np.asarray(Image.open(ent).convert("RGB")).astype(float)
izq = img[y0:y1, x0 - 6:x0 - 2].mean(1)            # promedio de 4 px a cada lado
der = img[y0:y1, x1 + 2:x1 + 6].mean(1)
t = np.linspace(0, 1, x1 - x0)[None, :, None]
relleno = izq[:, None, :] * (1 - t) + der[:, None, :] * t
ruido = img[y0:y1, x0 - 20:x0 - 2] - img[y0:y1, x0 - 20:x0 - 2].mean(1, keepdims=True)
rng = np.random.default_rng(3)
relleno += ruido[:, rng.integers(0, ruido.shape[1], x1 - x0)]   # grano del fondo vecino
img[y0:y1, x0:x1] = relleno
Image.fromarray(np.clip(img, 0, 255).astype(np.uint8)).save(sal)
print("ok", sal)
