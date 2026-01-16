const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }

  if (user.status !== 'active') {
    return res.status(403).json({ message: 'User inactive' });
  }

if (password !== user.password) {
  return res.status(401).json({ message: 'Wrong password' });
}

  const token = jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

exports.logout = async (req, res) => {
  return res.json({
    message: 'Logout success',
  });
};
