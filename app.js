import { elements } from './scene-elements.js?v=20261018-optimized';
import { createShelfGallery } from './shelf-gallery.js?v=20261018-start-fix';
import { createItemRewards, itemRewards } from './item-rewards.js';

const stage = document.querySelector('#stage');
const room = document.querySelector('#room');
const hotspots = document.querySelector('#hotspots');
const objectList = document.querySelector('#object-list');
const photoView = document.querySelector('#photo-view');
const detailPhoto = document.querySelector('#detail-photo');
const photoTitle = document.querySelector('#photo-title');
const photoVariants = document.querySelector('#photo-variants');
const animationCanvas = document.querySelector('#animation-canvas');
const animationControls = document.querySelector('#animation-controls');
const animationPlay = document.querySelector('#animation-play');
const modelView = document.querySelector('#model-view');
const canvasHost = document.querySelector('#model-canvas');
const backdrop = document.querySelector('#backdrop');
const detailModeButton = document.querySelector('#detail-mode-button');
const shelfPanel = document.querySelector('#shelf-objects');
const pegboardPanel = document.querySelector('#pegboard-objects');
const grinderPanel = document.querySelector('#grinder-objects');
const espressoPanel = document.querySelector('#espresso-objects');
const cabinetPanel = document.querySelector('#cabinet-objects');
const modelCopy = document.querySelector('#model-copy');
const animationCopy = document.querySelector('#animation-copy');
let modelText = '';
let animationText = '';
const backdropSources = {
  cartoon: 'resource/images/main_scene/whole_scene_cartoon.png',
  real: 'resource/images/main_scene/whole_scene.jpg',
};
let backdropRequest = 0;
const backButton = document.querySelector('#back-button');
const retryButton = document.querySelector('#retry-button');
const statusPanel = document.querySelector('#status-panel');
const status = document.querySelector('#status');
const hint = document.querySelector('#scene-hint');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const visitedElements = new Set();
const acquiredItems = new Set();
const roomControls = new Map();

function isElementUnlocked(element) {
  if (element.id === 'grinder') return acquiredItems.has('coffee-bean');
  if (element.id === 'espresso') return acquiredItems.has('coffee-bean') && visitedElements.has('grinder');
  if (element.id === 'cabinet-top') return acquiredItems.has('coffee-mug');
  const index = elements.findIndex(item => item.id === element.id);
  return index === 0 || (index > 0 && visitedElements.has(elements[index - 1].id));
}

function markElementVisited(element) {
  visitedElements.add(element.id);
  updateRoomAvailability();
}

function updateRoomAvailability() {
  elements.forEach(item => {
    const locked = !isElementUnlocked(item);
    roomControls.get(item.id).forEach(control => { control.hidden = locked; });
  });
}
let session = 0;
let viewer;
let loading;
let returnFocus;
let retryAction;
let photoZoomFinished = Promise.resolve();
let animationPlayer;
let activeAnimationId;
const animationPlayers = new Map();
const galleryDialog = document.querySelector('#shelf-gallery');
const shelfGallery = createShelfGallery(galleryDialog, {
  onOpen: () => viewer?.setActive(false),
  onClose: () => viewer?.setActive(stage.dataset.state === 'model' && stage.dataset.detailMode !== 'image'),
});
const rewardDialog = document.querySelector('#item-reward');
const rewardPopup = createItemRewards(rewardDialog, {
  onOpen: () => viewer?.setActive(false),
  onClose: () => viewer?.setActive(stage.dataset.state === 'model' && stage.dataset.detailMode !== 'image'),
  onAcquire: reward => {
    acquiredItems.add(reward.id);
    updateRoomAvailability();
    viewer?.refreshRewardControls();
  },
});

function openItemReward(reward) {
  if (reward.requires && !acquiredItems.has(reward.requires)) return;
  rewardPopup.open(reward);
}

function setDetailMode(mode) {
  const imageMode = mode === 'image';
  stage.dataset.detailMode = mode;
  canvasHost.hidden = imageMode;
  detailModeButton.disabled = false;
  detailModeButton.textContent = imageMode ? 'Show model' : 'Show room image';
  detailModeButton.setAttribute('aria-pressed', String(imageMode));
  viewer?.setActive(!imageMode && stage.dataset.state === 'model');
  shelfPanel.hidden = imageMode || stage.dataset.state !== 'model' || modelView.dataset.model !== 'shelf';
  pegboardPanel.hidden = imageMode || stage.dataset.state !== 'model' || modelView.dataset.model !== 'pegboard';
  grinderPanel.hidden = imageMode || stage.dataset.state !== 'model' || modelView.dataset.model !== 'grinder';
  espressoPanel.hidden = imageMode || stage.dataset.state !== 'model' || modelView.dataset.model !== 'espresso';
  cabinetPanel.hidden = imageMode || stage.dataset.state !== 'model' || !['cabinet-top', 'display-left', 'display-right'].includes(modelView.dataset.model);
  modelCopy.hidden = imageMode || stage.dataset.state !== 'model' || !modelText;
}

async function loadElementText(element, thisSession) {
  if (!element.text) return;
  try {
    // Re-read on entry so editing the UTF-8 file requires no manifest rebuild.
    const response = await fetch(element.text, { cache: 'no-cache' });
    if (!response.ok) throw new Error(`Text request returned ${response.status}`);
    const text = (await response.text()).replace(/^\uFEFF/, '').trim();
    if (session !== thisSession) return;
    if (element.animation) {
      animationText = text;
      animationCopy.textContent = text;
      animationCopy.hidden = stage.dataset.state !== 'animation' || !text;
    } else {
      modelText = text;
      modelCopy.textContent = text;
      modelCopy.hidden = stage.dataset.state !== 'model' || stage.dataset.detailMode === 'image' || !text;
    }
  } catch (error) {
    // Optional copy must never prevent the model from opening.
    if (session === thisSession) console.warn(`Could not load text for ${element.label}:`, error);
  }
}

function applyBackdrop(style) {
  backdrop.src = backdropSources[style];
  backdrop.dataset.style = style;
  backdrop.alt = style === 'cartoon'
    ? 'A block-style cartoon room with coffee equipment, wall shelves, a side cabinet and a large plant.'
    : 'A room photograph with coffee equipment, wall shelves, a side cabinet and a large plant.';
}

async function showRoomImage() {
  const request = ++backdropRequest;
  const thisSession = session;
  setStatus('Loading room image…');
  detailModeButton.disabled = true;
  try {
    const image = new Image();
    image.src = backdropSources.real;
    await image.decode();
    if (request !== backdropRequest || session !== thisSession) return;
    applyBackdrop('real');
    setDetailMode('image');
    setStatus('');
  } catch (error) {
    if (request !== backdropRequest || session !== thisSession) return;
    retryAction = showRoomImage;
    setStatus('The room image could not load. Try again, or return to the room.', true);
  } finally {
    if (request === backdropRequest) detailModeButton.disabled = false;
  }
}

detailModeButton.addEventListener('click', () => {
  if (stage.dataset.detailMode === 'image') setDetailMode('model');
  else showRoomImage();
});

elements.forEach((element, index) => {
  const number = String(element.number ?? index + 1).padStart(2, '0');
  const button = document.createElement('button');
  button.id = `${element.id}-hotspot`;
  button.type = 'button';
  button.className = 'hotspot';
  button.setAttribute('aria-label', `${element.label}${element.animation ? ' animation' : ''}`);
  button.setAttribute('aria-controls', element.model ? 'model-view' : 'photo-view');
  const [left, top, width, height] = element.bounds;
  Object.assign(button.style, { left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` });
  button.style.setProperty('--marker-x', `${element.marker[0]}%`);
  button.style.setProperty('--marker-y', `${element.marker[1]}%`);
  button.innerHTML = `<span class="hotspot-label" aria-hidden="true">${element.label}</span>`;
  button.addEventListener('click', () => openElement(element, button));
  hotspots.append(button);
  const listButton = document.createElement('button');
  listButton.type = 'button';
  listButton.dataset.element = element.id;
  listButton.innerHTML = `<span class="object-number" aria-hidden="true">${number}</span>${element.label}`;
  listButton.setAttribute('aria-controls', element.model ? 'model-view' : 'photo-view');
  listButton.addEventListener('click', () => openElement(element, listButton));
  objectList.append(listButton);
  roomControls.set(element.id, [button, listButton]);
  button.hidden = listButton.hidden = !isElementUnlocked(element);
});

function openElement(element, source) {
  if (stage.dataset.state !== 'room' || !isElementUnlocked(element)) return;
  returnFocus = source;
  room.inert = true;
  objectList.hidden = true;
  if (element.model) return openModel(element);
  if (element.animation) return openAnimation(element);
  animationCanvas.hidden = true;
  animationControls.hidden = true;
  stage.dataset.state = 'opening-photo';
  backButton.hidden = false;
  photoView.hidden = true;
  backButton.focus({ preventScroll: true });
  photoZoomFinished = zoomRoom(element);
  photoTitle.textContent = element.label;
  hint.textContent = 'View the photo, then return to explore another object.';
  hint.hidden = false;
  photoVariants.replaceChildren();
  photoVariants.hidden = element.photos.length < 2;
  element.photos.forEach(([file, label], index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = label;
    button.addEventListener('click', () => showPhoto(element, index));
    photoVariants.append(button);
  });
  showPhoto(element, 0);
}

async function openAnimation(element) {
  const thisSession = ++session;
  animationText = '';
  animationCopy.textContent = '';
  animationCopy.hidden = true;
  void loadElementText(element, thisSession);
  stage.dataset.state = 'opening-animation';
  photoView.hidden = true;
  detailPhoto.hidden = true;
  animationCanvas.hidden = true;
  photoVariants.hidden = true;
  animationControls.hidden = true;
  backButton.hidden = false;
  backButton.focus({ preventScroll: true });
  photoTitle.textContent = element.label;
  retryAction = () => openAnimation(element);
  setStatus(`Loading ${element.label} animation…`);
  const zoomFinished = zoomRoom(element);
  try {
    if (!animationPlayers.has(element.id)) {
      const pending = import('./frame-animation.js').then(({ createFrameAnimation }) =>
        createFrameAnimation(animationCanvas, element.animation, ({ playing, ended }) => {
          if (activeAnimationId !== element.id) return;
          animationPlay.textContent = playing ? 'Pause' : ended ? 'Play again' : element.animation.playLabel;
        }, () => {
          if (activeAnimationId !== element.id || stage.dataset.state !== 'animation') return;
          if (element.animation.completionPhoto) shelfGallery.open(element.animation.completionPhoto, undefined, { origin: animationCanvas });
        })).catch(error => { animationPlayers.delete(element.id); throw error; });
      animationPlayers.set(element.id, pending);
    }
    const player = await animationPlayers.get(element.id);
    await zoomFinished;
    if (session !== thisSession) return;
    animationPlayer?.pause();
    activeAnimationId = element.id;
    animationPlayer = player;
    animationPlayer.reset();
    animationCanvas.dataset.animation = element.id;
    animationCanvas.hidden = false;
    animationControls.hidden = false;
    photoView.hidden = false;
    stage.dataset.state = 'animation';
    animationCopy.hidden = !animationText;
    markElementVisited(element);
    animationPlayer.setHovered(animationCanvas.matches(':hover'));
    setStatus('');
    hint.textContent = element.animation.hint;
    hint.hidden = false;
    photoTitle.focus({ preventScroll: true });
    if (!reducedMotion.matches && !document.hidden) animationPlayer.play();
  } catch (error) {
    if (session !== thisSession) return;
    setStatus('The animation could not load. Try again, or return to the room.', true);
  }
}

animationPlay.addEventListener('click', () => animationPlayer?.toggle());
animationCanvas.addEventListener('pointerenter', event => {
  if (event.pointerType !== 'touch' && stage.dataset.state === 'animation') animationPlayer?.setHovered(true);
});
animationCanvas.addEventListener('pointerleave', () => animationPlayer?.setHovered(false));
document.querySelector('#animation-replay').addEventListener('click', () => animationPlayer?.replay());
document.addEventListener('visibilitychange', () => { if (document.hidden) animationPlayer?.pause(); });
reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) animationPlayer?.pause(); });

async function showPhoto(element, index) {
  const thisSession = ++session;
  const [file, label] = element.photos[index];
  retryAction = () => showPhoto(element, index);
  detailPhoto.hidden = true;
  photoTitle.textContent = label;
  setStatus('Loading photo…');
  [...photoVariants.children].forEach((button, i) => button.setAttribute('aria-current', String(i === index)));
  try {
    const image = new Image();
    image.src = `resource/images/main_scene/${file}`;
    // Decode while the room zooms, then cut only when both are ready.
    await Promise.all([image.decode(), photoZoomFinished]);
    if (session !== thisSession) return;
    const entering = stage.dataset.state === 'opening-photo';
    detailPhoto.src = image.src;
    detailPhoto.alt = label;
    detailPhoto.hidden = false;
    photoView.hidden = false;
    stage.dataset.state = 'photo';
    markElementVisited(element);
    setStatus('');
    if (entering) photoTitle.focus({ preventScroll: true });
  } catch (error) {
    if (session !== thisSession) return;
    setStatus('This photo could not load. Try again, or return to the room.', true);
  }
}

function setStatus(message, canRetry = false) {
  status.textContent = message;
  statusPanel.hidden = !message;
  retryButton.hidden = !canRetry;
}

// Coordinates are fractions shared by the cartoon and original 4:3 room images.
// Keep the full image visible so both the hotspot and zoom remain aligned.
function zoomRoom(element) {
  let scale = 3.8;
  let focus = { x: .327, y: .45 };
  if (element) {
    const [left, top, width, height] = element.bounds;
    focus = { x: (left + width / 2) / 100, y: (top + height / 2) / 100 };
    // Fit the selected region with some surrounding room for context.
    scale = Math.max(1.3, Math.min(4.5, 75 / Math.max(width, height)));
  }
  // Keep the enlarged photograph covering the stage, including edge objects.
  const clampOffset = value => Math.max(1 - scale, Math.min(0, value));
  const x = clampOffset(.5 - focus.x * scale);
  const y = clampOffset(.5 - focus.y * scale);
  room.style.transform = `translate(${x * 100}%, ${y * 100}%) scale(${scale})`;
  const duration = reducedMotion.matches ? 0 : parseFloat(getComputedStyle(room).transitionDuration) * 1000;
  return new Promise(resolve => setTimeout(resolve, duration));
}

async function createViewer() {
  const THREE = await import('three');
  const [{ GLTFLoader }, { OrbitControls }, { RoomEnvironment }, { addEspressoButtonGlow, espressoCenterButton }, { addShelfInteractions, shelfItems }, { MeshoptDecoder }, { addPegboardInteractions, coffeeBag }, { addCabinetInteractions, cabinetPhotoItems }, { addGrinderInteractions, grinderButton }] = await Promise.all([
    import('three/addons/loaders/GLTFLoader.js'),
    import('three/addons/controls/OrbitControls.js'),
    import('three/addons/environments/RoomEnvironment.js'),
    import('./espresso-glow.js'),
    import('./shelf-interactions.js'),
    import('./vendor/meshoptimizer/meshopt_decoder.js'),
    import('./pegboard-interactions.js'),
    import('./cabinet-interactions.js?v=20261018-albums-68'),
    import('./grinder-interactions.js'),
  ]);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = .819; // 30% below 1.17, shared by every model.
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(35, 1, .01, 100);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enablePan = false;
  controls.minDistance = 1.5;
  controls.maxDistance = 9;
  controls.minPolarAngle = .15;
  controls.maxPolarAngle = Math.PI * .85;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const environment = new RoomEnvironment();
  const environmentMap = pmrem.fromScene(environment, .04);
  scene.environment = environmentMap.texture;
  environment.dispose();
  pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xffffff, 0xa6a18e, 2));
  const light = new THREE.DirectionalLight(0xfff4de, 3);
  light.position.set(3, 4, 5);
  scene.add(light);

  // Keep one renderer and load/cache each model only when requested.
  const models = new Map();
  const loader = new GLTFLoader().setMeshoptDecoder(MeshoptDecoder);
  let model;
  let framingBounds;
  let itemInteraction;
  const shelfButtons = document.querySelector('#shelf-object-buttons');
  const shelfSelection = document.querySelector('#shelf-selection');
  const coffeeBagButton = document.querySelector('#coffee-bag-button');
  const pegboardSelection = document.querySelector('#pegboard-selection');
  const espressoButton = document.querySelector('#espresso-center-button');
  const espressoSelection = document.querySelector('#espresso-selection');
  const grinderControl = document.querySelector('#grinder-button');
  const grinderSelection = document.querySelector('#grinder-selection');
  const cabinetButtons = document.querySelector('#cabinet-object-buttons');
  function refreshRewardControls() {
    const beans = acquiredItems.has('coffee-bean');
    const mug = acquiredItems.has('coffee-mug');
    const grounds = acquiredItems.has('coffee-ground');
    grinderControl.setAttribute('aria-pressed', String(grounds));
    grinderSelection.textContent = grounds ? 'Coffee grounds acquired' : '';
    coffeeBagButton.setAttribute('aria-pressed', String(beans));
    espressoButton.setAttribute('aria-pressed', String(mug));
    pegboardSelection.textContent = beans ? 'Coffee bean acquired' : '';
    espressoSelection.textContent = mug ? 'Coffee mug acquired' : '';
  }
  function selectModelItem(id) {
    if (!active || !itemInteraction) return;
    if (modelView.dataset.model === 'shelf') return selectShelfItem(id);
    const cabinetItem = cabinetPhotoItems[modelView.dataset.model];
    if (cabinetItem?.id === id) {
      itemInteraction.select(id);
      cabinetButtons.querySelector('button').setAttribute('aria-pressed', 'true');
      render();
      document.querySelector('#cabinet-selection').textContent = `Selected: ${cabinetItem.label}`;
      if (cabinetItem.photos) shelfGallery.open(cabinetItem);
      return;
    }
    if (modelView.dataset.model === 'espresso' && id === espressoCenterButton.id) {
      openItemReward(itemRewards.coffeeMug);
      return;
    }
    if (modelView.dataset.model === 'grinder' && id === grinderButton.id) {
      openItemReward(itemRewards.coffeeGround);
      return;
    }
    if (modelView.dataset.model !== 'pegboard' || id !== coffeeBag.id) return;
    itemInteraction.select(id);
    render();
    openItemReward(itemRewards.coffeeBean);
  }
  coffeeBagButton.addEventListener('click', () => selectModelItem(coffeeBag.id));
  const previewCoffeeBag = id => {
    if (!active || modelView.dataset.model !== 'pegboard') return;
    itemInteraction?.focus(id);
    render();
  };
  coffeeBagButton.addEventListener('pointerenter', () => previewCoffeeBag(coffeeBag.id));
  coffeeBagButton.addEventListener('pointerleave', () => previewCoffeeBag(coffeeBagButton.matches(':focus') ? coffeeBag.id : null));
  coffeeBagButton.addEventListener('focus', () => previewCoffeeBag(coffeeBag.id));
  coffeeBagButton.addEventListener('blur', () => previewCoffeeBag(null));
  espressoButton.addEventListener('click', () => selectModelItem(espressoCenterButton.id));
  const previewEspressoButton = id => {
    if (!active || modelView.dataset.model !== 'espresso') return;
    itemInteraction?.focus(id);
    render();
  };
  espressoButton.addEventListener('pointerenter', () => previewEspressoButton(espressoCenterButton.id));
  espressoButton.addEventListener('pointerleave', () => previewEspressoButton(espressoButton.matches(':focus') ? espressoCenterButton.id : null));
  espressoButton.addEventListener('focus', () => previewEspressoButton(espressoCenterButton.id));
  espressoButton.addEventListener('blur', () => previewEspressoButton(null));
  grinderControl.addEventListener('click', () => selectModelItem(grinderButton.id));
  const previewGrinderButton = id => {
    if (!active || modelView.dataset.model !== 'grinder') return;
    itemInteraction?.focus(id);
    render();
  };
  grinderControl.addEventListener('pointerenter', () => previewGrinderButton(grinderButton.id));
  grinderControl.addEventListener('pointerleave', () => previewGrinderButton(grinderControl.matches(':focus') ? grinderButton.id : null));
  grinderControl.addEventListener('focus', () => previewGrinderButton(grinderButton.id));
  grinderControl.addEventListener('blur', () => previewGrinderButton(null));
  function selectShelfItem(id) {
    if (!active || !itemInteraction) return;
    itemInteraction.select(id);
    shelfButtons.querySelectorAll('button').forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.shelfItem === id));
    });
    shelfSelection.textContent = `Selected: ${shelfItems.find(item => item.id === id).label}`;
    render();
    const index = shelfItems.findIndex(item => item.id === id);
    shelfGallery.open(shelfItems[index], index);
  }
  shelfItems.forEach(item => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.shelfItem = item.id;
    button.textContent = `${String(shelfItems.indexOf(item) + 1).padStart(2, '0')} / ${item.label}`;
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', 'shelf-gallery');
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => selectShelfItem(item.id));
    const preview = id => { if (active) { itemInteraction?.focus(id); render(); } };
    button.addEventListener('pointerenter', () => preview(item.id));
    button.addEventListener('pointerleave', () => preview(button.matches(':focus') ? item.id : null));
    button.addEventListener('focus', () => preview(item.id));
    button.addEventListener('blur', () => preview(null));
    shelfButtons.append(button);
  });
  async function prepareModel(element, onProgress) {
    if (!models.has(element.model)) {
      const promise = loader.loadAsync(element.model, onProgress).then(gltf => {
        const object = gltf.scene;
        const bounds = new THREE.Box3().setFromObject(object);
        const size = bounds.getSize(new THREE.Vector3());
        const center = bounds.getCenter(new THREE.Vector3());
        const scale = 2 / Math.max(size.x, size.y, size.z);
        object.scale.multiplyScalar(scale);
        object.position.sub(center.multiplyScalar(scale));
        // Capture the body before adding hover overlays so they do not affect framing.
        const framingBounds = new THREE.Box3().setFromObject(object);
        const onHover = id => {
          renderer.domElement.dataset.objectHover = String(Boolean(id));
          const items = cabinetPhotoItems[element.id] ? [cabinetPhotoItems[element.id]]
            : element.id === 'pegboard' ? [coffeeBag] : element.id === 'grinder' ? [grinderButton] : element.id === 'espresso' ? [espressoCenterButton] : shelfItems;
          renderer.domElement.title = items.find(item => item.id === id)?.label ?? '';
        };
        const items = element.id === 'shelf' ? addShelfInteractions(object, onHover)
          : element.id === 'pegboard' ? addPegboardInteractions(object, onHover)
          : element.id === 'grinder' ? addGrinderInteractions(object, onHover)
          : element.id === 'espresso' ? addEspressoButtonGlow(object, onHover)
          : cabinetPhotoItems[element.id] ? addCabinetInteractions(object, element.id, onHover) : null;
        return { object, items, framingBounds };
      }).catch(error => { models.delete(element.model); throw error; });
      models.set(element.model, promise);
    }
    return models.get(element.model);
  }
  async function selectModel(element) {
    const selected = await models.get(element.model);
    itemInteraction?.setActive(false);
    if (model) scene.remove(model);
    model = selected.object;
    framingBounds = selected.framingBounds;
    itemInteraction = selected.items;
    itemInteraction?.select(null);
    shelfButtons.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', 'false'));
    shelfSelection.textContent = '';
    cabinetButtons.replaceChildren();
    document.querySelector('#cabinet-selection').textContent = '';
    const cabinetItem = cabinetPhotoItems[element.id];
    if (cabinetItem) {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = cabinetItem.label;
      button.dataset.cabinetItem = cabinetItem.id;
      button.setAttribute('aria-pressed', 'false');
      if (cabinetItem.photos) {
        button.setAttribute('aria-haspopup', 'dialog');
        button.setAttribute('aria-controls', 'shelf-gallery');
      }
      button.addEventListener('click', () => selectModelItem(cabinetItem.id));
      const preview = id => { if (active) { itemInteraction?.focus(id); render(); } };
      button.addEventListener('pointerenter', () => preview(cabinetItem.id));
      button.addEventListener('pointerleave', () => preview(button.matches(':focus') ? cabinetItem.id : null));
      button.addEventListener('focus', () => preview(cabinetItem.id));
      button.addEventListener('blur', () => preview(null));
      cabinetButtons.append(button);
      cabinetPanel.setAttribute('aria-label', `${element.label} object buttons`);
    }
    refreshRewardControls();
    scene.add(model);
    pointer = null;
    reset();
  }

  canvasHost.replaceChildren(renderer.domElement);

  let active = false;
  let pointer = null;
  let dragging = false;
  const raycaster = new THREE.Raycaster();
  function render() {
    scene.updateMatrixWorld(true);
    camera.updateMatrixWorld(true);
    if (itemInteraction && active && pointer && !dragging && !document.hidden) {
      raycaster.setFromCamera(pointer, camera);
      itemInteraction?.updateHover(raycaster);
    } else {
      itemInteraction?.updateHover(null);
    }
    renderer.render(scene, camera);
  }
  renderer.domElement.addEventListener('pointermove', event => {
    const rect = renderer.domElement.getBoundingClientRect();
    pointer = event.pointerType === 'touch' ? null : new THREE.Vector2(
      (event.clientX - rect.left) / rect.width * 2 - 1,
      -(event.clientY - rect.top) / rect.height * 2 + 1,
    );
    if (active) render();
  });
  renderer.domElement.addEventListener('pointerleave', () => {
    pointer = null;
    if (active) render();
  });
  let press = null;
  renderer.domElement.addEventListener('pointerdown', event => {
    press = event.button === 0 ? { x: event.clientX, y: event.clientY, id: event.pointerId, moved: false } : null;
    dragging = true;
    if (active) render();
  });
  renderer.domElement.addEventListener('pointermove', event => {
    if (press && Math.hypot(event.clientX - press.x, event.clientY - press.y) > 5) press.moved = true;
  });
  renderer.domElement.addEventListener('pointerup', event => {
    if (active && itemInteraction && press && press.id === event.pointerId && !press.moved
      && Math.hypot(event.clientX - press.x, event.clientY - press.y) <= 5) {
      const rect = renderer.domElement.getBoundingClientRect();
      raycaster.setFromCamera(new THREE.Vector2((event.clientX - rect.left) / rect.width * 2 - 1,
        -(event.clientY - rect.top) / rect.height * 2 + 1), camera);
      const id = itemInteraction.pick(raycaster);
      if (id) selectModelItem(id);
    }
    press = null;
    dragging = false;
    if (active) render();
  });
  renderer.domElement.addEventListener('pointercancel', () => { press = null; dragging = false; pointer = null; if (active) render(); });
  document.addEventListener('visibilitychange', () => { pointer = null; if (active) render(); });
  controls.addEventListener('change', render);
  function reset() {
    camera.clearViewOffset();
    const aspect = camera.aspect;
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    const distance = 1.25 * Math.max(1 / Math.tan(halfFov), 1 / (Math.tan(halfFov) * aspect)) + 1;
    controls.maxDistance = Math.max(9, distance * 1.5);
    camera.position.set(.12, .13, 1).normalize().multiplyScalar(distance);
    controls.target.set(0, 0, 0);
    controls.update();
    camera.updateMatrixWorld(true);
    if (framingBounds) {
      // Shift the composition, keeping the orbit target and model coordinates intact.
      // Raycaster uses this same projection, so object picking follows the shift.
      let left = Infinity;
      let right = -Infinity;
      for (const x of [framingBounds.min.x, framingBounds.max.x]) {
        for (const y of [framingBounds.min.y, framingBounds.max.y]) {
          for (const z of [framingBounds.min.z, framingBounds.max.z]) {
            const projected = new THREE.Vector3(x, y, z).project(camera);
            left = Math.min(left, projected.x);
            right = Math.max(right, projected.x);
          }
        }
      }
      const { width, height } = stage.getBoundingClientRect();
      const modelWidth = (right - left) * width / 2;
      camera.setViewOffset(width, height, modelWidth * .30, 0, width, height);
    }
    render();
  }
  function resize() {
    const { width, height } = stage.getBoundingClientRect();
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    reset();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(stage);
  resize();

  function action(name) {
    if (name === 'reset') return reset();
    const offset = camera.position.clone().sub(controls.target);
    if (name === 'left' || name === 'right' || name === 'up' || name === 'down') {
      const spherical = new THREE.Spherical().setFromVector3(offset);
      if (name === 'left') spherical.theta -= .18;
      if (name === 'right') spherical.theta += .18;
      if (name === 'up') spherical.phi -= .14;
      if (name === 'down') spherical.phi += .14;
      spherical.phi = THREE.MathUtils.clamp(spherical.phi, controls.minPolarAngle, controls.maxPolarAngle);
      offset.setFromSpherical(spherical);
    } else {
      offset.multiplyScalar(name === 'in' ? .85 : 1 / .85);
      offset.clampLength(controls.minDistance, controls.maxDistance);
    }
    camera.position.copy(controls.target).add(offset);
    controls.update();
  }
  return { action, reset, render, prepareModel, selectModel, refreshRewardControls, setActive(value) {
    active = value; pointer = null; dragging = false; press = null;
    itemInteraction?.setActive(value);
    render();
  } };
}

async function openModel(element) {
  if (stage.dataset.state !== 'room' && retryButton.hidden) return;
  const thisSession = ++session;
  stage.dataset.state = 'opening';
  modelText = '';
  modelCopy.textContent = '';
  modelCopy.hidden = true;
  modelCopy.setAttribute('aria-label', `About ${element.label}`);
  modelCopy.scrollTop = 0;
  void loadElementText(element, thisSession);
  hint.hidden = true;
  modelView.hidden = true;
  backButton.hidden = false;
  retryAction = () => openModel(element);
  backButton.focus({ preventScroll: true });
  const zoomFinished = zoomRoom(element.id === 'espresso' ? undefined : element);
  setStatus(`Loading ${element.label}…`);
  try {
    if (!viewer) {
      loading ??= createViewer().catch(error => { loading = null; throw error; });
      viewer = await loading;
    }
    await viewer.prepareModel(element, event => {
      if (session !== thisSession || stage.dataset.state !== 'opening') return;
      const progress = event.total ? ` ${Math.round(event.loaded / event.total * 100)}%` : '';
      setStatus(`Loading ${element.label}…${progress}`);
    });
    await zoomFinished;
    if (session !== thisSession) return;
    await viewer.selectModel(element);
    if (session !== thisSession) return;
    document.querySelector('#model-title').textContent = element.label;
    modelView.setAttribute('aria-label', `${element.label}`);
    modelView.dataset.model = element.id;
    canvasHost.setAttribute('aria-label', `${element.label}. Drag to rotate, scroll to zoom, or use the arrow keys, plus, minus, and Home.`);
    modelView.hidden = false;
    // Commit the starting opacity before fading in the 3D surface.
    modelView.getBoundingClientRect();
    stage.dataset.state = 'model';
    markElementVisited(element);
    setDetailMode('model');
    setStatus('');
    hint.textContent = '';
    canvasHost.focus({ preventScroll: true });
  } catch (error) {
    console.error(`The ${element.label} viewer could not load:`, error);
    if (session !== thisSession) return;
    setStatus('The model could not load. Try again, or return to the room. This view requires WebGL 2.', true);
    retryButton.focus({ preventScroll: true });
  }
}

function closeDetail() {
  if (stage.dataset.state === 'room') return;
  shelfGallery.close();
  ++session;
  ++backdropRequest;
  animationPlayer?.pause();
  activeAnimationId = null;
  modelText = '';
  modelCopy.textContent = '';
  modelCopy.hidden = true;
  animationText = '';
  animationCopy.textContent = '';
  animationCopy.hidden = true;
  viewer?.setActive(false);
  stage.dataset.state = 'room';
  hint.hidden = true;
  setDetailMode('model');
  applyBackdrop('cartoon');
  room.style.transform = '';
  modelView.hidden = true;
  photoView.hidden = true;
  backButton.hidden = true;
  setStatus('');
  room.inert = false;
  objectList.hidden = false;
  hint.textContent = '';
  returnFocus?.focus({ preventScroll: true });
}

backButton.addEventListener('click', closeDetail);
retryButton.addEventListener('click', () => retryAction?.());
canvasHost.addEventListener('keydown', event => {
  const actions = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down', '+': 'in', '=': 'in', '-': 'out', Home: 'reset' };
  if (actions[event.key]) { event.preventDefault(); viewer?.action(actions[event.key]); }
});
document.addEventListener('keydown', event => {
  if (galleryDialog.open || rewardDialog.open) return; // Escape closes only the active dialog.
  if (event.key === 'Escape') closeDetail();
});
document.querySelector('#backdrop').addEventListener('error', () => {
  setStatus('The room photo could not load. Check that the preview server is running from the project folder.');
});
if (location.protocol === 'file:') {
  setStatus('Open this prototype through the local preview server. See README.md for the command.');
}
