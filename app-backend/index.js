const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sequelize = require('./config/db');
const authRoutes = require('./routes/auth.routes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);

sequelize.sync().then(() => {
  console.log('DB connected');

  app.listen(process.env.PORT, () => {
    console.log('API running on port', process.env.PORT);
  });
});
