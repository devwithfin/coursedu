const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('users', {
  email: DataTypes.STRING,
  password: DataTypes.STRING,
  role: DataTypes.STRING,
});

module.exports = User;
