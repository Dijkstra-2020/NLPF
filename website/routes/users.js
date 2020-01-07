// routes/users.js

var express = require('express');
var secured = require('../lib/middleware/secured');
var router = express.Router();
let ejs = require('ejs');
let fs = require('fs');
const path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));
/* GET user profile. */
router.get('/profile', secured(), function (req, res, next) {
    res.sendFile(path.join(__dirname, '../public/profile.html'));
});

/* GET user profile. */
router.get('/user', secured(), function (req, res, next) {
    const { _raw, _json, ...userProfile } = req.user;
    res.send(userProfile);
});

module.exports = router;