//Database initialize
const Sequelize = require('sequelize');

const database = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite',
    operatorsAliases: false,
});
const Post = database.define('posts', {
    title: Sequelize.STRING,
    content: Sequelize.TEXT,
});

const Candidature = database.define('candidature', {
    post_id : Sequelize.INTEGER,
    user_id : Sequelize.STRING
});

const Message = database.define('msg', {
    sender: Sequelize.STRING,
    content: Sequelize.TEXT,
    receiver: Sequelize.STRING
});

module.exports = { database, Post, Candidature, Message };