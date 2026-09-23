#!/usr/bin/env python3
# Retoque local (sin creditos): Nano Banana tiende a dar el roble Kai palido y
# amarillento (r/g ~1.35, g/b ~1.5) frente a la fuente (kai-04: r/g 1.45,
# g/b 1.76) y al ambiente kai-comoda aprobado (1.51 / 1.80). Se corrige solo la
# madera: mascara suave por saturacion y tono naranja (muro, piso, metal
# champagne, tapiz y ceramica quedan fuera por ser poco saturados) y se ajustan
# rojo y azul hacia la relacion objetivo conservando la luminancia.
# Uso: python3 docs/refactor-premium/scripts/tono_kai.py <entrada> <salida>
import sys
import numpy as np
from PIL import Image, ImageFilter

RG, GB = 1.46, 1.76          # objetivo = fuente kai-04

img = np.asarray(Image.open(sys.argv[1]).convert("RGB")).astype(float)
r, g, b = img[..., 0], img[..., 1], img[..., 2]
sat = img.max(2) - img.min(2)
naranja = (r > g) & (g > b)
m = np.clip((sat - 45) / 30, 0, 1) * naranja
m = np.asarray(Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.5))).astype(float) / 255
duro = (sat > 70) & naranja
rg_act = np.median(r[duro] / g[duro])
gb_act = np.median(g[duro] / np.maximum(b[duro], 1))
kr, kb = RG / rg_act, gb_act / GB
nuevo = img * np.array([kr, 1.0, kb])[None, None, :]
lum0 = img @ np.array([0.299, 0.587, 0.114])
lum1 = nuevo @ np.array([0.299, 0.587, 0.114])
nuevo *= (lum0 / np.maximum(lum1, 1))[..., None]
out = img * (1 - m[..., None]) + nuevo * m[..., None]
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(sys.argv[2])
print(f"ok {sys.argv[2]}  r/g {rg_act:.3f}->{RG}  g/b {gb_act:.3f}->{GB}  kr {kr:.3f} kb {kb:.3f}")
