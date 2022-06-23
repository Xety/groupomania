const { Sequelize } = require("sequelize");
const sequelize = new Sequelize(
    process.env.MYSQL_DATABASE,
    process.env.MYSQL_USERNAME,
    process.env.MYSQL_PASSWORD, {
        host: process.env.MYSQL_HOST,
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.db = db;

// Declare our models.
db.User = require("../models/User.js");
db.Post = require("../models/Post.js");

// Declare associations models.
db.User.hasMany(db.Post);

module.exports = db;