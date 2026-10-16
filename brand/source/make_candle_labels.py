"""Generate the RORO LUX candle jar labels (print-ready, outlined SVG).

Layout follows the approved structural reference (brand/source/label-reference.png):
a white sticker with a grey keyline, RORO LUX, the candle name and notes between
two rules, then the wax, features, net weight and origin lines.

All lettering is shaped with HarfBuzz (proper kerning) and converted to vector
outlines, so the file prints identically everywhere with no fonts installed.

Outputs, per candle: brand/labels/candle-<slug>.svg and an exact-size vector
PDF (candle-<slug>.pdf) for the printer.

Requirements:  pip install fonttools brotli uharfbuzz cairosvg
Run from the repository root:  python3 brand/source/make_candle_labels.py
"""

import io
import json
import os
import subprocess

import cairosvg
import uharfbuzz as hb
from fontTools.pens.boundsPen import BoundsPen
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.ttLib import TTFont

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
FONTS = os.path.join(ROOT, "brand", "source", "fonts")
OUT = os.path.join(ROOT, "brand", "labels")

# Physical size of the sticker for the 200 ml jar: 48 x 72 mm, pending final
# confirmation with the printer. The artboard is drawn in 1000 x 1500 units
# (the reference's proportions) and scales to this size.
LABEL_MM = (48.0, 72.0)

# Text printed on every candle label. Confirmed by RORO LUX: hand-poured in
# Kenya, 100% natural soy wax. The fonts below are approved — do not substitute.
CLAIM_WAX = "100% NATURAL SOY WAX"
FEATURES = ["Hand poured", "Clean burning", "Eco-conscious"]
NET_WEIGHT = "NET WT: 200G / 7.05 OZ"
ORIGIN = "MADE IN KENYA"

INK = "#0B0B0B"
SOFT_INK = "#202020"
NOTES_BROWN = "#462B17"
RULE_GREY = "#7E7E7E"
CENTRE_X = 501.0


class Font:
    def __init__(self, filename):
        tt = TTFont(os.path.join(FONTS, filename))
        tt.flavor = None
        buf = io.BytesIO()
        tt.save(buf)
        self.tt = TTFont(io.BytesIO(buf.getvalue()))
        self.hb_font = hb.Font(hb.Face(buf.getvalue()))
        self.upm = self.tt["head"].unitsPerEm
        self.glyph_set = self.tt.getGlyphSet()
        self.order = self.tt.getGlyphOrder()

    def layout(self, text, size, tracking_em=0.0):
        """Shaped glyphs as (glyph_name, x, y) in px at `size`, plus ink bounds."""
        buf = hb.Buffer()
        buf.add_str(text)
        buf.guess_segment_properties()
        hb.shape(self.hb_font, buf, {"kern": True, "liga": True})
        scale = size / self.upm
        x = 0.0
        glyphs = []
        for i, (info, pos) in enumerate(zip(buf.glyph_infos, buf.glyph_positions)):
            glyphs.append((self.order[info.codepoint], x + pos.x_offset * scale, -pos.y_offset * scale))
            x += pos.x_advance * scale
            if i < len(buf.glyph_infos) - 1:
                x += tracking_em * size
        bounds = BoundsPen(self.glyph_set)
        for name, gx, gy in glyphs:
            self.glyph_set[name].draw(TransformPen(bounds, (scale, 0, 0, -scale, gx, gy)))
        return glyphs, bounds.bounds, scale

    def path(self, text, size, tracking_em, x, baseline):
        glyphs, _, scale = self.layout(text, size, tracking_em)
        pen = SVGPathPen(self.glyph_set)
        for name, gx, gy in glyphs:
            self.glyph_set[name].draw(TransformPen(pen, (scale, 0, 0, -scale, x + gx, baseline + gy)))
        return pen.getCommands()

    def fit_width(self, text, ink_width):
        """Font size giving `ink_width` with no extra tracking."""
        _, b, _ = self.layout(text, 100)
        return 100 * ink_width / (b[2] - b[0]), 0.0

    def fit(self, text, ink_height, ink_width=None):
        """Font size giving `ink_height`, and tracking giving `ink_width`."""
        _, b, _ = self.layout(text, 100)
        size = 100 * ink_height / (b[3] - b[1])
        tracking = 0.0
        if ink_width is not None and len(text) > 1:
            _, b, _ = self.layout(text, size)
            tracking = (ink_width - (b[2] - b[0])) / ((len(text) - 1) * size)
        return size, tracking


SERIF_DISPLAY = Font("cormorant-garamond-latin-600-normal.woff2")
NAME = Font("kurale-latin-400-normal.woff2")
SANS = Font("montserrat-latin-400-normal.woff2")
TEXT = Font("source-serif-4-latin-400-normal.woff2")

# Sizes measured from the reference (ink boxes in artboard units):
#   RORO LUX            caps 286-323, width 309
#   Stay Grounded       ink 516-555, width 260
#   Rain, Moss & ...    ink 635-665, width 375
#   100% NATURAL ...    caps 829-848, width 432
#   Hand poured         ink 933-959, width 153
#   NET WT ...          ink 1114-1140, width 411
#   MADE IN KENYA       caps 1204-1223, width 280
BRAND = (SERIF_DISPLAY, *SERIF_DISPLAY.fit("RORO LUX", 37, 309))
NAME_STYLE = (NAME, *NAME.fit_width("Stay Grounded", 260))
NOTES_STYLE = (NAME, *NAME.fit_width("Rain, Moss & White Musk", 375))
WAX_STYLE = (SANS, *SANS.fit("100% NATURAL SOY WAX", 19, 432))
FEATURE_STYLE = (TEXT, *TEXT.fit("Hand poured", 26, 153))
NET_STYLE = (SANS, *SANS.fit("NET WT: 200G / 7.05 OZ", 26, 411))
ORIGIN_STYLE = (SANS, *SANS.fit("MADE IN KENYA", 19, 280))


def centred_text(style, text, ink_top, color, centre=CENTRE_X):
    font, size, tracking = style
    _, b, _ = font.layout(text, size, tracking)
    x = centre - (b[2] - b[0]) / 2 - b[0]
    baseline = ink_top - b[1]
    return f'<path d="{font.path(text, size, tracking, x, baseline)}" fill="{color}"/>'


def ink_top_for(style, reference_text, reference_top, text):
    """Keep the baseline of `text` where the reference line's baseline was."""
    font, size, tracking = style
    _, ref_b, _ = font.layout(reference_text, size, tracking)
    _, b, _ = font.layout(text, size, tracking)
    return reference_top - ref_b[1] + b[1]


def label_svg(product):
    W, H = 1000, 1500
    parts = [
        f'<rect width="{W}" height="{H}" fill="#FFFFFF"/>',
        f'<rect x="47" y="44" width="908" height="1373" fill="none" stroke="{RULE_GREY}" stroke-width="6"/>',
        centred_text(BRAND, "RORO LUX", 286, INK),
        f'<rect x="{CENTRE_X - 236}" y="455" width="472" height="4" fill="{RULE_GREY}"/>',
        centred_text(NAME_STYLE, product["name"], ink_top_for(NAME_STYLE, "Stay Grounded", 516, product["name"]),
                     product["colorHex"]),
        centred_text(NOTES_STYLE, product["labelNotes"],
                     ink_top_for(NOTES_STYLE, "Rain, Moss & White Musk", 635, product["labelNotes"]), NOTES_BROWN),
        f'<rect x="{CENTRE_X - 236}" y="719" width="472" height="4" fill="{RULE_GREY}"/>',
        centred_text(WAX_STYLE, CLAIM_WAX, 829, SOFT_INK),
    ]

    # Three features, evenly spaced around the centre line.
    font, size, tracking = FEATURE_STYLE
    widths = [font.layout(t, size, tracking)[1] for t in FEATURES]
    widths = [b[2] - b[0] for b in widths]
    gap = 48
    total = sum(widths) + gap * (len(FEATURES) - 1)
    x = CENTRE_X - total / 2
    for text, w in zip(FEATURES, widths):
        top = ink_top_for(FEATURE_STYLE, "Hand poured", 933, text)
        parts.append(centred_text(FEATURE_STYLE, text, top, SOFT_INK, centre=x + w / 2))
        x += w + gap

    parts.append(centred_text(NET_STYLE, NET_WEIGHT, ink_top_for(NET_STYLE, "NET WT: 200G / 7.05 OZ", 1114, NET_WEIGHT), SOFT_INK))
    parts.append(centred_text(ORIGIN_STYLE, ORIGIN, 1204, SOFT_INK))

    w_mm, h_mm = LABEL_MM
    title = f'{product["name"]} — candle label'
    return (
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}" width="{w_mm}mm" height="{h_mm}mm" '
        f'role="img" aria-label="{title}"><title>{title}</title>{"".join(parts)}</svg>\n'
    )


def load_products():
    script = "import('./src/data/products.js').then(m => process.stdout.write(JSON.stringify(m.products)))"
    out = subprocess.run(["node", "-e", script], cwd=ROOT, capture_output=True, text=True, check=True)
    return json.loads(out.stdout)


def main():
    os.makedirs(OUT, exist_ok=True)
    for product in load_products():
        path = os.path.join(OUT, f"candle-{product['slug']}.svg")
        with open(path, "w", encoding="utf-8") as fh:
            fh.write(label_svg(product))
        cairosvg.svg2pdf(url=path, write_to=path[:-4] + ".pdf")
    print("Candle labels written to", OUT)


if __name__ == "__main__":
    main()
