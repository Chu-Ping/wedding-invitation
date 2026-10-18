export function createShelfGallery(dialog, { onOpen, onClose }) {
  const title = dialog.querySelector('h2');
  const photos = dialog.querySelector('.shelf-photo-spread');
  const content = dialog.querySelector('.shelf-gallery-content');
  const copy = dialog.querySelector('.shelf-gallery-copy');
  const closeButton = dialog.querySelector('[data-close-gallery]');
  let returnFocus;
  let request = 0;
  let entrance;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  reducedMotion.addEventListener('change', () => { if (reducedMotion.matches) entrance?.cancel(); });
  function close() {
    ++request; // Also cancel an image that is still preparing to open.
    if (dialog.open) dialog.close();
  }
  closeButton.addEventListener('click', close);
  dialog.addEventListener('click', event => {
    // Native dialog backdrop clicks are targeted at the dialog itself.
    const rect = dialog.getBoundingClientRect();
    if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right
      || event.clientY < rect.top || event.clientY > rect.bottom)) close();
  });
  dialog.addEventListener('close', () => {
    ++request;
    entrance?.cancel();
    photos.replaceChildren();
    copy.textContent = '';
    copy.hidden = true;
    content.dataset.hasCopy = 'false';
    onClose();
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  });
  return {
    async open(item, index, { origin } = {}) {
      const thisRequest = ++request;
      const source = origin?.getBoundingClientRect();
      returnFocus = document.activeElement;
      const numberedSet = Number.isInteger(index);
      title.textContent = numberedSet ? `${String(index + 1).padStart(2, '0')} / ${item.label}` : item.label;
      let set = item.photos;
      if (!set) {
        try {
          // Room startup does not depend on loading or validating photo albums.
          const { shelfPhotoAlbums } = await import('./shelf-albums.js?v=20261018-albums-68');
          set = shelfPhotoAlbums[index];
          if (!set?.length) throw new Error('Photo album is empty');
        } catch {
          if (request !== thisRequest) return;
          photos.replaceChildren();
          copy.textContent = '';
          copy.hidden = true;
          content.dataset.hasCopy = 'false';
          dialog.dataset.reveal = 'false';
          const message = document.createElement('p');
          message.className = 'photo-load-message';
          message.textContent = 'These photos could not load. Refresh the page and try again.';
          message.setAttribute('role', 'status');
          photos.append(message);
          onOpen();
          dialog.showModal();
          closeButton.focus({ preventScroll: true });
          return;
        }
      }
      if (request !== thisRequest) return;
      dialog.dataset.item = item.id;
      copy.textContent = '';
      copy.hidden = true;
      content.dataset.hasCopy = 'false';
      photos.replaceChildren();
      photos.dataset.count = set.length;
      photos.dataset.variant = numberedSet ? index % 3 : 0;
      photos.dataset.layout = set.length > 3 ? 'collection' : 'small';
      dialog.scrollTop = 0;
      const loads = set.map((photo, photoIndex) => {
        const card = document.createElement('figure');
        card.className = 'shelf-photo-card';
        const image = new Image(photo.width, photo.height);
        image.alt = numberedSet ? `Photo ${photoIndex + 1} of ${set.length} in album ${index + 1}`
          : `Photo ${photoIndex + 1} of ${set.length}: ${item.label}`;
        image.decoding = 'async';
        const message = document.createElement('p');
        message.className = 'photo-load-message';
        message.textContent = 'Loading photo…';
        message.setAttribute('role', 'status');
        const retry = document.createElement('button');
        retry.type = 'button';
        retry.textContent = 'Retry photo';
        retry.hidden = true;
        const load = async () => {
          message.hidden = false;
          message.textContent = 'Loading photo…';
          image.hidden = true;
          retry.hidden = true;
          image.src = photo.src;
          try {
            await image.decode();
            if (request !== thisRequest) return;
            image.hidden = false;
            message.hidden = true;
          } catch {
            if (request !== thisRequest) return;
            message.textContent = 'This photo could not load.';
            retry.hidden = false;
          }
        };
        retry.addEventListener('click', load);
        card.append(image, message, retry);
        photos.append(card);
        return load();
      });
      if (item.text) loads.push((async () => {
        try {
          const response = await fetch(item.text, { cache: 'no-cache' });
          if (!response.ok) return;
          const text = (await response.text()).replace(/^\uFEFF/, '').trim();
          if (request !== thisRequest) return;
          copy.textContent = text;
          copy.hidden = !text;
          content.dataset.hasCopy = String(Boolean(text));
        } catch {
          // Optional copy must not prevent the card from opening.
        }
      })());
      const show = () => {
        // Image and optional copy are ready before measuring the growing panel.
        if (request !== thisRequest) return;
        onOpen();
        dialog.dataset.reveal = String(Boolean(source) && !reducedMotion.matches);
        dialog.showModal();
        closeButton.focus({ preventScroll: true });
        if (source && !reducedMotion.matches) {
          const target = dialog.getBoundingClientRect();
          const x = source.left + source.width / 2 - target.left - target.width / 2;
          const y = source.top + source.height / 2 - target.top - target.height / 2;
          entrance = dialog.animate([
            { transform: `translate(${x}px, ${y}px) scale(.06)`, opacity: 0 },
            { opacity: 1, offset: .3 },
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
          ], { duration: 700, easing: 'cubic-bezier(.16, 1, .3, 1)' });
        }
      };
      // The card is decoded before it grows out of the scene, avoiding a blank
      // expanding panel followed by a second cut when the image arrives.
      if (source) void Promise.all(loads).then(show);
      else show();
    },
    close,
  };
}
