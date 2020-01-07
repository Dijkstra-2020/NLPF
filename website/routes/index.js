var express = require('express');
const path = require('path');
var router = express.Router();
var secured = require('../lib/middleware/secured');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
router.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/home.html'));
});

router.get('/dashboard', secured(), function(req, res, next) {
  res.sendFile(path.join(__dirname, '../public/dashboard.html'));
});

router.get('/', (req, res) => {
  res.redirect('/home');
});

module.exports = router;
