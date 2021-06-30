/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const socket = io();

const populateList = async () => {
  const heroesList = document.getElementById('heroesList');

  try {
    const res = await fetch('/prove/week10/fetchAll');
    const data = await res.json();

    while (heroesList.firstChild) heroesList.firstChild.remove();

    (data || []).avengers.forEach((avenger) => {
      const li = document.createElement('li');
      li.classList.value = ['list-group-item'];
      li.innerHTML = `
        <div class="d-flex w-100 justify-content-between">
          <h5 class="mb-1">${avenger.name}</h5>
          <small>${avenger.age ? `${avenger.age} Years old` : ''}</small>
        </div> 
        <p class="mb-0">${avenger.heroName || ''}</p>
        <small>${avenger.publisher || ''}</small>
      `;
      heroesList.appendChild(li);
    });
  } catch (err) {
    console.error(err);
  }
};

const showMessage = (type, { title, message }) => {
  const el = document.getElementById(type);
  el.style.display = 'block';
  el.innerHTML = `<h6>${title}</h6><p>${message}</p>`;

  setTimeout(() => {
    el.style.display = 'none';
    el.innerHTML = '';
  }, 3000);
};

// Repopulate the list when the server broadcasts an event
socket.on('update-list', () => {
  populateList();
});

const addName = async () => {
  const URL = '/prove/week10/addName';
  const formEL = document.getElementById('heroForm');
  const formData = new FormData(formEL);
  const payload = {};
  const messageConfig = { title: '', message: '' };
  let form = {};

  // Prepare dynamic form (including _csrf)
  for (const entry of formData.entries()) {
    form = { ...form, [entry[0]]: entry[1] };
  }
  form = JSON.stringify(form);

  try {
    // Prepare request
    payload.method = 'POST';
    payload.headers = { 'Content-Type': 'application/json' };
    payload.body = form;

    await fetch(URL, payload);

    messageConfig.title = 'Success';
    messageConfig.message = `Successfully added 
    <strong>${JSON.parse(form).name}</strong> 
    to the list`;
    showMessage('success', messageConfig);
    populateList();
    socket.emit('new-character');
  } catch (error) {
    console.error(error);
    messageConfig.title = error.response.status;
    messageConfig.message = error.response.data;
    showMessage('error', messageConfig);
  }

  // Reset Form
  formEL.reset();
};

// Prepare listeners
window.addEventListener('load', () => populateList());
document.getElementById('submitBtn').addEventListener('click', addName);
