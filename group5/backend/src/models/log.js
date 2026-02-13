const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const UserLog = sequelize.define('UserLog', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  activity: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  activity_time: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'user_logs',
  timestamps: false,  
});

UserLog.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(UserLog, { foreignKey: 'user_id' });

module.exports = UserLog;

