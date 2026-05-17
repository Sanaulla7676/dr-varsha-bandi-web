const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
  visitType: { type: String, enum: ['In-Person', 'Video', 'Follow-Up'], default: 'In-Person' },
  visitDate: { type: Date, default: Date.now },
  
  // Case Study Sections
  caseStudy: {
    chiefComplaints: { type: String, default: '' },
    duration: { type: String, default: '' },
    mentalSymptoms: { type: String, default: '' },
    physicalSymptoms: { type: String, default: '' },
    appetite: { type: String, default: '' },
    sleep: { type: String, default: '' },
    thirst: { type: String, default: '' },
    thermalReaction: { type: String, default: '' },
    medicalHistory: { type: String, default: '' },
    familyHistory: { type: String, default: '' },
    diagnosis: { type: String, default: '' },
    doctorNotes: { type: String, default: '' },
    followUpNotes: { type: String, default: '' },
  },

  // Prescriptions
  prescriptions: [{
    medicine: { type: String },
    potency: { type: String },
    dosage: { type: String },
    frequency: { type: String },
    duration: { type: String },
    notes: { type: String },
  }],

  // Reports attached
  reports: [{
    name: { type: String },
    url: { type: String },
    type: { type: String },
    uploadedAt: { type: Date, default: Date.now },
  }],

  status: { type: String, enum: ['Draft', 'Completed'], default: 'Draft' },
  followUpDate: { type: Date },
  followUpStatus: { type: String, enum: ['Pending', 'Completed', 'Missed'], default: 'Pending' },

  lastSavedAt: { type: Date, default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model('Visit', visitSchema);
