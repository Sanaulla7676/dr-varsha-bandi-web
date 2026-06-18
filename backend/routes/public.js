const express = require('express');
const router = express.Router();
const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');

// POST /api/public/book - Public appointment booking from website
router.post('/book', async (req, res) => {
  try {
    console.log('Incoming public booking request:', req.body);
    const { name, email, phone, service, date, timeSlot, fee } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: 'Missing required contact information.' });
    }

    // 1. Resolve Doctor (Try to find the main doctor)
    let doctor = await Doctor.findOne({ email: 'doctor@homeopathway.com' }); 
    if (!doctor) doctor = await Doctor.findOne(); // Fallback to any doctor
    
    if (!doctor) {
      console.error('CRITICAL: No doctor found in the database to assign the appointment to.');
      return res.status(500).json({ success: false, message: 'Clinic system not fully initialized. Please contact support.' });
    }

    // 2. Find or create patient
    let patient = await Patient.findOne({ $or: [{ email }, { phone }] });
    
    if (!patient) {
      console.log('New patient detected, creating profile for:', name);
      const names = name.trim().split(' ');
      const firstName = names[0];
      const lastName = names.slice(1).join(' ') || 'Patient';
      
      patient = await Patient.create({
        firstName,
        lastName,
        email,
        phone,
        status: 'Active',
        source: 'Website',
        doctorId: doctor._id
      });
    }

    // 3. Create Appointment (Status: Pending)
    const appointmentDate = new Date(date);
    if (isNaN(appointmentDate.getTime())) {
      throw new Error(`Invalid date provided: ${date}`);
    }

    const appointment = await Appointment.create({
      patientId: patient._id,
      doctorId: doctor._id,
      appointmentDate,
      appointmentTime: timeSlot,
      type: (service && service.includes('Video')) ? 'Video' : 'In-Person',
      status: 'Pending',
      notes: `Booked via website. Service: ${service || 'Not specified'}. Fee: ${fee || 'Standard'}`,
    });

    console.log('Appointment created successfully:', appointment._id);

    // Broadcast the new appointment to the dashboard
    const io = req.app.get('socketio');
    if (io) {
      io.emit('appointment-booked', {
        appointmentId: appointment._id,
        patientName: name,
        date: appointmentDate.toLocaleDateString(),
        timeSlot
      });
    }

    res.status(201).json({
      success: true,
      message: 'Appointment requested successfully',
      appointmentId: appointment._id
    });
  } catch (err) {
    console.error('Public booking error detail:', err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// GET /api/public/doctor - Get public profile of the primary doctor
router.get('/doctor', async (req, res) => {
  try {
    let doctor = await Doctor.findOne({ email: 'doctor@homeopathway.com' }).select('name specialization clinicName clinicAddress phone profilePhoto');
    if (!doctor) doctor = await Doctor.findOne().select('name specialization clinicName clinicAddress phone profilePhoto');
    
    if (doctor) {
      res.json({ success: true, doctor });
    } else {
      res.status(404).json({ success: false, message: 'Doctor not found' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
