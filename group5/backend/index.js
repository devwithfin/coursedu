const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./src/config/database');
const userRoutes = require('./src/routes/userRoutes');
const courseRoutes = require('./src/routes/courseRoutes');
const scheduleRoutes = require('./src/routes/scheduleRoutes');
const enrollmentRoutes = require('./src/routes/enrollmentRoutes');
const managerRoutes = require('./src/routes/managerRoutes');
const logRoutes = require('./src/routes/logRoutes');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

app.use('/api', userRoutes);
app.use('/api', courseRoutes);
app.use('/api', scheduleRoutes);
app.use('/api', enrollmentRoutes);
app.use('/api/manager', managerRoutes);
app.use('/api/logs', logRoutes);

sequelize.authenticate()
    .then(() => {
        console.log('Database connection has been established successfully.');
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

