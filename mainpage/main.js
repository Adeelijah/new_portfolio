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


// Drag the chat shortcut to the nearest corner, with a keyboard alternative.
const chatWidget = document.querySelector('.floating-chat');
if (chatWidget) {
  const chatKey = 'elijah-chat-corner';
  const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
  const moveButton = chatWidget.querySelector('.chat-move');
  const positionMenu = chatWidget.querySelector('.chat-position-menu');
  let corner = 'bottom-left';
  let drag = null;
  let suppressClick = false;
  try { const saved = localStorage.getItem(chatKey); if (corners.includes(saved)) corner = saved; } catch (_) {}
  function closePositionMenu() { positionMenu.hidden = true; moveButton.setAttribute('aria-expanded', 'false'); }
  function placeChat(nextCorner, persist = false) {
    corner = nextCorner;
    chatWidget.dataset.corner = corner;
    const margin = window.innerWidth < 600 ? 14 : 20;
    const left = corner.endsWith('left') ? margin : window.innerWidth - chatWidget.offsetWidth - margin;
    const top = corner.startsWith('top') ? margin : window.innerHeight - chatWidget.offsetHeight - margin;
    chatWidget.style.left = `${Math.max(0, left)}px`;
    chatWidget.style.top = `${Math.max(0, top)}px`;
    chatWidget.style.bottom = 'auto';
    positionMenu.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.chatCorner === corner)));
    if (persist) {
      try { localStorage.setItem(chatKey, corner); } catch (_) {}
      chatWidget.querySelector('.chat-status').textContent = `Chat moved to ${corner.replace('-', ' ')}.`;
    }
  }
  placeChat(corner);
  moveButton.addEventListener('click', () => {
    positionMenu.hidden = !positionMenu.hidden;
    moveButton.setAttribute('aria-expanded', String(!positionMenu.hidden));
    if (!positionMenu.hidden) positionMenu.querySelector('[aria-pressed="true"]').focus();
  });
  positionMenu.addEventListener('click', event => {
    const button = event.target.closest('[data-chat-corner]');
    if (!button) return;
    placeChat(button.dataset.chatCorner, true);
    closePositionMenu(); moveButton.focus();
  });
  chatWidget.addEventListener('keydown', event => {
    if (event.key === 'Escape') { closePositionMenu(); moveButton.focus(); return; }
    if (event.target !== moveButton) return;
    let next = corner;
    if (event.key === 'ArrowLeft') next = corner.replace('right', 'left');
    else if (event.key === 'ArrowRight') next = corner.replace('left', 'right');
    else if (event.key === 'ArrowUp') next = corner.replace('bottom', 'top');
    else if (event.key === 'ArrowDown') next = corner.replace('top', 'bottom');
    else if (event.key === 'Home') next = 'bottom-left';
    else return;
    event.preventDefault(); closePositionMenu(); placeChat(next, true);
  });
  chatWidget.addEventListener('pointerdown', event => {
    if (event.button !== 0 || event.isPrimary === false || event.target.closest('.chat-position-menu')) return;
    suppressClick = false;
    const rect = chatWidget.getBoundingClientRect();
    drag = {id: event.pointerId, x: event.clientX, y: event.clientY, left: rect.left, top: rect.top, moved: false};
  });
  window.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    const dx = event.clientX - drag.x, dy = event.clientY - drag.y;
    if (!drag.moved && Math.hypot(dx, dy) < 7) return;
    if (!drag.moved) { drag.moved = true; closePositionMenu(); chatWidget.setPointerCapture(event.pointerId); chatWidget.classList.add('is-dragging'); }
    event.preventDefault();
    const x = Math.max(8, Math.min(window.innerWidth - chatWidget.offsetWidth - 8, drag.left + dx));
    const y = Math.max(8, Math.min(window.innerHeight - chatWidget.offsetHeight - 8, drag.top + dy));
    chatWidget.style.left = `${x}px`; chatWidget.style.top = `${y}px`;
  }, {passive: false});
  function finishDrag(event) {
    if (!drag || event.pointerId !== drag.id) return;
    const moved = drag.moved;
    drag = null;
    chatWidget.classList.remove('is-dragging');
    if (chatWidget.hasPointerCapture(event.pointerId)) chatWidget.releasePointerCapture(event.pointerId);
    if (moved) {
      suppressClick = true;
      const rect = chatWidget.getBoundingClientRect();
      const vertical = rect.top + rect.height / 2 < window.innerHeight / 2 ? 'top' : 'bottom';
      const horizontal = rect.left + rect.width / 2 < window.innerWidth / 2 ? 'left' : 'right';
      placeChat(`${vertical}-${horizontal}`, true);
    }
  }
  window.addEventListener('pointerup', finishDrag);
  window.addEventListener('pointercancel', finishDrag);
  chatWidget.addEventListener('click', event => { if (suppressClick) { event.preventDefault(); event.stopImmediatePropagation(); suppressClick = false; } }, true);
  document.addEventListener('pointerdown', event => { if (!chatWidget.contains(event.target)) closePositionMenu(); });
  window.addEventListener('resize', () => { drag = null; chatWidget.classList.remove('is-dragging'); placeChat(corner); });
  window.addEventListener('blur', () => { drag = null; chatWidget.classList.remove('is-dragging'); placeChat(corner); });
}
