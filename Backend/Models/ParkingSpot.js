const mongoose = require("mongoose");

const parkingSpotSchema = new mongoose.Schema(
  {
    locationName: { type: String, required: true },
    spotNumber: { type: Number, unique: true },
    fullAddress: { type: String, required: true },
    vehicleTypes: [
      {
        type: {
          type: String,
          required: true,
          enum: ["two-wheeler", "four-wheeler", "other"],
        },
      },
    ],
    isAvailable: { type: Boolean, default: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    timeSlots: [
      {
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        isBooked: { type: Boolean, default: false },
        maxSlots: {
          twoWheeler: { type: Number, required: true },
          fourWheeler: { type: Number, required: true },
          other: { type: Number, required: true },
        },
      },
    ],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// Pre-save hook to generate a unique spotNumber automatically
parkingSpotSchema.pre("save", async function (next) {
  if (!this.spotNumber) {
    const lastSpot = await mongoose
      .model("ParkingSpot")
      .findOne()
      .sort({ spotNumber: -1 });
    this.spotNumber = lastSpot ? lastSpot.spotNumber + 1 : 1; // Increment the last spot number
  }
  next();
});

const ParkingSpot = mongoose.model("ParkingSpot", parkingSpotSchema);
module.exports = ParkingSpot;
