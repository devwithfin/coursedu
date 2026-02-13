const express = require('express');
const router = express.Router();
const {
    getAllSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule
} = require('../controllers/scheduleController');

router.get('/schedules', getAllSchedules);
router.get('/schedules/:id', getScheduleById);
router.post('/schedules', createSchedule);
router.put('/schedules/:id', updateSchedule);
router.delete('/schedules/:id', deleteSchedule);

module.exports = router;

