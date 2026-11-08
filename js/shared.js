/* Small helpers used by more than one module. */

export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

export const esc = (s) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
