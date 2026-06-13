const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Visit = require('../models/Visit');
const { authenticateToken } = require('../middleware/auth');

// GET /api/dashboard/stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const doctorId = req.user.id;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const [
      totalPatients,
      todayAppointments,
      pendingFollowUps,
      upcomingVideoConsultations,
      recentPatients,
      upcomingAppointments,
    ] = await Promise.all([
      Patient.countDocuments({ isDeleted: false }),
      Appointment.countDocuments({ doctorId, appointmentDate: { $gte: today, $lt: tomorrow } }),
      Visit.countDocuments({ doctorId, followUpStatus: 'Pending', followUpDate: { $lte: new Date() } }),
      Appointment.countDocuments({ doctorId, type: 'Video', appointmentDate: { $gte: new Date() }, status: { $in: ['Pending', 'Confirmed'] } }),
      Patient.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(5).select('firstName lastName phone lastVisitDate status patientId'),
      Appointment.find({ doctorId, appointmentDate: { $gte: today }, status: { $in: ['Pending', 'Confirmed'] } })
        .populate('patientId', 'firstName lastName phone')
        .sort({ appointmentDate: 1, appointmentTime: 1 })
        .limit(5),
    ]);

    res.json({
      totalPatients,
      todayAppointments,
      pendingFollowUps,
      upcomingVideoConsultations,
      recentPatients,
      upcomingAppointments,
    });
  } catch (err) {
    console.error('Dashboard Stats Error:', err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
});

module.exports = router;
