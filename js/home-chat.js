/* The robot mascot next to the chat window, used on the home page ("Get to know me") and on the
   chatbot's project page. Before anyone asks: idle. Waiting for an answer: processing. Answer
   shown: talking. Server unreachable or failing: error. After a chat, it rests by cycling idle,
   happy and love for 5 minutes, then falls asleep until the visitor comes back to the chat. */

import { CartoonBot } from './cartoon-bot.js';
import { chatAvailable, chatHTML, mountChat } from './chat.js';

const MOOD_EVERY = 4000; /* ms between idle, happy and love while resting */
const AWAKE_FOR = 5 * 60 * 1000;
const REACT_FOR = 2500; /* ms a click reaction plays before the robot goes back to what it was doing */
const REACTIONS = ['laugh', 'scared'];

/* clicking (or Enter / Space on) the robot makes it laugh or get scared, picked at random.
   afterSleep runs instead of going back to sleep, so a click also wakes it up */
function addReactions(bot, canvas, afterSleep) {
  let before = null,
    timer;
  function react() {
    clearTimeout(timer);
    if (!REACTIONS.includes(bot.state)) before = bot.state;
    bot.setState(REACTIONS[Math.floor(Math.random() * REACTIONS.length)]);
    timer = setTimeout(() => {
      /* the chat may have moved it on meanwhile (an answer arrived); then leave it be */
      if (!REACTIONS.includes(bot.state)) return;
      if (before === 'sleepy' && afterSleep) afterSleep();
      else bot.setState(before);
    }, REACT_FOR);
  }
  canvas.addEventListener('click', react);
  canvas.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      react();
    }
  });
  return () => clearTimeout(timer);
}

/* inner HTML of a .bot-grid. projectLink adds "See the project" under the chat (home page only) */
export function botGridHTML({ id, heading, projectLink = false }) {
  return `<div class="mascot-wrap">
      <canvas class="mascot" width="672" height="672" role="button" tabindex="0"
        aria-label="Animated robot mascot that reacts to the chat. Click it to make it laugh or jump"></canvas>
    </div>
    <div class="bot-chat">${chatAvailable ? chatHTML({ id, heading, compact: true }) : '<p class="chat-off">The chatbot is offline right now.</p>'}</div>
    <a class="more bot-link mlink" href="#project-automation-others">See how a simple LLM prompt made me →</a>
    ${projectLink ? '<a class="more bot-link clink" href="#project-ask-valencia">See the project →</a>' : ''}`;
}

/* grid: a .bot-grid filled with botGridHTML */
export function mountBotChat(grid) {
  const canvas = grid.querySelector('.mascot');
  const bot = CartoonBot.mount(canvas, 'idle');
  const chat = grid.querySelector('.chat');
  if (!chat) {
    bot.setState('sleepy');
    const stopReacting = addReactions(bot, canvas, null);
    bot.dispose = () => {
      stopReacting();
      bot.stop();
    };
    return bot;
  }
  let used = false,
    moodTimer,
    sleepTimer,
    stateTimer;
  const clear = () => {
    clearInterval(moodTimer);
    clearTimeout(sleepTimer);
    clearTimeout(stateTimer);
  };
  function rest() {
    clear();
    bot.setState('idle');
    if (!used) return;
    const moods = ['idle', 'happy', 'love'];
    let i = 0;
    moodTimer = setInterval(() => {
      i = (i + 1) % moods.length;
      bot.setState(moods[i]);
    }, MOOD_EVERY);
    sleepTimer = setTimeout(() => {
      clearInterval(moodTimer);
      bot.setState('sleepy');
    }, AWAKE_FOR);
  }

  mountChat(chat, {
    onState(state, text = '') {
      clear();
      used = true;
      bot.setState(state);
      if (state === 'talking') {
        /* talk for roughly as long as the answer takes to skim, 3 to 9 seconds */
        const words = text.split(/\s+/).length;
        stateTimer = setTimeout(rest, Math.min(9000, Math.max(3000, words * 60)));
      } else if (state === 'error') {
        stateTimer = setTimeout(rest, 8000);
      }
    },
  });

  /* coming back to the chat wakes it up */
  chat.addEventListener('focusin', () => {
    if (bot.state === 'sleepy') rest();
  });
  const stopReacting = addReactions(bot, canvas, rest);
  /* the project page's copy is thrown away on leaving, so its animation and timers stop too */
  bot.dispose = () => {
    clear();
    stopReacting();
    bot.stop();
  };
  return bot;
}

export function initHomeChat() {
  const grid = document.getElementById('home-bot');
  grid.innerHTML = botGridHTML({ id: 'home-chat', heading: 'Ask my AI', projectLink: true });
  mountBotChat(grid);
}
