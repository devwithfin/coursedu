const express = require('express');
const router = express.Router();
const { getDashboardStats, getAttendanceSummary, getGradeSummary } = require('../controllers/managerController');

router.get('/dashboard-stats', getDashboardStats);
router.get('/attendance-summary', getAttendanceSummary);
router.get('/grade-summary', getGradeSummary);

module.exports = router;

