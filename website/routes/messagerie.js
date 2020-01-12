// routes/messagerie.js

var express = require('express');
var secured = require('../lib/middleware/secured');
var router = express.Router();
const path = require('path');
const { database, Post, Candidature, Message } = require('../database');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
io.on('connection', () =>{
    console.log('messagerie connected')
});
app.use(express.static(path.join(__dirname, 'public')));

router.get('/messagerie', secured(), (req, res) => {
    res.sendFile(path.join(__dirname, '../public/message.html'));
});

router.post('/messages', (req, res) => {
    var message = new Message(req.body);
    message.save();
    res.sendStatus(200);
});

io.on('connection', () =>{
    console.log('a user is connected')
    io.on('message', function() {
        io.broadcast.emit('msg', "call");
    });
});

module.exports = router;