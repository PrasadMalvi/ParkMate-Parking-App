// Models/MallParking.js
const mongoose = require("mongoose");

const MallParkingSchema = new mongoose.Schema({
  mallName: {
    type: String,
    required: true,
  },
  entryQRCode: {
    type: String,
    required: true,
  },
  exitQRCode: {
    type: String,
    required: true,
  },
  pricing: {
    type: Number,
    required: true,
    default: 10, // Default price per 30 minutes
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("MallParking", MallParkingSchema);
