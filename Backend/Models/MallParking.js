// models/MallParking.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PricingSchema = new Schema({
  duration: { type: Number, required: true }, // Duration in minutes
  price: { type: Number, required: true }, // Price for the duration
});

const MallParkingSchema = new Schema({
  name: { type: String, required: true },
  location: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  address: { type: String, required: true },
  qrCode: { type: String }, // Optional: Generated QR Code for the mall
  pricing: [PricingSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const MallParking = mongoose.model("MallParking", MallParkingSchema);
module.exports = MallParking;
