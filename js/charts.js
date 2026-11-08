/* Inline-SVG chart helpers shared by the project dashboards. */

import { esc } from './shared.js';

let dashRO = null;

/* redraws a dashboard when its width changes, and stops watching the previous one */
export function watchWidth(box, redraw) {
  if (dashRO) dashRO.disconnect();
  let lastW = box.clientWidth,
    tm = 0;
  dashRO = new ResizeObserver(() => {
    if (!box.isConnected || box.clientWidth === lastW) return;
    lastW = box.clientWidth;
    clearTimeout(tm);
    tm = setTimeout(() => {
      if (box.isConnected) redraw();
    }, 80);
  });
  dashRO.observe(box);
}

export function chartKit(box, tip) {
  const f = (n) => n.toLocaleString('en-GB');
  const sw = (c) => `<i style="background:var(--c-${c})"></i>`;
  /* --- chart helpers (inline SVG; colours come from CSS classes) --- */
  const nice = (v) => {
    if (v <= 0) return 1;
    const p = 10 ** Math.floor(Math.log10(v / 4)),
      s = [1, 2, 2.5, 5, 10].map((k) => k * p).find((k) => v / k <= 4);
    return Math.ceil(v / s) * s;
  };
  const topR = (x, y, w, h, r) => {
    r = Math.min(r, w / 2, h);
    return `M${x},${y + h}V${y + r}Q${x},${y} ${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h}Z`;
  };
  const rightR = (x, y, w, h, r) => {
    r = Math.min(r, h / 2, w);
    return `M${x},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x}Z`;
  };
  const svg = (el, w, h, inner, label, tipFn) => {
    el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="${esc(label)}">${inner}</svg>`;
    const s = el.firstChild;
    s.onpointermove = (e) => {
      const t = e.target.closest('[data-i]');
      if (!t) {
        tip.hidden = true;
        return;
      }
      tip.innerHTML = tipFn(+t.dataset.i);
      tip.hidden = false;
      const b = box.getBoundingClientRect(),
        tw = tip.offsetWidth,
        th = tip.offsetHeight;
      let x = e.clientX - b.left + 14,
        y = e.clientY - b.top - th - 12;
      if (x + tw > b.width - 8) x = e.clientX - b.left - tw - 14;
      if (x < 8) x = 8;
      if (y < 8) y = e.clientY - b.top + 18;
      tip.style.left = x + 'px';
      tip.style.top = y + 'px';
    };
    s.onpointerleave = () => {
      tip.hidden = true;
    };
  };
  const table = (el, head, rows) => {
    el.insertAdjacentHTML(
      'beforeend',
      `<details><summary>Show as table</summary><div class="tbl"><table><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c) => `<td>${typeof c === 'number' ? f(c) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div></details>`,
    );
  };
  const tipRows = (title, vals) =>
    `<div style="margin-bottom:2px">${title}</div>` +
    vals.map(([c, l, v]) => `<div>${c ? sw(c) : ''}${l}: <b>${v}</b></div>`).join('');

  /* vertical stacked bars: cats = labels, ser = [{c, v:[...]}] */
  function vbars(el, cats, ser, { h = 200, xlab, tipFn, label }) {
    const W = Math.max(el.clientWidth, 260),
      L = 40,
      R = 6,
      T = 10,
      B = 24,
      pw = W - L - R,
      ph = h - T - B,
      n = cats.length;
    const tot = cats.map((_, i) => ser.reduce((s, q) => s + q.v[i], 0)),
      mx = nice(Math.max(...tot, 1));
    const step = pw / n,
      gap = step > 6 ? 2 : 1,
      bw = Math.max(step - gap, 1),
      Y = (v) => T + ph - (v / mx) * ph;
    let g = '';
    for (let k = 0; k <= 4; k++) {
      const v = (mx * k) / 4;
      g += `<line class="grid" x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${f(v)}</text>`;
    }
    cats.forEach((c, i) => {
      const x = L + i * step + gap / 2;
      let base = T + ph;
      const vis = ser.filter((q) => q.v[i] > 0);
      vis.forEach((q, j) => {
        const hh = (q.v[i] / mx) * ph,
          first = j === 0,
          y = base - hh,
          hd = first ? hh : Math.max(hh - 2, 0.5);
        g +=
          j === vis.length - 1
            ? `<path class="${q.c}" d="${topR(x, y, bw, hd, 4)}"/>`
            : `<rect class="${q.c}" x="${x}" y="${y}" width="${bw}" height="${hd}"/>`;
        base = y;
      });
      const xl = xlab(i);
      if (xl)
        g += `<text x="${x + bw / 2}" y="${h - 6}" text-anchor="${xl.a || 'middle'}">${xl.t}</text>`;
      g += `<rect class="hit" data-i="${i}" x="${L + i * step}" y="${T}" width="${step}" height="${ph}"/>`;
    });
    svg(el, W, h, g, label, tipFn);
  }

  /* horizontal bars, one row per label; ser as above */
  function hbars(el, labs, ser, { label, tipFn, fmt = f }) {
    const W = Math.max(el.clientWidth, 260),
      lw = Math.min(170, W * 0.42),
      R = 44,
      rh = 24,
      T = 4,
      h = T + labs.length * rh + 4,
      pw = W - lw - R;
    const tot = labs.map((_, i) => ser.reduce((s, q) => s + q.v[i], 0)),
      mx = Math.max(...tot, 1);
    let g = '';
    labs.forEach((lab, i) => {
      const y = T + i * rh + 5;
      let x = lw;
      const vis = ser.filter((q) => q.v[i] > 0);
      const fit = Math.floor((lw - 10) / 6.8),
        sh =
          lab.length > fit
            ? lab.slice(0, fit - 1).trimEnd() + '…'
            : lab; /* 11px mono ≈ 6.7px per character */
      g += `<text x="${lw - 8}" y="${y + 11}" text-anchor="end">${esc(sh)}${sh !== lab ? `<title>${esc(lab)}</title>` : ''}</text>`;
      vis.forEach((q, j) => {
        const w = (q.v[i] / mx) * pw,
          wd = j === 0 ? w : Math.max(w - 2, 0.5),
          xx = j === 0 ? x : x + 2;
        g +=
          j === vis.length - 1
            ? `<path class="${q.c}" d="${rightR(xx, y, wd, 14, 4)}"/>`
            : `<rect class="${q.c}" x="${xx}" y="${y}" width="${wd}" height="14"/>`;
        x += w;
      });
      g += `<text class="val" x="${x + 6}" y="${y + 11}">${fmt(tot[i])}</text><rect class="hit" data-i="${i}" x="0" y="${T + i * rh}" width="${W}" height="${rh}"/>`;
    });
    svg(el, W, h, g, label, tipFn);
  }

  return { f, sw, svg, table, tipRows, vbars, hbars };
}
