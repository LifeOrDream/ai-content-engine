#!/usr/bin/env python3
"""
render_card.py — render a YouTube THUMBNAIL or a CTA END-CARD with PIL.

Two modes:
  --mode thumbnail : a hero image (cover-cropped) + a big bold 1-4 word hook
                     (heavy stroke + shadow, brand orange) on a darkened third,
                     with the minebtc.fun badge small in a corner. 1280x720.
  --mode endcard   : a branded call-to-action card (dark/hero bg + badge + CTA
                     lines) to append to feature videos.

Follows the high-CTR rules: one subject, <=4 words, high contrast, legible at
mobile size. Best-effort: any failure exits non-zero so the Node caller can
fall back. Requires python3 + Pillow.
"""
import argparse, os, sys
from PIL import Image, ImageDraw, ImageFont, ImageFilter

ORANGE = (247, 147, 26)
WHITE = (255, 255, 255)
NEAR_BLACK = (10, 10, 14)


def cover(img, W, H):
    """Scale + center-crop img to exactly WxH (fill, no bars)."""
    iw, ih = img.size
    scale = max(W / iw, H / ih)
    nw, nh = max(1, int(iw * scale)), max(1, int(ih * scale))
    img = img.resize((nw, nh), Image.LANCZOS)
    x, y = (nw - W) // 2, (nh - H) // 2
    return img.crop((x, y, x + W, y + H))


def wrap_lines(draw, text, font, max_w, max_lines):
    """Greedy word-wrap; return list of lines or None if it can't fit max_lines."""
    words = text.split()
    lines, cur = [], ""
    for w in words:
        trial = (cur + " " + w).strip()
        if draw.textlength(trial, font=font) <= max_w or not cur:
            cur = trial
        else:
            lines.append(cur)
            cur = w
        if len(lines) > max_lines:
            return None
    if cur:
        lines.append(cur)
    return lines if len(lines) <= max_lines else None


def fit_font(draw, text, font_path, max_w, max_h, max_lines=3, start=240):
    """Largest font size whose wrapped text fits within max_w x max_h."""
    for size in range(start, 22, -4):
        try:
            font = ImageFont.truetype(font_path, size)
        except Exception:
            font = ImageFont.load_default()
            return font, [text], size
        lines = wrap_lines(draw, text, font, max_w, max_lines)
        if not lines:
            continue
        lh = (font.getbbox("Ag")[3] - font.getbbox("Ag")[1]) * 1.16
        if lh * len(lines) <= max_h:
            return font, lines, size
    font = ImageFont.truetype(font_path, 28)
    return font, wrap_lines(draw, text, font, max_w, max_lines) or [text], 28


def draw_block(draw, lines, font, cx, top, fill, stroke=8, anchor="ma", shadow=True):
    lh = (font.getbbox("Ag")[3] - font.getbbox("Ag")[1]) * 1.16
    y = top
    for ln in lines:
        if shadow:
            draw.text((cx + 4, y + 5), ln, font=font, fill=(0, 0, 0), anchor=anchor)
        draw.text((cx, y), ln, font=font, fill=fill, anchor=anchor,
                  stroke_width=stroke, stroke_fill=(0, 0, 0))
        y += lh
    return y


def load_hero(path, W, H, darken):
    if path and os.path.exists(path):
        try:
            base = cover(Image.open(path).convert("RGB"), W, H)
        except Exception:
            base = Image.new("RGB", (W, H), NEAR_BLACK)
    else:
        base = Image.new("RGB", (W, H), NEAR_BLACK)
    if darken > 0:
        ov = Image.new("RGB", (W, H), (0, 0, 0))
        base = Image.blend(base, ov, darken)
    return base


def paste_badge(img, badge_path, target_w, pos):
    if not (badge_path and os.path.exists(badge_path)):
        return
    try:
        b = Image.open(badge_path).convert("RGBA")
        scale = target_w / b.width
        b = b.resize((int(b.width * scale), int(b.height * scale)), Image.LANCZOS)
        img.paste(b, pos, b)
    except Exception:
        pass


def render_thumbnail(a):
    W, H = a.width, a.height
    base = load_hero(a.hero, W, H, 0.18).convert("RGBA")
    # Bottom-left scrim for text legibility (gradient up from the bottom).
    scrim = Image.new("L", (1, H), 0)
    for y in range(H):
        t = max(0, (y - H * 0.4) / (H * 0.6))
        scrim.putpixel((0, y), int(205 * (t ** 1.3)))
    scrim = scrim.resize((W, H))
    black = Image.new("RGBA", (W, H), (0, 0, 0, 255))
    base = Image.composite(black, base, scrim)
    draw = ImageDraw.Draw(base)
    text = (a.text or "").strip().upper()
    if text:
        margin = int(W * 0.05)
        max_w = int(W * 0.82)
        font, lines, _ = fit_font(draw, text, a.font, max_w, int(H * 0.5), max_lines=3,
                                  start=int(H * 0.34))
        lh = (font.getbbox("Ag")[3] - font.getbbox("Ag")[1]) * 1.16
        top = H - margin - lh * len(lines)
        # left-anchored block
        y = top
        for ln in lines:
            draw.text((margin + 4, y + 5), ln, font=font, fill=(0, 0, 0), anchor="la")
            draw.text((margin, y), ln, font=font, fill=ORANGE, anchor="la",
                      stroke_width=max(6, int(font.size * 0.06)), stroke_fill=(0, 0, 0))
            y += lh
    paste_badge(base, a.badge, int(W * 0.24), (int(W - W * 0.24 - W * 0.03), int(H * 0.04)))
    base.convert("RGB").save(a.out, "PNG")


def rounded_thumb(img, size, radius, border):
    """Square cover-crop → rounded-rect with an orange border."""
    img = cover(img.convert("RGB"), size, size).convert("RGBA")
    mask = Image.new("L", (size, size), 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=255)
    out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    out.paste(img, (0, 0), mask)
    if border > 0:
        ImageDraw.Draw(out).rounded_rectangle(
            [border // 2, border // 2, size - border // 2 - 1, size - border // 2 - 1],
            radius=radius, outline=ORANGE, width=border)
    return out


def render_endcard_beasts(a):
    """End-card with a centered row of HashBeast thumbnails + badge + CTA lines."""
    W, H = a.width, a.height
    grad = Image.new("RGB", (1, H))
    for y in range(H):
        t = y / H
        grad.putpixel((0, y), (int(8 + 16 * t), int(8 + 8 * t), int(14 + 22 * t)))
    base = grad.resize((W, H)).convert("RGBA")

    paths = [p for p in (a.beasts or "").split(",") if p and os.path.exists(p)]
    n = max(1, len(paths))
    gap = int(W * 0.018)
    S = int(H * 0.30)
    while n * S + (n - 1) * gap > W * 0.92 and S > 48:
        S -= 8
    x = (W - (n * S + (n - 1) * gap)) // 2
    y = int(H * 0.10)
    border = max(3, int(S * 0.035))
    for p in paths:
        try:
            th = rounded_thumb(Image.open(p), S, int(S * 0.16), border)
            sh = Image.new("RGBA", (W, H), (0, 0, 0, 0))
            sh.paste(th, (x + 6, y + 9), th)
            base = Image.alpha_composite(base, sh.filter(ImageFilter.GaussianBlur(9)))
            base.paste(th, (x, y), th)
        except Exception:
            pass
        x += S + gap

    draw = ImageDraw.Draw(base)
    cx = W // 2
    bw = int(W * 0.40)
    by = y + S + int(H * 0.05)
    paste_badge(base, a.badge, bw, ((W - bw) // 2, by))
    ctas = [c for c in [a.cta1, a.cta2, a.cta3] if c]
    big_idx = 1 if len(ctas) >= 2 else 0
    cy = by + int(bw * 170 / 820) + int(H * 0.055)
    for i, c in enumerate(ctas):
        is_big = (i == big_idx)
        size = int(H * (0.105 if is_big else 0.06))
        try:
            font = ImageFont.truetype(a.font, size)
        except Exception:
            font = ImageFont.load_default()
        fill = ORANGE if is_big else WHITE
        draw.text((cx + 3, cy + 4), c.upper(), font=font, fill=(0, 0, 0), anchor="ma")
        draw.text((cx, cy), c.upper(), font=font, fill=fill, anchor="ma",
                  stroke_width=max(3, int(size * 0.05)), stroke_fill=(0, 0, 0))
        cy += int(size * 1.35)
    base.convert("RGB").save(a.out, "PNG")


def render_endcard(a):
    if a.beasts:
        return render_endcard_beasts(a)
    W, H = a.width, a.height
    base = load_hero(a.hero, W, H, 0.62 if a.hero else 1.0).convert("RGBA")
    if not a.hero:
        # brand-dark vertical gradient
        grad = Image.new("RGB", (1, H))
        for y in range(H):
            t = y / H
            grad.putpixel((0, y), (int(8 + 16 * t), int(8 + 8 * t), int(14 + 22 * t)))
        base = grad.resize((W, H)).convert("RGBA")
    draw = ImageDraw.Draw(base)
    # badge (wordmark) upper-center
    bw = int(W * 0.5)
    paste_badge(base, a.badge, bw, ((W - bw) // 2, int(H * 0.14)))
    cx = W // 2
    ctas = [c for c in [a.cta1, a.cta2, a.cta3] if c]
    # primary CTA (line 2 if present, else line 1) gets the big orange treatment
    big_idx = 1 if len(ctas) >= 2 else 0
    y = int(H * 0.46)
    for i, c in enumerate(ctas):
        is_big = (i == big_idx)
        size = int(H * (0.12 if is_big else 0.072))
        try:
            font = ImageFont.truetype(a.font, size)
        except Exception:
            font = ImageFont.load_default()
        fill = ORANGE if is_big else WHITE
        draw.text((cx + 3, y + 4), c.upper(), font=font, fill=(0, 0, 0), anchor="ma")
        draw.text((cx, y), c.upper(), font=font, fill=fill, anchor="ma",
                  stroke_width=max(4, int(size * 0.05)), stroke_fill=(0, 0, 0))
        y += int(size * 1.4)
    base.convert("RGB").save(a.out, "PNG")


def render_overlay(a):
    """Transparent CTA layer to composite OVER a video: bottom scrim + badge + CTA."""
    W, H = a.width, a.height
    base = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    scrim = Image.new("L", (1, H), 0)
    for y in range(H):
        t = max(0.0, (y - H * 0.42) / (H * 0.58))
        scrim.putpixel((0, y), int(210 * (t ** 1.4)))
    scrim = scrim.resize((W, H))
    base = Image.composite(Image.new("RGBA", (W, H), (0, 0, 0, 255)), base, scrim)
    bw = int(W * 0.28)
    paste_badge(base, a.badge, bw, ((W - bw) // 2, int(H * 0.05)))
    draw = ImageDraw.Draw(base)
    cx = W // 2
    ctas = [c for c in [a.cta1, a.cta2, a.cta3] if c]
    big_idx = 1 if len(ctas) >= 2 else 0
    sizes = [int(H * (0.105 if i == big_idx else 0.058)) for i in range(len(ctas))]
    cy = H - int(H * 0.07) - sum(int(s * 1.35) for s in sizes)
    for i, c in enumerate(ctas):
        size = sizes[i]
        try:
            font = ImageFont.truetype(a.font, size)
        except Exception:
            font = ImageFont.load_default()
        fill = ORANGE if i == big_idx else WHITE
        draw.text((cx + 3, cy + 4), c.upper(), font=font, fill=(0, 0, 0), anchor="ma")
        draw.text((cx, cy), c.upper(), font=font, fill=fill, anchor="ma",
                  stroke_width=max(3, int(size * 0.05)), stroke_fill=(0, 0, 0))
        cy += int(size * 1.35)
    base.save(a.out, "PNG")  # keep alpha


def main():
    p = argparse.ArgumentParser()
    p.add_argument("--mode", required=True, choices=["thumbnail", "endcard", "overlay"])
    p.add_argument("--out", required=True)
    p.add_argument("--width", type=int, default=1280)
    p.add_argument("--height", type=int, default=720)
    p.add_argument("--text", default="")
    p.add_argument("--hero", default="")
    p.add_argument("--beasts", default="")  # comma-sep image paths (end-card beast row)
    p.add_argument("--badge", default="")
    p.add_argument("--font", default="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf")
    p.add_argument("--cta1", default="MINE YOUR HASHBEAST")
    p.add_argument("--cta2", default="minebtc.fun")
    p.add_argument("--cta3", default="▶ SUBSCRIBE + FOLLOW")
    a = p.parse_args()
    if not (a.font and os.path.exists(a.font)):
        a.font = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
    try:
        if a.mode == "thumbnail":
            render_thumbnail(a)
        elif a.mode == "overlay":
            render_overlay(a)
        else:
            render_endcard(a)
    except Exception as e:
        print(f"render_card failed: {e}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
