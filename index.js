const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const PORT = process.env.PORT || 5000
require('dotenv').config()

const app = express();
const routes = require('./routes');

app.use(express.static(path.join(__dirname, 'public')))
   .set('views', path.join(__dirname, 'views'))
   .set('view engine', 'ejs')
   .use(bodyParser({extended: false})) // For parsing the body of a POST
   .use('/', routes)
   .listen(PORT, () => console.log(`Listening on ${ PORT }`));
