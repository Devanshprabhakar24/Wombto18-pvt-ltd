require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');
const healthRoutes = require('./routes/healthRoutes');
const vaccineRoutes = require('./routes/vaccineRoutes');
const adminRoutes = require('./routes/adminRoutes');
const parentRoutes = require('./routes/parentRoutes');
const childRoutes = require('./routes/childRoutes');
const impactRoutes = require('./routes/impactRoutes');
const connectDB = require('./config/db');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/vaccines', vaccineRoutes);
app.use('/api/children', childRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use(notFound);
// Error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
