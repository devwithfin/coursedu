const Enrollment = require('../models/enrollment.model');
const Course = require('../models/course.model');
const User = require('../models/user.model');

exports.getAll = async (req, res) => {
  const { student_id, is_approved } = req.query;
  const whereClause = {};

  if (student_id) whereClause.student_id = student_id;
  if (is_approved === '0' || is_approved === '1') {
    whereClause.is_approved = parseInt(is_approved);
  }

  try {
    const enrollments = await Enrollment.findAll({
      where: whereClause,
      include: [
        {
          model: Course,
          include: [
            {
              model: User,
              as: 'teacher',
              attributes: ['name'],
            },
          ],
        },
        {
          model: User,
          attributes: ['name', 'email'],
        },
      ],
      order: [['id', 'DESC']],
    });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.create = async (req, res) => {
  try {
    const { student_id, course_id } = req.body;

<<<<<<< HEAD
    // Check if enrollment already exists
    const existingEnrollment = await Enrollment.findOne({
      where: {
        student_id: student_id,
        course_id: course_id,
      },
    });

    if (existingEnrollment) {
      return res.status(409).json({ message: 'Enrollment for this course already exists for this student.' });
=======
    const existing = await Enrollment.findOne({
      where: { student_id, course_id },
    });

    if (existing) {
      return res.status(409).json({ message: 'Enrollment already exists' });
>>>>>>> 6fee70e93f1e9ab8dea7aea34eda1d372ab1eee3
    }

    const enrollment = await Enrollment.create({
      student_id,
      course_id,
<<<<<<< HEAD
      is_approved: 0, // Default to 0 (pending approval)
=======
      is_approved: 0,
>>>>>>> 6fee70e93f1e9ab8dea7aea34eda1d372ab1eee3
    });

    res.status(201).json(enrollment);
  } catch (error) {
<<<<<<< HEAD
    res.status(500).json({ message: 'Error creating enrollment', error: error.message });
  }
};
=======
    res.status(500).json({ message: error.message });
  }
};

/* 🔥 APPROVE */
exports.approve = async (req, res) => {
  try {
    const { id } = req.params;

    const enrollment = await Enrollment.findByPk(id);
    if (!enrollment) {
      return res.status(404).json({ message: 'Enrollment not found' });
    }

    enrollment.is_approved = 1;
    await enrollment.save();

    res.json({ message: 'Approved', enrollment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
>>>>>>> 6fee70e93f1e9ab8dea7aea34eda1d372ab1eee3
