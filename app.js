import { elements } from './scene-elements.js?v=20261108-chinese-card';
import { createShelfGallery } from './shelf-gallery.js?v=20261108-show-invitation';
import { createItemRewards, itemRewards } from './item-rewards.js?v=20261108-show-invitation';
import { loadCopy, renderCopy, onLanguageChange, initLanguageControls, setUIText, setUIAttribute } from './i18n.js?v=20261108-show-invitation';

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
let freeExplore = false;

function isElementUnlocked(element) {
  if (freeExplore) return true;
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
  const next = freeExplore ? null : elements.find(item => isElementUnlocked(item) && (
    item.id === 'pegboard' ? !acquiredItems.has('coffee-bean')
      : item.id === 'grinder' ? !acquiredItems.has('coffee-ground')
        : item.id === 'espresso' ? !acquiredItems.has('coffee-mug')
          : !visitedElements.has(item.id)
  ));
  elements.forEach(item => {
    const locked = !isElementUnlocked(item);
    roomControls.get(item.id).forEach(control => {
      control.hidden = locked;
      control.dataset.nextStep = String(item === next);
      if (item === next) control.setAttribute('aria-current', 'step');
      else control.removeAttribute('aria-current');
    });
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
  if (!freeExplore && reward.requires && !acquiredItems.has(reward.requires)) return;
  rewardPopup.open(reward);
}

function setDetailMode(mode) {
  const imageMode = mode === 'image';
  stage.dataset.detailMode = mode;
  canvasHost.hidden = imageMode;
  detailModeButton.disabled = false;
  setUIText(detailModeButton, imageMode ? 'Show model' : 'Show room image');
  detailModeButton.setAttribute('aria-pressed', String(imageMode));
  viewer?.setActive(!imageMode && stage.dataset.state === 'model');
  shelfPanel.hidden = imageMode || stage.dataset.state !== 'model' || modelView.dataset.model !== 'shelf';
  pegboardPanel.hidden = imageMode || stage.dataset.state !== 'model' || modelView.dataset.model !== 'pegboard';
  grinderPanel.hidden = imageMode || stage.dataset.state !== 'model' || modelView.dataset.model !== 'grinder';
  espressoPanel.hidden = imageMode || stage.dataset.state !== 'model' || modelView.dataset.model !== 'espresso';
  cabinetPanel.hidden = imageMode || stage.dataset.state !== 'model' || !['cabinet-top', 'display-left', 'display-right'].includes(modelView.dataset.model);
  refreshCopy();
}

function refreshCopy() {
  const hasModelCopy = renderCopy(modelCopy, modelText);
  const hasAnimationCopy = renderCopy(animationCopy, animationText);
  modelCopy.hidden = stage.dataset.state !== 'model' || stage.dataset.detailMode === 'image' || !hasModelCopy;
  animationCopy.hidden = stage.dataset.state !== 'animation' || !hasAnimationCopy;
}
onLanguageChange(refreshCopy);

async function loadElementText(element, thisSession) {
  if (!element.text) return;
  try {
    // Re-read on entry so editing the UTF-8 file requires no manifest rebuild.
    const text = await loadCopy(element.text);
    if (session !== thisSession) return;
    if (element.animation) {
      animationText = text;
    } else {
      modelText = text;
    }
    refreshCopy();
  } catch (error) {
    // Optional copy must never prevent the model from opening.
    if (session === thisSession) console.warn(`Could not load text for ${element.label}:`, error);
  }
}

function applyBackdrop(style) {
  backdrop.src = backdropSources[style];
  backdrop.dataset.style = style;
  setUIAttribute(backdrop, 'alt', style === 'cartoon'
    ? 'A block-style cartoon room with coffee equipment, wall shelves, a side cabinet and a large plant.'
    : 'A room photograph with coffee equipment, wall shelves, a side cabinet and a large plant.');
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
  setUIAttribute(button, 'aria-label', element.label);
  button.setAttribute('aria-controls', element.model ? 'model-view' : 'photo-view');
  const [left, top, width, height] = element.bounds;
  Object.assign(button.style, { left: `${left}%`, top: `${top}%`, width: `${width}%`, height: `${height}%` });
  button.style.setProperty('--marker-x', `${element.marker[0]}%`);
  button.style.setProperty('--marker-y', `${element.marker[1]}%`);
  button.innerHTML = `<span class="hotspot-label" aria-hidden="true">${element.label}</span>`;
  setUIText(button.querySelector('.hotspot-label'), element.label);
  button.addEventListener('click', () => openElement(element, button));
  hotspots.append(button);
  const listButton = document.createElement('button');
  listButton.type = 'button';
  listButton.dataset.element = element.id;
  listButton.innerHTML = `<span class="object-number" aria-hidden="true">${number}</span><span></span>`;
  setUIText(listButton.lastElementChild, element.label);
  listButton.setAttribute('aria-controls', element.model ? 'model-view' : 'photo-view');
  listButton.addEventListener('click', () => openElement(element, listButton));
  objectList.append(listButton);
  roomControls.set(element.id, [button, listButton]);
  button.hidden = listButton.hidden = !isElementUnlocked(element);
});

updateRoomAvailability();
document.querySelector('#free-explore').addEventListener('click', event => {
  freeExplore = true;
  updateRoomAvailability();
  viewer?.refreshRewardControls();
  event.currentTarget.setAttribute('aria-pressed', 'true');
  setUIText(event.currentTarget, 'All items unlocked');
});

document.querySelector('#show-invitation').addEventListener('click', () => {
  animationPlayer?.pause();
  const card = elements.find(element => element.id === 'cabinet-doors').animation.completionPhoto;
  shelfGallery.open(card);
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
  setUIText(photoTitle, element.label);
  setUIText(hint, 'View the photo, then return to explore another object.');
  hint.hidden = false;
  photoVariants.replaceChildren();
  photoVariants.hidden = element.photos.length < 2;
  element.photos.forEach(([file, label], index) => {
    const button = document.createElement('button');
    button.type = 'button';
    setUIText(button, label);
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
  setUIText(photoTitle, element.label);
  retryAction = () => openAnimation(element);
  setStatus('Loading {name} animation…', false, { name: element.label });
  const zoomFinished = zoomRoom(element);
  try {
    if (!animationPlayers.has(element.id)) {
      const pending = (element.animation.video
        ? import('./video-animation.js?v=20261108-show-invitation').then(module => module.createVideoAnimation)
        : import('./frame-animation.js?v=20261108-show-invitation').then(module => module.createFrameAnimation)).then(createAnimation =>
        createAnimation(animationCanvas, element.animation, ({ playing, ended, error }) => {
          if (activeAnimationId !== element.id) return;
          setUIText(animationPlay, playing ? 'Pause' : ended ? 'Play again' : element.animation.playLabel);
          if (error) setStatus('The animation could not load. Try again, or return to the room.', true);
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
    refreshCopy();
    markElementVisited(element);
    animationPlayer.setHovered(animationCanvas.matches(':hover'));
    setStatus('');
    setUIText(hint, element.animation.hint);
    hint.hidden = false;
    photoTitle.focus({ preventScroll: true });
    if (!reducedMotion.matches && !document.hidden && !galleryDialog.open && !rewardDialog.open) animationPlayer.play();
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
document.addEventListener('visibilitychange', () => {
  if (document.hidden) animationPlayer?.pause();
  viewer?.refreshRewardControls();
});
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) animationPlayer?.pause();
  viewer?.refreshRewardControls();
});

async function showPhoto(element, index) {
  const thisSession = ++session;
  const [file, label] = element.photos[index];
  retryAction = () => showPhoto(element, index);
  detailPhoto.hidden = true;
  setUIText(photoTitle, label);
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

function setStatus(message, canRetry = false, values = {}) {
  setUIText(status, message, values);
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
    import('./espresso-glow.js?v=20261108-soft-glow'),
    import('./shelf-interactions.js?v=20261108-soft-glow'),
    import('./vendor/meshoptimizer/meshopt_decoder.js'),
    import('./pegboard-interactions.js?v=20261108-soft-glow'),
    import('./cabinet-interactions.js?v=20261108-password-gate'),
    import('./grinder-interactions.js?v=20261108-soft-glow'),
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
  let guidedHint = null;
  let hintFrame;
  let lastHintFrame = 0;
  function scheduleHintPulse() {
    cancelAnimationFrame(hintFrame);
    if (active && guidedHint && !reducedMotion.matches && !document.hidden) hintFrame = requestAnimationFrame(pulseHint);
  }
  function pulseHint(time) {
    if (!active || !guidedHint || reducedMotion.matches || document.hidden) return;
    if (time - lastHintFrame >= 1000 / 30) {
      lastHintFrame = time;
      render();
    }
    hintFrame = requestAnimationFrame(pulseHint);
  }
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
    setUIText(grinderSelection, grounds ? 'Coffee grounds acquired' : '');
    coffeeBagButton.setAttribute('aria-pressed', String(beans));
    espressoButton.setAttribute('aria-pressed', String(mug));
    setUIText(pegboardSelection, beans ? 'Coffee bean acquired' : '');
    setUIText(espressoSelection, mug ? 'Coffee mug acquired' : '');
    const guides = [
      [coffeeBagButton, !freeExplore && !beans, 'pegboard', coffeeBag.id],
      [grinderControl, !freeExplore && beans && !grounds, 'grinder', grinderButton.id],
      [espressoButton, !freeExplore && beans && visitedElements.has('grinder') && !mug, 'espresso', espressoCenterButton.id],
    ];
    let hint = null;
    for (const [button, guided, sceneId, itemId] of guides) {
      button.dataset.nextStep = String(guided);
      if (guided && modelView.dataset.model === sceneId) hint = itemId;
    }
    itemInteraction?.setHint?.(hint);
    guidedHint = hint;
    scheduleHintPulse();
    if (hint === null && ['pegboard', 'grinder', 'espresso'].includes(modelView.dataset.model)) itemInteraction?.select(null);
    render();
  }
  function selectModelItem(id) {
    if (!active || !itemInteraction) return;
    if (modelView.dataset.model === 'shelf') return selectShelfItem(id);
    const cabinetItem = cabinetPhotoItems[modelView.dataset.model];
    if (cabinetItem?.id === id) {
      itemInteraction.select(id);
      cabinetButtons.querySelector('button').setAttribute('aria-pressed', 'true');
      render();
      setUIText(document.querySelector('#cabinet-selection'), 'Selected: {name}', { name: cabinetItem.label });
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
    setUIText(shelfSelection, 'Selected: {name}', { name: shelfItems.find(item => item.id === id).label });
    render();
    const index = shelfItems.findIndex(item => item.id === id);
    shelfGallery.open(shelfItems[index], index);
  }
  shelfItems.forEach(item => {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.shelfItem = item.id;
    setUIText(button, '{number} / {name}', { number: String(shelfItems.indexOf(item) + 1).padStart(2, '0'), name: item.label });
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
          setUIAttribute(renderer.domElement, 'title', items.find(item => item.id === id)?.label ?? '');
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
    setUIText(shelfSelection, '');
    cabinetButtons.replaceChildren();
    setUIText(document.querySelector('#cabinet-selection'), '');
    const cabinetItem = cabinetPhotoItems[element.id];
    if (cabinetItem) {
      const button = document.createElement('button');
      button.type = 'button';
      setUIText(button, cabinetItem.label);
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
      setUIAttribute(cabinetPanel, 'aria-label', '{name} object buttons', { name: element.label });
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
    itemInteraction?.setPulse?.(reducedMotion.matches ? 1 : .5 - .5 * Math.cos(performance.now() * 2 * Math.PI / 2600));
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
  const stackedModelLayout = matchMedia('(max-width: 900px)');
  function reset() {
    camera.clearViewOffset();
    const aspect = camera.aspect;
    const halfFov = THREE.MathUtils.degToRad(camera.fov / 2);
    let distance = 1.25 * Math.max(1 / Math.tan(halfFov), 1 / (Math.tan(halfFov) * aspect)) + 1;
    const stacked = stackedModelLayout.matches;
    controls.target.set(0, 0, 0);
    const positionCamera = () => {
      camera.position.set(.12, .13, 1).normalize().multiplyScalar(distance);
      camera.lookAt(controls.target);
      camera.updateMatrixWorld(true);
    };
    const projectedBounds = () => {
      let left = Infinity;
      let right = -Infinity;
      let bottom = Infinity;
      let top = -Infinity;
      for (const x of [framingBounds.min.x, framingBounds.max.x]) {
        for (const y of [framingBounds.min.y, framingBounds.max.y]) {
          for (const z of [framingBounds.min.z, framingBounds.max.z]) {
            const projected = new THREE.Vector3(x, y, z).project(camera);
            left = Math.min(left, projected.x);
            right = Math.max(right, projected.x);
            bottom = Math.min(bottom, projected.y);
            top = Math.max(top, projected.y);
          }
        }
      }
      return { left, right, bottom, top };
    };
    positionCamera();
    if (framingBounds) {
      // Fit each model's actual bounds into its column, with space for headings
      // and a consistent gap before the reading column. Mobile uses the center.
      for (let pass = 0; pass < 3; pass++) {
        const bounds = projectedBounds();
        const fit = Math.max((bounds.right - bounds.left) / (2 * (stacked ? .86 : .50)),
          (bounds.top - bounds.bottom) / (2 * .70));
        distance = Math.max(controls.minDistance, distance * fit);
        positionCamera();
      }
      const bounds = projectedBounds();
      const { width, height } = stage.getBoundingClientRect();
      const centerX = (bounds.left + bounds.right) / 2;
      const centerY = (bounds.bottom + bounds.top) / 2;
      camera.setViewOffset(width, height, (.5 + centerX / 2 - (stacked ? .5 : .31)) * width,
        (.5 - centerY / 2 - .55) * height, width, height);
    }
    controls.maxDistance = Math.max(9, distance * 1.5);
    controls.update();
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
  stackedModelLayout.addEventListener('change', resize);
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
    refreshRewardControls();
  } };
}

async function openModel(element) {
  if (stage.dataset.state !== 'room' && retryButton.hidden) return;
  const thisSession = ++session;
  stage.dataset.state = 'opening';
  modelText = '';
  modelCopy.textContent = '';
  modelCopy.hidden = true;
  setUIAttribute(modelCopy, 'aria-label', 'About {name}', { name: element.label });
  modelCopy.scrollTop = 0;
  void loadElementText(element, thisSession);
  hint.hidden = true;
  modelView.hidden = true;
  backButton.hidden = false;
  retryAction = () => openModel(element);
  backButton.focus({ preventScroll: true });
  const zoomFinished = zoomRoom(element.id === 'espresso' ? undefined : element);
  setStatus('Loading {name}…', false, { name: element.label });
  try {
    if (!viewer) {
      loading ??= createViewer().catch(error => { loading = null; throw error; });
      viewer = await loading;
    }
    await viewer.prepareModel(element, event => {
      if (session !== thisSession || stage.dataset.state !== 'opening') return;
      setStatus(event.total ? 'Loading {name}… {percent}%' : 'Loading {name}…', false,
        { name: element.label, percent: Math.round(event.loaded / event.total * 100) });
    });
    await zoomFinished;
    if (session !== thisSession) return;
    await viewer.selectModel(element);
    if (session !== thisSession) return;
    setUIText(document.querySelector('#model-title'), element.label);
    setUIAttribute(modelView, 'aria-label', element.label);
    modelView.dataset.model = element.id;
    setUIAttribute(canvasHost, 'aria-label', '{name}. Drag to rotate, scroll to zoom, or use the arrow keys, plus, minus, and Home.', { name: element.label });
    modelView.hidden = false;
    // Commit the starting opacity before fading in the 3D surface.
    modelView.getBoundingClientRect();
    stage.dataset.state = 'model';
    markElementVisited(element);
    setDetailMode('model');
    setStatus('');
    setUIText(hint, '');
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
  setUIText(hint, '');
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
setUIAttribute(backdrop, 'alt', backdrop.alt);
initLanguageControls();

if (location.protocol === 'file:') {
  setStatus('Open this prototype through the local preview server. See README.md for the command.');
}
