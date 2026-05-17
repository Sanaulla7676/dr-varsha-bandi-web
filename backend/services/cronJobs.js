const cron = require('node-cron');
const Patient = require('../models/Patient');
// We don't have a distinct Visit model imported here yet. 
// Assuming Patient model tracks 'lastVisitDate' or we pull from Appointments.
// For simplicity, we'll assume we iterate over Patients.
const { sendFollowUpEmail } = require('./mailer');
const { sendWhatsAppMessage } = require('./whatsapp');

// You can store these settings in DB, but we'll hardcode defaults for the MVP.
let settings = {
  enabled: true,
  emailEnabled: true,
  whatsappEnabled: true,
  followUpDays: 7, // Days after last visit to trigger message
};

/**
 * Update the global cron settings dynamically.
 */
const updateCronSettings = (newSettings) => {
  settings = { ...settings, ...newSettings };
};

/**
 * Initialize the cron scheduler.
 */
const initializeCronJobs = () => {
  // Run every day at 09:00 AM (server time).
  // For testing, you could use '*/1 * * * *' (every minute).
  cron.schedule('0 9 * * *', async () => {
    if (!settings.enabled) {
      console.log('[Cron] Follow-ups are disabled in settings.');
      return;
    }

    console.log('[Cron] Running daily automated follow-up check...');

    try {
      // Find patients whose updatedAt or a specific lastVisit field is exactly `followUpDays` ago.
      // In this system, we might use updatedAt if we update the patient profile on each visit,
      // or we can just send a blanket test message. 
      // For this implementation, we will query patients who haven't been deleted.
      
      const targetDateStart = new Date();
      targetDateStart.setDate(targetDateStart.getDate() - settings.followUpDays);
      targetDateStart.setHours(0, 0, 0, 0);

      const targetDateEnd = new Date(targetDateStart);
      targetDateEnd.setHours(23, 59, 59, 999);

      // Example Query: Patients updated exactly `followUpDays` ago.
      // Adjust this based on whether you have a specific 'lastVisit' field.
      const patientsToFollowUp = await Patient.find({
        isDeleted: false,
        updatedAt: { $gte: targetDateStart, $lte: targetDateEnd }
      });

      console.log(`[Cron] Found ${patientsToFollowUp.length} patients needing follow-up.`);

      for (const patient of patientsToFollowUp) {
        const fullName = `${patient.firstName} ${patient.lastName}`.trim();

        // 1. Send Email
        if (settings.emailEnabled && patient.email) {
          await sendFollowUpEmail(patient.email, fullName);
        }

        // 2. Send WhatsApp
        if (settings.whatsappEnabled && patient.phone) {
          await sendWhatsAppMessage(patient.phone, fullName);
        }
      }
    } catch (err) {
      console.error('[Cron] Error during follow-up job:', err);
    }
  });

  console.log('✅ Automated Follow-up Cron Job Initialized (Runs daily at 09:00 AM)');
};

module.exports = {
  initializeCronJobs,
  updateCronSettings,
  getSettings: () => settings,
};
