const mongoose = require('mongoose');

const connectDB = async () => {

  try {
    const uri = 'mongodb+srv://sanaulla7676:Suhail%4008@cluster0.pzskqem.mongodb.net/mefy_production?appName=Cluster0';
    const conn = await mongoose.connect(uri);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('⚠️  Running in mock mode (no database)');
  }
};

module.exports = connectDB;
