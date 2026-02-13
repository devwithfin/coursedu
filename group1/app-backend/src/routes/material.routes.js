const express = require('express');
const materialController = require('../controllers/material.controller');

const router = express.Router();

router.get('/', materialController.getAll);
router.get('/:id', materialController.getById);

module.exports = router;