# Génère les déclinaisons responsives des images de public/ (Pillow requis : pip install pillow).
# À relancer après l'ajout d'une réalisation : python scripts/image-variants.py
from pathlib import Path
from PIL import Image

PUBLIC = Path(__file__).resolve().parent.parent / 'public'
SUFFIXES = ('-150', '-300', '-400', '-600', '-800')


def variant(src: Path, width: int, quality: int = 78) -> None:
    im = Image.open(src)
    if im.width <= width:
        return
    out = src.with_name(f'{src.stem}-{width}.webp')
    im.resize((width, round(im.height * width / im.width)), Image.LANCZOS).save(out, 'WEBP', quality=quality, method=6)
    print(f'{out.relative_to(PUBLIC)}  {out.stat().st_size / 1024:.1f} KiB')


# Réalisations : vignettes 400 et 600 px, en plus du 800 et de l'original 1600
for src in sorted((PUBLIC / 'images' / 'realisations').glob('*.webp')):
    if not src.stem.endswith(SUFFIXES):
        for w in (400, 600):
            variant(src, w)

# Logo du hero (affiché à 200–300 px CSS)
for w in (300, 400, 600):
    variant(PUBLIC / 'logo_kps.webp', w, quality=85)

# Logo de l'en-tête (affiché à 150 px CSS au plus)
variant(PUBLIC / 'logo-kps.webp', 150, quality=85)
