import { addModelItemInteractions } from './shelf-interactions.js';
import { shelfPhotoSets } from './shelf-photos.js?v=20261018-albums-68';

function photo(name) {
  const match = shelfPhotoSets.flat().find(photo => photo.src.endsWith(`/${name}.jpg`));
  if (!match) throw new Error(`Missing cabinet gallery photo: ${name}`);
  return match;
}

// Regions are in each loaded model's original scene coordinates. Preserve the
// current GLBs or recalibrate these bounds when replacing/optimizing them again.
export const cabinetPhotoItems = {
  'cabinet-top': {
    id: 'cabinet-vase', label: 'Vase',
    bounds: [.17, -.96, .565, .10], minDepth: -Infinity, strictBounds: true,
    photos: [...shelfPhotoSets[3], ...shelfPhotoSets[23]],
  },
  'display-left': {
    id: 'cabinet-can', label: 'Beer can',
    bounds: [-.955, -.576, -.605, .20], minDepth: -Infinity, strictBounds: true,
    photos: [
      ...shelfPhotoSets[5], ...shelfPhotoSets[7], photo('15-0'), photo('16-1'),
      ...[18, 20, 21, 23, 25, 28].flatMap(number => shelfPhotoSets[number - 1]),
    ],
  },
  'display-right': {
    id: 'cabinet-photo-frame', label: 'Photo frame',
    bounds: [-1.01, -.405, -.315, .305], minDepth: -Infinity, maxDepth: -.20,
    strictBounds: true,
    photos: shelfPhotoSets[0],
  },
};

export function addCabinetInteractions(model, modelId, onHover) {
  return addModelItemInteractions(model, [cabinetPhotoItems[modelId]], onHover);
}
