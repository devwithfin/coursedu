const express = require('express');
const router = express.Router();
const { getAllUsers, createUser, loginUser, logoutUser } = require('../controllers/userController');

router.get('/users', getAllUsers);
router.post('/users', createUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);

module.exports = router;

