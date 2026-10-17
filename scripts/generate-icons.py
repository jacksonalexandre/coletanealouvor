"""
Gera o logo do topo e os ícones (favicon, iPhone, PWA) a partir da arte
original em src/assets/logo-source.jpg: um círculo sobre fundo cinza, que vira
transparente.

    python3 -m pip install pillow
    python3 scripts/generate-icons.py
"""
from pathlib import Path
from PIL import Image, ImageDraw

root = Path(__file__).resolve().parent.parent
src = root / "src" / "assets" / "logo-source.jpg"
public = root / "public"
img = Image.open(src).convert("RGB")
w, h = img.size
px = img.load()
bg = px[20, h // 2]  # cinza do fundo (a imagem tem uma moldura clara de ~10 px por fora)

def is_bg(p, tol=24):
    return all(abs(a - b) <= tol for a, b in zip(p, bg))

# Limites do círculo: primeira/última coluna e linha que não são fundo, no meio da imagem.
cy, cx = h // 2, w // 2
left = next(x for x in range(20, w) if not is_bg(px[x, cy]))
right = next(x for x in range(w - 20, -1, -1) if not is_bg(px[x, cy]))
top = next(y for y in range(20, h) if not is_bg(px[cx, y]))
bottom = next(y for y in range(h - 20, -1, -1) if not is_bg(px[cx, y]))
print("fundo", bg, "círculo x", left, right, "y", top, bottom)

size = max(right - left, bottom - top) + 1
ccx, ccy = (left + right) / 2, (top + bottom) / 2
r = size / 2 - 1.5  # um pouco para dentro: borda sem halo cinza
box = (round(ccx - size / 2), round(ccy - size / 2), round(ccx - size / 2) + size, round(ccy - size / 2) + size)
crop = img.crop(box).convert("RGBA")

# Máscara circular com antisserrilhado (desenhada 4x maior e reduzida).
k = 4
mask = Image.new("L", (size * k, size * k), 0)
ImageDraw.Draw(mask).ellipse((size * k / 2 - r * k, size * k / 2 - r * k, size * k / 2 + r * k, size * k / 2 + r * k), fill=255)
mask = mask.resize((size, size), Image.LANCZOS)
crop.putalpha(mask)

def scaled(n):
    return crop.resize((n, n), Image.LANCZOS)

def save(img, path):
    img.save(path, optimize=True)

save(scaled(256), root / "src" / "assets" / "logo.png")
for n in (16, 32, 48, 192, 512):
    save(scaled(n), public / (f"favicon-{n}.png" if n <= 48 else f"icon-{n}.png"))
scaled(256).save(public / "favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (64, 64)])

# iPhone e ícone "maskable" (Android) não usam transparência: fundo da cor do app,
# com o logo dentro da área segura (80% no maskable).
theme = (11, 15, 25, 255)
for name, n, frac in (("apple-touch-icon.png", 180, 0.9), ("icon-maskable-512.png", 512, 0.8)):
    canvas = Image.new("RGBA", (n, n), theme)
    m = round(n * frac)
    canvas.alpha_composite(scaled(m), ((n - m) // 2, (n - m) // 2))
    save(canvas.convert("RGB"), public / name)

print("ok: logo e ícones gerados")
