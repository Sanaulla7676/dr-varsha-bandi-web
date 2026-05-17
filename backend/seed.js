require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Doctor = require('./models/Doctor');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const email = 'doctor@homeopathway.com';
    const existing = await Doctor.findOne({ email });

    if (existing) {
      console.log('Doctor already exists, updating password...');
      existing.password = await bcrypt.hash('doctor123', 10);
      await existing.save();
    } else {
      console.log('Creating demo doctor...');
      const hashedPassword = await bcrypt.hash('doctor123', 10);
      await Doctor.create({
        name: 'Dr. Varsha Bandi',
        email,
        password: hashedPassword,
        clinicName: 'Homeopathway Clinic',
        specialization: 'Homeopathy'
      });
    }

    console.log('Seeding complete');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
}

seed();
