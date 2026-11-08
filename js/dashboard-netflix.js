import { chartKit, watchWidth } from './charts.js';
import { esc } from './shared.js';
import { NFX } from './data/netflix-dashboard.js';

export const dashHTML = `<section class="dash" id="dash" aria-labelledby="dash-h">
      <div class="dash-head"><h2 id="dash-h">Explore the catalogue</h2>
        <div class="dash-ctl">
          <div class="seg" role="group" aria-label="Type of title">
            <button type="button" data-t="all" aria-pressed="true">All</button><button type="button" data-t="m" aria-pressed="false">Films</button><button type="button" data-t="t" aria-pressed="false">TV series</button></div>
          <label>Added from <select id="dy0"></select></label><label>to <select id="dy1"></select></label>
        </div></div>
      <div class="stats" id="dash-kpis"></div>
      <div class="dash-legend" id="dash-legend"></div>
      <div class="dash-grid">
        <figure class="panel wide"><h3>Titles added each month</h3><p class="cap">2021 runs to 25 September, the date of the snapshot.</p><div class="plot" id="pl-month"></div></figure>
        <figure class="panel wide"><h3>How new were the titles Netflix added?</h3><p class="cap">Share added in the year they came out or the year after.</p><div class="plot" id="pl-age"></div></figure>
        <figure class="panel"><h3>Top genres</h3><p class="cap">Titles with each genre tag. A title can have up to 3 tags.</p><div class="plot" id="pl-genre"></div></figure>
        <figure class="panel"><h3>Age ratings</h3><p class="cap">From adult (top) to young children, US ratings.</p><div class="plot" id="pl-rating"></div></figure>
        <figure class="panel" id="pn-min"><h3>Film length</h3><p class="cap">Films by running time, 10-minute bands.</p><div class="plot" id="pl-min"></div></figure>
        <figure class="panel" id="pn-sea"><h3>TV series length</h3><p class="cap">Series by number of seasons.</p><div class="plot" id="pl-sea"></div></figure>
      </div>
      <p class="dash-note mono">Data: Netflix titles available in September 2021 (8,804 after cleaning). Shown: the 8,656 added from 2016 to 25 September 2021. Left out: 138 titles added before 2016 and 10 with no date added. Titles removed before 2021 are not in the data.</p>
      <div class="dash-tip" id="dash-tip" hidden></div>
    </section>`;

export function mountDash() {
  const D = NFX,
    box = document.getElementById('dash'),
    tip = document.getElementById('dash-tip');
  const NAME = { m: 'Films', t: 'TV series' },
    MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const st = { t: 'all', y0: 2016, y1: D.range[1] };
  const pc = (x) => (x * 100).toFixed(0) + '%';
  const types = () => (st.t === 'all' ? ['m', 't'] : [st.t]);
  const inR = (y) => +y >= st.y0 && +y <= st.y1;
  const sumY = (map, n) => {
    const a = Array(n).fill(0);
    for (const y in map || {}) if (y !== 'keys' && inR(y)) map[y].forEach((v, i) => (a[i] += v));
    return a;
  };
  const yrs = [];
  for (let y = D.range[0]; y <= D.range[1]; y++) yrs.push(y);
  const s0 = document.getElementById('dy0'),
    s1 = document.getElementById('dy1');
  s0.innerHTML = s1.innerHTML = yrs.map((y) => `<option>${y}</option>`).join('');
  s0.value = st.y0;
  s1.value = st.y1;

  const { f, sw, svg, table, tipRows, vbars, hbars } = chartKit(box, tip);

  /* lines over years: ser = [{c, v:[share or null]}] */
  function lines(el, xs, ser, { label, tipFn }) {
    const W = Math.max(el.clientWidth, 260),
      L = 40,
      R = 74,
      T = 12,
      B = 24,
      h = 210,
      pw = W - L - R,
      ph = h - T - B,
      n = xs.length;
    const X = (i) => L + (n < 2 ? pw / 2 : (i * pw) / (n - 1)),
      Y = (v) => T + ph - v * ph;
    let g = '';
    for (let k = 0; k <= 4; k++) {
      const v = k / 4;
      g += `<line class="grid" x1="${L}" x2="${W - R}" y1="${Y(v)}" y2="${Y(v)}"/><text x="${L - 6}" y="${Y(v) + 4}" text-anchor="end">${k * 25}%</text>`;
    }
    xs.forEach((x, i) => {
      g += `<text x="${X(i)}" y="${h - 6}" text-anchor="middle">${x}</text>`;
    });
    ser.forEach((q) => {
      const pts = q.v.map((v, i) => (v == null ? null : [X(i), Y(v)]));
      let d = '',
        on = false;
      pts.forEach((p) => {
        if (!p) {
          on = false;
          return;
        }
        d += (on ? 'L' : 'M') + p[0] + ',' + p[1];
        on = true;
      });
      g += `<path class="ln ln-${q.c}" d="${d}"/>`;
      pts.forEach((p) => {
        if (p) g += `<circle class="dot ${q.c}" cx="${p[0]}" cy="${p[1]}" r="4.5"/>`;
      });
      const li = pts
        .map((p, i) => (p ? i : -1))
        .filter((i) => i >= 0)
        .pop();
      if (li != null) q.end = [pts[li][0], pts[li][1]];
    });
    const ends = ser
      .filter((q) => q.end)
      .sort((a, b) => a.end[1] - b.end[1]); /* direct labels, nudged apart */
    ends.forEach((q, k) => {
      let y = q.end[1] + 4;
      if (k && y - ends[k - 1].ly < 14) y = ends[k - 1].ly + 14;
      q.ly = y;
      g += `<text class="val" x="${q.end[0] + 10}" y="${y}">${NAME[q.c]}</text>`;
    });
    xs.forEach((_, i) => {
      const w = n < 2 ? pw : pw / (n - 1);
      g += `<rect class="hit" data-i="${i}" x="${X(i) - w / 2}" y="${T}" width="${w}" height="${ph}"/>`;
    });
    svg(el, W, h, g, label, tipFn);
  }

  function render() {
    const ty = types(),
      panel = (id) => document.getElementById(id);
    document
      .querySelectorAll('.seg button')
      .forEach((b) => b.setAttribute('aria-pressed', b.dataset.t === st.t));
    document.getElementById('dash-legend').innerHTML =
      ty.length > 1 ? ty.map((c) => `<span>${sw(c)}${NAME[c]}</span>`).join('') : '';
    const vs = ty.map((c) => (c === 'm' ? 'm' : 't'));
    /* months */
    const ms = [];
    for (let y = st.y0; y <= st.y1; y++)
      for (let m = 1; m <= 12; m++) {
        const k = `${y}-${String(m).padStart(2, '0')}`;
        if (k <= D.lastMonth) ms.push(k);
      }
    const mser = vs.map((c) => ({ c, v: ms.map((k) => D.months[c][k] || 0) })),
      mtot = ms.map((_, i) => mser.reduce((s, q) => s + q.v[i], 0));
    const total = mtot.reduce((a, b) => a + b, 0),
      bi = mtot.indexOf(Math.max(...mtot));
    const mlab = (k) => MON[+k.slice(5) - 1] + ' ' + k.slice(0, 4);
    /* age, ratings */
    const age = vs.map((c) => sumY(D.age[c], D.age.keys.length)),
      ageAll = age[0].map((_, i) => age.reduce((s, a) => s + a[i], 0));
    const ageN = ageAll.reduce((a, b) => a + b, 0),
      fresh = ageN ? (ageAll[0] + ageAll[1]) / ageN : 0;
    const rat = vs.map((c) => sumY(D.ratings[c], D.ratings.keys.length)),
      ratAll = rat[0].map((_, i) => rat.reduce((s, a) => s + a[i], 0));
    const ratN = ratAll.reduce((a, b) => a + b, 0),
      adult = ratN ? (ratAll[0] + ratAll[1] + ratAll[2]) / ratN : 0;
    document.getElementById('dash-kpis').innerHTML = [
      [
        f(total),
        `${ty.length > 1 ? 'titles' : { m: 'films', t: 'TV series' }[st.t]} added, ${st.y0 === st.y1 ? st.y0 : st.y0 + '–' + st.y1}`,
      ],
      [
        total ? f(mtot[bi]) : '–',
        total ? `added in ${mlab(ms[bi])}, the busiest month` : 'no titles in this range',
      ],
      [ageN ? pc(fresh) : '–', 'added within a year of coming out'],
      [ratN ? pc(adult) : '–', 'rated for adults (TV-MA, R or NC-17)'],
    ]
      .map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`)
      .join('');

    const many = ms.length > 36;
    vbars(panel('pl-month'), ms, mser, {
      h: 210,
      label: 'Titles added each month',
      xlab: (i) => {
        const k = ms[i],
          m = +k.slice(5);
        return many
          ? m === 1 || i === 0
            ? { t: k.slice(0, 4), a: 'start' }
            : null
          : m % 3 === 1
            ? { t: MON[m - 1] + (m === 1 || i === 0 ? ' ' + k.slice(2, 4) : '') }
            : null;
      },
      tipFn: (i) =>
        tipRows(mlab(ms[i]), [
          ...mser.map((q) => [q.c, NAME[q.c], f(q.v[i])]),
          ...(mser.length > 1 ? [[null, 'Total', f(mtot[i])]] : []),
        ]),
    });
    table(
      panel('pl-month'),
      ['Month', ...vs.map((c) => NAME[c]), ...(vs.length > 1 ? ['Total'] : [])],
      ms.map((k, i) => [mlab(k), ...mser.map((q) => q.v[i]), ...(vs.length > 1 ? [mtot[i]] : [])]),
    );

    const ys = yrs.filter(inR),
      aser = vs.map((c) => ({
        c,
        n: ys.map((y) => {
          const a = D.age[c][y];
          return a ? a.reduce((s, v) => s + v, 0) : 0;
        }),
        v: ys.map((y) => {
          const a = D.age[c][y];
          if (!a) return null;
          const n = a.reduce((s, v) => s + v, 0);
          return n >= 50 ? (a[0] + a[1]) / n : null;
        }),
      }));
    lines(panel('pl-age'), ys, aser, {
      label: 'Share of titles added within a year of release, by year added',
      tipFn: (i) =>
        tipRows(
          `Added in ${ys[i]}`,
          aser.map((q) => [
            q.c,
            NAME[q.c],
            q.v[i] == null ? `too few (${q.n[i]})` : `${pc(q.v[i])} of ${f(q.n[i])}`,
          ]),
        ),
    });
    table(
      panel('pl-age'),
      ['Year added', ...vs.map((c) => NAME[c])],
      ys.map((y, i) => [y, ...aser.map((q) => (q.v[i] == null ? '–' : pc(q.v[i])))]),
    );

    const gl = [];
    vs.forEach((c) => {
      const v = sumY(D.genres[c], D.genres[c].keys.length);
      D.genres[c].keys.forEach((k, i) => gl.push({ k, c, v: v[i] }));
    });
    gl.sort((a, b) => b.v - a.v);
    const top = gl.slice(0, 8);
    hbars(
      panel('pl-genre'),
      top.map((g) => g.k),
      vs.map((c) => ({ c, v: top.map((g) => (g.c === c ? g.v : 0)) })),
      {
        label: 'Top genres',
        tipFn: (i) => tipRows(esc(top[i].k), [[top[i].c, NAME[top[i].c], f(top[i].v)]]),
      },
    );
    table(
      panel('pl-genre'),
      ['Genre', 'Type', 'Titles'],
      gl.filter((g) => g.v).map((g) => [esc(g.k), NAME[g.c], g.v]),
    );

    const rk = D.ratings.keys.map((k, i) => i).filter((i) => ratAll[i] > 0);
    hbars(
      panel('pl-rating'),
      rk.map((i) => D.ratings.keys[i]),
      vs.map((c, j) => ({ c, v: rk.map((i) => rat[j][i]) })),
      {
        label: 'Age ratings',
        tipFn: (i) =>
          tipRows(D.ratings.keys[rk[i]], [
            ...vs.map((c, j) => [c, NAME[c], f(rat[j][rk[i]])]),
            [null, 'Share', pc(ratAll[rk[i]] / ratN)],
          ]),
      },
    );
    table(
      panel('pl-rating'),
      ['Rating', ...vs.map((c) => NAME[c])],
      rk.map((i) => [D.ratings.keys[i], ...rat.map((r) => r[i])]),
    );

    panel('pn-min').hidden = st.t === 't';
    panel('pn-sea').hidden = st.t === 'm';
    if (st.t !== 't') {
      const v = sumY(D.minutes.m, D.minutes.keys.length),
        lab = (i) => {
          const k = D.minutes.keys[i];
          return k >= 190 ? '190+ min' : `${k}–${k + 9} min`;
        };
      vbars(panel('pl-min'), D.minutes.keys, [{ c: 'm', v }], {
        h: 180,
        label: 'Films by running time',
        xlab: (i) => (D.minutes.keys[i] % 30 === 0 ? { t: D.minutes.keys[i] } : null),
        tipFn: (i) => tipRows(lab(i), [['m', 'Films', f(v[i])]]),
      });
      table(
        panel('pl-min'),
        ['Running time', 'Films'],
        v.map((n, i) => [lab(i), n]),
      );
    }
    if (st.t !== 'm') {
      const v = sumY(D.seasons.t, D.seasons.keys.length),
        lab = (i) => {
          const k = D.seasons.keys[i];
          return k === 6 ? '6 or more seasons' : k === 1 ? '1 season' : k + ' seasons';
        };
      vbars(panel('pl-sea'), D.seasons.keys, [{ c: 't', v }], {
        h: 180,
        label: 'TV series by number of seasons',
        xlab: (i) => ({ t: D.seasons.keys[i] === 6 ? '6+' : D.seasons.keys[i] }),
        tipFn: (i) => tipRows(lab(i), [['t', 'TV series', f(v[i])]]),
      });
      table(
        panel('pl-sea'),
        ['Seasons', 'TV series'],
        v.map((n, i) => [lab(i), n]),
      );
    }
  }
  box.querySelector('.seg').onclick = (e) => {
    const b = e.target.closest('button');
    if (b) {
      st.t = b.dataset.t;
      render();
    }
  };
  s0.onchange = () => {
    st.y0 = +s0.value;
    if (st.y0 > st.y1) {
      st.y1 = st.y0;
      s1.value = st.y1;
    }
    render();
  };
  s1.onchange = () => {
    st.y1 = +s1.value;
    if (st.y1 < st.y0) {
      st.y0 = st.y1;
      s0.value = st.y0;
    }
    render();
  };
  render();
  watchWidth(box, render);
}
