const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
const toggle = document.querySelector('.motion-toggle');
let paused = reduced.matches;
function setMotion(value) {
  paused = value;
  document.body.classList.toggle('motion-paused', paused);
  if (paused) document.querySelectorAll('.tilt').forEach(card => { card.style.transform = ''; });
  toggle.textContent = paused ? 'Enable motion' : 'Pause motion';
  toggle.setAttribute('aria-pressed', String(paused));
}
setMotion(paused);
toggle.addEventListener('click', () => setMotion(!paused));
reduced.addEventListener('change', event => setMotion(event.matches));
if ('IntersectionObserver' in window && !reduced.matches) {
  document.body.classList.add('js-motion');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
  }, {threshold: 0.08});
  document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('pointermove', event => {
      if (paused) return;
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1400px) rotateX(${-y * 4}deg) rotateY(${x * 5}deg)`;
    });
    card.addEventListener('pointerleave', () => {card.style.transform = '';});
  });
}
document.getElementById('year').textContent = String(new Date().getFullYear());


// The contact character reacts only to mouse movement while visible.
const contactGuide = document.querySelector('.contact-guide');
if (contactGuide) {
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let guideVisible = !('IntersectionObserver' in window);
  let pendingFrame = 0;
  const guideProperties = ['--guide-head-x', '--guide-head-y', '--guide-head-angle', '--guide-eye-x', '--guide-eye-y'];
  function resetGuide() {
    if (pendingFrame) cancelAnimationFrame(pendingFrame);
    pendingFrame = 0;
    guideProperties.forEach(property => contactGuide.style.removeProperty(property));
  }
  if ('IntersectionObserver' in window) {
    const guideObserver = new IntersectionObserver(entries => {
      guideVisible = entries[0].isIntersecting;
      if (!guideVisible) resetGuide();
    });
    guideObserver.observe(contactGuide);
  }
  window.addEventListener('pointermove', event => {
    if (event.pointerType !== 'mouse' || !finePointer.matches || paused || reduced.matches || !guideVisible || document.hidden) return;
    if (pendingFrame) cancelAnimationFrame(pendingFrame);
    pendingFrame = requestAnimationFrame(() => {
      pendingFrame = 0;
      const rect = contactGuide.querySelector('svg').getBoundingClientRect();
      const faceX = rect.left + rect.width * (98 / 240);
      const faceY = rect.top + rect.height * (58 / 270);
      const clamp = value => Math.max(-1, Math.min(1, value));
      const x = clamp((event.clientX - faceX) / Math.max(window.innerWidth * 0.35, 200));
      const y = clamp((event.clientY - faceY) / Math.max(window.innerHeight * 0.35, 180));
      contactGuide.style.setProperty('--guide-eye-x', `${x * 1.5}px`);
      contactGuide.style.setProperty('--guide-eye-y', `${y * 1.2}px`);
      contactGuide.style.setProperty('--guide-head-x', `${x * 1.4}px`);
      contactGuide.style.setProperty('--guide-head-y', `${y * 1.1}px`);
      contactGuide.style.setProperty('--guide-head-angle', `${x * 3}deg`);
    });
  }, {passive: true});
  document.documentElement.addEventListener('pointerleave', resetGuide);
  document.addEventListener('visibilitychange', () => { if (document.hidden) resetGuide(); });
  toggle.addEventListener('click', () => { if (paused) resetGuide(); });
  reduced.addEventListener('change', resetGuide);
  finePointer.addEventListener('change', resetGuide);
}
