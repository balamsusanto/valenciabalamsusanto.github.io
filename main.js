/* Entry point: starts each part of the page. Order matters: content is drawn before the
   router and the scroll reveal, because they look at what's on the page. */

import { initActivities } from './activities.js';
import { initCursor, initGreeting, initReveal } from './effects.js';
import { initModal } from './modal.js';
import { initMenu, initNavSpy } from './nav.js';
import { renderProjectGrid } from './project-cards.js';
import { initRouter } from './router.js';
import { initTheme } from './theme.js';

initTheme();
initMenu();
renderProjectGrid();
initActivities();
initModal();
initRouter();
initNavSpy();
initReveal();
initGreeting();
initCursor();
