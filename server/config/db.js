const mongoose = require('mongoose');
require('dotenv').config()


const tempConnectionString = process.env.MONGO_URI; 



const connectDB = async () => {
  try {
    await mongoose.connect(tempConnectionString, {
        
    });
    console.log('✅ MongoDB connected successfully! (using temporary string)');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1); 
  }
};

module.exports = connectDB;