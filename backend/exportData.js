const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Patient = require('./models/Patient');
const Visit = require('./models/Visit');
const Appointment = require('./models/Appointment');
const Doctor = require('./models/Doctor');

const exportData = async () => {
  try {
    console.log('🔄 Connecting to the Homeopathway database...');
    // Connect using the same logic as the main server
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/homeopathway');
    console.log('✅ Connected successfully!\n');

    console.log('📦 Gathering clinical data...');
    const patients = await Patient.find({});
    const visits = await Visit.find({});
    const appointments = await Appointment.find({});
    const doctors = await Doctor.find({});

    console.log(`   Found ${patients.length} patients`);
    console.log(`   Found ${visits.length} clinical visits/notes`);
    console.log(`   Found ${appointments.length} appointments`);

    const backupData = {
      metadata: {
        exportDate: new Date().toISOString(),
        system: "Homeopathway Clinic Management System",
        version: "1.0"
      },
      data: {
        doctors,
        patients,
        visits,
        appointments
      }
    };

    // Save directly to the user's Desktop
    const desktopPath = path.join(require('os').homedir(), 'Desktop', 'Homeopathway_Backup.json');
    
    console.log('\n💾 Writing data to file...');
    fs.writeFileSync(desktopPath, JSON.stringify(backupData, null, 2));

    console.log(`\n🎉 Backup successfully created!`);
    console.log(`📍 File Location: ${desktopPath}`);
    console.log('\n👉 You can now drag and drop "Homeopathway_Backup.json" from your Desktop onto your pendrive.');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Failed to export data:', error.message);
    process.exit(1);
  }
};

exportData();
