const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const { rateLimiter } = require('./middleware/rateLimiter');
const { NODE_ENV } = require('./config/env');

// Routes
const authRoutes = require('./routes/authRoutes');
const parentRoutes = require('./routes/parentRoutes');
const childRoutes = require('./routes/childRoutes');
const vaccineRoutes = require('./routes/vaccineRoutes');
const reminderRoutes = require('./routes/reminderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const impactRoutes = require('./routes/impactRoutes');
const maternalRoutes = require('./routes/maternalRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const partnerRoutes = require('./routes/partnerRoutes');
const goGreenRoutes = require('./routes/goGreenRoutes');

const app = express();

// Disable X-Powered-By header
app.disable('x-powered-by');

// CORS — must be before any other middleware that might respond
app.use(cors());

// HTTPS redirect in production (skip for localhost / 127.0.0.1)
if (NODE_ENV === 'production') {
    app.use((req, res, next) => {
        const host = req.headers.host || '';
        const isLocal = host.startsWith('localhost') || host.startsWith('127.0.0.1');
        if (!isLocal && req.headers['x-forwarded-proto'] !== 'https') {
            return res.redirect(301, `https://${host}${req.url}`);
        }
        next();
    });
}

app.use(express.json({ limit: '1mb' }));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
if (NODE_ENV === 'production') {
    app.use(rateLimiter());
}

// Health check
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', message: 'WombTo18 API is healthy' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/parents', parentRoutes);
app.use('/api/children', childRoutes);
app.use('/api/vaccines', vaccineRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/impact', impactRoutes);
app.use('/api/maternal', maternalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/partners', partnerRoutes);
app.use('/api/go-green', goGreenRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
