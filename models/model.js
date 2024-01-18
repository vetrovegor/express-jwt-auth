import { sequelize } from "../db.js";
import { DataTypes } from "sequelize";

const User = sequelize.define('user', {
    id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    email: {type: DataTypes.STRING, unique: true, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    isActivated: {type: DataTypes.BOOLEAN, defaultValue: false},
    activationLink: {type: DataTypes.STRING}
})

const Token = sequelize.define('token', {
    id: {type: DataTypes.INTEGER, primaryKey:true, autoIncrement: true},
    token: {type: DataTypes.STRING, allowNull: false}
});

// токен содержит внешний ключ на юзера (userId)
User.hasMany(Token);
Token.belongsTo(User);

export {
    User,
    Token
}