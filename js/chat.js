/* "Ask My AI" chat. It needs the Python server in RAG_LLM/server.py, which GitHub Pages can't run.
   The live site talks to the hosted copy of that server at CHAT_SERVER. While CHAT_SERVER is empty,
   the chat box only appears when the site is opened on this computer.
   The same chat appears on the home page and on the chatbot's project page; both share one
   conversation and one 5-question limit per browser. */

import { esc } from './shared.js';

const CHAT_SERVER = 'https://ask-valencia-9858443497.asia-east1.run.app';

const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
const chatUrl = isLocal ? '/api/chat' : `${CHAT_SERVER}/api/chat`;

export const chatAvailable = isLocal || CHAT_SERVER !== '';

/* each visitor gets 5 questions, remembered in this browser (the server itself only has a
   rate limit, so clearing site data resets this count) */
export const LIMIT = 5;
const KEY = 'askValenciaAsked';
let memCount = 0;
function asked() {
  try {
    return Math.max(memCount, parseInt(localStorage.getItem(KEY), 10) || 0);
  } catch {
    return memCount;
  }
}
function countOne() {
  memCount = asked() + 1;
  try {
    localStorage.setItem(KEY, String(memCount));
  } catch {
    /* storage blocked: the limit still holds until the page reloads */
  }
}
const left = () => Math.max(0, LIMIT - asked());
const leftText = () => {
  const n = left();
  return n ? `${n} of ${LIMIT} questions left.` : 'No questions left.';
};
const LIMIT_REPLY = `<p>That's your ${LIMIT} questions used up. To find out more, please
  <a href="mailto:valenciabalamm@gmail.com">email Valencia</a> or
  <a href="https://www.linkedin.com/in/valenciabalamm/" target="_blank" rel="noopener">message her on LinkedIn</a>.
  She'd be happy to hear from you!</p>`;

const CHIPS = [
  'Tell me more about Valencia.',
  'Which programming languages does she know?',
  "Write me a summary of Valencia's experience and skills.",
  'What does her manager say about her?',
];

/* id keeps the label and heading links unique when both chats exist on the page */
export function chatHTML({ id = 'chat', heading = 'Try it yourself', compact = false } = {}) {
  return `<section class="chat${compact ? ' chat-compact' : ''}" aria-labelledby="${id}-h">
      <h2 id="${id}-h">${heading}</h2>
      <p class="chat-intro">Ask anything about my education, work experience, skills or projects. It only knows what is in my documents, so it will tell you when it is not sure. P.s. Please allow 5-10 seconds for my chatbot to answer you.</p>
      <div class="chat-log" aria-live="polite"></div>
      <div class="chat-chips">${CHIPS.map((q) => `<button type="button" class="pill chip">${q}</button>`).join('')}</div>
      <form class="chat-form">
        <label for="${id}-q" class="sr">Your question</label>
        <input id="${id}-q" maxlength="500" autocomplete="off" placeholder="Ask about Valencia…">
        <button class="btn" type="submit">Ask</button>
      </form>
      <p class="chat-note mono"><span class="chat-left"></span> AI answers can still be wrong. Please confirm anything important with me directly.</p>
    </section>`;
}
function md(s) {
  /* tiny, safe markdown: escape first, then bold + bullet lists + paragraphs */
  const lines = esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .split('\n');
  let out = '',
    inList = false;
  for (const l of lines) {
    const m = l.match(/^\s*[-*•]\s+(.*)/);
    if (m) {
      if (!inList) {
        out += '<ul>';
        inList = true;
      }
      out += `<li>${m[1]}</li>`;
    } else {
      if (inList) {
        out += '</ul>';
        inList = false;
      }
      if (l.trim()) out += `<p>${l}</p>`;
    }
  }
  return out + (inList ? '</ul>' : '');
}
const chatHistory = [];
/* root: the .chat section. onState(state, text) reports 'processing', 'talking' or 'error' */
export function mountChat(root, { onState = () => {} } = {}) {
  const log = root.querySelector('.chat-log'),
    form = root.querySelector('.chat-form'),
    input = form.querySelector('input'),
    btn = form.querySelector('button'),
    leftEl = root.querySelector('.chat-left');
  const showLeft = () => {
    leftEl.textContent = leftText();
  };
  showLeft();
  const add = (cls, html) => {
    const d = document.createElement('div');
    d.className = 'msg ' + cls;
    d.innerHTML = html;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  };
  let shown = -1;
  function replay() {
    if (shown === chatHistory.length) return;
    shown = chatHistory.length;
    log.innerHTML = '';
    add('bot', "<p>Hi! I can answer questions about Valencia's background and projects.</p>");
    chatHistory.forEach((h) =>
      add(
        h.role === 'user' ? 'me' : 'bot',
        h.role === 'user' ? `<p>${esc(h.content)}</p>` : md(h.content),
      ),
    );
  }
  replay();
  /* the home chat stays on the page while a project page is open, so catch up on its return */
  addEventListener('hashchange', () => {
    if (!root.isConnected || btn.disabled) return;
    replay();
    showLeft();
  });
  async function ask(q) {
    q = q.trim();
    if (!q || btn.disabled) return;
    add('me', `<p>${esc(q)}</p>`);
    input.value = '';
    if (!left()) {
      add('bot', LIMIT_REPLY);
      onState('talking', LIMIT_REPLY);
      return;
    }
    btn.disabled = true;
    onState('processing');
    const wait = add('bot wait', "<p>Looking through Valencia's documents…</p>");
    /* the hosted server sleeps when unused, so the first question can take a while.
       Normal answers take 6-18 seconds, so this only shows when it's slower than that */
    const wakingUp = setTimeout(() => {
      wait.innerHTML = '<p>Waking up the chatbot. The first question can take up to a minute…</p>';
    }, 20000);
    try {
      const r = await fetch(chatUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, history: chatHistory.slice(-6) }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || 'The chatbot is unavailable right now.');
      wait.classList.remove('wait');
      wait.innerHTML =
        md(d.answer) +
        (d.sources && d.sources.length
          ? `<p class="src mono">Sources: ${d.sources.map((s) => esc(s.label)).join(' · ')}</p>`
          : '');
      chatHistory.push({ role: 'user', content: q }, { role: 'assistant', content: d.answer });
      shown = chatHistory.length;
      countOne(); /* only answered questions use up the limit */
      showLeft();
      onState('talking', d.answer);
    } catch (e) {
      wait.classList.remove('wait');
      wait.classList.add('err');
      wait.innerHTML = `<p>${esc(e instanceof TypeError ? "The chatbot server is offline right now, so I can't answer. Please try again later." : e.message)}</p>`;
      onState('error');
    } finally {
      clearTimeout(wakingUp);
      btn.disabled = false;
      input.focus({ preventScroll: true });
    }
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    ask(input.value);
  });
  root.querySelector('.chat-chips').addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (b) ask(b.textContent);
  });
}
