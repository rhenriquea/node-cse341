const express = require('express');

const router = express.Router();

const USERS = [];

router.get('/', (req, res) => {
  res.render('pages/week01', {
    title: 'Week 01',
    path: '/prove/week01',
  });
  res.end();
});

router.get('/users', (req, res) => {
  res.render('pages/week01/users', {
    title: 'Users',
    path: '/prove/week01',
    users: USERS,
  });
  res.end();
});

router.post('/create-user', (req, res) => {
  const { username } = req.body;
  USERS.push(username);

  res.statusCode = 302;
  res.setHeader('Location', '/prove/week01/users');
  return res.end();
});

module.exports = router;
