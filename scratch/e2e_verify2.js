// e2e_verify2.js – ES module version
import mongoose from 'mongoose';
import fetch from 'node-fetch';
import Appointment from './backend/models/Appointment.js';

// Build the same URI logic as db.js
const envUri = process.env.MONGODB_URI;
const primaryUri = "mongodb+srv://sanaullaa19_db_user:Suhail%4008@ac-hakzppl-shard-00-01.pzskqem.mongodb.net/mefy_production?retryWrites=true&w=majority";
let urisToTry = [];
if (envUri) {
  if (envUri.includes('sanaulla7676') || envUri.startsWith('mongodb+srv://')) {
    urisToTry = [primaryUri, envUri];
  } else {
    urisToTry = [envUri, primaryUri];
  }
} else {
  urisToTry = [primaryUri];
}
const uri = urisToTry[0];

// Mask password for display
const masked = uri.replace(/(mongodb(?:\+srv)?:\/\/[^:]+:)([^@]+)@/, (m, p1) => p1 + '****@');
console.log('Mongo URI (masked):', masked);

await mongoose.connect(uri, { family: 4, serverSelectionTimeoutMS: 5000 });
console.log('mongoose.connection.host =', mongoose.connection.host);
console.log('mongoose.connection.name =', mongoose.connection.name);
console.log('mongoose.connection.readyState =', mongoose.connection.readyState);

const admin = await mongoose.connection.db.admin().command({ hello: 1 });
console.log('admin hello:', {
  isWritablePrimary: admin.isWritablePrimary,
  primary: admin.primary,
  setName: admin.setName
});

const countBefore = await Appointment.countDocuments();
console.log('appointments count before =', countBefore);

// Perform booking via public endpoint
const bookRes = await fetch('http://localhost:5000/api/public/book', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'gogomaster',
    email: 'gogo@example.com',
    phone: '9999999999',
    service: 'Video',
    date: '2026-07-01',
    timeSlot: '10:00 AM',
    fee: 'Standard'
  })
});
console.log('Booking HTTP status =', bookRes.status);
const bookBody = await bookRes.json();
console.log('Booking response body =', bookBody);

const countAfter = await Appointment.countDocuments();
console.log('appointments count after =', countAfter);

if (bookBody.success && bookBody.appointmentId) {
  await Appointment.deleteOne({ _id: bookBody.appointmentId });
  console.log('Deleted test appointment', bookBody.appointmentId);
}

await mongoose.disconnect();
