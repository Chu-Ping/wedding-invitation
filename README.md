# Interactive wedding invitation

## About

A browser-based wedding invitation designed as a small interactive experience. Guests should be able to open it on a desktop computer in a web browser without installing an app. The current prototype lets guests click objects in a room photograph, zoom into their locations, and explore photo or 3D detail views. Further animation and story cutscenes remain open.

## Project status

**09 / Photo shelves** opens `resource/model/shelf.optimized.glb` with the shared zoom,
3D controls, exposure, and real room photo comparison. `shelf.jpg` is retained
as a reference photo.

The shelf's 17 visible contents are individual buttons: three items on top,
five cups/saucers on the middle shelf, five storage items below, and four hanging
cups. Hover or focus a matching button below the viewer for a warm gold glow;
click an object or activate its button to open its numbered photo set. The selected
item remains highlighted until another is selected. Dragging still rotates the
model without selecting an item. Shelf boards and the rail remain scenery.
Each set opens in a modal with slightly tilted photo cards, uneven offsets, and
white borders. Only one set is shown at a time; Close photos, Escape, or a click
outside the popup returns to the shelf and restores focus. The shelf view is
preserved. Small screens stack the cards with the same casual arrangement.

The 68 source photos are in `resource/images/photos/`, numbered in sets **1-28**.
The 17 shelf buttons map to albums left to right, top to bottom, using
`shelf-albums.js`. Sets are combined in the order below; each set's photos stay
in numeric filename order. Cabinet albums have their own mappings. Larger
albums use a scrolling, irregular grid; narrow screens stack the photos.
`shelf-photos.js` lists local browser JPEGs up to 1600 pixels, with orientation
applied and EXIF omitted, in `resource/images/photos/web/`. Originals remain.
Only the selected album loads, with retry for individual failed images.
Albums containing exactly four photos use one row of four on desktop. Narrow
screens stack the photos for readability; other album layouts stay unchanged.

| Shelf item | Source sets |
| --- | --- |
| 1 | 1 |
| 2 | 2, 3 |
| 3 | 4 |
| 4 | 5, 6, 7 |
| 5 | 8, 9 |
| 6 | 10, 11 |
| 7 | 12, 13 |
| 8 | 14, 15 |
| 9 | 16, 17 |
| 10 | 18, 20 |
| 11 | 19, 21 |
| 12 | 22 |
| 13 | 23 |
| 14 | 24, 26 |
| 15 | 25 |
| 16 | 27 |
| 17 | 28 |

Verified in Chrome: all 17 albums match the requested set order and photo
filenames, covering all 68 photos. Vase (8), can (18), and frame (7) albums retain
their mappings. Keyboard opening, Escape/focus return, and narrow scrolling
layouts passed without uncaught JavaScript errors.

To rebuild after adding or renaming source photos, install optional Python
packages `Pillow` and `pillow-heif`, then run
`python scripts/prepare-shelf-photos.py` from the project root. This also removes
obsolete generated JPEG copies. These packages are only for asset preparation;
previewing and publishing still need no build step or Python packages.

The GLB contains one fused mesh. `shelf-interactions.js` defines calibrated
local-space regions and extracts surface overlays for the glow; the supplied GLB
is unchanged. Regions follow rotation and zoom and use the nearest visible model
surface for picking. Boundaries are approximate around touching objects, and need
recalibration if the model is replaced. No extra dependency or idle animation is used.

Room exploration follows this order: **Pegboard > Grinder > Espresso machine > Cabinet top >
Cabinet left > Cabinet right > Cabinet doors > Beneath the cabinet > Photo shelves**.
Only Pegboard starts available. Click its coffee bag to collect a coffee bean
and unlock Grinder; merely visiting Pegboard does not unlock it. Successfully
opening Grinder then unlocks Espresso machine. No extra grinder action is
required at this stage. Click
the espresso center button to collect a coffee mug and unlock Cabinet top. From
Cabinet top onward, successfully opening each detail view reveals the next room
hotspot and named button.
Locked elements have no hover effect, label, mouse target, or keyboard button.
Previously revealed elements remain available to revisit. A failed load or an
entry cancelled before the detail view opens does not advance progress. Collected
items and exploration progress last for the current page session; refreshing
starts again at Pegboard.

Reward assets are defined in `item-rewards.js`:

| Collected item | Image | Text | Unlocks |
| --- | --- | --- | --- |
| Coffee bean | `resource/images/props/Voxel cluster of roasted coffee beans.png` | `resource/text/coffee_bean/text` | Grinder |
| Coffee grounds | `resource/images/props/Voxel coffee grounds mound.png` | `resource/text/coffee_ground/text` | No additional progression gate |
| Coffee mug | `resource/images/props/Chunky voxel coffee mug.png` | `resource/text/coffee_mug/text` | Cabinet top |

The coffee mug requires the collected bean. Each acquisition uses a keyboard-
accessible popup with the original image and UTF-8 copy, preserved line breaks,
Close/Escape, and focus return. The model pauses while the popup is open.
An item is awarded only after its image and text load successfully. Bean and mug
copy must be nonempty. Coffee grounds allows an empty text file while its copy
is being written; the image is centered and the empty copy is hidden.
Failure offers retry; closing during loading cancels the award. Reopening an
already-collected item shows it again without duplicating inventory or advancing
extra steps. The rest of the room's sequence stays unchanged.

The scene prototype uses `whole_scene_cartoon.png` as the default room, with nine object
hotspots and a matching list of named buttons below it. Hover or keyboard-focus an
object to reveal its glow and name, then click to explore. Number badges are hidden
on the room image. The coffee cabinet, side-cabinet overview,
and plant have been removed; their original image files remain as references. The espresso machine zooms toward its supplied 3D model. Drag to
rotate or scroll to zoom. Choose **Back to room** or
press **Escape** to return. The model also supports arrow keys, +/−, and Home
while its viewer has keyboard focus. Reduced-motion preferences skip transitions.
Only the center espresso button is interactive. It glows warm gold on hover or
keyboard focus and awards the coffee mug when clicked; the other four have no hover or
click targets. A single Center button below the viewer provides keyboard access.
The halo follows the machine and is occluded from behind. Hover glow clears on
pointer exit, dragging, and leaving the viewer. The supplied mug image and text appear in a reward popup and unlock Cabinet top. The source GLB is unchanged; `espresso-glow.js` holds its calibration.

The display shelf has two additional 3D hotspots: **05 / Cabinet left**
and **06 / Cabinet right**, matching the supplied `left` and `right`
model folders. Both zoom into their area and fade into a rotatable model over
the lightly blurred room backdrop, with the same drag/scroll and keyboard interaction
as espresso. The full-shelf photo hotspot is removed. Button hover
glows are limited to the leftmost beer can in Cabinet left and the left photo
frame in Cabinet right; other objects remain scenery.

**02 / Grinder** opens
`resource/model/grinder/grinder.optimized.glb`
(about 1.61 MB, 179,998 triangles). It uses the existing grinder location in the
room, shared zoom, left framing, exposure, drag/scroll and keyboard interaction,
and real-photo comparison. The original model and reference photos are unchanged.
Collecting the bean reveals Grinder; successfully opening it reveals Espresso
machine. A failed or cancelled Grinder load does not advance the sequence.

The small silver button at the grinder's lower-right side opens the coffee grounds
image and `resource/text/coffee_ground/text`. Hover or keyboard focus gives it a
warm gold glow; the matching Grinder button below the viewer supports keyboard
activation. Text is re-read whenever the popup opens, preserving paragraphs.
Close/Escape returns to the model and restores focus. `grinder-interactions.js`
holds the button calibration; the original GLB is unchanged.

**01 / Pegboard** opens `resource/model/pegboard.optimized.glb` using the same zoom,
blurred room background, drag/scroll and keyboard interaction, and exposure as the other
models. The original `resource/images/main_scene/pegboard.jpg` stays as a reference.

The coffee bag on the pegboard is clickable. Hover it for a warm gold surface
glow and Coffee bag label, or focus/activate the matching Coffee bag button below
the viewer. Clicking collects a coffee bean, shows its supplied image and text,
and unlocks Grinder. Dragging rotates without selecting. The glow and picking follow the
left-shifted model and respect the board's occlusion. The original GLB is unchanged;
`pegboard-interactions.js` holds the bag calibration and reuses the shelf surface
interaction helper.

**04 / Cabinet top** opens the GLB in `resource/model/display_shelf/top/`, with
the same zoom, 3D controls, exposure, and real room photo comparison. Its former
detail photo, `side_cabinet_top.jpg`, remains a reference asset.

The cabinet object buttons open these albums in the listed order:

| Object | Album contents | Photos |
| --- | --- | --- |
| Cabinet top vase | Set 4, set 24 | 8 |
| Cabinet left's leftmost beer can | Set 6, set 8, `15-0`, `16-1`, set 18, set 20, set 21, set 23, set 25, set 28 | 18 |
| Cabinet right's left photo frame | Set 1 | 7 |

Each set includes every currently supplied photo in numeric filename order.
The other three beer cans remain scenery. These objects have warm hover/focus
and selection glow, matching keyboard buttons below their models, and the same
irregular photo cards with scrolling for larger albums. Narrow screens use one
column. Close/Escape restores model interaction and keyboard focus. Regions and
album mappings are in `cabinet-interactions.js`; source GLBs are unchanged.
The 17 shelf buttons use the grouped album mapping above, including newly added
photos in those source sets.

All seven models are framed to the left, shifted by 30% of their initial displayed
width to leave space on the right for future text. The camera projection applies
the shift, preserving orbit centers and ray-based object picking. The framing is
recomputed on entry, resize, and keyboard Home. Model text comes from the matching
file under `resource/text/` when supplied.

Model copy is authored as UTF-8 plain text. Photo shelves reads
`resource/text/photo_shelves/text` each time it opens, preserving paragraphs and
line breaks. The supplied copy about collected coffee beans, cups, and travel
memories appears on the right. Save edits there, then reopen Photo shelves (or
refresh the page) to display them.
On narrow screens, copy flows below the scene for readability. The copy is hidden
in room-image comparison and on return; photo popup behavior remains available.
Empty, missing, or failed text never blocks model loading or shows placeholders.

All current text files are mapped:

| Text file under `resource/text/` | Destination |
| --- | --- |
| `cabinet_top/text` | Cabinet top (empty files stay hidden) |
| `cabinet_left/text` | Cabinet left |
| `cabinet_right/text` | Cabinet right |
| `photo_shelves/text` | Photo shelves |
| `beneath_the_cabinet/text` | Below the cat animation |
| `cabinet_doors/text` | To the right of the card popup (below on narrow screens) |
| `coffee_bean/text` | Coffee bean reward popup |
| `coffee_ground/text` | Coffee grounds reward popup (empty copy stays hidden) |
| `coffee_mug/text` | Coffee mug reward popup |

The cat page reads `resource/text/beneath_the_cabinet/text` on entry and places
its copy below the animation window and playback controls. It preserves UTF-8
characters and line breaks and hides the copy on return or when another view
opens. Empty or failed text does not block animation playback.

For another model, add its copy under `resource/text/<folder>/text` and add a
`text` property with that relative path to the corresponding entry in
`scene-elements.js`. This explicit mapping keeps text attached to the intended
model, independent of list order. Text files are rendered literally, without HTML.

Every model detail view includes **Show room image / Show model** at the top
right, with **Back to room** directly below. Rotation, zoom, and reset buttons
and visible model instructions have been removed. Drag/scroll and keyboard
interaction remain available. The shelf photo buttons remain below the viewer. Image mode
shows only the same zoomed region of the real room photo (`whole_scene.jpg`),
sharply and without a cartoon image option. The photo decodes before image mode
opens. Switching back to 3D retains the real backdrop and its light blur. The model's rotation and
zoom are preserved while comparing. Back/Escape restores the main cartoon room.

Each hotspot first zooms toward its location in the room, then opens its assigned
model or animation. Zooms frame the selected area and keep the backdrop covering
the stage. Reduced motion skips the zoom. Back or Escape can cancel it at any time.
Marker **07 / Cabinet doors** zooms in and cuts to an 11-frame opening animation
at **6 fps** (about 1.83 seconds). It plays once and holds the final frame, with
Pause/Play and Replay controls. All frames load before playback to avoid gaps.
Reduced motion shows the closed-door frame until Play is selected. Playback
pauses when the tab is hidden and stops on return.
When the door animation finishes, `resource/images/props/card.jpeg` opens in an
image popup, growing over 700 ms from the center of the door image into its final
position while the background gently dims. The card decodes before the reveal;
reduced motion shows it immediately. `resource/text/cabinet_doors/text` appears
to the right of the card on desktop and below it on narrow screens. The UTF-8
file is re-read each opening, preserving paragraphs; empty or failed copy stays
hidden and the card still opens. Close photos, Escape, or a backdrop click returns to the final door
frame with focus restored. Replaying the animation opens the card again on
completion. Pausing or leaving early does not show it; with reduced motion,
press Play opening to run the animation first. Image loading failures offer retry.
Marker **08 / Beneath the cabinet** uses the same playback controls for a
13-frame cat animation at **2 fps** (about 6.5 seconds), in numeric order 0–12.
It automatically loops back to the first frame. Hovering over the cat image pauses it;
moving away resumes it only if it was playing before the hover. Manual pauses
stay paused. Each sequence is cached separately;
switching between markers 07 and 08 keeps their frames and aspect ratios correct.
Escape and **Back to room** work in every detail view and restore keyboard focus
to the control used to enter it. Photos load on demand, with retry on failure.

The story, final visual direction, and remaining interactions are still open.
See [`CREATIVE_BRIEF.md`](CREATIVE_BRIEF.md) for confirmed requirements.

## Current working style

Use the supplied block-style cartoon room as the main playground, with simple
point-and-click exploration. The current interface uses warm off-white/cream
surfaces, muted green-gray text, Georgia headings, system sans-serif controls,
hover highlights and labels, and rounded panels with subtle shadows. This is the
working prototype style; the final wedding theme and story are still TODO.

Each object gets an eased zoom of about 1.1 seconds before its detail view.
Photo views show the full individual image; photo shelves, pegboard, espresso, cabinet top, and both display-shelf areas use their supplied 3D models
over the selected zoomed room image with light `blur(2px)` on the background only.
Image comparison mode removes that blur and shows only the real room photo.
Reduced motion skips transitions. The visual baseline and remaining creative
decisions are recorded in `CREATIVE_BRIEF.md` under **Visual and audio direction**.

## Where to find images and models

Paths are relative to this project folder:

```text
resource/
  images/
    main_scene/
      whole_scene_cartoon.png   Default cartoon room backdrop (1448 × 1086)
      whole_scene.jpg           Real room image for comparison (4096 × 3072)
      espresso.jpg              Espresso reference photo
      shelf.jpg, pegboard.jpg   Individual object photos (plus the other JPGs)
      side_cabinet_*.jpg        Cabinet sections, door positions, and cat variant
    opening_door/
      IMG_*.jpg                Original 11-frame door-opening sequence
      web/IMG_*.jpg            Optimized playback copies, 900 × 1200
    cat/
      0.jpg ... 12.jpg         Original cat sequence, in numeric order
      web/0.jpg ... 12.jpg     Optimized playback copies, 1200 × 900
  model/
    espresso.optimized.glb     Current compressed espresso model
    pegboard.optimized.glb     Current compressed pegboard model
    shelf.optimized.glb        Current compressed photo-shelves model, marker 09
    display_shelf/
      left/*.glb              Left shelf grouping
      right/*.glb             Right shelf grouping
      top/*.glb               Cabinet-top grouping, marker 04
      left/*.jpg              Reference photos (not loaded by the scene)
      right/*.jpg             Reference photos (not loaded by the scene)
      top/1.jpg               Cabinet-top reference photo
```

Use `resource/model/` (singular) for 3D model files; GLB is the preferred download
format. Individual scene photos are in `resource/images/main_scene/`.
`scene-elements.js` maps the object photos and their room locations; `app.js`
loads the selected GLB. See **Room asset mapping** below for all current markers.
Use relative asset URLs in code rather than machine-specific Windows paths.

`.gitignore` keeps local source/reference images out of Git: original numbered
photos, original door/cat frames, model reference JPGs, and individual room
reference photos. The 98 browser image assets remain included: gallery and
animation `web/` copies, both room backdrops, reward images, and the card.
The 116 ignored images stay on disk; originals are still needed to rebuild
optimized copies and are not distributed by a fresh Git checkout.

## Instructions for an AI coding agent

Read [`AGENTS.md`](AGENTS.md) and [`CREATIVE_BRIEF.md`](CREATIVE_BRIEF.md) first. Then inspect the existing project and begin with a small, runnable browser prototype. Use only confirmed information; keep unknowns as TODOs and do not invent invitation details or creative decisions. Prefer HTML and CSS for the initial experience, adding JavaScript only where the interactions need it. Use open-source dependencies if any are needed.

## Preview and publishing

The intended guest experience is a link to a published website. Guests should not need the project source files or to deploy the project themselves. The hosting provider and publishing steps have not been chosen.

### Preview locally

From this project folder, run:

```powershell
python -m http.server 8000 --bind 127.0.0.1
```

Open **http://127.0.0.1:8000/** in a current desktop Chrome, Edge, or Firefox
with WebGL 2 enabled. Stop the server with Ctrl+C. If `python` is not on PATH,
use `py -m http.server 8000 --bind 127.0.0.1` instead.

Do not open `index.html` directly with a `file://` URL: module and GLB loading
require HTTP. Node.js, npm, Blender, and COLMAP are not needed for this prototype.
All runtime dependencies and assets are local; no streaming service is needed.

If an already-open preview stops responding after a photo collection update,
press Ctrl+Shift+R once to refresh cached modules. The expanded album manifest
and its consumers use revisioned URLs. Shelf albums load when opened rather
than during room startup, so an album-loading failure cannot prevent the room
hotspots from being created. Verified Pegboard entry against an older cached
17-set manifest, including the bean popup and Grinder unlock; all 17 current
grouped albums and the cabinet albums also passed in Chrome.

### Background music

The supplied MP3 at
`resource/sound/Joanna_Wang_-_Just_The_Two_Of_Us_(mp3.pm).mp3` plays locally.
`background-music.js` starts it at 30% volume on the first click or Enter/Space
interaction, then loops it. Native audio controls below the room provide play,
pause, seeking, and volume. If a browser blocks the initial attempt, use Play.
Interacting directly with the audio controls leaves playback to those controls.
A manual pause stays paused during exploration. One audio element remains mounted
through model views, animations, and popups; scene changes do not restart it.
Refreshing resets playback. The source is in `index.html`; no Spotify or
SoundCloud embed, SDK, external connection, or API credentials are used.

Verified in local Chrome: the MP3 loads with a duration of about 3:58, playback
advances after mouse and keyboard activation, loops at the end, and continues
through model views and reward popups. Manual pause persists across navigation;
the player fits a 390-pixel viewport without horizontal overflow.

Models load on demand: espresso is about 2.44 MB, pegboard 2.64 MB, photo
shelves 2.46 MB, grinder 1.61 MB, cabinet left 2.44 MB, cabinet top 4.06 MB,
and cabinet right 2.69 MB (decimal sizes).
A single renderer serves all seven, and loaded
models are cached for repeat visits. A loading message,
retry action, and return button remain available during loading or failure.
The 3D effect zooms the cartoon room and fades in the selected model over the same
zoomed room image, blurred to keep attention on the model. The canvas is
transparent; only the photo background is blurred. Returning restores the clear
cartoon room. The room is a flat image, and the model is not registered seamlessly
into that image.

### Optimized models

All seven model views load optimized GLBs. Every original is kept locally and
ignored by Git; the optimized files must be included when publishing.

| Model | Original / optimized MB | Original / optimized triangles |
| --- | --- | --- |
| Cabinet top | 138.66 / 4.06 | 4,323,986 / 399,996 |
| Cabinet right | 57.14 / 2.69 | 1,649,310 / 249,994 |
| Espresso machine | 32.35 / 2.44 | 849,822 / 249,988 |
| Pegboard | 36.09 / 2.64 | 989,038 / 299,978 |
| Photo shelves | 27.44 / 2.46 | 712,676 / 300,000 |
| Grinder | 16.54 / 1.61 | 385,184 / 179,998 |
| Cabinet left | 29.46 / 2.44 | 730,336 / 249,996 |

Each model uses three 1024-pixel JPEG textures (quality 85, full chroma), geometry
simplification, quantization, and Meshopt compression. Fine texture details are
softer. Model coordinates, framing, and interaction regions are preserved; no
new dependency was added. The five newly optimized models total 11.60 MB instead
of 141.88 MB (about 92% smaller). The decoder is local in `vendor/meshoptimizer/`.
Reports: `resource/model/optimization-report.json` (five new copies) and
`resource/model/display_shelf/optimization-report.json` (Cabinet top/right).

To rebuild from the locally retained originals, use Node.js 22+ and Python/Pillow:

```powershell
npm install --prefix .local-preview/model-tools --no-audit --no-fund @gltf-transform/core@4.5.0 @gltf-transform/functions@4.5.0 @gltf-transform/extensions@4.5.0 meshoptimizer@1.0.1
python -m pip install Pillow
node --max-old-space-size=6144 scripts/optimize-cabinet-models.mjs
node --max-old-space-size=6144 scripts/optimize-scene-models.mjs
```

The cabinet script exports the shared optimization pipeline; running it directly
rebuilds Cabinet top/right. The scene script rebuilds the other five. Both use
`scripts/resize-model-texture.py`, preserve originals, and decode each output to
verify its triangle count. Node and preparation packages are not needed to preview.
A fresh Git checkout contains the optimized assets; rebuilding requires the
locally retained originals.

Checked in Chrome with the compressed models: coffee bag and grounds rewards,
espresso center button, all 17 shelf surface clicks and exact grouped albums,
vase/can/frame photo links, keyboard/focus behavior, progression, narrow-screen
picking, real room comparison, cached re-entry, and all model views. Original
source hashes were unchanged; all seven optimized GLBs remain included by Git.

### Project files

- `index.html`, `styles.css`, `app.js`: scene layout, transitions, and interaction.
- `scene-elements.js`: object labels, bounds, marker positions, and photo mappings.
- `espresso-glow.js`: model-specific button positions and procedural glow overlays.
- `shelf-interactions.js`: 17 shelf item regions, surface glow, and object picking.
- `shelf-gallery.js`, `shelf-albums.js`, `shelf-photos.js`: modal galleries, grouped shelf albums, and generated source photo mapping.
- `scripts/prepare-shelf-photos.py`: optional local HEIC/JPEG conversion and manifest generation.
- `frame-animation.js`: shared elapsed-time playback: door at 6 fps, cat at 2 fps with hover pause.
- `resource/images/main_scene/whole_scene_cartoon.png`: default 4:3 cartoon backdrop.
- `resource/images/main_scene/whole_scene.jpg`: original real room image for comparison.
- `resource/model/espresso.optimized.glb`: current optimized espresso model.
- `resource/model/pegboard.optimized.glb`: current optimized pegboard model.
- `resource/model/display_shelf/left/` and `right/`: supplied shelf models and reference photos.
- `vendor/three/`: pinned Three.js 0.180.0 modules, licensed under MIT.
- `vendor/meshoptimizer/`: local Meshoptimizer 1.0.1 decoder, licensed under MIT.
- `scripts/optimize-cabinet-models.mjs`, `scripts/optimize-scene-models.mjs`, `scripts/resize-model-texture.py`: optional local model preparation.
- [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md): dependency sources and asset notes.

The hotspot coordinates are in `scene-elements.js`; photo zooms use these same
bounds. The espresso zoom focus and shared zoom logic are in `app.js`.
The backdrop keeps its full aspect ratio so those coordinates stay aligned as the
window resizes. The model is centered and framed automatically from its bounds.

### Room asset mapping

| Marker | Area | Detail asset(s) |
| --- | --- | --- |
| 01 | Pegboard | `resource/model/pegboard.optimized.glb`; `pegboard.jpg` remains a reference photo |
| 02 | Grinder | `resource/model/grinder/grinder.optimized.glb` |
| 03 | Espresso machine | `resource/model/espresso.optimized.glb`; `espresso.jpg` remains a reference photo |
| 04 | Cabinet top | `resource/model/display_shelf/top/cabinet-top.optimized.glb`; `side_cabinet_top.jpg` remains a reference |
| 05 | Cabinet left | `resource/model/display_shelf/left/cabinet-left.optimized.glb` |
| 06 | Cabinet right | `resource/model/display_shelf/right/cabinet-right.optimized.glb` |
| 07 | Cabinet doors | 11 frames from `resource/images/opening_door/web/`, ordered by original timestamp, at 6 fps |
| 08 | Beneath the cabinet | `resource/images/cat/web/0.jpg` through `12.jpg`, in numeric order, at 2 fps; hover to pause |
| 09 | Photo shelves | `resource/model/shelf.optimized.glb`; `shelf.jpg` remains a reference photo |

The named list and this mapping use the current order, numbered 01-09.
The cat animation uses the beneath-cabinet area. Earlier cabinet
door photos in `main_scene/` remain reference assets; marker 07 uses the new
`opening_door/` sequence. Playback copies preserve the original framing, use
900 × 1200 JPEGs at quality 90, and total about 2 MB; original photos are unchanged.
Cat playback copies use 1200 × 900 JPEGs at quality 90 and total about 2 MB.
Original cat photos and the earlier beneath-cabinet still photos are preserved.
The full-shelf photo hotspot has been removed. `side_cabinet_middle.jpg`
remains on disk as a reference. The display is explored through model markers 05
and 06. All seven models use tone-mapping exposure 0.819, a further 30% reduction
from 1.17 (37% below the original 1.3).

### Verification

Grinder was checked in Chrome through its room hotspot: textured rendering,
left framing, rotation, real-photo comparison, narrow layout, and focus return
passed. Beans unlock Grinder while Espresso stays locked; a failed Grinder load
does not advance, and a successful entry unlocks Espresso. The full nine-step
flow, coffee rewards, cabinet albums, and shelf photo popup passed without
uncaught browser errors.

Cabinet photo buttons were checked in Chrome: clicking the vase opens exactly
set 4, and clicking the leftmost can opens exactly the seven specified files in
order. The other three cans do not hover or open albums. Keyboard activation,
focus return, image comparison, narrow album layout, the coffee acquisition flow,
model text, and the existing shelf gallery passed without uncaught errors.

The cat-page copy was checked verbatim below the animation on desktop and narrow
screens. Playback and hover pause still work; the text clears on exit and stays
hidden on other pages. The full coffee/room flow and existing model copy passed
without uncaught browser errors.

All six current text files were audited against their model/reward mappings.
Cabinet left, Cabinet right, Photo shelves, and both coffee reward texts were
checked verbatim in Chrome; the currently empty Cabinet top copy remains hidden.
The complete acquisition and room sequence still passes without uncaught errors.

The coffee acquisition flow was checked in Chrome using the actual bag and center
button, plus keyboard activation. Visiting Pegboard/Espresso alone keeps the next
element locked; the matching reward unlocks it after displaying the exact supplied
image and text. Failed images, empty text, cancellation, retry, Escape/focus return,
duplicate collection, cached re-entry, and narrow layout passed. The remaining
room sequence and shelf photo popup still work; refresh clears acquired items.
No uncaught browser errors were observed.

The center-only espresso interaction was checked against all five original panel
positions in Chrome: only the center responds to hover and click. Pointer exit,
keyboard activation, image comparison, and cached re-entry passed. The full room
sequence and shelf photo popup still work with the shared picking path.

The pegboard coffee-bag button was checked in Chrome: surface glow, hover label,
direct clicking, keyboard selection, drag separation, cached re-entry, image
comparison, and narrow layout passed. The full eight-element sequence and shelf
photo popup still work with the shared surface-interaction helper. No uncaught
JavaScript errors were observed.

Sequential exploration was checked in Chrome through all eight elements, ending
at Photo shelves. Only Pegboard is initially available; locked targets and named
buttons are hidden and guarded against programmatic clicks. Successful model and
animation entries reveal exactly the next element, while failed/cancelled loads
do not advance. Revisits, keyboard entry, focus return, shelf text/photo popups,
and refresh-to-restart passed with no uncaught errors.

Model copy was checked in Chrome: the supplied Photo shelves text appears
verbatim on the right, with UTF-8 characters and line breaks preserved. Narrow
screens place it below the scene. Photo popups and image comparison still work;
empty/missing text and late responses after leaving do not block or contaminate
another model view. The source text file is unchanged.

Left framing was checked in Chrome for all seven models. All 17 shelf objects still
open their correct photo sets when clicked in the shifted view. Resizing to a
narrow screen preserves picking alignment, and real-photo comparison and room
return work without uncaught JavaScript errors.

The optimized Cabinet top and Cabinet right were compared visually with their
originals in Chrome using software WebGL. Both load textured geometry, rotate,
switch to the real room image and back, and return correctly. Local cold-viewer
checks with HTTP caching disabled and the entry transition skipped measured
1.84 to 0.29 seconds for Cabinet top and 0.99 to 0.48 seconds for Cabinet right.
These are local observations, not estimates for guests' networks or devices.
Compressed files were also decoded again with glTF Transform. Cache reuse,
narrow layout, the uncompressed shelf/espresso models, and shelf photo opening
passed with no failed assets or uncaught errors. All runtime assets remain local.

The simplified model view was checked in Chrome on desktop and narrow screens:
the rotation/zoom/reset button bar and visible instructions are absent, with
Show room image above Back to room at the top right. Keyboard interaction,
shelf photo opening, real-photo comparison, and room return passed without
uncaught JavaScript errors.

The room cleanup was checked in Chrome: eight hotspots and named buttons remain;
The four removed room objects are absent. No number badges are drawn over the scene. All
eight regions retain hover labels and glow; keyboard entry, shelf model loading,
focus return, door/cat animations, and narrow layout passed without uncaught errors.

Checked in local headless Chrome with software WebGL: photo and model rendering,
pointer entry, rotate/zoom controls, Escape and focus return, cancellation during
loading/transition, repeated entry, reduced motion, responsive hotspot alignment,
and recovery after a deliberately blocked model request. No uncaught JavaScript
errors were observed. Performance on guest devices still needs evaluation with
the original 31 MB model.

The earlier photo scene was checked in Chrome: all 11 original marker targets, all 19
non-espresso detail photos, alternate-view selection, photo failure/retry,
keyboard entry and focus return, rapid photo selection followed by return,
narrow layouts, and the retained espresso 3D viewer. Photo variants are grouped
by physical area; `espresso.jpg` remains a reference rather than replacing 3D.

Zoom-before-photo behavior was checked for every photo hotspot: the photo stays
hidden during the zoom, the correct photo appears afterward, and edge targets
leave no uncovered backdrop gaps. Cancellation, reduced-motion timing, alternate
photo selection, and the retained espresso 3D transition were also checked.

The espresso glow follows the button panel and is hidden from behind. Hover
checks cover individual button illumination, clearing on pointer exit, and
returning to the room. The hover effect is steady, including in reduced-motion mode.

The display-shelf update was checked in Chrome: markers 05 and 06 open their
matching GLBs, each viewer supports rotation/zoom/reset and Escape/focus return.
The former full-shelf photo hotspot is absent from both the room and object list. Switching among all three models
uses one canvas; repeat visits reuse the loaded GLB. Model failure/retry,
cancellation followed by opening another object, narrow layouts, and reduced
motion were also checked with no uncaught JavaScript errors.

Pegboard marker 01 was checked in Chrome: its GLB textures render, rotate/zoom/reset
work, Escape restores hotspot focus, and named-button entry reuses the cached
model and shared canvas. No uncaught JavaScript errors were observed.

Marker 07's animation was checked in Chrome: all 11 frames displayed in order,
with a measured mean interval of 167 ms (6 fps). Pause/resume, replay, final-frame
hold, focus return, reduced-motion manual playback, failure/retry, cancellation
before entering another photo, and narrow layout checks passed without uncaught
JavaScript errors.

Real-only image comparison was checked in Chrome on the shelf and espresso
viewers: Show room image loads the sharp `whole_scene.jpg` at the same zoom,
with no cartoon image controls. Switching back restores the model, and Back to
room restores the main cartoon scene. No uncaught JavaScript errors were observed.

Marker 08's 2 fps timing was checked in Chrome at a mean interval of 500 ms.
Hover freezes the frame, leaving resumes prior playback, and manual pauses stay
paused. Automatic replay keeps the 2 fps timing; a pointer already over
the image on entry also pauses it. Marker 07 continues to play during hover.
Pause/resume, replay, automatic loop wraparound from frame 12 to 0,
reduced-motion explicit playback, return/focus, narrow layout,
and frame failure/retry passed. Alternating door/cat playback preserves each
sequence's frames and aspect ratio; a cancelled cat load cannot redraw an active
door animation. No uncaught JavaScript errors were observed.

Marker 04's cabinet-top model was checked in Chrome: zoom, textured rendering,
rotate/zoom/reset, image/model comparison, real/cartoon selection, Escape/focus
return, and cached re-entry passed with no uncaught JavaScript errors.

Marker 09 was checked in Chrome: textured model rendering, rotate/zoom/reset,
image/model and real/cartoon comparison, Escape/focus return, and cached re-entry
passed with no uncaught JavaScript errors.

The shelf object buttons were checked in Chrome: all 17 visible targets select
their matching names, glow overlays render on their surfaces, and picking remains
aligned after rotation. Keyboard Enter selection, drag-versus-click handling,
zoom/reset, image comparison, return/focus, cached re-entry, reduced motion, and
narrow layout passed. The espresso viewer still loads and responds to its controls.
No uncaught JavaScript errors were observed.

The numbered photo galleries were checked in Chrome after the filename correction:
the original 17 single-set mappings displayed their matching files (32 photos at that time), including
the HEIC conversions. One-, two-, and three-photo layouts, narrow screens,
keyboard entry, Escape/Close and focus return, a direct 3D-object click, image
comparison, and return to the room passed without failed assets or uncaught errors.

### Build or publish

No build step is needed. `index.html` is already at the repository root and
tracked by Git. Asset paths are relative, supporting GitHub Pages project URLs.
The root `.nojekyll` file tells Pages to serve the static files without Jekyll.

To publish using GitHub Pages:

1. Commit and push the project, including `.nojekyll`, to `main`.
2. Open the repository on GitHub and go to **Settings > Pages**.
3. Under **Build and deployment**, choose **Deploy from a branch**.
4. Select **main** and **/(root)**, then **Save**.
5. Once deployment completes, use the **Visit site** link shown on that page.

Keep `resource/` and `vendor/` beside `index.html`, including all seven optimized
GLBs, image `web/` folders, text files, and the MP3. Ignored originals are not
needed for the published invitation. A custom domain is optional and undecided.
See [GitHub's publishing-source instructions](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).
Record the supplied model's license and any required attribution before publishing;
see `THIRD_PARTY_NOTICES.md`.

#   w e d d i n g - i n v i t a t i o n 
 
 
