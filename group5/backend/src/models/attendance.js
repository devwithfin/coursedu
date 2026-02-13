const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Schedule = require('./schedule');
const User = require('./user');

const Attendance = sequelize.define('Attendance', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  schedule_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Schedule,
      key: 'id',
    },
  },
  student_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  status: {
    type: DataTypes.ENUM('present', 'absent', 'late'),
    allowNull: false,
  },
  recorded_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'attendances',
  timestamps: false,
});

Attendance.belongsTo(User, { as: 'Student', foreignKey: 'student_id' });
Attendance.belongsTo(Schedule, { foreignKey: 'schedule_id' });

module.exports = Attendance;

