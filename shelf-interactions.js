import * as THREE from 'three';

// The supplied GLB is a fused mesh. These local-space regions separate its
// visible contents without changing the source asset. Recalibrate if replaced.
// Bounds: left, bottom, right, top. Shelf boards and the hanging rail are scenery.
export const shelfItems = [
  ['dripper', 'Coffee dripper', [-.43, .61, -.12, .96]],
  ['jar', 'White storage jar', [-.10, .60, .19, .83]],
  ['pitcher', 'Metal pitcher', [.25, .60, .51, .85]],
  ['dotted-mug', 'Dotted mug', [-.70, .27, -.40, .50]],
  ['striped-mug', 'Green striped mug', [-.40, .27, -.15, .50]],
  ['blue-mug', 'Blue mug', [-.15, .27, .13, .54]],
  ['dark-cup', 'Dark cup and saucer', [.13, .26, .39, .46]],
  ['teacup', 'Patterned teacup and saucer', [.39, .26, .73, .45]],
  ['tin', 'Tall illustrated tin', [-.62, -.17, -.41, .15]],
  ['canister', 'Square canister', [-.41, -.17, -.22, .05]],
  ['white-bag', 'White coffee bag', [-.22, -.18, .19, .11]],
  ['beige-bag', 'Beige coffee bag', [.19, -.18, .56, .14]],
  ['small-jar', 'Small clear jar', [.56, -.18, .66, .03]],
  ['hanging-left', 'Hanging cup 1', [-.34, -.95, -.04, -.59]],
  ['hanging-middle-left', 'Hanging cup 2', [-.04, -.95, .18, -.59]],
  ['hanging-middle-right', 'Hanging cup 3', [.18, -.95, .42, -.59]],
  ['hanging-right', 'Hanging cup 4', [.42, -.95, .71, -.59]],
].map(([id, label, bounds]) => ({ id, label, bounds }));

function contains(item, point) {
  const [left, bottom, right, top] = item.bounds;
  return point.x >= left && point.x < right && point.y >= bottom && point.y < top
    && point.z > (item.minDepth ?? -.10) && point.z < (item.maxDepth ?? Infinity);
}

export function addShelfInteractions(model, onHover) {
  return addModelItemInteractions(model, shelfItems, onHover);
}

export function addModelItemInteractions(model, items, onHover) {
  const surfaces = [];
  model.traverse(object => { if (object.isMesh) surfaces.push(object); });
  const group = new THREE.Group();
  group.name = 'model-object-glows';
  const overlays = new Map();
  const positions = items.map(() => []);
  const normals = items.map(() => []);
  const center = new THREE.Vector3();
  const point = new THREE.Vector3();
  const normal = new THREE.Vector3();
  // Work in model-local coordinates, including any nested mesh transforms.
  model.updateMatrixWorld(true);
  const inverse = model.matrixWorld.clone().invert();
  surfaces.forEach(surface => {
    const transform = inverse.clone().multiply(surface.matrixWorld);
    const normalTransform = new THREE.Matrix3().getNormalMatrix(transform);
    const geometry = surface.geometry;
    const p = geometry.attributes.position;
    const n = geometry.attributes.normal;
    const indices = geometry.index;
    const count = indices ? indices.count : p.count;
    for (let i = 0; i < count; i += 3) {
      const triangle = [0, 1, 2].map(j => indices ? indices.getX(i + j) : i + j);
      center.set(0, 0, 0);
      triangle.forEach(index => center.add(point.fromBufferAttribute(p, index).applyMatrix4(transform)));
      center.multiplyScalar(1 / 3);
      const item = items.findIndex(item => contains(item, center));
      if (item < 0) continue;
      if (items[item].strictBounds && triangle.some(index =>
        !contains(items[item], point.fromBufferAttribute(p, index).applyMatrix4(transform)))) continue;
      triangle.forEach(index => {
        point.fromBufferAttribute(p, index).applyMatrix4(transform);
        normal.fromBufferAttribute(n, index).applyMatrix3(normalTransform).normalize();
        positions[item].push(...point.toArray());
        normals[item].push(...normal.toArray());
      });
    }
  });
  const material = new THREE.ShaderMaterial({
    uniforms: { expansion: { value: .004 }, strength: { value: .65 } },
    vertexShader: `uniform float expansion; varying vec3 vNormal; varying vec3 vView;
      void main() { vec4 p = modelViewMatrix * vec4(position + normal * expansion, 1.0);
        vNormal = normalize(normalMatrix * normal); vView = -p.xyz;
        gl_Position = projectionMatrix * p; }`,
    fragmentShader: `uniform float strength; varying vec3 vNormal; varying vec3 vView;
      void main() { float rim = pow(1.0 - abs(dot(normalize(vNormal), normalize(vView))), 2.0);
        gl_FragColor = vec4(1.0, .66, .18, strength * (.22 + .78 * rim)); }`,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1,
    toneMapped: false,
  });
  items.forEach((item, index) => {
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions[index], 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals[index], 3));
    const overlay = new THREE.Group();
    overlay.name = item.id;
    overlay.add(new THREE.Mesh(geometry, material));
    const halo = material.clone();
    halo.uniforms.expansion.value = .014;
    halo.uniforms.strength.value = .23;
    overlay.add(new THREE.Mesh(geometry, halo));
    overlay.visible = false;
    overlays.set(item.id, overlay);
    group.add(overlay);
  });
  model.add(group);
  let hovered = null;
  let focused = null;
  let selected = null;
  let active = false;
  function refresh() {
    const id = hovered ?? focused ?? selected;
    overlays.forEach((overlay, key) => { overlay.visible = active && key === id; });
  }
  function pick(raycaster) {
    const hit = raycaster?.intersectObjects(surfaces, false)[0];
    if (!hit) return null;
    model.worldToLocal(point.copy(hit.point));
    return items.find(item => contains(item, point))?.id ?? null;
  }
  return {
    pick,
    updateHover(raycaster) {
      const id = pick(raycaster);
      if (id !== hovered) { hovered = id; onHover(id); }
      refresh();
    },
    focus(id) { focused = id; refresh(); },
    select(id) { selected = id; refresh(); },
    setActive(value) {
      active = value;
      hovered = focused = null;
      if (!value) onHover(null);
      refresh();
    },
  };
}
