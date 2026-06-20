const mongoose = require('mongoose');

const connectDB = async () => {
  // Use the standard replica‑set URI so the driver can discover the primary.
  const primaryUri = "mongodb+srv://sanaullaa19_db_user:Suhail%4008@ac-hakzppl.pzskqem.mongodb.net/mefy_production?retryWrites=true&w=majority";
  const envUri = process.env.MONGODB_URI;

  // Build a list of connection URIs to try.
  // If the env URI contains the old/incorrect username "sanaulla7676", we try the working direct connection first.
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

  for (const uri of urisToTry) {
    try {
      console.log(`Attempting MongoDB connection...`);
      // Use 5 second timeout to fail-fast and try the fallback
      const conn = await mongoose.connect(uri, { 
        family: 4, 
        serverSelectionTimeoutMS: 5000 
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host} → DB: ${conn.connection.db.databaseName}`);
      return; // Connection succeeded, exit function
    } catch (err) {
      const maskedUri = uri.replace(/:([^@]+)@/, ':****@');
      console.error(`❌ MongoDB Connection failed for: ${maskedUri}. Error: ${err.message}`);
    }
  }

  console.warn('⚠️ All MongoDB connection attempts failed. Running in mock mode (no database).');
};

module.exports = connectDB;
