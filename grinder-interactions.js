import { addButtonGlow } from './espresso-glow.js';

// Original grinder GLB coordinates: the silver button on the lower-right side.
export const grinderButton = {
  id: 'grinder-button', label: 'Grinder button',
  point: [.31164, -.75419, -.06059], normal: [.88946, -.04691, .45460],
  size: .12, radius: .045,
};

export function addGrinderInteractions(model, onHover) {
  return addButtonGlow(model, grinderButton, onHover);
}
