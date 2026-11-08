import { loadCopy, translatedCopy, onLanguageChange, setUIText, t } from './i18n.js?v=20261108-rsvp-embed';

export const itemRewards = {
  coffeeBean: {
    id: 'coffee-bean', title: 'Coffee bean',
    image: 'resource/images/props/Voxel cluster of roasted coffee beans.png',
    text: 'resource/text/coffee_bean/text.json',
  },
  coffeeMug: {
    id: 'coffee-mug', title: 'Coffee mug',
    image: 'resource/images/props/Chunky voxel coffee mug.png',
    text: 'resource/text/coffee_mug/text.json', requires: 'coffee-bean',
  },
  coffeeGround: {
    id: 'coffee-ground', title: 'Coffee grounds',
    image: 'resource/images/props/Voxel coffee grounds mound.png',
    text: 'resource/text/coffee_ground/text.json', requires: 'coffee-bean',
    allowEmptyText: true,
  },
};

export function createItemRewards(dialog, { onOpen, onClose, onAcquire }) {
  const title = dialog.querySelector('h2');
  const image = dialog.querySelector('img');
  const text = dialog.querySelector('[data-reward-text]');
  const status = dialog.querySelector('[data-reward-status]');
  const retry = dialog.querySelector('[data-reward-retry]');
  const close = dialog.querySelector('[data-reward-close]');
  let request = 0;
  let returnFocus;
  let currentReward;
  let copyData;
  function render() {
    const content = translatedCopy(copyData);
    title.textContent = content.title || t(currentReward?.title ?? '');
    image.alt = title.textContent;
    text.textContent = content.context;
    text.hidden = !content.context;
  }
  onLanguageChange(() => { if (dialog.open) render(); });
  async function load() {
    const thisRequest = ++request;
    const reward = currentReward;
    image.hidden = text.hidden = true;
    status.hidden = false;
    setUIText(status, 'Loading…');
    retry.hidden = true;
    try {
      const pendingImage = new Image();
      pendingImage.src = reward.image;
      const [copy] = await Promise.all([
        loadCopy(reward.text),
        pendingImage.decode(),
      ]);
      if (request !== thisRequest || !dialog.open) return;
      if (![copy.context_en, copy.context_ch, copy.context_chs].some(context => context.trim()) && !reward.allowEmptyText) throw new Error('Reward text is empty');
      copyData = copy;
      image.src = pendingImage.src;
      render();
      image.hidden = false;
      status.hidden = true;
      onAcquire(reward);
    } catch {
      if (request !== thisRequest || !dialog.open) return;
      setUIText(status, 'This item could not load. Try again.');
      retry.hidden = false;
    }
  }
  close.addEventListener('click', () => dialog.close());
  retry.addEventListener('click', load);
  dialog.addEventListener('close', () => {
    ++request;
    image.removeAttribute('src');
    text.textContent = '';
    copyData = null;
    onClose();
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  });
  return {
    open(reward) {
      if (dialog.open) return;
      currentReward = reward;
      copyData = null;
      returnFocus = document.activeElement;
      dialog.dataset.reward = reward.id;
      title.textContent = t(reward.title);
      image.hidden = text.hidden = true;
      onOpen();
      dialog.showModal();
      close.focus({ preventScroll: true });
      void load();
    },
  };
}
