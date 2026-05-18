const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const Patient = require('../models/Patient');
const { authenticateToken, auditLog } = require('../middleware/auth');
const { createMeetEvent } = require('../services/googleCalendar');

// GET /api/appointments
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { date, status, type } = req.query;
    const query = { doctorId: req.user.id };

    if (date) {
      const d = new Date(date);
      const nextDay = new Date(d);
      nextDay.setDate(d.getDate() + 1);
      query.appointmentDate = { $gte: d, $lt: nextDay };
    }
    if (status) query.status = status;
    if (type) query.type = type;

    const appointments = await Appointment.find(query)
      .populate('patientId', 'firstName lastName phone patientId')
      .sort({ appointmentDate: 1, appointmentTime: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/appointments/today
router.get('/today', authenticateToken, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const appointments = await Appointment.find({
      doctorId: req.user.id,
      appointmentDate: { $gte: today, $lt: tomorrow },
    }).populate('patientId', 'firstName lastName phone patientId').sort({ appointmentTime: 1 });

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/appointments
router.post('/', authenticateToken, auditLog('Appointment Created', 'Appointment'), async (req, res) => {
  try {
    const { patientId, appointmentDate, appointmentTime, type, notes } = req.body;
    const doctor = await Doctor.findById(req.user.id);
    const patient = await Patient.findById(patientId);

    let googleMeetLink = null;
    let googleCalendarEventId = null;

    if (type === 'Video' && doctor.googleTokens && doctor.googleTokens.refresh_token) {
      try {
        const meetData = await createMeetEvent(doctor.googleTokens, {
          patientName: `${patient.firstName} ${patient.lastName}`,
          appointmentDate,
          appointmentTime,
          notes
        });
        googleMeetLink = meetData.meetLink;
        googleCalendarEventId = meetData.eventId;
      } catch (err) {
        console.error('Google Meet creation failed:', err.message);
        // Continue even if meet creation fails, but maybe flag it
      }
    }

    // Legacy fallback for videoRoomId
    let videoRoomId = null;
    if (type === 'Video' && !googleMeetLink) {
      videoRoomId = `hp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    const appointment = await Appointment.create({
      ...req.body,
      doctorId: req.user.id,
      googleMeetLink,
      googleCalendarEventId,
      videoRoomId
    });

    const populated = await appointment.populate('patientId', 'firstName lastName phone');
    res.status(201).json(populated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT /api/appointments/:id
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('patientId', 'firstName lastName phone');
    if (!appointment) return res.status(404).json({ message: 'Appointment not found' });
    res.json(appointment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE /api/appointments/:id
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Appointment deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
