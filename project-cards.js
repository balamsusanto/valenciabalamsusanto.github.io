/* Project cards: the home-page grid and the page opened from "More". */

import { projects } from './data/projects.js';

const FEATURED = 3; /* projects shown as full cards; the rest sit behind "More" */
const box = (p) => `<div class="ico">${p.ico}</div>`;
export const card = (
  p,
  cls = '',
) => `<a class="card${cls}" href="#project-${p.slug}"><div class="ico">${p.ico}</div><div style="min-width:0">
    <div class="top"><h3>${p.title}</h3><span class="pill">${p.tag}</span></div><p>${p.blurb}</p><span class="more">Read more →</span></div></a>`;

export function renderProjectGrid() {
  const pg = document.getElementById('proj-grid');
  pg.innerHTML =
    projects
      .slice(0, FEATURED)
      .map((p) => card(p, ' reveal'))
      .join('') +
    `<a class="more-sec reveal" href="#projects-all" aria-label="More: view all my projects"><h3>More</h3><div class="more-boxes" aria-hidden="true">${projects.slice(FEATURED).map(box).join('')}</div></a>`;
}
