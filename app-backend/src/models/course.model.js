const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');

const Course = sequelize.define(
  'courses',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    teacher_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    status: {
      type: DataTypes.ENUM('active', 'archived'),
      defaultValue: 'active',
    },
    start_date: DataTypes.DATEONLY,
    end_date: DataTypes.DATEONLY,
  },
  {
    timestamps: false,
  }
);

Course.belongsTo(User, { as: 'teacher', foreignKey: 'teacher_id' });

module.exports = Course;