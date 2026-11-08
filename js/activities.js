/* Extracurricular activities: cards plus the arrow carousel. */

import { acts } from './data/activities.js';
import { reduce } from './shared.js';

export function initActivities() {
  const ag = document.getElementById('act-grid');
  ag.innerHTML = acts
    .map(
      (a, i) =>
        `<button class="act" type="button" data-i="${i}"><img class="img" src="${a.photos[0].src}" alt="${a.photos[0].alt}" loading="lazy"${a.pos ? ` style="object-position:${a.pos}"` : ''}><h3>${a.title}</h3><span class="org">${a.org}</span><span class="when mono">${a.when}</span></button>`,
    )
    .join('');

  /* activity carousel: arrows move one card at a time and loop at both ends, swiping also works */
  const aPrev = document.getElementById('act-prev'),
    aNext = document.getElementById('act-next');
  /* the target card is remembered during a scroll, so quick repeat clicks each count */
  let actTarget = null,
    actIdle;
  function actSettle(ms) {
    clearTimeout(actIdle);
    actIdle = setTimeout(() => {
      actTarget = null;
    }, ms);
  }
  function actMove(dir) {
    const step =
      ag.children[0].getBoundingClientRect().width + parseFloat(getComputedStyle(ag).columnGap);
    const stops = Math.round((ag.scrollWidth - ag.clientWidth) / step) + 1;
    actTarget = ((actTarget ?? Math.round(ag.scrollLeft / step)) + dir + stops) % stops;
    ag.scrollTo({ left: actTarget * step, behavior: reduce ? 'auto' : 'smooth' });
    actSettle(400);
  }
  aPrev.onclick = () => actMove(-1);
  aNext.onclick = () => actMove(1);
  ag.addEventListener(
    'scroll',
    () => {
      if (actTarget !== null) actSettle(150);
    },
    { passive: true },
  );
}
