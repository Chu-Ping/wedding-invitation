"""Prepare the cabinet cutscene locally with FFmpeg; leave the source unchanged.

python scripts/prepare-cabinet-video.py PATH_TO_MOV --ffmpeg PATH_TO_FFMPEG
"""
import argparse
import subprocess
from pathlib import Path

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('source', type=Path)
parser.add_argument('--ffmpeg', default='ffmpeg')
args = parser.parse_args()
source = args.source.resolve(strict=True)
output = Path(__file__).resolve().parent.parent / 'resource/video'
output.mkdir(exist_ok=True)
video = output / 'cabinet-doors.mp4'
poster = output / 'cabinet-doors-poster.jpg'
# Convert the iPhone HLG HDR recording to SDR before modest color adjustments.
# Crop 15% from each side, retaining the central 70% (896 x 720 output).
filters = (
    'zscale=t=linear:npl=100,format=gbrpf32le,zscale=p=bt709,'
    'tonemap=tonemap=mobius:desat=0,zscale=t=bt709:m=bt709:r=tv,'
    'format=yuv420p,eq=contrast=1.08:brightness=0.025:saturation=1.10:gamma=1.04,'
    'scale=1280:-2,crop=iw*0.70:ih:iw*0.15:0,setpts=0.5*(PTS-STARTPTS),fps=30'
)
subprocess.run([
    args.ffmpeg, '-y', '-hide_banner', '-loglevel', 'error',
    '-ss', '11', '-t', '11', '-i', str(source), '-map', '0:v:0',
    '-an', '-sn', '-dn', '-map_metadata', '-1', '-map_chapters', '-1',
    '-vf', filters, '-c:v', 'libx264', '-preset', 'medium', '-crf', '20',
    '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709', '-color_trc', 'bt709',
    '-colorspace', 'bt709', '-movflags', '+faststart', str(video),
], check=True)
subprocess.run([
    args.ffmpeg, '-y', '-hide_banner', '-loglevel', 'error', '-i', str(video),
    '-frames:v', '1', '-q:v', '2', str(poster),
], check=True)
print(f'Prepared {video.name}: seconds 11-22, 2x speed, 15% cropped from each side.')
