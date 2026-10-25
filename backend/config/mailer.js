const nodemailer = require('nodemailer');

const createTransporter = () => {
  const user = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : '';
  const pass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';

  if (!user || !pass || user === 'your_email@gmail.com' || pass === 'your_email_app_password') {
    return null;
  }

  // Predefined Gmail service configuration
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: user,
      pass: pass,
    },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  if (!transporter) {
    console.warn('\n⚠️ [MAILER WARNING] Real SMTP credentials are not configured in backend/.env!');
    console.warn(`Attempted To: ${to}`);
    console.warn(`Subject: ${subject}`);
    return {
      success: false,
      notConfigured: true,
      error: 'SMTP credentials not configured in backend/.env',
    };
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `College Project Hub <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text: text || '',
      html,
    });
    console.log(`✅ [MAILER SUCCESS] Email dispatched to ${to} (Message ID: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ [MAILER ERROR] Failed to dispatch email to ${to}:`, error.message);
    return { success: false, error: error.message };
  }
};

const verifySMTP = async () => {
  const transporter = createTransporter();
  if (!transporter) return { success: false, error: 'Credentials not configured in backend/.env' };
  try {
    await transporter.verify();
    return { success: true };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

module.exports = { sendEmail, verifySMTP };
