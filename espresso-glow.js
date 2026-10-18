import * as THREE from 'three';

// Center button measured on the supplied espresso.glb, in its original coordinates.
// Keep this calibration separate so a replacement model can be adjusted here.
export const espressoCenterButton = { id: 'center-button', label: 'Center button' };
export function addEspressoButtonGlow(model, onHover = () => {}) {
  return addButtonGlow(model, {
    ...espressoCenterButton, point: [.03287, .30286, .56274],
    normal: [0, .51, .86], size: .17, radius: .05,
  }, onHover);
}

export function addButtonGlow(model, button, onHover = () => {}) {
  const surfaces = [];
  model.traverse(object => { if (object.isMesh) surfaces.push(object); });
  // A soft ring preserves the photographed button details at its center.
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const context = canvas.getContext('2d');
  const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
  for (const [stop, color] of [
    [0, 'rgba(255, 218, 120, 0.04)'],
    [.35, 'rgba(255, 218, 120, 0.10)'],
    [.48, 'rgba(255, 234, 169, 0.85)'],
    [.58, 'rgba(255, 199, 78, 0.48)'],
    [.8, 'rgba(255, 190, 68, 0.12)'],
    [1, 'rgba(255, 190, 68, 0)'],
  ]) gradient.addColorStop(stop, color);
  context.fillStyle = gradient;
  context.fillRect(0, 0, 256, 256);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.MeshBasicMaterial({
    map: texture, transparent: true, opacity: .75,
    depthWrite: false, depthTest: true, toneMapped: false,
    side: THREE.FrontSide,
  });
  const geometry = new THREE.PlaneGeometry(button.size, button.size);
  const panelNormal = new THREE.Vector3(...button.normal).normalize();
  const group = new THREE.Group();
  group.name = `${button.id}-glow`;
  [button.point].forEach((point, index) => {
    const halo = new THREE.Mesh(geometry, material);
    halo.name = `button-glow-${index + 1}`;
    halo.visible = false;
    halo.position.fromArray(point).addScaledVector(panelNormal, .004);
    halo.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), panelNormal);
    group.add(halo);
  });
  model.add(group);
  const hitPoint = new THREE.Vector3();
  const center = new THREE.Vector3(...button.point);
  let active = false;
  let hovered = false;
  let focused = false;
  function refresh() { group.children[0].visible = active && (hovered || focused); }
  function pick(raycaster) {
    const hit = raycaster?.intersectObjects(surfaces, false)[0];
    if (!hit) return null;
    model.worldToLocal(hitPoint.copy(hit.point));
    return hitPoint.distanceToSquared(center) < button.radius ** 2 ? button.id : null;
  }
  return {
    pick,
    updateHover(raycaster) {
      const next = Boolean(pick(raycaster));
      if (next !== hovered) onHover(next ? button.id : null);
      hovered = next;
      refresh();
    },
    focus(id) { focused = id === button.id; refresh(); },
    select() {}, // Selection feedback is provided by the viewer; glow remains hover/focus-only.
    setActive(value) {
      active = value;
      hovered = focused = false;
      onHover(null);
      refresh();
    },
  };
}
