"""Internal Pillow helper for optimize-cabinet-models.mjs; binary stdin/stdout."""
import io
import sys
from PIL import Image

with Image.open(io.BytesIO(sys.stdin.buffer.read())) as source:
    image = source.convert('RGB')
    image.thumbnail((1024, 1024), Image.Resampling.LANCZOS)
    # Keep full chroma resolution, including for normal and material maps.
    image.save(sys.stdout.buffer, format='JPEG', quality=85, subsampling=0, optimize=True)
