require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const routes = require('./routes');
const { connectDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000

// Static Files
app.use(express.static(path.join(__dirname, 'public')))

// View Logic
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// Body parser
app.use(bodyParser({ extended: false }));

// Routes
app.use('/', routes)

// Server Start
connectDb(() => {
  app.listen(PORT, () => console.log(`Listening on http://localhost:${ PORT }`));
})

