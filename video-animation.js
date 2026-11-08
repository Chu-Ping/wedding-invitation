import { setUIAttribute } from './i18n.js?v=20261108-rsvp-embed';

// Decode a local MP4 into the existing animation canvas and playback controls.
export async function createVideoAnimation(canvas, { video: source, poster, labels }, onState, onComplete = () => {}) {
  const video = document.createElement('video');
  video.muted = true;
  video.playsInline = true;
  video.preload = 'auto';
  const firstFrame = new Image();
  firstFrame.src = poster;
  await Promise.all([
    firstFrame.decode(),
    new Promise((resolve, reject) => {
      const timeout = setTimeout(() => finish(new Error('Video loading timed out')), 30000);
      function finish(error) {
        clearTimeout(timeout);
        video.removeEventListener('loadeddata', loaded);
        video.removeEventListener('error', failed);
        if (error) reject(error); else resolve();
      }
      const loaded = () => finish();
      const failed = () => finish(new Error('Video could not load'));
      video.addEventListener('loadeddata', loaded);
      video.addEventListener('error', failed);
      video.src = source;
      video.load();
    }),
  ]);
  const context = canvas.getContext('2d');
  let drawing = false;
  let ended = false;
  let frame;
  let playRequest = 0;
  function notify(error) { onState({ playing: !video.paused, ended, error }); }
  function draw() {
    if (!drawing || video.readyState < 2) return;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.dataset.frame = String(Math.floor(video.currentTime * 30));
    canvas.dataset.time = String(video.currentTime);
    setUIAttribute(canvas, 'aria-label', ended ? labels.end : video.currentTime === 0 ? labels.start : labels.during);
  }
  function tick() {
    draw();
    if (drawing && !video.paused) frame = requestAnimationFrame(tick);
  }
  function pause() {
    ++playRequest;
    drawing = false;
    video.pause();
    cancelAnimationFrame(frame);
    notify();
  }
  function reset() {
    pause();
    ended = false;
    drawing = true;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(firstFrame, 0, 0, canvas.width, canvas.height);
    canvas.dataset.frame = '0';
    canvas.dataset.time = '0';
    setUIAttribute(canvas, 'aria-label', labels.start);
    video.currentTime = 0;
    notify();
  }
  async function play() {
    if (!video.paused) return;
    if (ended) reset();
    const thisPlay = ++playRequest;
    drawing = true;
    try {
      await video.play();
      if (thisPlay !== playRequest) return;
      cancelAnimationFrame(frame);
      tick();
      notify();
    } catch (error) {
      if (thisPlay === playRequest) notify(error);
    }
  }
  video.addEventListener('seeked', draw);
  video.addEventListener('ended', () => {
    if (!drawing) return;
    ended = true;
    cancelAnimationFrame(frame);
    draw();
    notify();
    onComplete();
  });
  video.addEventListener('error', () => { if (drawing) { pause(); notify(new Error('Video playback failed')); } });
  return {
    play, pause, reset,
    setHovered() {},
    toggle() { if (video.paused) void play(); else pause(); },
    replay() { reset(); void play(); },
  };
}
