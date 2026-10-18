// Same local pipeline as the two cabinet models. Preserve every source GLB.
import { optimizeModels } from './optimize-cabinet-models.mjs';

await optimizeModels([
  { name: 'Espresso machine', folder: 'resource/model', source: 'espresso.glb', output: 'espresso.optimized.glb', target: 250000 },
  { name: 'Pegboard', folder: 'resource/model', source: 'pegboard.glb', output: 'pegboard.optimized.glb', target: 300000 },
  { name: 'Photo shelves', folder: 'resource/model', source: 'shelf.glb', output: 'shelf.optimized.glb', target: 300000 },
  { name: 'Grinder', folder: 'resource/model/grinder', source: 'Meshy_AI_Morning_Grind_Setup_1018174904_texture.glb', output: 'grinder.optimized.glb', target: 180000 },
  { name: 'Cabinet left', folder: 'resource/model/display_shelf/left', source: 'Meshy_AI_Brews_and_Spicy_Noodl_1018125201_texture.glb', output: 'cabinet-left.optimized.glb', target: 250000 },
], 'resource/model/optimization-report.json');
