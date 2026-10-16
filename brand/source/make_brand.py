"""Generate the RORO LUX logo, monogram and favicon files as outlined SVG.

Product labels are generated separately by make_labels.py.

All lettering is converted to vector paths, so the files print identically on
any machine (no font installation needed at the printer).

Requirements:  pip install fonttools brotli
Run from the roro-lux/ folder:  python3 brand/source/make_brand.py
"""

import os

from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
FONTS = os.path.join(ROOT, "src", "static", "fonts")
OUT = os.path.join(ROOT, "brand")
SITE_BRAND = os.path.join(ROOT, "src", "static", "brand")

SERIF_LIGHT = TTFont(os.path.join(FONTS, "cormorant-garamond-latin-300-normal.woff2"))
SERIF_REGULAR = TTFont(os.path.join(FONTS, "cormorant-garamond-latin-400-normal.woff2"))
SERIF_ITALIC = TTFont(os.path.join(FONTS, "cormorant-garamond-latin-300-italic.woff2"))
SANS = TTFont(os.path.join(FONTS, "jost-latin-400-normal.woff2"))

INK = "#2B2A28"


def text_path(font, text, size, tracking=0.0):
    """Return (svg_path_d, width, ascent_box) for `text` set at `size` px.

    `tracking` is extra letter-spacing in ems. The path's baseline is y=0.
    """
    glyph_set = font.getGlyphSet()
    cmap = font.getBestCmap()
    upm = font["head"].unitsPerEm
    scale = size / upm
    pen = SVGPathPen(glyph_set)
    bounds = BoundsPen(glyph_set)
    x = 0.0
    chars = list(text)
    for i, ch in enumerate(chars):
        name = cmap[ord(ch)]
        glyph = glyph_set[name]
        # Flip y (font units are y-up, SVG is y-down) and scale.
        t = (scale, 0, 0, -scale, x, 0)
        glyph.draw(TransformPen(pen, t))
        glyph.draw(TransformPen(bounds, t))
        x += glyph.width * scale
        if i < len(chars) - 1:
            x += tracking * size
    return pen.getCommands(), x, bounds.bounds


def flame(cx, base_y, height, stroke=1.0, color=INK):
    """A single fine-line flame above a short wick — the brand's quiet mark.

    `base_y` is the bottom of the wick; the flame sits just above it.
    """
    h = height * 0.78          # flame body
    w = h * 0.34               # half-width at the widest point
    bottom = base_y - height * 0.26
    top = bottom - h
    tip = cx + w * 0.18        # the tip leans very slightly, like a still flame
    d = (
        f"M{tip:.2f},{top:.2f} "
        f"C{cx + w * 0.55:.2f},{top + h * 0.28:.2f} {cx + w * 1.05:.2f},{top + h * 0.52:.2f} {cx + w * 0.92:.2f},{top + h * 0.76:.2f} "
        f"C{cx + w * 0.80:.2f},{bottom - h * 0.02:.2f} {cx - w * 0.80:.2f},{bottom - h * 0.02:.2f} {cx - w * 0.92:.2f},{top + h * 0.76:.2f} "
        f"C{cx - w * 1.02:.2f},{top + h * 0.50:.2f} {cx - w * 0.30:.2f},{top + h * 0.30:.2f} {tip:.2f},{top:.2f} Z"
    )
    wick = f"M{cx:.2f},{bottom + height * 0.07:.2f} L{cx:.2f},{base_y:.2f}"
    return (
        f'<path d="{d}" fill="none" stroke="{color}" stroke-width="{stroke}" stroke-linejoin="round"/>'
        f'<path d="{wick}" fill="none" stroke="{color}" stroke-width="{stroke}" stroke-linecap="round"/>'
    )


def centred(font, text, size, cx, baseline, color, tracking=0.0, max_width=None):
    """Place `text` centred on `cx`, shrinking it if it exceeds `max_width`."""
    d, w, b = text_path(font, text, size, tracking)
    if max_width and (b[2] - b[0]) > max_width:
        size *= max_width / (b[2] - b[0])
        d, w, b = text_path(font, text, size, tracking)
    return placed(d, cx - (b[2] - b[0]) / 2 - b[0], baseline, color)


def svg(width, height, body, title):
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {width:.2f} {height:.2f}" '
        f'width="{width:.0f}" height="{height:.0f}" role="img" aria-label="{title}">'
        f"<title>{title}</title>{body}</svg>\n"
    )


def placed(d, x, y, color):
    return f'<path transform="translate({x:.2f} {y:.2f})" d="{d}" fill="{color}"/>'


def write(path, content):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as fh:
        fh.write(content)


def primary_logo(color=INK):
    """Stacked logo: fine flame, wordmark, hairline, tagline."""
    W = 460
    cx = W / 2
    parts = []
    parts.append(flame(cx, 62, 44, stroke=1.1, color=color))

    d, w, b = text_path(SERIF_LIGHT, "RORO LUX", 52, tracking=0.30)
    # Optical centring: drop the trailing tracking from the measured width.
    x = cx - (b[2] - b[0]) / 2 - b[0]
    baseline = 140
    parts.append(placed(d, x, baseline, color))

    parts.append(
        f'<path d="M{cx - 22:.2f},{baseline + 22:.2f} L{cx + 22:.2f},{baseline + 22:.2f}" '
        f'stroke="{color}" stroke-width="0.8"/>'
    )

    d2, w2, b2 = text_path(SANS, "SCENT FOR INTENTIONAL LIVING", 10.5, tracking=0.32)
    x2 = cx - (b2[2] - b2[0]) / 2 - b2[0]
    parts.append(placed(d2, x2, baseline + 48, color))
    return svg(W, 205, "".join(parts), "RORO LUX — Scent for intentional living")


def horizontal_logo(color=INK):
    """Header lock-up: flame + wordmark on one line."""
    d, w, b = text_path(SERIF_LIGHT, "RORO LUX", 40, tracking=0.30)
    flame_w = 22
    gap = 14
    height = 52
    baseline = 38
    parts = [flame(flame_w / 2 + 2, baseline + 1, 38, stroke=1.0, color=color)]
    parts.append(placed(d, flame_w + gap - b[0], baseline, color))
    width = flame_w + gap + (b[2] - b[0]) + 4
    return svg(width, height, "".join(parts), "RORO LUX")


def monogram(color=INK, background=None):
    """Round monogram for lids, seals, favicons and social avatars."""
    S = 200
    c = S / 2
    parts = []
    if background:
        parts.append(f'<rect width="{S}" height="{S}" fill="{background}"/>')
    parts.append(f'<circle cx="{c}" cy="{c}" r="{c - 8}" fill="none" stroke="{color}" stroke-width="1.6"/>')
    parts.append(centred(SERIF_LIGHT, "RL", 72, c, c + 36, color, tracking=0.02))
    parts.append(flame(c, c - 22, 34, stroke=1.3, color=color))
    return svg(S, S, "".join(parts), "RORO LUX monogram")


def favicon():
    """Simplified mark that stays legible at 16–32 px."""
    S = 64
    parts = [f'<rect width="{S}" height="{S}" rx="12" fill="#FFFFFF"/>']
    d, w, b = text_path(SERIF_REGULAR, "R", 46)
    x = S / 2 - (b[2] - b[0]) / 2 - b[0]
    parts.append(placed(d, x, 48, INK))
    return svg(S, S, "".join(parts), "RORO LUX")


def main():
    files = {
        "roro-lux-logo.svg": primary_logo(),
        "roro-lux-logo-white.svg": primary_logo("#FFFFFF"),
        "roro-lux-horizontal.svg": horizontal_logo(),
        "roro-lux-horizontal-white.svg": horizontal_logo("#FFFFFF"),
        "roro-lux-monogram.svg": monogram(),
        "roro-lux-monogram-white.svg": monogram("#FFFFFF"),
    }
    for name, content in files.items():
        write(os.path.join(OUT, name), content)

    # Site copies used in the header, footer and favicon.
    write(os.path.join(SITE_BRAND, "logo.svg"), primary_logo())
    write(os.path.join(SITE_BRAND, "logo-horizontal.svg"), horizontal_logo())
    write(os.path.join(SITE_BRAND, "monogram.svg"), monogram())
    write(os.path.join(ROOT, "src", "static", "favicon.svg"), favicon())

    print("Brand files written to", OUT)


if __name__ == "__main__":
    main()
