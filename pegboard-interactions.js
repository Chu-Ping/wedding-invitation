import { addModelItemInteractions } from './shelf-interactions.js';

// Calibrated in the original pegboard.glb coordinates. The depth threshold
// separates the coffee bag from the board behind it, including through holes.
export const coffeeBag = {
  id: 'coffee-bag', label: 'Coffee bag',
  bounds: [-.745, -.485, -.095, .115], minDepth: -.12, maxDepth: .02,
  strictBounds: true,
};

export function addPegboardInteractions(model, onHover) {
  return addModelItemInteractions(model, [coffeeBag], onHover);
}
