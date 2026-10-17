'use strict';
// Menu do celular: o CSS mostra a navegação quando aria-expanded="true".
(() => {
  const button = document.querySelector('.menu');
  const nav = document.getElementById('navigation');
  if (!button || !nav) return;
  const isOpen = () => button.getAttribute('aria-expanded') === 'true';
  const set = open => button.setAttribute('aria-expanded', String(open));
  button.addEventListener('click', () => set(!isOpen()));
  nav.addEventListener('click', event => { if (event.target.closest('a')) set(false); });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && isOpen()) { set(false); button.focus(); }
  });
  matchMedia('(min-width: 761px)').addEventListener('change', () => set(false));
})();
