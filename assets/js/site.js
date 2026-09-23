(() => {
    'use strict';
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const header = document.querySelector('.site-header');
    const toggle = document.querySelector('.menu-toggle');
    const menu = document.querySelector('.mobile-menu');
    const main = document.querySelector('main');
    function setMenu(open, returnFocus = false) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.querySelector('.menu-text').textContent = open ? 'Fechar' : 'Menu';
      menu.hidden = !open;
      document.body.classList.toggle('menu-open', open);
      main.inert = open;
      if (open) menu.querySelector('a').focus({preventScroll:true});
      else if (returnFocus) toggle.focus({preventScroll:true});
    }
    toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
    header.querySelector('.brand').addEventListener('click', () => {if(!menu.hidden)setMenu(false);});
    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
    document.addEventListener('keydown', event => {
      if (menu.hidden) return;
      if (event.key === 'Escape') {setMenu(false, true);return;}
      if (event.key !== 'Tab') return;
      const controls = [header.querySelector('.brand'), toggle, ...menu.querySelectorAll('a')];
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && document.activeElement === first) {event.preventDefault();last.focus();}
      else if (!event.shiftKey && document.activeElement === last) {event.preventDefault();first.focus();}
    });
    window.addEventListener('resize', () => {if (innerWidth > 760 && !menu.hidden) setMenu(false);}, {passive:true});
    if ('IntersectionObserver' in window && !reduced.matches) {
      document.body.classList.add('has-motion');
      const observer = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {entry.target.classList.add('is-visible');observer.unobserve(entry.target);}
      }), {threshold:0.08});
      document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
      reduced.addEventListener('change', event => {if(event.matches){document.body.classList.remove('has-motion');observer.disconnect();}});
    }
    document.addEventListener('visibilitychange', () => {
      document.querySelectorAll('.hero-visual,.ticker-track,.contact-star,.lava-button').forEach(el => el.style.animationPlayState = document.hidden ? 'paused' : '');
    });
  })();
