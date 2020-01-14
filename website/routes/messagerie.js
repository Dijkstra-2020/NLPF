// routes/messagerie.js

var express = require('express');
var secured = require('../lib/middleware/secured');
var router = express.Router();
const path = require('path');
const { database, Post, Candidature, Message } = require('../database');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

router.get('/messagerie', secured(), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/message.html'));
});

router.post('/messages', secured(), (req, res) => {
    var message = new Message(req.body);
    const { _raw, _json, ...userProfile } = req.user;
    message.username = userProfile.nickname;
    message.save();
    res.sendStatus(200);
});

module.exports = router;