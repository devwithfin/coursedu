const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Enrollment = sequelize.define(
  'enrollments',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: DataTypes.INTEGER,
    course_id: DataTypes.INTEGER,
    is_approved: {
      type: DataTypes.TINYINT,
      defaultValue: 0,  
    },
    enrolled_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: false,
  }
);

module.exports = Enrollment;
