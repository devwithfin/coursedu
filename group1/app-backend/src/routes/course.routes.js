const express = require('express');
const courseController = require('../controllers/course.controller');

const router = express.Router();

router.get('/', courseController.getAll);
router.get('/:id', courseController.getById);
router.post('/', courseController.create);
router.put('/:id', courseController.update);
router.delete('/:id', courseController.remove);

module.exports = router;
