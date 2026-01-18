const Enrollment = require('../models/enrollment.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');

exports.getAll = async (req, res) => {
  const { student_id, is_approved, limit, orderBy } = req.query;
  const whereClause = {};
  const findOptions = {
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
  };

  console.log('Enrollment getAll req.query:', req.query); // Debugging line

  if (student_id) {
    whereClause.student_id = student_id;
  }

  // Only apply is_approved filter if it's explicitly 0 or 1
  if (is_approved === '0' || is_approved === '1') {
    whereClause.is_approved = parseInt(is_approved, 10);
  }

  if (limit) {
    const parsedLimit = parseInt(limit, 10);
    if (!isNaN(parsedLimit)) {
      findOptions.limit = parsedLimit;
    }
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
    });
    res.json(enrollments);
  } catch (error) {
    console.error('Error fetching enrollments in backend:', error); // Debugging line
    res.status(500).json({ message: 'Error fetching enrollments', error: error.message });
  }
};

exports.create = async (req, res) => {
    try {
        const { student_id, course_id } = req.body;

        // Check if enrollment already exists
        const existingEnrollment = await Enrollment.findOne({
            where: {
                student_id: student_id,
                course_id: course_id,
            },
        });

        if (existingEnrollment) {
            return res.status(409).json({ message: 'Enrollment for this course already exists for this student.' });
        }

        const enrollment = await Enrollment.create({
            student_id,
            course_id,
            is_approved: 0, // Default to 0 (pending approval)
        });

        res.status(201).json(enrollment);
    } catch (error) {
        res.status(500).json({ message: 'Error creating enrollment', error: error.message });
    }
};