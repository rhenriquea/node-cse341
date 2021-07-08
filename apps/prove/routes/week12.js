const express = require('express');

const router = express.Router();

const users = ['Admin'];

router.get('/', async (req, res) => {
  res.render('pages/week12/login', {
    title: 'Login to Chat',
    path: '/prove/week12',
  });
});

router.post('/login', (req, res) => {
  const { username } = req.body;

  if (!username || username.trim() === '')
    return res.status(400).send({ error: 'Username cannot be empty!' });

  if (users.includes(username.trim()))
    return res.status(409).send({ error: 'Username is taken!' });

  users.push(username.trim());
  req.session.chatUser = username;
  res.status(200).send({ username });
});

router.get('/chat', async (req, res) => {
  res.render('pages/week12/chat', {
    title: 'Week 12',
    path: '/prove/week12',
    chatUser: req.session.chatUser,
  });
});

module.exports = router;
