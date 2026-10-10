(function () {
  const key = 'elijah-portfolio-theme';
  const root = document.documentElement;
  const system = window.matchMedia('(prefers-color-scheme: dark)');
  let preference = null;
  try { const stored = localStorage.getItem(key); if (stored === 'light' || stored === 'dark') preference = stored; } catch (_) {}
  function apply(theme) {
    root.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === 'dark' ? '#111e30' : '#faf7f2';
    const button = document.querySelector('.theme-toggle');
    if (button) {
      button.setAttribute('aria-checked', String(theme === 'dark'));
      button.title = `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`;
      button.querySelector('.theme-label').textContent = theme === 'dark' ? 'Dark' : 'Light';
    }
  }
  apply(preference || (system.matches ? 'dark' : 'light'));
  document.addEventListener('DOMContentLoaded', function () {
    apply(root.dataset.theme);
    const button = document.querySelector('.theme-toggle');
    if (button) button.addEventListener('click', function () {
      preference = root.dataset.theme === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(key, preference); } catch (_) {}
      apply(preference);
    });
  });
  system.addEventListener('change', function (event) { if (!preference) apply(event.matches ? 'dark' : 'light'); });
})();
