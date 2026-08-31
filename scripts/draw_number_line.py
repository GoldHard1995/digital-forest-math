"""Draw the reusable −8 to ＋8 number line used in the first game stage.

The scale is computed from NUMBER_LINE_MIN/MAX so the tick positions stay
auditable.  The SVG is used by the web component; the PDF and PNG are kept as
teacher-review assets.
"""

from html import escape
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.cidfonts import UnicodeCIDFont
from reportlab.pdfgen import canvas


NUMBER_LINE_MIN = -8
NUMBER_LINE_MAX = 8
WIDTH = 1360
HEIGHT = 180
MARGIN_X = 64
AXIS_Y = 78
TICK_HEIGHT = 14

OUT = Path(__file__).resolve().parents[1] / "public"


def x_for(value: int) -> float:
    usable = WIDTH - 2 * MARGIN_X
    return MARGIN_X + (value - NUMBER_LINE_MIN) * usable / (NUMBER_LINE_MAX - NUMBER_LINE_MIN)


def signed_label(value: int) -> str:
    if value > 0:
        return f"＋{value}"
    if value < 0:
        return f"−{abs(value)}"
    return "0"


def build_svg() -> str:
    ticks = []
    for value in range(NUMBER_LINE_MIN, NUMBER_LINE_MAX + 1):
        x = x_for(value)
        ticks.append(
            f'<line x1="{x:.2f}" y1="{AXIS_Y - TICK_HEIGHT / 2:.2f}" '
            f'x2="{x:.2f}" y2="{AXIS_Y + TICK_HEIGHT / 2:.2f}" class="tick" />'
        )
        ticks.append(
            f'<text x="{x:.2f}" y="{AXIS_Y + 40}" class="label" '
            f'text-anchor="middle">{escape(signed_label(value))}</text>'
        )
    return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {WIDTH} {HEIGHT}" role="img" aria-labelledby="title desc">
  <title id="title">由 −8 到 ＋8 的數線</title>
  <desc id="desc">每一格代表一個單位，向右為正方向，向左為負方向。</desc>
  <style>
    .axis {{ stroke: #173f32; stroke-width: 4; stroke-linecap: round; }}
    .tick {{ stroke: #173f32; stroke-width: 2; }}
    .label {{ fill: #173f32; font-family: 'Noto Sans TC', 'PingFang TC', sans-serif; font-size: 24px; }}
    .zero {{ font-weight: 700; }}
  </style>
  <line x1="{MARGIN_X - 28}" y1="{AXIS_Y}" x2="{WIDTH - MARGIN_X + 28}" y2="{AXIS_Y}" class="axis" />
  <polygon points="{MARGIN_X - 38},{AXIS_Y} {MARGIN_X - 20},{AXIS_Y - 10} {MARGIN_X - 20},{AXIS_Y + 10}" fill="#173f32" />
  <polygon points="{WIDTH - MARGIN_X + 38},{AXIS_Y} {WIDTH - MARGIN_X + 20},{AXIS_Y - 10} {WIDTH - MARGIN_X + 20},{AXIS_Y + 10}" fill="#173f32" />
  {''.join(ticks)}
  <text x="{WIDTH / 2}" y="{HEIGHT - 10}" class="label" text-anchor="middle">向左為負方向　　向右為正方向</text>
</svg>
'''


def draw_pdf(path: Path) -> None:
    pdfmetrics.registerFont(UnicodeCIDFont("STSong-Light"))
    page_width = WIDTH
    page_height = HEIGHT
    pdf = canvas.Canvas(str(path), pagesize=(page_width, page_height))
    pdf.setFont("STSong-Light", 24)
    pdf.setStrokeColorRGB(23 / 255, 63 / 255, 50 / 255)
    pdf.setLineWidth(4)
    pdf.line(MARGIN_X - 28, AXIS_Y, WIDTH - MARGIN_X + 28, AXIS_Y)
    pdf.setFillColorRGB(23 / 255, 63 / 255, 50 / 255)
    pdf.line(MARGIN_X - 38, AXIS_Y, MARGIN_X - 20, AXIS_Y - 10)
    pdf.line(MARGIN_X - 38, AXIS_Y, MARGIN_X - 20, AXIS_Y + 10)
    pdf.line(WIDTH - MARGIN_X + 38, AXIS_Y, WIDTH - MARGIN_X + 20, AXIS_Y - 10)
    pdf.line(WIDTH - MARGIN_X + 38, AXIS_Y, WIDTH - MARGIN_X + 20, AXIS_Y + 10)
    pdf.setLineWidth(2)
    for value in range(NUMBER_LINE_MIN, NUMBER_LINE_MAX + 1):
        x = x_for(value)
        pdf.line(x, AXIS_Y - TICK_HEIGHT / 2, x, AXIS_Y + TICK_HEIGHT / 2)
        pdf.drawCentredString(x, AXIS_Y - 40, signed_label(value))
    pdf.drawCentredString(WIDTH / 2, 10, "向左為負方向　　向右為正方向")
    pdf.save()


def find_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    candidates = [
        "/System/Library/Fonts/STHeiti Medium.ttc",
        "/System/Library/Fonts/SFNS.ttf",
        "/System/Library/Fonts/SFNSMono.ttf",
    ]
    for candidate in candidates:
        try:
            return ImageFont.truetype(candidate, size=size, index=0)
        except OSError:
            continue
    return ImageFont.load_default()


def draw_png(path: Path) -> None:
    image = Image.new("RGBA", (WIDTH, HEIGHT), (255, 255, 255, 0))
    draw = ImageDraw.Draw(image)
    ink = (23, 63, 50, 255)
    font = find_font(24)
    draw.line((MARGIN_X - 28, AXIS_Y, WIDTH - MARGIN_X + 28, AXIS_Y), fill=ink, width=4)
    draw.polygon(((MARGIN_X - 38, AXIS_Y), (MARGIN_X - 20, AXIS_Y - 10), (MARGIN_X - 20, AXIS_Y + 10)), fill=ink)
    draw.polygon(((WIDTH - MARGIN_X + 38, AXIS_Y), (WIDTH - MARGIN_X + 20, AXIS_Y - 10), (WIDTH - MARGIN_X + 20, AXIS_Y + 10)), fill=ink)
    for value in range(NUMBER_LINE_MIN, NUMBER_LINE_MAX + 1):
        x = int(round(x_for(value)))
        draw.line((x, AXIS_Y - TICK_HEIGHT / 2, x, AXIS_Y + TICK_HEIGHT / 2), fill=ink, width=2)
        label = signed_label(value)
        bounds = draw.textbbox((0, 0), label, font=font)
        draw.text((x - (bounds[2] - bounds[0]) / 2, AXIS_Y + 24), label, fill=ink, font=font)
    image.save(path, dpi=(300, 300))


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    (OUT / "number-line-8.svg").write_text(build_svg(), encoding="utf-8")
    draw_pdf(OUT / "number-line-8.pdf")
    draw_png(OUT / "number-line-8.png")
    print(f"Generated number line assets in {OUT}")


if __name__ == "__main__":
    main()
