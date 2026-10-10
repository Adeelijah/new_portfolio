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
