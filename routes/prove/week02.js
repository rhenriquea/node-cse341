const express = require('express');
const router = express.Router();
const fs = require('fs');
const util = require('util');

const saveFile = util.promisify(fs.writeFile);

let BOOKS = [];

router.get('/', (req, res, next) => {
    res.render('pages/prove/week02', {
        title: 'Week 02',
        path: '/prove/week02'
    });
    res.end();
});

router.get('/books', (req, res, next) => {
    let booksData = require('../../data/books.json') || [];

    BOOKS = booksData;

    res.render('pages/prove/week02/books', {
        title: 'Books',
        path: '/prove/week02',
        books: BOOKS
    });

    res.end();
});

router.post('/addBook', async (req, res, next) => {
    const newBook = req.body
    const storedBooks = require('../../data/books.json') || [];
    storedBooks.push(newBook)

    try {
        await saveFile('data/books.json', JSON.stringify(storedBooks, null, 2));
        res.statusCode = 200;
        res.setHeader('Location', '/prove/week02/books');
        res.send(newBook);
        res.end()
    } catch(e) {
        console.log(e);
    }

    
})

module.exports = router;