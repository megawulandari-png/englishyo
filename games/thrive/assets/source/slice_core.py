# Slices source/thrive-core-sprite-sheet.png into individual transparent PNG/WebP assets.
# The source sheet is never modified. Boxes are (x0, y0, x1, y1) in sheet pixels; each crop is tightened to its alpha bounds.
from PIL import Image
import os
SRC = os.path.join(os.path.dirname(__file__), 'thrive-core-sprite-sheet.png')
OUT = os.path.dirname(os.path.dirname(__file__))
sheet = Image.open(SRC).convert('RGBA')
B = {
 'objects/laptop': (30, 45, 292, 236), 'objects/phone': (278, 52, 418, 236), 'objects/tablet': (420, 60, 626, 236),
 'objects/desk': (636, 16, 944, 236), 'objects/chair': (960, 20, 1124, 244),
 'objects/glass': (40, 248, 160, 396), 'objects/bottle': (198, 228, 306, 396), 'objects/lunchbox': (318, 240, 536, 408),
 'objects/plant': (540, 224, 704, 400), 'objects/clock': (708, 240, 864, 396), 'objects/notebook': (874, 244, 1058, 400),
 'objects/pencil-case': (1064, 256, 1252, 396),
 'scenes/study-room': (36, 400, 516, 708),
 'ui/btn-play': (530, 404, 752, 498), 'ui/btn-learn': (752, 404, 976, 498), 'ui/btn-glossary': (978, 404, 1201, 498), 'ui/btn-cp': (1203, 404, 1428, 498),
 'ui/btn-progress': (530, 500, 752, 596), 'ui/btn-sound': (752, 500, 976, 596), 'ui/btn-sources': (978, 500, 1201, 596), 'ui/btn-developer': (1203, 500, 1428, 596),
 'ui/round-play': (590, 598, 708, 716), 'ui/round-replay': (718, 598, 838, 716), 'ui/round-slow': (852, 598, 972, 716),
 'ui/round-sound': (980, 598, 1100, 716), 'ui/round-sound-alt': (1106, 598, 1226, 716), 'ui/round-mute': (1234, 598, 1354, 716),
 'worlds/w1-care': (20, 704, 180, 842), 'worlds/w2-click': (184, 704, 344, 842), 'worlds/w3-nusantara': (346, 704, 524, 842),
 'worlds/w4-together': (528, 704, 716, 842), 'worlds/w5-place': (720, 704, 896, 842), 'worlds/w6-ready': (910, 704, 1100, 842),
 'badges/faith': (20, 842, 140, 964), 'badges/citizenship': (142, 842, 262, 964), 'badges/critical': (264, 842, 384, 964),
 'badges/creative': (386, 842, 506, 964), 'badges/collab': (508, 842, 624, 964), 'badges/independence': (626, 842, 744, 964),
 'badges/health': (748, 842, 866, 964), 'badges/communication': (866, 842, 984, 964),
 'feedback/star-sparkle': (20, 962, 134, 1076), 'feedback/wrong': (136, 962, 234, 1076), 'feedback/idea': (236, 956, 316, 1076),
 'feedback/star': (316, 962, 410, 1076), 'ui/lock': (410, 962, 500, 1076), 'ui/unlock': (506, 962, 620, 1076),
 'ui/panel-checklist': (618, 962, 832, 1078), 'ui/panel-wood': (830, 948, 1044, 1078), 'feedback/star-gold': (1040, 962, 1136, 1076),
 'badges/coin-leaf': (1136, 956, 1246, 1076), 'ui/speech-bubble': (1246, 924, 1446, 1066),
}
from collections import deque
def keep_main(c):
    # drop small slivers of neighbouring sprites: keep components >= 4% of the largest one
    a = c.split()[3].load(); w, h = c.size; seen = bytearray(w * h); comps = []
    for y in range(h):
        for x in range(w):
            if a[x, y] > 12 and not seen[y * w + x]:
                q = deque([(x, y)]); seen[y * w + x] = 1; pts = []
                while q:
                    cx, cy = q.popleft(); pts.append((cx, cy))
                    for nx, ny in ((cx+1, cy), (cx-1, cy), (cx, cy+1), (cx, cy-1)):
                        if 0 <= nx < w and 0 <= ny < h and not seen[ny * w + nx] and a[nx, ny] > 12:
                            seen[ny * w + nx] = 1; q.append((nx, ny))
                comps.append(pts)
    big = max(len(p) for p in comps); out = c.copy(); o = out.load()
    for pts in comps:
        if len(pts) < big * 0.04:
            for x, y in pts: o[x, y] = (0, 0, 0, 0)
    return out
for name, box in B.items():
    c = keep_main(sheet.crop(box)); bb = c.split()[3].point(lambda v: 255 if v > 12 else 0).getbbox()
    if bb: c = c.crop(bb)
    path = os.path.join(OUT, name)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    c.save(path + '.png', optimize=True)
    print(name, c.size)
