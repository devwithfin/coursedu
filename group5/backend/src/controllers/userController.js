const User = require('../models/user');
const { logActivity } = require('../utils/logger');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, email, password, role, status, adminId } = req.body;
        const user = await User.create({ name, email, password, role, status });
        
        // Log activity
        if (adminId) {
            await logActivity(adminId, `Menambahkan user baru: ${name} (${role})`);
        }

        res.status(201).json(user);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (password !== user.password) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Log login activity
        await logActivity(user.id, `User login ke sistem`);

        res.json({ message: 'Login successful', role: user.role, id: user.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = async (req, res) => {
    try {
        const { userId } = req.body;
        if (userId) {
            await logActivity(userId, `User logout dari sistem`);
        }
        res.json({ message: 'Logout successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    createUser,
    loginUser,
    logoutUser
};

