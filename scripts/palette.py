"""Analyse colorimétrique de media-source/ (photos + images extraites des vidéos).
Usage : python scripts/palette.py  -> couleurs dominantes (k-means) en hexadécimal, avec leur poids."""
import glob, os, colorsys
import numpy as np
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), '..', 'media-source')
files = glob.glob(os.path.join(ROOT, 'photos', '*')) + glob.glob(os.path.join(ROOT, 'frames', '*.jpg'))
px = []
for f in files:
    try:
        im = Image.open(f).convert('RGB'); im.thumbnail((120, 120))
        px.append(np.asarray(im).reshape(-1, 3))
    except Exception as e:
        print('ignore', f, e)
X = np.concatenate(px).astype(float)
rng = np.random.default_rng(0)
X = X[rng.choice(len(X), min(60000, len(X)), replace=False)]

def kmeans(X, k, it=30):
    C = X[rng.choice(len(X), k, replace=False)]
    for _ in range(it):
        lab = ((X[:, None] - C[None]) ** 2).sum(-1).argmin(1)
        C = np.array([X[lab == i].mean(0) if (lab == i).any() else C[i] for i in range(k)])
    return C, np.bincount(lab, minlength=k) / len(X)

C, w = kmeans(X, 12)
print(f'{len(files)} images analysées')
for c, p in sorted(zip(C, w), key=lambda t: -t[1]):
    h, l, s = colorsys.rgb_to_hls(*(c / 255))
    print(f"#{int(c[0]):02x}{int(c[1]):02x}{int(c[2]):02x}  {p*100:5.1f}%  teinte={h*360:5.0f}° sat={s:.2f} lum={l:.2f}")
