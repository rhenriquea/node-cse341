const { Router } = require('express');

const routes = Router();

// Home Page
routes.get('/', (req, res) => {
  const assignments = [
    {
      title: 'Week 01',
      subtitle: 'Add User to List',
      description: 'Simple example where you can add a user to a list',
      path: '/prove/week01',
    },
    {
      title: 'Week 02',
      subtitle: 'Library System',
      description: 'Simple example for a library system',
      path: '/prove/week02',
    },
    {
      title: 'Week 03',
      subtitle: 'JSON Data',
      description: 'Passing IDs as params using a fake users data JSON',
      path: '/prove/week03',
    },
    {
      title: 'E-commerce',
      subtitle: 'Sample E-commerce Server',
      description: 'A sample e-commerce project using Node.js and MongoDB',
      path: '/shop',
    },
    {
      title: 'REST Pokeapi',
      subtitle: 'REST API',
      description: 'A REST API to make pagination for a pokemon API',
      path: '/prove/week09',
    },
    {
      title: 'Week 10 Prove Assignment',
      subtitle: 'REST API',
      description:
        'Using dummy data to create an update capability using axios and asynchronous JavaScript',
      path: '/prove/week10',
    },
    {
      title: 'Week 12 Prove Assignment',
      subtitle: 'Chat APP',
      description: 'Livechat room using socket.io and sessions',
      path: '/prove/week12',
    },
  ];

  res.render('pages', {
    title: 'CSE 341',
    subtitle: 'Node.js Assignments App',
    description:
      'This app contains assignments for the course CSE 341 from Brigham Young University',
    path: '/',
    assignments,
  });
});

// Prove App Routes
const prove = require('../apps/prove/routes');

routes.use('/prove', prove);

// Shop App
const shop = require('../apps/shop/routes/shop');
const admin = require('../apps/shop/routes/admin');
const auth = require('../apps/shop/routes/auth');
const authenticated = require('../apps/shop/middlewares/authenticated');

routes.use('/shop', shop);
routes.use('/shop/admin', admin, authenticated);
routes.use('/shop/auth', auth);

// 404 Page
routes.use((req, res) => {
  res.status(404).render('pages/404', {
    title: '404 - Page Not Found',
    path: req.url,
  });
});

// 500 Page
// eslint-disable-next-line no-unused-vars
routes.use((error, req, res, next) => {
  res.status(500).render('pages/500', {
    title: '500 - Internal Server Error',
    path: req.url,
    error,
  });
});

module.exports = routes;
