const Course = require('../models/course');
const { logActivity } = require('../utils/logger');

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.findAll();
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCourseById = async (req, res) => {
    try {
        const course = await Course.findByPk(req.params.id);
        if (course) {
            res.json(course);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCourse = async (req, res) => {
    try {
        const { name, userId } = req.body;
        const course = await Course.create(req.body);
        
        if (userId) {
            await logActivity(userId, `Membuat course baru: ${name || course.id}`);
        }

        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateCourse = async (req, res) => {
    try {
        const { userId, name } = req.body;
        const [updated] = await Course.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedCourse = await Course.findByPk(req.params.id);
            
            if (userId) {
                await logActivity(userId, `Memperbarui course: ${name || updatedCourse.name || req.params.id}`);
            }

            res.status(200).json(updatedCourse);
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteCourse = async (req, res) => {
    try {
        // Note: For delete, we might need userId in query or body if not using auth headers
        const { userId } = req.body; 
        const course = await Course.findByPk(req.params.id);
        const deleted = await Course.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            if (userId && course) {
                await logActivity(userId, `Menghapus course: ${course.name}`);
            }
            res.status(204).json({ message: 'Course deleted' });
        } else {
            res.status(404).json({ message: 'Course not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};

