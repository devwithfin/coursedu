const Enrollment = require('../models/enrollment.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');

exports.getAll = async (req, res) => {
  const { student_id, is_approved, limit, orderBy } = req.query;
  const whereClause = {};
  const findOptions = {};

  if (student_id) {
    whereClause.student_id = student_id;
  }

  if (is_approved) {
    whereClause.is_approved = is_approved;
  }

  if (limit) {
    findOptions.limit = parseInt(limit, 10);
  }

  if (orderBy) {
    const [field, direction] = orderBy.split(',');
    if (field && (direction === 'ASC' || direction === 'DESC')) {
      findOptions.order = [[field, direction]];
    }
  }

  try {
    const enrollments = await Enrollment.findAll({
      where: whereClause,
      ...findOptions, // Spread the limit and order options
      include: [
        {
          model: Course,
          include: [
            {
              model: User,
              as: 'teacher',
              attributes: ['name'], // Only get the teacher's name
            },
          ],
        },
      ],
    });
    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching enrollments', error: error.message });
  }
};