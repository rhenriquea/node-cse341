const { Router } = require('express');

const proveRoutes = Router();

proveRoutes
  .use('/week01', require('./week01'))
  .use('/week02', require('./week02'))
  .use('/week03', require('./week03'))
  .use('/week09', require('./week09'))
  .use('/week10', require('./week10'))
  .use('/week12', require('./week12'))
  .get('/', (req, res) => {
    res.render('pages/prove', {
      title: 'Prove',
      path: '/prove',
    });
  });

module.exports = proveRoutes;
