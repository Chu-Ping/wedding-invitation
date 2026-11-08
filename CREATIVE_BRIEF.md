# Creative brief: interactive wedding invitation

## Confirmed so far

- Add a three-language Show invitation button immediately after Free exploration
  in the header. After password entry, it directly opens the existing localized
  card/text/embedded RSVP view, bypassing the cabinet video and guided sequence
  without changing progress or free-exploration state. Pause an active animation
  before opening, and restore the current view/focus on close.

- Glow the next actionable item in the guided clicking sequence: highlight its
  room hotspot/menu button, and guide the coffee bag, grinder button, and espresso
  center button inside their models until their rewards are acquired. Advance
  other room hints on visits, following existing unlock rules. Use warm gold,
  keep hover/focus interaction, remove sequence hints in free exploration, and
  replace the pulse with a steady glow for reduced motion.
  Pulse guidance smoothly between invisible and full glow over a 2.6-second
  cycle, including inside models. Keep labels opaque and hover/focus feedback
  steady; stop the model pulse when its viewer is inactive or hidden.

- Replace the Chinese wedding card with the supplied Chinese vintage invitation
  PNG, copied unchanged to `resource/images/props/card-ch.png` (1024 × 1536).
  Both Traditional and Simplified Chinese use it; English keeps `card-en.jpeg`.
  Keep the existing language-specific embedded RSVP forms.

- Require password `20270206` before entering. Start with the entire invitation
  blurred and inert, with only the password screen and its language control
  usable. Defer room logic and music initialization until the correct password.
  Wrong/empty passwords and Escape must not reveal or unlock anything. Support
  all three languages, keyboard entry, and responsive layouts. Reloading locks
  the page again. This is a browser-level visual gate on the static site, not
  server-side protection of publicly hosted assets.

- Move all three-language title/context fields from `pegboard/text.json` to
  `coffee_bean/text.json`, from `grinder/text.json` to `coffee_ground/text.json`,
  and from `espresso_machine/text.json` to `coffee_mug/text.json`, replacing the
  previous item popup copy exactly. Clear the original source model copy so it
  copy appears only after clicking the coffee bag, grinder button, or espresso
  center button. The linked model sources instead show short prompts in all
  three languages: Pegboard “Find the coffee bean”; Grinder “Find the grinder
  button”; Espresso “Find the start button.” Keep their title fields empty. Preserve
  reward images, buttons, language switching, and guided progression.

- Treat a HEIC/JPEG still and same-stem MP4 companion as one Live Photo: keep
  the still photo only. Use first-frame stills only for standalone MP4s. Removed
  six duplicate companion images from the runtime manifest and photo folder:
  item 07 now has 17 images, item 13 has 5, and item 14 has 9. Other albums are
  unchanged; the current total is 224 images across 20 albums. Apply this rule
  both to external imports and already-generated manifests.

- Cabinet doors uses the supplied `IMG_5353.MOV` segment 00:11–00:22, exported
  locally at 2x speed as `resource/video/cabinet-doors.mp4` (5.5 seconds, 30 fps).
  Crop 15% from each horizontal side, keeping the middle 70% at 896 × 720.
  Convert the source HLG HDR to SDR BT.709 and moderately boost brightness,
  contrast, and saturation. Keep source unchanged outside the repository, ship
  only the prepared MP4 and first-frame poster, without video audio. Preserve
  pause/replay, reduced-motion poster/manual play, final frame, and the growing
  localized card/form popup at completion. Cat animation remains unchanged.
  On entering the video view, grow it from 40% to the full available image area
  over 1.8 seconds with an eased fade-in, keeping the aspect ratio. Reduced
  motion skips the growth and displays the video/poster at full size immediately.

- Embed the Microsoft Forms RSVP questionnaire below both the Cabinet doors card
  image and its accompanying text. Use the new sharing URL
  `https://forms.cloud.microsoft/r/AEARxMLt2u` for English and
  `https://forms.cloud.microsoft/r/cEPrTLnGeH` for both Chinese scripts, with
  resolved response URLs and `embed=true` in the card's `form` field in
  `scene-elements.js`. English uses `resource/images/props/card-en.jpeg`, copied
  unchanged from the supplied WhatsApp JPEG; both Chinese scripts retain the
  existing `card-ch.png`. Switching language updates the displayed card and form.
  Guests fill it
  inside the card popup. Translate the surrounding heading/frame title into all
  three languages; Microsoft Forms controls the questionnaire itself. Load only
  when the card opens and unload on close. Preserve the form between Traditional
  and Simplified Chinese; switch forms only when moving to or from English.

- Additional linked shelf folders: 03 `pitcher` → `metal_pitcher` (9 photos),
  04 `dotted-mug` → `dotted_mug` (11), 09 `tin` → `festival` (14),
  10 `canister` → `berlin` (8), 11 `white-bag` → `malta` (8), and
  12 `beige-bag` → `czechia` (6). Change item 12's context from Italy to Czechia
  in both languages, keeping 2025 as explicitly requested. The supplied split
  Friends folders 05, 06, and 07 now map to `striped-mug`, `blue-mug`, and
  `dark-cup`, using `friends_05`, `friends_06`, and `friends_07` respectively.
  Folders 05 and 06 have 18 images each. Folder 07 has 17 images: nine photos
  and eight standalone MP4 first-frame stills, excluding its matching video
  companion. Preserve all source files unchanged.
  Further supplied collections: 08 `teacup` → `family` (11), 13 `small-jar` →
  `china_13` (5), 14 `hanging-left` → `leuven_14` (9), 15 `hanging-middle-left`
  → `leuven_15` (11), 16 `hanging-middle-right` → `leuven_16` (12), and
  17 `hanging-right` → `netherlands_17` (10). Item 13 contains only its five
  photos; item 14 includes one standalone MP4 first-frame still. There are
  224 browser images in 20 active albums.
  Keep only gallery-used images under `resource/images/photos/`; remove local
  source copies, unused formats, and the earlier unlinked Friends copy. External
  Downloads sources stay unchanged. Prepare directly from external folders/ZIPs
  with `prepare-photo-albums.py --source ITEM_ID PATH`; retain existing generated
  albums when no source is supplied.
- The 17 photo-shelf items have separate bilingual JSON files at
  `resource/text/photo_shelves/<item-id>/text.json`, using their stable IDs from
  `shelf-interactions.js`. Preserve the user-supplied numbered titles, context,
  emojis, Chinese wording, and English wording. Clicking a shelf item or its
  keyboard button displays its title/context in the photo popup, even when an
  album is not assigned yet. Put shelf-item context directly below the popup
  title, with the photo grid using the full viewing width below the heading.
  Language switching updates the open popup. Future
  folder-based photos share the same popup and item ID. Keep the parent shelf
  introduction in `resource/text/photo_shelves/text.json`.

- Reduce the room/model/animation window to 75% of the previous width and
  height, preserving its 4:3 ratio. Desktop width is
  `min(75%, (viewport height - 120px) * 1.5)`. Phone layouts stay full width.
  Use balanced model/text columns: fit each model's actual bounds within the
  left half, centered near 31% width and 55% height, with clear heading space.
  Center the reading panel vertically at 55%, starting at 61% width, up to 35%
  wide and 52ch long. At 900px and below, center the model and stack text below.
  Preserve ray picking, orbit/zoom, reset, model exposure, and language behavior.
- Use a folder-based photo system: `photo-albums.json` maps each item's stable ID
  to `resource/images/photos/<folder>/`. Keep browser JPEGs in `web/` and source
  files outside the repository; generate `photo-albums.js` with
  `scripts/prepare-photo-albums.py` using the supplied external source paths.
  Current replacements: Cabinet top vase (`cabinet-vase`) uses `cabinet_top`
  with 12 photos; Cabinet left's leftmost beer can (`cabinet-can`) uses `beer_can`
  with 14 photos. Cabinet right's frame (`cabinet-photo-frame`) uses `photo_frame`
  with 9 photos. Shelf 01 (`dripper`) uses `coffee_dripper` with 10 photos;
  shelf 02 (`jar`) uses `white_storage_jar` with 12 photos. The three companion
  MP4 clips are excluded from those albums. Additional replacements are listed
  above; all 17 shelf items now have assigned albums.
  Cabinet and shelf item galleries use this system, preserving interaction and
  bilingual empty states. Legacy numbered mappings are reference only.

- The user requested removal of the entire old photo collection under
  `resource/images/photos/`, including original and generated browser images.
  The first two replacement folders are supplied as described above; other
  replacement photos and linking instructions will be supplied later.
  Keep numbered mappings as a reference; the active runtime manifest is
  `photo-albums.js`, generated from the new folder map.
  Empty albums show an honest empty-state message in both languages and must
  not break model loading, room progression, rewards, animations, or the card.

- All 29 content files under `resource/text/` are `text.json`, with string
  fields `title_en`, `title_ch`, `title_chs`, `context_en`, `context_ch`, and
  `context_chs`. The `_chs` fields provide editable Simplified Chinese copy.
  Use Traditional Chinese characters consistently in `_ch` and Simplified
  Chinese characters consistently in `_chs`, with identical wording and meaning.
  Preserve names, punctuation, emojis, and line breaks when correcting scripts.
  Language buttons cycle Traditional Chinese → English → Simplified Chinese,
  displaying `En - 繁 - 简` on every language button, with an accessible label
  naming the next language; use `zh-Hant`, `en`, and `zh-Hans` for the
  document language. Translate interface labels as well as source JSON. Preserve original
  Chinese copy and provide English translations. Show the chosen language's
  title and body on its existing page/popup. Chinese is the initial default;
  guests can switch via the header or inside popups, with a locally saved choice.
  Switching must preserve model/animation/music state and inventory. Image text
  remains part of the supplied image and is not replaced.
- Pegboard, Grinder, and Espresso machine now also have linked text sources:
  `pegboard/text.json`, `grinder/text.json`, and `espresso_machine/text.json`.
  Use the user-authored bilingual headings and body copy: Coffee of the Month
  for Pegboard, Freshly Ground for Grinder, Our Morning Ritual for Espresso,
  and Little Stories, One Mug at a Time for Photo shelves. Preserve the supplied
  Chinese wording and English copy. Reopening reads edits through the bilingual loader.
- Add a Free exploration button in the header. It reveals every room hotspot
  and named entry, bypassing room order and bean requirements for reward buttons.
  Do not award items automatically. Keep guided behavior until activated, and
  reset exploration mode and inventory on refresh. Language preference persists.
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
- Frame all seven models in the balanced columns specified above. Recompute on entry, resize, and keyboard Home; preserve all surface click targets and text readability.
- Model text is stored under `resource/text/` and mapped by the `text` property in `scene-elements.js`. Photo shelves currently reads `resource/text/photo_shelves/text.json` (the supplied coffee-shelf and travel-memory copy). Show supplied JSON title and context on the right, preserving paragraphs and line breaks; below the scene on narrow screens. Re-read on entry. Hide empty copy and hide the panel during image comparison or after returning. Cabinet top, Cabinet left, and Cabinet right are also mapped to `resource/text/cabinet_top/text.json`, `cabinet_left/text.json`, and `cabinet_right/text.json` respectively; empty files stay invisible. Coffee bean and mug text remains attached to their acquisition popups.
- In model detail views, remove the rotation, zoom in/out, and reset-view buttons and all visible instruction text, including the page hint and shelf helper text. Keep drag/scroll and keyboard interaction, object names, and shelf photo buttons. Place Show room image / Show model at the top right where Back to room was, with Back to room directly below; use the same arrangement in room-image comparison mode.
- In each 3D detail view, provide a toggle between the model and the zoomed background image. Image mode shows only the sharp zoomed real photograph (`whole_scene.jpg`); do not offer a cartoon image option. Preserve the model view while comparing; Back/Escape restores the cartoon main room.
- Only the center front-panel espresso button is interactive. Keep its warm gold hover/focus glow and click selection, plus a single keyboard-accessible Center button below the viewer. The other four physical buttons remain part of the model with no hover or click targets. Clear hover on exit/dragging and respect occlusion. Clicking acquires the coffee mug described below.
- Assign the GLBs under `resource/model/display_shelf/left/` and `right/` to the corresponding sides of the display shelf. Each gets a room hotspot, zoom transition, lightly blurred backdrop, and 3D drag/scroll and keyboard interaction matching espresso. The full-shelf photo hotspot is removed; the photo remains a reference asset.
- Grinder is step 02, between Pegboard and Espresso machine. Use `resource/model/grinder/grinder.optimized.glb` at the original room grinder location with the shared model viewer. The bean unlocks Grinder; successful model entry unlocks Espresso machine. Failed/cancelled entry does not advance. The grinder button opens the coffee grounds reward; Espresso remains unlocked by visiting Grinder.
- Pegboard marker 01 opens `resource/model/pegboard.optimized.glb`, with the same zoom, blurred room background, and 3D controls as the other models. The pegboard photo remains a reference.
- Make the coffee bag on the pegboard a clickable object with warm gold surface glow and a Coffee bag hover label. Provide a matching keyboard-accessible button below the model. Clicking acquires the coffee bean described below. Keep rotation gestures separate from clicks and preserve picking through the left-shifted camera. The source GLB stays unchanged; calibration is in `pegboard-interactions.js`.
- Marker 07 zooms into the cabinet doors, then plays the prepared MP4 described above. Play once, hold the final frame, and provide pause/replay. Reduced motion disables autoplay; Play remains available.
- Beneath the cabinet reads `resource/text/beneath_the_cabinet/text.json` and displays the supplied copy below the cat animation window, preserving paragraphs and line breaks. Re-read on entry, hide empty copy, and clear it on leaving; playback and hover-to-pause remain unchanged.
- Marker 08 zooms beneath the cabinet, then cuts to the 13 images in `resource/images/cat/`, ordered numerically from `0.jpg` through `12.jpg`, at 2 fps, looping automatically. Pause while the pointer hovers over the image; resume on exit only if it was playing. Manual pause must stay paused. Preserve pause/replay, cancellation, and reduced-motion behavior.
- Marker 04 opens `resource/model/display_shelf/top/cabinet-top.optimized.glb` with the shared zoom, blurred backdrop, 3D controls, and real room photo comparison. Its original photo stays as a reference.
- Cabinet object albums now come from the folder map: the Cabinet top vase uses
  `cabinet-vase` (12 photos), and Cabinet left's leftmost beer can uses
  `cabinet-can` (14 photos). Cabinet right's frame uses `cabinet-photo-frame`
  (9 photos).
  Keep existing glow, keyboard buttons, drag-versus-click, photo layout, closing,
  and focus return. Other beer cans remain scenery; source GLBs stay unchanged.
- Marker 09 opens `resource/model/shelf.optimized.glb`, with shared zoom, 3D controls, and real room photo comparison. Its original `shelf.jpg` remains a reference.
- The 17 photo-shelf items keep their current left-to-right, top-to-bottom order
  and their stable IDs in `shelf-interactions.js`. Assigned shelf folders are listed above; other folders remain pending. Map folders by those IDs in `photo-albums.json`.
  Keep empty states, full-photo layouts, glow, keyboard access, and Close/Escape.
  Old numbered-set groupings remain in the legacy code only as a reference.
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
- Coffee acquisition flow: clicking the pegboard coffee bag shows `resource/images/props/Voxel cluster of roasted coffee beans.png` and the exact UTF-8 text from `resource/text/coffee_bean/text.json`, acquires one coffee bean, and unlocks Grinder. Successfully visiting Grinder then unlocks Espresso machine. Clicking its center button (requires the bean) shows `resource/images/props/Chunky voxel coffee mug.png` and `resource/text/coffee_mug/text.json`, acquires one coffee mug, and unlocks Cabinet top. Use an accessible modal with Close/Escape and focus return. Award only when both image and nonempty text have loaded; cancelled or failed loads do not award/unlock. Retry is available. Repeated clicks reopen the item without duplicate acquisition. Items remain collected for this page session.
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
- After Cabinet doors finishes its 5.5-second video, automatically open
  `resource/images/props/card-ch.png` in an accessible image popup. Grow it from
  the center of the preceding door image over 700 ms, gently dimming the backdrop.
  Decode the card before revealing it; skip this motion for reduced motion.
  Show `resource/text/cabinet_doors/text.json` to the right of the card, or below on
  narrow screens. Re-read the UTF-8 copy each opening and preserve paragraphs.
  Empty or failed copy stays hidden without blocking the card. Close/Escape
  returns to the finished animation with focus restored. Replays show the card
  again on completion. Pause/cancellation must not trigger it; reduced motion
  waits for explicit playback. Keep the existing room progression.
- Grinder: the small silver button at the lower-right side glows on hover/focus
  and opens `resource/images/props/Voxel coffee grounds mound.png` with UTF-8
  text from `resource/text/coffee_ground/text.json`. Include a matching keyboard
  button, Close/Escape, and focus return. Re-read copy each time; while the file
  is empty, show the image alone without placeholder text. This popup collects
  coffee grounds; the existing visit-based Espresso unlock remains in place.
- Clickable items and what each one does: photo shelves, cabinet top, pegboard, espresso machine, and the left/right display-shelf areas open their supplied 3D models after zoom transitions; markers 07 and 08 open the cabinet video (5.5 seconds at 30 fps) and cat (2 fps, hover to pause) animations after their zooms.
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
- Animation and cutscene direction: approximately 1.1-second eased zoom toward the selected object's location, then cut to its photo or frame animation once loaded. Assigned models fade into their 3D view over the zoomed backdrop with a light `blur(2px)` CSS filter; models and controls stay sharp. The cabinet video uses the prepared 896 ? 720 MP4 at 30 fps for 5.5 seconds, plays once, and holds its final frame. Cat animation uses 13 frames at 2 fps and loops automatically, pausing on hover. Back/Escape returns to the room and cancels playback. Reduced motion skips transitions and animation autoplay; explicit Play/Replay is allowed. Story cutscenes remain TODO.
- Music: play the supplied local MP3, Just the Two of Us by Joanna Wang, at
  30% initial volume. Start on the first click or Enter/Space interaction, loop,
  and keep native play/pause, seek, and volume controls below the room. Preserve
  playback through scene changes and popups; manual pause stays paused. If the
  browser blocks initial playback, guests can press Play. No streaming embed.

## Practical requirements

- Accessibility or readability requirements:
- Browser requirements beyond desktop browser access:
- Privacy or access expectations for the invitation link:
- Hosting or domain preference: GitHub Pages, publishing `main` from the repository root. Custom domain remains undecided.
- Open-source dependencies or licenses to prefer or avoid:

## Assets

All paths below are relative to the project root. Keep runtime paths relative so the site can be previewed locally and published elsewhere.

| Asset | Location | Current use |
| --- | --- | --- |
| Default cartoon room | `resource/images/main_scene/whole_scene_cartoon.png` | Main 1448 × 1086 playground; default zoomed background behind 3D models |
| Real room image | `resource/images/main_scene/whole_scene.jpg` | Original 4096 × 3072 room; selectable in image comparison mode and retained behind the model until returning to the room |
| Individual object photos | `resource/images/main_scene/` | Reference photos for models and removed room hotspots |
| Cabinet door animation originals | `resource/images/opening_door/IMG_20261018_154726.jpg` through `IMG_20261018_154815.jpg` (11 files, in timestamp order) | Earlier unused reference sequence; originals retained and ignored |
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
