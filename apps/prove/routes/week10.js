const express = require('express');

const router = express.Router();

const dummyData = require('../../../data/dummyData.json');

router.get('/', async (req, res) => {
  res.render('pages/week10', {
    title: 'Week 10',
    path: '/prove/week10',
  });

  res.end();
});

router.get('/fetchAll', (req, res) => {
  res.json(dummyData);
});

router.post('/addName', (req, res) => {
  const { name, age, publisher, heroName } = req.body;
  const alreadyExists = dummyData.avengers.some((a) => a.name === name);

  // Make name required and check if already on list
  if (name && !alreadyExists) {
    dummyData.avengers.push({ name, age, publisher, heroName });
    return res.sendStatus(200);
  }

  res.sendStatus(400);
});

module.exports = router;
