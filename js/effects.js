/* Page effects: scroll reveal, greeting slot machine and custom cursor. */

import { reduce } from './shared.js';

/* only hides what starts below the fold */
export function initReveal() {
  if (!reduce && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((en) => {
          if (en.isIntersecting) {
            const sibs = [...en.target.parentNode.children].filter((c) =>
              c.classList.contains('reveal'),
            );
            en.target.style.transitionDelay = Math.min(sibs.indexOf(en.target), 5) * 90 + 'ms';
            en.target.classList.remove('pending');
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.12 },
    );
    document.querySelectorAll('.reveal').forEach((el) => {
      if (el.getBoundingClientRect().top > innerHeight) {
        el.classList.add('pending');
        io.observe(el);
      }
    });
  }
}

export function initGreeting() {
  const slot = document.getElementById('slot');
  if (!reduce) {
    let i = 0;
    const n = 3;
    setInterval(() => {
      i++;
      slot.classList.add('spin');
      slot.style.transform = `translateY(${-i * 1.18}em)`;
      if (i === n) {
        setTimeout(() => {
          slot.classList.remove('spin');
          slot.style.transform = 'translateY(0)';
          i = 0;
        }, 800);
      }
    }, 1500);
  }
}

export function initCursor() {
  if (matchMedia('(pointer:fine)').matches) {
    const ring = document.querySelector('.c-ring'),
      dot = document.querySelector('.c-dot');
    let mx = -100,
      my = -100,
      rx = -70,
      ry = -70;
    addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
      dot.style.transform = `translate(${mx}px,${my}px)`;
    });
    (function loop() {
      const R = (ring.classList.contains('big') ? 35 : 22) + 4;
      let dx = rx - mx,
        dy = ry - my,
        d = Math.hypot(dx, dy);
      if (d < 0.5) {
        dx = 1;
        dy = 1;
        d = Math.SQRT2;
      }
      const tx = mx + (dx / d) * R,
        ty = my + (dy / d) * R;
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      ring.style.transform = `translate(${rx}px,${ry}px)`;
      requestAnimationFrame(loop);
    })();
    document.addEventListener('mouseover', (e) =>
      ring.classList.toggle('big', !!e.target.closest('a,button,.card,.act')),
    );
  }
}
