/* "Ask My AI" chat. It needs the Python server in RAG_LLM/server.py, which GitHub Pages can't run.
   The live site talks to the hosted copy of that server at CHAT_SERVER. While CHAT_SERVER is empty,
   the chat box only appears when the site is opened on this computer. */

import { esc } from './shared.js';

const CHAT_SERVER = 'https://ask-valencia-9858443497.asia-east1.run.app';

const isLocal = ['localhost', '127.0.0.1'].includes(location.hostname);
const chatUrl = isLocal ? '/api/chat' : `${CHAT_SERVER}/api/chat`;

export const chatAvailable = isLocal || CHAT_SERVER !== '';

export const chatHTML = `<section class="chat" aria-labelledby="chat-h">
      <h2 id="chat-h">Try it yourself</h2>
      <p>Ask anything about my education, work experience, skills or projects. It only knows what is in my documents, so it will tell you when it is not sure.</p>
      <div class="chat-log" id="chat-log" aria-live="polite"></div>
      <div class="chat-chips" id="chat-chips">${[
        'What did Valencia do at MTR?',
        'Which programming languages does she know?',
        'Did her LSTM beat the random walk?',
        'What does her manager say about her?',
      ]
        .map((q) => `<button type="button" class="pill chip">${q}</button>`)
        .join('')}</div>
      <form class="chat-form" id="chat-form">
        <label for="chat-q" class="sr">Your question</label>
        <input id="chat-q" maxlength="500" autocomplete="off" placeholder="Ask about Valencia…">
        <button class="btn" type="submit">Ask</button>
      </form>
      <p class="chat-note mono">AI answers can still be wrong. Please confirm anything important with me directly.</p>
    </section>`;
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
export function mountChat() {
  const log = document.getElementById('chat-log'),
    form = document.getElementById('chat-form'),
    input = document.getElementById('chat-q'),
    btn = form.querySelector('button');
  const add = (cls, html) => {
    const d = document.createElement('div');
    d.className = 'msg ' + cls;
    d.innerHTML = html;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  };
  add('bot', "<p>Hi! I can answer questions about Valencia's background and projects.</p>");
  chatHistory.forEach((h) =>
    add(
      h.role === 'user' ? 'me' : 'bot',
      h.role === 'user' ? `<p>${esc(h.content)}</p>` : md(h.content),
    ),
  );
  async function ask(q) {
    q = q.trim();
    if (!q || btn.disabled) return;
    add('me', `<p>${esc(q)}</p>`);
    input.value = '';
    btn.disabled = true;
    const wait = add('bot wait', "<p>Looking through Valencia's documents…</p>");
    /* the hosted server sleeps when unused, so the first question can take a while */
    const wakingUp = setTimeout(() => {
      wait.innerHTML = '<p>Waking up the chatbot. The first question can take up to a minute…</p>';
    }, 6000);
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
    } catch (e) {
      wait.classList.remove('wait');
      wait.classList.add('err');
      wait.innerHTML = `<p>${esc(e instanceof TypeError ? "The chatbot server is offline right now, so I can't answer. Please try again later." : e.message)}</p>`;
    } finally {
      clearTimeout(wakingUp);
      btn.disabled = false;
      input.focus();
    }
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    ask(input.value);
  });
  document.getElementById('chat-chips').addEventListener('click', (e) => {
    const b = e.target.closest('.chip');
    if (b) ask(b.textContent);
  });
}
