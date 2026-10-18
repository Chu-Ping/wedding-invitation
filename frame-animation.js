// Frame playback uses elapsed time so timer drift does not change the requested fps.
export async function createFrameAnimation(canvas, { frames, fps, labels, pauseOnHover = false, loop = false }, onState, onComplete = () => {}) {
  const images = await Promise.all(frames.map(async url => {
    const image = new Image();
    image.src = url;
    await image.decode();
    return image;
  }));
  const context = canvas.getContext('2d');
  const duration = images.length * 1000 / fps;
  let elapsed = 0;
  let startedAt = 0;
  let timer;
  let playing = false;
  let hovered = false;
  let resumeOnLeave = false;
  let displayed = -1;
  function draw(index) {
    if (displayed === index) return;
    displayed = index;
    context.drawImage(images[index], 0, 0, canvas.width, canvas.height);
    canvas.dataset.frame = String(index);
    canvas.setAttribute('aria-label', index === 0 ? labels.start : index === images.length - 1 ? labels.end : labels.during);
  }
  function notify() { onState({ playing: playing || resumeOnLeave, ended: elapsed >= duration }); }
  function tick() {
    const now = performance.now();
    elapsed = Math.min(duration, now - startedAt);
    if (loop && now - startedAt >= duration) {
      elapsed = (now - startedAt) % duration;
      startedAt = now - elapsed;
    }
    const frame = Math.min(images.length - 1, Math.floor(elapsed * fps / 1000));
    draw(frame);
    if (elapsed >= duration) {
      playing = false;
      notify();
      onComplete();
      return;
    }
    const next = (frame + 1) * 1000 / fps;
    timer = setTimeout(tick, Math.max(1, next - (performance.now() - startedAt)));
  }
  function pause() {
    clearTimeout(timer);
    if (playing) {
      const position = performance.now() - startedAt;
      elapsed = loop ? position % duration : Math.min(duration, position);
    }
    playing = false;
    resumeOnLeave = false;
    notify();
  }
  function reset() {
    pause();
    canvas.width = images[0].naturalWidth;
    canvas.height = images[0].naturalHeight;
    elapsed = 0;
    displayed = -1;
    draw(0);
    notify();
  }
  function play() {
    if (playing) return;
    if (elapsed >= duration) reset();
    if (pauseOnHover && hovered) { resumeOnLeave = true; notify(); return; }
    playing = true;
    startedAt = performance.now() - elapsed;
    notify();
    tick();
  }
  function setHovered(value) {
    if (!pauseOnHover || hovered === value) return;
    hovered = value;
    if (hovered && playing) {
      pause();
      resumeOnLeave = true;
      notify();
    } else if (!hovered && resumeOnLeave) {
      resumeOnLeave = false;
      play();
    }
  }
  // Loading a cached sequence must not draw over another active animation.
  // Its canvas is prepared only when reset() is called on entering that view.
  return { play, pause, reset, setHovered, toggle() { if (playing || resumeOnLeave) pause(); else play(); }, replay() { reset(); play(); } };
}
