const { Router } = require('express');
const routes = Router();

// Home Page
routes.get('/', (req, res, next) => {

    const assignments = [{
            title: 'Week 01',
            subtitle: 'Add User to List',
            description: 'Simple example where you can add a user to a list',
            path: '/prove/week01'
        },
        {
            title: 'Week 02',
            subtitle: 'Library System',
            description: 'Simple example for a library system',
            path: '/prove/week02'
        },
        {
            title: 'Week 03',
            subtitle: 'JSON Data',
            description: 'Passing IDs as params using a fake users data JSON',
            path: '/prove/week03'
        },
        {
            title: 'E-commerce',
            subtitle: 'Sample E-commerce Server',
            description: 'A sample e-commerce project using Node.js and MongoDB',
            path: '/shop'
        },
    ]

    res.render('pages', {
        title: 'CSE 341',
        subtitle: 'Node.js Assignments App',
        description: 'This app contains assignments for the course CSE 341 from Brigham Young University',
        path: '/',
        assignments
    });
})

// Prove App Routes
const prove = require('../apps/prove/routes');
routes.use('/prove', prove);

// Shop App
const shop = require('../apps/shop/routes/shop')
const admin = require('../apps/shop/routes/admin')

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