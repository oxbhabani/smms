// Mongoose lets us connect to and interact with MongoDB
const mongoose = require('mongoose');

// Connect to the MongoDB database using the URI stored in environment variables
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log the error and stop the app if connection fails
    console.error(`MongoDB connection error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
