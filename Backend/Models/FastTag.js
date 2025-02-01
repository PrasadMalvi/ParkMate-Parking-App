const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the FastTag schema
const FastTagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensures each FastTag has a unique name
  },
  location: {
    latitude: { type: Number, required: true }, // Latitude of the FastTag location
    longitude: { type: Number, required: true }, // Longitude of the FastTag location
  },
  registrationNumber: {
    type: String,
    unique: true, // System-generated unique registration number
  },
  price: {
    type: Number,
    required: true, // Price for the FastTag
  },
  balance: {
    type: Number,
    default: 0, // Default balance set to 0
  },
  address: {
    type: String,
    required: true, // Ensure address is provided
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set the creation date
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically set the update date
  },
});

// Middleware to generate registration number
FastTagSchema.pre("save", function (next) {
  if (!this.registrationNumber) {
    // Generate a unique registration number if not provided
    this.registrationNumber = `REG-${Math.random()
      .toString(36)
      .substring(2, 10)
      .toUpperCase()}`;
  }
  next();
});

// Middleware to update the updatedAt field before saving
FastTagSchema.pre("save", function (next) {
  this.updatedAt = Date.now(); // Set updatedAt to the current date
  next();
});

// Create and export the FastTag model
const FastTag = mongoose.model("FastTag", FastTagSchema);
module.exports = FastTag;
