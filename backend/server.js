const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route Mounts
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/academic', require('./routes/academicRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'College Project Hub API',
    timestamp: new Date(),
  });
});

// Seed Teacher endpoint for convenient initial demo setup
app.post('/api/seed-teacher', async (req, res) => {
  try {
    const Teacher = require('./models/Teacher');
    const existing = await Teacher.findOne({ email: 'teacher@college.edu' });
    if (existing) {
      return res.json({
        message: 'Teacher account already seeded.',
        email: 'teacher@college.edu',
        password: 'password123',
      });
    }

    await Teacher.create({
      name: 'Dr. Academic Supervisor',
      email: 'teacher@college.edu',
      password: 'password123',
      department: 'Computer Science & Engineering',
    });

    res.json({
      message: 'Demo teacher seeded successfully.',
      email: 'teacher@college.edu',
      password: 'password123',
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Email Diagnostic Test endpoint
app.get('/api/test-email', async (req, res) => {
  const { verifySMTP, sendEmail } = require('./config/mailer');
  const verifyResult = await verifySMTP();
  if (!verifyResult.success) {
    return res.status(500).json({
      status: 'error',
      message: 'SMTP authentication failed with current credentials',
      details: verifyResult.error,
      currentUser: process.env.EMAIL_USER,
    });
  }

  const targetEmail = req.query.to || process.env.EMAIL_USER;
  const sendResult = await sendEmail({
    to: targetEmail,
    subject: 'Project Hub — SMTP Verification Test',
    html: '<h3>SMTP is working perfectly!</h3><p>Your Project Hub email dispatch service is now active.</p>',
    text: 'SMTP is working perfectly! Your Project Hub email dispatch service is now active.',
  });

  res.json({
    status: sendResult.success ? 'success' : 'failed',
    message: sendResult.success ? `Test email delivered to ${targetEmail}` : 'Sending test email failed',
    details: sendResult,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: err.message || 'An unexpected server error occurred',
  });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`API endpoints accessible at http://localhost:${PORT}/api`);
  });
}

module.exports = app;

