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

    const existing = await Enrollment.findOne({
      where: { student_id, course_id },
    });

    if (existing) {
      return res.status(409).json({ message: 'Enrollment already exists' });
    }

    const enrollment = await Enrollment.create({
      student_id,
      course_id,
      is_approved: 0,
    });

    res.status(201).json(enrollment);
  } catch (error) {
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