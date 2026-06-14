const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const Doctor = require('./models/Doctor');
const Patient = require('./models/Patient');
const Appointment = require('./models/Appointment');

const uri = "mongodb+srv://sanaullaa19_db_user:Suhail%4008@cluster0.pzskqem.mongodb.net/mefy_production?retryWrites=true&w=majority&appName=Cluster0";

async function inspect() {
  await mongoose.connect(uri);
  console.log("Connected to MongoDB.");

  const doctors = await Doctor.find({});
  console.log("\n--- Doctors ---");
  doctors.forEach(d => console.log(`ID: ${d._id}, Name: ${d.name}, Email: ${d.email}`));

  const patients = await Patient.find({});
  console.log(`\nTotal Patients: ${patients.length}`);
  if (patients.length > 0) {
    console.log("Sample Patients:");
    patients.slice(0, 5).forEach(p => console.log(`ID: ${p._id}, Name: ${p.firstName} ${p.lastName}, Email: ${p.email}, DoctorId: ${p.doctorId}`));
  }

  const appointments = await Appointment.find({});
  console.log(`\nTotal Appointments: ${appointments.length}`);
  if (appointments.length > 0) {
    console.log("Sample Appointments:");
    appointments.slice(0, 5).forEach(a => console.log(`ID: ${a._id}, PatientId: ${a.patientId}, DoctorId: ${a.doctorId}, Date: ${a.appointmentDate}, Status: ${a.status}`));
  }

  process.exit(0);
}

inspect().catch(err => {
  console.error(err);
  process.exit(1);
});
