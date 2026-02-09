const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Schedule = sequelize.define('Schedule', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    course_id: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    session_topic: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    session_date: {
        type: DataTypes.DATE,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING(100),
        allowNull: true
    }
}, {
    tableName: 'schedules',
    timestamps: false
});

module.exports = Schedule;
