const express = require('express');
const enrollmentController = require('../controllers/enrollment.controller');

const router = express.Router();

router.get('/', enrollmentController.getAll);
router.get('/:id', enrollmentController.getById);
router.post('/', enrollmentController.create);
router.put('/:id', enrollmentController.update);
router.delete('/:id', enrollmentController.remove);
router.put('/:id/approve', enrollmentController.approve);

module.exports = router;
