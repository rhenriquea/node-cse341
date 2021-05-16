require('dotenv').config()

const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const { MONGODB_USER, MONGODB_PASS, DB_NAME, SESSION_KEY } = process.env;

const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@cluster0.pjqyl.mongodb.net/${DB_NAME}`;

const path = require('path');

const User = require('./apps/shop/models/user');

const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000

app.use(compression());

// Static Files
app.use(express.static(path.join(__dirname, 'public')))

// Body parser
app.use(bodyParser.urlencoded({
  extended: false
})).use(bodyParser.json());

// Session Config
const store = new MongoDBStore({
  uri,
  collection: 'sessions'
});

app.use(session({ 
  secret: SESSION_KEY, 
  resave: false, 
  saveUninitialized: false,
  store
}));

app.use(csrf());
app.use(flash());

// Enrich user with Mongoose model
app.use(async (req, res, next) => {
  if(!req.session.user) return next();
  const user = await User.findById(req.session.user._id);
  req.user = user;
  next();
});

// View Logic
app.set('views', [
  `${__dirname}/views`, 
  `${__dirname}/apps/prove/views`, 
  `${__dirname}/apps/shop/views`
]);
app.set('view engine', 'ejs')

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isAuthenticated;
  res.locals.csrfToken = req.csrfToken();
  res.locals.cartCount = req.user && req.user.getCartProductsAmount() || 0;
  next();
})

// Routes
app.use('/', routes);

// Server Start
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true }).then(_ => {
  console.info('Database Connected');
  app.listen(PORT, () => console.info(`Listening on http://localhost:${ PORT }`));
});