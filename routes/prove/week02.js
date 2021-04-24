const express = require('express');
const router = express.Router();

const USERS = [];

router.get('/',(req, res, next) => {
    res.render('pages/prove/week02', { 
        title: 'Week 02', 
        path: '/prove/week02',
    });
    res.end();
});

module.exports = router;