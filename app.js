require('dotenv').config();

const bodyParser = require('body-parser');
const compression = require('compression');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
// const csrf = require('csurf');
// const flash = require('connect-flash');

const express = require('express');

const app = express();
const http = require('http');
const { Server } = require('socket.io');

const server = http.createServer(app);
const io = new Server(server);

const { MONGODB_USER, MONGODB_PASS, DB_NAME, SESSION_KEY } = process.env;

const uri = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASS}@cluster0.pjqyl.mongodb.net/${DB_NAME}`;

const path = require('path');

const User = require('./apps/shop/models/user');

const routes = require('./routes');

const PORT = process.env.PORT || 5000;

const getTime = () => {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const mins = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${mins}`;
};

// Session Config
const store = new MongoDBStore({
  uri,
  collection: 'sessions',
});

const sessionMiddleware = session({
  secret: SESSION_KEY,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: false, // Permit access to client session
  },
  store,
});

io.use((socket, next) => {
  sessionMiddleware(socket.request, socket.request.res || {}, next);
});

app.use(sessionMiddleware);

io.sockets.on('connection', (socket) => {
  console.log('Client connected');

  socket
    .on('disconnect', () => {
      console.log('Client disconnected');
      const { chatUser } = socket.request.session;

      if (chatUser) {
        const text = `${chatUser} has left the group.`;

        socket.broadcast.emit('new-message', {
          text,
          time: getTime(),
          author: 'Admin',
        });
      }
    })
    .on('new-character', () => {
      socket.broadcast.emit('update-list');
    })
    .on('user-login', ({ username, time }) => {
      const text = `${username} has logged on.`;
      socket.broadcast.emit('new-message', {
        text,
        time,
        author: 'Admin',
      });
    })
    .on('message', (data) => {
      socket.broadcast.emit('new-message', {
        ...data,
      });
    });
});

app.use(compression());

// Static Files
app.use(express.static(path.join(__dirname, 'public')));

// Body parser
app
  .use(
    bodyParser.urlencoded({
      extended: false,
    })
  )
  .use(bodyParser.json());

/* DISABLED FOR WEEK 12 */
// app.use(csrf());
// app.use(flash());

/* app.use((req, res, next) => {
  if (req.path.includes('/shop')) {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.csrfToken = req.csrfToken();
  }
  next();
}); */

// Enrich user with Mongoose model
app.use(async (req, res, next) => {
  if (!req.session.user) return next();
  try {
    const user = await User.findById(req.session.user._id);
    if (!user) return next();
    req.user = user;
    next();
  } catch (e) {
    next(new Error(e));
  }
});

// View Logic
app.set('views', [
  `${__dirname}/views`,
  `${__dirname}/apps/prove/views`,
  `${__dirname}/apps/shop/views`,
]);
app.set('view engine', 'ejs');

// Routes
app.use('/', routes);

// Server Start
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.info('Database Connected');
    server.listen(PORT, () =>
      console.info(`Listening on http://localhost:${PORT}`)
    );
  });
