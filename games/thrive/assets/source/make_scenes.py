# Derives web-ready scene images from the untouched source map.
from PIL import Image, ImageFilter, ImageEnhance
import os
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
m = Image.open(os.path.join(HERE, 'thrive-world-map.png')).convert('RGB')
m.save(os.path.join(ROOT, 'worlds', 'world-map.webp'), quality=84, method=6)
bg = m.resize((724, 543), Image.LANCZOS).filter(ImageFilter.GaussianBlur(7))
bg = ImageEnhance.Brightness(bg).enhance(1.08)
bg.save(os.path.join(ROOT, 'scenes', 'bg-blur.webp'), quality=70, method=6)
r = Image.open(os.path.join(ROOT, 'scenes', 'study-room.png'))
print(m.size, os.path.getsize(os.path.join(ROOT, 'worlds', 'world-map.webp')) // 1024, 'KB')
