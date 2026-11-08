import { chartKit, watchWidth } from './charts.js';
import { esc } from './shared.js';
import { AMZ } from './data/amazon-dashboard.js';

export const amzDashHTML = `<section class="dash" id="dash" aria-labelledby="dash-h">
      <div class="dash-head"><h2 id="dash-h">Explore the market</h2>
        <div class="dash-ctl"><label>Category <select id="amz-cat"></select></label></div></div>
      <div class="stats" id="dash-kpis"></div>
      <div class="dash-grid">
        <figure class="panel"><h3>Minimum revenue by price</h3><p class="cap">Price × the "bought in past month" minimum.</p><div class="plot" id="pl-rev"></div></figure>
        <figure class="panel"><h3>Minimum units by price</h3><p class="cap">Sum of the "bought in past month" minimums.</p><div class="plot" id="pl-units"></div></figure>
        <figure class="panel"><h3>Ratings and strong sellers</h3><p class="cap">Share of products with 1,000+ bought in the past month.</p><div class="plot" id="pl-rate"></div></figure>
        <figure class="panel"><h3>Top brands</h3><p class="cap">Minimum revenue, taken from the first word of each title.</p><div class="plot" id="pl-brand"></div></figure>
        <figure class="panel"><h3>Discounts and demand</h3><p class="cap">All categories. Demand against no discount, at the same selling price and in the same category.</p><div class="plot" id="pl-disc"></div></figure>
        <figure class="panel"><h3>Products sold together</h3><p class="cap">All categories. Lift: how many times more often than by chance.</p><div class="plot" id="pl-rule"></div></figure>
        <figure class="panel wide"><h3>Movement over the 10 days</h3><p class="cap">All categories. Products seen on at least two days.</p>
          <div class="dash-legend"><span><i style="background:var(--c-t)"></i>Up</span><span><i style="background:var(--c-n)"></i>No change</span><span><i style="background:var(--c-m)"></i>Down</span></div><div class="plot" id="pl-track"></div></figure>
      </div>
      <p class="dash-note mono">Data: Amazon electronics listings collected 21–30 August 2025 (8,149 products after cleaning). Revenue, units, ratings and brands use products with both a price and a demand label, or a rating and a demand label. All figures are minimums estimated from rounded labels, not actual sales. Listings show what sellers package together, not what shoppers buy together.</p>
      <div class="dash-tip" id="dash-tip" hidden></div>
    </section>`;

export function mountAmzDash() {
  const D = AMZ,
    box = document.getElementById('dash'),
    tip = document.getElementById('dash-tip'),
    sel = document.getElementById('amz-cat');
  const { f, table, tipRows, hbars } = chartKit(box, tip);
  const usd = (v) =>
    v >= 1e6
      ? '$' + (v / 1e6).toFixed(v >= 1e8 ? 0 : 1) + 'M'
      : v >= 1e3
        ? '$' + (v / 1e3).toFixed(0) + 'K'
        : '$' + f(Math.round(v));
  const num = (v) =>
    v >= 1e6
      ? (v / 1e6).toFixed(1) + 'M'
      : v >= 1e3
        ? (v / 1e3).toFixed(v >= 1e5 ? 0 : 1) + 'K'
        : f(v);
  const pc = (x) => (x * 100).toFixed(0) + '%',
    el = (id) => document.getElementById(id);
  const RULE = {
    'Keyboard|Mouse': 'Keyboard + mouse',
    'Light|Stand or mount': 'Light + stand',
    'Desktop|Mouse': 'Desktop + mouse',
    'Camera|Film or photo paper': 'Camera + film',
  };
  sel.innerHTML =
    '<option value="">All categories</option>' +
    Object.keys(D.cats)
      .map((c) => `<option>${esc(c)}</option>`)
      .join('');
  const statics = () => {
    const d = D.disc,
      ru = D.rules,
      rl = ru.map((r) => RULE[r.a + '|' + r.b] || r.a + ' + ' + r.b);
    hbars(
      el('pl-disc'),
      d.map((x) => x.l + ' off'),
      [{ c: 'm', v: d.map((x) => x.pct) }],
      {
        label: 'Demand against no discount',
        fmt: (v) => '+' + v + '%',
        tipFn: (i) =>
          tipRows(d[i].l + ' off', [
            ['m', 'Against no discount', `+${d[i].pct}%`],
            [null, '95% range', `${d[i].lo}% to +${d[i].hi}%`],
            [null, 'Products', f(d[i].n)],
          ]),
      },
    );
    table(
      el('pl-disc'),
      ['Discount', 'Demand', '95% range', 'Products'],
      [
        ['None', 'baseline', '–', D.discNone],
        ...d.map((x) => [x.l, '+' + x.pct + '%', `${x.lo}% to +${x.hi}%`, x.n]),
      ],
    );
    hbars(el('pl-rule'), rl, [{ c: 't', v: ru.map((r) => r.lift) }], {
      label: 'Lift of product pairs',
      fmt: (v) => v.toFixed(1) + '×',
      tipFn: (i) =>
        tipRows(rl[i], [
          ['t', 'Lift', ru[i].lift + '×'],
          [null, 'Listings', f(ru[i].n)],
          [null, `Of ${ru[i].a} listings`, ru[i].ca + '% include ' + ru[i].b],
          [null, `Of ${ru[i].b} listings`, ru[i].cb + '% include ' + ru[i].a],
        ]),
    });
    table(
      el('pl-rule'),
      ['Pair', 'Lift', 'Listings'],
      rl.map((l, i) => [l, ru[i].lift + '×', ru[i].n]),
    );
    const T = D.track,
      tl = ['Price', 'Demand label'],
      tv = [T.price, T.demand],
      sn = ['Up', 'No change', 'Down'],
      sc = ['t', 'n', 'm'];
    hbars(
      el('pl-track'),
      tl,
      sc.map((c, j) => ({ c, v: tv.map((a) => a[j]) })),
      {
        label: 'Products that moved over 10 days',
        tipFn: (i) =>
          tipRows(
            tl[i],
            sn.map((n, j) => [sc[j], n, f(tv[i][j])]),
          ),
      },
    );
    table(
      el('pl-track'),
      ['Measure', ...sn],
      tl.map((l, i) => [l, ...tv[i]]),
    );
  };
  function render() {
    const c = sel.value,
      d = c ? D.cats[c] : D.all,
      B = D.bands;
    el('dash-kpis').innerHTML = [
      [f(d.n), c ? 'products in this category' : 'products after cleaning'],
      [
        d.medPrice == null
          ? '–'
          : '$' + d.medPrice.toLocaleString('en-GB', { minimumFractionDigits: 2 }),
        'median price',
      ],
      [num(d.units), 'minimum units bought in the past month'],
      [usd(d.rev), 'minimum revenue over the past month'],
    ]
      .map(([n, l]) => `<div class="stat"><b>${n}</b><span>${l}</span></div>`)
      .join('');
    hbars(el('pl-rev'), B, [{ c: 'm', v: d.bRev }], {
      label: 'Minimum revenue by price band',
      fmt: usd,
      tipFn: (i) =>
        tipRows(B[i], [
          ['m', 'Minimum revenue', usd(d.bRev[i])],
          [null, 'Share', d.rev ? pc(d.bRev[i] / d.rev) : '–'],
          [null, 'Products', f(d.bN[i])],
        ]),
    });
    table(
      el('pl-rev'),
      ['Price', 'Revenue', 'Share', 'Products'],
      B.map((b, i) => [b, usd(d.bRev[i]), d.rev ? pc(d.bRev[i] / d.rev) : '–', d.bN[i]]),
    );
    hbars(el('pl-units'), B, [{ c: 't', v: d.bUnits }], {
      label: 'Minimum units by price band',
      fmt: num,
      tipFn: (i) =>
        tipRows(B[i], [
          ['t', 'Minimum units', f(d.bUnits[i])],
          [null, 'Share', d.units ? pc(d.bUnits[i] / d.units) : '–'],
          [null, 'Products', f(d.bN[i])],
        ]),
    });
    table(
      el('pl-units'),
      ['Price', 'Units', 'Share', 'Products'],
      B.map((b, i) => [b, d.bUnits[i], d.units ? pc(d.bUnits[i] / d.units) : '–', d.bN[i]]),
    );
    const sh = d.rN.map((n, i) => (n ? d.rK[i] / n : 0));
    hbars(el('pl-rate'), D.ratings, [{ c: 'm', v: sh }], {
      label: 'Share of products with 1,000+ bought, by rating',
      fmt: pc,
      tipFn: (i) =>
        tipRows(D.ratings[i] + ' stars', [
          ['m', 'With 1,000+ bought', d.rN[i] ? pc(sh[i]) : '–'],
          [null, 'Products', f(d.rN[i])],
        ]),
    });
    table(
      el('pl-rate'),
      ['Rating', '1,000+ bought', 'Products'],
      D.ratings.map((r, i) => [r, d.rN[i] ? pc(sh[i]) : '–', d.rN[i]]),
    );
    const br = d.brands;
    hbars(
      el('pl-brand'),
      br.map((x) => x[0]),
      [{ c: 't', v: br.map((x) => x[1]) }],
      {
        label: 'Top brands by minimum revenue',
        fmt: usd,
        tipFn: (i) =>
          tipRows(esc(br[i][0]), [
            ['t', 'Minimum revenue', usd(br[i][1])],
            [null, 'Share', d.rev ? pc(br[i][1] / d.rev) : '–'],
          ]),
      },
    );
    table(
      el('pl-brand'),
      ['Brand', 'Revenue', 'Share'],
      br.map((x) => [esc(x[0]), usd(x[1]), d.rev ? pc(x[1] / d.rev) : '–']),
    );
  }
  sel.onchange = render;
  render();
  statics();
  watchWidth(box, () => {
    render();
    statics();
  });
}
