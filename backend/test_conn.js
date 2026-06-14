const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');

const uri = "mongodb+srv://sanaullaa19_db_user:Suhail%4008@cluster0.pzskqem.mongodb.net/mefy_production?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(uri)
  .then(() => {
    console.log("SUCCESSfully connected to MongoDB");
    process.exit(0);
  })
  .catch(err => {
    console.error("Connection error:", err);
    process.exit(1);
  });
