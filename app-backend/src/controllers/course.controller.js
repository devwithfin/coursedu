const Course = require('../models/course.model');
exports.getAll = async (req, res) => {
  const courses = await Course.findAll();
  res.json(courses);
};

exports.getById = async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }
  res.json(course);
};

exports.create = async (req, res) => {
  const {
    title,
    description,
    teacher_id,
    status,
    start_date,
    end_date,
  } = req.body;

  const course = await Course.create({
    title,
    description,
    teacher_id,
    status,
    start_date,
    end_date,
  });

  res.status(201).json(course);
};

exports.update = async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  const {
    title,
    description,
    teacher_id,
    status,
    start_date,
    end_date,
  } = req.body;

  course.title = title ?? course.title;
  course.description = description ?? course.description;
  course.teacher_id = teacher_id ?? course.teacher_id;
  course.status = status ?? course.status;
  course.start_date = start_date ?? course.start_date;
  course.end_date = end_date ?? course.end_date;

  await course.save();

  res.json({ message: 'Course updated' });
};

exports.remove = async (req, res) => {
  const course = await Course.findByPk(req.params.id);
  if (!course) {
    return res.status(404).json({ message: 'Course not found' });
  }

  await course.destroy();
  res.json({ message: 'Course deleted' });
};
