const { Router } = require('express')
const proveRoutes = Router();

proveRoutes
    .use('/week01', require('./week01'))
    .use('/week02', require('./week02'))
    .get('/', (req, res, next) => {
        res.render('pages/prove', {
            title: 'Prove',
            path: '/prove',
        });
    });


module.exports = proveRoutes;