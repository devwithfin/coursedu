const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Schedule = sequelize.define(
  'schedules',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    course_id: {
      type: DataTypes.INTEGER,
    },
    session_topic: {
      type: DataTypes.STRING(255),
    },
    session_date: {
      type: DataTypes.DATE,  
    },
    location: {
      type: DataTypes.STRING(100),
    },
  },
  {
    timestamps: false,  
  }
);

module.exports = Schedule;
