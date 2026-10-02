# Cuts the 24 mascot poses out of source/thrive-mascot-sheet.png (source untouched).
# Background is removed by flood-filling the light card colour from the crop border; the sticker outline stops the fill,
# so white school shirts inside the outline stay. Crops stop just above each pose label.
from PIL import Image
from collections import deque
import os
HERE = os.path.dirname(os.path.abspath(__file__)); OUT = os.path.join(os.path.dirname(HERE), 'mascots')
sheet = Image.open(os.path.join(HERE, 'thrive-mascot-sheet.png')).convert('RGBA')
ROWS = [(132, 304), (348, 522), (564, 740), (782, 942)]            # (crop top, label top)
COLS = [[(12, 300), (300, 509), (509, 722)], [(728, 1006), (1006, 1205), (1205, 1438)]]
ANIMALS = [['tiger', 'rabbit'], ['cat', 'panda'], ['fox', 'owl'], ['turtle', 'deer']]
STATES = ['ready', 'think', 'happy']
is_bg = lambda p: min(p[:3]) >= 212 and max(p[:3]) - min(p[:3]) <= 30
os.makedirs(OUT, exist_ok=True)

R = 4   # gap-sealing radius: the fill may not pass within R px of a coloured pixel

def dilate(mask, w, h, r):
    out = bytearray(mask)
    for _ in range(r):
        src = bytes(out)
        for y in range(h):
            row = y * w
            for x in range(w):
                if not src[row + x] and ((x > 0 and src[row + x - 1]) or (x < w - 1 and src[row + x + 1]) or (y > 0 and src[row - w + x]) or (y < h - 1 and src[row + w + x])):
                    out[row + x] = 1
    return out

# measured name-tag widths (px from the crop's left edge); tag = pill body (y <= 47) + icon circle (x <= 64, y <= 58)
TAG_RIGHT = {'tiger': 184, 'rabbit': 184, 'cat': 160, 'panda': 166, 'fox': 158, 'owl': 168, 'turtle': 167, 'deer': 150}
TAG_BOTTOM = {'panda': 46, 'turtle': 50}   # default 52 (covers the pill's soft bottom edge)

def erase_tag(img, animal):
    right = TAG_RIGHT[animal]; px = img.load(); w, h = img.size; white = (254, 254, 251, 255)
    for y in range(0, TAG_BOTTOM.get(animal, 52)):
        for x in range(0, min(w, right)): px[x, y] = white
    # where the pill's rounded end touches the mascot (panda head, deer antler), remove only pill-coloured pixels
    pill = {'panda': lambda r, g, b: g > r + 35 and g > b + 35,
            'deer': lambda r, g, b: r > 205 and 100 < g < 200 and b < 110}.get(animal)
    if pill:
        for y in range(0, 54):
            for x in range(0, min(w, right + 32)):
                r, g, b, _ = px[x, y]
                if pill(r, g, b): px[x, y] = white
    for y in range(TAG_BOTTOM.get(animal, 52), 60):
        for x in range(0, 65): px[x, y] = white

def cut(img, title_box):
    if title_box: erase_tag(img, title_box)
    w, h = img.size; px = img.load()
    fg = bytearray(0 if is_bg(px[x, y]) else 1 for y in range(h) for x in range(w))
    wall = dilate(fg, w, h, R)
    reach = bytearray(w * h); q = deque()
    for x in range(w): q.append((x, 0))                       # seed top edge + upper sides only (shirts touch the bottom)
    for y in range(h - 30):
        q.append((0, y)); q.append((w - 1, y))
    while q:
        x, y = q.popleft(); i = y * w + x
        if reach[i] or wall[i]: continue
        reach[i] = 1
        for nx, ny in ((x + 1, y), (x - 1, y), (x, y + 1), (x, y - 1)):
            if 0 <= nx < w and 0 <= ny < h and not reach[ny * w + nx]: q.append((nx, ny))
    near = dilate(reach, w, h, R + 1)
    bg = bytearray(1 if near[i] and not fg[i] else 0 for i in range(w * h))
    # connected components of the foreground
    seen = bytearray(w * h); comps = []
    for y in range(h):
        for x in range(w):
            i = y * w + x
            if not bg[i] and not seen[i]:
                q = deque([(x, y)]); seen[i] = 1; pts = []
                while q:
                    cx, cy = q.popleft(); pts.append((cx, cy))
                    for nx, ny in ((cx + 1, cy), (cx - 1, cy), (cx, cy + 1), (cx, cy - 1)):
                        j = ny * w + nx
                        if 0 <= nx < w and 0 <= ny < h and not bg[j] and not seen[j]: seen[j] = 1; q.append((nx, ny))
                comps.append(pts)
    big = max(len(p) for p in comps)
    out = Image.new('RGBA', (w, h)); o = out.load()
    for pts in comps:
        if len(pts) < big * 0.01: continue
        xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
        if (min(xs) == 0 or max(xs) == w - 1) and len(pts) < big * 0.15: continue          # sliver of the neighbouring pose
        if max(ys) - min(ys) < 4 or max(xs) - min(xs) < 4: continue                      # leftover frame lines
        for x, y in pts: o[x, y] = px[x, y]
    # soften the outer edge: semi-transparent 1px rim where foreground touches background
    for y in range(h):
        for x in range(w):
            if o[x, y][3] and any(0 <= x + dx < w and 0 <= y + dy < h and o[x + dx, y + dy][3] == 0 for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                r, g, b, _ = o[x, y]; o[x, y] = (r, g, b, 170)
    return out.crop(out.getbbox())

for ri, (top, label) in enumerate(ROWS):
    for side in (0, 1):
        animal = ANIMALS[ri][side]
        for si, (x0, x1) in enumerate(COLS[side]):
            crop = sheet.crop((x0, top, x1, label))
            title = animal if si == 0 else None
            img = cut(crop, title)
            img.save(os.path.join(OUT, f'{animal}-{STATES[si]}.png'), optimize=True)
            print(animal, STATES[si], img.size)
