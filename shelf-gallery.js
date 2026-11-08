import { getLanguage, loadCopy, translatedCopy, onLanguageChange, setUIText, setUIAttribute, t } from './i18n.js?v=20261108-rsvp-embed';

export function createShelfGallery(dialog, { onOpen, onClose }) {
  const title = dialog.querySelector('h2');
  const photos = dialog.querySelector('.shelf-photo-spread');
  const content = dialog.querySelector('.shelf-gallery-content');
  const copy = dialog.querySelector('.shelf-gallery-copy');
  const closeButton = dialog.querySelector('[data-close-gallery]');
  const footer = dialog.querySelector('[data-gallery-footer]');
  const formFrame = dialog.querySelector('[data-gallery-form]');
  setUIAttribute(formFrame, 'title', 'RSVP questionnaire');
  let returnFocus;
  let request = 0;
  let entrance;
  let copyData;
  let currentItem;
  let currentIndex;
  let refreshPhotos = [];
  function updateForm() {
    if (!dialog.open || !currentItem?.form) return;
    const form = currentItem.form[getLanguage() === 'en' ? 'en' : 'ch'];
    if (formFrame.getAttribute('src') !== form.embed) formFrame.src = form.embed;
  }
  function renderText() {
    const localized = translatedCopy(copyData);
    title.textContent = localized.title || (Number.isInteger(currentIndex)
      ? `${String(currentIndex + 1).padStart(2, '0')} / ${t(currentItem?.label ?? '')}` : t(currentItem?.label ?? ''));
    copy.textContent = localized.context;
    copy.hidden = !localized.context;
    content.dataset.hasCopy = String(Boolean(localized.context));
  }
  onLanguageChange(() => {
    if (dialog.open) renderText();
    refreshPhotos.forEach(refresh => { void refresh(); });
    updateForm();
  });
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
    refreshPhotos = [];
    currentItem = null;
    copy.textContent = '';
    copy.hidden = true;
    content.dataset.hasCopy = 'false';
    copyData = null;
    footer.hidden = true;
    formFrame.removeAttribute('src');
    onClose();
    if (returnFocus?.isConnected) returnFocus.focus({ preventScroll: true });
  });
  return {
    async open(item, index, { origin } = {}) {
      const thisRequest = ++request;
      refreshPhotos = [];
      const source = origin?.getBoundingClientRect();
      returnFocus = document.activeElement;
      const numberedSet = Number.isInteger(index);
      footer.hidden = !item.form;
      formFrame.removeAttribute('src');
      dialog.dataset.layout = numberedSet ? 'shelf' : 'standard';
      // Shelf context is a subtitle; card copy stays beside its image.
      if (numberedSet) title.parentElement.append(copy);
      else content.append(copy);
      currentItem = item;
      currentIndex = index;
      copyData = null;
      renderText();
      let set = item.photos;
      if (!set) {
        try {
          // Room startup does not depend on loading or validating photo albums.
          const { photoAlbums } = await import('./photo-albums.js?v=20261108-complete-albums');
          set = photoAlbums[item.id] ?? [];
        } catch {
          if (request !== thisRequest) return;
          photos.replaceChildren();
          copy.textContent = '';
          copy.hidden = true;
          content.dataset.hasCopy = 'false';
          dialog.dataset.reveal = 'false';
          const message = document.createElement('p');
          message.className = 'photo-load-message';
          setUIText(message, 'These photos could not load. Refresh the page and try again.');
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
      if (!set.length) {
        const message = document.createElement('p');
        message.className = 'photo-load-message';
        message.setAttribute('role', 'status');
        setUIText(message, 'No photos have been added yet.');
        photos.append(message);
      }
      dialog.scrollTop = 0;
      const loads = set.map((photo, photoIndex) => {
        const card = document.createElement('figure');
        card.className = 'shelf-photo-card';
        const image = new Image(photo.width, photo.height);
        setUIAttribute(image, 'alt', numberedSet ? 'Photo {number} of {count} in album {album}'
          : 'Photo {number} of {count}: {name}',
        { number: photoIndex + 1, count: set.length, album: index + 1, name: item.label });
        image.decoding = 'async';
        const message = document.createElement('p');
        message.className = 'photo-load-message';
        setUIText(message, 'Loading photo…');
        message.setAttribute('role', 'status');
        const retry = document.createElement('button');
        retry.type = 'button';
        setUIText(retry, 'Retry photo');
        retry.hidden = true;
        let imageRequest = 0;
        const load = async () => {
          const thisImage = ++imageRequest;
          const localizedPhoto = photo.languages?.[getLanguage()] ?? photo;
          message.hidden = false;
          setUIText(message, 'Loading photo…');
          image.hidden = true;
          retry.hidden = true;
          image.width = localizedPhoto.width;
          image.height = localizedPhoto.height;
          image.src = localizedPhoto.src;
          try {
            await image.decode();
            if (request !== thisRequest || imageRequest !== thisImage) return;
            image.hidden = false;
            message.hidden = true;
          } catch {
            if (request !== thisRequest || imageRequest !== thisImage) return;
            setUIText(message, 'This photo could not load.');
            retry.hidden = false;
          }
        };
        refreshPhotos.push(() => {
          const localizedPhoto = photo.languages?.[getLanguage()] ?? photo;
          if (image.getAttribute('src') !== localizedPhoto.src) return load();
        });
        retry.addEventListener('click', load);
        card.append(image, message, retry);
        photos.append(card);
        return load();
      });
      if (item.text) loads.push((async () => {
        try {
          const data = await loadCopy(item.text);
          if (request !== thisRequest) return;
          copyData = data;
          renderText();
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
        updateForm();
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
