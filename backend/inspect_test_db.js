const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');

// No database name specified - will use default database (test)
const uri = "mongodb+srv://sanaullaa19_db_user:Suhail%4008@cluster0.pzskqem.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

async function inspect() {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");

  const dbName = mongoose.connection.db.databaseName;
  console.log("Connected database name:", dbName);

  const doctors = await Doctor.find({});
  console.log("\n--- Doctors ---");
  doctors.forEach(d => console.log(`ID: ${d._id}, Name: ${d.name}, Email: ${d.email}`));

  const patients = await Patient.find({});
  console.log(`\nTotal Patients: ${patients.length}`);

  const appointments = await Appointment.find({});
  console.log(`\nTotal Appointments: ${appointments.length}`);

  process.exit(0);
}

inspect().catch(err => {
  console.error(err);
  process.exit(1);
});
