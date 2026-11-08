import { addModelItemInteractions } from './shelf-interactions.js?v=20261108-soft-glow';
import { photoAlbums } from './photo-albums.js?v=20261108-password-gate';

// Regions are in each loaded model's original scene coordinates. Preserve the
// current GLBs or recalibrate these bounds when replacing/optimizing them again.
export const cabinetPhotoItems = {
  'cabinet-top': {
    id: 'cabinet-vase', label: 'Vase',
    bounds: [.17, -.96, .565, .10], minDepth: -Infinity, strictBounds: true,
    photos: photoAlbums['cabinet-vase'] ?? [],
  },
  'display-left': {
    id: 'cabinet-can', label: 'Beer can',
    bounds: [-.955, -.576, -.605, .20], minDepth: -Infinity, strictBounds: true,
    photos: photoAlbums['cabinet-can'] ?? [],
  },
  'display-right': {
    id: 'cabinet-photo-frame', label: 'Photo frame',
    bounds: [-1.01, -.405, -.315, .305], minDepth: -Infinity, maxDepth: -.20,
    strictBounds: true,
    photos: photoAlbums['cabinet-photo-frame'] ?? [],
  },
};

export function addCabinetInteractions(model, modelId, onHover) {
  return addModelItemInteractions(model, [cabinetPhotoItems[modelId]], onHover);
}
