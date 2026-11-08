/* Pop-up window shared by the activities (photos + text) and the jobs (bullets only). */

import { acts } from './data/activities.js';
import { jobDetails } from './data/jobs.js';
import { reduce } from './shared.js';

export function initModal() {
  const ag = document.getElementById('act-grid');
  const modal = document.getElementById('modal');
  let lastFocus = null;
  const mImg = document.getElementById('m-img'),
    mPrev = document.getElementById('m-prev'),
    mNext = document.getElementById('m-next'),
    mCount = document.getElementById('m-count');
  let slides = [],
    slide = 0;
  function showSlide(i) {
    slide = i;
    mImg.src = slides[i].src;
    mImg.alt = slides[i].alt;
    mCount.textContent = `${i + 1} / ${slides.length}`;
  }
  function moveSlide(dir) {
    if (slides.length > 1) showSlide((slide + dir + slides.length) % slides.length);
  }
  mPrev.onclick = () => moveSlide(-1);
  mNext.onclick = () => moveSlide(1);
  function openModal(a) {
    slides = a.photos || [];
    document.getElementById('m-slides').hidden = !slides.length;
    document.getElementById('m-box').classList.toggle('text-only', !slides.length);
    if (slides.length) showSlide(0);
    slides.slice(1).forEach((p) => {
      new Image().src = p.src;
    });
    [mPrev, mNext, mCount].forEach((el) => {
      el.hidden = slides.length < 2;
    });
    lastFocus = document.activeElement;
    document.getElementById('m-title').textContent = a.title;
    document.getElementById('m-org').textContent = a.org;
    document.getElementById('m-when').textContent = a.when;
    const mText = document.getElementById('m-text'),
      mList = document.getElementById('m-list');
    mText.textContent = a.text || '';
    mText.hidden = !a.text;
    mList.innerHTML = (a.bullets || []).map((b) => `<li>${b}</li>`).join('');
    mList.hidden = !a.bullets;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    document.getElementById('m-box').scrollTop = 0;
    requestAnimationFrame(() => modal.classList.add('show'));
    document.getElementById('m-close').focus();
  }
  function closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    setTimeout(
      () => {
        modal.hidden = true;
      },
      reduce ? 0 : 250,
    );
    if (lastFocus) lastFocus.focus();
  }
  ag.addEventListener('click', (e) => {
    const b = e.target.closest('.act[data-i]');
    if (b) openModal(acts[b.dataset.i]);
  });
  document.querySelector('.timeline').addEventListener('click', (e) => {
    const b = e.target.closest('.job-more');
    if (!b) return;
    const job = b.closest('article');
    openModal({
      title: job.querySelector('h4').textContent,
      org: job.querySelector('h3').textContent,
      when: job.querySelector('.when').textContent,
      bullets: jobDetails[b.dataset.job],
    });
  });
  document.getElementById('m-close').onclick = closeModal;
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  addEventListener('keydown', (e) => {
    if (modal.hidden) return;
    if (e.key === 'Escape') closeModal();
    else if (e.key === 'ArrowLeft') moveSlide(-1);
    else if (e.key === 'ArrowRight') moveSlide(1);
  });
}
