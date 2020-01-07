require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const cors = require("cors");
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');

var session = require('express-session');
var sess = {
  secret: 'CHANGE THIS TO A RANDOM SECRET',
  cookie: {},
  resave: false,
  saveUninitialized: true
};
if (app.get('env') === 'production') {
  // Use secure cookies in production (requires SSL/TLS)
  sess.cookie.secure = true;

  // Uncomment the line below if your application is behind a proxy (like on Heroku)
  // or if you're encountering the error message:
  // "Unable to verify authorization request state"
  // app.set('trust proxy', 1);
}

app.use(session(sess));

var strategy = new Auth0Strategy(
    {
      domain: process.env.AUTH0_DOMAIN,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: process.env.AUTH0_CALLBACK_URL
    },
    function (accessToken, refreshToken, extraParams, profile, done) {
      // accessToken is the token to call Auth0 API (not needed in the most cases)
      // extraParams.id_token has the JSON Web Token
      // profile has all the information from the user
      return done(null, profile);
    }
);

passport.use(strategy);

app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(cors());
app.use(bodyParser.json());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
var userInViews = require('./lib/middleware/userInViews');
var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

// ..
app.use(userInViews());
app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', indexRouter);

//Database initialize
const Sequelize = require('sequelize');
const epilogue = require('finale-rest');

const database = new Sequelize({
  dialect: 'sqlite',
  storage: './db.sqlite',
  operatorsAliases: false,
});
const Post = database.define('posts', {
  title: Sequelize.STRING,
  content: Sequelize.TEXT,
});

const Message = database.define('msg', {
  sender: Sequelize.STRING,
  content: Sequelize.TEXT,
  receiver: Sequelize.STRING
});

epilogue.initialize({app: app, sequelize: database});
const PostResource = epilogue.resource({
  model: Post,
  endpoints: ['/posts', '/posts/:id'],
});
var port = 80;
database.sync({ force: true }).then(() => {
    app.listen(port, () => console.log(`Listening on port ${port}!`))
});

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});