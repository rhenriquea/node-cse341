/* eslint-disable no-undef */
const socket = io();

const errorContainer = document.getElementById('errorMessage');
const usernameInput = document.getElementById('username');

const makeRequest = async (url = '', method = 'GET', data = {}) => {
  const config = {};
  config.method = method;

  if (method === 'POST') {
    config.headers = { 'Content-Type': 'application/json' };
    config.body = JSON.stringify(data);
  }

  const response = await fetch(url, config);
  return response.json();
};

const getTime = () => {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const mins = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${mins}`;
};

const login = async (e) => {
  e.preventDefault();
  const username = usernameInput.value;

  errorContainer.innerHTML = '';

  if (!username || username.trim() === '') {
    errorContainer.innerHTML = 'Username cannot be empty!';
    return;
  }

  const data = await makeRequest('/prove/week12/login', 'POST', {
    username,
  });

  if (data.error) {
    errorContainer.innerHTML = data.error;
    return;
  }

  socket.emit('user-login', { username, time: getTime() });
  window.location = '/prove/week12/chat';
};

document.getElementById('loginForm').addEventListener('submit', login);
