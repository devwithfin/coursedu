const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Course = require('./course.model'); // Assuming course.model.js exists or will be created
const User = require('./user.model');

const Enrollment = sequelize.define(
  'enrollments',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id',
      },
    },
    course_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Course,
        key: 'id',
      },
    },
    is_approved: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    enrolled_at: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: false,
  }
);

Enrollment.belongsTo(Course, { foreignKey: 'course_id' });
Enrollment.belongsTo(User, { foreignKey: 'student_id' });

module.exports = Enrollment;