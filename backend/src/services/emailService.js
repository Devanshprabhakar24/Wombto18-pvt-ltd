const nodemailer = require('nodemailer');
const env = require('../config/env');

const transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_PORT === 465,
    auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,                
    },
});

/**
 * Send an email
 * @param {Object} options - { to, subject, text, html }
 */
async function sendMail({ to, subject, text, html }) {
    return transporter.sendMail({
        from: env.SMTP_FROM,
        to,
        subject,
        text,
        html,
    });
}

module.exports = { sendMail };
