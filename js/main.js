/* Entry point: starts each part of the page. Order matters: content is drawn before the
   router and the scroll reveal, because they look at what's on the page. */

import { initActivities } from './activities.js';
import { initCursor, initGreeting, initReveal } from './effects.js';
import { initHomeChat } from './home-chat.js';
import { initOpener } from './opener.js';
import { initModal } from './modal.js';
import { initMenu, initNavSpy } from './nav.js';
import { renderProjectGrid } from './project-cards.js';
import { initRouter } from './router.js';
import { initTheme } from './theme.js';

initTheme();
initOpener();
initMenu();
renderProjectGrid();
initActivities();
initHomeChat();
initModal();
initRouter();
initNavSpy();
initReveal();
initGreeting();
initCursor();
