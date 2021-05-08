const { Router } = require('express');
const routes = Router();

// Home Page
routes.get('/', (req, res, next) => {
    res.render('pages', { 
      title: 'CSE 341', 
      subtitle: 'Node.js Assignments App', 
      description: 'This app contains assignments for the course CSE 341 from Brigham Young University',
      path: '/' 
    });
})

// Prove Routes
const prove = require('./prove');

routes.use('/prove', prove);

// Shop
const shop = require('./shop/shop')
const admin = require('./shop/admin')

routes.use('/shop', shop)
routes.use('/shop/admin', admin)

// 404 Page
routes.use((req, res, next) => {
    res.status(404).render('pages/404', { 
        title: '404 - Page Not Found', 
        path: req.url 
    });
});

module.exports = routes;