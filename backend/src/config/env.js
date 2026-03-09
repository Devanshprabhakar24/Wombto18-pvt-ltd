require('dotenv').config();

module.exports = {
    PORT: process.env.PORT || 5000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/wombto18',
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret_change_me',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    SMTP_HOST: process.env.SMTP_HOST || 'smtp.example.com',
    SMTP_PORT: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
    SMTP_USER: process.env.SMTP_USER || '',
    SMTP_PASS: process.env.SMTP_PASS || '',
    SMTP_FROM: process.env.SMTP_FROM || 'noreply@wombto18.com',
    CORS_ORIGINS: process.env.CORS_ORIGINS || '',
    ADMIN_ALLOWED_IPS: process.env.ADMIN_ALLOWED_IPS || '',
};
