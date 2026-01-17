const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Course = sequelize.define(
  'courses',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING(200),
    },
    description: {
      type: DataTypes.TEXT,
    },
    teacher_id: {
      type: DataTypes.INTEGER,
    },
    status: {
      type: DataTypes.ENUM('active', 'archived'),
      defaultValue: 'active',
    },
    start_date: {
      type: DataTypes.DATEONLY,
    },
    end_date: {
      type: DataTypes.DATEONLY,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Course;
