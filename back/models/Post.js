const { Model, DataTypes } = require("sequelize");
const sequelize = module.parent.db.sequelize;

class Post extends Model {}

Post.init({
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: true
    },
    likes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    dislikes: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    usersLiked: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
    usersDisliked: {
        type: DataTypes.JSON,
        allowNull: false,
        defaultValue: []
    },
}, { sequelize});

module.exports = Post;