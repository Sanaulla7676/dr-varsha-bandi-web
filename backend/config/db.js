const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Use MONGODB_URI from env, fall back to direct connection string
    const uri = process.env.MONGODB_URI;
    const conn = await mongoose.connect(uri, { family: 4 });
    console.log(`✅ MongoDB Connected: ${conn.connection.host} → DB: ${conn.connection.db.databaseName}`);
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('⚠️  Running in mock mode (no database)');
  }
};

module.exports = connectDB;
