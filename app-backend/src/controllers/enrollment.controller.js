const Enrollment = require('../models/enrollment.model');

exports.getAll = async (req, res) => {
  const enrollments = await Enrollment.findAll();
  res.json(enrollments);
};

exports.getById = async (req, res) => {
  const enrollment = await Enrollment.findByPk(req.params.id);
  if (!enrollment) {
    return res.status(404).json({ message: 'Enrollment not found' });
  }
  res.json(enrollment);
};

exports.create = async (req, res) => {
  const { student_id, course_id } = req.body;

  const enrollment = await Enrollment.create({
    student_id,
    course_id,
    is_approved: 0,
  });

  res.status(201).json(enrollment);
};

exports.update = async (req, res) => {
  const enrollment = await Enrollment.findByPk(req.params.id);
  if (!enrollment) {
    return res.status(404).json({ message: 'Enrollment not found' });
  }

  const { student_id, course_id } = req.body;

  enrollment.student_id = student_id ?? enrollment.student_id;
  enrollment.course_id = course_id ?? enrollment.course_id;

  await enrollment.save();

  res.json({ message: 'Enrollment updated' });
};

exports.remove = async (req, res) => {
  const enrollment = await Enrollment.findByPk(req.params.id);
  if (!enrollment) {
    return res.status(404).json({ message: 'Enrollment not found' });
  }

  await enrollment.destroy();
  res.json({ message: 'Enrollment deleted' });
};

exports.approve = async (req, res) => {
  const enrollment = await Enrollment.findByPk(req.params.id);
  if (!enrollment) {
    return res.status(404).json({ message: 'Enrollment not found' });
  }

  enrollment.is_approved = 1;
  await enrollment.save();

  res.json({ message: 'Enrollment approved' });
};
