const express = require('express');
const router = express.Router();

const USERS = [];

router.get('/',(req, res, next) => {
    res.render('pages/prove/week01', { 
        title: 'Week 01', 
        path: '/prove/week01',
    });
    res.end();
});

router.get('/users',(req, res, next) => {
  res.render('pages/prove/week01/users', { 
      title: 'Week 01: Users', 
      path: '/prove/week01',
      users: USERS
  });
  res.end();
});

router.post('/create-user', (req, res, next) => {
  const { username } = req.body;
  USERS.push(username);
  
  res.statusCode = 302;
  res.setHeader('Location', '/prove/week01/users');
  return res.end();
})

module.exports = router;