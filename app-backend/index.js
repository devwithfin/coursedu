const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./src/config/db');
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');


const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/users', userRoutes);


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
