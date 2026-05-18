const cron = require('node-cron');
const Appointment = require('../models/Appointment');
const { sendFollowUpEmail } = require('./mailer');
const { sendWhatsAppMessage } = require('./whatsapp');

let settings = {
  enabled: true,
  emailEnabled: true,
  whatsappEnabled: true,
};

const updateCronSettings = (newSettings) => {
  settings = { ...settings, ...newSettings };
};

const initializeCronJobs = () => {
  // Run every day at 09:00 AM (server time).
  cron.schedule('0 9 * * *', async () => {
    if (!settings.enabled) {
      console.log('[Cron] Follow-ups are disabled in settings.');
      return;
    }

    console.log('[Cron] Running daily automated follow-up check...');

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      // Utility function to get date range for a specific day offset
      const getDateRange = (daysOffset) => {
        const start = new Date(today);
        start.setDate(today.getDate() + daysOffset);
        
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);
        
        return { $gte: start, $lte: end };
      };

      // 1. Reminders for 2 days before
      const in2DaysRange = getDateRange(2);
      const appts2Days = await Appointment.find({
        appointmentDate: in2DaysRange,
        status: { $in: ['Pending', 'Confirmed'] }
      }).populate('patientId');

      for (const apt of appts2Days) {
        if (!apt.patientId) continue;
        const patient = apt.patientId;
        const fullName = `${patient.firstName} ${patient.lastName}`.trim();
        const dateStr = apt.appointmentDate.toDateString();
        
        if (settings.whatsappEnabled && patient.phone) {
          const msg = `*Hello ${fullName}*, \n\nThis is a reminder from Homeopathway Clinic. You have an upcoming consultation in 2 days on ${dateStr} at ${apt.appointmentTime}.`;
          await sendWhatsAppMessage(patient.phone, fullName, msg);
        }
      }

      // 2. Reminders for 1 day before
      const in1DayRange = getDateRange(1);
      const appts1Day = await Appointment.find({
        appointmentDate: in1DayRange,
        status: { $in: ['Pending', 'Confirmed'] }
      }).populate('patientId');

      for (const apt of appts1Day) {
        if (!apt.patientId) continue;
        const patient = apt.patientId;
        const fullName = `${patient.firstName} ${patient.lastName}`.trim();
        const dateStr = apt.appointmentDate.toDateString();
        
        if (settings.whatsappEnabled && patient.phone) {
          const msg = `*Hello ${fullName}*, \n\nThis is a reminder from Homeopathway Clinic. You have a consultation tomorrow, ${dateStr} at ${apt.appointmentTime}. Please reply to confirm.`;
          await sendWhatsAppMessage(patient.phone, fullName, msg);
        }
      }

      // 3. Reminders for today (Same Day)
      const todayRange = getDateRange(0);
      const apptsToday = await Appointment.find({
        appointmentDate: todayRange,
        status: { $in: ['Pending', 'Confirmed'] }
      }).populate('patientId');

      for (const apt of apptsToday) {
        if (!apt.patientId) continue;
        const patient = apt.patientId;
        const fullName = `${patient.firstName} ${patient.lastName}`.trim();
        
        if (settings.whatsappEnabled && patient.phone) {
          const msg = `*Hello ${fullName}*, \n\nYour consultation at Homeopathway Clinic is scheduled for TODAY at ${apt.appointmentTime}. We look forward to seeing you!`;
          await sendWhatsAppMessage(patient.phone, fullName, msg);
        }
      }

      console.log(`[Cron] Processed ${appts2Days.length + appts1Day.length + apptsToday.length} reminders.`);
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
