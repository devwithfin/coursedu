const Schedule = require('../models/schedule.model');

exports.getAll = async (req, res) => {
  const schedules = await Schedule.findAll();
  res.json(schedules);
};

exports.getById = async (req, res) => {
  const schedule = await Schedule.findByPk(req.params.id);
  if (!schedule) {
    return res.status(404).json({ message: 'Schedule not found' });
  }
  res.json(schedule);
};

exports.getByCourseId = async (req, res) => {
  const schedules = await Schedule.findAll({
    where: { course_id: req.params.course_id },
  });
  res.json(schedules);
};

exports.create = async (req, res) => {
  const {
    course_id,
    session_topic,
    session_date,
    location,
  } = req.body;

  const schedule = await Schedule.create({
    course_id,
    session_topic,
    session_date,
    location,
  });

  res.status(201).json(schedule);
};

exports.update = async (req, res) => {
  const schedule = await Schedule.findByPk(req.params.id);
  if (!schedule) {
    return res.status(404).json({ message: 'Schedule not found' });
  }

  const {
    course_id,
    session_topic,
    session_date,
    location,
  } = req.body;

  schedule.course_id = course_id ?? schedule.course_id;
  schedule.session_topic = session_topic ?? schedule.session_topic;
  schedule.session_date = session_date ?? schedule.session_date;
  schedule.location = location ?? schedule.location;

  await schedule.save();

  res.json({ message: 'Schedule updated' });
};

exports.remove = async (req, res) => {
  const schedule = await Schedule.findByPk(req.params.id);
  if (!schedule) {
    return res.status(404).json({ message: 'Schedule not found' });
  }

  await schedule.destroy();
  res.json({ message: 'Schedule deleted' });
};
