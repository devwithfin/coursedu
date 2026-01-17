const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Course = require('./course.model');

const Material = sequelize.define(
  'materials',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    course_id: {
      type: DataTypes.INTEGER,
      references: {
        model: Course,
        key: 'id',
      },
    },
    title: DataTypes.STRING,
    content: DataTypes.TEXT,
    file_path: DataTypes.STRING,
    uploaded_at: {
      type: DataTypes.DATE,
    },
  },
  {
    timestamps: false,
  }
);

Material.belongsTo(Course, { foreignKey: 'course_id' });

module.exports = Material;