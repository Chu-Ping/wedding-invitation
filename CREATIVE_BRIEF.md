# Creative brief: interactive wedding invitation

## Confirmed so far

- This is a wedding invitation.
- Page heading: “Invitation：佑琦 & 竹平” above “Explore our room”. Do not show the scene-number caption or “Interactive scene test” below the scene.
- The invitation should feel like a small interactive game.
- Guests should be able to open it in a desktop web browser without installing anything.
- The interaction ideas discussed so far are clicking, zooming in on things, and cutting to another scene.
- Current motion uses smooth zooms into room objects, cuts to individual photos, and a fade into assigned 3D views. Further animations and story cutscenes remain TODO.
- The preferred direction is code-based and open source where practical.
- HTML, CSS, and JavaScript are acceptable web technologies. No game framework has been selected.
- Use `resource/images/main_scene/whole_scene_cartoon.png` as the default playground backdrop. Keep the original `whole_scene.jpg` for real-image comparison.
- Do not show the room-header hover/click instruction, including when returning from a detail view.
- Clicking the espresso machine should zoom toward it and display `resource/model/espresso.optimized.glb` in an interactive 3D view.
- Keep the selected zoomed room image lightly blurred behind 3D models; models and controls remain sharp. The default is the cartoon version.
- Frame all seven models to the left by 30% of their initial displayed width, leaving space on the right for future words. Preserve model size, rotation centers, glow, and object picking. Recompute framing on resize and reset. Use supplied text where available; other text remains TODO with no guest-facing placeholders.
- Model text is stored under `resource/text/` and mapped by the `text` property in `scene-elements.js`. Photo shelves currently reads `resource/text/photo_shelves/text` (the supplied coffee-shelf and travel-memory copy). Show supplied plain text on the right, preserving paragraphs and line breaks; below the scene on narrow screens. Re-read on entry. Hide empty copy and hide the panel during image comparison or after returning. Cabinet top, Cabinet left, and Cabinet right are also mapped to `resource/text/cabinet_top/text`, `cabinet_left/text`, and `cabinet_right/text` respectively; empty files stay invisible. Coffee bean and mug text remains attached to their acquisition popups.
- In model detail views, remove the rotation, zoom in/out, and reset-view buttons and all visible instruction text, including the page hint and shelf helper text. Keep drag/scroll and keyboard interaction, object names, and shelf photo buttons. Place Show room image / Show model at the top right where Back to room was, with Back to room directly below; use the same arrangement in room-image comparison mode.
- In each 3D detail view, provide a toggle between the model and the zoomed background image. Image mode shows only the sharp zoomed real photograph (`whole_scene.jpg`); do not offer a cartoon image option. Preserve the model view while comparing; Back/Escape restores the cartoon main room.
- Only the center front-panel espresso button is interactive. Keep its warm gold hover/focus glow and click selection, plus a single keyboard-accessible Center button below the viewer. The other four physical buttons remain part of the model with no hover or click targets. Clear hover on exit/dragging and respect occlusion. Clicking acquires the coffee mug described below.
- Assign the GLBs under `resource/model/display_shelf/left/` and `right/` to the corresponding sides of the display shelf. Each gets a room hotspot, zoom transition, lightly blurred backdrop, and 3D drag/scroll and keyboard interaction matching espresso. The full-shelf photo hotspot is removed; the photo remains a reference asset.
- Grinder is step 02, between Pegboard and Espresso machine. Use `resource/model/grinder/grinder.optimized.glb` at the original room grinder location with the shared model viewer. The bean unlocks Grinder; successful model entry unlocks Espresso machine. Failed/cancelled entry does not advance. The grinder button opens the coffee grounds reward; Espresso remains unlocked by visiting Grinder.
- Pegboard marker 01 opens `resource/model/pegboard.optimized.glb`, with the same zoom, blurred room background, and 3D controls as the other models. The pegboard photo remains a reference.
- Make the coffee bag on the pegboard a clickable object with warm gold surface glow and a Coffee bag hover label. Provide a matching keyboard-accessible button below the model. Clicking acquires the coffee bean described below. Keep rotation gestures separate from clicks and preserve picking through the left-shifted camera. The source GLB stays unchanged; calibration is in `pegboard-interactions.js`.
- Marker 07 zooms into the cabinet doors, then cuts to the 11 timestamp-ordered images in `resource/images/opening_door/`, played at 6 fps. Play once, hold the open-door frame, and provide pause/replay. Reduced motion disables autoplay; Play remains available.
- Beneath the cabinet reads `resource/text/beneath_the_cabinet/text` and displays the supplied copy below the cat animation window, preserving paragraphs and line breaks. Re-read on entry, hide empty copy, and clear it on leaving; playback and hover-to-pause remain unchanged.
- Marker 08 zooms beneath the cabinet, then cuts to the 13 images in `resource/images/cat/`, ordered numerically from `0.jpg` through `12.jpg`, at 2 fps, looping automatically. Pause while the pointer hovers over the image; resume on exit only if it was playing. Manual pause must stay paused. Preserve pause/replay, cancellation, and reduced-motion behavior.
- Marker 04 opens `resource/model/display_shelf/top/cabinet-top.optimized.glb` with the shared zoom, blurred backdrop, 3D controls, and real room photo comparison. Its original photo stays as a reference.
- Cabinet object albums: Cabinet top vase opens set 4 then set 24 (8 photos).
  Cabinet left's leftmost beer can opens set 6, set 8, image 15-0, image 16-1,
  set 18, set 20, set 21, set 23, set 25, set 28 (18 photos). Cabinet right's left
  photo frame opens all of set 1 (7 photos). Preserve this ordering, glow,
  keyboard access, drag-versus-click handling, irregular scrolling photo layout,
  Close/Escape, and focus return. Other beer cans remain scenery. Preserve GLBs.
- Marker 09 opens `resource/model/shelf.optimized.glb`, with shared zoom, 3D controls, and real room photo comparison. Its original `shelf.jpg` remains a reference.
- The 17 photo-shelf items keep their current left-to-right, top-to-bottom order.
  Their albums combine source sets as follows: 1:[1], 2:[2,3], 3:[4], 4:[5,6,7],
  5:[8,9], 6:[10,11], 7:[12,13], 8:[14,15], 9:[16,17], 10:[18,20],
  11:[19,21], 12:[22], 13:[23], 14:[24,26], 15:[25], 16:[27], 17:[28].
  Preserve listed set order and numeric photo order within each set. The source
  collection contains 68 photos across 28 sets. Keep every photo, using local
  JPEGs under photos/web/ and retaining originals. Larger albums scroll with
  irregular photo cards; narrow screens stack them. Keep warm gold glow,
  keyboard buttons, drag-versus-click, Close/Escape, and focus return. Source GLB
  regions remain in shelf-interactions.js; grouped mappings are in shelf-albums.js.
- Cabinet top and Cabinet right use local optimized GLB copies, preserving their original Meshy files. Target roughly 400,000 and 250,000 triangles respectively, with 1024-pixel JPEG textures and Meshopt compression. Current outputs are 4.06 MB / 399,996 triangles and 2.69 MB / 249,994 triangles. Bundle the decoder locally; preserve appearance and interaction while accepting softer fine details. Rebuild using `scripts/optimize-cabinet-models.mjs`; exact statistics are in `resource/model/display_shelf/optimization-report.json`.
- All seven models use tone-mapping exposure 0.819, reduced a further 30% from 1.17 (37% below the original 1.3).
- Espresso, pegboard, photo shelves, grinder, and Cabinet left also use local
  optimized GLBs: 250k, 300k, 300k, 180k, and 250k triangles respectively, with
  1024-pixel JPEG textures and Meshopt compression. Their combined download is
  11.60 MB instead of 141.88 MB. Preserve local-space button calibration and all
  reward/photo links. Retain original GLBs locally and ignore them in Git. Rebuild
  with `scripts/optimize-scene-models.mjs`; statistics are in
  `resource/model/optimization-report.json`.
- The supplied model can be generated externally and downloaded; this prototype renders it locally.
- The coffee cabinet, side-cabinet overview, and plant hotspots have been removed; the grinder is restored as a model step. Keep their source photos as references. Hide all numbered overlays on the room image; keep object glow and name annotations on hover or keyboard focus, and use the current sequential numbers in the named list.
- Coffee acquisition flow: clicking the pegboard coffee bag shows `resource/images/props/Voxel cluster of roasted coffee beans.png` and the exact UTF-8 text from `resource/text/coffee_bean/text`, acquires one coffee bean, and unlocks Grinder. Successfully visiting Grinder then unlocks Espresso machine. Clicking its center button (requires the bean) shows `resource/images/props/Chunky voxel coffee mug.png` and `resource/text/coffee_mug/text`, acquires one coffee mug, and unlocks Cabinet top. Use an accessible modal with Close/Escape and focus return. Award only when both image and nonempty text have loaded; cancelled or failed loads do not award/unlock. Retry is available. Repeated clicks reopen the item without duplicate acquisition. Items remain collected for this page session.
- Room list order and labels: 01 Pegboard, 02 Grinder, 03 Espresso machine, 04 Cabinet top, 05 Cabinet left, 06 Cabinet right, 07 Cabinet doors, 08 Beneath the cabinet, 09 Photo shelves. Do not show "3D" in guest-facing controls, labels, or loading messages; the comparison button reads Show model.
- Reveal room elements sequentially in the listed order. Only Pegboard is available initially. Pegboard requires collecting the coffee bean to reveal Grinder; Grinder requires a successful detail-view visit to reveal Espresso machine; Espresso machine requires collecting the coffee mug to reveal Cabinet top. After Cabinet top, a successful detail-view entry reveals the next hotspot and named button; previously revealed elements stay available. Locked elements have no hover glow, label, click target, or keyboard/button entry. Failed or cancelled loads do not advance progress. Keep progress in memory for this page session; refresh restarts exploration. The 17 photo-shelf sub-items remain available together once Photo shelves is unlocked.
- Identify the remaining nine objects on the room backdrop. Each first zooms in at its location, then opens its photo, animation, or assigned 3D model. Photo shelves, pegboard, grinder, espresso, cabinet top, and the left/right display areas use GLBs; markers 07 and 08 use animations.

## Event information

- Couple's names: 喻竹平 & 丁佑琦
- Venue date: 2026/12/19
- Ceremony time: 11:30 a.m.
- Venue name: 吉品海鮮
- Venue address: 台北市信義路四段236號2樓
- RSVP deadline:
- RSVP method or link:
- Other guest information to include:

## Story and experience

- Story or invitation premise:
- What guests see first:
- What guests should discover or do:
- How the invitation ends or reveals the event details:
- Desired length of the experience:

## Scenes

List the planned scenes in order. Leave this section open until scene ideas are provided.

1. Main cartoon room image with unnumbered hotspots for photo shelves, pegboard, grinder, espresso, cabinet top, cabinet doors, beneath the cabinet, and left/right display areas. Reveal glow and names on hover or keyboard focus. Photo shelves, pegboard, grinder, espresso, cabinet top, and the left/right display-shelf areas lead to 3D with room-image comparison; markers 07 and 08 open door and cat animations (prototype).
2.
3.

## Interactions

- Photo albums with exactly four photos show all four in one row on desktop;
  narrow screens retain the stacked layout and irregular photo-card styling.
- Cabinet right: the left photo frame opens set 1, with warm gold
  hover/focus/selection glow, Photo frame label, and matching keyboard button.
  Preserve drag-versus-click behavior and real-image comparison.
- After Cabinet doors finishes its 6 fps animation, automatically open
  `resource/images/props/card.jpeg` in an accessible image popup. Grow it from
  the center of the preceding door image over 700 ms, gently dimming the backdrop.
  Decode the card before revealing it; skip this motion for reduced motion.
  Show `resource/text/cabinet_doors/text` to the right of the card, or below on
  narrow screens. Re-read the UTF-8 copy each opening and preserve paragraphs.
  Empty or failed copy stays hidden without blocking the card. Close/Escape
  returns to the finished animation with focus restored. Replays show the card
  again on completion. Pause/cancellation must not trigger it; reduced motion
  waits for explicit playback. Keep the existing room progression.
- Grinder: the small silver button at the lower-right side glows on hover/focus
  and opens `resource/images/props/Voxel coffee grounds mound.png` with UTF-8
  text from `resource/text/coffee_ground/text`. Include a matching keyboard
  button, Close/Escape, and focus return. Re-read copy each time; while the file
  is empty, show the image alone without placeholder text. This popup collects
  coffee grounds; the existing visit-based Espresso unlock remains in place.
- Clickable items and what each one does: photo shelves, cabinet top, pegboard, espresso machine, and the left/right display-shelf areas open their supplied 3D models after zoom transitions; markers 07 and 08 open the door (6 fps) and cat (2 fps, hover to pause) animations after their zooms.
- Items guests can zoom in on: all nine mapped room areas, using their locations in the backdrop; the coffee cabinet, cabinet overview, plant, and full-shelf photo hotspots are removed.
- How guests move between scenes: click an object hotspot or its named button to enter; Back to room or Escape returns (prototype controls).
- Any choices or progress to remember:

## Visual and audio direction

This is the working direction for the current prototype, not a final wedding theme.

- Visual style: the supplied block-style cartoon room, explored like a small point-and-click game, with 3D close-ups for photo shelves, cabinet top, pegboard, espresso, and the left/right display-shelf areas. Keep objects recognizable and offer comparison to the original room photograph in the 3D detail views.
- Color palette: warm off-white and cream surfaces, muted green-gray text and controls, with the natural colors of the photographs. Current CSS uses `#f3f1eb` for the page, `#f6f4e9` for light panels, and `#31362f` for primary text.
- Typography: Georgia/serif headings with system sans-serif body text, labels, and controls; no downloaded fonts.
- Illustration, photography, or other art direction: use `whole_scene_cartoon.png` for the main room, the original room photo for comparison, and supplied individual photos/models for details. Preserve the full 4:3 backdrop and show detail photos without cropping. The room is a flat image rather than a reconstructed 3D environment.
- Controls: unnumbered room hotspots with glow and names on hover or keyboard focus, matching named buttons below the room, and rounded light panels/buttons with subtle shadows.
- Animation and cutscene direction: approximately 1.1-second eased zoom toward the selected object's location, then cut to its photo or frame animation once loaded. Assigned models fade into their 3D view over the zoomed backdrop with a light `blur(2px)` CSS filter; models and controls stay sharp. Door animation uses 11 frames at 6 fps, plays once, and holds its final frame. Cat animation uses 13 frames at 2 fps and loops automatically, pausing on hover. Back/Escape returns to the room and cancels playback. Reduced motion skips transitions and animation autoplay; explicit Play/Replay is allowed. Story cutscenes remain TODO.
- Music: play the supplied local MP3, Just the Two of Us by Joanna Wang, at
  30% initial volume. Start on the first click or Enter/Space interaction, loop,
  and keep native play/pause, seek, and volume controls below the room. Preserve
  playback through scene changes and popups; manual pause stays paused. If the
  browser blocks initial playback, guests can press Play. No streaming embed.

## Practical requirements

- Accessibility or readability requirements:
- Browser requirements beyond desktop browser access:
- Privacy or access expectations for the invitation link:
- Hosting or domain preference:
- Open-source dependencies or licenses to prefer or avoid:

## Assets

All paths below are relative to the project root. Keep runtime paths relative so the site can be previewed locally and published elsewhere.

| Asset | Location | Current use |
| --- | --- | --- |
| Default cartoon room | `resource/images/main_scene/whole_scene_cartoon.png` | Main 1448 × 1086 playground; default zoomed background behind 3D models |
| Real room image | `resource/images/main_scene/whole_scene.jpg` | Original 4096 × 3072 room; selectable in image comparison mode and retained behind the model until returning to the room |
| Individual object photos | `resource/images/main_scene/` | Reference photos for models and removed room hotspots |
| Cabinet door animation originals | `resource/images/opening_door/IMG_20261018_154726.jpg` through `IMG_20261018_154815.jpg` (11 files, in timestamp order) | Source sequence for marker 07 at 6 fps |
| Cabinet door playback copies | `resource/images/opening_door/web/` | 900 × 1200 JPEG copies, preloaded and played at 6 fps; originals unchanged |
| Earlier cabinet door photos | `resource/images/main_scene/side_cabinet_door_*.jpg` and `side_cabinet_low.jpg` | Reference assets; no longer used by marker 07 |
| Cat animation originals | `resource/images/cat/0.jpg` through `12.jpg` | 13-frame sequence for marker 08, in numeric order, at 2 fps; hover to pause |
| Cat playback copies | `resource/images/cat/web/` | 1200 × 900 JPEG copies for playback; originals unchanged |
| Earlier beneath-cabinet photos | `resource/images/main_scene/side_cabinet_bottom.jpg` and `side_cabinet_bottom_cat.jpg` | Preserved reference images; marker 08 now opens the cat animation |
| Espresso reference photo | `resource/images/main_scene/espresso.jpg` | Reference only; clicking espresso opens the GLB instead |
| Espresso 3D model | `resource/model/espresso.optimized.glb` | Current interactive model, with embedded textures |
| Pegboard 3D model | `resource/model/pegboard.optimized.glb` | Pegboard marker 01, with embedded textures |
| Photo-shelves 3D model | `resource/model/shelf.optimized.glb` | Marker 09, with embedded textures; original `shelf.jpg` is a reference |
| Left display 3D model | `resource/model/display_shelf/left/cabinet-left.optimized.glb` | Left side of the display shelf, with embedded textures |
| Right display 3D model | `resource/model/display_shelf/right/cabinet-right.optimized.glb` | Right side of the display shelf, with embedded textures |
| Cabinet-top 3D model | `resource/model/display_shelf/top/cabinet-top.optimized.glb` | Marker 04, with embedded textures; `top/1.jpg` and `main_scene/side_cabinet_top.jpg` are references |
| Display reference photos | JPGs in `resource/model/display_shelf/left/` and `right/` | References for each grouping; not loaded by the scene |

- Model directory: `resource/model/` (singular). GLB is the preferred format for browser-ready models with textures.
- Object-to-photo mapping and hotspot coordinates: `scene-elements.js`; see the complete marker table in `README.md`.
- Viewer loading and zoom behavior: `app.js`. Presentation and blur strength: `styles.css`.
- Music source: `resource/sound/Joanna_Wang_-_Just_The_Two_Of_Us_(mp3.pm).mp3`,
  served locally with the invitation.
- Fonts: local system fonts; no font assets required currently.
- Asset provenance: user-supplied photographs and model. TODO record the model's applicable license and required attribution before publication; dependency notices are in `THIRD_PARTY_NOTICES.md`.
