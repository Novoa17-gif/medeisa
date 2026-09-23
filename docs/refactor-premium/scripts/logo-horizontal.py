#!/usr/bin/env python3
# Crea assets/logo/medeisa-logo-horizontal.png: la M y la palabra MEDEISA del
# logo original (assets/logo.PNG) en horizontal, sin "S.A. de C.V." ni
# "Metales de Innovación" (ilegibles a 48px de alto). Exporta a 2x (80px alto).
from pathlib import Path
from PIL import Image

RAIZ = Path(__file__).resolve().parents[3]
logo = Image.open(RAIZ / "assets" / "logo.PNG").convert("RGBA")

ALTO = 80            # 2x de 40px en pantalla
M = logo.crop((491, 30, 1758, 914))              # isotipo
PALABRA = logo.crop((38, 1121, 1014, 1281))      # "MEDEISA"
ALTO_PALABRA = 26    # altura de mayúscula ~13px en pantalla
HUECO = 24

m = M.resize((round(M.width * ALTO / M.height), ALTO), Image.LANCZOS)
p = PALABRA.resize((round(PALABRA.width * ALTO_PALABRA / PALABRA.height), ALTO_PALABRA), Image.LANCZOS)

lienzo = Image.new("RGBA", (m.width + HUECO + p.width, ALTO), (0, 0, 0, 0))
lienzo.alpha_composite(m, (0, 0))
lienzo.alpha_composite(p, (m.width + HUECO, (ALTO - ALTO_PALABRA) // 2))
lienzo.save(RAIZ / "assets" / "logo" / "medeisa-logo-horizontal.png", optimize=True)
print(lienzo.size)
