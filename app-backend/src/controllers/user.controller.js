const User = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.getAll = async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
  });
  res.json(users);
};

exports.getById = async (req, res) => {
  const user = await User.findByPk(req.params.id, {
    attributes: { exclude: ['password'] },
  });

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
};

exports.create = async (req, res) => {
  const { name, email, password, role, status } = req.body;

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hash,
    role,
    status,
  });

  res.status(201).json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  });
};

exports.update = async (req, res) => {
  const { name, email, password, role, status } = req.body;

  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  user.name = name ?? user.name;
  user.email = email ?? user.email;
  user.role = role ?? user.role;
  user.status = status ?? user.status;

  await user.save();

  res.json({ message: 'User updated' });
};


exports.remove = async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  await user.destroy();
  res.json({ message: 'User deleted' });
};
