const UserLog = require('../models/log');
const User = require('../models/user');

const getAllLogs = async (req, res) => {
  try {
    const logs = await UserLog.findAll({
      include: {
        model: User,
        attributes: ['name'],  
      },
      order: [['activity_time', 'DESC']], 
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user logs', error: error.message });
  }
};

const getLogsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    const logs = await UserLog.findAll({
      where: { user_id: userId },
      include: {
        model: User,
        attributes: ['name'],
      },
      order: [['activity_time', 'DESC']],
    });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs for user', error: error.message });
  }
};

module.exports = {
  getAllLogs,
  getLogsByUserId,
};

