require('dotenv/config');
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/authRoutes');
const machineRoutes = require('./routes/machineRoutes');
const scheduleRoutes = require('./routes/scheduleRoutes');
const workOrderRoutes = require('./routes/workOrderRoutes');
const historyRoutes = require('./routes/historyRoutes');
const logRoutes = require('./routes/logRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const userRoutes = require('./routes/userRoutes');

const errorHandler = require('./middleware/errorMiddleware');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/machines', machineRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/work-orders', workOrderRoutes);
app.use('/api/history', historyRoutes);
app.use('/api/logs', logRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/users', userRoutes);

app.use(errorHandler);

module.exports = app;
