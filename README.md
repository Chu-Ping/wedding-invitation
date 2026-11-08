# Interactive wedding invitation

## About

A browser-based wedding invitation designed as a small interactive experience. Guests should be able to open it on a desktop computer in a web browser without installing an app. The current prototype lets guests click objects in a room photograph, zoom into their locations, and explore photo or 3D detail views. Further animation and story cutscenes remain open.

## Project status

The Cabinet doors card popup embeds the Microsoft Forms RSVP questionnaire below
the card image and its adjacent text. Guests complete it inside the invitation.
English uses `resource/images/props/card-en.jpeg`, copied unchanged from the
supplied WhatsApp image, and form `https://forms.cloud.microsoft/r/AEARxMLt2u`.
Traditional and Simplified Chinese both use the original `card.jpeg` and form
`https://forms.cloud.microsoft/r/cEPrTLnGeH`. Language switching updates the card
and embedded form immediately. The localized photo and resolved `embed=true`
form URLs are configured in `scene-elements.js`. The surrounding heading and
frame title follow all three languages. Questions, permissions, and response
notifications are managed in Microsoft Forms. The frame loads when the card opens
and unloads when it closes; other photo galleries do not load it.
Verified in Chrome: the live questionnaire renders its name and attendance
questions inside the card popup on desktop and on a fresh 390px-wide mobile
load. The mobile frame uses the popup's full inner width to avoid Microsoft's
narrow-frame link fallback. Switching between the two Chinese scripts preserves
the loaded form. Switching between English and Chinese loads a different form,
so any unsubmitted answers in the previous form are reset. No test response was submitted.
Both live language-specific questionnaires, the copied English card, initial
English opening, rapid language switches, and unchanged photo galleries were
verified in Chrome. The English card matches the supplied file byte for byte.

The old numbered photo collection has been removed. Replacement albums now use
one dedicated folder per item, mapped in `photo-albums.json`:

| Item button | Album folder | Photos |
| --- | --- | --- |
| Cabinet top vase (`cabinet-vase`) | `resource/images/photos/cabinet_top/` | 12 |
| Cabinet left beer can (`cabinet-can`) | `resource/images/photos/beer_can/` | 14 |
| Cabinet right frame (`cabinet-photo-frame`) | `resource/images/photos/photo_frame/` | 9 |
| Shelf 01 Coffee Dripper (`dripper`) | `resource/images/photos/coffee_dripper/` | 10 |
| Shelf 02 White Storage Jar (`jar`) | `resource/images/photos/white_storage_jar/` | 12 |
| Shelf 03 Metal Pitcher (`pitcher`) | `resource/images/photos/metal_pitcher/` | 9 |
| Shelf 04 Dotted Mug (`dotted-mug`) | `resource/images/photos/dotted_mug/` | 11 |
| Shelf 05 Green Striped Mug (`striped-mug`) | `resource/images/photos/friends_05/` | 18 |
| Shelf 06 Blue Mug (`blue-mug`) | `resource/images/photos/friends_06/` | 18 |
| Shelf 07 Dark Cup and Saucer (`dark-cup`) | `resource/images/photos/friends_07/` | 18 |
| Shelf 08 Patterned Teacup and Saucer (`teacup`) | `resource/images/photos/family/` | 11 |
| Shelf 09 Tall Illustrated Tin (`tin`) | `resource/images/photos/festival/` | 14 |
| Shelf 10 Square Canister (`canister`) | `resource/images/photos/berlin/` | 8 |
| Shelf 11 White Coffee Bag (`white-bag`) | `resource/images/photos/malta/` | 8 |
| Shelf 12 Beige Coffee Bag (`beige-bag`) | `resource/images/photos/czechia/` | 6 |
| Shelf 13 Small Clear Jar (`small-jar`) | `resource/images/photos/china_13/` | 8 |
| Shelf 14 Hanging Cup 1 (`hanging-left`) | `resource/images/photos/leuven_14/` | 11 |
| Shelf 15 Hanging Cup 2 (`hanging-middle-left`) | `resource/images/photos/leuven_15/` | 11 |
| Shelf 16 Hanging Cup 3 (`hanging-middle-right`) | `resource/images/photos/leuven_16/` | 12 |
| Shelf 17 Hanging Cup 4 (`hanging-right`) | `resource/images/photos/netherlands_17/` | 10 |

Each album keeps only the used `web/` JPEGs in the repository (up to 1600 pixels,
orientation applied, EXIF omitted). Unused source copies, unsupported formats,
and the old unlinked Friends collection have been removed from the photo directory.
Sources in Downloads remain unchanged. Items 07, 13, and 14 include MP4 first-frame
stills (nine, three, and three respectively); videos do not play in the galleries.
Other albums exclude companion videos unless explicitly enabled. Browser copies
and the generated `photo-albums.js` must be committed for publishing.
Unassigned items show the bilingual empty-album message. Models, rewards,
animations, the card, and language switching keep their existing behavior.

To add or replace an item's photos:

1. Keep source photos in a folder or ZIP outside the repository, such as Downloads.
2. Map the item's stable ID to that folder in `photo-albums.json`.
3. With Python, Pillow, and pillow-heif installed, run
   `python scripts/prepare-photo-albums.py --source ITEM_ID "PATH_TO_FOLDER_OR_ZIP"`
   from the project root. Repeat `--source ITEM_ID PATH` for multiple albums.
4. Refresh the preview. Photos appear in natural filename order. Generated web
   copies do not carry source EXIF metadata; source files are unchanged.

Albums without a supplied source retain their existing generated images after
path validation. A plain `python scripts/prepare-photo-albums.py` validates and
reuses all current galleries. To regenerate an album, provide its source again.
Legacy `originals/` folders are still supported if present, but are not required.

To include MP4 first-frame stills, install OpenCV (`opencv-python`) locally and
use an object instead of a folder string for that album, for example:
`"dark-cup": {"folder": "resource/images/photos/friends_07", "video_first_frame": true}`.
Extracted JPEGs end in `-first-frame.jpg`, keeping photos with the same stem distinct.

The preparer writes `photo-albums.js`, shared by cabinet and shelf item buttons.
Use `cabinet-photo-frame` for the Cabinet right frame; shelf item IDs are listed
in `shelf-interactions.js` (for example `dripper` or `blue-mug`). Items absent from
the folder map stay empty. No directory listing server, service, or build is
needed for guests; this script is only an authoring step when photos change.

There are now 230 gallery images in twenty item albums: all 17 shelf items and
three cabinet item buttons. Friends folders 05, 06, and 07 have 18 images each.
Item 12's bilingual context now says Czechia Trip, retaining the year 2025.

Verified in Chrome: the actual
model surfaces open the matching albums, including the new dripper (10), jar
(12), and frame (9). Shelf titles/context match both JSON languages. Keyboard
controls, narrow layouts, and Close/focus return work without failed assets or
uncaught exceptions. The six newest albums were also checked for exact image
lists, bilingual copy, full-width photo layout, keyboard focus, and narrow-screen
overflow. Friends items 05–07 were checked through their actual model surfaces:
18 images each, matching bilingual copy, correct first-frame stills for all nine
MP4s, close/focus return, and narrow-screen overflow. The final six albums were
checked through their model surfaces in all three languages; all 17 shelf
galleries were checked again after cleanup. The photo directory contains exactly
230 used JPEGs; 227 unused source/duplicate files (about 493 MiB) were removed.
All six new MP4 stills match their first decoded frames.

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

The legacy numbered-set mapping (`shelf-photos.js`, `shelf-albums.js`, and
`scripts/prepare-shelf-photos.py`) is retained only as an old reference. Runtime
photo galleries now use `photo-albums.json` and its generated `photo-albums.js`.
The folder preparer supports JPEG, HEIC/HEIF, PNG, and WebP source photos and
keeps full photos inside the existing irregular scrolling layout. Albums with
exactly four photos use one row on desktop; narrow screens stack them.

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
| Coffee bean | `resource/images/props/Voxel cluster of roasted coffee beans.png` | `resource/text/coffee_bean/text.json` | Grinder |
| Coffee grounds | `resource/images/props/Voxel coffee grounds mound.png` | `resource/text/coffee_ground/text.json` | No additional progression gate |
| Coffee mug | `resource/images/props/Chunky voxel coffee mug.png` | `resource/text/coffee_mug/text.json` | Cabinet top |

The coffee mug requires the collected bean. Each acquisition uses a keyboard-
accessible popup with the original image and UTF-8 copy, preserved line breaks,
Close/Escape, and focus return. The model pauses while the popup is open.
An item is awarded only after its image and valid bilingual JSON load successfully.
Bean and mug context must be nonempty in at least one language. Coffee grounds
allows blank context fields while its copy is being written; empty copy stays hidden.
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
image and `resource/text/coffee_ground/text.json`. Hover or keyboard focus gives it a
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

The Cabinet top vase opens the `cabinet-vase` folder album; only Cabinet left's
leftmost beer can opens `cabinet-can`. The other three beer cans remain scenery.
The Cabinet right frame (`cabinet-photo-frame`) opens its `photo_frame` album.
These objects retain their warm hover/focus/selection glow and keyboard buttons.
Regions are calibrated in `cabinet-interactions.js`; source GLBs are unchanged.

All seven models are fitted into a consistent left column, using their actual
projected bounds to leave a clear gap before the text. The model and text centers
align at 55% of the scene height, leaving room for headings and top-right controls.
The reading panel begins at 61% of scene width, uses up to 35% of the scene
(maximum 52ch), and keeps long copy scrollable. At 900 pixels and below, text
moves beneath the scene and the model is centered instead. Resize and keyboard
Home recompute framing; mouse picking uses the same camera projection.

### Languages and free exploration

Every file in `resource/text/<folder>/` is `text.json`, with six UTF-8 string
fields: `title_en`, `title_ch`, `title_chs`, `context_en`, `context_ch`, and
`context_chs`. The new `_chs` fields contain Simplified Chinese, initialized
from the existing Chinese copy and editable independently.
Traditional Chinese characters are used in `title_ch` and `context_ch`, and
Simplified Chinese characters in `title_chs` and `context_chs`. Both Chinese
versions retain the same wording and meaning; only character forms differ. English
translations are provided in `context_en`. Titles are the corresponding object
or page names. Names use the English spellings on the supplied invitation card.
Use JSON string escapes such as `\n\n` for paragraph breaks. Content is rendered
literally, without HTML. Edit these files directly; reopening the corresponding
page/popup fetches fresh JSON without rebuilding any manifest.

The existing Chinese option is the default. The language button cycles through
Traditional Chinese → English → Simplified Chinese → Traditional Chinese,
showing the name of the next language. It changes interface
labels, JSON titles, and body copy immediately without restarting the current
model, animation, music, or popup. The same toggle is inside reward and photo
popups, where native modal focus keeps the header inaccessible. The selected
language is saved locally for the next visit. Native browser audio controls use
browser/system language. Image contents, including the printed card, are unchanged.

Verified in Chrome: all 29 source files display the matching title/context in
all three languages across model views, the 17 shelf-item popups, rewards, cat
text, and card text. All language buttons stay synchronized; switching preserves
the animation frame, and Simplified Chinese remains selected after reloading.
All 116 Chinese title/context fields and both sets of interface labels have
also been reviewed for mixed scripts, preserving wording, punctuation, and line breaks.

The header's **Free exploration / 自由探索** button reveals all nine room
hotspots and menu entries for this page session. Guests can open any model or
animation and use its object buttons; bean prerequisites for espresso and grinder
rewards are bypassed. It does not award items automatically or erase visits.
The default guided sequence remains unchanged until this button is activated.
Refreshing returns to the guided sequence while preserving the language choice.

| JSON file under `resource/text/` | Destination |
| --- | --- |
| `pegboard/text.json` | Pegboard model: Coffee of the Month |
| `grinder/text.json` | Grinder model: Freshly Ground |
| `espresso_machine/text.json` | Espresso model: Our Morning Ritual |
| `cabinet_top/text.json` | Cabinet top model |
| `cabinet_left/text.json` | Cabinet left model |
| `cabinet_right/text.json` | Cabinet right model |
| `photo_shelves/text.json` | Photo shelves model: Little Stories, One Mug at a Time |
| `photo_shelves/<item-id>/text.json` | Each of the 17 shelf-item photo popups |
| `beneath_the_cabinet/text.json` | Below the cat animation |
| `cabinet_doors/text.json` | Card popup title and copy |
| `coffee_bean/text.json` | Coffee bean reward popup |
| `coffee_ground/text.json` | Coffee grounds reward popup |
| `coffee_mug/text.json` | Coffee mug reward popup |

Each shelf item has its own editable JSON file under
`resource/text/photo_shelves/<item-id>/text.json`. Its authored numbered title
appears once in the popup heading; its context sits immediately below the title.
The photo grid spans the full popup content width without a side text column.
Both update when the language is switched, including
while the popup is open. Text is also shown for items whose photos are pending.
The parent `photo_shelves/text.json` remains the main model-page introduction.

| Item | Folder ID | English heading |
| --- | --- | --- |
| 1 | `dripper` | Coffee Dripper ☕ |
| 2 | `jar` | White Storage Jar |
| 3 | `pitcher` | Metal Pitcher |
| 4 | `dotted-mug` | Dotted Mug |
| 5 | `striped-mug` | Green Striped Mug |
| 6 | `blue-mug` | Blue Mug |
| 7 | `dark-cup` | Dark Cup and Saucer |
| 8 | `teacup` | Patterned Teacup and Saucer |
| 9 | `tin` | Tall Illustrated Tin |
| 10 | `canister` | Square Canister |
| 11 | `white-bag` | White Coffee Bag |
| 12 | `beige-bag` | Beige Coffee Bag |
| 13 | `small-jar` | Small Clear Jar |
| 14 | `hanging-left` | Hanging Cup 1 |
| 15 | `hanging-middle-left` | Hanging Cup 2 |
| 16 | `hanging-middle-right` | Hanging Cup 3 |
| 17 | `hanging-right` | Hanging Cup 4 |

Model and animation copy display their selected title and context, preserving
line breaks. On narrow screens, copy flows below the scene. Model copy is hidden
in room-image comparison. Empty or failed optional JSON never blocks model,
animation, or card loading. Reward JSON must have all four string fields; beans
and mug require some nonempty context before acquisition. Missing or malformed
reward JSON offers retry and never awards the item. Changing language does not
repeat acquisition or change inventory. `i18n.js` handles loading, rendering,
interface labels, and language selection without third-party dependencies.

Verified in Chrome: all nine JSON title/body mappings in both languages, switches
inside open model/reward/card views, preserved cat animation frame, language
persistence, default guided progression, Free exploration via keyboard, espresso
reward without beans in free mode, invalid/cancelled JSON acquisition safety,
all 17 grouped shelf albums, all cabinet albums, four-photo rows, and narrow
header/model/popup layouts. No uncaught JavaScript exceptions were observed.

The cat page reads `resource/text/beneath_the_cabinet/text.json` on entry and places
its copy below the animation window and playback controls. It preserves UTF-8
characters and line breaks and hides the copy on return or when another view
opens. Empty or failed text does not block animation playback.

For another model, add its bilingual copy under `resource/text/<folder>/text.json` and add a
`text` property with that relative path to the corresponding entry in
`scene-elements.js`. This explicit mapping keeps text attached to the intended
model, independent of list order. JSON strings are rendered literally, without HTML.

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
Marker **07 / Cabinet doors** zooms in and plays `resource/video/cabinet-doors.mp4`.
It uses seconds **00:11–00:22** of the supplied MOV, at **2x speed** (5.5 seconds).
The central 70% is kept, cropping 15% from both left and right. Output is
896 × 720 H.264, 30 fps, without audio, with browser-friendly fast start.
HLG HDR is tone-mapped to SDR BT.709, then adjusted with contrast 1.08,
brightness +0.025, saturation 1.10, and gamma 1.04 for more vibrant subjects.
It plays once, holds the final frame, and retains Pause/Play and Replay.
On entry, the video grows from 40% to fill the available viewing area over
1.8 seconds, preserving its aspect ratio, with a gentle fade-in. Reduced motion
shows it at full size immediately. The cat animation keeps its existing sizing.
Reduced motion shows `resource/video/cabinet-doors-poster.jpg` until Play. Playback
pauses when the tab is hidden and stops on return.
When the door animation finishes, `resource/images/props/card.jpeg` opens in an
image popup, growing over 700 ms from the center of the door image into its final
position while the background gently dims. The card decodes before the reveal;
reduced motion shows it immediately. `resource/text/cabinet_doors/text.json` appears
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

The room/model/animation window is now 75% of the preceding layout's width
and height: `min(75%, (viewport height - 120px) * 1.5)` with the original 4:3
proportions. The header aligns with it. Phone layouts remain full width.
Models and copy use the balanced columns described above, with centered reading
panels, comfortable line lengths, rounded corners, and clear space between them.
On tablet/phone widths up to 900 pixels, model copy stacks below the scene.

Verified in Chrome at 1280 x 720, 1920 x 1080, 2560 x 1440, and 3840 x 2160:
scene width and height are 75% of their previous measurements. All seven model
views render, all 17 shelf surfaces remain clickable, and coffee rewards and
cabinet album surface clicks work after the framing change. Tablet/phone layout
and resizing passed without uncaught browser exceptions.

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
reference photos. Current animation `web/` copies, both room backdrops, reward images, and the card
remain included. Unused source/reference images outside the cleared gallery
folder stay locally; ignored originals are not distributed by a fresh checkout.

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
- `i18n.js`: three-language JSON loading, interface translation, and language selection.
- `scene-elements.js`: object labels, bounds, marker positions, and photo mappings.
- `espresso-glow.js`: model-specific button positions and procedural glow overlays.
- `shelf-interactions.js`: 17 shelf item regions, surface glow, and object picking.
- `shelf-gallery.js`, `photo-albums.json`, `photo-albums.js`: shared galleries, item-to-folder mapping, and generated browser photo list.
- `scripts/prepare-photo-albums.py`: prepare folder-based browser albums.
- `shelf-albums.js`, `shelf-photos.js`: legacy numbered mapping, no longer used at runtime.
- `scripts/prepare-shelf-photos.py`: optional local HEIC/JPEG conversion and manifest generation.
- `frame-animation.js`: cat playback at 2 fps with hover pause.
- `video-animation.js`: cabinet MP4 playback through the existing canvas and controls.
- `scripts/prepare-cabinet-video.py`: optional local FFmpeg trim, HDR conversion,
  color correction, 15%-per-side crop, and 2x-speed video preparation. Run
  `python scripts/prepare-cabinet-video.py "PATH_TO_MOV" --ffmpeg "PATH_TO_FFMPEG"`.
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
| 07 | Cabinet doors | `resource/video/cabinet-doors.mp4`, 896 × 720, 5.5 seconds at 30 fps; then the localized card and RSVP form |
| 08 | Beneath the cabinet | `resource/images/cat/web/0.jpg` through `12.jpg`, in numeric order, at 2 fps; hover to pause |
| 09 | Photo shelves | `resource/model/shelf.optimized.glb`; `shelf.jpg` remains a reference photo |

The named list and this mapping use the current order, numbered 01-09.
The cat animation uses the beneath-cabinet area. Earlier cabinet
door photos in `main_scene/` and `opening_door/` remain ignored reference assets;
marker 07 uses the prepared MP4. The obsolete eleven JPEG playback copies have
been removed. The original MOV stays in Downloads unchanged.
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

# wedding-invitation
