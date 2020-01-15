//Database initialize
const Sequelize = require('sequelize');

const database = new Sequelize({
    dialect: 'sqlite',
    storage: './db.sqlite',
    operatorsAliases: false,
});

const Post = database.define('posts', {
    title: Sequelize.STRING,
    tags: Sequelize.STRING,
    content: Sequelize.TEXT
});

const Candidature = database.define('candidature', {
    user_id : Sequelize.STRING
});
Candidature.belongsTo(Post, { onDelete: 'cascade' });

const Message = database.define('msg', {
    username: Sequelize.STRING,
    sender_id: Sequelize.STRING,
    content: Sequelize.TEXT,
    receiver_id: Sequelize.STRING
});

const Profil = database.define('profil', {
    auth_id: Sequelize.STRING,
    image: Sequelize.STRING,
    familyName: Sequelize.STRING,
    givenName: Sequelize.STRING,
    email: Sequelize.STRING,
    description: Sequelize.STRING,
    skill: Sequelize.STRING,
    tags: Sequelize.STRING
});

module.exports = { database, Post, Candidature, Message, Profil };