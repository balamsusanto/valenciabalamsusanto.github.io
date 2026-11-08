/* Header: mobile menu and the highlighted section link. */

const links = document.getElementById('links');
const navA = [...links.querySelectorAll('a')];

export function setActive(href) {
  navA.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === href));
}

export function initMenu() {
  document.getElementById('menu').onclick = () => links.classList.toggle('open');
  links.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') links.classList.remove('open');
  });
}

/* highlights the section currently in the middle of the screen */
export function initNavSpy() {
  const main = document.getElementById('main');
  const spy = new IntersectionObserver(
    (es) => {
      if (main.hidden) return;
      es.forEach((en) => {
        if (en.isIntersecting) setActive('#' + en.target.id);
      });
    },
    { rootMargin: '-45% 0px -50% 0px' },
  );
  document.querySelectorAll('main section').forEach((s) => spy.observe(s));
}
