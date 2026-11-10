/* Swaps between the home page and the project pages, based on the # in the address. */

import { amzDashHTML, mountAmzDash } from './dashboard-amazon.js';
import { dashHTML, mountDash } from './dashboard-netflix.js';
import { CartoonBot } from './cartoon-bot.js';
import { botGridHTML, mountBotChat } from './home-chat.js';
import { projects } from './data/projects.js';
import { setActive } from './nav.js';
import { card } from './project-cards.js';

const main = document.getElementById('main'),
  detail = document.getElementById('detail'),
  db = document.getElementById('detail-body');
/* "What I did": plain strings are bullet steps; {h,p} items become a subtitle with a paragraph */
function approachHTML(items) {
  let out = '',
    ul = [];
  const flush = () => {
    if (ul.length) {
      out += `<ul>${ul.map((x) => `<li>${x}</li>`).join('')}</ul>`;
      ul = [];
    }
  };
  items.forEach((x) => {
    if (typeof x === 'string') ul.push(x);
    else {
      flush();
      out += `<h3 class="sub-h">${x.h}</h3><p>${x.p}</p>`;
    }
  });
  flush();
  return out;
}
/* "Automation & others": a page of separate mini write-ups instead of problem / approach / results */
const escHTML = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const codeHTML = (c) =>
  `<div class="codebox"><span class="box-label mono">${c.file}</span><pre tabindex="0"><code>${escHTML(c.src)}</code></pre></div>`;
function partsHTML(p) {
  return (
    `<p style="margin-top:28px">${p.intro}</p>` +
    p.parts
      .map(
        (x) => `<h2>${x.h}</h2>
    ${x.p.map((t) => `<p>${t}</p>`).join('')}
    ${x.prompt ? `<div class="promptbox"><span class="box-label mono">The prompt</span><p>${x.prompt}</p></div>` : ''}
    ${x.points ? `<ul>${x.points.map((t) => `<li>${t}</li>`).join('')}</ul>` : ''}
    ${x.code ? codeHTML(x.code) : ''}${x.out ? codeHTML(x.out) : ''}
    ${x.fig ? `<figure class="fig"><img src="${x.fig.src}" alt="${x.fig.alt}" loading="lazy"><figcaption>${x.fig.cap}</figcaption></figure>` : ''}
    ${x.bots ? statesHTML(x.botsCap) : ''}`,
      )
      .join('')
  );
}
/* "Creating my chatbot mascot": one small canvas per robot state, animated by mountStates() */
const titleCase = (s) => s[0].toUpperCase() + s.slice(1);
function statesHTML(cap) {
  return `<figure class="fig"><div class="bot-states">${Object.entries(CartoonBot.states)
    .map(
      ([name, st]) => `<div class="bot-state">
        <canvas width="240" height="240" data-state="${name}" role="img" aria-label="Robot mascot, ${name} state: ${st.desc}"></canvas>
        <b>${titleCase(name)}</b><span>${st.desc}</span></div>`,
    )
    .join('')}</div><figcaption>${cap}</figcaption></figure>`;
}
let stateBots = []; /* stopped when the page changes, so the animations don't run in the background */
function mountStates() {
  stateBots = [...db.querySelectorAll('.bot-states canvas')].map((c) => CartoonBot.mount(c, c.dataset.state));
}
/* the back link returns visitors to where they opened each project from. Opened from the
   chatbot section or the chatbot's project page, it reads "Back to chatbot" */
const BACK_LABELS = {
  chatbot: 'Back to chatbot',
  'project-ask-valencia': 'Back to chatbot',
};
const DEFAULT_BACK = { href: '#projects', label: 'Back to projects' };
let origins = {};
document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#project-"]');
  if (!a || a.classList.contains('back')) return; /* going back keeps that page's own origin */
  const from = main.hidden ? location.hash.slice(1) : a.closest('main section')?.id;
  const to = a.getAttribute('href').slice(1);
  if (!from || from === to) return;
  origins[to] = { href: '#' + from, label: BACK_LABELS[from] || 'Back to projects' };
});
/* under the pills: "Personal project" and its data source on two lines on the left, the
   summary download on the right */
function metaRowHTML(p) {
  const lines = [p.role, p.when].filter(Boolean).join(' · ').split(' · ');
  const dl = p.summaryPdf
    ? `<a class="more dl-link" href="${p.summaryPdf}" download>Download Executive Summary</a>`
    : '';
  const meta = lines[0] ? `<p class="mono meta-lines">${lines.join('<br>')}</p>` : '';
  return dl || meta ? `<div class="meta-row">${meta}${dl}</div>` : '';
}
let pageBot = null; /* the mascot on the chatbot's project page */
function route() {
  const h = location.hash.slice(1);
  detail.classList.toggle('wide', h === 'projects-all');
  const p = projects.find((x) => 'project-' + x.slug === h);
  if (pageBot) {
    pageBot.dispose();
    pageBot = null;
  }
  stateBots.forEach((b) => b.stop());
  stateBots = [];
  if (h === 'projects-all') {
    db.innerHTML = `<a class="back mono" href="#projects">← Back to projects</a>
        <h1 class="sec-title">Things I've built</h1>
        <div class="proj-grid">${projects.map((x) => card(x)).join('')}</div>`;
    main.hidden = true;
    detail.hidden = false;
    scrollTo(0, 0);
    setActive('#projects');
  } else if (p) {
    const back = origins[h] || DEFAULT_BACK;
    db.innerHTML = `<a class="back mono" href="${back.href}">← ${back.label}</a>
        <h1>${p.title}</h1><p class="sum">${p.sum}</p>
        <div class="tags">${p.fit ? `<span class="pill fit">${p.fit}</span>` : ''}${p.tools.map((t) => `<span class="pill">${t}</span>`).join('')}</div>
        ${metaRowHTML(p)}
        ${p.stats ? `<div class="stats">${p.stats.map((s) => `<div class="stat"><b>${s.n}</b><span>${s.l}</span></div>`).join('')}</div>` : ''}
        ${p.parts ? partsHTML(p) : p.dash === 'amazon' ? amzDashHTML : p.dash ? dashHTML : p.image ? `<img src="${p.image}" alt="${p.imageAlt || p.title}" style="width:100%;border-radius:16px;margin:32px 0;border:1px solid var(--line)">` : '<div class="hero-img">screenshot or diagram</div>'}
        ${p.chat ? `<div class="bot-grid page-bot">${botGridHTML({ id: 'page-chat', heading: 'Try it yourself' })}</div>` : ''}
        ${
          p.parts
            ? ''
            : `<h2>The problem</h2><p>${p.problem}</p>
        <h2>What I did</h2>${Array.isArray(p.approach) ? approachHTML(p.approach) : `<p>${p.approach}</p>`}
        ${(p.sections || []).map((s) => `<h2>${s.h}</h2><p>${s.p}</p>`).join('')}
        <h2>${p.resultsH || 'Results'}</h2>${p.results && p.results.length ? `<ul>${p.results.map((r) => `<li>${r}</li>`).join('')}</ul>` : '<p class="todo">Add your headline result here, for example accuracy, time saved or what you found.</p>'}`
        }
        ${(p.gallery || []).map((g) => `<figure class="fig"><img src="${g.src}" alt="${g.alt}" loading="lazy"><figcaption>${g.cap}</figcaption></figure>`).join('')}
        ${p.learned ? `<h2>${p.learnedH || 'What I learned'}</h2>${Array.isArray(p.learned) ? `<ul>${p.learned.map((l) => `<li>${l}</li>`).join('')}</ul>` : `<p>${p.learned}</p>`}` : ''}
        ${p.verdict ? `<h2>Final verdict</h2><p>${p.verdict}</p>` : ''}
        ${p.links && p.links.length ? `<h2>Links</h2><p>${p.links.map((l) => `<a href="${l.url}" target="_blank" rel="noopener" style="color:var(--accent)">${l.label} ↗</a>`).join(' · ')}</p>` : ''}`;
    main.hidden = true;
    detail.hidden = false;
    if (p.chat) pageBot = mountBotChat(db.querySelector('.page-bot'));
    if (p.parts) mountStates();
    scrollTo(0, 0);
    if (p.dash)
      (p.dash === 'amazon'
        ? mountAmzDash
        : mountDash)(); /* after unhiding, so the charts can measure their width */
    setActive('#projects');
  } else {
    origins = {}; /* back home: the next project opened sets a fresh origin */
    if (!main.hidden) {
      return;
    }
    main.hidden = false;
    detail.hidden = true;
    const el = h && document.getElementById(h);
    if (el) el.scrollIntoView();
  }
}

export function initRouter() {
  addEventListener('hashchange', route);
  route();
}
