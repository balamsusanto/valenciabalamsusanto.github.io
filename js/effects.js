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

/* hero greeting slot machine. While the opening screen is showing it waits, and it starts
   from "Hello!" once the visitor is on the home page */
export function initGreeting() {
  const slot = document.getElementById('slot');
  if (reduce) return;
  let i = 0,
    timer = null;
  function stop() {
    clearInterval(timer);
    timer = null;
    i = 0;
    slot.classList.remove('spin');
    slot.style.transform = 'translateY(0)';
  }
  function start() {
    stop();
    timer = setInterval(() => {
      i++;
      slot.classList.add('spin');
      slot.style.transform = `translateY(${-i * 1.18}em)`;
      if (i === 3) {
        setTimeout(() => {
          slot.classList.remove('spin');
          slot.style.transform = 'translateY(0)';
          i = 0;
        }, 800);
      }
    }, 1500);
  }
  addEventListener('opener:open', stop);
  addEventListener('opener:done', start);
  if (!document.documentElement.classList.contains('opener-on')) start();
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
      /* the normal arrow only goes once the dot is actually following the mouse */
      document.documentElement.classList.add('custom-cursor');
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
      ring.classList.toggle('big', !!e.target.closest('a,button,.card,.act,.mascot')),
    );
  }
}
