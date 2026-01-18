const express = require('express');
const enrollmentController = require('../controllers/enrollment.controller');

const router = express.Router();

router.get('/', enrollmentController.getAll);
router.post('/', enrollmentController.create);

module.exports = router;