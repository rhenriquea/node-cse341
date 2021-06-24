/* eslint-disable no-param-reassign */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const populateList = async () => {
  const heroesList = document.getElementById('heroesList');

  try {
    const { data } = await axios.get('/prove/week10/fetchAll');

    while (heroesList.firstChild) heroesList.firstChild.remove();

    data.avengers.forEach((avenger) => {
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

const addName = async () => {
  const URL = '/prove/week10/addName';
  const headers = { 'Content-Type': 'application/json' };
  const form = document.getElementById('heroForm');
  const formData = new FormData(form);
  const messageConfig = { title: '', message: '' };

  // Prepare dynamic payload (including _csrf)
  let payload = {};
  for (const entry of formData.entries()) {
    payload = { ...payload, [entry[0]]: entry[1] };
  }
  payload = JSON.stringify(payload);

  try {
    await axios.post(URL, payload, { headers });
    populateList();
    messageConfig.title = 'Success';
    messageConfig.message = `Successfully added 
    <strong>${JSON.parse(payload).name}</strong> 
    to the list`;
    showMessage('success', messageConfig);
  } catch (error) {
    messageConfig.title = error.response.status;
    messageConfig.message = error.response.data;
    showMessage('error', messageConfig);
  }

  // Reset Form
  form.reset();
};

// Prepare listeners
window.addEventListener('load', () => populateList());
document.getElementById('submitBtn').addEventListener('click', addName);
