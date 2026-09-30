"""Build public/portrait.webp from the source photo.

Usage: python3 scripts/portrait.py IMG_0160.JPG
Full colour, as photographed (human override of the earlier duotone, 2026-09-30).
Cropped to head and shoulders (drops the bystander at the right edge); EXIF is not carried over.
"""
import sys
from PIL import Image, ImageOps

CROP = (240, 520, 1180, 1840)   # in source pixels (1318x2344)
WIDTH = 480                     # 2x the largest display width (240px)

img = ImageOps.exif_transpose(Image.open(sys.argv[1])).convert("RGB").crop(CROP)
img = img.resize((WIDTH, round(WIDTH * img.height / img.width)), Image.LANCZOS)
img.save("public/portrait.webp", quality=82, method=6)  # no exif= argument, so metadata is dropped
print(img.size)
