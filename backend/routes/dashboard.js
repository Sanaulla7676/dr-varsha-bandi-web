const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Visit = require('../models/Visit');
const Doctor = require('../models/Doctor');
const { authenticateToken } = require('../middleware/auth');

// GET /api/dashboard/stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    // Resolve the REAL doctor ObjectId(s) to query against.
    // Public bookings store the actual doctor._id, but the JWT may carry
    // a different id (e.g. the mock '000000000000000000000000').
    // We build a list of all possible doctorIds so nothing slips through.
    const doctorIds = [];

    // 1. The id from the JWT
    if (mongoose.Types.ObjectId.isValid(req.user.id)) {
      doctorIds.push(new mongoose.Types.ObjectId(req.user.id));
    }

    // 2. Look up the real doctor by email (the JWT always carries the email)
    if (req.user.email) {
      const realDoctor = await Doctor.findOne({ email: req.user.email });
      if (realDoctor && !doctorIds.some(id => id.equals(realDoctor._id))) {
        doctorIds.push(realDoctor._id);
      }
    }

    // 3. Fallback: if we still have nothing, try the main clinic doctor
    if (doctorIds.length === 0) {
      const fallback = await Doctor.findOne({ email: 'doctor@homeopathway.com' }) || await Doctor.findOne();
      if (fallback) doctorIds.push(fallback._id);
    }

    const doctorFilter = { doctorId: { $in: doctorIds } };

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
      Appointment.countDocuments({ ...doctorFilter, appointmentDate: { $gte: today, $lt: tomorrow } }),
      Visit.countDocuments({ ...doctorFilter, followUpStatus: 'Pending', followUpDate: { $lte: new Date() } }),
      Appointment.countDocuments({ ...doctorFilter, type: 'Video', appointmentDate: { $gte: new Date() }, status: { $in: ['Pending', 'Confirmed'] } }),
      Patient.find({ isDeleted: false }).sort({ createdAt: -1 }).limit(5).select('firstName lastName phone lastVisitDate status patientId'),
      Appointment.find({ ...doctorFilter, appointmentDate: { $gte: today }, status: { $in: ['Pending', 'Confirmed'] } })
        .populate('patientId', 'firstName lastName phone')
        .sort({ appointmentDate: 1, appointmentTime: 1 })
        .limit(10),
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
