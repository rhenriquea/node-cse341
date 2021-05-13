const express = require('express');
const router = express.Router();

// AWS Config
const AWS = require('aws-sdk');
const S3_BUCKET = process.env.S3_BUCKET;
const S3 = new AWS.S3({apiVersion: '2006-03-01', region:'us-east-1'});
const S3_PARAMS = { Bucket: S3_BUCKET, Key: 'data/books.json' };

const getStoredBooks = async () => {

    if(S3_PARAMS['Body'] || S3_PARAMS['ACL'] || S3_PARAMS['ContentType']) {
        delete S3_PARAMS['Body'];
        delete S3_PARAMS['ACL'];
        delete S3_PARAMS['ContentType'];
    }

    const { Body } = await S3.getObject(S3_PARAMS).promise()
    return JSON.parse(Body.toString('utf-8'));
}

router.get('/', (req, res, next) => {
    res.render('pages/week02', {
        title: 'Week 02',
        path: '/prove/week02'
    });
    res.end();
});

router.get('/books', async (req, res, next) => {

    const books = await getStoredBooks();
  
    res.render('pages/week02/books', {
        title: 'Books',
        path: '/prove/week02',
        books
    });

    res.end();
});

router.post('/addBooks', async (req, res, next) => {
    const newBooks = req.body

    const storedBooks = await getStoredBooks();
    const books = [].concat(storedBooks, newBooks);

    S3_PARAMS['Body'] = JSON.stringify(books, null, 2);
    S3_PARAMS['ACL'] = 'public-read';
    S3_PARAMS['ContentType'] = 'application/json';

    try {
        await S3.putObject(S3_PARAMS).promise();
        res.statusCode = 200;
        res.setHeader('Location', '/prove/week02/books');
        res.send(newBooks);
        res.end()
    } catch(e) {
        console.log(e);
    }
})

router.get('/populateBooks', async (req, res, next) => {
    S3_PARAMS['Body'] = JSON.stringify(require('../../../data/books.json'));
    S3_PARAMS['ACL'] = 'public-read';
    S3_PARAMS['ContentType'] = 'application/json';

    try {
        await S3.putObject(S3_PARAMS).promise()
        res.write('{ success: true }');
        res.end()
    } catch(e) {
        console.log(e);
    }
})

module.exports = router;