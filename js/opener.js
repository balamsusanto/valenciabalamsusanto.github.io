/* Opening screen: Hello!, Halo! and 您好! fade in one at a time, then the screen slides up like a
   lifted cover to reveal the home page, and only then does the hero's greeting start spinning.

   Skipping: scroll down, swipe or drag up, click/tap, press a key, or use the Skip button.
   Replaying: at the top of the home page, scrolling up (or pulling down on a phone) shows a
   prompt; doing it again brings the opening screen back.

   It plays by itself once per browser tab (sessionStorage), only when the site opens on the home
   page, and never for visitors who ask for reduced motion. That first decision is made by the
   inline script in index.html's <head>, so the home page never flashes first. */

import { reduce } from './shared.js';

const WORD_MS = 2400; /* time each greeting is on screen, fade in and out included */
const WORD_FADE_OUT_MS = 700;
const LIFT_MS = 1400; /* the screen sliding up to reveal the home page (must match opener.css) */
const SWIPE_PX = 70; /* how far a finger or mouse must drag up to skip */
const PROMPT_MS = 4000; /* how long the "scroll up again" prompt waits for the second scroll */

const root = document.documentElement;
let opener, words, timers = [], open = false;

function later(fn, ms) {
  timers.push(setTimeout(fn, ms));
}

function play() {
  open = true;
  timers.forEach(clearTimeout);
  timers = [];
  root.classList.add('opener-on');
  opener.classList.remove('leaving', 'dragging');
  opener.style.transform = '';
  words.forEach((w) => (w.className = 'opener-word grad'));
  dispatchEvent(new Event('opener:open'));

  /* each word fades in, holds, fades out; the last one leads straight into the slide */
  words.forEach((w, i) => {
    const start = 250 + i * WORD_MS;
    later(() => w.classList.add('show'), start);
    if (i < words.length - 1) later(() => w.classList.add('hide'), start + WORD_MS - WORD_FADE_OUT_MS);
  });
  later(finish, 250 + words.length * WORD_MS - 300);
}

function finish() {
  if (!open) return;
  open = false;
  timers.forEach(clearTimeout);
  timers = [];
  try {
    sessionStorage.setItem('introSeen', '1');
  } catch {
    /* storage blocked: the intro simply plays again next time */
  }
  opener.classList.remove('dragging');
  opener.style.transform = '';
  opener.classList.add('leaving'); /* slides up */
  later(() => {
    root.classList.remove('opener-on');
    opener.classList.remove('leaving');
    dispatchEvent(new Event('opener:done'));
  }, LIFT_MS);
}

/* ---- skipping ---- */
function initSkip() {
  addEventListener(
    'wheel',
    (e) => {
      if (open && e.deltaY > 0) finish();
    },
    { passive: true },
  );
  addEventListener('keydown', (e) => {
    if (open && ['Enter', ' ', 'Escape', 'ArrowDown', 'PageDown', 'End'].includes(e.key)) {
      e.preventDefault();
      finish();
    }
  });
  opener.querySelector('.opener-skip').addEventListener('click', finish);

  /* drag or swipe up: the screen follows the finger, and lifts off past SWIPE_PX */
  let startY = null,
    moved = 0;
  opener.addEventListener('pointerdown', (e) => {
    if (!open) return;
    startY = e.clientY;
    moved = 0;
    opener.classList.add('dragging');
    opener.setPointerCapture(e.pointerId);
  });
  opener.addEventListener('pointermove', (e) => {
    if (startY === null || !open) return;
    moved = Math.min(0, e.clientY - startY);
    opener.style.transform = `translateY(${moved}px)`;
  });
  const release = () => {
    if (startY === null || !open) return;
    startY = null;
    opener.classList.remove('dragging');
    /* a drag past the threshold or a plain click/tap skips; a short drag springs back */
    if (-moved > SWIPE_PX || moved === 0) finish();
    else opener.style.transform = '';
  };
  opener.addEventListener('pointerup', release);
  opener.addEventListener('pointercancel', release);
}

/* ---- replaying: scroll up twice at the top of the home page ---- */
function initReplay() {
  const prompt = document.getElementById('replay-prompt');
  const main = document.getElementById('main');
  const touch = matchMedia('(pointer: coarse)').matches;
  prompt.textContent = touch
    ? '↓ Pull down again to replay the intro'
    : '↑ Scroll up again to replay the intro';
  let armed = false,
    hideTimer,
    gestureEnd = 0;
  const atHomeTop = () => !open && !main.hidden && scrollY <= 0;
  function hidePrompt() {
    armed = false;
    prompt.classList.remove('show');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => (prompt.hidden = true), 300);
  }
  /* one scroll gesture fires many events; a pause of 350ms ends it */
  function upGesture() {
    const now = Date.now(),
      newGesture = now - gestureEnd > 350;
    gestureEnd = now;
    if (!newGesture) return;
    if (armed) {
      hidePrompt();
      play();
      return;
    }
    armed = true;
    clearTimeout(hideTimer);
    prompt.hidden = false;
    void prompt.offsetWidth; /* apply the hidden→shown change first, so the fade-in plays */
    prompt.classList.add('show');
    hideTimer = setTimeout(hidePrompt, PROMPT_MS);
  }
  addEventListener(
    'wheel',
    (e) => {
      if (e.deltaY < 0 && atHomeTop()) upGesture();
      else if (e.deltaY > 0 && armed) hidePrompt();
      else if (e.deltaY < 0) gestureEnd = Date.now(); /* still scrolling up towards the top */
    },
    { passive: true },
  );
  /* phones: pulling down at the very top */
  let ty = null;
  addEventListener(
    'touchstart',
    (e) => {
      ty = atHomeTop() ? e.touches[0].clientY : null;
    },
    { passive: true },
  );
  addEventListener(
    'touchmove',
    (e) => {
      if (ty !== null && e.touches[0].clientY - ty > 60) {
        ty = null;
        gestureEnd = 0; /* each pull counts as its own gesture */
        upGesture();
      }
    },
    { passive: true },
  );
  addEventListener('hashchange', () => armed && hidePrompt());
}

export function initOpener() {
  opener = document.getElementById('opener');
  if (!opener || reduce) {
    root.classList.remove('opener-on');
    opener?.remove();
    return;
  }
  words = [...opener.querySelectorAll('.opener-word')];
  initSkip();
  initReplay();
  if (root.classList.contains('opener-on')) play();
}
