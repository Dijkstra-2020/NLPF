require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const cors = require("cors");
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var passport = require('passport');
var Auth0Strategy = require('passport-auth0');
const { database, Post, Candidature, Message } = require('./database');
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

//Middleware
var userInViews = require('./lib/middleware/userInViews');
app.use(userInViews());


// Route
var authRouter = require('./routes/auth');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var msgRouter = require('./routes/messagerie');
app.use('/', authRouter);
app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', msgRouter);

const epilogue = require('finale-rest');
epilogue.initialize({app: app, sequelize: database});
epilogue.resource({
    model: Post,
    endpoints: ['/posts', '/posts/:id'],
});

epilogue.resource({
    model: Message,
    endpoints: ['/msg', '/msg/:id'],
});

io.on('connection', () =>{
    console.log('a user is connected')
});

var port = 80;
database.sync({ force: true }).then(() => {
    var server = http.listen(port, () => {
        console.log('server is running on port', server.address().port);
    });
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