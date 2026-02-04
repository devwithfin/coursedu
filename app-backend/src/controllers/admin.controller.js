const User = require('../models/user.model');
const Course = require('../models/course.model');
const Enrollment = require('../models/enrollment.model');

exports.getStats = async (req, res) => {
  try {
    const studentCount = await User.count({ where: { role: 'student' } });
    const teacherCount = await User.count({ where: { role: 'teacher' } });
    const courseCount = await Course.count();
    const pendingApprovalCount = await Enrollment.count({ where: { is_approved: 0 } });

    res.json({
      students: studentCount,
      teachers: teacherCount,
      courses: courseCount,
      pendingApproval: pendingApprovalCount,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
