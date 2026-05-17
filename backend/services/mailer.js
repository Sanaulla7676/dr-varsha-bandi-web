const nodemailer = require('nodemailer');

// Initialize Nodemailer transporter
// Note: We use a generic fallback for testing, but in production,
// standard environment variables (EMAIL_USER, EMAIL_PASS) should be set.
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'demo.homeopathway@gmail.com', // Replace with real email
    pass: process.env.EMAIL_PASS || 'dummy-password', // Replace with app password
  },
});

/**
 * Send an automated follow-up email.
 * @param {string} patientEmail - The patient's email address
 * @param {string} patientName - The patient's full name
 * @param {string} customMessage - Optional custom message body
 */
const sendFollowUpEmail = async (patientEmail, patientName, customMessage = null) => {
  if (!patientEmail) return false;

  const defaultMessage = `Hello ${patientName},\n\nDr. Bandi from Homeopathway Clinic is checking in on your progress. How have you been feeling since your last visit? If you need to schedule another consultation, please reply to this email or contact the clinic.\n\nWarm regards,\nHomeopathway Clinic`;
  
  const textBody = customMessage || defaultMessage;

  try {
    const info = await transporter.sendMail({
      from: '"Homeopathway Clinic" <demo.homeopathway@gmail.com>',
      to: patientEmail,
      subject: 'Follow-up from Homeopathway Clinic',
      text: textBody,
    });
    console.log(`[Email] Follow-up sent to ${patientEmail}: ${info.messageId}`);
    return true;
  } catch (error) {
    console.error(`[Email Error] Failed to send email to ${patientEmail}:`, error.message);
    return false;
  }
};

module.exports = {
  sendFollowUpEmail,
};
