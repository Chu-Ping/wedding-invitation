// Local preparation only. See README.md for pinned packages and invocation.
import { createRequire } from 'node:module';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import fs from 'node:fs/promises';
import { spawn } from 'node:child_process';

const root = fileURLToPath(new URL('../', import.meta.url));
const toolsDir = path.resolve(root, process.argv[2] || '.local-preview/model-tools');
const resolve = createRequire(path.join(toolsDir, 'package.json')).resolve;
const load = name => import(pathToFileURL(resolve(name)).href);
const [{ NodeIO }, { ALL_EXTENSIONS }, transforms, meshoptimizer] = await Promise.all([
  load('@gltf-transform/core'), load('@gltf-transform/extensions'),
  load('@gltf-transform/functions'), load('meshoptimizer'),
]);
const { weld, simplify, meshopt, prune } = transforms;
function resizeTexture(bytes) {
  return new Promise((resolve, reject) => {
    const process = spawn('python', [path.join(root, 'scripts/resize-model-texture.py')], { windowsHide: true });
    const chunks = [];
    let errors = '';
    process.stdout.on('data', chunk => chunks.push(chunk));
    process.stderr.on('data', chunk => { errors += chunk; });
    process.on('error', reject);
    process.on('close', code => code === 0 ? resolve(new Uint8Array(Buffer.concat(chunks))) : reject(new Error(errors)));
    process.stdin.end(bytes);
  });
}
const { MeshoptEncoder, MeshoptDecoder, MeshoptSimplifier } = meshoptimizer;
await Promise.all([MeshoptEncoder.ready, MeshoptDecoder.ready, MeshoptSimplifier.ready]);
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'meshopt.encoder': MeshoptEncoder, 'meshopt.decoder': MeshoptDecoder,
});
const models = [
  { name: 'Cabinet top', folder: 'resource/model/display_shelf/top', source: 'Meshy_AI_Shelf_of_Memories_1018141613_texture.glb', output: 'cabinet-top.optimized.glb', target: 400000 },
  { name: 'Cabinet right', folder: 'resource/model/display_shelf/right', source: 'Meshy_AI_Miniature_Memories_1018130130_texture.glb', output: 'cabinet-right.optimized.glb', target: 250000 },
];
function triangles(document) {
  return document.getRoot().listMeshes().reduce((sum, mesh) => sum + mesh.listPrimitives()
    .reduce((sum, primitive) => sum + (primitive.getIndices()?.getCount()
      ?? primitive.getAttribute('POSITION').getCount()) / 3, 0), 0);
}
export async function optimizeModels(models, reportPath) {
  const report = [];
  for (const model of models) {
    const folder = path.join(root, model.folder);
    const input = path.join(folder, model.source);
    const output = path.join(folder, model.output);
    console.log(`Reading ${model.name}…`);
    const document = await io.read(input);
    const beforeTriangles = triangles(document);
    await document.transform(
      weld(),
      simplify({ simplifier: MeshoptSimplifier, ratio: model.target / beforeTriangles, error: .005 }),
      prune(),
    );
    for (const texture of document.getRoot().listTextures()) {
      texture.setImage(await resizeTexture(texture.getImage())).setMimeType('image/jpeg');
    }
    const afterTriangles = triangles(document);
    await document.transform(meshopt({ encoder: MeshoptEncoder, level: 'high' }));
    await io.write(output, document);
    // Read back the compressed result through its actual decoder as a sanity check.
    const decoded = await io.read(output);
    if (triangles(decoded) !== afterTriangles) throw new Error('Triangle count changed during encoding');
    const entry = {
      name: model.name,
      source: path.relative(root, input).replaceAll('\\', '/'),
      output: path.relative(root, output).replaceAll('\\', '/'),
      sourceBytes: (await fs.stat(input)).size,
      outputBytes: (await fs.stat(output)).size,
      sourceTriangles: beforeTriangles,
      outputTriangles: afterTriangles,
      targetTriangles: model.target,
      textures: decoded.getRoot().listTextures().map(texture => ({ size: texture.getSize(), mimeType: texture.getMimeType() })),
    };
    report.push(entry);
    console.log(JSON.stringify(entry, null, 2));
  }
  await fs.writeFile(path.join(root, reportPath), JSON.stringify(report, null, 2) + '\n');
  return report;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await optimizeModels(models, 'resource/model/display_shelf/optimization-report.json');
}
