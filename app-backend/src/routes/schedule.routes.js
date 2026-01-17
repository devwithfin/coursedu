const express = require('express');
const scheduleController = require('../controllers/schedule.controller');

const router = express.Router();

router.get('/', scheduleController.getAll);
router.get('/:id', scheduleController.getById);
router.post('/', scheduleController.create);
router.put('/:id', scheduleController.update);
router.delete('/:id', scheduleController.remove);

module.exports = router;
