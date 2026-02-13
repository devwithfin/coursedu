require('dotenv').config();

const cors = require('cors');
const express = require('express');

const sequelize = require('./src/config/db');
const adminRoutes = require('./src/routes/admin.routes');
const authRoutes = require('./src/routes/auth.routes');
const courseRoutes = require('./src/routes/course.routes');
const enrollmentRoutes = require('./src/routes/enrollment.routes');
const materialRoutes = require('./src/routes/material.routes');
const scheduleRoutes = require('./src/routes/schedule.routes');
const userRoutes = require('./src/routes/user.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/courses', courseRoutes);
app.use('/enrollments', enrollmentRoutes);
app.use('/materials', materialRoutes);
app.use('/schedules', scheduleRoutes);
app.use('/users', userRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connection established');

    app.listen(PORT, () => {
      console.log(`🚀 Group1 backend listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
    process.exit(1);
  }
}

start();

module.exports = app;
