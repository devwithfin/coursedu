const UserLog = require('../models/log');

/**
 * Logs a user activity to the database.
 * @param {number} userId - The ID of the user performing the action.
 * @param {string} activity - Description of the activity.
 */
const logActivity = async (userId, activity) => {
  try {
    if (!userId) {
      console.warn('Attempted to log activity without userId:', activity);
      return;
    }
    await UserLog.create({
      user_id: userId,
      activity: activity,
      activity_time: new Date()
    });
  } catch (error) {
    console.error('Failed to log activity:', error.message);
  }
};

module.exports = { logActivity };
