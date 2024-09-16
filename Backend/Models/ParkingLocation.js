const mongoose = require("mongoose");

const parkingLocationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId, // Reference to the User model
    ref: "User",
    required: true,
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const ParkingLocation = mongoose.model(
  "ParkingLocation",
  parkingLocationSchema
);

module.exports = ParkingLocation;
