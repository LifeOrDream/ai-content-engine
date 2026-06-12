#!/usr/bin/env python3
"""
Assemble a clean, tight, TRANSPARENT, SQUARE, looping APNG from a generated
frame strip. Robust + color-agnostic so the two slicing failure modes never
recur:

  - bg of ANY color (magenta OR black OR white ...): removed by flood-filling
    border-connected background, so we don't depend on the model using magenta
    and internal dark outlines inside the character are preserved.
  - frame-edge bleed (a limb from a neighbouring cell): removed by dropping any
    blob that touches the cell's left/right edge or is tiny, while keeping legit
    detached items near the character (e.g. the dBTC block).

Then: union-bbox tight crop -> square canvas (DP container) -> optimized APNG
with per-frame disposal=BACKGROUND + blend=SOURCE (clean frame replacement, no
accumulation).

Usage:
  assemble_anim.py <strip.png> <out.apng> <frame_count> <chroma_hex> <dur_ms> <boomerang:0|1> <target>
"""
import sys
import numpy as np
from scipy import ndimage
from PIL import Image

strip_path, out_path = sys.argv[1], sys.argv[2]
N = int(sys.argv[3])
chroma = sys.argv[4].lstrip("0x").lstrip("#")
dur_ms = int(sys.argv[5])
boomerang = sys.argv[6] == "1"
target = int(sys.argv[7])

strip = Image.open(strip_path).convert("RGBA")
W, H = strip.size
cw = W // N


def remove_bg(arr):
    """Make the border-connected background (any uniform-ish color) transparent."""
    rgb = arr[..., :3].astype(np.int32)
    h, w = arr.shape[:2]
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    bg = np.median(border, axis=0)
    dist = np.abs(rgb - bg).sum(2)
    bgish = dist < 90
    # magenta is the requested chroma; kill it anywhere (the character is never magenta)
    mag = (rgb[..., 0] > 110) & (rgb[..., 1] < 125) & (rgb[..., 2] > 110)
    cand = bgish | mag
    lbl, n = ndimage.label(cand)
    if n:
        bl = np.unique(np.concatenate([lbl[0], lbl[-1], lbl[:, 0], lbl[:, -1]]))
        bl = bl[bl > 0]
        arr[np.isin(lbl, bl), 3] = 0  # border-connected bg -> transparent
    arr[mag, 3] = 0                    # any stray magenta -> transparent
    return arr


def keep_main(arr):
    """Keep the character blob + legit detached center items; drop edge/tiny strays."""
    op = arr[..., 3] > 40
    lbl, n = ndimage.label(op)
    if n <= 1:
        return arr
    sizes = ndimage.sum(op, lbl, range(1, n + 1))
    main = int(np.argmax(sizes)) + 1
    total = arr.shape[0] * arr.shape[1]
    for i in range(1, n + 1):
        if i == main:
            continue
        comp = lbl == i
        touches_lr = comp[:, 0].any() or comp[:, -1].any()
        if sizes[i - 1] < 0.005 * total or touches_lr:
            arr[comp, 3] = 0
    return arr


def clean(cell):
    arr = np.array(cell)
    arr = remove_bg(arr)
    arr = keep_main(arr)
    return Image.fromarray(arr, "RGBA")


frames = [clean(strip.crop((i * cw, 0, (i + 1) * cw, H))) for i in range(N)]
frames = [f for f in frames if f.getbbox()]
if not frames:
    print("ERROR: all frames empty after clean", file=sys.stderr); sys.exit(1)

# union bounding box across all frames (stable framing)
boxes = [f.getbbox() for f in frames]
l = min(b[0] for b in boxes); t = min(b[1] for b in boxes)
r = max(b[2] for b in boxes); btm = max(b[3] for b in boxes)
pad = max(2, int(0.03 * max(r - l, btm - t)))
l = max(0, l - pad); t = max(0, t - pad)
r = min(frames[0].width, r + pad); btm = min(frames[0].height, btm + pad)
frames = [f.crop((l, t, r, btm)) for f in frames]

# place on a SQUARE target canvas (DP container), char filling ~94%, centered
fw, fh = frames[0].size
fill = 0.94
scale = min((target * fill) / fh, (target * fill) / fw)
nw, nh = max(1, round(fw * scale)), max(1, round(fh * scale))
ox, oy = (target - nw) // 2, (target - nh) // 2
sq = []
for f in frames:
    r_img = f.resize((nw, nh), Image.NEAREST)
    c = Image.new("RGBA", (target, target), (0, 0, 0, 0))
    c.alpha_composite(r_img, (ox, oy))
    sq.append(c)
frames = sq

order = frames + frames[-2:0:-1] if (boomerang and len(frames) >= 3) else frames
order[0].save(
    out_path, format="PNG", save_all=True, append_images=order[1:],
    duration=dur_ms, loop=0, disposal=1, blend=0, optimize=True,
)
print(f"OK {out_path} {target}x{target} (char {nw}x{nh}) frames={len(order)}")
