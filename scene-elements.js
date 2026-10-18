// Bounds use percentages shared by the cartoon and real 4:3 room images.
// Alternate photos share their physical object's hotspot.
export const elements = [
  { id: 'pegboard', label: 'Pegboard', bounds: [35.5, 18.8, 14.3, 12.8], marker: [50, 50], model: 'resource/model/pegboard.optimized.glb' },
  { id: 'grinder', label: 'Grinder', bounds: [44.2, 40.8, 4.8, 12.6], marker: [50, 50], model: 'resource/model/grinder/grinder.optimized.glb' },
  { id: 'espresso', label: 'Espresso machine', bounds: [26.8, 36.6, 11.8, 16.9], marker: [50, 50], model: 'resource/model/espresso.optimized.glb' },
  { id: 'cabinet-top', label: 'Cabinet top', bounds: [49.7, 29.5, 23, 9], marker: [52, 50], model: 'resource/model/display_shelf/top/cabinet-top.optimized.glb', text: 'resource/text/cabinet_top/text' },
  { id: 'display-left', label: 'Cabinet left', bounds: [50.3, 43.8, 9.8, 8], marker: [45, 60], model: 'resource/model/display_shelf/left/cabinet-left.optimized.glb', text: 'resource/text/cabinet_left/text' },
  { id: 'display-right', label: 'Cabinet right', bounds: [60.4, 46.4, 12, 5.3], marker: [50, 50], model: 'resource/model/display_shelf/right/cabinet-right.optimized.glb', text: 'resource/text/cabinet_right/text' },
  { id: 'cabinet-doors', label: 'Cabinet doors', bounds: [50.2, 52.3, 22.5, 22.5], marker: [50, 50], animation: {
    completionPhoto: { id: 'cabinet-card', label: 'Card', text: 'resource/text/cabinet_doors/text', photos: [
      { src: 'resource/images/props/card.jpeg', width: 1024, height: 1536 },
    ] },
    fps: 6,
    playLabel: 'Play opening',
    hint: 'Watch the door open, or replay it. Esc returns to the room.',
    labels: { start: 'Cabinet doors closed', during: 'Cabinet door opening', end: 'Cabinet door open' },
    frames: ['154726', '154732', '154739', '154744', '154748', '154753', '154758', '154802', '154806', '154811', '154815']
      .map(time => `resource/images/opening_door/web/IMG_20261018_${time}.jpg`),
  } },
  { id: 'cabinet-bottom', label: 'Beneath the cabinet', bounds: [50.2, 75.5, 23, 12.9], marker: [50, 60], text: 'resource/text/beneath_the_cabinet/text', animation: {
    fps: 2,
    pauseOnHover: true,
    loop: true,
    playLabel: 'Play animation',
    hint: 'Hover over the cat image to pause; move away to resume. Esc returns to the room.',
    labels: { start: 'Beneath the cabinet before the cat enters', during: 'Cat moving beneath the cabinet', end: 'Final frame of the cat animation' },
    frames: Array.from({ length: 13 }, (_, index) => `resource/images/cat/web/${index}.jpg`),
  } },
  { id: 'shelf', label: 'Photo shelves', bounds: [13.2, 20.5, 17.2, 29], marker: [28, 30], model: 'resource/model/shelf.optimized.glb', text: 'resource/text/photo_shelves/text' },
];
