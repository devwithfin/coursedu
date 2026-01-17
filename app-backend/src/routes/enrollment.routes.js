const express = require('express');
const enrollmentController = require('../controllers/enrollment.controller');

const router = express.Router();

router.get('/', enrollmentController.getAll);

module.exports = router;