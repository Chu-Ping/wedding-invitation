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
- `resource/images/opening_door/IMG_*.jpg`: user-supplied door sequence. `opening_door/web/` contains resized JPEG playback copies; originals are unchanged.
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

## Optional local photo preparation

- Pillow 13.0.0, MIT-CMU: https://github.com/python-pillow/Pillow
- pillow-heif 1.8.1, BSD-3-Clause: https://github.com/bigcat88/pillow_heif
- Used locally by `scripts/prepare-shelf-photos.py` to prepare the supplied HEIC/JPEG photos. These tools are not bundled into or required by the browser experience. pillow-heif's native decoding dependencies and their notices are listed in its distribution's `LICENSES_bundled.txt`.

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
