const { Router } = require('express');
const routes = Router();

const proveRoutes = require('./prove')

routes
    .use('/prove', proveRoutes)
    // Main Routes
    .get('/', (req, res, next) => {
        res.render('pages/prove', { 
          title: 'CSE 341', 
          subtitle: 'Node.js Assignments App', 
          description: 'This app contains assignments for the course CSE 341 from Brigham Young University',
          path: '/' 
        });
    })
    .use((req, res, next) => {
        res.render('pages/404', { title: '404 - Page Not Found', path: req.url })
    })

module.exports = routes;