var express = require('express');
const path = require('path');
var router = express.Router();
const session = require('express-session');
const { ExpressOIDC } = require('@okta/oidc-middleware');
var app = express();


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
app.use(express.static(path.join(__dirname, 'public')));
router.get('/home', (req, res) => {

  res.sendFile(path.join(__dirname, '../public/home.html'));
});

router.get('/admin', oidc.ensureAuthenticated(), (req, res) =>{
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

router.get('/logout', (req, res) => {
  if (req.userContext) {
    const idToken = req.userContext.tokens.id_token;
    const to = process.env.HOSTURL;
    console.log(to);
    const params = `id_token_hint=${idToken}&post_logout_redirect_uri=${to}`;
    req.logout();
    res.redirect(
        `${process.env.OKTA_ORG_URL}/oauth2/default/v1/logout?${params}`
    );
  } else {
    res.redirect('/home');
  }
});

router.get('/', (req, res) => {
  res.redirect('/home');
});

module.exports = router;
