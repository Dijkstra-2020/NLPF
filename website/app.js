require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const cors = require("cors");
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
const app = express();
app.use(session({
  secret: process.env.RANDOM_SECRET_WORD,
  resave: true,
  saveUninitialized: false
}));

const oidc = new ExpressOIDC({
  issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
  client_id: process.env.OKTA_CLIENT_ID,
  client_secret: process.env.OKTA_CLIENT_SECRET,
  redirect_uri: process.env.REDIRECT_URL,
  scope: 'openid profile',
  routes: {
    callback: {
      path: '/authorization-code/callback',
      defaultRedirect: '/admin'
    }
  }
});
app.use(oidc.router);

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
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

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
epilogue.initialize({app: app, sequelize: database});
const PostResource = epilogue.resource({
  model: Post,
  endpoints: ['/posts', '/posts/:id'],
});
var port = 80;
database.sync({ force: true }).then(() => {
  oidc.on('ready', () => {
    app.listen(port, () => console.log(`Listening on port ${port}!`))
  });
});


oidc.on('error', err => {
  // An error occurred while setting up OIDC
  console.log("oidc error: ", err);
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