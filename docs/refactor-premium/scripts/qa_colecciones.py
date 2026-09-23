#!/usr/bin/env python3
# Hojas de QA de las colecciones Kai y Nex (local, PIL).
# Uso: python3 docs/refactor-premium/scripts/qa_colecciones.py
#
# Rescate (estudio): fuente | resultado Higgsfield | superposicion (fuente
#   reescalada al bbox del resultado, 50/50) | estudio final 4:5.
#   La superposicion delata proporciones cambiadas: si las lineas se duplican,
#   la pieza no coincide.
# Ambiente: fuente | ambiente final | un ambiente industrial existente (misma
#   escena) + fila de recortes de detalle fuente vs resultado.

from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

from estudio_colecciones import CORRECCION

RAIZ = Path(__file__).resolve().parents[3]
COL = RAIZ / "docs" / "refactor-premium" / "colecciones"
CAT = RAIZ / "assets" / "catalogo"
QA = COL / "qa"
H = 900  # alto de cada panel


def abrir(p):
    return Image.open(p).convert("RGB")


def alto(im, h=H):
    return im.resize((round(im.width * h / im.height), h), Image.LANCZOS)


def bbox(im, umbral=235):
    a = np.asarray(im.convert("L")) < umbral
    f, c = np.where(a.sum(1) > 3)[0], np.where(a.sum(0) > 3)[0]
    return c[0], f[0], c[-1] + 1, f[-1] + 1


def hoja(paneles, titulo, salida, extra=None):
    gap = 20
    w = sum(p.width for p in paneles) + gap * (len(paneles) + 1)
    if extra and extra.width > w - 2 * gap:  # la tira de detalle no rebasa los paneles
        k = (w - 2 * gap) / extra.width
        extra = extra.resize((w - 2 * gap, round(extra.height * k)), Image.LANCZOS)
    h = H + 2 * gap + 40 + (extra.height + gap if extra else 0)
    out = Image.new("RGB", (max(w, extra.width + 2 * gap if extra else 0), h), (250, 250, 248))
    ImageDraw.Draw(out).text((gap, 12), titulo, fill=(10, 10, 10))
    x = gap
    for p in paneles:
        out.paste(p, (x, 40))
        x += p.width + gap
    if extra:
        out.paste(extra, (gap, 40 + H + gap))
    out.save(salida, quality=88)
    print("qa", salida)


def superposicion(fuente, gen):
    x0, y0, x1, y1 = bbox(gen)
    sx0, sy0, sx1, sy1 = bbox(fuente)
    f = fuente.crop((sx0, sy0, sx1, sy1)).resize((x1 - x0, y1 - y0), Image.LANCZOS)
    base = gen.copy()
    reg = base.crop((x0, y0, x1, y1))
    base.paste(Image.blend(reg, f, 0.5), (x0, y0))
    return base


def rescate(slug, fuente):
    src = abrir(COL / "originales" / fuente)
    gen = abrir(COL / "rescate" / f"{slug}.png")
    if slug in CORRECCION:  # la misma correccion local que usa el estudio
        gen = CORRECCION[slug](gen)
    fin = abrir(CAT / f"{slug}-estudio.jpg")
    hoja([alto(src), alto(gen), alto(superposicion(src, gen)), alto(fin)],
         f"{slug}: fuente {src.size} | Higgsfield {gen.size} | superposicion 50/50 | estudio final",
         QA / f"{slug}-rescate.jpg")


def ambiente(slug, fuente, detalles, ref="centro-tv-catania"):
    src = abrir(COL / "originales" / fuente)
    fin = abrir(CAT / f"{slug}-ambiente.jpg")
    exi = abrir(CAT / f"{ref}-ambiente.jpg")
    # detalles: pares (caja en fuente, caja en ambiente final 1600x2000)
    tiras = []
    for cs, cf in detalles:
        a, b = alto(src.crop(cs), 300), alto(fin.crop(cf), 300)
        t = Image.new("RGB", (a.width + b.width + 10, 300), (250, 250, 248))
        t.paste(a, (0, 0)); t.paste(b, (a.width + 10, 0))
        tiras.append(t)
    extra = Image.new("RGB", (sum(t.width for t in tiras) + 20 * len(tiras), 300), (250, 250, 248))
    x = 0
    for t in tiras:
        extra.paste(t, (x, 0)); x += t.width + 20
    hoja([alto(src), alto(fin), alto(exi)],
         f"{slug}: fuente | ambiente final | ambiente existente ({ref}) ; abajo detalle fuente vs final",
         QA / f"{slug}-ambiente.jpg", extra)


# --- Fase B ---
FUENTES_B = {
    "kai-credenza": "kai-01-credenza.jpg", "kai-mesa-redonda": "kai-02-mesa-redonda.jpg",
    "kai-mesa-comedor": "kai-05-mesa-comedor.jpg", "kai-cama": "kai-06-cama.jpg",
    "kai-buro": "kai-07-buro.jpg", "nex-cama": "nex-02-cama.jpg", "nex-comoda": "nex-05-comoda.jpg",
    "nex-buro": "nex-04-buro.jpg", "nex-mesa-centro": "nex-06-mesa-centro.jpg",
    "nex-centro-tv": "nex-01-centro-tv.jpg",
}


def ambiente_b(slug, fuente):
    # detalle automatico: la zona del mueble (40-92% del alto) a doble tamano
    fin = abrir(CAT / f"{slug}-ambiente.jpg")
    src = abrir(COL / "originales" / fuente)
    det = alto(fin.crop((0, 800, 1600, 1840)), 600)
    hoja([alto(src), alto(fin), alto(abrir(CAT / "nex-bufetera-ambiente.jpg" if slug.startswith("nex") else CAT / "kai-comoda-ambiente.jpg"))],
         f"{slug}: fuente | ambiente final | ambiente aprobado de fase A (misma escena) ; abajo zona del mueble",
         QA / f"{slug}-ambiente.jpg", det)


def portadas():
    PORT = RAIZ / "assets" / "colecciones"
    for sala, refs in (("kai", ["kai-01-credenza.jpg", "kai-02-mesa-redonda.jpg"]),
                       ("nex", ["nex-07-bufetera.jpg"]),
                       ("industrial", None)):
        d = abrir(PORT / f"{sala}-portada-2000w.jpg")
        m = abrir(PORT / f"{sala}-portada-movil-1080w.jpg")
        if refs:
            fuentes = [alto(abrir(COL / "originales" / r), 440) for r in refs]
        else:
            fuentes = [alto(abrir(CAT / f"{x}-estudio.jpg"), 440) for x in ("centro-tv-catania", "silla-sahara")]
        tira = Image.new("RGB", (sum(f.width for f in fuentes) + 20 * len(fuentes), 440), (250, 250, 248))
        x = 0
        for f in fuentes:
            tira.paste(f, (x, 0)); x += f.width + 20
        hoja([alto(d), alto(m)], f"portada {sala}: 3:2 desktop | 4:5 movil ; abajo fuentes de las piezas",
             QA / f"{sala}-portada.jpg", tira)


def contacto_b():
    slugs = list(FUENTES_B) + ["kai-comoda", "nex-bufetera"]
    tw, th, gap = 300, 375, 14
    PORT = RAIZ / "assets" / "colecciones"
    pw = round(th * 1.5)
    ancho = gap + 7 * (tw + gap)
    filas = 2
    out = Image.new("RGB", (ancho, gap + filas * (th + gap) + th + 2 * gap), (250, 250, 248))
    for i, sl in enumerate(slugs):
        im = abrir(CAT / f"{sl}-ambiente.jpg").resize((tw, th), Image.LANCZOS)
        out.paste(im, (gap + (i % 7) * (tw + gap), gap + (i // 7) * (th + gap)))
    y = gap + filas * (th + gap) + gap
    x = gap
    for sala in ("kai", "nex", "industrial"):
        im = abrir(PORT / f"{sala}-portada-1200w.jpg").resize((pw, th), Image.LANCZOS)
        out.paste(im, (x, y)); x += pw + gap
    out.save(QA / "ambientes-portadas-contacto.jpg", quality=88)
    print("qa", QA / "ambientes-portadas-contacto.jpg")


if __name__ == "__main__":
    QA.mkdir(parents=True, exist_ok=True)
    rescate("nex-cama", "nex-02-cama.jpg")
    rescate("nex-comoda", "nex-05-comoda.jpg")
    if (CAT / "nex-bufetera-ambiente.jpg").exists():
        ambiente("nex-bufetera", "nex-07-bufetera.jpg",
                 [((0, 180, 1536, 440), (230, 950, 1400, 1100)),
                  ((0, 650, 1536, 900), (230, 1290, 1420, 1510))])
    if (CAT / "kai-comoda-ambiente.jpg").exists():
        ambiente("kai-comoda", "kai-04-comoda.jpg",
                 [((180, 150, 1450, 560), (150, 1130, 1330, 1520)),
                  ((60, 640, 1480, 960), (100, 1560, 1400, 1850))])
    for sl, fu in FUENTES_B.items():
        if (CAT / f"{sl}-ambiente.jpg").exists():
            ambiente_b(sl, fu)
    if (RAIZ / "assets" / "colecciones" / "kai-portada-2000w.jpg").exists():
        portadas()
        contacto_b()
