"""Build browser photo albums from the item-to-folder map in photo-albums.json.

Read source photos directly from a folder or ZIP outside the repository:
python scripts/prepare-photo-albums.py --source ITEM_ID PATH
Repeat --source for several albums. Albums without a supplied source retain
their validated existing browser images. Legacy originals/ folders are also
supported when present, but are not needed for publishing or retention.
Requires Pillow and pillow-heif. Albums with video_first_frame enabled also
require OpenCV (opencv-python). Originals and videos are unchanged.
"""
import argparse
import io
import json
import re
import tempfile
import zipfile
from pathlib import Path
from urllib.parse import quote
from urllib.parse import unquote

root = Path(__file__).resolve().parent.parent
photo_root = (root / 'resource/images/photos').resolve()
folders = json.loads((root / 'photo-albums.json').read_text(encoding='utf-8-sig'))
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--source', nargs=2, action='append', default=[], metavar=('ITEM_ID', 'PATH'),
                    help='Read an album directly from an external folder or ZIP, without copying originals into the repository.')
sources_by_item = dict(parser.parse_args().source)
unknown = sources_by_item.keys() - folders.keys()
if unknown:
    raise ValueError(f'Unknown album IDs: {sorted(unknown)}')
manifest = root / 'photo-albums.js'
existing = json.loads(manifest.read_text(encoding='utf-8').split('export const photoAlbums = ', 1)[1].rstrip(';\n')) if manifest.exists() else {}
extensions = {'.jpg', '.jpeg', '.heic', '.heif', '.png', '.webp'}


def natural_key(file):
    return [int(part) if part.isdigit() else part for part in re.split(r'(\d+)', file.name.lower())]


albums = {}
for item, setting in folders.items():
    relative = setting if isinstance(setting, str) else setting['folder']
    include_video = isinstance(setting, dict) and setting.get('video_first_frame', False)
    folder = (root / relative).resolve()
    if folder == photo_root or not folder.is_relative_to(photo_root):
        raise ValueError(f'Album folder must be inside resource/images/photos/: {relative}')
    originals = (folder / 'originals').resolve()
    output = (folder / 'web').resolve()
    if not originals.is_relative_to(photo_root) or not output.is_relative_to(photo_root):
        raise ValueError(f'Album subfolder is outside the photo directory: {relative}')
    source_path = Path(sources_by_item[item]).resolve() if item in sources_by_item else originals
    if not source_path.exists():
        if item in sources_by_item or item not in existing:
            raise FileNotFoundError(f'Provide --source {item} PATH to a source folder or ZIP.')
        album = existing[item]
        for photo in album:
            target = (root / unquote(photo['src'])).resolve()
            if target.parent != output or not target.is_file():
                raise ValueError(f'Missing or invalid existing browser image: {photo["src"]}')
        albums[item] = album
        print(f'{item}: retained {len(album)} existing browser images')
        continue
    from PIL import Image, ImageOps
    from pillow_heif import register_heif_opener
    register_heif_opener()
    supported = extensions | ({'.mp4'} if include_video else set())
    archive = zipfile.ZipFile(source_path) if source_path.is_file() and source_path.suffix.lower() == '.zip' else None
    if archive:
        sources = [Path(n) for n in archive.namelist() if not n.endswith('/') and '__MACOSX' not in Path(n).parts and not Path(n).name.startswith('._') and Path(n).suffix.lower() in supported]
    else:
        if not source_path.is_dir():
            raise ValueError(f'Source must be a directory or ZIP: {source_path}')
        sources = [p for p in source_path.rglob('*') if p.is_file() and p.suffix.lower() in supported]
    sources = sorted(sources, key=natural_key)
    names = [p.stem.lower() + ('-first-frame.jpg' if p.suffix.lower() == '.mp4' else '.jpg') for p in sources]
    if len(names) != len(set(names)):
        raise ValueError(f'Duplicate photo stems in {originals}')
    output.mkdir(parents=True, exist_ok=True)
    album = []
    for source, name in zip(sources, names):
        if source.suffix.lower() == '.mp4':
            import cv2
            temporary = tempfile.TemporaryDirectory() if archive else None
            video_path = source
            if archive:
                video_path = Path(temporary.name) / source.name
                video_path.write_bytes(archive.read(source.as_posix()))
            capture = cv2.VideoCapture(str(video_path))
            try:
                capture.set(cv2.CAP_PROP_ORIENTATION_AUTO, 1)
                success, frame = capture.read()
                if not success:
                    raise ValueError(f'Could not decode the first video frame: {source}')
                image = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            finally:
                capture.release()
                if temporary:
                    temporary.cleanup()
        else:
            with Image.open(io.BytesIO(archive.read(source.as_posix())) if archive else source) as original:
                image = ImageOps.exif_transpose(original).convert('RGB')
        image.thumbnail((1600, 1600), Image.Resampling.LANCZOS)
        target = output / name
        image.save(target, quality=88, optimize=True, progressive=True)
        album.append({
            'src': quote(target.relative_to(root).as_posix(), safe='/'),
            'width': image.width, 'height': image.height,
        })
    albums[item] = album
    if archive:
        archive.close()
    print(f'{item}: {len(album)} photos from {relative}')

(root / 'photo-albums.js').write_text(
    '// Generated by scripts/prepare-photo-albums.py from photo-albums.json.\n'
    + 'export const photoAlbums = ' + json.dumps(albums, ensure_ascii=False, indent=2) + ';\n',
    encoding='utf-8')
print(f'Prepared {sum(map(len, albums.values()))} photos across {len(albums)} item albums.')
