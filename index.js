require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const User = require('./apps/shop/models/user');

const routes = require('./routes');
const { connectDb } = require('./database');

const app = express();
const PORT = process.env.PORT || 5000

// User middleware
app.use(async (req, res, next) => {
  const user = await User.find('609c540d647ef6345fd2c665');
  const { username, email, cart, _id } = user;
  req.user = new User(username, email, cart, _id);
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
app.use(bodyParser({ extended: false }));

// Routes
app.use('/', routes)

// Server Start
connectDb(() => {
  app.listen(PORT, () => console.log(`Listening on http://localhost:${ PORT }`));
})

