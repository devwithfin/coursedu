const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./src/config/db');

const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const courseRoutes = require('./src/routes/course.routes');
const enrollmentRoutes = require('./src/routes/enrollment.routes');
const scheduleRoutes = require('./src/routes/schedule.routes');


const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/courses', courseRoutes);
app.use('/enrollments', enrollmentRoutes);
app.use('/schedules', scheduleRoutes);

sequelize.authenticate()
  .then(() => {
    console.log('MySQL connected');

    app.listen(process.env.PORT, () => {
      console.log(`API running on http://localhost:${process.env.PORT}`);
    });
  })
  .catch(err => {
    console.error('DB connection error:', err.message);
  });
