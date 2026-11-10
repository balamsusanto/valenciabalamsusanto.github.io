/* Home-page "One role, one project" cards, plus the project card used on the "all projects" page. */

import { projects } from './data/projects.js';
import { tracks } from './data/tracks.js';

export const card = (
  p,
  cls = '',
) => `<a class="card${cls}" href="#project-${p.slug}"><div class="ico">${p.ico}</div><div style="min-width:0">
    <div class="top"><h3>${p.title}</h3><span class="pill">${p.tag}</span></div><p>${p.blurb}</p><span class="more">Read more →</span></div></a>`;

/* each card is a subgrid, so the role, title, result, description and button line up across all three */
export function renderProjectGrid() {
  document.getElementById('track-grid').innerHTML = tracks
    .map((t) => {
      const p = projects.find((x) => x.slug === t.slug);
      return `<a class="track reveal" href="#project-${p.slug}">
          <span class="mono track-for">${t.role}</span>
          <span class="track-head"><span class="ico">${p.ico}</span><h3>${p.title}</h3></span>
          <span class="track-stat"><b>${t.stat}</b> ${t.statLabel}</span>
          <span class="track-why">${t.why}</span>
          <span class="more">See the project →</span>
        </a>`;
    })
    .join('');
}
