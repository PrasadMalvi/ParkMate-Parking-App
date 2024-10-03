const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  registrationNumber: {
    type: String,
    required: true,
  },
  ownerName: {
    type: String,
    required: true,
  },
  model: {
    type: String,
    required: true,
  },
  registrationDate: {
    type: Date,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  vehicleType: {
    type: String, // Change this to String
    enum: ["two-wheeler", "three-wheeler", "four-wheeler"], // Define valid values
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  engineNumber: {
    type: String,
    required: true,
  },
});

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

module.exports = Vehicle;
