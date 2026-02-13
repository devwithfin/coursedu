const Course = require('../models/course');
const User = require('../models/user');
const Attendance = require('../models/attendance');
const sequelize = require('../config/database');
const { Sequelize } = require('sequelize');

const getDashboardStats = async (req, res) => {
  try {
    const courseCount = await Course.count();
    const studentCount = await User.count({ where: { role: 'student' } });
    const teacherCount = await User.count({ where: { role: 'teacher' } });

    const classAverages = await sequelize.query(`
      SELECT 
        course_title, 
        AVG(average_score) as class_avg 
      FROM student_scores 
      GROUP BY course_id
      LIMIT 5
    `, { type: Sequelize.QueryTypes.SELECT });

    const attendanceStats = await sequelize.query(`
      SELECT 
        status, 
        COUNT(*) as count 
      FROM attendances 
      GROUP BY status
    `, { type: Sequelize.QueryTypes.SELECT });

    res.json({
      courses: courseCount,
      students: studentCount,
      teachers: teacherCount,
      classAverages,
      attendanceStats
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

const getAttendanceSummary = async (req, res) => {
  try {
    const summary = await sequelize.query(`
      SELECT 
        a.student_id,
        u.name,
        u.email,
        COUNT(a.id) as total_sessions,
        SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) as present_count,
        SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) as absent_count,
        SUM(CASE WHEN a.status = 'late' THEN 1 ELSE 0 END) as late_count
      FROM attendances a
      JOIN users u ON a.student_id = u.id
      GROUP BY a.student_id, u.name, u.email
    `, { type: Sequelize.QueryTypes.SELECT });

    const formattedSummary = summary.map(item => ({
      student_id: item.student_id,
      total_sessions: item.total_sessions,
      present_count: item.present_count,
      absent_count: item.absent_count,
      late_count: item.late_count,
      Student: {
        name: item.name,
        email: item.email
      }
    }));

    res.json(formattedSummary);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching attendance summary', error: error.message });
  }
};

const getGradeSummary = async (req, res) => {
  try {
    const classAverages = await sequelize.query(`
      SELECT 
        course_title, 
        AVG(average_score) as class_avg 
      FROM student_scores 
      GROUP BY course_id
    `, { type: Sequelize.QueryTypes.SELECT });

    const studentGrades = await sequelize.query(`
      SELECT * FROM student_scores
    `, { type: Sequelize.QueryTypes.SELECT });

    res.json({
      classAverages,
      studentGrades
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching grade summary', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAttendanceSummary,
  getGradeSummary
};

