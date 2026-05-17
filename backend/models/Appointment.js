const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  appointmentDate: { type: Date, required: true },
  appointmentTime: { type: String, required: true },
  duration: { type: Number, default: 30 }, // in minutes
  type: { type: String, enum: ['In-Person', 'Video', 'Follow-Up'], default: 'In-Person' },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
  notes: { type: String },
  googleMeetLink: { type: String },
  googleCalendarEventId: { type: String },
  videoRoomId: { type: String }, // Legacy, keep for backward compatibility
  reminderSent: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
