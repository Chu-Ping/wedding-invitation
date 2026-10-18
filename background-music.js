const music = document.querySelector('#background-music');
music.volume = .3;

function stopListening() {
  document.removeEventListener('click', startFromInteraction, true);
  document.removeEventListener('keydown', startFromInteraction, true);
}

function startFromInteraction(event) {
  if (event.type === 'keydown' && (event.repeat || event.ctrlKey || event.altKey
    || event.metaKey || !['Enter', ' '].includes(event.key))) return;
  stopListening();
  // Native music controls manage their own play/pause without a second toggle.
  if (event.target.closest('.room-music')) return;
  // A browser may still block playback; the native Play control stays available.
  void music.play().catch(() => {});
}

music.addEventListener('play', stopListening, { once: true });
document.addEventListener('click', startFromInteraction, true);
document.addEventListener('keydown', startFromInteraction, true);
