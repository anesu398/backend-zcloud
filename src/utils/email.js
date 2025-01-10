const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.sendVerificationEmail = async (email) => {
  const verificationLink = `${process.env.FRONTEND_URL}/verify-email?email=${email}`;
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: 'Verify Your Email',
    html: `<p>Click <a href="${verificationLink}">here</a> to verify your email.</p>`,
  });
};

exports.sendPasswordResetEmail = async (email) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?email=${email}`;
  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: 'Password Reset',
    html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
  });
};
