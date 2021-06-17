const express = require('express');

const router = express.Router();

const controller = require('../controllers/week09');

router.get('/', async (req, res) => {
  let { page } = req.query;
  page = +page || 1;

  await controller.getPokemons(page, (data) => {
    const { results, count } = data;

    const hasNextPage = 10 * page < count;
    const hasPreviousPage = page > 1;
    const nextPage = page + 1;
    const previousPage = page - 1;
    const lastPage = Math.ceil(count / 10);

    res.render('pages/week09', {
      title: 'Week 09',
      path: '/prove/week09',
      pokemons: results,
      currentPage: page,
      hasNextPage,
      hasPreviousPage,
      nextPage,
      previousPage,
      lastPage,
    });

    res.end();
  });
});

module.exports = router;
