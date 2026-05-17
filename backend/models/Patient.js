const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
  patientId: { type: String, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  dateOfBirth: { type: Date },
  age: { type: Number },
  address: { type: String },
  occupation: { type: String },
  bloodGroup: { type: String },
  photo: { type: String },
  status: { type: String, enum: ['Active', 'Inactive', 'Completed'], default: 'Active' },
  firstVisitDate: { type: Date, default: Date.now },
  lastVisitDate: { type: Date },
  isDeleted: { type: Boolean, default: false },
  deletedAt: { type: Date },
}, { timestamps: true });

// Auto-generate patient ID
patientSchema.pre('save', async function(next) {
  if (!this.patientId) {
    const count = await mongoose.model('Patient').countDocuments();
    this.patientId = `HP${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

patientSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model('Patient', patientSchema);
