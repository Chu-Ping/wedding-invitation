# Dependencies and assets

## Supplied music

- `resource/sound/Joanna_Wang_-_Just_The_Two_Of_Us_(mp3.pm).mp3`:
  user-supplied recording, played locally without modification. No Spotify or
  SoundCloud dependency. This recording retains its own rights and is not
  covered by the open-source dependency licenses below.

## Three.js 0.180.0

- Source: https://github.com/mrdoob/three.js/tree/r180
- Distribution: https://cdn.jsdelivr.net/npm/three@0.180.0/
- License: MIT; full notice retained in `vendor/three/LICENSE`.
- Locally bundled modules: renderer/core, GLTFLoader, OrbitControls,
  BufferGeometryUtils, RoomEnvironment.
- Purpose: render the supplied GLB, provide camera controls and environment lighting.
- No runtime CDN, cloud generation service, framework, or build step is required.

## Supplied assets

- `resource/video/cabinet-doors.mp4` and its JPEG poster are prepared locally from
  the user-supplied `IMG_5353.MOV`: source seconds 11–22, double speed, HDR-to-SDR
  conversion, brightness/contrast/saturation adjustments, and a 15% crop from each
  side. The original recording is unchanged and not bundled.

- `resource/images/props/card-en.png` is the user-supplied English invitation
  card, copied without modification from `Vintage Cat Wedding Celebration Poster (1).png`.
  `resource/images/props/card-ch.jpeg` is the replacement Chinese card, copied
  without modification from the supplied 20:54:06 WhatsApp JPEG.

- The `metal_pitcher`, `dotted_mug`, `festival`, `berlin`, `malta`, and `czechia`
  folders under `resource/images/photos/` contain 56 additional user-supplied
  still photos and three companion MP4 clips copied from the named ZIP archives.
  JPEG playback copies are generated locally; originals and archives are unchanged.
  The Friends ZIP was copied to `friends/originals/` but remains unlinked at the
  user's request. All original-source folders are ignored by Git.

- `resource/images/photos/coffee_dripper/`, `white_storage_jar/`, and
  `photo_frame/`: 31 user-supplied photos copied unchanged into `originals/`
  from their corresponding ZIP archives. Local browser JPEGs are in `web/`.
  Source ZIPs remain unchanged in Downloads; source files stay ignored by Git.

- `resource/images/photos/cabinet_top/originals/` and `beer_can/originals/`:
  unchanged copies of the user-supplied Cabinet top and beer can ZIP contents.
  There are 26 still photos and three companion MP4 clips. `web/` folders hold
  locally converted JPEGs, up to 1600 pixels with orientation applied and EXIF
  omitted. Only JPEG copies are displayed. Source archives remain in Downloads;
  originals are ignored by Git. Existing Pillow/pillow-heif preparation tools
  below are reused; no additional browser dependency is introduced.

- `espresso.optimized.glb`, `pegboard.optimized.glb`, `shelf.optimized.glb`,
  `grinder/grinder.optimized.glb`, and
  `display_shelf/left/cabinet-left.optimized.glb` under `resource/model/`:
  locally simplified, texture-resized, Meshopt-compressed versions of the five
  user-supplied originals. These are the current runtime models; original GLBs
  stay locally without modification and are ignored by Git. They retain the
  source models' licensing requirements. Statistics are in
  `resource/model/optimization-report.json`.

- `resource/images/props/Voxel cluster of roasted coffee beans.png` and `Chunky voxel coffee mug.png`: user-supplied reward images, displayed without modification. Reward copy comes from the user-supplied UTF-8 files under `resource/text/coffee_bean/` and `coffee_mug/`.

- `resource/images/photos/`: user-supplied numbered photo sets 1–17. `photos/web/` holds resized JPEG gallery copies with orientation applied and EXIF omitted; source files are unchanged.

- `resource/images/main_scene/*.jpg`: user-supplied room and element photographs.
- `resource/images/main_scene/whole_scene_cartoon.png`: user-supplied cartoon room backdrop.
- `resource/images/opening_door/IMG_*.jpg`: earlier user-supplied door reference
  sequence, now unused and ignored. Obsolete JPEG playback copies were removed;
  source photos are unchanged.
- `resource/images/cat/0.jpg` through `12.jpg`: user-supplied cat sequence. `cat/web/` contains resized JPEG playback copies; originals are unchanged.
- `resource/model/espresso.glb`: user-supplied model, used without modification.
- `resource/model/pegboard.glb`: user-supplied pegboard model, used without modification.
- `resource/model/grinder/Meshy_AI_Morning_Grind_Setup_1018174904_texture.glb`: user-supplied Grinder model, used without modification; accompanying JPGs are reference photos.
- `resource/model/shelf.glb`: user-supplied wall-shelves model, used without modification.
- `resource/model/display_shelf/left/*.glb` and `right/Meshy_*.glb`: original user-supplied shelf models, retained without modification; accompanying JPGs are references.
- `resource/model/display_shelf/top/Meshy_*.glb`: original user-supplied cabinet-top model, retained without modification; `top/1.jpg` is a reference.
- `top/cabinet-top.optimized.glb` and `right/cabinet-right.optimized.glb` under `resource/model/display_shelf/`: locally generated, simplified copies of the supplied models, with smaller JPEG textures and Meshopt geometry compression. They retain the source assets' licensing requirements.
- TODO before publishing: record the model's Meshy generation plan, applicable
  license, and any required attribution for each model. The GLB metadata does not specify a license.

## Optional local video preparation

- FFmpeg 9.0.2 (GPL-enabled build), https://ffmpeg.org/, used locally by
  `scripts/prepare-cabinet-video.py`. No FFmpeg binary is shipped with the site.
- imageio-ffmpeg 0.8.1 (BSD-2-Clause), https://github.com/imageio/imageio-ffmpeg,
  supplies the local encoder used in this workspace. It is not a browser dependency.

## Optional local Chinese copy audit

Chinese copy was audited locally with opencc-python-reimplemented 0.1.7,
Apache-2.0: https://github.com/yichen0831/opencc-python. It is an authoring tool
only; no conversion library is shipped to or required by guests' browsers.

## Optional local photo preparation

- Pillow 13.0.0, MIT-CMU: https://github.com/python-pillow/Pillow
- pillow-heif 1.8.1, BSD-3-Clause: https://github.com/bigcat88/pillow_heif
- OpenCV 4.8.1, Apache-2.0: https://github.com/opencv/opencv/blob/4.8.1/LICENSE
- Used locally by `scripts/prepare-photo-albums.py` (and the earlier `prepare-shelf-photos.py`) to prepare supplied photos. OpenCV is optional, used only to extract the first decoded MP4 frame for albums enabling `video_first_frame`. These tools are not bundled into or required by the browser experience. pillow-heif's native decoding dependencies and their notices are listed in its distribution's `LICENSES_bundled.txt`.

## Meshoptimizer 1.0.1

- Source: https://github.com/zeux/meshoptimizer
- License: MIT; full notice in `vendor/meshoptimizer/LICENSE.md`.
- `vendor/meshoptimizer/meshopt_decoder.js` is the unmodified `meshopt_decoder.mjs` distribution, renamed for JavaScript MIME compatibility with the local Python HTTP server. Its embedded WebAssembly decoder loads locally and decodes the two optimized GLBs.
- The encoder and simplifier are optional local preparation tools, not browser dependencies.

## Optional local model preparation

- glTF Transform core/functions/extensions 4.5.0, MIT: https://github.com/donmccurdy/glTF-Transform
- Meshoptimizer 1.0.1, MIT, as above.
- Pillow 10.1.0 (HPND) resizes the model textures using `scripts/resize-model-texture.py`; newer Pillow distributions use MIT-CMU.
- `scripts/optimize-cabinet-models.mjs` uses these tools locally. No model upload, cloud processing, or runtime Node.js dependency is required.
