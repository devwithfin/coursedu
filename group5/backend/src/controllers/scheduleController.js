const Schedule = require('../models/schedule');

const getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.findAll();
        res.json(schedules);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getScheduleById = async (req, res) => {
    try {
        const schedule = await Schedule.findByPk(req.params.id);
        if (schedule) {
            res.json(schedule);
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.create(req.body);
        res.status(201).json(schedule);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateSchedule = async (req, res) => {
    try {
        const [updated] = await Schedule.update(req.body, {
            where: { id: req.params.id }
        });
        if (updated) {
            const updatedSchedule = await Schedule.findByPk(req.params.id);
            res.status(200).json(updatedSchedule);
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteSchedule = async (req, res) => {
    try {
        const deleted = await Schedule.destroy({
            where: { id: req.params.id }
        });
        if (deleted) {
            res.status(204).json({ message: 'Schedule deleted' });
        } else {
            res.status(404).json({ message: 'Schedule not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule
};

