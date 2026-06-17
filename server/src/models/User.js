// Mongoose helps define the structure (schema) of our data
const mongoose = require('mongoose');

// Define what a User looks like in the database
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'], // Every user must have a name
      trim: true, // Removes extra spaces from start and end
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // No two users can share the same email
      lowercase: true, // Automatically converts email to lowercase
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'], // Stores the hashed (scrambled) password
    },
    role: {
      type: String,
      enum: ['Admin', 'Technician'], // User can only be Admin or Technician
      default: 'Technician', // New users start as Technician by default
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Create and export the User model so other files can use it
module.exports = mongoose.model('User', userSchema);
