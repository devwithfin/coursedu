const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Enrollment = sequelize.define('Enrollment', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    student_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    is_approved: {
        type: DataTypes.INTEGER(1),
        allowNull: false
    },
    enrolled_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'enrollments',
    timestamps: false
});

module.exports = Enrollment;
