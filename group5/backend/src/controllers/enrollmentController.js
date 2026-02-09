const Enrollment = require('../models/enrollment');

const getAllEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.findAll();
        res.json(enrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getEnrollmentById = async (req, res) => {
    try {
        const enrollment = await Enrollment.findByPk(req.params.id);
        if (enrollment) {
            res.json(enrollment);
        } else {
            res.status(404).json({ message: 'Enrollment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.create(req.body);
        res.status(201).json(enrollment);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateEnrollment = async (req, res) => {
    try {
        const [updated] = await Enrollment.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedEnrollment = await Enrollment.findByPk(req.params.id);
            res.status(200).json(updatedEnrollment);
        } else {
            res.status(404).json({ message: 'Enrollment not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteEnrollment = async (req, res) => {
    try {
        const deleted = await Enrollment.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).json({ message: 'Enrollment deleted' });
        } else {
            res.status(404).json({ message: 'Enrollment not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getPendingEnrollments = async (req, res) => {
    try {
        const pendingEnrollments = await Enrollment.findAll({
            where: { is_approved: 0 }
        });
        res.json(pendingEnrollments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment,
    getPendingEnrollments
};

