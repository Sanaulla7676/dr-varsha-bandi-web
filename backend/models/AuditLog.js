const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor' },
  action: { type: String, required: true },
  entity: { type: String }, // 'Patient', 'Visit', 'Appointment', etc.
  entityId: { type: mongoose.Schema.Types.ObjectId },
  details: { type: String },
  ip: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('AuditLog', auditLogSchema);
