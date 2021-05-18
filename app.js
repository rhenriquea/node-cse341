require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const mongoose = require('mongoose');

const { MONGODB_USER, MONGODB_PASS, DB_NAME } = process.env;

const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@cluster0.pjqyl.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;

const path = require('path');

const User = require('./apps/shop/models/user');

const routes = require('./routes');
// const { connectDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000

app.use(compression());

// User middleware
app.use(async (req, res, next) => {
  const user = await User.findById('60a002be6855f83a8f5c8cd8');
  req.user = user;
  next();
});

// Static Files
app.use(express.static(path.join(__dirname, 'public')))

// View Logic
app.set('views', [
  `${__dirname}/views`, 
  `${__dirname}/apps/prove/views`, 
  `${__dirname}/apps/shop/views`
]);

app.set('view engine', 'ejs')

// Body parser
app.use(bodyParser.urlencoded({
  extended: false
})).use(bodyParser.json());

// Routes
app.use('/', routes)

// Server Start
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(_ => {  
  app.listen(PORT, () => console.info(`Listening on http://localhost:${ PORT }`));
});