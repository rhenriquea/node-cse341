/* eslint-disable no-bitwise */
/* eslint-disable no-plusplus */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-undef */
const socket = io();

const getTime = () => {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const mins = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${mins}`;
};

/* Battery */
navigator.getBattery().then((battery) => {
  const batteryLevel = document.getElementById('battery');
  batteryLevel.innerHTML = `${battery.level * 100}%`;

  battery.addEventListener('levelchange', () => {
    batteryLevel.innerHTML = `${battery.level * 100}%`;
  });
});

const stringToColour = function (str) {
  let hash = 0;
  let colour = '#';

  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += `00${value.toString(16)}`.substr(-2);
  }

  return colour;
};

/* Message */
const conversation = document.querySelector('.conversation-container');
const messages = document.querySelectorAll('.message');

// Add color according to author name
messages.forEach((message) => {
  const metadataEl = message.children[0].children[0];
  const metadata = metadataEl.innerHTML;
  const author = metadata.split('@')[0].trim();
  metadataEl.style.color = stringToColour(author);
});

function buildMessage(text, time, author) {
  const element = document.createElement('div');
  const color = stringToColour(author);

  // Check is session user is the same that sent the message
  element.classList.add('message', user.value !== author ? 'received' : 'sent');

  element.innerHTML = `<span class="metadata">
    <span class="time" style="color:${color};">${author} @ ${time}</span></span>
    ${text}
    <span class="metadata">
      <span class="tick tick-animation">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck" x="2047" y="2061"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#92a58c"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" id="msg-dblcheck-ack" x="2063" y="2076"><path d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.32.32 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.892 7.77a.366.366 0 0 0-.516.005l-.423.433a.364.364 0 0 0 .006.514l3.255 3.185a.32.32 0 0 0 .484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z" fill="#4fc3f7"/></svg>
      </span>
    </span>
    </span>`;

  return element;
}

// Fake read message effect
function animateMessage(message) {
  setTimeout(() => {
    const tick = message.querySelector('.tick');
    tick.classList.remove('tick-animation');
  }, 500);
}

// Add message to view
function newMessage({ text, time, author }) {
  if (message) {
    const message = buildMessage(text, time, author);
    conversation.appendChild(message);
    animateMessage(message);
  }
}

// Grab form values and emit event
const postMessage = (e) => {
  e.preventDefault();
  const messageEl = document.getElementById('message');
  const text = messageEl.value.trim();
  const author = document.getElementById('user').value;
  const time = getTime();

  const data = { text, author, time };
  socket.emit('message', data);
  newMessage(data);

  messageEl.value = '';

  conversation.scrollTop = conversation.scrollHeight;
};

// Add listeners
document.getElementById('messageForm').addEventListener('submit', postMessage);
socket.on('new-message', (data) => newMessage(data));
