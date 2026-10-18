export const itemRewards = {
  coffeeBean: {
    id: 'coffee-bean', title: 'Coffee bean',
    image: 'resource/images/props/Voxel cluster of roasted coffee beans.png',
    text: 'resource/text/coffee_bean/text',
  },
  coffeeMug: {
    id: 'coffee-mug', title: 'Coffee mug',
    image: 'resource/images/props/Chunky voxel coffee mug.png',
    text: 'resource/text/coffee_mug/text', requires: 'coffee-bean',
  },
  coffeeGround: {
    id: 'coffee-ground', title: 'Coffee grounds',
    image: 'resource/images/props/Voxel coffee grounds mound.png',
    text: 'resource/text/coffee_ground/text', requires: 'coffee-bean',
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
  async function load() {
    const thisRequest = ++request;
    const reward = currentReward;
    image.hidden = text.hidden = true;
    status.hidden = false;
    status.textContent = 'Loading…';
    retry.hidden = true;
    try {
      const pendingImage = new Image();
      pendingImage.src = reward.image;
      const [copy] = await Promise.all([
        fetch(reward.text, { cache: 'no-cache' }).then(response => {
          if (!response.ok) throw new Error(`Text request returned ${response.status}`);
          return response.text();
        }),
        pendingImage.decode(),
      ]);
      if (request !== thisRequest || !dialog.open) return;
      const content = copy.replace(/^\uFEFF/, '').trim();
      if (!content && !reward.allowEmptyText) throw new Error('Reward text is empty');
      image.src = pendingImage.src;
      image.alt = reward.title;
      text.textContent = content;
      image.hidden = false;
      text.hidden = !content;
      status.hidden = true;
      onAcquire(reward);
    } catch {
      if (request !== thisRequest || !dialog.open) return;
      status.textContent = 'This item could not load. Try again.';
      retry.hidden = false;
    }
  }
  close.addEventListener('click', () => dialog.close());
  retry.addEventListener('click', load);
  dialog.addEventListener('close', () => {
    ++request;
    image.removeAttribute('src');
    text.textContent = '';
    onClose();
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  });
  return {
    open(reward) {
      if (dialog.open) return;
      currentReward = reward;
      returnFocus = document.activeElement;
      dialog.dataset.reward = reward.id;
      title.textContent = reward.title;
      image.hidden = text.hidden = true;
      onOpen();
      dialog.showModal();
      close.focus({ preventScroll: true });
      void load();
    },
  };
}
