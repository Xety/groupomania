const { Model, DataTypes } = require("sequelize");
const sequelize = module.parent.db.sequelize;

class User extends Model {}

User.init({
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    is_admin: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
}, {
    sequelize,
    indexes: [{ unique: true, fields: ['email'] }]
});

module.exports = User;