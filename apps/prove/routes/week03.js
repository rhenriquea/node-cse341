/* eslint-disable no-shadow */
const express = require('express');

const router = express.Router();

// AWS Config
const AWS = require('aws-sdk');

const { S3_BUCKET } = process.env;
const S3 = new AWS.S3({ apiVersion: '2006-03-01', region: 'us-east-1' });
const S3_PARAMS = { Bucket: S3_BUCKET, Key: 'data/users.json' };

let users = [];

const getStoredUsers = async () => {
  if (S3_PARAMS.Body || S3_PARAMS.ACL || S3_PARAMS.ContentType) {
    delete S3_PARAMS.Body;
    delete S3_PARAMS.ACL;
    delete S3_PARAMS.ContentType;
  }

  const { Body } = await S3.getObject(S3_PARAMS).promise();
  return JSON.parse(Body.toString('utf-8'));
};

router.get('/', async (req, res) => {
  users = await getStoredUsers();

  res.render('pages/week03', {
    title: 'Week 03',
    path: '/prove/week03',
    users,
  });
  res.end();
});

router.get('/:id', async (req, res) => {
  users = await getStoredUsers();
  const user = users.find((user) => `${user.id}` === req.params.id);

  res.render('pages/week03/details', {
    title: 'Week 03',
    path: '/prove/week03',
    user,
  });

  res.end();
});

module.exports = router;
