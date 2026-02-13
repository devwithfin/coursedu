const express = require('express');
const router = express.Router();
const {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
    getPendingEnrollments
} = require('../controllers/enrollmentController');

router.get('/enrollments', getAllEnrollments);
router.get('/enrollments/pending', getPendingEnrollments);  
router.get('/enrollments/:id', getEnrollmentById);
router.post('/enrollments', createEnrollment);
router.put('/enrollments/:id', updateEnrollment);
router.delete('/enrollments/:id', deleteEnrollment);

module.exports = router;

